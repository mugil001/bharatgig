'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getConversations, getMessages, sendMessage } from '@/app/actions/chat'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Search, MoreVertical, Phone, Video, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MessagesPage() {
    const [conversations, setConversations] = useState<any[]>([])
    const [activeConversation, setActiveConversation] = useState<any>(null)
    const [messages, setMessages] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [user, setUser] = useState<any>(null)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    // Fetch initial data
    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            const { success, data } = await getConversations()
            if (success && data) {
                setConversations(data)
                if (data.length > 0) {
                    // setActiveConversation(data[0]) // Optional: Auto-select first
                }
            }
            setLoading(false)
        }
        init()
    }, [])

    // Fetch messages when active conversation changes
    useEffect(() => {
        if (!activeConversation) return

        const fetchMsgs = async () => {
            const { success, data } = await getMessages(activeConversation.id)
            if (success && data) {
                setMessages(data)
            }
        }
        fetchMsgs()

        // Realtime Subscription
        const channel = supabase
            .channel(`conversation:${activeConversation.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${activeConversation.id}`
            }, (payload) => {
                setMessages((prev) => [...prev, payload.new])
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [activeConversation])

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !activeConversation || sending) return

        setSending(true)
        // Optimistic update
        const tempId = Date.now().toString()
        const tempMsg = {
            id: tempId,
            content: newMessage,
            sender_id: user.id,
            created_at: new Date().toISOString(),
            conversation_id: activeConversation.id
        }
        setMessages((prev) => [...prev, tempMsg])
        setNewMessage('')

        const { success, error } = await sendMessage(activeConversation.id, tempMsg.content)

        if (!success) {
            console.error('Failed to send message:', error)
            // Rollback or show error (simplified here)
        }
        setSending(false)
    }

    return (
        <div className="flex flex-col h-screen bg-white">
            <Navbar />

            <div className="flex-1 flex overflow-hidden pt-16">
                {/* Sidebar - Conversation List */}
                <div className="w-full md:w-80 border-r border-gray-200 flex flex-col bg-gray-50">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-zinc-900 mb-4">Messages</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                            <Input placeholder="Search messages..." className="pl-9 bg-white" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>
                        ) : conversations.length === 0 ? (
                            <p className="text-center text-zinc-500 p-8">No conversations yet.</p>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {conversations.map((conv) => (
                                    <button
                                        key={conv.id}
                                        onClick={() => setActiveConversation(conv)}
                                        className={cn(
                                            "w-full p-4 flex items-start gap-3 hover:bg-white transition-colors text-left",
                                            activeConversation?.id === conv.id ? "bg-white border-l-4 border-blue-600 shadow-sm" : "border-l-4 border-transparent"
                                        )}
                                    >
                                        <Avatar>
                                            <AvatarImage src={conv.other_user?.avatar_url} />
                                            <AvatarFallback>{conv.other_user?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 overflow-hidden">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <span className="font-semibold text-zinc-900 truncate">{conv.other_user?.full_name}</span>
                                                <span className="text-xs text-zinc-400">{new Date(conv.last_message_at).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-zinc-500 truncate">
                                                Click to view conversation
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                {activeConversation ? (
                    <div className="flex-1 flex flex-col bg-white">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white shadow-sm z-10">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={activeConversation.other_user?.avatar_url} />
                                    <AvatarFallback>{activeConversation.other_user?.full_name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold text-zinc-900">{activeConversation.other_user?.full_name}</h3>
                                    <p className="text-xs text-green-600 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-blue-600">
                                    <Phone className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-blue-600">
                                    <Video className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-zinc-400">
                                    <MoreVertical className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages Feed */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
                            <div className="space-y-4 max-w-3xl mx-auto">
                                {messages.map((msg) => {
                                    const isMe = msg.sender_id === user?.id
                                    return (
                                        <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                                            <div className={cn(
                                                "max-w-[75%] rounded-2xl p-4 shadow-sm",
                                                isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-zinc-900 border border-gray-200 rounded-bl-none"
                                            )}>
                                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                                <span className={cn(
                                                    "text-[10px] mt-1 block text-right opacity-70",
                                                    isMe ? "text-blue-100" : "text-zinc-400"
                                                )}>
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-200">
                            <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex gap-2">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-gray-50 border-gray-200 focus:ring-blue-500 rounded-full"
                                />
                                <Button type="submit" disabled={sending || !newMessage.trim()} className="rounded-full bg-blue-600 hover:bg-blue-700 w-12 h-12 p-0 flex items-center justify-center">
                                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </Button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-zinc-400">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <Send className="w-10 h-10 text-zinc-300 ml-1" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 mb-2">Your Messages</h3>
                        <p className="max-w-xs text-center">Select a conversation from the left to start chatting or connect with a new freelancer.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
