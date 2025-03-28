document.getElementById('play').addEventListener('click', function (e) {
  e.preventDefault() // Предотвращаем отправку формы
  window.location.href = 'zads.html'
})

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') == null)
    localStorage.setItem('theme', 'light')

  const themeSwitcher = document.querySelectorAll('#theme')

  themeSwitcher.forEach((element) => {
    element.addEventListener('click', () => {
      document.body.classList.toggle('dark')
      localStorage.setItem(
        'theme',
        document.body.classList.contains('dark') ? 'dark' : 'light'
      )
    })
  })
  if (localStorage.getItem('theme') == 'dark') {
    document.body.classList.add('dark')
  }
})