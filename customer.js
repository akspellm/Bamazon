var mysql = require("mysql");
var inquirer = require("inquirer");

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

var buyProduct = function() {
  var products = [];
  var productList = [];

  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    for (var x in res) {
      var product = res[x].product_name;
      var price = res[x].price;
      var quantity = res[x].stock_qty;

      products.push({
        product: product,
        price: price,
        quantity: quantity
      });

      productList.push(res[x].product_name);
    }

    inquirer
      .prompt([
        {
          message: "\nWhat would you like to buy today?",
          name: "pickProduct",
          type: "list",
          choices: productList
        }
      ])
      .then(function(res) {
        var selectedProduct = res.pickProduct;
        var selectedPrice = 0;
        var selectedQty = "";

        for (var x in products) {
          if (products[x].product === selectedProduct) {
            console.log();
            selectedPrice = products[x].price;
            selectedQty = products[x].quantity;
          }
        }

        inquirer
          .prompt([
            {
              message: "How many would you like to buy?",
              name: "numberOfUnits"
            }
          ])
          .then(function(res) {
            var number = res.numberOfUnits;

            if (number > selectedQty) {
              console.log(
                "Sorry, we only have " +
                  selectedQty +
                  " units of " +
                  selectedProduct +
                  " available."
              );
              endConnection();
            } else {
              console.log("\n**************************");
              console.log("Here is your invoice:");
              var total = 0;

              for (var x = 0; x < res.numberOfUnits; x++) {
                console.log();
                console.log(
                  "** (1) " + selectedProduct + " - " + selectedPrice
                );
                total += selectedPrice;
              }
              console.log("\nTOTAL : $" + parseFloat(total).toFixed(2));
              console.log("\n**************************\n");

              inquirer
                .prompt([
                  {
                    name: "confirmPurchase",
                    default: "no",
                    message: "Select yes to confirm your purchase",
                    type: "confirm"
                  }
                ])
                .then(function(res) {
                  if (res.confirmPurchase) {
                    var newQty = selectedQty - number;

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
                          "\nCongrats! You just bought " +
                            selectedQty +
                            " units of " +
                            selectedProduct +
                            " for $" +
                            total +
                            ". Enjoy your purchase!"
                        );
                        endConnection();
                      }
                    );
                  }
                });
            }
          });
      });
  });
};

module.exports = {
  buyProduct: buyProduct
};
