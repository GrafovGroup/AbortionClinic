export type TextPair = [string, string];
export type CityGuide = {
  slug: string;
  province: string;
  updated: string;
  title: TextPair;
  description: TextPair;
  booking: TextPair;
  source: {url: string; frUrl?: string; label: TextPair};
  surrounding?: string[];
  aliases?: string[];
  regionalProviderIds?: string[];
};
