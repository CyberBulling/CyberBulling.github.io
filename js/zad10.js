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

  themeSwitcher.forEach(element => {
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

const generateVectorButton = document.getElementById('generate-vector')
const outputContainer = document.getElementById('output1')
const checkResultButton = document.getElementById('check-result')
const classButtons = document.querySelectorAll('.class-button')

class Vector {
  constructor (vectorLength) {
    this.vector = generateVector(vectorLength)
    this.M = isMonotone(this.vector)
    this.L = isLinear(this.vector)
    this.T0 = this.vector[0] === 0
    this.T1 = this.vector[this.vector.length - 1] === 1
    this.S = isSelfDual(this.vector)
  }

  getVector () {
    return this.vector
  }

  toString () {
    return this.vector.join('')
  }

  isCanceled () {
    const canceledClasses = []
    if (this.M) canceledClasses.push('M')
    if (this.L) canceledClasses.push('L')
    if (this.T0) canceledClasses.push('T0')
    if (this.T1) canceledClasses.push('T1')
    if (this.S) canceledClasses.push('S')
    return canceledClasses
  }
}

let selectedClasses = []
let currentVector = null
let canceledClasses

// Блокируем кнопки при загрузке
classButtons.forEach(btn => (btn.style.pointerEvents = 'none'))
checkResultButton.disabled = true

// Обработчики для кнопок классов
classButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (!currentVector) {
      notyf.error('Сначала сгенерируйте вектор!')
      return
    }

    button.classList.toggle('selected')
    if (button.classList.contains('selected')) {
      selectedClasses.push(button.id)
    } else {
      selectedClasses = selectedClasses.filter(cls => cls !== button.id)
    }
  })
})

// Генерация вектора
generateVectorButton.addEventListener('click', () => {
  const power = Math.floor(Math.random() * 2) + 2 // 2 или 3 переменные
  const vectorLength = Math.pow(2, power)
  currentVector = new Vector(vectorLength)
  canceledClasses = currentVector.isCanceled()
  canceledClasses.length===0 ? generateVectorButton.click() : null

  outputContainer.textContent = `Вектор: ${currentVector}`

  // Разблокируем кнопки
  classButtons.forEach(btn => {
    btn.style.pointerEvents = 'auto'
    btn.classList.remove('selected', 'right', 'wrong', 'wrong-unselected')
  })
  checkResultButton.disabled = false
  selectedClasses = []
})

// Проверка результата
checkResultButton.addEventListener('click', () => {
  if (!currentVector) {
    notyf.error('Сначала сгенерируйте вектор!')
    return
  }

  let allCorrect = true

  // Проверяем выбранные классы
  selectedClasses.forEach(cls => {
    const button = document.getElementById(cls)
    if (canceledClasses.includes(cls)) {
      button.classList.add('right')
    } else {
      button.classList.add('wrong')
      allCorrect = false
    }
  })

  // Помечаем пропущенные классы
  canceledClasses.forEach(cls => {
    if (!selectedClasses.includes(cls)) {
      document.getElementById(cls).classList.add('wrong-unselected')
      allCorrect = false
    }
  })

  // Выводим результат
  if (allCorrect && selectedClasses.length === canceledClasses.length) {
    notyf.success('Все правильно!')
  } else {
    notyf.error('Есть ошибки в выборе классов')
  }

  // Блокируем кнопки после проверки
  classButtons.forEach(btn => (btn.style.pointerEvents = 'none'))
  checkResultButton.disabled = true
})

// Вспомогательные функции
function generateVector (length) {
  return Array.from({ length }, () => (Math.random() < 0.5 ? 0 : 1))
}

function isMonotone (vector) {
  const n = Math.log2(vector.length)
  if (!Number.isInteger(n)) return false

  for (let i = 0; i < vector.length; i++) {
    for (let j = i + 1; j < vector.length; j++) {
      let covers = true
      for (let k = 0; k < n; k++) {
        if (((i >> k) & 1) > ((j >> k) & 1)) {
          covers = false
          break
        }
      }
      if (covers && vector[i] > vector[j]) return false
    }
  }
  return true
}

function isLinear (vector) {
  const n = Math.log2(vector.length)
  if (!Number.isInteger(n)) return false

  const coeffs = [...vector]
  for (let i = 0; i < vector.length; i++) {
    for (let j = 0; j < i; j++) {
      if ((i & j) === j) {
        coeffs[i] ^= coeffs[j]
      }
    }
  }

  for (let i = 0; i < vector.length; i++) {
    if (coeffs[i] && i.toString(2).split('1').length - 1 > 1) {
      return false
    }
  }
  return true
}

function isSelfDual (vector) {
  if (vector.length % 2 !== 0) return false
  for (let i = 0; i < vector.length / 2; i++) {
    if (vector[i] === vector[vector.length - 1 - i]) {
      return false
    }
  }
  return true
}
