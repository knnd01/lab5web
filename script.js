const tools = []
let idCounter = 1

const form = document.getElementById('toolForm')
const select = document.getElementById('recordSelect')
const newPropSelect = document.getElementById('newPropertySelect')
const newPropInput = document.getElementById('newPropertyValue')

function updateSelectOptions() {
  select.innerHTML = ''
  tools.forEach(tool => {
    const option = document.createElement('option')
    option.value = tool.id
    option.textContent = `ID ${tool.id}`
    select.appendChild(option)
  })
}

function renderOutput(data = tools) {
  const header = document.getElementById('tableHeader')
  const body = document.getElementById('tableBody')

  header.innerHTML = ''
  body.innerHTML = ''

  if (!data.length) {
    header.innerHTML = '<th>Нет данных</th>'
    return
  }

  const keys = Object.keys(data[0])
  keys.forEach(key => {
    const th = document.createElement('th')
    th.textContent = key
    header.appendChild(th)
  })

  data.forEach(tool => {
    const tr = document.createElement('tr')
    keys.forEach(key => {
      const td = document.createElement('td')
      td.textContent = tool[key]
      tr.appendChild(td)
    })
    body.appendChild(tr)
  })

  localStorage.setItem('tools', JSON.stringify(tools))
}

form.addEventListener('submit', e => {
  e.preventDefault()

  const name = form.name.value.trim()
  const purpose = form.purpose.value.trim()
  const weight = parseFloat(form.weight.value)
  const price = parseFloat(form.price.value)

  if (!name || name.length < 2) {
    alert('Введите корректное название (минимум 2 символа).')
    return
  }

  if (!purpose || purpose.length < 2) {
    alert('Введите корректное назначение (минимум 2 символа).')
    return
  }

  if (isNaN(weight) || weight <= 0) {
    alert('Вес должен быть положительным числом.')
    return
  }

  if (isNaN(price) || price <= 0) {
    alert('Цена должна быть положительным числом.')
    return
  }

  const tool = {
    id: idCounter++,
    name,
    purpose,
    weight,
    price,
  }

  tools.push(tool)
  updateSelectOptions()
  renderOutput()
  form.reset()
})

document.getElementById('clearForm').addEventListener('click', () => {
  form.reset()
})

document.getElementById('deleteRecord').addEventListener('click', () => {
  const id = parseInt(select.value)
  const index = tools.findIndex(t => t.id === id)
  if (index !== -1) tools.splice(index, 1)
  updateSelectOptions()
  renderOutput()
})

document.getElementById('showMinWeight').addEventListener('click', () => {
  if (tools.length === 0) return
  const minWeightTool = tools.reduce((min, current) => (current.weight < min.weight ? current : min), tools[0])
  renderOutput([minWeightTool])
})

document.getElementById('addProperty').addEventListener('click', () => {
  const prop = newPropSelect.value
  const val = newPropInput.value
  if (!prop || !val) return
  tools.forEach(tool => {
    tool[prop] = val
  })
  renderOutput()
  newPropInput.value = ''
  newPropSelect.value = ''
})

window.onload = () => {
  const saved = localStorage.getItem('tools')
  if (saved) {
    const parsed = JSON.parse(saved)
    parsed.forEach(t => tools.push(t))
    idCounter = tools.length ? Math.max(...tools.map(t => t.id)) + 1 : 1
    updateSelectOptions()
    renderOutput()
  }
}
