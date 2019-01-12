const mongoose = require('mongoose');

const targetSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	latitude: {
		type: Number,
		required: true
	},
	longitude: {
		type: Number,
		required: true
	},
	imageData: {
		type: String,
		required: true
	},
	imageMetaData: {
		type: String,
		required: true
	},
	textToSpeak: {
		type: String,
		required: true
	}
});

const Target = (module.exports = mongoose.model('Target', targetSchema));

module.exports.getTarget = function(targetName, callback) {
	Target.findOne(
		{
			name: targetName
		},
		callback
	);
};
