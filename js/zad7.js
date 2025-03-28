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

const generateVectorButton = document.getElementById('generate-vector')
const vectorContainer = document.getElementById('output-container')
const outputContainer = document.getElementById('output1')
const form = document.querySelector('form')
const knfInput = document.getElementById('knf')
const checkKnfButton = document.getElementById('check-knf')
const resultContainer = document.getElementById('result-container')
const resultText = document.getElementById('result')
const correctAnswerButton = document.getElementById('correct-answer')
const correctAnswerContainer = document.getElementById(
  'correct-answer-container'
)

let term
let vector
let correctKnf
let power

generateVectorButton.addEventListener('click', () => {
  knfInput.value = ''
  power = Math.floor(Math.random() * 2) + 2
  term = generateTerm()
  correctKnf = term
  vector = generateVector(term)
  const outputText = `Вектор функции: ${vector.join('')}`
  outputContainer.innerHTML = ''
  resultText.innerHTML = ''
  outputContainer.appendChild(document.createTextNode(outputText))
  if (correctAnswerContainer.textContent !== '') {
    correctAnswerContainer.innerHTML = ''
  }
})

function generateTerm () {
  const maxConjunctions = Math.min(4, 2 ** power - 1) // Ограничение макс. конъюнкций
  const numConjunctions = Math.floor(Math.random() * (maxConjunctions - 1)) + 2

  const usedConjunctions = new Set()
  let knf = []

  for (let i = 0; i < numConjunctions; i++) {
    let conjunctionKey
    let conjunction
    let attempts = 0

    do {
      // Генерация конъюнкции
      const varsInConjunction = Math.floor(Math.random() * power) + 1
      const availableVars = Array.from({ length: power }, (_, idx) => idx + 1)
      conjunction = []

      for (let j = 0; j < varsInConjunction; j++) {
        const randomIndex = Math.floor(Math.random() * availableVars.length)
        const varNum = availableVars.splice(randomIndex, 1)[0]
        const isNegated = Math.random() < 0.5
        conjunction.push({
          name: varNum,
          negated: isNegated
        })
      }

      conjunction.sort((a, b) => a.name - b.name)
      conjunctionKey = conjunction
        .map(v => `${v.negated ? '¬' : ''}x${v.name}`)
        .join(',')

      attempts++
      if (attempts > 20) break // Защита от бесконечного цикла
    } while (usedConjunctions.has(conjunctionKey))

    if (attempts > 20) break
    usedConjunctions.add(conjunctionKey)
    knf.push(
      `(${conjunction
        .map(v => `${v.negated ? '¬' : ''}x${v.name}`)
        .join(' ∨ ')})`
    )
  }

  return knf.join(' ∧ ')
}

function generateVector (term) {
  const vector = []
  const totalCombinations = Math.pow(2, power)

  // Преобразование логических операторов в JS-синтаксис
  const jsTerm = term
    .replace(/∧/g, '&&')
    .replace(/∨/g, '||')
    .replace(/¬/g, '!')
    .replace(/-/g, '!')
    .replace(/\*/g, '&&')
    .replace(/or/g, '||')
    .replace(/and/g, '&&')
    .replace(/not/g, '!')

  // Генерация всех возможных наборов переменных
  for (let i = 0; i < totalCombinations; i++) {
    const binary = i.toString(2).padStart(power, '0')
    const variables = {}

    for (let j = 0; j < power; j++) {
      variables[`x${j + 1}`] = parseInt(binary[j])
    }

    const substitutedTerm = jsTerm.replace(
      /x(\d+)/g,
      (_, num) => variables[`x${num}`]
    )
    vector.push(eval(substitutedTerm) ? 1 : 0)
  }

  return vector
}

correctAnswerButton.addEventListener('click', () => {
  if (correctAnswerContainer.textContent !== '') {
    correctAnswerContainer.innerHTML = ''
  } else {
    const correctAnswer = correctKnf
    correctAnswerContainer.innerHTML = `Подсказка: ${correctAnswer}`
  }
})

checkKnfButton.addEventListener('click', () => {
  const userVector = generateVector(knfInput.value, power)
  userVector.join('') === vector.join('')
    ? notyf.success('Правильно!')
    : notyf.error('Неправильно!')
  console.log(userVector)
})
