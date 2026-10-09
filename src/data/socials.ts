// Replace null with your verified community URLs. Missing destinations render as non-links.
export type Social = {
  id: string;
  name: string;
  url: string | null;
  handle?: string;
  description?: string;
};
export const socials: Social[] = [
  { id: "discord", name: "Discord", url: null },
  { id: "telegram", name: "Telegram", url: null },
  { id: "youtube", name: "YouTube", url: null },
  { id: "twitch", name: "Twitch", url: null },
];
