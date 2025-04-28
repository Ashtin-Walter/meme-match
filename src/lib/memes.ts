// Define the meme type
export type Meme = {
  id: number;
  name: string;
  path: string;
};

// Get basePath from environment or Next config
const basePath = '/games/original/meme-match';

// Real meme data
export const MEMES: Meme[] = [
  { id: 1, name: "Doge", path: `${basePath}/memes/doge.jpg` },
  { id: 2, name: "Distracted Boyfriend", path: `${basePath}/memes/distracted-boyfriend.jpg` },
  { id: 3, name: "Woman Yelling at Cat", path: `${basePath}/memes/woman-yelling-cat.jpg` },
  { id: 4, name: "This Is Fine", path: `${basePath}/memes/this-is-fine.jpg` },
  { id: 5, name: "Expanding Brain", path: `${basePath}/memes/expanding-brain.jpg` },
  { id: 6, name: "Roll Safe", path: `${basePath}/memes/roll-safe.jpg` },
  { id: 7, name: "Confused Math Lady", path: `${basePath}/memes/confused-math-lady.jpg` },
  { id: 8, name: "Evil Kermit", path: `${basePath}/memes/evil-kermit.jpg` },
];

// Function to get all memes
export function getAllMemes(): Meme[] {
  return MEMES;
}

// Function to get a specific meme by ID
export function getMemeById(id: number): Meme | undefined {
  return MEMES.find(meme => meme.id === id);
}