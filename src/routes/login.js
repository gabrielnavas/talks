const path = require('path')

module.exports = route => {
  route.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname,'..','..','public','pages','login.html'));
  });
}
