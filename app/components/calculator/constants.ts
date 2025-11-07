export const EXPENSE_CATEGORIES = [
  { value: "total", label: "Total" },
  { value: "rent", label: "Rent" },
  { value: "food", label: "Food" },
  { value: "transportation", label: "Transportation" },
  { value: "utilities", label: "Utilities" },
  { value: "insurance", label: "Insurance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "entertainment", label: "Entertainment" },
  { value: "subscriptions", label: "Subscriptions" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
] as const;

export const FEATURE_PILLARS = [
  {
    title: "Crystal-clear cash insights",
    description:
      "Track every recurring expense and income stream with color-coded trends that instantly surface burn risk.",
  },
  {
    title: "Shareable scenarios",
    description:
      "Invite your co-founders or investors to review scenarios side-by-side and align on the same plan in minutes.",
  },
  {
    title: "Actionable alerts",
    description:
      "Receive nudges when your runway dips below thresholds so you can adjust spending before it is too late.",
  },
] as const;

export const WORKFLOW_STEPS = [
  {
    step: "1",
    title: "Map your finances",
    detail:
      "List every recurring cost and the income you expect. We convert them into comparable monthly figures automatically.",
  },
  {
    step: "2",
    title: "Stress test scenarios",
    detail:
      "Tweak hiring plans or pricing changes to see how your runway responds across best and worst-case situations.",
  },
  {
    step: "3",
    title: "Decide with context",
    detail:
      "Export a summary or share a live link when you are ready to brief the team or board.",
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "How accurate is the runway calculation?",
    answer:
      "We use a 30.44-day average month and factor in both expenses and income so you always see a realistic runway estimate.",
  },
  {
    question: "Can I save multiple scenarios?",
    answer:
      "Yes. Sign in to save unlimited versions and revisit them any time. Each scenario keeps its own assumptions intact.",
  },
  {
    question: "Does this work for international currencies?",
    answer:
      "Absolutely. Switch currencies instantly and all results reformat to match without affecting your stored data.",
  },
] as const;

