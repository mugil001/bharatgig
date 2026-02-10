-- ============================================
-- BharatGig Complete Database Setup
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PART 1: CREATE TABLES
-- ============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'freelancer' CHECK (role IN ('client', 'freelancer', 'admin')),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Freelancer profiles
CREATE TABLE freelancer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  title TEXT,
  bio TEXT,
  hourly_rate DECIMAL(10, 2),
  availability TEXT,
  location TEXT,
  languages TEXT[] DEFAULT '{}',
  total_earnings DECIMAL(12, 2) DEFAULT 0,
  total_jobs INTEGER DEFAULT 0,
  success_rate DECIMAL(5, 2) DEFAULT 0,
  response_time INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client profiles
CREATE TABLE client_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  company_name TEXT,
  company_size TEXT,
  industry TEXT,
  total_spent DECIMAL(12, 2) DEFAULT 0,
  total_jobs_posted INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills taxonomy
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User skills (many-to-many)
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 5),
  years_of_experience INTEGER,
  UNIQUE(user_id, skill_id)
);

-- Portfolio items
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  project_url TEXT,
  technologies TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certifications
CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuing_organization TEXT,
  issue_date DATE,
  expiry_date DATE,
  credential_id TEXT,
  credential_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job categories
CREATE TABLE job_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  parent_id UUID REFERENCES job_categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES job_categories(id),
  budget_type TEXT NOT NULL CHECK (budget_type IN ('fixed', 'hourly')),
  budget_min DECIMAL(10, 2),
  budget_max DECIMAL(10, 2),
  duration TEXT,
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'expert')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'closed', 'cancelled')),
  proposals_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job required skills
CREATE TABLE job_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE(job_id, skill_id)
);

-- Job attachments
CREATE TABLE job_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved jobs
CREATE TABLE saved_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Job invitations
CREATE TABLE job_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  freelancer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proposals
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  freelancer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  cover_letter TEXT NOT NULL,
  proposed_budget DECIMAL(10, 2) NOT NULL,
  proposed_duration TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, freelancer_id)
);

-- Proposal attachments
CREATE TABLE proposal_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proposal templates
CREATE TABLE proposal_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects (accepted jobs)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  freelancer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  budget DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'disputed', 'cancelled')),
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Milestones
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  due_date TIMESTAMPTZ,
  is_paid BOOLEAN DEFAULT FALSE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contracts
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  client_signed BOOLEAN DEFAULT FALSE,
  freelancer_signed BOOLEAN DEFAULT FALSE,
  client_signed_at TIMESTAMPTZ,
  freelancer_signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Time tracking
CREATE TABLE time_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  freelancer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  description TEXT,
  hours DECIMAL(5, 2) NOT NULL,
  date DATE NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  participant_2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_1_id, participant_2_id)
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Message attachments
CREATE TABLE message_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'monthly', 'yearly')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  razorpay_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('subscription', 'escrow_deposit', 'escrow_release', 'refund', 'platform_fee')),
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Escrow accounts
CREATE TABLE escrow_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'held' CHECK (status IN ('held', 'released', 'refunded')),
  transaction_id UUID REFERENCES transactions(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  released_at TIMESTAMPTZ
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  due_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
  quality_rating INTEGER CHECK (quality_rating BETWEEN 1 AND 5),
  professionalism_rating INTEGER CHECK (professionalism_rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, reviewer_id)
);

-- Review responses
CREATE TABLE review_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  response TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disputes
CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  filed_by UUID REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'closed')),
  resolution TEXT,
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dispute evidence
CREATE TABLE dispute_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dispute_id UUID REFERENCES disputes(id) ON DELETE CASCADE,
  submitted_by UUID REFERENCES users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dispute messages
