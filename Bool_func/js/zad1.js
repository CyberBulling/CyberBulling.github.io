document.getElementById('n').addEventListener('input', () => {
  const n = parseInt(document.getElementById('n').value)
  const button = document.querySelector('button[type="button"]')
  if (n < 1 || n > 8) {
    notyf.error('Введено недопустимое количество переменных')
    document.getElementById('n').value = ''
    button.disabled = true
  } else {
    button.disabled = false
  }
}) //Проверка на количество переменных

function outputText () {
  const n = parseInt(document.getElementById('n').value)
  if (isNaN(n)) {
    notyf.error('Введено недопустимое количество переменных')
    document.querySelector('th').style.opacity = 0
  }
  const table = document.createElement('table')
  const thead = document.createElement('thead')
  const tr = document.createElement('tr')
  const th = document.createElement('th')
  const half = Math.floor(n / 2)
  const tr2 = document.createElement('tr')
  const th2 = document.createElement('th')
  const tbody = document.createElement('tbody')
  const outputContainer = document.getElementById('output-container')
  table.border = 1
  tr2.appendChild(th2.cloneNode())
  // Заголовки столбцов (большая половина)
  for (let i = 0; i < Math.pow(2, n - half); i++) {
    const colHeader = document.createElement('th')
    colHeader.textContent = i.toString(2).padStart(n - half, '0')
    tr2.appendChild(colHeader)
  }
  thead.appendChild(tr2)
  table.appendChild(thead)
  // Тело таблицы
  for (let i = 0; i < Math.pow(2, half); i++) {
    const row = document.createElement('tr')
    const rowHeader = document.createElement('th')
    // Заголовок строки (меньшая половина)
    rowHeader.textContent = i.toString(2).padStart(half, '0')
    row.appendChild(rowHeader)
    // Ячейки таблицы
    for (let j = 0; j < Math.pow(2, n - half); j++) {
      const cell = document.createElement('td')
      cell.textContent = Math.random() < 0.5 ? 0 : 1
      row.appendChild(cell)
    }
    tbody.appendChild(row)
  }
  table.appendChild(tbody)
  // Очистка и вывод
  document.getElementById('output1').innerHTML = ''
  document.getElementById('output1').appendChild(table)
  outputContainer.scrollIntoView({ behavior: 'smooth' })
  table.addEventListener('mouseover', event => {
    if (
      event.target.tagName === 'TD' ||
      event.target.tagName === 'TH' ||
      event.target.tagName === 'TABLE'
    ) {
      document.querySelector('.output3').id = 'output0'
      document.querySelector('#output0').classList.remove('output3')
    }
    if (event.target.tagName === 'TD') {
      const colIndex = event.target.cellIndex
      const rowIndex = event.target.parentNode.rowIndex
      document.querySelector('#output0').textContent =
        (rowIndex - 1).toString(2).padStart(half, '0') +
        (colIndex - 1).toString(2).padStart(n - half, '0') +
        ' - ' +
        event.target.textContent
    }
  })

  table.addEventListener('mouseout', event => {
    if (
      event.target.tagName === 'TD' ||
      event.target.tagName === 'TH' ||
      event.target.tagName === 'TABLE'
    ) {
      document.querySelector('#output0').classList.add('output3')
      document.querySelector('.output3').id = ''
    }
    if (event.target.tagName === 'TD') {
      document.querySelector('.output3').textContent = ''
    }
  })
}