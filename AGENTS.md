# EasyWeb

## Product Vision

EasyWeb is not a general-purpose browser.

EasyWeb is a browser designed to help older adults browse the internet with confidence.

The goal is to reduce confusion, increase independence, and protect users from common online mistakes without making them feel overwhelmed or incapable.

EasyWeb should feel calm, reassuring, and approachable.

---

# Core Principles

Every feature should support one of these three goals.

## 1. Understand

Help users understand confusing websites.

Examples:

- explain complicated pages in plain language
- answer questions about the current page
- guide users to the information they are looking for
- highlight relevant sections

Do not overwhelm users with unnecessary information.

---

## 2. Stay Safe

Warn users before risky actions.

Examples:

- suspicious shopping websites
- lookalike domains
- phishing attempts
- requests for passwords
- requests for payment information

Warnings should explain *why* they appear.

Never claim with certainty that a website is safe or malicious.

Use language like:

- No obvious warnings found
- Some warning signs found
- Several warning signs found

---

## 3. Stay Independent

EasyWeb should help users complete tasks themselves whenever possible.

Family members should only become involved when necessary.

EasyWeb should never make users feel like they are being monitored.

---

# User Experience

The primary user is an older adult who may be unfamiliar with technology.

Design for people who:

- worry about pressing the wrong button
- are intimidated by modern websites
- want reassurance before making decisions
- may have limited technical experience

The interface should never assume technical knowledge.

---

# Design Principles

- Keep screens calm and uncluttered.
- Large buttons.
- Large typography.
- High contrast.
- Minimize decisions.
- Avoid walls of text.
- Every page should have one obvious next action.

Do not add features simply because they are technically possible.

Simple is almost always better.

---

# Browser Behavior

EasyWeb is a browser shell.

The browser itself is the product.

Do not open external Chrome tabs unless absolutely necessary.

The homepage should feel like a browser home screen rather than a dashboard.

---

# Assistant Behavior

The assistant must always be aware of the current page.

Home:
General browser guidance.

Clinic:
Answer questions about the clinic.

Shopping:
Explain warning signs and product information.

Future pages:
Answer questions only about the currently displayed page.

The assistant should never hallucinate actions or claim it completed tasks.

---

# Helper Philosophy

Helpers support users.

Helpers do not supervise users.

Helper notifications should only occur for meaningful safety events such as:

- suspicious payment requests
- lookalike domains requesting passwords
- explicit "Ask my helper" requests

---

# Engineering

- Use TypeScript.
- Keep components reusable.
- Do not refactor unrelated code.
- Make the smallest possible changes.
- Preserve working functionality.
- Explain implementation plans before coding.
- Summarize changed files after implementation.

Optimize for a polished hackathon demo rather than production complexity.

---

# AI Safety

Never claim to:

- submit forms
- complete purchases
- make appointments
- send emails
- process payments

The AI assists users.

It never impersonates websites.

It never pretends actions were completed.

# Decision Rule

Before implementing a feature, ask:

"Would this genuinely help an older adult browse the web with more confidence?"

If the answer is no, do not implement it.

If there are multiple implementations, prefer the simplest one that demonstrates the idea clearly.