CREATE TABLE dispute_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dispute_id UUID REFERENCES disputes(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification preferences
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  email_new_messages BOOLEAN DEFAULT TRUE,
  email_new_proposals BOOLEAN DEFAULT TRUE,
  email_job_updates BOOLEAN DEFAULT TRUE,
  email_payment_updates BOOLEAN DEFAULT TRUE,
  email_marketing BOOLEAN DEFAULT FALSE,
  push_new_messages BOOLEAN DEFAULT TRUE,
  push_new_proposals BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email logs
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Search history
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  search_query TEXT NOT NULL,
  search_type TEXT CHECK (search_type IN ('jobs', 'freelancers')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved searches
CREATE TABLE saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  search_query TEXT NOT NULL,
  filters JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PART 2: CREATE INDEXES
-- ============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_jobs_client_id ON jobs(client_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_category_id ON jobs(category_id);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX idx_proposals_job_id ON proposals(job_id);
CREATE INDEX idx_proposals_freelancer_id ON proposals(freelancer_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_freelancer_id ON projects(freelancer_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);

-- ============================================
-- PART 3: CREATE TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_freelancer_profiles_updated_at BEFORE UPDATE ON freelancer_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_profiles_updated_at BEFORE UPDATE ON client_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON disputes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PART 4: ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE freelancer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PART 5: CREATE RLS POLICIES
-- ============================================

-- Users policies
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Freelancer profiles policies
CREATE POLICY "Anyone can view freelancer profiles" ON freelancer_profiles FOR SELECT USING (true);
CREATE POLICY "Freelancers can update own profile" ON freelancer_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Freelancers can insert own profile" ON freelancer_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Client profiles policies
CREATE POLICY "Anyone can view client profiles" ON client_profiles FOR SELECT USING (true);
CREATE POLICY "Clients can update own profile" ON client_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Clients can insert own profile" ON client_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Skills policies
CREATE POLICY "Anyone can view skills" ON skills FOR SELECT USING (true);

-- User skills policies
CREATE POLICY "Anyone can view user skills" ON user_skills FOR SELECT USING (true);
CREATE POLICY "Users can manage own skills" ON user_skills FOR ALL USING (auth.uid() = user_id);

-- Portfolio policies
CREATE POLICY "Anyone can view portfolios" ON portfolios FOR SELECT USING (true);
CREATE POLICY "Users can manage own portfolio" ON portfolios FOR ALL USING (auth.uid() = user_id);

-- Certifications policies
CREATE POLICY "Anyone can view certifications" ON certifications FOR SELECT USING (true);
CREATE POLICY "Users can manage own certifications" ON certifications FOR ALL USING (auth.uid() = user_id);

-- Job categories policies
CREATE POLICY "Anyone can view job categories" ON job_categories FOR SELECT USING (true);

-- Jobs policies
CREATE POLICY "Anyone can view open jobs" ON jobs FOR SELECT USING (true);
CREATE POLICY "Clients can create jobs" ON jobs FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Clients can update own jobs" ON jobs FOR UPDATE USING (auth.uid() = client_id);
CREATE POLICY "Clients can delete own jobs" ON jobs FOR DELETE USING (auth.uid() = client_id);

-- Job skills policies
CREATE POLICY "Anyone can view job skills" ON job_skills FOR SELECT USING (true);
CREATE POLICY "Job owners can manage job skills" ON job_skills FOR ALL USING (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_skills.job_id AND jobs.client_id = auth.uid())
);

-- Job attachments policies
CREATE POLICY "Anyone can view job attachments" ON job_attachments FOR SELECT USING (true);
CREATE POLICY "Job owners can manage attachments" ON job_attachments FOR ALL USING (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_attachments.job_id AND jobs.client_id = auth.uid())
);

-- Saved jobs policies
CREATE POLICY "Users can view own saved jobs" ON saved_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own saved jobs" ON saved_jobs FOR ALL USING (auth.uid() = user_id);

-- Job invitations policies
CREATE POLICY "Freelancers can view own invitations" ON job_invitations FOR SELECT USING (auth.uid() = freelancer_id);
CREATE POLICY "Clients can create invitations" ON job_invitations FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_invitations.job_id AND jobs.client_id = auth.uid())
);

-- Proposals policies
CREATE POLICY "Clients can view proposals for own jobs" ON proposals FOR SELECT USING (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = proposals.job_id AND jobs.client_id = auth.uid())
);
CREATE POLICY "Freelancers can view own proposals" ON proposals FOR SELECT USING (auth.uid() = freelancer_id);
CREATE POLICY "Freelancers can create proposals" ON proposals FOR INSERT WITH CHECK (auth.uid() = freelancer_id);
CREATE POLICY "Freelancers can update own proposals" ON proposals FOR UPDATE USING (auth.uid() = freelancer_id);

