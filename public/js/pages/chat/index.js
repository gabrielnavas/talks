const socket = io()
const userConnected = 'user_connected'
const feedMessage = 'feed_message'
const feedImage = 'feed_image'


const userName = localStorage['name']

const makeMessage = (name, text) => ({
  name, text
})

const makeImagem = (buffer, name, photoName) => ({
  buffer,
  name,
  photoName
})

const leave = () => {
  delete localStorage['name']
  window.location.href = '/'
}

const makeFeedItemConnected = name => `
  <div class='container'>
    <span>
      ${name} entrou.
    </span>
  </div>
`
const makeFeedItemMessage = (name, message) => `
  <div class='container'>
    <span class='message'>
      ${name} disse: ${message}
    </span>
  </div>
`

const makeFeedItemImagem = (buffer, userName, photoName) => {
  const elementImage = `
    <img 
      src="data:image/jpeg;base64,${buffer}"
      alt='${photoName}' 
    />
  `
  return `
    <div class='container'>
      <span class='message'>
        ${userName} enviou uma foto.
      </span>  
      ${elementImage}
    </div>
  `
}


const clearField = () => 
  document.querySelector('form .message').value = ''

const sendMessage = () => {
  const message = document.querySelector('form .message').value
  socket.emit(feedMessage, makeMessage(userName, message))
}

const sendImagem = () => {
  const photo = document.querySelector('#photo').files[0]
  if(photo) {
    socket.emit(feedImage, makeImagem(
    photo,
    userName,
      photo.name
    ))
    document.querySelector('#photo').files = null
  }
}

const selectImage = () => {
  document.querySelector('#photo').addEventListener('change', sendImagem)
  document.querySelector('#photo').click()
}

const main = () => {

  if(userName === undefined) {
    leave()
  }
  
  socket.on('connect', () => {
    console.log('Wellcome!!')
    socket.emit('user_connected', userName)
  });

  socket.on(userConnected, message => {
    const $feed = document.querySelector('.feed')
    $feed.innerHTML += makeFeedItemConnected(message.name)
  })

  socket.on(feedMessage, message => {
    const $feed = document.querySelector('.feed')
    $feed.innerHTML += makeFeedItemMessage(
      message.name, 
      message.text
    )
    clearField()
  })

  socket.on(feedImage, message => {
    console.log(message)
    console.log('chegou imagem')
    const feedImagemElement = makeFeedItemImagem(message.buffer, message.name, message.photoName)
    const $feed = document.querySelector('.feed')
    $feed.innerHTML += feedImagemElement
  })
}
main()