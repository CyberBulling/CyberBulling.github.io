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
const full = document.getElementById('full')

// Изначально блокируем все кнопки кроме генерации
classButtons.forEach(btn => {
  btn.style.pointerEvents = 'none'
})
checkResultButton.disabled = true
full.style.pointerEvents = 'none'

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
    if (!this.M) canceledClasses.push('M') // Не монотонный
    if (!this.L) canceledClasses.push('L') // Не линейный
    if (!this.T0) canceledClasses.push('T0') // Не сохраняет 0
    if (!this.T1) canceledClasses.push('T1') // Не сохраняет 1
    if (!this.S) canceledClasses.push('S') // Не самодвойственный
    return canceledClasses
  }
}

let selectedClasses = []
let vectors = []
let classes = new Set()
let isFull = 0 // 0 - не проверяли, 1 - полный, -1 - неполный

// Функция для блокировки/разблокировки кнопок
function toggleButtons (enable) {
  classButtons.forEach(btn => {
    if (btn.id !== 'full') {
      btn.style.pointerEvents = enable ? 'auto' : 'none'
    }
  })
  full.style.pointerEvents = enable ? 'auto' : 'none'
}

// Инициализация кнопок классов
classButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (vectors.length === 0) {
      notyf.open({
        type: 'warning',
        message: 'Сначала сгенерируйте векторы!'
      })
      return
    }

    if (button.id === 'full') return

    if (button.classList.contains('selected')) {
      button.classList.remove('selected')
      selectedClasses = selectedClasses.filter(cls => cls !== button.id)
    } else {
      button.classList.add('selected')
      selectedClasses.push(button.id)
    }
  })
})

// Генерация векторов
generateVectorButton.addEventListener('click', () => {
  resetGame()

  const vectorCount = Math.floor(Math.random() * 3) + 1 // 1-3 вектора
  const power = Math.floor(Math.random() * 2) + 2 // 2 или 3 переменные
  const vectorLength = Math.pow(2, power)

  for (let i = 0; i < vectorCount; i++) {
    let vector
    do {
      vector = new Vector(vectorLength)
    } while (vectors.some(v => v.toString() === vector.toString()))

    vectors.push(vector)
  }

  outputContainer.textContent = `Набор векторов: {${vectors
    .map(v => v.toString())
    .join(', ')}}`
  checkResultButton.disabled = false
  toggleButtons(true) // Разблокируем кнопки после генерации
})

// Проверка на полноту
full.addEventListener('click', () => {
  if (vectors.length === 0) {
    notyf.open({
      type: 'warning',
      message: 'Сначала сгенерируйте векторы!'
    })
    return
  }

  if (full.classList.contains('selected')) {
    full.classList.remove('selected')
    isFull = checkFullness()
    classButtons.forEach(btn => {
      btn.classList.remove('selected')
      btn.style.display = 'inline-block'
      btn.style.pointerEvents = 'auto'
    })
  } else {
    full.classList.add('selected')
    isFull = checkFullness()
    classButtons.forEach(btn => {
      if (btn.id !== 'full') {
        btn.style.display = 'none'
        btn.style.pointerEvents = 'none'
      }
    })
    selectedClasses = []
  }
})

