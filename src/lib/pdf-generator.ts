// src/lib/pdf-generator.ts
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, pdf } from '@react-pdf/renderer'
import { supabase } from './supabase'

// Certificate Template
export const CertificateTemplate = ({ 
  recipientName, 
  eventName, 
  eventDate, 
  certificateId 
}: {
  recipientName: string
  eventName: string
  eventDate: string
  certificateId: string
}) => (
  <Document>
    <Page size="A4" orientation="landscape" style={certificateStyles.page}>
      <View style={certificateStyles.container}>
        {/* Header */}
        <View style={certificateStyles.header}>
          <Text style={certificateStyles.title}>CERTIFICATE OF PARTICIPATION</Text>
          <Text style={certificateStyles.subtitle}>AcademiaPress Conference Series</Text>
        </View>

        {/* Main Content */}
        <View style={certificateStyles.content}>
          <Text style={certificateStyles.text}>This is to certify that</Text>
          <Text style={certificateStyles.recipientName}>{recipientName}</Text>
          <Text style={certificateStyles.text}>has successfully participated in</Text>
          <Text style={certificateStyles.eventName}>{eventName}</Text>
          <Text style={certificateStyles.text}>held on {eventDate}</Text>
        </View>

        {/* Footer */}
        <View style={certificateStyles.footer}>
          <View style={certificateStyles.signature}>
            <Text style={certificateStyles.signatureLine}>_____________________</Text>
            <Text style={certificateStyles.signatureText}>Conference Director</Text>
          </View>
          <View style={certificateStyles.certificateInfo}>
            <Text style={certificateStyles.certificateId}>Certificate ID: {certificateId}</Text>
            <Text style={certificateStyles.date}>Generated on: {new Date().toLocaleDateString()}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
)

