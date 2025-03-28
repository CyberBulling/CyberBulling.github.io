const imageBlocks = document.querySelectorAll('.image-block')

imageBlocks.forEach(block => {
  const normalBlock = block.querySelector('.block')
  const hoverBlock = block.querySelector('.hover')
  const visitedBlock = block.querySelector('.visited')
  const url = block.getAttribute('data-url')

  // Проверка на наличие информации о посещении
  if (localStorage.getItem(url)) {
    hoverBlock.style.backgroundImage = `url(images/${block.id}.png)`
  }

  // Обработчик наведения мыши
  block.addEventListener('mouseover', () => {
    if (localStorage.getItem(url)) {
      normalBlock.style.opacity = '0'
      visitedBlock.style.opacity = '1'
    } else {
      normalBlock.style.opacity = '0'
      hoverBlock.style.opacity = '1'
    }
  })

  // Обработчик ухода мыши
  block.addEventListener('mouseout', () => {
    normalBlock.style.opacity = '1'
    hoverBlock.style.opacity = '0'
    visitedBlock.style.opacity = '0'
  })

  // Обработчик клика
  block.addEventListener('click', () => {
    localStorage.setItem(url, 'visited') // Сохранение информации о посещении
    // Переход по ссылке
    location.href = url
  })
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