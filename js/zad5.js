const generateVectorButton = document.getElementById('generate-vector')
const vectorContainer = document.getElementById('vector-container')
const outputContainer = document.getElementById('output1')
const form = document.querySelector('form')

let isEssentialButtonsClicked = false

generateVectorButton.addEventListener('click', () => {
  if (
    generateVectorButton.textContent === 'Сгенерировать вектор' ||
    generateVectorButton.textContent === 'Ещё раз'
  ) {
    generateVectorButton.textContent = 'Отправить'
    const power = Math.floor(Math.random() * 3) + 2 // Случайное число от 2 до 4
    const vectorLength = Math.pow(2, power) // Длина вектора
    const vector = generateVector(vectorLength)
    const buttons = []
    const essential = getEssentials(vector)

    // Добавляем кнопку с символом пустого множества
    const emptySetButton = document.createElement('button')
    emptySetButton.type = 'button'
    emptySetButton.classList.add('button')
    emptySetButton.textContent = '∅'
    emptySetButton.addEventListener('click', () => {
      if (essential.length === 0) {
        emptySetButton.style.backgroundColor = 'var(--primary-color)'
        generateVectorButton.textContent = 'Ещё раз'
        alert(
          'Поздравляем! Вы правильно выбрали отсутствие фиктивных переменных.'
        )
      } else {
        emptySetButton.style.backgroundColor = 'red'
        buttons.forEach(el => {
          el.disabled = true
        })
        generateVectorButton.textContent = 'Ещё раз'
        alert('Поражение! Вы нажали неверную кнопку.')
      }
    })

    for (let i = 0; i < power; i++) {
      const button = document.createElement('button')
      button.type = 'button'
      button.classList.add('button')
      button.textContent = `x${i + 1}`
      button.addEventListener('click', () => {
        if (button.classList.contains('essential')) {
          button.style.backgroundColor = 'var(--primary-color)'
          checkEssentialButtons()
        } else {
          alert('Поражение! Вы нажали неверную кнопку.')
          button.style.backgroundColor = 'red'
          buttons.forEach(el => {
            el.disabled = true
          })
          generateVectorButton.textContent = 'Ещё раз'
        }
      })
      buttons.push(button)
    }

    essential.forEach(el => {
      buttons[el].classList.add('essential')
      buttons[el].setAttribute('data-essential', true)
    })

    vectorContainer.innerHTML = ''
    buttons.forEach(button => vectorContainer.appendChild(button))
    vectorContainer.appendChild(emptySetButton) // Добавляем кнопку с символом пустого множества

    const outputText = `Вектор функции: ${vector.join('')}`
    outputContainer.innerHTML = ''
    outputContainer.appendChild(document.createTextNode(outputText))
  } else if (generateVectorButton.textContent === 'Отправить') {
    if (isEssentialButtonsClicked) {
      alert('Поздравляем! Вы правильно выбрали все фиктивные переменные.')
      generateVectorButton.textContent = 'Ещё раз'
    }
  } else if (generateVectorButton.textContent === 'Ещё раз') {
    generateVectorButton.textContent = 'Отправить'
    isEssentialButtonsClicked = false
    generateVectorButton.click()
  }
})

function checkEssentialButtons () {
  const essentialButtons = document.querySelectorAll('.button.essential')
  let allClicked = true
  essentialButtons.forEach(button => {
    if (button.style.backgroundColor !== 'green') {
      allClicked = false
    }
  })
  if (allClicked) {
    isEssentialButtonsClicked = true
  }
}

function generateVector (length) {
  const vector = []
  for (let i = 0; i < length; i++) {
    vector.push(Math.random() < 0.5 ? 0 : 1)
  }
  return vector
}

function getEssentials (vector) {
  const numArgs = Math.log2(vector.length)
  const essentials = []
  for (let i = 0; i < numArgs; i++) {
    if (
      getResidual(vector, 0, i).every(
        (element, index) => element === getResidual(vector, 1, i)[index]
      )
    ) {
      essentials.push(i)
    }
  }
  return essentials
}

// Функция для вычисления остаточной функции
function getResidual (vector, value, argument) {
  const numVariables = Math.log2(vector.length)
  const newVector = []
  for (let i = 0; i < vector.length; i++) {
    // Преобразуем индекс в двоичное представление
    const binaryString = i.toString(2).padStart(numVariables, '0')
    // Проверяем, соответствует ли значение аргумента типу остаточной функции
    if (parseInt(binaryString[argument]) == value) {
      newVector.push(vector[i])
    }
  }
  return newVector
}
