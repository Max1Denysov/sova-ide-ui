export const initialData = [
  {
    title: 'Основное',
    subNav: [
      [
        { title: 'Редактирование шаблонов', path: '/' },
      ],
      [
        { title: 'Редактирование словарей', path: '/dictionaries/' },
      ],
      [
        { title: 'Выход', path: '/', action: 'logout' },
      ],
    ],
  },
  {
    title: 'Утилиты',
    subNav: [[{ title: 'Замена окончаний слов', path: '#replace' }]],
  },
  {
    title: 'Компиляция',
    path: '/compilation/',
  },
  {
    title: 'Быстрые настройки',
    quickSettings: true,
  },
]
