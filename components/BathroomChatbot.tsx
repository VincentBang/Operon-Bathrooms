"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
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
  const [messages, setMessages] = useState<ChatMessage[]>([initialAssistantMessage()]);
  const inputRef = useRef<HTMLInputElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const shouldHide = hiddenRoutePatterns.some((pattern) => pattern.test(pathname || ""));

  useEffect(() => {
    const saved = window.localStorage.getItem("operon-bathrooms-chat-open");
    if (saved === "true") setOpen(true);
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
                  </div>
                </div>
              )
            )}
          </div>

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
