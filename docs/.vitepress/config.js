export default {
  title: 'Toor',
  lang: 'en-US',
  description: 'Toor for LLM evaluations and experiments',
  ignoreDeadLinks: false,
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
            link: '/core/index.md',
            items: [
              { text: 'LLM-as-a-judge', link: '/core/llm-as-a-judge.md' },
              { text: 'LLM experiments', link: '/core/llm-experiments.md' },
              { text: 'Model provider', link: '/core/model-provider.md' },
            ]
          },
          { 
            text: 'CLI', 
            link: '/cli/index.md',
            items: [
              { text: 'LLM experiments', link: '/cli/llm-experiments.md' },
            ]
          },
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