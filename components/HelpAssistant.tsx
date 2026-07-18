"use client";

import { useEffect, useRef, useState } from "react";
import type { DemoSiteId } from "@/lib/demoSites";

type HelpPage = "home" | "search" | DemoSiteId;
type HelpOption = { question: string; answer: string };

// TEMPORARY: Scripted hackathon responses. Replace this content with the GPT-5.6
// Responses API integration before submission; preserve these safety boundaries.
const temporaryPageHelp: Record<HelpPage, HelpOption[]> = {
  home: [
    { question: "How do I open a website?", answer: "Choose one of the large bookmark cards. It will open here inside EasyWeb." },
    { question: "What can I type in the address bar?", answer: "You can type a topic to search, or enter one of the demo addresses shown on your bookmarks." },
  ],
  search: [
    { question: "How do I choose a result?", answer: "Choose the result whose name matches what you need. Every result on this demo search page stays inside EasyWeb." },
    { question: "Are these results safe?", answer: "These results were selected for this controlled demo. In a real browser, EasyWeb would provide guidance but could not guarantee that every website is safe." },
  ],
  healthplus: [
    { question: "How do I contact the clinic?", answer: "Call HealthPlus Clinic at (555) 014-2200. The clinic is open Monday through Friday, 8:00 AM to 5:00 PM." },
    { question: "How do I make an appointment?", answer: "Call the clinic at (555) 014-2200 and ask for an appointment. EasyWeb has not booked or submitted anything for you." },
  ],
  pharmacy: [
    { question: "How do I request a refill?", answer: "Call the pharmacy at (555) 018-4400 and keep your prescription bottle nearby. EasyWeb has not requested a refill for you." },
    { question: "When is the pharmacy open?", answer: "The pharmacy is open today from 8:00 AM to 7:00 PM." },
  ],
  utility: [
    { question: "When is this sample bill due?", answer: "The sample statement shows a due date of August 5 and a balance of $84.20." },
    { question: "Can you pay this bill for me?", answer: "No. EasyWeb can explain the bill, but it cannot make payments or submit financial information. Call billing support at (555) 012-1000 for help." },
  ],
};

export function HelpAssistant({ page }: { page: HelpPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<HelpOption | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const options = temporaryPageHelp[page];

  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <button className="help-launcher" type="button" onClick={() => setIsOpen(true)} aria-haspopup="dialog">
        <span className="help-icon" aria-hidden="true">?</span>
        Need Help?
      </button>

      {isOpen && (
        <div className="dialog-backdrop">
          <section className="help-dialog" role="dialog" aria-modal="true" aria-labelledby="help-title">
            <div className="dialog-header">
              <div>
                <h2 className="dialog-title" id="help-title">Page help</h2>
                <p className="dialog-intro">Choose a question and I&apos;ll guide you one step at a time.</p>
              </div>
              <button aria-label="Close help" className="dialog-close" onClick={() => setIsOpen(false)} ref={closeButtonRef} type="button">×</button>
            </div>

            {selectedOption ? (
              <>
                <p className="help-response" role="status">{selectedOption.answer}</p>
                <button className="help-reset" onClick={() => setSelectedOption(null)} type="button">Ask another question</button>
              </>
            ) : (
              <div className="help-options">
                {options.map((option) => (
                  <button className="help-option" key={option.question} onClick={() => setSelectedOption(option)} type="button">{option.question}</button>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
