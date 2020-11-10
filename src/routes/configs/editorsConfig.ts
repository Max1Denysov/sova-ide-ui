import { IconName, IconPrefix } from '@fortawesome/fontawesome-common-types'

export const editorActions: { name: string; icon: [IconPrefix, IconName]; title: string }[] = [
  {
    name: 'state',
    icon: ['fas', 'power-off'],
    title: 'Изменить активность шаблона',
  },
  {
    name: 'createAfter',
    icon: ['fas', 'plus'],
    title: 'Создать новый шаблон под текущим',
  },
  {
    name: 'copy',
    icon: ['fas', 'copy'],
    title: 'Создать копию шаблона',
  },
  {
    name: 'remove',
    icon: ['fas', 'trash-alt'],
    title: 'Удалить шаблон',
  },
  {
    name: 'discard',
    icon: ['fas', 'ban'],
    title: 'Сбросить несохранённые изменения',
  },
  {
    name: 'save',
    icon: ['far', 'save'],
    title: 'Сохранить изменения',
  },
]

export const templatesFilter: { name: string; id: string }[] = [
  {
    name: 'Активные',
    id: 'showOk',
  },
  {
    name: 'Приостановленные',
    id: 'showAttention',
  },
]

export const editorsSortingConfig: { title: string; type: string }[] = [
  {
    title: 'по дате создания',
    type: 'created',
  },
  {
    title: 'по дате изменения',
    type: 'updated',
  },
  {
    title: 'по позиции',
    type: 'position',
  },
]
