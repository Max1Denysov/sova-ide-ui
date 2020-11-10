import { IconName, IconPrefix } from '@fortawesome/fontawesome-common-types'

export const links: {
  name: string
  link: string
  icon: [IconPrefix, IconName]
  iconProps: object
}[] = [
  {
    name: 'Шаблоны',
    link: '/',
    icon: ['far', 'file-alt'],
    iconProps: {
      size: '2x',
    },
  },
  {
    name: 'Словари',
    icon: ['fas', 'book'],
    link: '/dictionaries/',
    iconProps: {
      size: '2x',
    },
  },
  {
    name: 'Компиляция',
    icon: ['fas', 'code-branch'],
    link: '/compilation/',
    iconProps: {
      size: '2x',
    },
  },
]

export const menuLinks: { name: string; link: string; icon: [IconPrefix, IconName]; iconProps: object }[] = [
  {
    name: 'Настройки',
    link: '/settings/common/',
    icon: ['fas', 'cog'],
    iconProps: {
      size: 'lg',
    },
  },
  {
    name: 'Профиль',
    icon: ['fas', 'user-edit'],
    link: '/settings/profile/',
    iconProps: {
      size: 'lg',
    },
  },
  {
    name: 'Выйти из учётной записи',
    icon: ['fas', 'door-open'],
    link: '/',
    iconProps: {
      size: 'lg',
    },
  },
]

export const settingsLinks: { name: string; link: string }[] = [
  {
    name: 'Общие настройки',
    link: '/settings/common/',
  },
  {
    name: 'Профиль',
    link: '/settings/profile/',
  },
]

export const templateActions: { title: string; name: string; icon: [IconPrefix, IconName]; color: string }[] = [
  {
    title: 'Удалить выбранные наборы',
    name: 'removeSuites',
    icon: ['fas', 'times-circle'],
    color: 'red',
  },
  {
    title: 'Изменить статус выбранных наборов',
    name: 'pauseSuites',
    icon: ['fas', 'dot-circle'],
    color: 'yellow',
  },
  {
    title: 'Добавить новый набор',
    name: 'addSuite',
    icon: ['fas', 'plus-circle'],
    color: 'green',
  },
]

export const dictionaryActions: { title: string; name: string; icon: [IconPrefix, IconName]; color: string }[] = [
  {
    title: 'Удалить выбранные словари',
    name: 'removeDicts',
    icon: ['fas', 'times-circle'],
    color: 'red',
  },
  {
    title: 'Изменить статус выбранных словарей',
    name: 'pauseDicts',
    icon: ['fas', 'dot-circle'],
    color: 'yellow',
  },
  {
    title: 'Добавить новый словарь',
    name: 'addDict',
    icon: ['fas', 'plus-circle'],
    color: 'green',
  },
]

export const suitesSortingConfig: { title: string; type: string }[] = [
  {
    title: 'Название',
    type: 'title',
  },
  {
    title: 'Изменено',
    type: 'date',
  },
  {
    title: 'Кол-во',
    type: 'count',
  },
]

export const dictsSortingConfig: { title: string; type: string }[] = [
  {
    title: 'Название',
    type: 'title',
  },
  {
    title: 'Изменено',
    type: 'date',
  },
]
