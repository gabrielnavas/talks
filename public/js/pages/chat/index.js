
const socket = io()
const userConnected = 'user_connected'
const feedMessage = 'feed_message'
const makeMessage = (name, text) => ({
  name, text
})

const leave = () => {
  delete localStorage['name']
  window.location.href = '/login'
}

const makeFeedItemConnected = name => `
  <div class='container'>
    <span>
      ${name} entrou.
    </span>
  </div>
`
const makeFeedItemFeedMessage = (name, message) => `
  <div class='container'>
    <span>
      ${name} disse: ${message}
    </span>
  </div>
`

const clearField = () => 
  document.querySelector('form .message').value = ''

const sendMessage = () => {
  const message = document.querySelector('form .message').value
  socket.emit(feedMessage, makeMessage(userName, message))
}

const main = () => {

  let userName = localStorage['name']
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
    $feed.innerHTML += makeFeedItemFeedMessage(
      message.name, 
      message.text
    )
    clearField()
  })
}
main()