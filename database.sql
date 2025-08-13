-- =============================================
-- ACADEMIAPRESS - COMPLETE DATABASE SCHEMA
-- Copy and paste this entire script into your Supabase SQL Editor
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. USER PROFILES & ROLES
-- =============================================

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    institution TEXT,
    department TEXT,
    role TEXT DEFAULT 'author' CHECK (role IN ('author', 'reviewer', 'editor', 'admin')),
    bio TEXT,
    avatar_url TEXT,
    orcid_id TEXT,
    research_interests TEXT[],
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================
-- 2. ARTICLE SUBMISSIONS
-- =============================================

CREATE TABLE IF NOT EXISTS article_submissions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    abstract TEXT,
    content TEXT,
    keywords TEXT[],
    field_of_study TEXT,
    submission_type TEXT DEFAULT 'research' CHECK (submission_type IN ('research', 'review', 'case_study', 'editorial')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'revision_required', 'accepted', 'rejected', 'published')),
    file_url TEXT,
    file_type TEXT,
    file_size INTEGER,
    word_count INTEGER,
    page_count INTEGER,
    language TEXT DEFAULT 'en',
    submitted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    published_at TIMESTAMPTZ,
    doi TEXT UNIQUE,
    citation_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================
-- 3. PEER REVIEW SYSTEM
-- =============================================

CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    submission_id BIGINT REFERENCES article_submissions(id) ON DELETE CASCADE NOT NULL,
    reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    editor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    overall_score INTEGER CHECK (overall_score >= 1 AND overall_score <= 10),
    originality_score INTEGER CHECK (originality_score >= 1 AND originality_score <= 10),
    methodology_score INTEGER CHECK (methodology_score >= 1 AND methodology_score <= 10),
    clarity_score INTEGER CHECK (clarity_score >= 1 AND clarity_score <= 10),
    significance_score INTEGER CHECK (significance_score >= 1 AND significance_score <= 10),
    comments TEXT,
    private_comments TEXT, -- For editor only
    recommendation TEXT CHECK (recommendation IN ('accept', 'minor_revision', 'major_revision', 'reject')) NOT NULL,
    review_status TEXT DEFAULT 'pending' CHECK (review_status IN ('pending', 'in_progress', 'completed', 'overdue')),
    due_date TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(submission_id, reviewer_id)
);

-- =============================================
-- 4. CONFERENCES & EVENTS
-- =============================================

CREATE TABLE IF NOT EXISTS conferences (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT NOT NULL,
    description TEXT,
    organizer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type TEXT DEFAULT 'conference' CHECK (event_type IN ('conference', 'workshop', 'seminar', 'symposium')),
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    location TEXT,
    venue TEXT,
    city TEXT,
    country TEXT,
    is_virtual BOOLEAN DEFAULT FALSE,
    meeting_url TEXT,
    registration_fee DECIMAL(10,2) DEFAULT 0,
    early_bird_fee DECIMAL(10,2),
    early_bird_deadline TIMESTAMPTZ,
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    website_url TEXT,
    contact_email TEXT,
    tags TEXT[],
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CHECK (end_date > start_date)
);

-- =============================================
-- 5. CONFERENCE REGISTRATIONS
-- =============================================

