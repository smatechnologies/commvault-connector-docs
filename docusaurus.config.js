// @ts-check
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'SMA Technologies Help',
  tagline: 'CommVault Connector',
  url: 'https://help.smatechnologies.com',
  baseUrl: '/opcon/connectors/commvault/',
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  favicon: 'img/favicon.ico',
  organizationName: 'smatechnologies',
  projectName: 'commvault-connector-docs',

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          breadcrumbs: true,
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/smatechnologies/commvault-connector-docs/blob/main',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        gtag: {
          trackingID: 'G-7XYMFXX81Y',
          anonymizeIP: false,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Help',
        logo: {
          alt: 'SMA Technologies Help Logo',
          src: 'img/logo.svg',
          href: 'https://help.smatechnologies.com',
        },
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} SMA Technologies.`,
      },
      docs: {
        sidebar: {
          autoCollapseCategories: true,
        },
      },
    }),

  plugins: [
    [
      require.resolve('@cmfcmf/docusaurus-search-local'),
      {},
    ],
  ],
};

module.exports = config;
