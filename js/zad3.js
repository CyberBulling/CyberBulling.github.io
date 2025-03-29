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
     console.log(resultVector);
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

let zeroResidualInput = document.getElementById('nullvector')
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
let oneResidualInput = document.getElementById('edvector')
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
  let argumentIndex
  // Считываем данные из формы
  if (
    zeroResidualInput.value.length === 0 ||
    oneResidualInput.value.length === 0
  ) {
    notyf.error('Поля не должны быть пустыми')
  } else if (document.getElementById('argument').value.length === 0) {
    notyf.error('Введите номер аргумента')
  } else {
    argumentIndex = parseInt(document.getElementById('argument').value, 10)
    if (
      argumentIndex < 1 ||
      argumentIndex > Math.log2(zeroResidualInput.value.length)+1
    ) {
      notyf.error(
        `Номер аргумента должен быть больше 0 и не больше ${
          Math.log2(zeroResidualInput.value.length) + 1
        }`
      )
    } else {
      const zeroResidual = new Array(zeroResidualInput.value.length)
      const oneResidual = new Array(oneResidualInput.value.length)

      if (zeroResidual.length !== oneResidual.length) {
        notyf.error('Длины векторов должны совпадать')
      }

      for (let i = 0; i < zeroResidual.length; ++i) {
        zeroResidual[i] = parseInt(zeroResidualInput.value[i])
        oneResidual[i] = parseInt(oneResidualInput.value[i])
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

      if (!vector.length === 0) {
        // Выводим результат на страницу
        const output = document.createElement('p')
        output.id = 'output0'
        output.textContent = `Вектор функции: ${vector.join('')}`
        outputContainer.appendChild(output)
      }
    }
  }
}
