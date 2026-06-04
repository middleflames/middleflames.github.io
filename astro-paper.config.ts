import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://middleflames.github.io/",
    title: "Hao's Output Layer",
    description: "A place to output",
    author: "Hao Wang",
    profile: "https://middleflames.github.io/about/",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "America/New_York",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: false,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/middleflames/middleflames.github.io/edit/main/",
    },
    search: "pagefind",
  },
  socials: [{ name: "github", url: "https://github.com/middleflames" }],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
