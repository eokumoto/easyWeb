import { matchScriptedIntent, type ScriptedIntent } from "@/lib/scriptedIntents";

export const healthPlusData = {
  phone: "(555) 014-2200",
  address: "125 Garden Avenue, Springfield",
  hours: {
    weekdays: "Monday through Friday, 8:00 AM to 5:00 PM",
    saturday: "Saturday, 9:00 AM to 12:00 PM for urgent visits",
    sunday: "Closed Sunday",
  },
  appointment: {
    sectionId: "healthplus-appointments",
    phone: "(555) 014-2200",
    note: "Please have your insurance card and a list of your medicines nearby when you call.",
  },
  insurance: {
    sectionId: "healthplus-insurance",
    plans: ["Medicare", "Blue Cross", "Aetna", "UnitedHealthcare"],
    note: "Coverage varies by plan. Call your insurance company or the clinic before your visit to confirm.",
  },
  services: {
    sectionId: "healthplus-services",
    items: [
      "Annual wellness visits",
      "Primary and preventive care",
      "Diabetes and blood pressure support",
      "Vaccinations and routine screenings",
      "Same-day care for minor illnesses",
      "Medication review",
    ],
  },
  resources: {
    sectionId: "healthplus-resources",
  },
  contact: {
    sectionId: "healthplus-contact",
  },
} as const;

export type HealthPlusHelpAnswer = {
  answer: string;
  sectionId?: string;
};

const helpRules: ScriptedIntent<HealthPlusHelpAnswer>[] = [
  {
    patterns: [
      /\b(appointment|schedule|book|booking|make a visit|change my visit)\b/,
      /\b(can|will) easyweb (make|book|schedule|confirm)/,
    ],
    response: () => ({
      answer: `To make or change an appointment, call HealthPlus at ${healthPlusData.appointment.phone}. ${healthPlusData.appointment.note} EasyWeb cannot submit, book, or confirm an appointment for you.`,
      sectionId: healthPlusData.appointment.sectionId,
    }),
  },
  {
    patterns: [/\b(hours?|open|close|closing|saturday|sunday|weekend)\b/],
    response: () => ({
      answer: `HealthPlus is open ${healthPlusData.hours.weekdays}. It is also open ${healthPlusData.hours.saturday.toLowerCase()} and is ${healthPlusData.hours.sunday.toLowerCase()}.`,
      sectionId: "healthplus-hours",
    }),
  },
  {
    patterns: [/\b(insurance|medicare|coverage|health plan|aetna|blue cross|unitedhealthcare)\b/],
    response: () => ({
      answer: `The clinic lists ${healthPlusData.insurance.plans.join(", ")} and other major plans. ${healthPlusData.insurance.note}`,
      sectionId: healthPlusData.insurance.sectionId,
    }),
  },
  {
    patterns: [
      /\b(services?|care offered|treat|treatment|diabetes|blood pressure|vaccinations?|vaccines?|screenings?|wellness)\b/,
      /\bwhat (do|does|can) (they|the clinic|healthplus) (offer|provide|help with)\b/,
    ],
    response: () => ({
      answer: `HealthPlus offers ${healthPlusData.services.items.join(", ").toLowerCase()}. Call the clinic if you are unsure whether a service is available.`,
      sectionId: healthPlusData.services.sectionId,
    }),
  },
  {
    patterns: [
      /\b(what to bring|should i bring|prepare for|preparing for|photo id|insurance card|medicine list|medication list)\b/,
      /\b(what do i need|take with me|need for my visit)\b/,
      /\b(patient resources?|medical records?|prescription renewals?)\b/,
    ],
    response: () => ({
      answer: "The Patient Resources section has information about preparing for a visit, prescription renewals, and medical records. For a visit, bring your photo ID, insurance card, and current medicine list.",
      sectionId: healthPlusData.resources.sectionId,
    }),
  },
  {
    patterns: [
      /\b(phone|phone number|telephone|call|contact number)\b/,
      /\b(contact|reach) (healthplus|the clinic|clinic|them)\b/,
    ],
    response: () => ({
      answer: `Call HealthPlus at ${healthPlusData.phone}.`,
      sectionId: healthPlusData.contact.sectionId,
    }),
  },
  {
    patterns: [
      /\b(location|located|address|directions)\b/,
      /\bwhere (is|are) (healthplus|the clinic|they)\b/,
    ],
    response: () => ({
      answer: `HealthPlus is located at ${healthPlusData.address}.`,
      sectionId: healthPlusData.contact.sectionId,
    }),
  },
];

export const healthPlusSuggestedQuestions = [
  "How do I make an appointment?",
  "What are the office hours?",
  "Do they accept Medicare?",
  "What should I bring to my visit?",
];

export function answerHealthPlusQuestion(question: string): HealthPlusHelpAnswer {
  return matchScriptedIntent(question, helpRules) ?? {
    answer: "I couldn’t find an answer for that on this page. Try one of the suggested questions, or ask about the information currently shown.",
  };
}
