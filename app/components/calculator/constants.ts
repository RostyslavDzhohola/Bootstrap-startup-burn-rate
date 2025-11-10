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
      "List every recurring cost and every recurring income; we'll calculate how long your runway is.",
  },
  {
    step: "2",
    title: "Save the Clock",
    detail:
      "Save it as your homepage to increase urgency and push yourself harder.",
  },
  {
    step: "3",
    title: "Decide with context",
    detail:
      "Based on how long your runway is, decide how to reduce expenses, increase savings, or consider a cheaper city. Recommendation: check cities on Nomads.com to extend your run.",
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "How accurate is the runway calculation?",
    answer:
      "This is a rough estimation to give you an idea and create urgency to work harder.",
  },
  {
    question: "Can I have multiple clocks?",
    answer:
      "No, you can only have one clock at a time because you need to stay focused.",
  },
  {
    question: "Do you save my income, expenses, or total cash?",
    answer: "No, we only save the clock end date.",
  },
] as const;