// Invoice Template
export const InvoiceTemplate = ({ 
  invoiceData 
}: { 
  invoiceData: {
    invoiceNumber: string
    customerName: string
    customerEmail: string
    items: Array<{
      description: string
      amount: number
      quantity: number
    }>
    totalAmount: number
    paymentId: string
    date: string
  }
}) => (
  <Document>
    <Page size="A4" style={invoiceStyles.page}>
      <View style={invoiceStyles.container}>
        {/* Header */}
        <View style={invoiceStyles.header}>
          <Text style={invoiceStyles.companyName}>AcademiaPress</Text>
          <Text style={invoiceStyles.invoiceTitle}>INVOICE</Text>
        </View>

        {/* Invoice Info */}
        <View style={invoiceStyles.invoiceInfo}>
          <View style={invoiceStyles.leftColumn}>
            <Text style={invoiceStyles.label}>Bill To:</Text>
            <Text style={invoiceStyles.value}>{invoiceData.customerName}</Text>
            <Text style={invoiceStyles.value}>{invoiceData.customerEmail}</Text>
          </View>
          <View style={invoiceStyles.rightColumn}>
            <Text style={invoiceStyles.label}>Invoice #: {invoiceData.invoiceNumber}</Text>
            <Text style={invoiceStyles.label}>Date: {invoiceData.date}</Text>
            <Text style={invoiceStyles.label}>Payment ID: {invoiceData.paymentId}</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={invoiceStyles.table}>
          <View style={invoiceStyles.tableHeader}>
            <Text style={invoiceStyles.tableHeaderText}>Description</Text>
            <Text style={invoiceStyles.tableHeaderText}>Qty</Text>
            <Text style={invoiceStyles.tableHeaderText}>Amount</Text>
          </View>
          {invoiceData.items.map((item, index) => (
            <View key={index} style={invoiceStyles.tableRow}>
              <Text style={invoiceStyles.tableCell}>{item.description}</Text>
              <Text style={invoiceStyles.tableCell}>{item.quantity}</Text>
              <Text style={invoiceStyles.tableCell}>₹{item.amount.toLocaleString()}</Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={invoiceStyles.total}>
          <Text style={invoiceStyles.totalLabel}>Total Amount: ₹{invoiceData.totalAmount.toLocaleString()}</Text>
        </View>

        {/* Footer */}
        <View style={invoiceStyles.footer}>
          <Text style={invoiceStyles.footerText}>Thank you for using AcademiaPress!</Text>
          <Text style={invoiceStyles.footerText}>For support, contact: support@academiapress.com</Text>
        </View>
      </View>
    </Page>
  </Document>
)

// PDF Generation Functions
export async function generateCertificatePDF(eventRegistrationId: number) {
  try {
    // Get registration details
    const { data: registration, error } = await supabase
      .from('event_registrations')
      .select(`
        *,
        events(name, start_date),
        user_profiles(first_name, last_name)
      `)
      .eq('id', eventRegistrationId)
      .single()

    if (error || !registration) throw new Error('Registration not found')

    const certificateId = `CERT-${eventRegistrationId}-${Date.now()}`
    const recipientName = `${registration.user_profiles.first_name} ${registration.user_profiles.last_name}`
    const eventName = registration.events.name
    const eventDate = new Date(registration.events.start_date).toLocaleDateString()

    // Generate PDF
    const pdfBlob = await pdf(
      <CertificateTemplate
        recipientName={recipientName}
        eventName={eventName}
        eventDate={eventDate}
        certificateId={certificateId}
      />
    ).toBlob()

    // Upload to Supabase Storage
    const fileName = `certificates/${certificateId}.pdf`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, pdfBlob)

    if (uploadError) throw uploadError

    // Update registration with certificate URL
    await supabase
      .from('event_registrations')
      .update({ 
        certificate_url: fileName,
        certificate_generated_at: new Date().toISOString()
      })
      .eq('id', eventRegistrationId)

    return fileName
  } catch (error) {
    console.error('Certificate generation failed:', error)
    throw error
  }
}

export async function generateInvoicePDF(transactionId: number) {
  try {
    // Get transaction details
    const { data: transaction, error } = await supabase
      .from('transactions')
      .select(`
        *,
        user_profiles(first_name, last_name, email)
      `)
      .eq('id', transactionId)
      .single()

    if (error || !transaction) throw new Error('Transaction not found')

    const invoiceData = {
      invoiceNumber: `INV-${transactionId}`,
      customerName: `${transaction.user_profiles.first_name} ${transaction.user_profiles.last_name}`,
      customerEmail: transaction.user_profiles.email,
      items: [{
        description: transaction.transaction_type.replace('_', ' ').toUpperCase(),
        amount: transaction.amount,
        quantity: 1
      }],
      totalAmount: transaction.amount,
      paymentId: transaction.reference_id || 'N/A',
      date: new Date(transaction.created_at).toLocaleDateString()
    }

    // Generate PDF
    const pdfBlob = await pdf(<InvoiceTemplate invoiceData={invoiceData} />).toBlob()

    // Upload to Supabase Storage
    const fileName = `invoices/INV-${transactionId}.pdf`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, pdfBlob)

    if (uploadError) throw uploadError

    // Update transaction with invoice URL
    await supabase
      .from('transactions')
      .update({ 
        invoice_url: fileName,
        invoice_generated_at: new Date().toISOString()
      })
      .eq('id', transactionId)

    return fileName
  } catch (error) {
    console.error('Invoice generation failed:', error)
    throw error
  }
}

// Styles
const certificateStyles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '3px solid #002147',
    padding: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#002147',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
  },
  content: {
    alignItems: 'center',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 10,
  },
  recipientName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#002147',
    marginVertical: 20,
    textDecoration: 'underline',
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002147',
    marginVertical: 15,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'flex-end',
  },
  signature: {
    alignItems: 'center',
  },
  signatureLine: {
    fontSize: 16,
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 12,
    color: '#666666',
  },
  certificateInfo: {
    alignItems: 'flex-end',
  },
  certificateId: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 5,
  },
  date: {
    fontSize: 10,
    color: '#666666',
  },
})

const invoiceStyles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    borderBottom: '2px solid #002147',
    paddingBottom: 20,
  },
  companyName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#002147',
  },
  invoiceTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#002147',
  },
  invoiceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  leftColumn: {
    width: '50%',
  },
  rightColumn: {
    width: '40%',
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  value: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  table: {
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderBottom: '1px solid #002147',
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#002147',
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottom: '1px solid #e2e8f0',
  },
  tableCell: {
    fontSize: 12,
    color: '#333333',
    flex: 1,
  },
  total: {
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002147',
    backgroundColor: '#f8fafc',
    padding: 10,
    border: '1px solid #002147',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    borderTop: '1px solid #e2e8f0',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 5,
  },
})
