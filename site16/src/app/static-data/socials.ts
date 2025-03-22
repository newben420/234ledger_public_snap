class Social {
  keyword!: string;
  platform!: string;
  icon!: string;
  url!: string;
}

export const socialLInks: Social[] = [
  {
    icon: "bi bi-twitter-x",
    keyword: "socials.follow",
    platform: "X",
    url: "https://x.com/234ledger"
  },
  {
    icon: "bi bi-envelope-fill",
    keyword: "socials.mail",
    platform: "Email",
    url: "mailto:admin@234ledger.com.ng"
  },
  {
    icon: "bi bi-telegram",
    keyword: "socials.join",
    platform: "Telegram",
    url: "https://t.me/ng234ledger"
  },
];
