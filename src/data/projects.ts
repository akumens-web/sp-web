export type Project = {
  id: string;
  name: string;
  status: "development" | "experimental";
  icon: "bot" | "layers" | "chart";
  tags: string[];
  url?: string;
  repositoryUrl?: string;
};
export const projects: Project[] = [
  {
    id: "anika",
    name: "ANIKA",
    status: "development",
    icon: "bot",
    tags: ["Discord", "Telegram", "automation"],
  },
  {
    id: "addon",
    name: "SHAWARMA PATROL ADDON",
    status: "development",
    icon: "layers",
    tags: ["World of Warcraft", "community", "integration"],
  },
  {
    id: "market",
    name: "BLACK MARKETER",
    status: "experimental",
    icon: "chart",
    tags: ["economy", "auctions", "analysis"],
  },
];
