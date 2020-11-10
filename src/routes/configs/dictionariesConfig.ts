import { IconName, IconPrefix } from '@fortawesome/fontawesome-common-types'

export const dictActions: { name: string; icon: [IconPrefix, IconName]; title: string }[] = [
  {
    name: 'state',
    icon: ['fas', 'power-off'],
    title: 'Изменить активность словаря',
  },
  /*   {
    name: 'copy',
    icon: ['fas', 'plus'],
    title: 'Создать копию словаря',
  }, */
  {
    name: 'remove',
    icon: ['fas', 'trash-alt'],
    title: 'Удалить словарь',
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
