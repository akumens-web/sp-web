export type Game = {
  id: string;
  slug: string;
  name: string;
  status: "origins" | "legacy" | "current";
  accent: string;
  isCurrent?: boolean;
  period?: string;
  externalUrl?: string;
  artwork?: string;
  logo?: string;
};
export const games: Game[] = [
  {
    id: "lineage",
    slug: "lineage-ii",
    name: "Lineage II",
    status: "origins",
    accent: "#b891ff",
  },
  {
    id: "archeage",
    slug: "archeage",
    name: "ArcheAge",
    status: "legacy",
    accent: "#68dbd5",
  },
  {
    id: "bdo",
    slug: "black-desert",
    name: "Black Desert",
    status: "legacy",
    accent: "#d9b581",
  },
  {
    id: "lu4",
    slug: "lu4",
    name: "LU4",
    status: "legacy",
    accent: "#b891ff",
    externalUrl: "https://lu4.org/",
  },
  {
    id: "wow",
    slug: "wow-forever",
    name: "World of Warcraft: Forever",
    status: "current",
    accent: "#70dfff",
    isCurrent: true,
  },
];
export const currentGame = games.find((game) => game.isCurrent)!;
