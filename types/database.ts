export type UserRole = 'client' | 'freelancer' | 'admin'
export type JobStatus = 'open' | 'in_progress' | 'completed' | 'closed' | 'cancelled'
export type ProposalStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn'
export type ProjectStatus = 'active' | 'completed' | 'disputed' | 'cancelled'
export type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'closed'
export type TransactionType = 'subscription' | 'escrow_deposit' | 'escrow_release' | 'refund' | 'platform_fee'
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type SubscriptionPlan = 'free' | 'monthly' | 'yearly'

export interface User {
    id: string
    email: string
    full_name: string
    avatar_url?: string
    role: UserRole
    is_verified: boolean
    created_at: string
    updated_at: string
}

export interface FreelancerProfile {
    id: string
    user_id: string
    title: string
    bio: string
    hourly_rate?: number
    availability: string
    location?: string
    languages: string[]
    total_earnings: number
    total_jobs: number
    success_rate: number
    response_time?: number
    created_at: string
    updated_at: string
}

export interface ClientProfile {
    id: string
    user_id: string
    company_name?: string
    company_size?: string
    industry?: string
    total_spent: number
    total_jobs_posted: number
    created_at: string
    updated_at: string
}

export interface Skill {
    id: string
    name: string
    category: string
    created_at: string
}

export interface UserSkill {
    id: string
    user_id: string
    skill_id: string
    proficiency_level: number
    years_of_experience?: number
}

export interface Portfolio {
    id: string
    user_id: string
    title: string
    description: string
    image_url?: string
    project_url?: string
    technologies: string[]
    created_at: string
}

export interface Job {
    id: string
    client_id: string
    title: string
    description: string
    category_id: string
    budget_type: 'fixed' | 'hourly'
    budget_min?: number
    budget_max?: number
    duration?: string
    experience_level: 'beginner' | 'intermediate' | 'expert'
    status: JobStatus
    proposals_count: number
    is_featured: boolean
    created_at: string
    updated_at: string
}

export interface JobCategory {
    id: string
    name: string
    slug: string
    description?: string
    icon?: string
    parent_id?: string
}

export interface Proposal {
    id: string
    job_id: string
    freelancer_id: string
    cover_letter: string
    proposed_budget: number
    proposed_duration: string
    status: ProposalStatus
    created_at: string
    updated_at: string
}

export interface Project {
    id: string
    job_id: string
    client_id: string
    freelancer_id: string
    title: string
    description: string
    budget: number
    status: ProjectStatus
    start_date: string
    end_date?: string
    created_at: string
    updated_at: string
}

export interface Milestone {
    id: string
    project_id: string
    title: string
    description: string
    amount: number
    due_date?: string
    is_paid: boolean
    is_completed: boolean
    created_at: string
}

export interface Conversation {
    id: string
    participant_1_id: string
    participant_2_id: string
    last_message_at: string
    created_at: string
}

export interface Message {
    id: string
    conversation_id: string
    sender_id: string
    content: string
    is_read: boolean
    created_at: string
}

export interface Transaction {
    id: string
    user_id: string
    type: TransactionType
    amount: number
    status: TransactionStatus
    razorpay_payment_id?: string
    razorpay_order_id?: string
    description: string
    created_at: string
}

export interface Subscription {
    id: string
    user_id: string
    plan: SubscriptionPlan
    status: 'active' | 'cancelled' | 'expired'
    current_period_start: string
    current_period_end: string
    razorpay_subscription_id?: string
    created_at: string
    updated_at: string
}

export interface Review {
    id: string
    project_id: string
    reviewer_id: string
    reviewee_id: string
    rating: number
    comment: string
    communication_rating: number
    quality_rating: number
    professionalism_rating: number
    created_at: string
}

export interface Dispute {
    id: string
    project_id: string
    filed_by: string
    reason: string
    description: string
    status: DisputeStatus
    resolution?: string
    resolved_by?: string
    resolved_at?: string
    created_at: string
    updated_at: string
}

export interface Notification {
    id: string
    user_id: string
    type: string
    title: string
    message: string
    link?: string
    is_read: boolean
    created_at: string
}
