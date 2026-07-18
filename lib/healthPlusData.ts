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

type HelpRule = {
  keywords: string[];
  response: () => HealthPlusHelpAnswer;
};

const helpRules: HelpRule[] = [
  {
    keywords: ["appointment", "book", "schedule", "visit"],
    response: () => ({
      answer: `To make or change an appointment, call HealthPlus at ${healthPlusData.appointment.phone}. ${healthPlusData.appointment.note} EasyWeb has not booked or submitted anything for you.`,
      sectionId: healthPlusData.appointment.sectionId,
    }),
  },
  {
    keywords: ["hour", "open", "close", "saturday", "sunday", "weekend"],
    response: () => ({
      answer: `HealthPlus is open ${healthPlusData.hours.weekdays}. It is also open ${healthPlusData.hours.saturday.toLowerCase()} and is ${healthPlusData.hours.sunday.toLowerCase()}.`,
      sectionId: "healthplus-hours",
    }),
  },
  {
    keywords: ["insurance", "medicare", "coverage", "plan", "cost", "pay"],
    response: () => ({
      answer: `The clinic lists ${healthPlusData.insurance.plans.join(", ")} and other major plans. ${healthPlusData.insurance.note}`,
      sectionId: healthPlusData.insurance.sectionId,
    }),
  },
  {
    keywords: ["service", "care", "offer", "diabetes", "blood pressure", "vaccine", "screening", "wellness"],
    response: () => ({
      answer: `HealthPlus offers ${healthPlusData.services.items.join(", ").toLowerCase()}. Call the clinic if you are unsure whether a service is available.`,
      sectionId: healthPlusData.services.sectionId,
    }),
  },
  {
    keywords: ["form", "resource", "patient", "record", "medicine", "medication", "prepare", "bring"],
    response: () => ({
      answer: "The Patient Resources section has information about preparing for a visit, prescription renewals, and medical records. For a visit, bring your photo ID, insurance card, and current medicine list.",
      sectionId: healthPlusData.resources.sectionId,
    }),
  },
  {
    keywords: ["contact", "call", "phone", "address", "location", "directions", "where"],
    response: () => ({
      answer: `Call HealthPlus at ${healthPlusData.phone}. The clinic is at ${healthPlusData.address}.`,
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
  const normalized = question.trim().toLowerCase();
  const rule = helpRules.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword)),
  );

  return rule?.response() ?? {
    answer: `I can help you find appointments, office hours, insurance, services, patient resources, or contact information on this page. For anything else, call HealthPlus at ${healthPlusData.phone}.`,
  };
}
