var mysql = require("mysql");
var inquirer = require("inquirer");

var managerView = function() {
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

  function displayProducts() {
    console.log("This is what we have for sale today:");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;

      for (var x in res) {
        console.log(
          "\n*** Item: " +
            res[x].product_name +
            " - $" +
            res[x].price +
            " - " +
            res[x].stock_qty +
            " units available"
        );
      }
    });
  }

  function lowInventory() {
    console.log("These items are running low:");

    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;

      for (var x in res) {
        if (res[x].stock_qty < 20) {
          console.log(
            "\n*** Item: " +
              res[x].product_name +
              " - " +
              res[x].stock_qty +
              " units available"
          );
        }
      }
    });
  }

  function addInventory() {
    var products = [];
    var productList = [];

    connection.query("SELECT * FROM products", function(err, res) {
      for (var x in res) {
        var product = res[x].product_name;
        var quantity = res[x].stock_qty;

        products.push({
          product: product,
          quantity: quantity
        });

        productList.push(res[x].product_name);
      }

      inquirer
        .prompt([
          {
            message: "\nWhich item would you like to add inventory to?",
            name: "pickProduct",
            type: "list",
            choices: productList
          }
        ])
        .then(function(res) {
          var selectedProduct = res.pickProduct;
          var selectedQty = "";

          for (var x in products) {
            if (products[x].product === selectedProduct) {
              console.log();
              selectedQty = products[x].quantity;
            }
          }

          inquirer
            .prompt([
              {
                message:
                  "How many units would you like to add to " +
                  selectedProduct +
                  "?",
                name: "numberOfUnits"
              }
            ])
            .then(function(res) {
              var number = res.numberOfUnits;
              var newQty = parseInt(selectedQty) + parseInt(number);

              var query = connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                  {
                    stock_qty: newQty
                  },
                  {
                    product_name: selectedProduct
                  }
                ],
                function(err, res) {
                  if (err) throw err;
                  console.log(
                    selectedProduct + " stock updated to " + newQty + " units"
                  );
                  endConnection();
                }
              );
            });
        });
    });
  }

  function addProduct() {
    inquirer
      .prompt([
        {
          name: "product",
          message: "What product would you like to add?"
        },
        {
          name: "units",
          message: "How many units would you like to add?"
        },
        {
          name: "price",
          message: "What is the price of this item?"
        },
        {
          name: "dept",
          message: "What department does the item fall under?",
          type: "list",
          choices: ["Denim", "Bottoms", "Tops", "Outerwear"]
        }
      ])
      .then(function(res) {
        var newProduct = res.product;
        var newUnits = res.units;
        var newPrice = parseFloat(res.price).toFixed(2);
        var newDept = res.dept;

        var query = connection.query(
          "INSERT INTO products SET ?",
          {
            product_name: newProduct,
            dept_name: newDept,
            price: newPrice,
            stock_qty: newUnits
          },
          function(err, res) {
            if (err) throw err;

            console.log(newProduct + " added to database.");
            endConnection();
          }
        );
      });
  }

  inquirer
    .prompt([
      {
        name: "menu",
        message: "Hello! What would you like to do?",
        choices: [
          "View all products",
          "View low inventory",
          "Add inventory",
          "Add a new product"
        ],
        type: "list"
      }
    ])
    .then(function(res) {
      if (res.menu === "View all products") {
        displayProducts();
        endConnection();
      } else if (res.menu === "View low inventory") {
        lowInventory();
        endConnection();
      } else if (res.menu === "Add inventory") {
        addInventory();
      } else if (res.menu === "Add a new product") {
        addProduct();
      }
    });
};

module.exports = {
  managerView
};
