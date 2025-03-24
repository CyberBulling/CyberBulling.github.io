const generateVectorButton = document.getElementById('generate-vector')
const vectorContainer = document.getElementById('vector-container')
const outputContainer = document.getElementById('output1')

let globalVector = ''

generateVectorButton.addEventListener('click', generateVectorUntilEssentials)

function generateVectorUntilEssentials () {
  const power = Math.floor(Math.random() * 2) + 2
  const vectorLength = Math.pow(2, power)
  const vector = generateVector(vectorLength)
  const essentials = getEssentials(vector)

  console.log(vector, globalVector, essentials)

  if (
    essentials.length === 0 ||
    (vector === globalVector && globalVector.length != 0)
  ) {
    generateVectorUntilEssentials() // рекурсивный вызов
  } else {
    globalVector = vector
    outputContainer.innerHTML = vector
  }
}

function outputText () {
  
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
