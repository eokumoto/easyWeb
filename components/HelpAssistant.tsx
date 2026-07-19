"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import {
  answerHealthPlusQuestion,
  healthPlusSuggestedQuestions,
  type HealthPlusHelpAnswer,
} from "@/lib/healthPlusData";
import type { BrowserPage } from "@/components/BrowserShell";

type AssistantProfile = {
  answer: (question: string) => HealthPlusHelpAnswer;
  heading: string;
  intro: string;
  placeholder: string;
  suggestions: readonly string[];
};

const homeSuggestions = [
  "Where will my bookmarks appear?",
  "How do I try the demo scenarios?",
  "How do I search the web?",
  "How can I tell if a website looks suspicious?",
];

const vitaGlowSuggestions = [
  "Why is EasyWeb warning me?",
  "Can I find the refund policy?",
  "Who owns this company?",
  "Is it safe to enter my card?",
];

const lookalikeSuggestions = [
  "Why is EasyWeb warning me?",
  "What is different about this address?",
  "Should I enter my password?",
  "How do I get to the real website?",
];

const externalSuggestions = [
  "How do I return home?",
  "How do I open this website separately?",
  "What should I check before entering personal information?",
  "How do I ask my trusted helper?",
];

const genericSuggestions = [
  "What can EasyWeb help me with?",
  "Can you explain this page?",
];

function answerHomeQuestion(question: string): HealthPlusHelpAnswer {
  const normalized = question.trim().toLowerCase();

  if (normalized.includes("bookmark")) {
    return { answer: "Your personal bookmarks appear on EasyWeb Home. This prototype starts with an empty list so demo websites are kept separate." };
  }
  if (normalized.includes("demo") || normalized.includes("doctor") || normalized.includes("clinic") || normalized.includes("bill")) {
    return { answer: "Choose Try demo scenarios on EasyWeb Home to open the controlled HealthPlus, Pharmacy, Utility, VitaGlow, and lookalike-address demonstrations." };
  }
  if (normalized.includes("search") || normalized.includes("find") || normalized.includes("website")) {
    return { answer: "Use the large address box at the top. Type a website address or a few words about what you want to find, then choose Go." };
  }
  if (normalized.includes("suspicious") || normalized.includes("warning") || normalized.includes("safe")) {
    return { answer: "Slow down if a site pressures you, makes dramatic promises, hides contact or refund details, or asks for payment information. Review any EasyWeb warnings and ask a trusted helper if you are unsure." };
  }

  return { answer: "I can help you understand personal bookmarks, open the controlled demo scenarios, search for a website, or recognize common warning signs." };
}

function answerVitaGlowQuestion(question: string): HealthPlusHelpAnswer {
  const normalized = question.trim().toLowerCase();

  if (normalized.includes("warning") || normalized.includes("why")) {
    return { answer: "EasyWeb noticed dramatic health and beauty promises, a countdown and today-only pressure, unclear company ownership, limited contact details, and refund terms that are hard to find. These signs do not prove the store is a scam, but they are reasons to slow down." };
  }
  if (normalized.includes("refund") || normalized.includes("return")) {
    return { answer: "The refund information is inside Legal information near the bottom of the page. It says requests must be made within 7 days and that return shipping and handling fees are not refunded." };
  }
  if (normalized.includes("own") || normalized.includes("company") || normalized.includes("contact")) {
    return { answer: "The controlled VitaGlow page does not name the company owner or list a street address. It only mentions online customer support." };
  }
  if (normalized.includes("card") || normalized.includes("payment") || normalized.includes("safe") || normalized.includes("buy")) {
    return { answer: "EasyWeb found several warning signs, so review them and consider asking a trusted helper before sharing payment information. This demo never accepts, stores, or sends card details." };
  }

  return { answer: "I can explain VitaGlow’s warning signs, refund information, company details, or why it is wise to pause before entering payment information." };
}

function answerLookalikeQuestion(question: string): HealthPlusHelpAnswer {
  const normalized = question.trim().toLowerCase();

  if (normalized.includes("different") || normalized.includes("address") || normalized.includes("1") || normalized.includes("letter")) {
    return { answer: "The address shown is rob1ox.com. It uses the number 1 where the familiar address roblox.com uses the letter l. Similar-looking characters can be easy to miss." };
  }
  if (normalized.includes("password") || normalized.includes("personal") || normalized.includes("payment") || normalized.includes("enter")) {
    return { answer: "Do not enter a password, payment information, or personal information on this controlled lookalike page. Similar-looking addresses are a warning sign, so leave the page or ask a trusted helper if you are unsure." };
  }
  if (normalized.includes("real") || normalized.includes("familiar") || normalized.includes("get to") || normalized.includes("correct")) {
    return { answer: "Choose “Did you mean roblox.com?” in the EasyWeb warning. It opens a controlled safe-destination page inside EasyWeb; it does not open an external website." };
  }
  if (normalized.includes("warning") || normalized.includes("why") || normalized.includes("safe")) {
    return { answer: "EasyWeb is warning you because rob1ox.com closely resembles the familiar address roblox.com. This does not prove the page is malicious, but deceptive sites sometimes replace letters with similar-looking numbers." };
  }

  return { answer: "I can explain why the address looks suspicious, what character is different, why you should not enter a password, or how to choose the familiar address." };
}