// Проверка результата
checkResultButton.addEventListener('click', () => {
  if (vectors.length === 0) {
    notyf.open({
      type: 'warning',
      message: 'Сначала сгенерируйте векторы!'
    })
    return
  }

  isFull = checkFullness()
  console.log(isFull)

  if (isFull) {
    if (full.classList.contains('selected')) {
      full.classList.add('right')
      notyf.success('Верно! Набор полный.')
      return
    } else {
      full.classList.add('wrong-unselected')
      notyf.error('Ошибка: набор векторов полный!')
      selectedClasses.forEach(cls => {
        const button = document.getElementById(`${cls}`)
        console.log(button)
        button.classList.add('wrong')
      })
      toggleButtons(false)
      return
    }
  } else {
    const correctClasses = getNonContainingClasses()
    const allClasses = new Set(['T0', 'T1', 'S', 'M', 'L'])
    const diff = allClasses.difference(correctClasses)
    console.log(correctClasses, diff, selectedClasses)

    diff.forEach(cls => {
      if (!document.getElementById(cls).classList.contains('selected')) {
        document.getElementById(cls).classList.add('wrong-unselected')
      }
    })

    // Проверяем все возможные варианты
    selectedClasses.forEach(cls => {
      const button = document.getElementById(cls)
      button.classList.add(!correctClasses.has(cls) ? 'right' : 'wrong')
    })

    // Помечаем пропущенные правильные классы
    diff.forEach(cls => {
      if (
        selectedClasses.includes(cls) &&
        !document.getElementById(cls).classList.contains('selected')
      ) {
        document.getElementById(cls).classList.add('wrong-unselected')
      }
    })

    // Определяем общий результат
    if (correctClasses.union(new Set(selectedClasses)).size === 5) {
      notyf.success('Все выбрано правильно')
    } else if (new Set(selectedClasses).difference(diff).size > 0) {
      notyf.error('Выбрано слишком много')
    } else {
      if(full.classList.contains('selected')){
        full.classList.remove('selected')
        full.classList.add('wrong')
        notyf.error('Множество не полное')
      }else{
        notyf.error('Выбрано слишком мало')
      }
    }
  }

  disableControls()
})

// ======= Вспомогательные функции =======

function resetGame () {
  vectors = []
  selectedClasses = []
  classes = new Set()
  isFull = 0

  full.classList.remove('selected', 'right', 'wrong')
  classButtons.forEach(btn => {
    btn.classList.remove('selected', 'right', 'wrong', 'wrong-unselected')
    btn.style.display = 'inline-block'
  })

  checkResultButton.disabled = true
  outputContainer.textContent = ''
  toggleButtons(false) // Блокируем кнопки при сбросе
}

function disableControls () {
  toggleButtons(false)
  checkResultButton.disabled = true
}

function checkFullness () {
  classes = new Set()
  vectors.forEach(vector => {
    // Добавляем классы, которым НЕ принадлежат векторы
    vector.isCanceled().forEach(cls => classes.add(cls))
  })
  // Если набрались все 5 классов - система полна
  return classes.size === 5 ? 1 : 0
}

function getNonContainingClasses () {
  const result = new Set()
  vectors.forEach(vector => {
    // Собираем классы, которым НЕ принадлежат векторы
    vector.isCanceled().forEach(cls => result.add(cls))
    console.log(vector)
  })
  return result
}

function generateVector (length) {
  const vector = []
  for (let i = 0; i < length; i++) {
    vector.push(Math.random() < 0.5 ? 0 : 1)
  }
  return vector
}

function isMonotone (vector) {
  const n = Math.log2(vector.length)
  if (!Number.isInteger(n)) return false

  for (let i = 0; i < vector.length; i++) {
    for (let j = i + 1; j < vector.length; j++) {
      // Проверяем, что i "покрывает" j (все биты i <= j)
      let covers = true
      for (let k = 0; k < n; k++) {
        if (((i >> k) & 1) > ((j >> k) & 1)) {
          covers = false
          break
        }
      }
      if (covers && vector[i] > vector[j]) {
        return false
      }
    }
  }
  return true
}

function isLinear (vector) {
  const n = Math.log2(vector.length)
  if (!Number.isInteger(n)) return false

  // Вычисляем полином Жегалкина
  const coeffs = [...vector]
  for (let i = 0; i < vector.length; i++) {
    for (let j = 0; j < i; j++) {
      if ((i & j) === j) {
        coeffs[i] ^= coeffs[j]
      }
    }
  }

  // Проверяем, что нет нелинейных членов
  for (let i = 0; i < vector.length; i++) {
    if (coeffs[i]) {
      const ones = i.toString(2).split('1').length - 1
      if (ones > 1) return false
    }
  }
  return true
}

function isSelfDual (vector) {
  if (vector.length % 2 !== 0) return false
  const n = vector.length
  for (let i = 0; i < n / 2; i++) {
    if (vector[i] === vector[n - 1 - i]) {
      return false
    }
  }
  return true
}
