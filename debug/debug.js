// Dependencies.
var express = require('express')
var expressLess = require('express-less')
var opn = require('opn')

// Create Express app.
var app = express()
app.use(express.static(__dirname + '/www'))
app.use('/css', expressLess(__dirname + '/../lib'))
app.use('/css', express.static(__dirname + '/../lib'))
app.use('/js', express.static(__dirname + '/../lib'))

// Pick a random dynamic port number.
// See: https://en.wikipedia.org/wiki/Ephemeral_port
var port = 49152 + Math.floor(Math.random() * 16383)

// Run HTTP server.
app.listen(port, function () {
  console.log('Debug server listening on port ' + port)

  // Opens the debug URL in the default browser.
  opn('http://localhost:' + port + '/')
})
