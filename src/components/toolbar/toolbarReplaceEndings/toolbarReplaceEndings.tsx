import React, { PureComponent } from 'react'
import CustomInput from '../../common/customInput'
import { OrderedSet } from 'immutable'
import ScrollbarCustom from '../../common/customScrollbar'
import Icon from '../../common/icon'
import FileSaver from 'file-saver'

interface ToolbarReplaceEndingsState {
  endings: OrderedSet<string>
  words: OrderedSet<string>
  result: string
  resultWithTags: string
  copyState: boolean
}

class ToolbarReplaceEndings extends PureComponent<{}, ToolbarReplaceEndingsState> {
  state = {
    endings: OrderedSet(['ый', 'ий', 'ой', 'ая', 'ое', 'ые']),
    words: OrderedSet<string>(),
    result: '',
    resultWithTags: '',
    copyState: false,
  }

  handleSubmit = (value: string) => {
    const word = value
      .replace(/( , )/g, ' ')
      .replace(/(, )/g, ' ')
      .replace(/(,)/g, ' ')
      .replace(/( {2})/g, ' ')

    if (word.includes(' ')) {
      this.setState((prevState: any) => ({ words: prevState.words.concat(word.split(' ')) }))
    } else {
      this.setState((prevState) => ({ words: prevState.words.add(word) }))
    }
  }

  removeWord = (word: string) => {
    this.setState((prevState) => ({ words: prevState.words.delete(word) }))
  }

  replaceEndings = () => {
    let result = ''
    let resultWithTags = ''

    this.state.words.forEach((word) => {
      if (word) {
        this.state.endings.forEach((end) => {
          if (end && word.includes(end)) {
            const modifiedWord = word.replace(end, '~')
            if (!result.includes(modifiedWord)) {
              result = result.concat(`${modifiedWord}\n`)
              resultWithTags = resultWithTags.concat(`<div>${modifiedWord}</div>`)
            }
            return false
          }
        })
      }
    })

    this.setState(() => ({ result: result, resultWithTags: resultWithTags }))
  }

  saveFile = () => {
    const blob = new Blob([this.state.result], { type: 'text/plain;charset=utf-8' })
    FileSaver.saveAs(blob, `replaced_endings_${Date.now()}.txt`)
  }

  copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.state.result)
      this.setState(
        () => ({ copyState: true }),
        () => {
          setTimeout(() => this.setState(() => ({ copyState: false })), 2000)
        }
      )
    }
  }

  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<ToolbarReplaceEndingsState>) {
    if (prevState.words !== this.state.words) {
      this.replaceEndings()
    }
  }

  render() {
    const { endings, words, result, resultWithTags, copyState } = this.state
    return (
      <ScrollbarCustom className="toolbar-category utility-replace active">
        <li className="toolbar-category utility-replace active">
          <div className="toolbar-category-inner">
            <div className="toolbar-block-selector">
              <span className="toolbar-category-toggle active">Окончания для замены</span>
            </div>
            <ul className="replace-endings">
              {endings.map((ending, index) => (
                <li key={index} className="replace-item">
                  —{ending}
                </li>
              ))}
            </ul>
            <div className="toolbar-block-selector">
              <span className="toolbar-category-toggle active">Слова для обработки</span>
            </div>
            {words.size > 0 && (
              <ul className="replace-words">
                {words.map(
                  (word, index) =>
                    word && (
                      <li key={index} className="replace-item" onClick={() => this.removeWord(word)}>
                        {word}
                      </li>
                    )
                )}
              </ul>
            )}
            <CustomInput
              value=""
              onSubmit={this.handleSubmit}
              disabled={false}
              clearOnSubmit={true}
              defaultPlaceholder="Введите слово или слова"
            />
            {result.length > 0 && (
              <>
                <div className="toolbar-block-selector">
                  <span className="toolbar-category-toggle active">Результат</span>
                  <button
                    onClick={this.saveFile}
                    className="toolbar-category-toggle toolbar-category-toggle_save"
                    title="Скачать в формате .TXT"
                  >
                    <Icon icon={['fas', 'download']} />
                  </button>
                  <button
                    onClick={this.copyToClipboard}
                    className={`toolbar-category-toggle toolbar-category-toggle_copy${copyState ? ' active' : ''}`}
                    title={copyState ? 'Скопировано!' : 'Скопировать в буфер обмена'}
                  >
                    <Icon icon={['fas', copyState ? 'check' : 'copy']} />
                  </button>
                </div>
                <div className="replace-result" dangerouslySetInnerHTML={{ __html: resultWithTags }} />
              </>
            )}
          </div>
        </li>
      </ScrollbarCustom>
    )
  }
}

export default ToolbarReplaceEndings
