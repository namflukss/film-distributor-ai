import { useState, useEffect, useRef } from 'react'
import { Send, Trash2, Bot, User, Zap, Copy, Check, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

const SUGGESTIONS = [
  'Should I submit to Sundance or wait for SXSW?',
  "What's a realistic festival strategy for a micro-budget documentary?",
  "Build me a deadline calendar for Sundance, SXSW, and Tribeca.",
  "How do I approach a sales agent after a Sundance rejection?",
  "Estimate a submission budget for 10 major festivals.",
  "Write me a fee waiver request for Sundance.",
  'What does "premiere politics" mean and why does it matter?',
  "Which streaming platforms are realistic for an indie festival film?",
]

const TOOL_LABELS = {
  get_festival_details: "Looking up festival details",
  match_platforms: "Matching streaming platforms",
  find_sales_agents: "Finding sales agents",
  generate_submission_materials: "Generating submission materials",
  build_deadline_calendar: "Building deadline calendar",
  estimate_submission_budget: "Estimating submission budget",
  generate_fee_waiver_request: "Writing fee waiver request",
  find_niche_festivals: "Finding niche festivals",
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
      title="Copy"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  )
}

function ChatBubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
        isUser ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-amber-400'
      }`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div className={`relative group max-w-2xl rounded-xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? 'bg-amber-400/10 border border-amber-400/20 text-amber-100 rounded-tr-none'
          : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
      }`}>
        {isUser ? (
          <p>{msg.content}</p>
        ) : (
          <>
            <CopyButton text={msg.content} />
            <div className="prose prose-sm prose-invert max-w-none
              prose-headings:text-amber-400 prose-headings:font-semibold prose-headings:mt-4 prose-headings:mb-2
              prose-p:text-slate-200 prose-p:leading-relaxed prose-p:my-2
              prose-strong:text-white prose-strong:font-semibold
              prose-li:text-slate-200 prose-li:my-0.5
              prose-ul:my-2 prose-ol:my-2
              prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-code:bg-slate-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-amber-300 prose-code:text-xs
              prose-blockquote:border-l-amber-400 prose-blockquote:text-slate-400
              prose-hr:border-slate-600
              prose-table:text-slate-300 prose-th:text-white prose-td:border-slate-600 prose-th:border-slate-600">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function ToolIndicator({ tool, label }) {
  const displayLabel = TOOL_LABELS[tool] || label || tool.replace(/_/g, ' ')
  return (
    <div className="flex items-center gap-2 mb-3 text-xs text-amber-400/70">
      <Loader2 size={12} className="animate-spin flex-shrink-0" />
      <span>{displayLabel}…</span>
    </div>
  )
}

function TypingBubble({ text, activeTool }) {
  return (
    <div className="flex gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-slate-700 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Bot size={16} />
      </div>
      <div className="max-w-2xl bg-slate-800 border border-slate-700 rounded-xl rounded-tl-none px-4 py-3 text-sm text-slate-200 leading-relaxed">
        {activeTool && <ToolIndicator tool={activeTool.tool} label={activeTool.label} />}
        {text ? (
          <div className="prose prose-sm prose-invert max-w-none
            prose-headings:text-amber-400 prose-headings:font-semibold
            prose-p:text-slate-200 prose-p:leading-relaxed prose-p:my-2
            prose-strong:text-white
            prose-li:text-slate-200
            prose-code:bg-slate-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-amber-300 prose-code:text-xs">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        ) : !activeTool ? (
          <div className="flex gap-1 items-center py-1">
            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default function AIAdvisor({ profile }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [activeTool, setActiveTool] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    fetch('/api/chat/history')
      .then(r => r.json())
      .then(setMessages)
      .catch(() => {})
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamText, activeTool])

  const send = async (text) => {
    const msg = text || input.trim()
    if (!msg || streaming) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setStreaming(true)
    setStreamText('')
    setActiveTool(null)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          try {
            const parsed = JSON.parse(data)

            if (parsed.type === 'text' && parsed.content) {
              full += parsed.content
              setStreamText(full)
              setActiveTool(null)
            } else if (parsed.type === 'tool_calling') {
              setActiveTool({ tool: parsed.tool, label: parsed.label })
            } else if (parsed.type === 'tool_done') {
              setActiveTool(null)
            } else if (parsed.type === 'done') {
              break
            } else if (parsed.type === 'error') {
              setMessages(prev => [...prev, { role: 'assistant', content: `Sorry, an error occurred: ${parsed.error}` }])
              return
            }
          } catch {}
        }
      }

      if (full) {
        setMessages(prev => [...prev, { role: 'assistant', content: full }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setStreaming(false)
      setStreamText('')
      setActiveTool(null)
    }
  }

  const clearChat = async () => {
    if (!confirm('Clear chat history?')) return
    await fetch('/api/chat/history', { method: 'DELETE' })
    setMessages([])
  }

  return (
    <div className="flex flex-col h-screen max-h-screen p-6 pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <Zap className="text-amber-400" size={28} /> AI Distribution Advisor
          </h2>
          <p className="text-slate-400 mt-1 text-sm">
            Festival strategy, platform matching, submission materials, deadline calendars
            {profile?.title && <span className="text-amber-400"> · "{profile.title}"</span>}
          </p>
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors px-3 py-2 border border-slate-700 rounded-lg">
            <Trash2 size={13} /> Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pb-4">
        {messages.length === 0 && !streaming && (
          <div className="py-8">
            <div className="text-center mb-8">
              <Bot size={48} className="text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 text-lg font-medium">Your AI Distribution Consultant</p>
              <p className="text-slate-500 text-sm mt-2 max-w-lg mx-auto">
                Ask about festival strategy, streaming platforms, sales agents, submission budgets, and outreach materials.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => send(s)}
                  className="text-left text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-400/30 rounded-xl p-3.5 transition-all">
                  "{s}"
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatBubble key={i} msg={msg} />
        ))}

        {streaming && <TypingBubble text={streamText} activeTool={activeTool} />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 py-4 border-t border-slate-800">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            disabled={streaming}
            placeholder="Ask about festival strategy, platforms, sales agents, budgets..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none text-sm disabled:opacity-50"
          />
          <button onClick={() => send()}
            disabled={!input.trim() || streaming}
            className="bg-amber-400 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 p-3 rounded-xl transition-all font-bold">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
