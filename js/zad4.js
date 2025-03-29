const function_value = [
  '0001',
  '0111',
  '0110',
  '1110',
  '1000',
  '1101',
  '1001',
  '0010',
  '1011',
  '0100',
  '0000',
  '0101',
  '0011',
  '1010',
  '1100',
  '1111'
]
let randomString = ''

function initializeGame () {
  randomString = getRandomString(function_value)
  displayFunctionValue()
}

function getRandomString (function_value) {
  const randomIndex = Math.floor(Math.random() * function_value.length)
  return function_value[randomIndex]
}

function displayFunctionValue () {
  const outputContainer = document.getElementById('output-container')
  outputContainer.innerHTML = ''

  const output = document.createElement('p')
  output.classList.add('output0')
  output.textContent = `Значение функции: ${randomString}`
  outputContainer.appendChild(output)
}

function checkAnswer () {
  const selectedValue = document.getElementById('function-name').value

  if (!selectedValue) {
    notyf.error('Выберите имя функции!')
    return
  }
  if (selectedValue === randomString) {
    notyf.success('Правильно! Это верная функция.')
  } else {
    notyf.error('Неправильно. Попробуйте еще раз.')
  }

  initializeGame()
}

document.addEventListener('DOMContentLoaded', initializeGame)
document.getElementById('button').addEventListener('click', checkAnswer)
