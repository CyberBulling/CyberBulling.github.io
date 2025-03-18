document.getElementById('n').addEventListener('input', () => {
  const n = parseInt(document.getElementById('n').value)
  const button = document.querySelector('button[type="button"]')
  if (n < 1 || n > 4) {
    alert('Введено недопустимое количество переменных')
    button.disabled = true
  } else {
    button.disabled = false
  }
}) //Проверка на количество переменных

function outputText () {
  //Все переменные
  const n = Math.pow(2, parseInt(document.getElementById('n').value))
  const table = document.createElement('table')
  const thead = document.createElement('thead')
  const tr = document.createElement('tr')
  const th = document.createElement('th')
  const grayCode = getGrayCode(n)
  const half = Math.floor(n / 2)
  const tr2 = document.createElement('tr')
  const th2 = document.createElement('th')
  const tbody = document.createElement('tbody')
  const outputContainer = document.getElementById('output-container')
  //------------------------------------------------------------------

  if (n === 16) {
    table.style.fontSize = 'calc(var(--table-font)/2)'
    table.style.fontWeight = '1'
    outputContainer.style.justifyContent = 'left'
    const tmp = document.querySelector('output-container:nth-child(2)')
    tmp.style.justifyContent = 'left'
  }
  table.border = 1
  tr.appendChild(th)
  tr2.appendChild(th2)
  for (let i = 0; i < Math.pow(2, n - half); i++) {
    const th2 = document.createElement('th')
    th2.textContent = i.toString(2).padStart(n - half, '0') //padStart расширяет строку до заданной длины незначащими 0
    tr2.appendChild(th2)
  }
  thead.appendChild(tr2)
  table.appendChild(thead)
  //Заголовок таблицы

  for (let i = 0; i < Math.pow(2, half); i++) {
    const tr = document.createElement('tr')
    const th = document.createElement('th')
    th.textContent = i.toString(2).padStart(half, '0')
    tr.appendChild(th)
    for (let j = 0; j < Math.pow(2, n - half); j++) {
      const td = document.createElement('td')
      td.textContent = Math.random() < 0.5 ? 0 : 1
      tr.appendChild(td)
    }
    tbody.appendChild(tr)
  }
  table.appendChild(tbody)
  //Тело таблицы

  document.getElementById('output1').innerHTML = ''
  document.getElementById('output1').appendChild(table)
  outputContainer.scrollIntoView({ behavior: 'smooth' })
  outputContainer.style.overflowY = 'hidden'

  table.addEventListener('mouseover', event => {
    if (event.target.tagName === 'TD') {
      const colIndex = event.target.cellIndex
      const rowIndex = event.target.parentNode.rowIndex
      document.getElementById('output0').textContent =
        (rowIndex - 1).toString(2).padStart(half, '0') +
        (colIndex - 1).toString(2).padStart(n - half, '0') +
        ' - ' +
        event.target.textContent
    }
  })

  table.addEventListener('mouseout', event => {
    if (event.target.tagName === 'TD') {
      document.getElementById('output0').textContent = ''
    }
  })
  //События на наведение на ячейку
}

function getGrayCode (n) {
  const grayCode = []
  for (let i = 0; i < Math.pow(2, n); i++) {
    const binaryString = i.toString(2).padStart(n, '0')
    const grayString = binaryString
      .split('')
      .map((bit, index) => {
        if (index === 0) return bit
        return (parseInt(bit) + parseInt(binaryString[index - 1])) % 2
      })
      .join('')
    grayCode.push(grayString.split(''))
  }
  return grayCode
} //Основной код
