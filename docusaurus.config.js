// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Blog by Eric Lee",
  // tagline: "Dinosaurs are cool",
  url: "https://your-docusaurus-test-site.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/photo.jpg",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "Eric Lee", // Usually your GitHub org/user name.
  projectName: "blog-docusaurus", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Eric Lee",
        logo: {
          alt: "My Site Logo",
          src: "img/photo.jpg",
        },
        items: [
          {
            type: "doc",
            docId: "Database/vertical-scaling",
            position: "left",
            label: "Articles",
          },
          {
            href: "https://www.linkedin.com/in/yi-ting-lee-725237166/",
            label: "Linkedin",
            position: "right",
          },
          {
            href: "https://www.facebook.com/profile.php?id=100005696377210",
            label: "Facebook",
            position: "right",
          },
          {
            href: "https://www.cakeresume.com/656b08",
            label: "Cakeresume",
            position: "right",
          },
          {
            href: "https://github.com/YiTingLee",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Articles",
                to: "/docs/",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                href: "https://www.linkedin.com/in/yi-ting-lee-725237166/",
                label: "Linkedin",
              },
              {
                href: "https://www.facebook.com/profile.php?id=100005696377210",
                label: "Facebook",
              },
              {
                href: "https://github.com/YiTingLee",
                label: "GitHub",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                href: "https://www.cakeresume.com/656b08",
                label: "Cakeresume",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Blog by Eric Lee.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
