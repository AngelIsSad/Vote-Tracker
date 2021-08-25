const { Schema, model } = require('mongoose');

let schema = Schema({
	id: [String]
});

exports.review = model('review', schema);

schema = Schema({
    user: String,
    givenAt: String
});

exports.votedUser = model('votedUser', schema)