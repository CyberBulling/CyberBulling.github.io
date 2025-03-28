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

function VectorFunction (
  zeroResidual,
  oneResidual,
  argumentIndex,
  number_of_variables
) {
  let resultVector = []
  if (argumentIndex === 1) {
    resultVector = zeroResidual.concat(oneResidual)
    return resultVector
  } else if (argumentIndex === number_of_variables) {
    for (let i = 0; i < zeroResidual.length; i++) {
      resultVector.push(zeroResidual[i])
      resultVector.push(oneResidual[i])
    }
    // console.log(resultVector);
    return resultVector
  } else {
    const blocksCount = 2 ** (argumentIndex - 1)
    const step = zeroResidual.length / blocksCount
    for (let i = 0; i < blocksCount; i++) {
      const zeroBlock = zeroResidual.slice(i * step, (i + 1) * step)
      const oneBlock = oneResidual.slice(i * step, (i + 1) * step)
      resultVector.push(...zeroBlock, ...oneBlock)
    }
    return resultVector
  }
}

const zeroResidualInput = document.getElementById('nullvector')
zeroResidualInput.addEventListener('change', event => {
  const input = event.target.value
  if (!isBinary(input)) {
    // Фильтруем только '0' и '1'
    const filtered = input
      .split('')
      .filter(char => char === '0' || char === '1')
      .join('')
    // Обновляем значение в поле ввода
    event.target.value = filtered
    // Показываем предупреждение только если были удалены символы
    if (filtered !== input) {
      notyf.error('Неверный ввод. Разрешены только 0 и 1')
    }
  }
})
const oneResidualInput = document.getElementById('edvector')
oneResidualInput.addEventListener('change', event => {
  const input = event.target.value
  if (!isBinary(input)) {
    // Фильтруем только '0' и '1'
    const filtered = input
      .split('')
      .filter(char => char === '0' || char === '1')
      .join('')
    // Обновляем значение в поле ввода
    event.target.value = filtered
    // Показываем предупреждение только если были удалены символы
    if (filtered !== input) {
      notyf.error('Неверный ввод. Разрешены только 0 и 1')
    }
  }
})
function isBinary (input) {
  const binaryPattern = /^[01]+$/ // Регулярное выражение для проверки на 0 и 1
  return binaryPattern.test(input)
}

function outputText () {
  const outputContainer = document.getElementById('output-container')
  outputContainer.innerHTML = ''
  // Считываем данные из формы
  const zeroResidualInput = document.getElementById('nullvector').value
  const oneResidualInput = document.getElementById('edvector').value
  const argumentIndex = parseInt(document.getElementById('argument').value, 10)

  const zeroResidual = new Array(zeroResidualInput.length)
  const oneResidual = new Array(oneResidualInput.length)

  if (zeroResidual.length !== oneResidual.length) {
    notyf.error('Длины векторов должны совпадать')
  }

  for (let i = 0; i < zeroResidual.length; ++i) {
    zeroResidual[i] = parseInt(zeroResidualInput[i])
    oneResidual[i] = parseInt(oneResidualInput[i])
  }

  // Вычисляем количество переменных
  const number_of_variables = Math.log2(zeroResidual.length * 2)

  // Получаем результат
  const vector = VectorFunction(
    zeroResidual,
    oneResidual,
    argumentIndex,
    number_of_variables
  )

  // Выводим результат на страницу
  const output = document.createElement('p')
  output.classList.add('output0')
  output.textContent = `Вектор функции: ${vector.join('')}`
  outputContainer.appendChild(output)
}