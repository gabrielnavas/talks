const path = require('path')

module.exports = route => {
  route.get('/chat', function(req, res) {
    res.sendFile(path.resolve(__dirname,'..','..','public','pages','chat.html'));
  });
}
