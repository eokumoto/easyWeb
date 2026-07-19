"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import {
  answerHealthPlusQuestion,
  healthPlusSuggestedQuestions,
  type HealthPlusHelpAnswer,
} from "@/lib/healthPlusData";
import { matchScriptedIntent, type ScriptedIntent } from "@/lib/scriptedIntents";
import type { BrowserPage } from "@/components/BrowserShell";

type AssistantProfile = {
  answer: (question: string) => HealthPlusHelpAnswer;
  heading: string;
  intro: string;
  placeholder: string;
  suggestions: readonly string[];
};

const homeSuggestions = [
  "How do I search the web?",
  "How can I tell if a website looks suspicious?",
  "What does my trusted helper do?",
  "What should I do when a pop-up appears?",
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
  "Can EasyWeb read this page?",
  "Why did this website not load?",
  "How do I open this website separately?",
  "What should I check before entering personal information?",
];

const genericSuggestions = [
  "What can EasyWeb help me with?",
  "Can you explain this page?",
];

const homeIntents: ScriptedIntent<HealthPlusHelpAnswer>[] = [
  {
    patterns: [
      /\b(password|passcode|login|log in|sign in)\b/,
      /\b(type|enter|share) (my |a |the )?(password|login)\b/,
    ],
    response: () => ({ answer: "Only enter a password when you are confident that you are on the correct official website. Check the website address carefully. If the page arrived through an unexpected message or looks unusual, leave and ask someone you trust." }),
  },
  {
    patterns: [
      /\b(card|credit card|debit card|payment|pay online|checkout)\b/,
      /\b(can|should) i buy\b/,
    ],
    response: () => ({ answer: "Before entering card information, check the website address, seller contact information, return policy, and total price. Avoid continuing when the website creates pressure or shows several warning signs." }),
  },
  {
    patterns: [
      /\bphishing\b/,
      /\bfake (login|sign in|website|site)\b/,
      /\b(scammers?|thieves) cop(y|ies) websites?\b/,
    ],
    response: () => ({ answer: "Phishing is when someone pretends to be a trusted company or person to steal information such as passwords or card numbers. The message or website may look real, but the address or wording is often slightly different." }),
  },
  {
    patterns: [
      /\b(suspicious|scam|scammed|warning signs?)\b/,
      /\b(can i trust|is .* trustworthy|does .* look safe|website safe|site safe)\b/,
      /\bhow (do|can) i (know|tell) .* safe\b/,
    ],
    response: () => ({ answer: "Watch for pressure to act quickly, unusual website addresses, requests for passwords or payment information, missing contact details, and promises that seem too good to be true. When you are unsure, pause before entering personal information." }),
  },
  {
    patterns: [
      /\b(search|searching|find a website|find the website|find something online|search the web)\b/,
      /\b(where|what box) (do|should|can) i type\b/,
      /\b(search box|address box|address bar)\b/,
    ],
    response: () => ({ answer: "Type a website address or a few words into the large search box at the top, then select Go. For example, you could type ‘local pharmacy’ or ‘weather today.’" }),
  },
  {
    patterns: [
      /\b(my |trusted )?helper\b/,
      /\bask (for |someone for )?help\b/,
      /\b(can|does) .* see everything\b/,
      /\bwhat can .* access\b/,
    ],
    response: () => ({ answer: "Your trusted helper can add useful bookmarks and respond when you ask for help. They cannot see your normal browsing or anything you type into forms." }),
  },
  {
    patterns: [/\b(bookmark|bookmarks|saved websites?|website shortcuts?)\b/],
    response: () => ({ answer: "Bookmarks are shortcuts to websites you use often. Your trusted helper can add, edit, or remove them for you." }),
  },
  {
    patterns: [
      /\b(pop up|popup|notifications?|press allow|choose allow|box appeared)\b/,
      /\ballow (this|it|notifications?)\b/,
    ],
    response: () => ({ answer: "Read it slowly before choosing anything. Avoid allowing notifications, downloads, or personal-information requests from unfamiliar websites. Closing the pop-up is usually the safest choice when you are unsure." }),
  },
  {
    patterns: [/\b(return|go|back) home\b/, /\bhome button\b/],
    response: () => ({ answer: "Select Home in the EasyWeb toolbar to return to your bookmarks and the Try demo scenarios option." }),
  },
  {
    patterns: [/\b(go back|back button|arrows?|forward button|previous page|next page)\b/],
    response: () => ({ answer: "Select the left arrow to return to the previous page. Select the right arrow to move forward again after going back." }),
  },
];

