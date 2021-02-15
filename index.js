const express = require('express')
const path = require('path')
const app = express();
const http = require('http').Server(app);


const port = process.env.PORT || 3000

// define static files
app.use(express.static(path.join(__dirname, 'public')))


// define all routes
const routes = express.Router()
app.use(routes)
require('./src/routes/chat')(routes)
require('./src/routes/login')(routes)


//sockets
require('./src/controllers/sockets')(http)


// server http
http.listen(port, function() {
   console.log(`listening on port ${port}`);
});