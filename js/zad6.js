const generateVectorButton = document.getElementById('generate-vector')
const vectorContainer = document.getElementById('output-container')
const outputContainer = document.getElementById('output1')
const form = document.querySelector('form')
const dnfInput = document.getElementById('dnf')
const checkDnfButton = document.getElementById('check-dnf')
const resultContainer = document.getElementById('result-container')
const resultText = document.getElementById('result')
const correctAnswerButton = document.getElementById('correct-answer')
const correctAnswerContainer = document.getElementById(
  'correct-answer-container'
)

let term
let vector
let correctDnf
let power

generateVectorButton.addEventListener('click', () => {
  correctAnswerButton.disabled = false
  dnfInput.value = ''
  power = Math.floor(Math.random() * 2) + 2
  term = generateTerm()
  correctDnf = term
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
  const power = 3 // Предполагаем, что power определен где-то выше
  const maxConjunctions = Math.min(4, 2 ** power - 1)
  const numConjunctions = 2 + Math.floor(Math.random() * (maxConjunctions - 1))

  const usedConjunctions = new Set()
  const dnf = []
  const availableVars = Array.from({ length: power }, (_, i) => i + 1)

  while (dnf.length < numConjunctions && usedConjunctions.size < 2 ** power) {
    // Генерация уникальной конъюнкции
    const varsInConjunction = 1 + Math.floor(Math.random() * power)
    const shuffledVars = [...availableVars].sort(() => Math.random() - 0.5)
    const selectedVars = shuffledVars.slice(0, varsInConjunction)

    const conjunction = selectedVars
      .map(varNum => ({
        name: varNum,
        negated: Math.random() < 0.5
      }))
      .sort((a, b) => a.name - b.name)

    const conjunctionKey = conjunction
      .map(v => `${v.negated ? '¬' : ''}x${v.name}`)
      .join(',')

    if (!usedConjunctions.has(conjunctionKey)) {
      usedConjunctions.add(conjunctionKey)
      dnf.push(
        `(${conjunction
          .map(v => `${v.negated ? '¬' : ''}x${v.name}`)
          .join(' ∧ ')})`
      )
    }
  }

  return dnf.join(' ∨ ')
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
    console.log(substitutedTerm)
    vector.push(eval(substitutedTerm) ? 1 : 0)
  }

  return vector
}

correctAnswerButton.addEventListener('click', () => {
  if (correctAnswerContainer.textContent !== '') {
    correctAnswerContainer.innerHTML = ''
  } else {
    const correctAnswer = correctDnf
    correctAnswerContainer.innerHTML = `Подсказка: ${correctAnswer}`
  }
})

checkDnfButton.addEventListener('click', () => {
  const userVector = generateVector(dnfInput.value, power)
  if (userVector.length === 0) {
    notyf.open({
      type: 'warning',
      message: 'Сначала сгенерируйте вектор!'
    })
  } else {
    userVector.join('') === vector.join('')
      ? notyf.success('Правильно!')
      : notyf.error('Неправильно!')
  }
})

correctAnswerContainer.addEventListener('click', () => {
  navigator.clipboard
    .writeText(correctAnswerContainer.innerText.substring(11))
    .then(() => {
      notyf.success('Ответ скопирован в буфер обмена')
    })
    .catch(function (error) {
      notyf.error('Ошибка:', error)
    })
})
