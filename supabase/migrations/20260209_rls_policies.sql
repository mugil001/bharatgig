-- Enable Row Level Security on all tables
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

-- Skills policies (public read)
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

-- Job categories policies (public read)
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
