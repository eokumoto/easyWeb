"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import {
  answerHealthPlusQuestion,
  healthPlusSuggestedQuestions,
  type HealthPlusHelpAnswer,
} from "@/lib/healthPlusData";

export function HelpAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<HealthPlusHelpAnswer | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  function answer(questionToAnswer: string) {
    const trimmedQuestion = questionToAnswer.trim();
    if (!trimmedQuestion) return;
    setQuestion(trimmedQuestion);
    setResponse(answerHealthPlusQuestion(trimmedQuestion));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    answer(question);
  }

  function resetQuestion() {
    setQuestion("");
    setResponse(null);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function showSection(sectionId: string) {
    setIsOpen(false);
    window.setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (!section) return;
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      section.classList.add("help-highlight");
      window.setTimeout(() => section.classList.remove("help-highlight"), 2600);
    }, 80);
  }

  return (
    <>
      <button aria-haspopup="dialog" className="help-launcher" onClick={() => setIsOpen(true)} type="button">
        <span className="help-icon" aria-hidden="true">?</span>
        Need Help?
      </button>

      {isOpen && (
        <div className="dialog-backdrop">
          <section aria-labelledby="help-title" aria-modal="true" className="help-dialog" role="dialog">
            <div className="dialog-header">
              <div>
                <h2 className="dialog-title" id="help-title">Help with this page</h2>
                <p className="dialog-intro">Ask about appointments, hours, insurance, services, or contact details.</p>
              </div>
              <button aria-label="Close help" className="dialog-close" onClick={() => setIsOpen(false)} ref={closeButtonRef} type="button">×</button>
            </div>

            {response ? (
              <div className="help-answer">
                <p className="help-question">You asked: {question}</p>
                <p aria-live="polite" className="help-response">{response.answer}</p>
                <div className="help-answer-actions">
                  {response.sectionId && (
                    <button className="help-show" onClick={() => showSection(response.sectionId!)} type="button">
                      Show me on the page
                    </button>
                  )}
                  <button className="help-reset" onClick={resetQuestion} type="button">Ask another question</button>
                </div>
              </div>
            ) : (
              <>
                <form className="help-form" onSubmit={handleSubmit}>
                  <label htmlFor="page-help-question">What would you like to know?</label>
                  <div>
                    <input autoComplete="off" id="page-help-question" onChange={(event) => setQuestion(event.target.value)} placeholder="For example: What are the hours?" ref={inputRef} type="text" value={question} />
                    <button disabled={!question.trim()} type="submit">Ask</button>
                  </div>
                </form>
                <div className="help-suggestions" aria-label="Suggested questions">
                  <p>Or choose a question:</p>
                  <div className="help-options">
                    {healthPlusSuggestedQuestions.map((suggestion) => (
                      <button className="help-option" key={suggestion} onClick={() => answer(suggestion)} type="button">{suggestion}</button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}
