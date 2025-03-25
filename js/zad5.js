const generateVectorButton = document.getElementById('generate-vector')
const vectorContainer = document.getElementById('vector-container')
const outputContainer = document.getElementById('output1')

let globalVector = ''
let essentialss

generateVectorButton.addEventListener('click', generateVectorUntilEssentials)

function generateVectorUntilEssentials () {
  const power = Math.floor(Math.random() * 2) + 2
  const vectorLength = Math.pow(2, power)
  const vector = generateVector(vectorLength)
  essentialss = getEssentials(vector)

  if (
    essentialss.length === 0 ||
    (vector === globalVector && globalVector.length != 0)
  ) {
    generateVectorUntilEssentials() // рекурсивный вызов
  } else {
    globalVector = vector
    outputContainer.innerHTML = vector
    vectorContainer.innerHTML = ''
    for (let i = 0; i < Math.log2(vector.length); i++) {
      const varButton = document.createElement('div')
      varButton.id = `x${i}`
      varButton.className = 'class-button'
      varButton.textContent = `x${i + 1}`
      varButton.addEventListener('click', () => {
        varButton.classList.toggle('selected')
      })
      vectorContainer.appendChild(varButton)
    }
  }
}

function outputText () {
  let allCorrect = true
  const buttons = vectorContainer.children

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('right', 'wrong')
  }

  for (let i = 0; i < buttons.length; i++) {
    const varButton = buttons[i]
    const varIndex = parseInt(varButton.textContent.substring(1)) - 1
    const isSelected = varButton.classList.contains('selected')
    const isEssential = essentialss.includes(varIndex)

    if (isSelected && isEssential) {
      varButton.classList.add('right')
    } else if ((isSelected && !isEssential) || (!isSelected && isEssential)) {
      varButton.classList.add('wrong')
      allCorrect = false
    }
  }

  allCorrect ? alert('All correct!') : alert('Some errors detected')
}

function generateVector (length) {
  const vector = []
  for (let i = 0; i < length; i++) {
    vector.push(Math.random() < 0.5 ? 0 : 1)
  }
  return vector.join('')
}

//вектор с остаточными
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
    const binaryString = i.toString(2).padStart(numVariables, '0')
    if (parseInt(binaryString[argument]) == value) {
      newVector.push(vector[i])
    }
  }
  return newVector
}
