//Followed the following tutorial for creating local modules: http://www.tutorialsteacher.com/nodejs/nodejs-local-modules

//Require MySQL related modules
const mysql = require('mysql')

//Create MySQL Connection
let con = mysql.createConnection({ 
	host: "localhost"
	, user: "node_hero"
	, database: "node_hero"
	, password: "node_hero_password"
})

//Functions
function getUsers(callback) {
	let sql = "SELECT * FROM  users"
	con.query(sql, function (err, result, fields) {
		callback(err, result);
	})
}

function getUser(name, callback) {
}

function hasUser(name, callback) {
}

function removeUser(name, callback) {
}

function addUser(name, age, callback) {
	let sql_template = "INSERT INTO users VALUES(?, ?)"
	sql = mysql.format(sql_template, [name, age])

	con.query(sql, function (err, result) {
		callback(err, result);
	})
}

module.exports = user
