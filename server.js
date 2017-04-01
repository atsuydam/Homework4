// load the express package and create our app
var express = require('express');
var app 	= express();
var path 	= require('path');
// body parser allows us to pull post content?
// app.body use the body parser
var bodyParser = require('body-parser');
var morgan 	= require('morgan');
//adding mongoose so we can use our database
var mongoose = require('mongoose');

// for local testing
//mongoose.connect('mongodb://localhost/test');

// connect to the database at mongolab.
mongoose.connect('mongodb://AwesomeAmanda:dave4275@ds143980.mlab.com:43980/movies');

// ok, declare a movie variable from the schema, or link to it
var Movie = require('./app/models/movie');


// Test for a successful connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
	console.log('connected successfully');
});

//body parser
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	//not entirely confident on these since they are bring up undefined but from the book
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	next();
});

// this is to log things to the console per the book, not sure it's needed
app.use(morgan('dev'));
//send out index.html to the user for the home page

// it's saying this is undefined too
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

// get all the movies in the database collection
var apiRouter = express.Router();

apiRouter.use(function(req, res, next){
	// logging
	console.log('Someone is visiting the movie api');
	next();
});
apiRouter.get('/', function( req, res){
	res.json({message: "Hello"});
});
apiRouter.route('/movies')
	.post(function(req, res, next){
		var movie = new Movie();

		movie.title = req.body.title;
		movie.year = req.body.year;
		movie.actor = req.body.actor;
		console.log(movie.title, movie.year, movie.actor);
		movie.save(function(err){
			if(err) return console.error(err);
		});
		res.json({message: "Movie Saved"});
		next();

	})
	.get(function(req, res){
		Movie.find(function (err, data){
			if (err) return console.error(err);
			res.json(data);
		})
	});

apiRouter.route('/movies/:movie_title')
	.get(function(req, res){
		Movie.findOne({title: req.params.movie_title}, 'title year actor', function(err, data){
			if (err)
				res.send(err);
			res.json(data);
		})
	})
	.delete(function(req, res){
		Movie.findOneAndRemove({title: req.params.movie_title}, function (err, movie){
			if (err)
				res.send(err);
			res.json({message: "Movie deleted"});
		})
	});



app.use('/moviedb', apiRouter);
// start the server
app.listen(1337);
console.log('1337 is the magic port!');