-- Proposal templates policies
CREATE POLICY "Users can manage own templates" ON proposal_templates FOR ALL USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Project participants can view" ON projects FOR SELECT USING (
  auth.uid() = client_id OR auth.uid() = freelancer_id
);
CREATE POLICY "Clients can create projects" ON projects FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Project participants can update" ON projects FOR UPDATE USING (
  auth.uid() = client_id OR auth.uid() = freelancer_id
);

-- Milestones policies
CREATE POLICY "Project participants can view milestones" ON milestones FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = milestones.project_id AND (projects.client_id = auth.uid() OR projects.freelancer_id = auth.uid()))
);
CREATE POLICY "Clients can manage milestones" ON milestones FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = milestones.project_id AND projects.client_id = auth.uid())
);

-- Contracts policies
CREATE POLICY "Project participants can view contracts" ON contracts FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = contracts.project_id AND (projects.client_id = auth.uid() OR projects.freelancer_id = auth.uid()))
);
CREATE POLICY "Project participants can sign contracts" ON contracts FOR UPDATE USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = contracts.project_id AND (projects.client_id = auth.uid() OR projects.freelancer_id = auth.uid()))
);

-- Time entries policies
CREATE POLICY "Project participants can view time entries" ON time_entries FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = time_entries.project_id AND (projects.client_id = auth.uid() OR projects.freelancer_id = auth.uid()))
);
CREATE POLICY "Freelancers can create time entries" ON time_entries FOR INSERT WITH CHECK (auth.uid() = freelancer_id);
CREATE POLICY "Freelancers can update own time entries" ON time_entries FOR UPDATE USING (auth.uid() = freelancer_id);

-- Conversations policies
CREATE POLICY "Participants can view conversations" ON conversations FOR SELECT USING (
  auth.uid() = participant_1_id OR auth.uid() = participant_2_id
);
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (
  auth.uid() = participant_1_id OR auth.uid() = participant_2_id
);

-- Messages policies
CREATE POLICY "Conversation participants can view messages" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id AND (conversations.participant_1_id = auth.uid() OR conversations.participant_2_id = auth.uid()))
);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own messages" ON messages FOR UPDATE USING (auth.uid() = sender_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own subscription" ON subscriptions FOR ALL USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for completed projects" ON reviews FOR INSERT WITH CHECK (
  auth.uid() = reviewer_id AND
  EXISTS (SELECT 1 FROM projects WHERE projects.id = reviews.project_id AND projects.status = 'completed' AND (projects.client_id = auth.uid() OR projects.freelancer_id = auth.uid()))
);

-- Review responses policies
CREATE POLICY "Anyone can view review responses" ON review_responses FOR SELECT USING (true);
CREATE POLICY "Reviewees can respond to reviews" ON review_responses FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM reviews WHERE reviews.id = review_responses.review_id AND reviews.reviewee_id = auth.uid())
);

-- Disputes policies
CREATE POLICY "Project participants can view disputes" ON disputes FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = disputes.project_id AND (projects.client_id = auth.uid() OR projects.freelancer_id = auth.uid()))
);
CREATE POLICY "Project participants can file disputes" ON disputes FOR INSERT WITH CHECK (
  auth.uid() = filed_by AND
  EXISTS (SELECT 1 FROM projects WHERE projects.id = disputes.project_id AND (projects.client_id = auth.uid() OR projects.freelancer_id = auth.uid()))
);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Notification preferences policies
CREATE POLICY "Users can manage own preferences" ON notification_preferences FOR ALL USING (auth.uid() = user_id);

-- Search history policies
CREATE POLICY "Users can view own search history" ON search_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create search history" ON search_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Saved searches policies
CREATE POLICY "Users can manage own saved searches" ON saved_searches FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- PART 6: SEED DATA
-- ============================================

