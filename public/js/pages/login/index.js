function login() {
  const name = document.querySelector('#name').value
  if(!name || name.length < 3) {
    document.querySelector('.errors').innerHTML = `
      <div>nome muito pequeno...</div>
    `
    return
  }
  console.log(name.trim())
  localStorage['name'] = name.trim()
  window.location.href = '/chat'
}