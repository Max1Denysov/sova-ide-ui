import { Map, List } from 'immutable'
import { DictItem } from '../components/dictionaries/dictionariesItem/dictionariesItem'
import { RandomObject } from '../@types/common'
import { setStatusBarNotification } from '../store/dispatcher'

const isMatching = (templateName: string, chunk: string) => {
  return templateName.toLowerCase().indexOf(chunk.toLowerCase()) > -1
}

const filterList = (elem: string, val: string | string[] | List<string>) => {
  if (typeof val === 'string') {
    return isMatching(elem, val)
  } else if (typeof val === 'object') {
    return val.every((valItem: any) => isMatching(elem, valItem))
  } else {
    return val
  }
}

const moveCursorToEnd = (el: any) => {
  if (typeof el.selectionStart == 'number') {
    el.selectionStart = el.selectionEnd = el.value.length
    el.focus()
  }
}

const waitFor = (delay: number = 0) => new Promise((resolve) => setTimeout(resolve, delay))

const repeatIfFalse = async (func: () => boolean, repeatAfter: number) => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const result = func()
      if (result) {
        clearInterval(interval)
        resolve()
      }
    }, repeatAfter)
  })
}

const notifyWithDelay = (args: RandomObject, delay: number = 600) => {
  setTimeout(() => {
    setStatusBarNotification({ ...args })
  }, delay)
}

const getDate = (timestamp: string | number, showTime: boolean = false) => {
  if (typeof timestamp === 'string' && !parseInt(timestamp)) return timestamp

  const multiplier =
    typeof timestamp === 'string' ? (timestamp.length === 10 ? 1000 : 1) : timestamp.toString().length === 10 ? 1000 : 1
  const date = new Date((typeof timestamp === 'string' ? parseInt(timestamp) : timestamp) * multiplier)
  const dd = date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString()
  const mm = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()
  const yyyy = date.getFullYear().toString()

  let result = `${dd}.${mm}.${yyyy}`

  if (showTime) {
    const hours = date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours().toString()
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes().toString() : date.getMinutes().toString()
    result = result.concat(`, ${hours}:${minutes}`)
  }

  return result
}

const sortByTitle = (a: DictItem, b: DictItem) => {
  return a.code !== b.code ? a.code.localeCompare(b.code) : a.id.localeCompare(b.id)
}

const sortByDate = (a: DictItem, b: DictItem) => {
  return a.updated !== b.updated ? (a.updated < b.updated ? -1 : 1) : sortByTitle(a, b)
}

const sortDicts = (files: DictItem[], filesCategory: string, sorting: Map<any, any>) => {
  const sortType = sorting.getIn([filesCategory, 'sortType'])

  let output = files.sort((a: DictItem, b: DictItem) => {
    if (sortType === 'date') {
      return sortByDate(a, b)
    } else {
      return sortByTitle(a, b)
    }
  })

  if (!sorting.getIn([filesCategory, 'isAsc'])) output.reverse()

  return output
}

export {
  filterList,
  moveCursorToEnd,
  waitFor,
  repeatIfFalse,
  notifyWithDelay,
  sortDicts,
  getDate,
}
