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

let vector
let correctknf

generateVectorButton.addEventListener('click', () => {
  const power = Math.floor(Math.random() * 2) + 2
  const vectorLength = Math.pow(2, power)
  vector = generateVector(vectorLength)
  correctknf = getKNF(vector)
  const outputText = `Вектор функции: ${vector.join('')}`
  outputContainer.innerHTML = ''
  resultText.innerHTML = ''
  outputContainer.appendChild(document.createTextNode(outputText))
  if (correctAnswerContainer.textContent !== '') {
    correctAnswerContainer.innerHTML = ''
  }
})

checkknfButton.addEventListener('click', () => {
  const knf = knfInput.value
  const rightKnf = getKNF(vector)
  if (rightKnf === '1' && knf === '1') {
    resultText.innerHTML = 'КНФ верна'
  } else if (rightKnf === '1' && knf != '1') {
    resultText.innerHTML = 'КНФ неверна'
  } else {
    const vectorKnf = knf.replace(/\s/g, '').split('+')
    const rightVectorKnf = rightKnf.replace(/\s/g, '').split('+')
    if (vectorKnf.join('') === rightVectorKnf.join('')) {
      resultText.innerHTML = 'КНФ верна'
    } else {
      console.log(vectorKnf,rightVectorKnf)
      resultText.innerHTML = 'КНФ неверна'
    }
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
  let knf = ''
  for (let i = 0; i < vector.length; i++) {
    if (vector[i] == 0) {
      const pos = i.toString(2).padStart(Math.log2(vector.length), '0')
      let line = '('
      for (let j = 0; j < pos.length; j++) {
        if (pos[j] == '0') {
          line += `x${j + 1}∨`
        }
        else{
          line += `!x${j + 1}∨`
        }
      }
      knf += line.substring(0, line.length) + ')∧'
    }
  }
  return knf.substring(0, knf.length - 3)
}

correctAnswerButton.addEventListener('click', () => {
  if (correctAnswerContainer.textContent !== '') {
    correctAnswerContainer.innerHTML = ''
  } else {
    const correctAnswer = correctknf
    correctAnswerContainer.innerHTML = `Правильный ответ: ${correctAnswer}`
  }
})
