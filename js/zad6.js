const generateVectorButton = document.getElementById('generate-vector')
const vectorContainer = document.getElementById('output-container')
const outputContainer = document.getElementById('output1')
const form = document.querySelector('form')
const dnfInput = document.getElementById('dnf')
const checkdnfButton = document.getElementById('check-dnf')
const resultContainer = document.getElementById('result-container')
const resultText = document.getElementById('result')
const correctAnswerButton = document.getElementById('correct-answer')
const correctAnswerContainer = document.getElementById(
  'correct-answer-container'
)

let vector = []
let correctdNF = ''
let numVariables = 0

const symbolMap = {
  коньюнкция: '∧',
  '&': '∧',
  '*': '∧',
  and: '∧',
  дизъюнкция: '∨',
  or: '∨',
  отрицание: '¬',
  not: '¬',
  не: '¬',
  '!':'¬'
}

function replaceSymbols (dnf) {
  if (dnf === '-') {
    return ''
  }
  Object.keys(symbolMap).forEach(key => {
    if (key === '*') {
      dnf = dnf.replace(/\*/g, symbolMap[key])
    } else {
      dnf = dnf.replace(new RegExp(key, 'g'), symbolMap[key])
    }
  })
  dnf = dnf.replace(/\s*\(/g, '(')
  dnf = dnf.replace(/\)\s*/g, ')')
  dnf = dnf.replace(/\s+/g, '')
  return dnf
}

function compareDNF (dnf1, dnf2) {
  const clauses1 = dnf1.replace(' ', '').split('∨')
  const clauses2 = dnf2.replace(' ', '').split('∨')

  if (clauses1.length !== clauses2.length) {
    return false
  }

  for (let i = 0; i < clauses1.length; i++) {
    const clause1 = clauses1[i].replace('(', '').replace(')', '').split('∧')
    const clause2 = clauses2[i].replace('(', '').replace(')', '').split('∧')

    if (clause1.length !== clause2.length) {
      return false
    }

    const literals1 = clause1.map(literal =>
      literal.replace('x', '').replace('¬', '')
    )
    const literals2 = clause2.map(literal =>
      literal.replace('x', '').replace('¬', '')
    )

    if (!arraysEqual(literals1, literals2)) {
      return false
    }
  }

  return true
}

function arraysEqual (arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }

  return true
}

generateVectorButton.addEventListener('click', () => {
  const power = Math.floor(Math.random() * 2) + 2
  const vectorLength = Math.pow(2, power)
  vector = generateVector(vectorLength)
  correctdNF = getDNF(vector)
  const outputText = `Вектор функции: ${vector.join('')}`
  outputContainer.innerHTML = ''
  resultText.innerHTML = ''
  outputContainer.appendChild(document.createTextNode(outputText))
  if (correctAnswerContainer.textContent !== '') {
    correctAnswerContainer.innerHTML = ''
  }
})

checkdnfButton.addEventListener('click', () => {
  const dnf = dnfInput.value.trim()
  const replaceddnf = replaceSymbols(dnf)

  if (compareDNF(replaceddnf, correctdNF)) {
    resultText.textContent = 'ДНФ правильная!'
  } else {
    resultText.textContent = 'ДНФ неправильная!'
  }
})

function generateVector (length) {
  const vector = []
  for (let i = 0; i < length; i++) {
    vector.push(Math.random() < 0.5 ? 0 : 1)
  }
  return vector
}

function getDNF (vector) {
  const numVariables = Math.log2(vector.length)
  const dnf = []

  for (let i = 0; i < vector.length; i++) {
    if (vector[i] === 1) {
      const clause = []
      const binaryRepresentation = i.toString(2).padStart(numVariables, '0')

      for (let j = 0; j < numVariables; j++) {
        if (binaryRepresentation[j] === '1') {
          clause.push(`x${j + 1}`)
        } else {
          clause.push(`¬x${j + 1}`)
        }
      }
      dnf.push(`(${clause.join('∧')})`)
    }
  }
  return dnf.length > 0 ? dnf.join('∨') : ''
}

correctAnswerButton.addEventListener('click', () => {
  if (correctAnswerContainer.textContent !== '') {
    correctAnswerContainer.innerHTML = ''
  } else {
    const correctAnswer = correctdNF
    correctAnswerContainer.innerHTML = `Правильный ответ: ${correctAnswer}`
  }
})
