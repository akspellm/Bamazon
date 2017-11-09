DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  dept_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_qty INT(10) NULL,
  PRIMARY KEY (item_id)
);

SELECT * FROM bamazon;