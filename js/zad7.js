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
  correctAnswerButton.disabled = false
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
  const jsTerm = term
    .replace(/∧/g, '&&')
    .replace(/∨/g, '||')
    .replace(/¬/g, '!')
    .replace(/-/g, '!')
    .replace(/\*/g, '&&')
    .replace(/or/g, '||')
    .replace(/and/g, '&&')
    .replace(/not/g, '!')

  const terms = jsTerm.split('||')
  let brackets = false
  console.log(terms)
  terms.forEach(trm => {
    if (trm.indexOf('(') === -1 || trm.indexOf(')') === -1) {
      brackets = true
    }
  })

  try {
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
  } catch {
    notyf.error('Некорректная логическая формула')
  }
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
const element = document.querySelector('[data-tooltype]')
const text = element.getAttribute('data-tooltype').replace('\n', '<br>')
element.innerHTML = text
