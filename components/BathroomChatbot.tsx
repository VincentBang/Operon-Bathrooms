"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { readAttribution } from "@/lib/attribution";
import { getBathroomChatbotResponse } from "@/lib/chatbot/bathroomChatbotIntents";
import { ChatbotResponse, quickPrompts } from "@/lib/chatbot/bathroomChatbotResponses";

type ChatMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; response: ChatbotResponse };

const hiddenRoutePatterns = [/^\/admin\b/, /^\/api\b/, /^\/privacy\b/, /^\/terms\b/, /^\/robots\.txt$/, /^\/sitemap\.xml$/];

function messageId() {
  return `chat_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function initialAssistantMessage(): ChatMessage {
  return {
    id: "welcome",
    role: "assistant",
    response: getBathroomChatbotResponse("")
  };
}

export function BathroomChatbot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [handoffOpen, setHandoffOpen] = useState(false);
  const [handoffStatus, setHandoffStatus] = useState("");
  const [handoff, setHandoff] = useState({
    name: "",
    email: "",
    phone: "",
    suburb: "",
    preferredNextStep: "scope_review",
    privacyAccepted: false,
    termsAccepted: false,
    guidanceAccepted: false,
    company: ""
  });
  const [messages, setMessages] = useState<ChatMessage[]>([initialAssistantMessage()]);
  const inputRef = useRef<HTMLInputElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const shouldHide = hiddenRoutePatterns.some((pattern) => pattern.test(pathname || ""));

  useEffect(() => {
    const saved = window.localStorage.getItem("operon-bathrooms-chat-open");
    if (saved === "true") setOpen(true);
    if (!window.sessionStorage.getItem("operon_bathrooms_chat_session")) {
      window.sessionStorage.setItem("operon_bathrooms_chat_session", messageId());
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("operon-bathrooms-chat-open", String(open));
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  if (shouldHide) return null;

  function askBot(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const response = getBathroomChatbotResponse(trimmed);
    setMessages((current) => [
      ...current,
      { id: messageId(), role: "user", text: trimmed },
      { id: messageId(), role: "assistant", response }
    ]);
    setInput("");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    askBot(input);
  }

  async function onHandoffSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const lastAssistant = [...messages].reverse().find((message): message is Extract<ChatMessage, { role: "assistant" }> => message.role === "assistant");
    const lastUser = [...messages].reverse().find((message): message is Extract<ChatMessage, { role: "user" }> => message.role === "user");
    setHandoffStatus("Sending...");
    const response = await fetch("/api/chatbot-qualification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-operon-chat-session": window.sessionStorage.getItem("operon_bathrooms_chat_session") || ""
      },
      body: JSON.stringify({
        ...handoff,
        message: lastUser?.text || input || "Bathroom chatbot handoff request.",
        latestIntent: lastAssistant?.response.intent,
        latestAssistantTitle: lastAssistant?.response.title,
        highRiskTopics: lastAssistant?.response.highRiskTopics || [],
        attribution: readAttribution("/chatbot")
      })
    });
    const json = await response.json();
    if (!response.ok) {
      setHandoffStatus(json.error || "Unable to send request.");
      return;
    }
    setHandoffStatus(json.message || "Request received.");
    setHandoffOpen(false);
  }

  return (
    <div className={`bathroom-chatbot ${open ? "is-open" : ""}`} aria-live="polite">
      {open ? (
        <section className="chatbot-panel" id="bathroom-chatbot" aria-label="Operon Bathroom Assistant">
          <div className="chatbot-header">
            <div>
              <h2>Operon Bathroom Assistant</h2>
              <p>Planning estimate, quote review and site-measure guidance.</p>
            </div>
            <button className="chatbot-icon-button" type="button" aria-label="Close bathroom assistant" onClick={() => setOpen(false)}>
              x
            </button>
          </div>

          <div className="chatbot-transcript" ref={transcriptRef}>
            {messages.map((message) =>
              message.role === "user" ? (
                <div className="chatbot-message user" key={message.id}>
                  <p>{message.text}</p>
                </div>
              ) : (
                <div className="chatbot-message assistant" key={message.id}>
                  <h3>{message.response.title}</h3>
                  {message.response.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {message.response.highRiskTopics?.length ? (
                    <div className="chatbot-risk">
                      <strong>Topic to review:</strong> {message.response.highRiskTopics.join(", ")}
                    </div>
                  ) : null}
                  <div className="chatbot-ctas">
                    {message.response.ctas.map((cta) => (
                      <Link className="button secondary" href={cta.href} key={`${message.id}-${cta.href}`}>
                        {cta.label}
                      </Link>
                    ))}
                    <button className="button secondary" type="button" onClick={() => setHandoffOpen(true)}>
                      Send to review team
                    </button>
                  </div>
                </div>
              )
            )}
          </div>

          {handoffOpen ? (
            <form className="chatbot-handoff" onSubmit={onHandoffSubmit}>
              <input
                className="visually-hidden"
                tabIndex={-1}
                autoComplete="off"
                value={handoff.company}
                onChange={(event) => setHandoff((current) => ({ ...current, company: event.target.value }))}
                aria-hidden="true"
              />
              <label>
                Name
                <input required value={handoff.name} onChange={(event) => setHandoff((current) => ({ ...current, name: event.target.value }))} />
              </label>
              <label>
                Email
                <input required type="email" value={handoff.email} onChange={(event) => setHandoff((current) => ({ ...current, email: event.target.value }))} />
              </label>
              <label>
                Phone optional
                <input value={handoff.phone} onChange={(event) => setHandoff((current) => ({ ...current, phone: event.target.value }))} />
              </label>
              <label>
                Suburb
                <input required value={handoff.suburb} onChange={(event) => setHandoff((current) => ({ ...current, suburb: event.target.value }))} />
              </label>
              <label>
                Preferred next step
                <select value={handoff.preferredNextStep} onChange={(event) => setHandoff((current) => ({ ...current, preferredNextStep: event.target.value }))}>
                  <option value="scope_review">Scope review</option>
                  <option value="quote_review">Quote review</option>
                  <option value="site_measure">Site measure</option>
                  <option value="estimate">Planning estimate</option>
                  <option value="manual_review">Manual review</option>
                </select>
              </label>
              <label className="check-row">
                <input
                  required
                  type="checkbox"
                  checked={handoff.privacyAccepted}
                  onChange={(event) => setHandoff((current) => ({ ...current, privacyAccepted: event.target.checked }))}
                />
                I accept the privacy policy.
              </label>
              <label className="check-row">
                <input
                  required
                  type="checkbox"
                  checked={handoff.termsAccepted}
                  onChange={(event) => setHandoff((current) => ({ ...current, termsAccepted: event.target.checked }))}
                />
                I accept the terms.
              </label>
              <label className="check-row">
                <input
                  required
                  type="checkbox"
                  checked={handoff.guidanceAccepted}
                  onChange={(event) => setHandoff((current) => ({ ...current, guidanceAccepted: event.target.checked }))}
                />
                I understand this is planning guidance only.
              </label>
              <div className="chatbot-ctas">
                <button type="submit">Send request</button>
                <button className="secondary" type="button" onClick={() => setHandoffOpen(false)}>Cancel</button>
              </div>
            </form>
          ) : null}

          {handoffStatus ? <p className="chatbot-status">{handoffStatus}</p> : null}

          <div className="chatbot-prompts" aria-label="Bathroom assistant quick prompts">
            {quickPrompts.map((prompt) => (
              <button className="chatbot-prompt" type="button" key={prompt} onClick={() => askBot(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <form className="chatbot-form" onSubmit={onSubmit}>
            <label htmlFor="bathroom-chatbot-input">Ask about your bathroom quote or scope</label>
            <div>
              <input
                id="bathroom-chatbot-input"
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Example: Can you review my builder quote?"
                autoComplete="off"
              />
              <button type="submit">Ask</button>
            </div>
          </form>
        </section>
      ) : null}
      <button className="chatbot-launcher" type="button" aria-expanded={open} aria-controls="bathroom-chatbot" onClick={() => setOpen((current) => !current)}>
        Bathroom quote help
      </button>
    </div>
  );
}