CREATE TABLE IF NOT EXISTS conference_registrations (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    conference_id BIGINT REFERENCES conferences(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    registration_type TEXT DEFAULT 'attendee' CHECK (registration_type IN ('attendee', 'speaker', 'organizer', 'sponsor')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_amount DECIMAL(10,2),
    payment_reference TEXT,
    special_requirements TEXT,
    dietary_preferences TEXT,
    certificate_issued BOOLEAN DEFAULT FALSE,
    certificate_url TEXT,
    registered_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(conference_id, user_id)
);

-- =============================================
-- 6. PLAGIARISM DETECTION
-- =============================================

CREATE TABLE IF NOT EXISTS plagiarism_checks (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    submission_id BIGINT REFERENCES article_submissions(id) ON DELETE CASCADE NOT NULL,
    similarity_score DECIMAL(5,2) CHECK (similarity_score >= 0 AND similarity_score <= 100),
    sources_found TEXT[], -- Array of URLs/sources
    flagged_content JSONB, -- JSON object with flagged text portions
    check_status TEXT DEFAULT 'pending' CHECK (check_status IN ('pending', 'in_progress', 'completed', 'error')),
    check_method TEXT DEFAULT 'automated' CHECK (check_method IN ('automated', 'manual', 'hybrid')),
    detailed_report_url TEXT,
    checked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    checked_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================
-- 7. MESSAGING SYSTEM
-- =============================================

CREATE TABLE IF NOT EXISTS messages (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    submission_id BIGINT REFERENCES article_submissions(id) ON DELETE CASCADE,
    conference_id BIGINT REFERENCES conferences(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    message_type TEXT DEFAULT 'general' CHECK (message_type IN ('general', 'review_request', 'revision_request', 'acceptance', 'rejection', 'conference_info')),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    parent_message_id BIGINT REFERENCES messages(id) ON DELETE SET NULL,
    attachments JSONB, -- JSON array of file URLs
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CHECK ((submission_id IS NOT NULL AND conference_id IS NULL) OR (submission_id IS NULL AND conference_id IS NOT NULL) OR (submission_id IS NULL AND conference_id IS NULL))
);

-- =============================================
-- 8. FILE VERSIONS (Manuscript Tracking)
-- =============================================

CREATE TABLE IF NOT EXISTS file_versions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    submission_id BIGINT REFERENCES article_submissions(id) ON DELETE CASCADE NOT NULL,
    version_number INTEGER NOT NULL,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT,
    upload_notes TEXT,
    changelog TEXT,
    is_current BOOLEAN DEFAULT FALSE,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(submission_id, version_number)
);

-- =============================================
-- 9. FINANCIAL TRANSACTIONS
-- =============================================

CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    submission_id BIGINT REFERENCES article_submissions(id) ON DELETE SET NULL,
    conference_id BIGINT REFERENCES conferences(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD' CHECK (LENGTH(currency) = 3),
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('publication_fee', 'conference_registration', 'processing_fee', 'refund')),
    payment_method TEXT CHECK (payment_method IN ('credit_card', 'paypal', 'bank_transfer', 'other')),
    payment_gateway TEXT,
    gateway_transaction_id TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
    reference_id TEXT UNIQUE,
    invoice_number TEXT,
    invoice_url TEXT,
    description TEXT,
    metadata JSONB,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================
-- 10. ANALYTICS & TRACKING
-- =============================================

CREATE TABLE IF NOT EXISTS analytics_events (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_type TEXT NOT NULL CHECK (event_type IN ('view', 'download', 'submission', 'registration', 'search', 'citation', 'share')),
    entity_type TEXT CHECK (entity_type IN ('submission', 'conference', 'user', 'review')),
    entity_id BIGINT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================
-- 11. CITATIONS & REFERENCES
-- =============================================

CREATE TABLE IF NOT EXISTS citations (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    citing_submission_id BIGINT REFERENCES article_submissions(id) ON DELETE CASCADE NOT NULL,
    cited_submission_id BIGINT REFERENCES article_submissions(id) ON DELETE CASCADE,
    external_reference TEXT, -- For external papers not in the system
    citation_text TEXT,
    citation_context TEXT,
    page_number INTEGER,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CHECK ((cited_submission_id IS NOT NULL AND external_reference IS NULL) OR (cited_submission_id IS NULL AND external_reference IS NOT NULL))
);

-- =============================================
-- 12. COLLABORATIONS & CO-AUTHORS
-- =============================================

CREATE TABLE IF NOT EXISTS collaborations (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    submission_id BIGINT REFERENCES article_submissions(id) ON DELETE CASCADE NOT NULL,
    collaborator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'co_author' CHECK (role IN ('co_author', 'contributor', 'advisor', 'supervisor')),
    contribution_percentage DECIMAL(5,2) CHECK (contribution_percentage >= 0 AND contribution_percentage <= 100),
    author_order INTEGER CHECK (author_order > 0),
    is_corresponding_author BOOLEAN DEFAULT FALSE,
    contribution_description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    invited_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    responded_at TIMESTAMPTZ,
    UNIQUE(submission_id, collaborator_id)
);

-- =============================================
-- 13. NOTIFICATIONS
-- =============================================

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT DEFAULT 'info' CHECK (notification_type IN ('info', 'success', 'warning', 'error')),
    entity_type TEXT CHECK (entity_type IN ('submission', 'conference', 'review', 'message', 'payment')),
    entity_id BIGINT,
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================
-- 14. ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE conferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE conference_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE plagiarism_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 15. ROW LEVEL SECURITY POLICIES
-- =============================================

-- User Profiles Policies
CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Article Submissions Policies
CREATE POLICY "Users can view published submissions" ON article_submissions FOR SELECT USING (
    status = 'published' OR author_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM reviews WHERE submission_id = article_submissions.id AND reviewer_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM collaborations WHERE submission_id = article_submissions.id AND collaborator_id = auth.uid())
);
CREATE POLICY "Authors can insert own submissions" ON article_submissions FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own submissions" ON article_submissions FOR UPDATE USING (
    auth.uid() = author_id OR 
    EXISTS (SELECT 1 FROM collaborations WHERE submission_id = article_submissions.id AND collaborator_id = auth.uid() AND status = 'accepted')
);

-- Reviews Policies
CREATE POLICY "Users can view reviews for their submissions or reviews they wrote" ON reviews FOR SELECT USING (
    reviewer_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM article_submissions WHERE id = submission_id AND author_id = auth.uid()) OR
    editor_id = auth.uid()
);
CREATE POLICY "Reviewers can insert reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Reviewers can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = reviewer_id OR auth.uid() = editor_id);

-- Conferences Policies
CREATE POLICY "Anyone can view published conferences" ON conferences FOR SELECT USING (true);
CREATE POLICY "Organizers can insert conferences" ON conferences FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Organizers can update own conferences" ON conferences FOR UPDATE USING (auth.uid() = organizer_id);

-- Conference Registrations Policies
CREATE POLICY "Users can view own registrations" ON conference_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can register for conferences" ON conference_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own registrations" ON conference_registrations FOR UPDATE USING (auth.uid() = user_id);

-- Plagiarism Checks Policies
CREATE POLICY "Users can view plagiarism checks for own submissions" ON plagiarism_checks FOR SELECT USING (
    EXISTS (SELECT 1 FROM article_submissions WHERE id = submission_id AND author_id = auth.uid())
);

-- Messages Policies
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Recipients can update message status" ON messages FOR UPDATE USING (auth.uid() = recipient_id);

-- File Versions Policies
CREATE POLICY "Users can view file versions for accessible submissions" ON file_versions FOR SELECT USING (
    EXISTS (SELECT 1 FROM article_submissions WHERE id = submission_id AND (author_id = auth.uid() OR status = 'published')) OR
    EXISTS (SELECT 1 FROM collaborations WHERE submission_id = file_versions.submission_id AND collaborator_id = auth.uid())
);
CREATE POLICY "Authors can manage file versions" ON file_versions FOR ALL USING (
    EXISTS (SELECT 1 FROM article_submissions WHERE id = submission_id AND author_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM collaborations WHERE submission_id = file_versions.submission_id AND collaborator_id = auth.uid() AND status = 'accepted')
);

-- Transactions Policies
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Analytics Events Policies
CREATE POLICY "Anyone can insert analytics events" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view aggregated analytics" ON analytics_events FOR SELECT USING (true);

-- Citations Policies
CREATE POLICY "Anyone can view citations" ON citations FOR SELECT USING (true);
CREATE POLICY "Authors can manage citations for own papers" ON citations FOR ALL USING (
    EXISTS (SELECT 1 FROM article_submissions WHERE id = citing_submission_id AND author_id = auth.uid())
);

-- Collaborations Policies
CREATE POLICY "Users can view collaborations for accessible submissions" ON collaborations FOR SELECT USING (
    auth.uid() = collaborator_id OR 
    EXISTS (SELECT 1 FROM article_submissions WHERE id = submission_id AND author_id = auth.uid())
);
CREATE POLICY "Authors can manage collaborations" ON collaborations FOR ALL USING (
    EXISTS (SELECT 1 FROM article_submissions WHERE id = submission_id AND author_id = auth.uid())
);
CREATE POLICY "Collaborators can respond to invitations" ON collaborations FOR UPDATE USING (auth.uid() = collaborator_id);

-- Notifications Policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- 16. FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_article_submissions_updated_at BEFORE UPDATE ON article_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conferences_updated_at BEFORE UPDATE ON conferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_profiles (id, first_name, last_name, email, avatar_url)
    VALUES (
        new.id,
        new.raw_user_meta_data->>'first_name',
        new.raw_user_meta_data->>'last_name',
        new.email,
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN new;
END;
$$ language plpgsql security definer;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update citation count
CREATE OR REPLACE FUNCTION update_citation_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.cited_submission_id IS NOT NULL THEN
        UPDATE article_submissions 
        SET citation_count = citation_count + 1 
        WHERE id = NEW.cited_submission_id;
    ELSIF TG_OP = 'DELETE' AND OLD.cited_submission_id IS NOT NULL THEN
        UPDATE article_submissions 
        SET citation_count = citation_count - 1 
        WHERE id = OLD.cited_submission_id;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for citation count updates
CREATE TRIGGER update_citation_count_trigger
    AFTER INSERT OR DELETE ON citations
    FOR EACH ROW EXECUTE FUNCTION update_citation_count();

-- =============================================
-- 17. INDEXES FOR PERFORMANCE
-- =============================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_institution ON user_profiles(institution);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Article submissions indexes
CREATE INDEX IF NOT EXISTS idx_article_submissions_author_id ON article_submissions(author_id);
CREATE INDEX IF NOT EXISTS idx_article_submissions_status ON article_submissions(status);
CREATE INDEX IF NOT EXISTS idx_article_submissions_field_of_study ON article_submissions(field_of_study);
CREATE INDEX IF NOT EXISTS idx_article_submissions_submitted_at ON article_submissions(submitted_at);
CREATE INDEX IF NOT EXISTS idx_article_submissions_published_at ON article_submissions(published_at);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_submission_id ON reviews(submission_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(review_status);

-- Conferences indexes
CREATE INDEX IF NOT EXISTS idx_conferences_start_date ON conferences(start_date);
CREATE INDEX IF NOT EXISTS idx_conferences_status ON conferences(status);
CREATE INDEX IF NOT EXISTS idx_conferences_organizer_id ON conferences(organizer_id);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_submission_id ON messages(submission_id);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);

-- =============================================
-- 18. SAMPLE DATA (OPTIONAL - FOR TESTING)
-- =============================================

-- Insert sample conference
INSERT INTO conferences (title, description, start_date, end_date, location, registration_fee, max_attendees) 
VALUES (
    'International Conference on Academic Publishing 2025',
    'Leading conference for academic publishing professionals and researchers.',
    '2025-09-15 09:00:00+00',
    '2025-09-17 18:00:00+00',
    'New York, USA',
    299.00,
    500
) ON CONFLICT DO NOTHING;

-- Enable realtime for specific tables (run this in Supabase dashboard)
-- ALTER PUBLICATION supabase_realtime ADD TABLE messages;
-- ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
-- ALTER PUBLICATION supabase_realtime ADD TABLE analytics_events;

-- =============================================
-- SCHEMA SETUP COMPLETE! 🎉
-- =============================================

-- Next steps:
-- 1. Go to Authentication > Settings in Supabase dashboard
-- 2. Enable email confirmations if needed
-- 3. Set up storage buckets for file uploads
-- 4. Configure your environment variables in your Next.js app
-- 5. Test the schema by creating a user and submitting data

SELECT 'AcademiaPress database schema setup completed successfully!' as status;
