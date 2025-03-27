var notyf = new Notyf();

function buildSDNF () {
  const vectorInput = document.getElementById('vector').value.trim()
  if(document.querySelector('.output3')!=undefined){
    document.querySelector('.output3').id ='output0'
    document.getElementById('output0').classList.remove('output3') 
  }
  const outputElement = document.getElementById('output0')

  const length = vectorInput.length
  const n = Math.log2(length)

  // Проверки
  if (!/^[01]+$/.test(vectorInput)) {
    notyf.error('Ошибка: Вектор должен содержать только 0 и 1.');
    return
  }

  if (length === 0 || (length & (length - 1)) !== 0) {
    notyf.error('Ошибка: Длина вектора должна быть степенью двойки (2, 4, 8, 16, ...).');
    return
  }

  // Массив названий переменных
  const variables = []
  for (let i = 0; i < n; i++) {
    variables.push(`x${i + 1}`)
  }

  // Двоичные наборы
  const binaryIndexes = []
  for (let i = 0; i < length; i++) {
    const binary = i.toString(2).padStart(n, '0')
    binaryIndexes.push(binary)
  }

  // Формирование термов
  const terms = []
  for (let i = 0; i < length; i++) {
    if (vectorInput[i] === '0') {
      const binary = i.toString(2).padStart(n, '0')
      const disjunctionParts = []
      for (let j = 0; j < n; j++) {
        const bit = binary[j]
        const styledVar =
          bit === '1'
            ? `<span style="text-decoration: overline">${variables[j]}</span>`
            : variables[j]
        disjunctionParts.push(styledVar)
      }
      terms.push(`(${disjunctionParts.join(' ∨ ')})`)
    }
  }

  outputElement.innerHTML =
    terms.length > 0 ? `СКНФ: ${terms.join(' ∧ ')}` : 'СКНФ: 1'
}
