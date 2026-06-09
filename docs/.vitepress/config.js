export default {
  title: 'Toor',
  lang: 'en-US',
  description: 'Toor for LLM evaluations and experiments',
  themeConfig: {
    siteTitle: 'Toor',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/gettoor/toor' },
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