-- Seed job categories
INSERT INTO job_categories (name, slug, description, icon) VALUES
('Web Development', 'web-development', 'Build websites and web applications', 'Code'),
('Mobile Development', 'mobile-development', 'Create iOS and Android apps', 'Smartphone'),
('Design & Creative', 'design-creative', 'Graphic design, UI/UX, and creative work', 'Palette'),
('Writing & Content', 'writing-content', 'Content writing, copywriting, and editing', 'PenTool'),
('Marketing & Sales', 'marketing-sales', 'Digital marketing and sales services', 'TrendingUp'),
('Data & Analytics', 'data-analytics', 'Data science and analytics', 'BarChart'),
('Video & Animation', 'video-animation', 'Video editing and animation', 'Video'),
('Business & Consulting', 'business-consulting', 'Business consulting and strategy', 'Briefcase'),
('Legal & Finance', 'legal-finance', 'Legal and financial services', 'Scale'),
('Translation', 'translation', 'Translation and localization', 'Languages');

-- Seed subcategories for Web Development
INSERT INTO job_categories (name, slug, description, parent_id) VALUES
('Frontend Development', 'frontend-development', 'React, Vue, Angular development', (SELECT id FROM job_categories WHERE slug = 'web-development')),
('Backend Development', 'backend-development', 'Node.js, Python, PHP development', (SELECT id FROM job_categories WHERE slug = 'web-development')),
('Full Stack Development', 'full-stack-development', 'Complete web application development', (SELECT id FROM job_categories WHERE slug = 'web-development')),
('WordPress Development', 'wordpress-development', 'WordPress themes and plugins', (SELECT id FROM job_categories WHERE slug = 'web-development')),
('E-commerce Development', 'ecommerce-development', 'Online store development', (SELECT id FROM job_categories WHERE slug = 'web-development'));

-- Seed popular skills
INSERT INTO skills (name, category) VALUES
-- Programming Languages
('JavaScript', 'Programming'),
('TypeScript', 'Programming'),
('Python', 'Programming'),
('Java', 'Programming'),
('PHP', 'Programming'),
('Ruby', 'Programming'),
('Go', 'Programming'),
('C++', 'Programming'),
('Swift', 'Programming'),
('Kotlin', 'Programming'),

-- Web Frameworks
('React', 'Web Framework'),
('Next.js', 'Web Framework'),
('Vue.js', 'Web Framework'),
('Angular', 'Web Framework'),
('Node.js', 'Web Framework'),
('Express.js', 'Web Framework'),
('Django', 'Web Framework'),
('Flask', 'Web Framework'),
('Laravel', 'Web Framework'),
('Ruby on Rails', 'Web Framework'),

-- Mobile Development
('React Native', 'Mobile'),
('Flutter', 'Mobile'),
('iOS Development', 'Mobile'),
('Android Development', 'Mobile'),

-- Design
('UI/UX Design', 'Design'),
('Figma', 'Design'),
('Adobe Photoshop', 'Design'),
('Adobe Illustrator', 'Design'),
('Sketch', 'Design'),
('Adobe XD', 'Design'),
('Graphic Design', 'Design'),
('Logo Design', 'Design'),

-- Database
('PostgreSQL', 'Database'),
('MySQL', 'Database'),
('MongoDB', 'Database'),
('Redis', 'Database'),
('Firebase', 'Database'),

-- Cloud & DevOps
('AWS', 'Cloud'),
('Google Cloud', 'Cloud'),
('Azure', 'Cloud'),
('Docker', 'DevOps'),
('Kubernetes', 'DevOps'),
('CI/CD', 'DevOps'),

-- Marketing
('SEO', 'Marketing'),
('Content Marketing', 'Marketing'),
('Social Media Marketing', 'Marketing'),
('Email Marketing', 'Marketing'),
('Google Ads', 'Marketing'),
('Facebook Ads', 'Marketing'),

-- Writing
('Content Writing', 'Writing'),
('Copywriting', 'Writing'),
('Technical Writing', 'Writing'),
('Blog Writing', 'Writing'),

-- Data Science
('Machine Learning', 'Data Science'),
('Data Analysis', 'Data Science'),
('Python Data Science', 'Data Science'),
('TensorFlow', 'Data Science'),
('PyTorch', 'Data Science'),

-- Other
('WordPress', 'CMS'),
('Shopify', 'E-commerce'),
('WooCommerce', 'E-commerce'),
('Video Editing', 'Video'),
('Animation', 'Video'),
('3D Modeling', 'Design'),
('Translation', 'Language'),
('Accounting', 'Finance'),
('Legal Consulting', 'Legal');

-- ============================================
-- SETUP COMPLETE!
-- ============================================