function answerExternalQuestion(question: string): HealthPlusHelpAnswer {
  const normalized = question.trim().toLowerCase();

  if (normalized.includes("home") || normalized.includes("return") || normalized.includes("leave")) {
    return { answer: "Choose Home in the EasyWeb toolbar to return to your bookmarks and demo scenarios." };
  }
  if (normalized.includes("separate") || normalized.includes("new tab") || normalized.includes("display") || normalized.includes("open")) {
    return { answer: "Choose ‘Having trouble viewing this page?’ above the website. EasyWeb will show an option to open the address in a new tab. It will not open a new tab until you choose that action." };
  }
  if (normalized.includes("personal") || normalized.includes("password") || normalized.includes("payment") || normalized.includes("card") || normalized.includes("safe")) {
    return { answer: "Check that the address is exactly what you expected. Be cautious with urgent requests, unexpected sign-in prompts, and requests for passwords, payment details, or personal information. A page loading does not mean EasyWeb has confirmed it is safe." };
  }
  if (normalized.includes("helper") || normalized.includes("trust") || normalized.includes("help")) {
    return { answer: "Detailed helper requests are currently available on selected EasyWeb warning demos. For a live website, return home or contact your trusted helper directly if you are unsure." };
  }

  return { answer: "EasyWeb cannot currently read or summarize this live website. I can explain how to return home, open the site separately, or review common warning signs before sharing personal information." };
}

function genericAnswer(): HealthPlusHelpAnswer {
  return {
    answer: "I can help explain what is shown on this page, but detailed answers are currently available only for selected EasyWeb demo pages.",
  };
}

function getAssistantProfile(currentPage: BrowserPage): AssistantProfile {
  if (currentPage.kind === "home") {
    return {
      answer: answerHomeQuestion,
      heading: "Ask EasyWeb",
      intro: "I can help you find a website, understand something online, or decide where to go.",
      placeholder: "For example: How do I search the web?",
      suggestions: homeSuggestions,
    };
  }

  if (currentPage.kind === "site" && currentPage.siteId === "healthplus") {
    return {
      answer: answerHealthPlusQuestion,
      heading: "Ask about this HealthPlus page",
      intro: "Ask about HealthPlus Clinic appointments, hours, insurance, services, or contact details.",
      placeholder: "For example: What are the office hours?",
      suggestions: healthPlusSuggestedQuestions,
    };
  }

  if (currentPage.kind === "site" && currentPage.siteId === "vitaglow") {
    return {
      answer: answerVitaGlowQuestion,
      heading: "Ask about this VitaGlow page",
      intro: "I can explain the warning signs EasyWeb found on this controlled demo store.",
      placeholder: "For example: Why is EasyWeb warning me?",
      suggestions: vitaGlowSuggestions,
    };
  }

  if (currentPage.kind === "site" && currentPage.siteId === "robloxLookalike") {
    return {
      answer: answerLookalikeQuestion,
      heading: "Ask about this address warning",
      intro: "I can explain what EasyWeb noticed about rob1ox.com and how to leave safely.",
      placeholder: "For example: What is different about this address?",
      suggestions: lookalikeSuggestions,
    };
  }

  if (currentPage.kind === "external") {
    return {
      answer: answerExternalQuestion,
      heading: "Help with this external website",
      intro: "EasyWeb can currently provide detailed answers for selected demo pages. Support for understanding live websites is still in development.",
      placeholder: "For example: How do I return home?",
      suggestions: externalSuggestions,
    };
  }

  return {
    answer: genericAnswer,
    heading: "Help with this page",
    intro: "I can help explain what is shown on this page.",
    placeholder: "What would you like help understanding?",
    suggestions: genericSuggestions,
  };
}

export function HelpAssistant({ currentPage }: { currentPage: BrowserPage }) {
  const profile = getAssistantProfile(currentPage);
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
    setResponse(profile.answer(trimmedQuestion));
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
        Ask EasyWeb
      </button>

      {isOpen && (
        <div className="dialog-backdrop">
          <section aria-labelledby="help-title" aria-modal="true" className="help-dialog" role="dialog">
            <div className="dialog-header">
              <div>
                <h2 className="dialog-title" id="help-title">{profile.heading}</h2>
                <p className="dialog-intro">{profile.intro}</p>
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
                    <input autoComplete="off" id="page-help-question" onChange={(event) => setQuestion(event.target.value)} placeholder={profile.placeholder} ref={inputRef} type="text" value={question} />
                    <button disabled={!question.trim()} type="submit">Ask</button>
                  </div>
                </form>
                <div className="help-suggestions" aria-label="Suggested questions">
                  <p>Or choose a question:</p>
                  <div className="help-options">
                    {profile.suggestions.map((suggestion) => (
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
