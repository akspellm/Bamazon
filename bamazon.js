var mysql = require("mysql");
var inquirer = require("inquirer");
var buy = require("./customer.js");
var manager = require("./manager.js");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",

  password: "password",
  database: "bamazon"
});

function endConnection() {
  connection.end();
}

connection.connect(function(err) {
  inquirer
    .prompt([
      {
        name: "userType",
        message: "What would you like to sign in as:",
        type: "list",
        choices: ["customer", "manager"]
      }
    ])
    .then(function(res) {
      if (res.userType === "customer") {
        if (err) throw err;

        buy.buyProduct();
        endConnection();
      } else if (res.userType === "manager") {
        manager.managerView();
        endConnection();
      }
    });
});
