type CounterTestCase = {
  taskCount: number;
  expectedText: string;
};

export const TASKS = {
  single: "Fix the flux capacitor",
  singleEdited: "Replace the flux capacitor",
  multiple: [
    "Fix the flux capacitor",
    "Refuel the hovercraft",
    "Debug the quantum compiler",
  ],
  invalid: ["", "   "],
} as const;

export const counterTestCases: CounterTestCase[] = [
  { taskCount: 1, expectedText: "1 item left" },
  { taskCount: 2, expectedText: "2 items left" },
  { taskCount: 3, expectedText: "3 items left" },
];
