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
      type: 'success',
      background: 'green',
      dismissible: true
    }
  ]
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

function buildSDNF () {
  const vectorInput = document.getElementById('vector').value.trim()
  if (document.querySelector('.output3') != undefined) {
    document.querySelector('.output3').id = 'output0'
    document.getElementById('output0').classList.remove('output3')
  }
  const outputElement = document.getElementById('output0')

  const length = vectorInput.length
  const n = Math.log2(length)

  // Проверки
  if (!/^[01]+$/.test(vectorInput)) {
    notyf.error('Вектор должен содержать только 0 и 1.')
    return
  }

  if (length === 0 || (length & (length - 1)) !== 0) {
    notyf.error('Длина вектора должна быть степенью двойки.')
    return
  }

  // Массив названий переменных
  const variables = []
  for (let i = 0; i < n; i++) {
    variables.push(`x${i + 1}`)
  }

  // Двоичные наборы
  const binaryIndexes = []
  for (let i = 0; i < length; i++) {
    const binary = i.toString(2).padStart(n, '0')
    binaryIndexes.push(binary)
  }

  // Формирование термов
  const terms = []
  for (let i = 0; i < length; i++) {
    if (vectorInput[i] === '1') {
      const binary = i.toString(2).padStart(n, '0')
      const conjunctionParts = []
      for (let j = 0; j < n; j++) {
        const bit = binary[j]
        const styledVar =
          bit === '0'
            ? `<span style="text-decoration: overline">${variables[j]}</span>`
            : variables[j]
        conjunctionParts.push(styledVar)
      }
      terms.push(`(${conjunctionParts.join(' ∧ ')})`)
    }
  }
  outputElement.innerHTML = `${terms.join(' ∨ ') || '0'}`
}
