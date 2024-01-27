import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Valideer",
  description:
    "Valideer `válədɪ́ː` is a wrapper for [class-transformer-validator](https://github.com/MichalLytek/class-transformer-validator) providing validation and parsing middleware and helper types for [Express](https://github.com/expressjs/express) and [Koa](https://github.com/koajs/koa)",
  themeConfig: {
    search: {
      provider: "local",
    },
    nav: [
      { text: "Home", link: "/" },
      { text: "Getting started", link: "/getting-started" },
      { text: "Docs", link: "/body-middleware" },
    ],

    sidebar: [
      {
        text: "Instructions",
        items: [{ text: "Getting started", link: "/getting-started" }],
      },
      {
        text: "Middlewares",
        items: [
          { text: "Body middleware", link: "/body-middleware" },
          { text: "Query middleware", link: "/query-middleware" },
          { text: "Parameters middleware", link: "/parameters-middleware" },
        ],
      },
      {
        text: "External resources",
        items: [
          {
            text: "class-transformer-validator",
            link: "https://github.com/MichalLytek/class-transformer-validator",
          },
          {
            text: "class-transformer",
            link: "https://github.com/typestack/class-transformer",
          },
          {
            text: "class-validator",
            link: "https://github.com/typestack/class-validator",
          },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/liamederzeel/valideer" },
    ],
  },
});
