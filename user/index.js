//Require Express related modules
const express = require('express')
const express_hbs = require('express-handlebars')
const express_bodyparser = require('body-parser')
const { check, validationResult } = require('express-validator/check')

//Require general modules
const path = require('path')

//Require local modules
const user = require('./user.js');

//Create Express Application and set up handlebars
const express_app = express()

express_app.engine('handlebars', express_hbs({ 
	defaultLayout: 'main'
	, layoutsDir: path.join(__dirname, 'views/layouts')
}))
express_app.set('view engine', 'handlebars')
express_app.set('views', path.join(__dirname, 'views'))

//Mounts bodyparser middleware which is executed for any path.
express_app.use(express_bodyparser.json())

// Route: GET /
express_app.get('/', function (req, res) { 
	res.render('home')
})

// Route: GET /users
express_app.get('/users', function(req, res, next){
	user.getUsers(function (err, result){
		if(err){
			res.json("Error: " + err)
		} else {
			res.json(result)
		}
	})
})

// Route: POST /users
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
			res.json("Error: " + err)
		} else {
			res.json("Added")
		}
	})
})

// Express app starts at port 4000
express_app.listen(4000)
