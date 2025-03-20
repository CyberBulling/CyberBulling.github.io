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

let vector

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
  const dnf = dnfInput.value
  const rightDnf = getDNF(vector)
  if (rightDnf === '1' && dnf === '1') {
    resultText.innerHTML = 'ДНФ верна'
  } else if (rightDnf === '1' && dnf != '1') {
    resultText.innerHTML = 'ДНФ неверна'
  } else {
    const vectorDnf = dnf.replace(/\s/g, '').split('+')
    const rightVectorDnf = rightDnf.replace(/\s/g, '').split('+')
    if (vectorDnf.join('') === rightVectorDnf.join('')) {
      resultText.innerHTML = 'ДНФ верна'
    } else {
      console.log(vectorDnf,rightVectorDnf)
      resultText.innerHTML = 'ДНФ неверна'
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

function getDNF (vector) {
  let dnf = ''
  for (let i = 0; i < vector.length; i++) {
    if (vector[i] == 1) {
      const pos = i.toString(2).padStart(Math.log2(vector.length), '0')
      if (pos.indexOf('1') === -1) {
        dnf += '1 '
      }
      let line = ''
      for (let j = 0; j < pos.length; j++) {
        if (pos[j] == '1') {
          line += `x${j + 1}*`
        }
      }
      dnf += line.substring(0, line.length - 1) + ' + '
    }
  }
  return dnf.substring(0, dnf.length - 3)
}

correctAnswerButton.addEventListener('click', () => {
  if (correctAnswerContainer.textContent !== '') {
    correctAnswerContainer.innerHTML = ''
  } else {
    const correctAnswer = correctdNF
    correctAnswerContainer.innerHTML = `Правильный ответ: ${correctAnswer}`
  }
})
