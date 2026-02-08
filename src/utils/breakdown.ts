/**
 * Simulates an AI breakdown of a task into smaller steps.
 * In a real app, this would call an LLM API.
 */
export const simulateTaskBreakdown = async (taskTitle: string): Promise<string[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const lowerTask = taskTitle.toLowerCase();

  if (lowerTask.includes("clean") || lowerTask.includes("room") || lowerTask.includes("house")) {
    return [
      "Declutter surfaces and pick up items from the floor",
      "Dust all furniture and electronics",
      "Vacuum or sweep the entire area",
      "Wipe down windows and mirrors",
      "Take out the trash and replace liners"
    ];
  }

  if (lowerTask.includes("code") || lowerTask.includes("app") || lowerTask.includes("build") || lowerTask.includes("project")) {
    return [
      "Define the core requirements and user stories",
      "Sketch the UI layout and component structure",
      "Set up the project environment and dependencies",
      "Implement the basic functionality and state management",
      "Style the components and add responsive design",
      "Test for bugs and refine the user experience"
    ];
  }

  if (lowerTask.includes("write") || lowerTask.includes("essay") || lowerTask.includes("report")) {
    return [
      "Research the topic and gather key references",
      "Create a detailed outline with main arguments",
      "Write the introductory paragraph and thesis statement",
      "Draft the body paragraphs with supporting evidence",
      "Write the conclusion and summary of findings",
      "Proofread for grammar and clarity"
    ];
  }

  if (lowerTask.includes("cook") || lowerTask.includes("meal") || lowerTask.includes("dinner")) {
    return [
      "Find a recipe and check for available ingredients",
      "Prep all vegetables and proteins (mise en place)",
      "Preheat the oven or prepare the cooking surface",
      "Follow the cooking steps in order",
      "Plate the meal and garnish",
      "Clean up the kitchen workspace"
    ];
  }

  // Generic breakdown for unknown tasks
  return [
    "Research and gather necessary materials",
    "Set up a dedicated workspace",
    "Complete the first 25% of the work",
    "Review progress and adjust plan if needed",
    "Finish the remaining work",
    "Final review and quality check"
  ];
};