var express = require('express');
const path = require('path')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const buffer = require('base64-arraybuffer')

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
  
  const userConnected = 'user_connected'
  socket.on(userConnected, userName => {
    console.log(`User ${userName} is connected.`);
    socket.broadcast.emit(userConnected, makeMessage(userName, undefined))
    socket.emit(userConnected, makeMessage(userName, undefined))
  })

  const feedMessage = 'feed_message'
  socket.on(feedMessage, message => {
    socket.broadcast.emit(feedMessage, makeMessage(message.name,message.text))
    socket.emit(feedMessage, makeMessage(message.name,message.text))
  })

  const feedImage = 'feed_image'
  socket.on(feedImage, (message) => {

    function base64ArrayBuffer(arrayBuffer) {
      var base64    = ''
      var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

      var bytes         = new Uint8Array(arrayBuffer)
      var byteLength    = bytes.byteLength
      var byteRemainder = byteLength % 3
      var mainLength    = byteLength - byteRemainder

      var a, b, c, d
      var chunk

      // Main loop deals with bytes in chunks of 3
      for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
        d = chunk & 63               // 63       = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
      }

      // Deal with the remaining bytes and padding
      if (byteRemainder == 1) {
        chunk = bytes[mainLength]

        a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3)   << 4 // 3   = 2^2 - 1

        base64 += encodings[a] + encodings[b] + '=='
      } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

        a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

        base64 += encodings[a] + encodings[b] + encodings[c] + '='
      }
      
      return base64
    }
    const bufferBase64 = base64ArrayBuffer(message.buffer)
    const sendObj = {
      buffer: bufferBase64, 
      name: message.name, 
      photoName: message.photoName
    }
    socket.broadcast.emit(feedImage, sendObj)
    socket.emit(feedImage, sendObj)

  })
});


http.listen(port, function() {
   console.log(`listening on port ${port}`);
});