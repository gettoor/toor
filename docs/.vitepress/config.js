export default {
  title: 'Toor',
  lang: 'en-US',
  description: 'Toor for LLM evaluations and experiments',
  themeConfig: {
    siteTitle: 'Toor',
    outline: 'deep',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/gettoor/toor' },
    ],

    sidebar: [
      {
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Getting started', link: '/getting-started.md' },
          { text: 'CLI', link: '/cli.md' },
          { 
            text: 'Core',
            link: '/core.md',
            items: [
              { text: 'LLM-as-a-judge', link: '/llm-as-a-judge.md' },
              { text: 'LLM experimentation', link: '/llm-experimentation.md' },
              { text: 'Model provider', link: '/model-provider.md' },
            ]
          },
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