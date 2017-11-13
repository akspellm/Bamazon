var mysql = require("mysql");
var inquirer = require("inquirer");
var buy = require('./customer.js')

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",

  password: "password",
  database: "bamazon"
});

function endConnection() {
    connection.end();
  };

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as " + connection.threadId);

  buy.buyProduct();
  endConnection();
});


function displayProducts() {
  console.log("This is what we have for sale today:");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    for (var x in res) {
      console.log("\n*** Item: " + res[x].product_name + " - $" + res[x].price);
    }
  });
}
