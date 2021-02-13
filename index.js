var express = require('express');
const path = require('path')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))

app.get('/chat', function(req, res) {
  res.sendFile(__dirname + '/public/pages/chat.html');
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/pages/login.html');
});

const makeMessage = (name, text) => ({
  name, text
})

io.on('connection', function(socket) {
  console.log('A user connected');

  const userConnected = 'user_connected'
  socket.on(userConnected, userName => {
    socket.emit(userConnected, makeMessage(userName, undefined))
  })

  const feedMessage = 'feed_message'
  socket.on(feedMessage, message => {
    console.log(makeMessage(message.name,message.text))
    socket.emit(feedMessage, makeMessage(message.name,message.text))
  })
});


http.listen(port, function() {
   console.log(`listening on port ${port}`);
});