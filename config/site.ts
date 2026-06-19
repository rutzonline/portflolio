export const siteConfig = {
  name: "Rutuja Rochkari",
  title: "Rutuja Rochkari",
  url: "https://rutujarochkari.com",
  introDocPath: "/Users/rutujarochkari/Documents/intro.txt",
  calBookingUrl: "https://cal.com/rutujarochkari/hi?duration=25",
  /** Set to `false` to restore normal title/menu casing site-wide. */
  forceLowercasePreview: true,
  headshotPath: "/headshot.png",
  /** Bump when replacing headshot.png so browsers pick up the new file. */
  headshotVersion: "3",
};

export function getHeadshotSrc(): string {
  return `${siteConfig.headshotPath}?v=${siteConfig.headshotVersion}`;
}

