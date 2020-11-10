const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['public/**/*.html', './src/**/*.html', './src/**/*.vue', './src/**/*.jsx', './src/**/*.tsx'],
  /*   extractors: [
    {
      extractor: class {
        static extract(content) {
          return content.match(/[A-Za-z0-9-_:/]+/g) || []
        }
      },
      extensions: ['html', 'vue', 'jsx', 'tsx'],
    },

  ], */
  defaultExtractor: (content) => {
    // Capture as liberally as possible, including things like `h-(screen-1.5)`
    const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []

    // Capture classes within other delimiters like .block(class="w-1/2") in Pug
    const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || []

    return broadMatches.concat(innerMatches)
  },
  whitelistPatterns: [
    /(theme)[A-Za-z0-9-_:/]+/g,
    /(text)[0-9-_:/]+/gim,
    /(text-11)/gim,
    /(text-13)/gim,
    /(text-11)/gim,
    /(text-15)/gim,
  ],
  whitelistPatternsChildren: [/infsFrame$/, /editorsFilter$/],
})
module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-advanced-variables'),
    require('tailwindcss')(`./tailwind/tailwind.${process.env.REACT_APP_TAILWIND_CONFIG || 'default'}.config.js`),
    require('postcss-nested'),
    require('autoprefixer'),
    process.env.NODE_ENV === 'production' ? purgecss : '',
  ],
}
