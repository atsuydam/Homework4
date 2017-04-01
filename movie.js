// movies database schema for homework4
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Movie = new Schema ({
	title : { type: String, required: true },
	year: { type: Number, required: true },
	actor: { type: Array, "default" : [], required: true }
	// there is a way to add required number to make actor and array, find it.
	});
	
module.exports = mongoose.model('Movie', Movie);