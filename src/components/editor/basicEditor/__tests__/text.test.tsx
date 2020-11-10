import { formatText, stripTags } from '../text'

describe('BasicEditor utils tests', () => {
  it('returns correct values', () => {
    const textMock = `<br><br>`
    const patternMock = [{
      search: /<br><br>/g,
      replace: `<br> <br>`,
    }]
    expect(formatText(textMock, patternMock)).toEqual(` <br>`)
    expect(formatText(textMock)).toEqual(`<br>`)
    expect(formatText()).toEqual('')
  })

  it('returns correct values', () => {
    const textMock = `<br><div>TEST</div>`
    expect(stripTags(textMock)).toEqual(`<br>TEST`)
    expect(stripTags()).toEqual('')
  })
})