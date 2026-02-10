'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitProposal(formData: FormData) {
    const supabase = await createClient()

    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to apply.' }
    }

    // 2. Extract data from formData
    const jobId = formData.get('jobId') as string
    const coverLetter = formData.get('coverLetter') as string
    const proposedBudget = parseFloat(formData.get('proposedBudget') as string)
    const proposedDuration = formData.get('proposedDuration') as string

    if (!jobId || !coverLetter || !proposedBudget) {
        return { error: 'Please fill in all required fields.' }
    }

    // 3. Check if user already applied
    const { data: existingProposal } = await supabase
        .from('proposals')
        .select('id')
        .eq('job_id', jobId)
        .eq('freelancer_id', user.id)
        .single()

    if (existingProposal) {
        return { error: 'You have already applied for this job.' }
    }

    // 4. Submit proposal
    const { data: proposal, error: proposalError } = await supabase
        .from('proposals')
        .insert({
            job_id: jobId,
            freelancer_id: user.id,
            cover_letter: coverLetter,
            proposed_budget: proposedBudget,
            proposed_duration: proposedDuration,
            status: 'pending'
        })
        .select()
        .single()

    if (proposalError) {
        console.error('Proposal submission error:', proposalError)
        return { error: 'Failed to submit proposal. Please try again.' }
    }

    // 5. Get job owner (client) to notify
    const { data: job, error: jobError } = await supabase
        .from('jobs')
        .select('client_id, title')
        .eq('id', jobId)
        .single()

    if (jobError) {
        console.error('Job fetch error for notification:', jobError)
        // Continue anyway as proposal is submitted
    } else if (job) {
        // 6. Create notification for client
        const { error: notificationError } = await supabase
            .from('notifications')
            .insert({
                user_id: job.client_id,
                type: 'proposal_received',
                title: 'New Proposal Received',
                message: `You have received a new proposal for your job: ${job.title}`,
                link: `/jobs/${jobId}/proposals`, // Assuming this path for client to view proposals
                is_read: false
            })

        if (notificationError) {
            console.error('Notification error:', notificationError)
        }
    }

    // 7. Revalidate path
    revalidatePath(`/jobs/${jobId}`)
    revalidatePath('/dashboard/proposals')

    return { success: true, message: 'Proposal submitted successfully!' }
}
