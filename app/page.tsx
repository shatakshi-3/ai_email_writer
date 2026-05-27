"use client";
import React, { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    recipientName: "",
    companyName: "",
    purpose: "",
    tone: "professional",
    background: "",
  });

  const [loading, setLoading] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [isMockResponse, setIsMockResponse] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClear = () => {
    setFormData({
      recipientName: "",
      companyName: "",
      purpose: "",
      tone: "professional",
      background: "",
    });
    setGeneratedEmail("");
    setIsEditing(false);
    setCopied(false);
  };

  const handleSubmit = async () => {
    if (!formData.recipientName && !formData.companyName && !formData.purpose) {
      alert("Please fill in at least some details (Recipient, Company, or Purpose) before generating.");
      return;
    }

    try {
      setLoading(true);
      setGeneratedEmail("");
      setCopied(false);
      setIsEditing(false);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedEmail(data.email);
        setIsMockResponse(!!data.isMock);
      } else {
        alert(data.error || "Failed to generate email");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please check your localhost server connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedEmail) return;
    navigator.clipboard.writeText(generatedEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to parse subject and body from AI response
  const parseEmail = (rawText: string) => {
    const lines = rawText.split("\n");
    let subject = "No Subject Generated";
    let body = "";
    
    // Check if the response contains "Subject:"
    const subjectLineIndex = lines.findIndex(line => line.toLowerCase().startsWith("subject:"));
    
    if (subjectLineIndex !== -1) {
      subject = lines[subjectLineIndex].substring(8).trim();
      body = lines.slice(subjectLineIndex + 1).join("\n").trim();
    } else {
      body = rawText;
    }
    
    return { subject, body };
  };

  const { subject, body } = parseEmail(generatedEmail);

  return (
    <main className="min-h-screen bg-[#030712] text-slate-100 flex flex-col items-center justify-start p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Visual background gradient blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto z-10 flex flex-col gap-6">
        
        {/* Header Section */}
        <header className="flex flex-col items-center text-center my-4 md:my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Next-Gen AI Email Composer
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
            AI Email Writer
          </h1>
          <p className="mt-2 text-slate-400 max-w-xl text-sm md:text-base">
            Instantly write highly-converting cold outreach, recruiting, or follow-up emails tailored specifically for your target recipient.
          </p>
        </header>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Inputs Form Container */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 shadow-2xl flex flex-col justify-between h-full">
              
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-2">
                  <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Outreach Strategy
                  </h2>
                  <button 
                    onClick={handleClear}
                    className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Reset Form
                  </button>
                </div>

                {/* Recipient Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleChange}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>

                {/* Company Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Stripe"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>

                {/* Purpose */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    Email Purpose
                  </label>
                  <input
                    type="text"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    placeholder="e.g. Schedule a 10m chat to discuss APIs"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>

                {/* Tone */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    Tone of Voice
                  </label>
                  <div className="relative">
                    <select
                      name="tone"
                      value={formData.tone}
                      onChange={handleChange}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 text-sm appearance-none"
                    >
                      <option value="professional">👔 Professional / Elegant</option>
                      <option value="friendly">👋 Friendly / Warm</option>
                      <option value="confident">🚀 Confident / Direct</option>
                      <option value="casual">☕ Casual / Conversational</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Background */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    Your Background / Context
                  </label>
                  <textarea
                    name="background"
                    value={formData.background}
                    onChange={handleChange}
                    placeholder="Mention your product, title, or shared connection (helps the AI personalize)..."
                    rows={4}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 text-sm resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full mt-6 py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  loading
                    ? "bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Generating with AI...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Compose Cold Email</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT: Live API Output Display Panel */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/80 rounded-2xl shadow-2xl flex flex-col h-full min-h-[500px]">
              
              {/* Output Header Controls */}
              <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${generatedEmail ? 'bg-indigo-400' : 'bg-slate-600 animate-pulse'}`} />
                  AI Writing Canvas
                </span>

                {generatedEmail && !loading && (
                  <div className="flex items-center gap-2">
                    {/* Mock mode banner indicator */}
                    {isMockResponse && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase tracking-wider mr-2">
                        Developer Mock
                      </span>
                    )}
                    
                    {/* Toggle Preview / Edit Mode */}
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1 ${
                        isEditing
                          ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                          : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300"
                      }`}
                    >
                      {isEditing ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Preview Output
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Inline
                        </>
                      )}
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={handleCopy}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all duration-300 flex items-center gap-1.5 ${
                        copied
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-indigo-600 hover:bg-indigo-500 border-indigo-500/50 text-white"
                      }`}
                    >
                      {copied ? (
                        <>
                          <svg className="w-3.5 h-3.5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          Copy Email
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* API Canvas Content Area */}
              <div className="flex-1 p-6 flex flex-col justify-start overflow-y-auto">
                
                {/* 1. IDLE STATE */}
                {!generatedEmail && !loading && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-800/80 rounded-xl my-auto">
                    <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 mb-4 shadow-xl">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-slate-300">Ready to Compose</h3>
                    <p className="mt-1 text-sm text-slate-500 max-w-sm">
                      Complete the strategy form on the left, then click "Compose Cold Email" to harness the AI.
                    </p>
                  </div>
                )}

                {/* 2. LOADING STATE (Shimmering Skeleton Lines) */}
                {loading && (
                  <div className="space-y-6 animate-pulse w-full">
                    {/* Subject Line Skeleton */}
                    <div className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-xl space-y-2">
                      <div className="h-3 w-16 bg-slate-800 rounded" />
                      <div className="h-5 w-3/4 bg-slate-700 rounded mt-1" />
                    </div>
                    {/* Email Body Skeleton */}
                    <div className="space-y-3 px-2 pt-2">
                      <div className="h-4 w-1/4 bg-slate-800 rounded" />
                      <div className="h-4 w-11/12 bg-slate-800 rounded pt-1" />
                      <div className="h-4 w-full bg-slate-800 rounded" />
                      <div className="h-4 w-10/12 bg-slate-800 rounded" />
                      <div className="h-4 w-2/3 bg-slate-800 rounded pt-3" />
                      <div className="h-4 w-1/3 bg-slate-800 rounded pt-3" />
                    </div>
                  </div>
                )}

                {/* 3. GENERATED OUTPUT - EDIT MODE */}
                {generatedEmail && !loading && isEditing && (
                  <div className="flex-1 flex flex-col">
                    <label className="block text-xs font-semibold text-indigo-400 mb-2 uppercase tracking-wider">
                      Interactive Text Area (Editable)
                    </label>
                    <textarea
                      value={generatedEmail}
                      onChange={(e) => setGeneratedEmail(e.target.value)}
                      className="flex-1 w-full bg-slate-950/60 border border-slate-800 rounded-xl p-5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-sm leading-relaxed min-h-[400px] resize-none"
                    />
                  </div>
                )}

                {/* 4. GENERATED OUTPUT - PREVIEW MODE */}
                {generatedEmail && !loading && !isEditing && (
                  <div className="space-y-6 w-full text-slate-300">
                    
                    {/* Subject Line Panel */}
                    <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl flex items-start gap-4">
                      <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded mt-0.5 shrink-0">
                        Subject
                      </div>
                      <div className="text-slate-200 font-semibold text-sm leading-tight">
                        {subject}
                      </div>
                    </div>

                    {/* Email Body Panel */}
                    <div className="bg-slate-950/20 border border-slate-800/40 rounded-xl p-6 font-sans text-sm leading-relaxed whitespace-pre-wrap min-h-[300px]">
                      {body}
                    </div>

                  </div>
                )}
              </div>

              {/* Developer Environment Key Notification banner inside Canvas Footer */}
              {isMockResponse && generatedEmail && !loading && (
                <div className="bg-amber-500/5 border-t border-slate-800/80 px-6 py-3 flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 text-xs">
                    ⚠️
                  </div>
                  <p className="text-xs text-amber-400/85">
                    <strong>Note:</strong> Set an <code className="bg-amber-950/40 px-1 py-0.5 rounded text-amber-300 text-[11px] font-mono">OPENAI_API_KEY</code> in <code className="bg-amber-950/40 px-1 py-0.5 rounded text-amber-300 text-[11px] font-mono">.env.local</code> to query the live GPT-4o model.
                  </p>
                </div>
              )}
            </div>
          </div>
          
        </div>

      </div>
    </main>
  );
}
