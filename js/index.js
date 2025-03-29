if (document.getElementById('play')) {
  document.getElementById('play').addEventListener('click', function (e) {
    e.preventDefault() // Предотвращаем отправку формы
    window.location.href = 'zads.html'
  })
}
const notyf = new Notyf({
  duration: 3000,
  position: {
    x: 'right',
    y: 'top'
  },
  types: [
    {
      type: 'error',
      background: 'red',
      dismissible: true
    },
    {
      type: 'warning',
      background: 'orange',
      icon: {
        className: 'material-symbols-outlined',
        tagName: 'span',
        text: 'priority_high',
        color: 'grey'
      }
    },
    {
      type: 'success',
      background: 'green',
      dismissible: true
    }
  ]
})

document.addEventListener('DOMContentLoaded', () => {
  const themeSwitch = document.getElementById('theme-checkbox')
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')

  // Проверяем сохраненную тему или системные настройки
  const currentTheme =
    localStorage.getItem('theme') ||
    (prefersDarkScheme.matches ? 'dark' : 'light')

  // Устанавливаем начальное состояние
  if (currentTheme === 'dark') {
    document.body.classList.add('dark')
    themeSwitch.checked = true
  }

  // Обработчик переключения темы
  themeSwitch.addEventListener('change', function () {
    const newTheme = this.checked ? 'dark' : 'light'
    document.body.classList.toggle('dark', this.checked)
    localStorage.setItem('theme', newTheme)

    // Обновляем цвет иконок
    updateIconColors(newTheme)
  })

  // Функция для обновления цветов иконок
  function updateIconColors (theme) {
    const icons = document.querySelectorAll(
      '.theme-switch__icon, .theme-switch__icon-sun, .theme-switch__icon-moon'
    )
    icons.forEach(icon => {
      icon.style.color = theme === 'dark' ? '#ffffff' : '#333333'
    })
  }

  // Инициализация цветов
  updateIconColors(currentTheme)
})
