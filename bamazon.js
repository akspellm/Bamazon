var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    user:'root',

    password: '',
    database: 'bamazon'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('connected as ' + connection.threadId);


    buyProduct ();
    // endConnection();
});

function endConnection() {
    connection.end();
};

function pushProducts() {
    

};

function displayProducts() {
    console.log('This is what we have for sale today:');
    connection.query('SELECT * FROM products',function(err, res) {
        if (err) throw err;

        for (var x in res) {
            console.log("\n*** Item: "+ res[x].product_name + ' - $'+ res[x].price);
        };
    });
};

function buyProduct() {

    var products = [];
    var productList = [];
    
        connection.query('SELECT * FROM products',function(err, res) {
            if (err) throw err;
    
            for (var x in res) {
                var product = res[x].product_name;
                var price = res[x].price;
                var quantity = res[x].stock_qty;

                products.push(
                    {product : product,
                    price: price,
                    quantity: quantity
                    }
                )

                productList.push(res[x].product_name)
            };


    
            inquirer.prompt([
                {
                    message: '\nWhat would you like to buy today?',
                    name: 'pickProduct',
                    type: 'list',
                    choices: productList,
                }
            ]).then(function(res) {
                var selectedProduct = res.pickProduct;
                var selectedPrice = 0;
                var selectedQty = "";

                for (var x in products) {
                    if (products[x].product === selectedProduct) {
                        selectedPrice = products[x].price;
                        selectedQty = products[x].quantity;
                    }
                }

                inquirer.prompt([
                    {
                        message: 'How many would you like to buy?',
                        name: 'numberOfUnits'
                    }
                ]).then(function(res){
                    console.log(res.numberOfUnits)
                    console.log('\nHere is your invoice:');

                    var number = res.numberOfUnits;

                    var total = 0; 

                    for (var x = 0; x < res.numberOfUnits; x++) {
                        console.log();
                        console.log('** (1) ' + selectedProduct + ' - ' +selectedPrice);
                        total += selectedPrice;
                    }
                    console.log('\nTOTAL : $' + total);

                    inquirer.prompt([
                        {
                            name: 'confirmPurchase',
                            default: 'no',
                            message: 'Select yes to confirm your purchase',
                            type: 'confirm'
                        }
                    ]).then(function(res){
                        if(res.confirmPurchase) {

                            var newQty = selectedQty -= number;

                            console.log(newQty);

                            var query = connection.query(
                                'UPDATE products SET ? WHERE ?',
                                [
                                    {
                                        product_name: selectedProduct
                                    },
                                    {
                                        stock_qty: newQty
                                    }
                                ], 
                                function(err, res) {
                                    if (err) throw err;

                                    console.log(res.affectedRows + ' quantity updated!');
                                    endConnection(); 
                                }
                            )
                            
                        }
                    })
                })
            })
        });           
}