const vitaGlowIntents: ScriptedIntent<HealthPlusHelpAnswer>[] = [
  {
    patterns: [/\b(card|credit card|payment|pay|checkout|buy this|purchase)\b/],
    response: () => ({ answer: "EasyWeb found several warning signs, so review them and consider asking a trusted helper before entering card information. This controlled demo never accepts, stores, or sends card details." }),
  },
  {
    patterns: [/\b(refund|return policy|return rules?|money back)\b/],
    response: () => ({ answer: "The refund information is inside Legal information near the bottom of the page. It says requests must be made within 7 days and that return shipping and handling fees are not refunded." }),
  },
  {
    patterns: [/\b(owner|owns|ownership|company|contact|street address|customer support)\b/],
    response: () => ({ answer: "The controlled VitaGlow page does not name the company owner or list a street address. It only mentions online customer support, which makes the seller harder to verify." }),
  },
  {
    patterns: [/\b(countdown|timer|today only|urgency|urgent|pressure|rush|running out|expires?)\b/],
    response: () => ({ answer: "The countdown and ‘today only’ offer create pressure to act quickly. Urgency can make it harder to review the seller, refund policy, and total cost carefully." }),
  },
  {
    patterns: [/\b(exaggerated|claims?|promises?|miracle|too good to be true|younger|health results?|beauty results?)\b/],
    response: () => ({ answer: "VitaGlow promises unusually dramatic health and appearance results in a short time. Claims that seem too good to be true are a reason to pause and look for reliable evidence." }),
  },
  {
    patterns: [/\bwhat (do|should) i check\b/, /\bbefore (buying|i buy|purchasing)\b/],
    response: () => ({ answer: "Before buying, check who owns the company, how to contact it, the full price, independent evidence for the product claims, and the refund policy. Do not let a countdown rush your decision." }),
  },
  {
    patterns: [
      /\b(warning|warning signs?|suspicious|scam|trust|safe)\b/,
      /\bwhy (is|did|does) easyweb warn/,
    ],
    response: () => ({ answer: "EasyWeb noticed dramatic health and beauty promises, a countdown and today-only pressure, unclear company ownership, limited contact details, and refund terms that are hard to find. These signs do not prove the store is a scam, but they are reasons to slow down." }),
  },
];

const lookalikeIntents: ScriptedIntent<HealthPlusHelpAnswer>[] = [
  {
    patterns: [/\b(password|login|log in|sign in|credentials?|enter my information)\b/],
    response: () => ({ answer: "Do not enter your password on rob1ox.com. It uses a lookalike address, so leave the page or choose the familiar roblox.com destination before signing in." }),
  },
  {
    patterns: [/\b(account.*(risk|danger|stolen|hacked)|risk.*account|could .* account)\b/],
    response: () => ({ answer: "Entering a password on a lookalike page could put an account at risk. This does not prove the page is malicious, but EasyWeb recommends leaving without entering any login information." }),
  },
  {
    patterns: [/\b(real|familiar|official|correct) (website|site|address)\b/, /\b(get|go|take me) to roblox\b/],
    response: () => ({ answer: "Choose “Did you mean roblox.com?” in the EasyWeb warning. It opens the controlled familiar-address destination inside EasyWeb." }),
  },
  {
    patterns: [/\b(different|difference|changed|number 1|letter l|address spelling|wrong with the address)\b/],
    response: () => ({ answer: "rob1ox.com uses the number 1, while the familiar address roblox.com uses the letter l. Similar-looking characters can be easy to miss." }),
  },
  {
    patterns: [/\blookalike (website|site|address|domain)\b/, /\bwhat is (a )?lookalike\b/],
    response: () => ({ answer: "A lookalike website uses an address that closely resembles a familiar one, often by swapping similar-looking letters and numbers. Here, rob1ox.com uses 1 where roblox.com uses the letter l." }),
  },
  {
    patterns: [/\b(warning|suspicious|scam|malicious|trust|safe)\b/, /\bwhy (is|did|does) easyweb warn/],
    response: () => ({ answer: "EasyWeb is warning you because rob1ox.com closely resembles the familiar address roblox.com. This does not prove the page is malicious, but deceptive sites sometimes replace letters with similar-looking numbers." }),
  },
];

