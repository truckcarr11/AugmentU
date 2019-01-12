require('dotenv').load();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const vuforia = require('vuforia-api');
var util = vuforia.util();
const app = express();
const port = 3000;

mongoose.connect(process.env.databaseURL);

var client = vuforia.client({
	serverAccessKey: process.env.serverAccessKey,
	serverSecretKey: process.env.serverSecretKey,
	clientAccessKey: process.env.clientAccessKey,
	clientSecretKey: process.env.clientSecretKey
});

const User = require('./models/user');
const Target = require('./models/target');

app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', parameterLimit: 100000, extended: false }));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/dashboard', function(req, res) {
	res.sendFile(__dirname + '/dashboard.html');
});

app.get('/dashboard.js', function(req, res) {
	res.sendFile(__dirname + '/dashboard.js');
});

app.get('/index.js', function(req, res) {
	res.sendFile(__dirname + '/index.js');
});

app.get('/styles.css', function(req, res) {
	res.sendFile(__dirname + '/styles.css');
});

app.get('/images/:imageName', function(req, res) {
	res.sendFile(__dirname + '/images/' + req.params.imageName);
});

app.get('/api/users/:username/targets', function(req, res) {
	User.getUser(req.params.username, function(err, user) {
		if (err) {
			console.log(err);
			return;
		}
		if (user != null) {
			let userTargets = [];
			let counter = 0;
			for (let i = 0; i < user.targets.length; i++) {
				Target.getTarget(user.targets[i], function(err, target) {
					userTargets.push(target);
					if (counter == user.targets.length - 1) res.send(userTargets);
					counter++;
				});
			}
		} else
			res.send({
				Text: 'User does not exist.'
			});
	});
});

app.post('/api/users/login', function(req, res) {
	User.getUser(req.body.username, function(err, user) {
		if (err) {
			console.log(err);
			return;
		}
		if (user != null) {
			bcrypt.compare(req.body.password, user.password, function(err, result) {
				if (result == true) {
					res.send(user);
					return;
				} else
					res.send({
						Text: 'Invalid Username/Password.'
					});
			});
		} else
			res.send({
				Text: 'Invalid Username/Password.'
			});
	});
});

app.post('/api/users/register', function(req, res) {
	User.getUser(req.body.username, function(err, user) {
		if (err) {
			console.log(err);
			return;
		}
		if (user != null) {
			res.send({
				Text: 'Username Taken.'
			});
			return;
		}
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(req.body.password, salt, function(err, hash) {
				User.create({
					username: req.body.username,
					email: req.body.email,
					password: hash,
					targets: []
				});
				res.send({
					Text: 'User Registered.'
				});
			});
		});
	});
});

app.post('/api/targets/add', function(req, res) {
	User.getUser(req.body.user.username, function(err, user) {
		if (err) {
			console.log(err);
			return;
		}
		user.targets.push(req.body.target.name);
		user.save();
	});
	Target.create({
		name: req.body.target.name,
		description: req.body.target.description,
		latitude: req.body.target.latitude,
		longitude: req.body.target.longitude,
		imageData: req.body.target.imageData,
		imageMetaData: req.body.target.imageMetaData,
		textToSpeak: req.body.target.textToSpeak
	});
	var target = {
		name: req.body.target.name,
		width: 32.0,
		image: req.body.target.imageData.replace(/^data:image\/[a-z]+;base64,/, ''),
		active_flag: true,
		application_metadata: util.encodeBase64('test')
	};
	client.addTarget(target, function(error, result) {
		if (error) console.log(error);
	});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
