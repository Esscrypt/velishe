export type BoardId = "mainboard" | "development";

export const BOARD_CONFIG: Record<BoardId, { title: string; description: string }> = {
  mainboard: {
    title: "Mainboard",
    description:
      "The Velishe Mainboard is the signed roster of established fashion and commercial models at Velishe Model Management in Sofia, Bulgaria.",
  },
  development: {
    title: "Development",
    description:
      "The Velishe Development board is the new-face roster at Velishe Model Management in Sofia, Bulgaria — emerging talent building editorial and commercial careers.",
  },
};
