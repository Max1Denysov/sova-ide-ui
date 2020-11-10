export const compilationPatterns = [
  {
    search: /ERROR:|\[FAILED]/g,
    replace: `<span class="compilation-error">$&</span>`,
  },
  {
    search: /\[WARN]/g,
    replace: `<span class="compilation-warning">$&</span>`,
  },
  {
    search: /\[SUCCESS]/g,
    replace: `<span class="compilation-ok">$&</span>`,
  },
  {
    search: /STRING:|Id:|file:/g,
    replace: `<span class="compilation-param">$&</span>`,
  },
  {
    search: /\*/g,
    replace: `<span class="compilation-category">$&</span>`,
  },
]

export const formatText = (text: string = '', patterns: { search: RegExp; replace: string }[] = []) => {
  let formattedText = text

  if (patterns.length) {
    for (let i = 0; i < patterns.length; i++) {
      formattedText = formattedText.replace(patterns[i]['search'], patterns[i]['replace'])
    }
  }

  if (formattedText.startsWith(`<br>`)) formattedText = formattedText.substring(4)

  return formattedText
}

export const stripTags = (text: string = '') => {
  return text
    .replace(/<br>/gi, `[br]`)
    .replace(/(<([^>]+)>)/gi, '')
    .replace(/\[br]/gi, `<br>`)
}
