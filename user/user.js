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
exports.getUsers = function(callback) {
	let sql = "SELECT * FROM  users"
	con.query(sql, function (err, result, fields) {
		callback(err, result);
	})
}

exports.addUser = function (name, age, callback) {
	let sql_template = "INSERT INTO users VALUES(?, ?)"
	sql = mysql.format(sql_template, [name, age])

	con.query(sql, function (err, result) {
		callback(err, result);
	})
}
