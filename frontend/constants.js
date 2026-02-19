// Subject IDs match your backend data file names
export const SUBJECTS = {
  10: [
    { id: "class10_maths_basic", name: "Mathematics (Basic)", icon: "📐" },
    {
      id: "class10_maths_standard",
      name: "Mathematics (Standard)",
      icon: "📐",
    },
    { id: "class10_science", name: "Science", icon: "🧪" },
    { id: "class10_ss", name: "Social Science", icon: "🌍" },
    { id: "class10_english", name: "English", icon: "📖" },
    { id: "class10_hindi", name: "Hindi", icon: "📜" },
  ],
  "12-Science": [
    { id: "class12_physics", name: "Physics", icon: "⚛️" },
    { id: "class12_chemistry", name: "Chemistry", icon: "⚗️" },
    { id: "class12_maths", name: "Mathematics", icon: "🔢" },
    { id: "class12_biology", name: "Biology", icon: "🧬" },
  ],
  "12-Commerce": [
    { id: "class12_accounts", name: "Accountancy", icon: "📊" },
    { id: "class12_bst", name: "Business Studies", icon: "💼" },
    { id: "class12_eco", name: "Economics", icon: "📈" },
  ],
  "12-Arts": [
    { id: "class12_history", name: "History", icon: "🏛️" },
    { id: "class12_polsci", name: "Political Science", icon: "⚖️" },
    { id: "class12_geo", name: "Geography", icon: "⛰️" },
    { id: "class12_soc", name: "Sociology", icon: "🤝" },
  ],
};

export const MOCK_EXAM_SECTIONS = [
  {
    title: "Section A: Multiple Choice Questions (1 Mark Each)",
    questions: [
      {
        id: 1,
        text: "Define the relationship between the fundamental variables in the given scenario.",
        marks: 1,
      },
      {
        id: 2,
        text: "Identify the primary cause of the historical shift discussed in Chapter 4.",
        marks: 1,
      },
      {
        id: 3,
        text: "Which of the following represents the correct formula for the resultant vector?",
        marks: 1,
      },
      {
        id: 4,
        text: "Determine the missing coefficient in the balanced chemical equation.",
        marks: 1,
      },
      {
        id: 5,
        text: "What is the significance of the preamble in the context of global governance?",
        marks: 1,
      },
    ],
  },
  {
    title: "Section B: Short Answer Questions (3 Marks Each)",
    questions: [
      {
        id: 6,
        text: "Explain the mechanism of cellular respiration with the help of a flow chart.",
        marks: 3,
      },
      {
        id: 7,
        text: "Describe the economic impact of the Industrial Revolution on local artisans.",
        marks: 3,
      },
      {
        id: 8,
        text: "Solve the following quadratic equation using the discriminant method.",
        marks: 3,
      },
    ],
  },
  {
    title: "Section C: Long Answer Questions (5 Marks Each)",
    questions: [
      {
        id: 9,
        text: "Discuss the role of the central bank in controlling inflation within a developing economy.",
        marks: 5,
      },
      {
        id: 10,
        text: "Critically analyze the literary devices used by the author to portray the theme of isolation.",
        marks: 5,
      },
    ],
  },
];
