//Require Express related modules
const express = require('express')
const express_bodyparser = require('body-parser')
const { check, validationResult } = require('express-validator/check')

//Require general modules
const path = require('path')

//Require local modules
const user = require('./user.js');

//Create Express Application
const express_app = express()

//Mounts bodyparser middleware which is executed for any path.
express_app.use(express_bodyparser.json())

// Get Users
express_app.get('/users', function(req, res, next){
	user.getUsers(function (err, result){
		if(err){
			res.status(500).send({ Message: "Could not retrieve users. Error: " + err });
		} else {
			res.json(result)
		}
	})
})

// Delete User
express_app.delete('/users/:name', [ 
	check('name').isLength({min: 1}).withMessage('Please enter a name.')]
	, function(req, res, next){

	// Finds validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	user.deleteUser(req.params.name, function(err, result){
		if (err){
			res.status(500).send({ Message: "Could not delete the user. Error: " + err });
		} else {
			if(result.affectedRows === 0 ){
				res.status(404).send({ Message: "Could not find the user " + req.params.name + "."});
			} else {
				res.status(200).send({ Message: "User " + req.params.name + " deleted."});
			}
		}
	})
})

// Get User
express_app.get('/users/:name', [ 
	check('name').isLength({min: 1}).withMessage('Please enter a name.')]
	, function(req, res, next){

	// Finds validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	user.getUser(req.params.name, function(err, result){
		if (err){
			res.status(500).send({ Message: "Could not retrieve the user. Error: " + err });
		} else {
			if(result.length === 0 ){
				res.status(404).send({ Message: "Could not find the user " + req.params.name + "."});
			} else {
				res.json(result.pop())
			}
		}
	})
})

// Add User
express_app.post('/users', [ 
	check('name').isLength({min: 1}).withMessage('Please enter a name.')
	, check('age').isInt({min: 1}).withMessage('Please enter an age higher than 0')]
	, function(req, res, next){

	// Finds validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	user.addUser(req.body.name, req.body.age, function(err, result){
		if (err){
			res.status(500).send({ Message: "Could not add the user. Error: " + err });
		} else {
			res.status(200).send({ Message: "User " + req.body.name + " added." });
		}
	})
})

// Express app starts at port 4000
express_app.listen(3000)