const externalIntents: ScriptedIntent<HealthPlusHelpAnswer>[] = [
  {
    patterns: [/\b(read|summarize|understand|explain) (this|the) (page|website|site)\b/, /\bwhat (is|does) this page (say|show)\b/],
    response: () => ({ answer: "Detailed page answers are currently available for selected EasyWeb demo pages. Support for understanding live websites is planned for a future version." }),
  },
  {
    patterns: [/\b(not load|did not load|cannot load|blank|blocked|not display|cannot display|why .* load)\b/],
    response: () => ({ answer: "Some websites do not allow themselves to appear inside EasyWeb because of their security settings. Use the visible ‘Having trouble viewing this page?’ option if you want to open the address separately." }),
  },
  {
    patterns: [/\b(open .* separately|new tab|outside easyweb|open it directly)\b/],
    response: () => ({ answer: "Choose ‘Having trouble viewing this page?’ above the website. EasyWeb will show an option to open the address in a new tab, but it will not do so until you choose that action." }),
  },
  {
    patterns: [/\b(personal information|password|payment|card|enter information|before entering|what .* check)\b/],
    response: () => ({ answer: "Check the website address carefully and consider whether you expected the request. Avoid entering passwords, payment details, or personal information if the page looks unusual or pressures you to act quickly." }),
  },
  {
    patterns: [/\b(safe|trust|suspicious|scam)\b/],
    response: () => ({ answer: "EasyWeb cannot verify that a live website is safe. Check that the address is exactly what you expected, and be cautious with pressure, unusual sign-in requests, or requests for personal or payment information." }),
  },
  {
    patterns: [/\b(return|go|back) home\b/, /\bhome button\b/],
    response: () => ({ answer: "Choose Home in the EasyWeb toolbar to return to your bookmarks and demo scenarios." }),
  },
];

function answerHomeQuestion(question: string): HealthPlusHelpAnswer {
  return matchScriptedIntent(question, homeIntents) ?? {
    answer: "I’m not sure how to answer that yet. I can help with searching, bookmarks, browser controls, suspicious websites, passwords, payments, pop-ups, or your trusted helper.",
  };
}

function answerVitaGlowQuestion(question: string): HealthPlusHelpAnswer {
  return matchScriptedIntent(question, vitaGlowIntents) ?? genericDemoAnswer();
}

function answerLookalikeQuestion(question: string): HealthPlusHelpAnswer {
  return matchScriptedIntent(question, lookalikeIntents) ?? genericDemoAnswer();
}

function answerExternalQuestion(question: string): HealthPlusHelpAnswer {
  return matchScriptedIntent(question, externalIntents) ?? {
    answer: "Detailed page answers are currently available for selected EasyWeb demo pages. Support for understanding live websites is planned for a future version.",
  };
}

function genericDemoAnswer(): HealthPlusHelpAnswer {
  return {
    answer: "I couldn’t find an answer for that on this page. Try one of the suggested questions, or ask about the information currently shown.",
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
    answer: genericDemoAnswer,
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
