var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.set('port', process.env.PORT || 7302);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Handle Errors gracefully
app.use(function(err, req, res, next) {
	if(!err) return next();
	console.log(err.stack);
	res.json({error: true});
});

// Main App Page
app.get('/', routes.index);

// MongoDB API Routes
app.get('/polls/polls', routes.list);
app.get('/polls/:id', routes.poll);
app.post('/polls', routes.create);


app.get('/purchases/purchases', routes.listP);
app.get('/purchases/:id', routes.purchase);
app.put('/purchases/:id', routes.updateP);
app.del('/purchases/:id', routes.deleteP);
app.post('/purchases', routes.createP);

app.post('/members', routes.createMember);
app.get('/members', routes.listMember);
app.put('/members', routes.updateMember);
app.del('/members', routes.deleteMember);
// app.post('/vote', routes.vote);



server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
