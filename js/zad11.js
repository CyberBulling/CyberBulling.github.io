const generateVectorButton = document.getElementById('generate-vector')
const outputContainer = document.getElementById('output1')
const checkResultButton = document.getElementById('check-result')

function generateVector (length) {
  const vector = []
  for (let i = 0; i < length; i++) {
    vector.push(Math.random() < 0.5 ? 0 : 1)
  }
  return vector.join('')
}

generateVectorButton.addEventListener('click', () => {
  const vectorCount = Math.floor(Math.random() * 4) + 1
  const vectors = []

  for (let i = 0; i < vectorCount; i++) {
    const power = Math.floor(Math.random() * 2) + 2
    const vectorLength = Math.pow(2, power)
    const vector = generateVector(vectorLength)
    console.log(vector)
    isComplete(vector)
    vectors.push(vector)
  }

  outputContainer.innerText = `Набор векторов\n{${vectors.join(', ')}}`
})

function isComplete (vector) {
  let T0 = false
  let T1 = false
  let S = true
  let M = isMonotone(vector)
  let L = false
  
  console.log(M)
  
  if (vector[0] == '0') {
    T0 = true
  }
  if (vector[vector.length - 1] == '1') {
    T1 = true
  }
  for (let i = 0; i < vector.length / 2; i++) {
    if (vector[i] == vector[vector.length - 1 - i]) {
      S = false
      break
    }
  }
}

function isMonotone(vectorStr){
  console.log(vectorStr.lastIndexOf('0')<vectorStr.indexOf('1'))
}