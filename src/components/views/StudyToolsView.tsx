import React, { useState } from 'react';
import {
  Wrench,
  Search,
  ExternalLink,
  Sparkles,
  Bot,
  BookOpen,
  Send,
  HelpCircle,
  Copy,
  Check,
  GraduationCap,
} from 'lucide-react';

export const StudyToolsView: React.FC = () => {
  // Tool state: Brainly
  const [brainlyQuery, setBrainlyQuery] = useState('');
  const [brainlySubject, setBrainlySubject] = useState('Math');

  // Tool state: ChatGPT
  const [chatGptPrompt, setChatGptPrompt] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Tool state: Google & Scholar
  const [googleQuery, setGoogleQuery] = useState('');
  const [isScholarMode, setIsScholarMode] = useState(false);

  // Tool state: Built-in Gemini Study Buddy
  const [geminiInput, setGeminiInput] = useState('');
  const [geminiMessages, setGeminiMessages] = useState<Array<{ sender: 'student' | 'gemini'; text: string }>>([
    {
      sender: 'gemini',
      text: "🤖 *Hello! I'm your Gemini Buddy!* Need step-by-step homework help, tricky math formulas explained, an essay outline, or rapid revision? Type your question below and let's solve it together! ✨",
    },
  ]);
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);

  // Brainly Search launcher
  const handleBrainlySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brainlyQuery.trim()) return;
    const query = encodeURIComponent(`${brainlySubject} ${brainlyQuery.trim()}`);
    window.open(`https://brainly.com/app/ask?q=${query}`, '_blank');
  };

  // ChatGPT prompt launcher
  const handleOpenChatGPT = (promptText?: string) => {
    const textToUse = promptText || chatGptPrompt;
    if (!textToUse.trim()) return;
    const encoded = encodeURIComponent(textToUse.trim());
    window.open(`https://chatgpt.com/?q=${encoded}`, '_blank');
  };

  // Google / Scholar search launcher
  const handleGoogleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleQuery.trim()) return;
    const encoded = encodeURIComponent(googleQuery.trim());
    if (isScholarMode) {
      window.open(`https://scholar.google.com/scholar?q=${encoded}`, '_blank');
    } else {
      window.open(`https://www.google.com/search?q=${encoded}`, '_blank');
    }
  };

  // Built-in Gemini Assistant Chat
  const handleSendGemini = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!geminiInput.trim() || isGeminiLoading) return;

    const userText = geminiInput.trim();
    setGeminiMessages((prev) => [...prev, { sender: 'student', text: userText }]);
    setGeminiInput('');
    setIsGeminiLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          context: 'Student Buddy helper for homework, exams, and concepts',
        }),
      });

      const data = await res.json();
      const reply = data.reply || "I'm right here with you! Let's conquer this topic!";
      setGeminiMessages((prev) => [...prev, { sender: 'gemini', text: reply }]);
    } catch (err) {
      console.error('Gemini error:', err);
      setGeminiMessages((prev) => [
        ...prev,
        {
          sender: 'gemini',
          text: "🤖 *Buddy is right here!* Break down this question into sub-steps: define the given variables, check the primary formula, and verify units! You've got this! ✨",
        },
      ]);
    } finally {
      setIsGeminiLoading(false);
    }
  };

  const samplePrompts = [
    'Explain the intuition behind Eigenvalues and Eigenvectors in Linear Algebra simply.',
    'Write a clean 4-paragraph outline for a research paper on Renewable Energy microgrids.',
    'Give me 5 practice multiple-choice questions on Binary Search Trees with answers.',
    'How do I manage my study schedule when I have 3 exams in the same week?',
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border-2 border-yellow-300">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-2xl bg-yellow-400 text-yellow-950 font-bold">
            <Wrench className="w-5 h-5 text-pink-600" />
          </span>
          <h2 className="text-xl md:text-2xl font-bold font-shantell italic text-stone-900">
            Student Study Tools Hub 🧰
          </h2>
        </div>
        <p className="text-xs md:text-sm text-stone-600 italic mt-1">
          Instant access to your favorite learning powerhouses: Brainly, ChatGPT, Gemini, and Google!
        </p>
      </div>

      {/* Grid of the 4 Essential Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Tool 1: Brainly */}
        <div className="bg-white rounded-3xl p-5 border-2 border-yellow-300 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-yellow-200">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧠</span>
                <div>
                  <h3 className="font-shantell italic font-bold text-base text-stone-900">
                    Brainly Homework Solver
                  </h3>
                  <p className="text-[11px] text-stone-500 italic">Peer-verified student answers</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-200 text-yellow-900">
                Community Solved
              </span>
            </div>

            <p className="text-xs text-stone-700 italic mb-3">
              Type any textbook question or problem set number to find community-verified step-by-step solutions:
            </p>

            <form onSubmit={handleBrainlySearch} className="space-y-3">
              <div className="flex gap-2">
                <select
                  value={brainlySubject}
                  onChange={(e) => setBrainlySubject(e.target.value)}
                  className="px-2.5 py-2 text-xs bg-amber-50 rounded-xl border border-yellow-300 font-bold text-yellow-950"
                >
                  <option value="Math">Math</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="History">History</option>
                  <option value="Computer Science">Computer Science</option>
                </select>

                <input
                  type="text"
                  placeholder="Paste question: e.g. What is the derivative of sin(2x)?"
                  value={brainlyQuery}
                  onChange={(e) => setBrainlyQuery(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-amber-50/50 rounded-xl border border-yellow-300 focus:outline-pink-500"
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  {['Algebra', 'Mechanics', 'Calculus'].map((sub) => (
                    <button
                      type="button"
                      key={sub}
                      onClick={() => setBrainlyQuery(`${sub} `)}
                      className="px-2 py-0.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-900 rounded-lg font-medium cursor-pointer"
                    >
                      +{sub}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 text-xs font-bold rounded-xl border border-yellow-500 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" /> Search on Brainly
                </button>
              </div>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-yellow-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Direct community Q&A</span>
            <a
              href="https://brainly.com"
              target="_blank"
              rel="noreferrer"
              className="text-pink-600 hover:underline font-bold flex items-center gap-1"
            >
              Visit Brainly.com <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Tool 2: ChatGPT Helper */}
        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💬</span>
                <div>
                  <h3 className="font-shantell italic font-bold text-base text-stone-900">
                    ChatGPT Prompt Studio
                  </h3>
                  <p className="text-[11px] text-stone-500 italic">Essay proofreading & complex breakdowns</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                AI Assistant
              </span>
            </div>

            <p className="text-xs text-stone-700 italic mb-2">
              Select or draft a high-efficiency study prompt to open directly in ChatGPT:
            </p>

            <div className="space-y-2">
              <textarea
                rows={2}
                placeholder="Draft custom prompt: e.g. Explain quantum tunneling with a sports analogy..."
                value={chatGptPrompt}
                onChange={(e) => setChatGptPrompt(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-emerald-50/40 rounded-xl border border-emerald-200 focus:outline-emerald-500"
              />

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                  Click Quick Prompt Template:
                </span>
                <div className="space-y-1">
                  {samplePrompts.slice(0, 2).map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setChatGptPrompt(p)}
                      className="w-full text-left text-[11px] p-1.5 rounded-lg bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 truncate border border-stone-200 cursor-pointer block"
                    >
                      💡 {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between">
            <button
              onClick={() => {
                navigator.clipboard.writeText(chatGptPrompt);
                setCopiedPrompt(true);
                setTimeout(() => setCopiedPrompt(false), 2000);
              }}
              className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPrompt ? 'Copied Prompt!' : 'Copy Prompt'}</span>
            </button>

            <button
              onClick={() => handleOpenChatGPT()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Launch ChatGPT
            </button>
          </div>
        </div>

        {/* Tool 3: Google & Google Scholar */}
        <div className="bg-white rounded-3xl p-5 border-2 border-blue-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-blue-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔍</span>
                <div>
                  <h3 className="font-shantell italic font-bold text-base text-stone-900">
                    Google Academic Search
                  </h3>
                  <p className="text-[11px] text-stone-500 italic">Web definitions & scholar papers</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-blue-50 p-1 rounded-xl border border-blue-200 text-[10px]">
                <button
                  type="button"
                  onClick={() => setIsScholarMode(false)}
                  className={`px-2 py-0.5 rounded-lg font-bold cursor-pointer ${
                    !isScholarMode ? 'bg-blue-600 text-white' : 'text-stone-600'
                  }`}
                >
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => setIsScholarMode(true)}
                  className={`px-2 py-0.5 rounded-lg font-bold cursor-pointer ${
                    isScholarMode ? 'bg-blue-600 text-white' : 'text-stone-600'
                  }`}
                >
                  Scholar
                </button>
              </div>
            </div>

            <p className="text-xs text-stone-700 italic mb-3">
              {isScholarMode
                ? 'Search peer-reviewed university research papers, citations, and journals:'
                : 'Fast Google search for formulas, documentation, textbook definitions, and diagrams:'}
            </p>

            <form onSubmit={handleGoogleSearch} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder={
                    isScholarMode
                      ? 'Search research: e.g. Attention is All You Need Transformer'
                      : 'Search Google: e.g. QuickSort time complexity worst case'
                  }
                  value={googleQuery}
                  onChange={(e) => setGoogleQuery(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-blue-50/40 rounded-xl border border-blue-200 focus:outline-blue-500"
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  {['PDF Notes', 'Cheat Sheet', 'Research Paper'].map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => setGoogleQuery((prev) => `${prev} ${tag}`.trim())}
                      className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-lg font-medium cursor-pointer"
                    >
                      +{tag}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />{' '}
                  {isScholarMode ? 'Search Scholar' : 'Search Google'}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>{isScholarMode ? 'Filtered for academic citations' : 'Standard web & images search'}</span>
            <a
              href={isScholarMode ? 'https://scholar.google.com' : 'https://google.com'}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline font-bold flex items-center gap-1"
            >
              Open Direct <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Tool 4: Built-in Gemini Study Companion */}
        <div className="bg-white rounded-3xl p-5 border-2 border-pink-300 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-pink-200">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <div>
                  <h3 className="font-shantell italic font-bold text-base text-stone-900">
                    Gemini Study Companion
                  </h3>
                  <p className="text-[11px] text-stone-500 italic">Built-in interactive AI homework solver</p>
                </div>
              </div>
              <a
                href="https://gemini.google.com"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-700 hover:bg-pink-200 flex items-center gap-1"
              >
                Web App <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            {/* In-App Gemini Chat Window */}
            <div className="bg-amber-50/40 rounded-2xl p-3 border border-pink-100 h-44 overflow-y-auto space-y-2.5 text-xs">
              {geminiMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-2xl max-w-[90%] ${
                    msg.sender === 'student'
                      ? 'ml-auto bg-gradient-to-r from-pink-500 to-rose-400 text-white font-medium shadow-2xs'
                      : 'mr-auto bg-white border border-pink-200 text-stone-800 shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed font-sans">{msg.text}</p>
                </div>
              ))}
              {isGeminiLoading && (
                <div className="p-2.5 rounded-2xl bg-white border border-pink-200 text-pink-700 text-xs flex items-center gap-2 animate-pulse">
                  <span>🤖</span>
                  <span className="font-shantell italic font-bold">
                    Buddy is thinking through your problem...
                  </span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendGemini} className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Ask Gemini: e.g. Explain Newton's 2nd Law simply"
                value={geminiInput}
                onChange={(e) => setGeminiInput(e.target.value)}
                disabled={isGeminiLoading}
                className="flex-1 px-3 py-2 text-xs bg-pink-50/50 rounded-xl border border-pink-200 focus:outline-pink-500"
              />
              <button
                type="submit"
                disabled={isGeminiLoading}
                className="px-3.5 py-2 bg-gradient-to-r from-pink-500 to-rose-400 hover:opacity-90 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          <div className="mt-3 pt-2 text-[10px] text-stone-500 italic flex items-center justify-between">
            <span>Powered by Gemini 3.8 Flash model</span>
            <span className="text-pink-600 font-bold font-shantell">Instant answers ⚡</span>
          </div>
        </div>

      </div>
    </div>
  );
};
