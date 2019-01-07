//app/index.js

//Require Express related modules
const express = require('express')
const express_hbs = require('express-handlebars')
const express_bodyparser = require('body-parser')
const { check, validationResult } = require('express-validator/check')

//Require MySQL related modules
const mysql = require('mysql')

//Require general modules
const path = require('path')

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

//Create MySQL Connection
let con = mysql.createConnection({ 
	host: "localhost"
	, user: "node_hero"
	, database: "node_hero"
	, password: "node_hero_password"
})

// Route: GET /
express_app.get('/', function (req, res) { 
	res.render('home')
})

// Route: GET /users
express_app.get('/users', function(req, res, next){
	getUsers(function (err, result){
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

	addUser(req.body.name, req.body.age, function(err, result){
		if (err){
			res.json("Error: " + err)
		} else {
			res.json("Added")
		}
	})
})

// Express app starts at port 4000
express_app.listen(4000)

//Functions
function getUsers(callback) {
	let sql = "SELECT * FROM  users"
	con.query(sql, function (err, result, fields) {
		callback(err, result);
	})
}

function addUser(name, age, callback) {
	let sql_template = "INSERT INTO users VALUES(?, ?)"
	sql = mysql.format(sql_template, [name, age])

	con.query(sql, function (err, result) {
		callback(err, result);
	})
}

/*
 * Applying lessons learned from callbackhell.com:
 *
 * 3. Handle every single error in every one of your callbacks. Use a linter like standard to help you with this. Ensure 'error' is the first argument to force you to handle errors.
 * 4. Create reusable functions and place them in a module to reduce the cognitive load required to understand your code. Splitting your code into small pieces like this also helps you handle errors, write tests, forces you to create a stable and documented public API for your code, and helps with refactoring.
 */

