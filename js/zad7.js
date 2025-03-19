const generateVectorButton = document.getElementById('generate-vector')
const vectorContainer = document.getElementById('output-container')
const outputContainer = document.getElementById('output1')
const form = document.querySelector('form')
const knfInput = document.getElementById('knf')
const checkknfButton = document.getElementById('check-knf')
const resultContainer = document.getElementById('result-container')
const resultText = document.getElementById('result')
const correctAnswerButton = document.getElementById('correct-answer')
const correctAnswerContainer = document.getElementById(
  'correct-answer-container'
)

let vector = []
let correctKNF = ''
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
  '!': '¬'
}

function replaceSymbols (knf) {
  if (knf === '-') {
    return ''
  }
  Object.keys(symbolMap).forEach(key => {
    if (key === '*') {
      knf = knf.replace(/\*/g, symbolMap[key])
    } else {
      knf = knf.replace(new RegExp(key, 'g'), symbolMap[key])
    }
  })
  knf = knf.replace(/\s*\(/g, '(')
  knf = knf.replace(/\)\s*/g, ')')
  knf = knf.replace(/\s+/g, '')
  return knf
}

generateVectorButton.addEventListener('click', () => {
  const power = Math.floor(Math.random() * 2) + 2
  const vectorLength = Math.pow(2, power)
  vector = generateVector(vectorLength)
  correctKNF = getKNF(vector)
  const outputText = `Вектор функции: ${vector.join('')}`
  outputContainer.innerHTML = ''
  resultText.innerHTML = ''
  outputContainer.appendChild(document.createTextNode(outputText))
  if (correctAnswerContainer.textContent !== '') {
    correctAnswerContainer.innerHTML = ''
  }
})

checkknfButton.addEventListener('click', () => {
  const knf = knfInput.value.trim()
  const replacedKnf = replaceSymbols(knf)
  const correctKNFArray = correctKNF.replace(' ', '').split('∧')
  const userKNFArray = replacedKnf.split('∧')
  let isCorrect = true

  if (replacedKnf === correctKNF) {
    if (knf === '') {
      correctKNF = '∅'
    }
    isCorrect = true
  } else if (correctKNFArray.length !== userKNFArray.length) {
    isCorrect = false
  } else {
    for (let i = 0; i < correctKNFArray.length; i++) {
      const correctClause = correctKNFArray[i]
        .replace('(', '')
        .replace(')', '')
        .split('∨')
      const userClause = userKNFArray[i]
        .replace('(', '')
        .replace(')', '')
        .split('∨')
      if (correctClause.length !== userClause.length) {
        isCorrect = false
        break
      } else {
        for (let j = 0; j < correctClause.length; j++) {
          const correctLiteral = correctClause[j]
            .replace('x', '')
            .replace('¬', '')
          const userLiteral = userClause[j].replace('x', '').replace('¬', '')
          if (correctLiteral !== userLiteral) {
            isCorrect = false
            break
          }
        }
      }
    }
  }

  if (isCorrect) {
    resultText.textContent = 'КНФ правильная!'
  } else {
    resultText.textContent = `КНФ неправильная!`
  }
})

function generateVector (length) {
  const vector = []
  for (let i = 0; i < length; i++) {
    vector.push(Math.random() < 0.5 ? 0 : 1)
  }
  return vector
}

function getKNF (vector) {
  const numVariables = Math.log2(vector.length)
  const knf = []

  for (let i = 0; i < vector.length; i++) {
    if (vector[i] === 0) {
      const clause = []
      const binaryRepresentation = i.toString(2).padStart(numVariables, '0')

      for (let j = 0; j < numVariables; j++) {
        if (binaryRepresentation[j] === '0') {
          clause.push(`x${j + 1}`)
        } else {
          clause.push(`¬x${j + 1}`)
        }
      }
      knf.push(`(${clause.join('∨')})`)
    }
  }
  return knf.length > 0 ? knf.join('∧') : ''
}

correctAnswerButton.addEventListener('click', () => {
  if (correctAnswerContainer.textContent !== '') {
    correctAnswerContainer.innerHTML = ''
  } else {
    const correctAnswer = correctKNF
    correctAnswerContainer.innerHTML = `Правильный ответ: ${correctAnswer}`
  }
})
