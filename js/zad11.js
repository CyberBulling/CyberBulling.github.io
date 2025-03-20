const generateVectorButton = document.getElementById('generate-vector')
const outputContainer = document.getElementById('output1')
const checkResultButton = document.getElementById('check-result')

class Vector {
  constructor (vectorLength) {
    this.vector = generateVector(vectorLength)
    this.M = isMonotone(this.vector)
    this.L = isLinear(this.vector)
    this.T0 = false
    if (this.vector.toString()[0] == '0') {
      this.T0 = true
    }
    this.T1 = false
    if (this.vector[this.vector.length - 1] == '1') {
      this.T1 = true
    }
    this.S = false
    for (let i = 0; i < this.vector.length / 2; i++) {
      if (this.vector[i] != this.vector[this.vector.length - 1 - i]) {
        this.S = true
        break
      }
    }
  }
  getVector () {
    return this.vector
  }
  getM () {
    return this.M
  }
  getL () {
    return this.L
  }
  getT0 () {
    return this.T0
  }
  getT1 () {
    return this.T1
  }
  getS () {
    return this.S
  }
  toString () {
    return this.vector.join('')
  }
  isCanceled () {
    const notCanceled = []
    if (!this.M) notCanceled.push('M')
    if (!this.L) notCanceled.push('L')
    if (!this.T0) notCanceled.push('T0')
    if (!this.T1) notCanceled.push('T1')
    if (!this.S) notCanceled.push('S')

    if (notCanceled.length === 0) {
      return 'вектор полон'
    }

    return notCanceled
  }
}

function generateVector (length) {
  const vector = []
  for (let i = 0; i < length; i++) {
    vector.push(Math.random() < 0.5 ? 0 : 1)
  }
  return vector
}

let vectors = []
generateVectorButton.addEventListener('click', () => {
  vectors = []
  const vectorCount = Math.floor(Math.random() * 4) + 1

  for (let i = 0; i < vectorCount; i++) {
    const power = Math.floor(Math.random() * 2) + 2
    const vectorLength = Math.pow(2, power)
    const vector = new Vector(vectorLength)
    vectors.push(vector)
  }

  outputContainer.innerText = `Набор векторов: {${vectors.join(', ')}}`
})

function getBinaryRepresentation (vector) {
  const binaryVector = []
  for (let i = 0; i < vector.length; i++) {
    const binaryRepresentation = i
      .toString(2)
      .padStart(Math.log2(vector.length), '0')
    binaryVector[i] = binaryRepresentation
  }
  return binaryVector
}

function isMonotone (vector) {
  const binaryVector = getBinaryRepresentation(vector)

  for (let i = 0; i < vector.length; i++) {
    for (let j = i + 1; j < vector.length; j++) {
      const binaryRepresentationI = binaryVector[i]
      const binaryRepresentationJ = binaryVector[j]
      const countOnesI = binaryRepresentationI.split('1').length - 1
      const countOnesJ = binaryRepresentationJ.split('1').length - 1

      if (countOnesI < countOnesJ && vector[i] === 0 && vector[j] === 1) {
        return false
      }
    }
  }

  return true
}

let zhegalkinLength //для рекурсии

function isLinear (vector) {
  let linear = true
  zhegalkinLength = vector.length
  const zhegalkinPolynom = createZhegalkin(vector, [], vector)
  const binaryZhegalkin = getBinaryRepresentation(zhegalkinPolynom)
  for (let i = 0; i < binaryZhegalkin.length; i++) {
    if (binaryZhegalkin[i].split(1).length > 1 && zhegalkinPolynom[i] === 1) {
      linear = false
      break
    }
  }
  return linear
}

function createZhegalkin (vector, polynom) {
  if (polynom.length < zhegalkinLength - 1) {
    let polynomialRepresentation = []
    for (let i = 1; i < vector.length; i++) {
      polynomialRepresentation.push(vector[i] ^ vector[i - 1])
    }
    polynom.push(polynomialRepresentation[0])
    vector = polynomialRepresentation
    createZhegalkin(vector, polynom)
  } else {
    polynom.push(vector[0])
  }
  return polynom
}

checkResultButton.addEventListener('click', () => {
  const classes = new Set()
  const allClasses = ['M', 'L', 'T0', 'T1', 'S']
  vectors.forEach(vector => {
    const canceled = vector.isCanceled()
    allClasses.forEach(cls => {
      if (!canceled.includes(cls)) {
        classes.add(cls)
      }
    })
  })
  console.log(classes)
})
