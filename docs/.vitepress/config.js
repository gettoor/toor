export default {
  title: 'Toor',
  lang: 'en-US',
  description: 'Toor for LLM evaluations and experiments',
  themeConfig: {
    siteTitle: 'Toor',

    socialLinks: [
      // You can add any icon from simple-icons (https://simpleicons.org/):
      { icon: 'github', link: 'https://github.com/orgs/gettoor/repositories' },
    ],

    sidebar: [
      {
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Getting started', link: '/getting-started.md' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'API Reference', link: '/api/README.md' },
        ],
      },
    ],

    search: {
      provider: 'local'
    }    
  },
};