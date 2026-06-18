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
          { text: 'Getting started', link: '/' },
          { 
            text: 'Core',
            link: '/core.md',
            items: [
              { text: 'LLM-as-a-judge', link: '/llm-as-a-judge.md' },
              { text: 'LLM experiments', link: '/llm-experiments.md' },
              { text: 'Model provider', link: '/model-provider.md' },
            ]
          },
          { text: 'CLI', link: '/cli.md' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'API Reference', link: '/api/README.md' },
          { text: 'CLI reference', link: '/cli-reference.md' },
        ],
      },
    ],

    search: {
      provider: 'local'
    }    
  },
};