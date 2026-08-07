export type BoardId = "mainboard" | "development";

export const BOARD_CONFIG: Record<BoardId, { title: string; description: string }> = {
  mainboard: {
    title: "Mainboard",
    description:
      "Meet the main board of Velishe Model Management — established fashion and commercial talent represented in Sofia, Bulgaria.",
  },
  development: {
    title: "Development",
    description:
      "Discover the development board of Velishe Model Management — new faces and emerging talent in Sofia, Bulgaria.",
  },
};
