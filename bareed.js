/**************************************************************
 * Point: defines a point on the map using X and Y coordinates
 *
 * x: x coordinate
 * y: y coordinate
 *
 * distanceTo(point): takes a point, calculates the distance to
 *                     that point from the current point.
 *
 * let point = new Point(x, y);
 ****************************************************************/
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distanceTo = point => {
    let xDelta = this.x - point.x;
    let yDelta = this.y - point.y;
    return Math.sqrt(xDelta * xDelta + yDelta * yDelta); // PYTHAGORAS!
  };

  equals = point => point.x === this.x && point.y === this.y;

  static randomPoint = (maxX, maxY) => {
    let x = Math.random() * (maxX || 100);
    let y = Math.random() * (maxY || 100);
    return new Point(x, y);
  };
}

/**********************************************************
 * Wallet: keeps track of money
 *
 * money: how much money is in the wallet. Defaults to 0.
 *
 * credit(amount): adds `amount` to `money`.
 *
 * debit(amount): subtracts `amount` from `money`.
 *
 * let wallet = new Wallet(money);
 **********************************************************/
class Wallet {
  constructor(money = 0) {
    this.money = money;
  }

  credit = amount => {
    this.money = this.money + amount;
  };

  debit = amount => {
    this.money = this.money - amount;
  };
}

/**********************************************************
 * Person: defines a person with a name (and feelings)
 *
 * name: name of said person
 * location: a Point
 * wallet: a Wallet instance initially with 0.
 *
 * moveTo(point): updates the `location` to `point`
 *
 * let person = new Person(name, x, y);
 **********************************************************/
class Person {
  constructor(name, x, y) {
    this.name = name;
    this.wallet = new Wallet();
    this.x = x;
    this.y = y;
    this.location = new Point(x, y);
  }
  moveTo = point => (this.location = point);
}

/**********************************************************
 * Vendor: defines a vendor
 * Subclasses Person
 *
 * range: the maximum distance this vendor can travel - initially 5
 * price: the cost of a single ice creams - initially 1
 *
 * sellTo(customer, numberOfIceCreams):  sells a specific number of ice creams
 *     to the customer by doing the following:
 *         - Moves to the customer's location
 *         - Transfers money from the customer's wallet
 *           to the vendor's wallet
 *
 * new vendor = new Vendor(name, x, y);
 **********************************************************/
class Vendor extends Person {
  constructor(name, x, y, range = 5, price = 1) {
    super(name, x, y);
    this.range = range;
    this.price = price;
  }
  sellTo = (customer, numberOfIceCreams) => {
    this.location = customer.location;
    const total = numberOfIceCreams * this.price;
    customer.wallet.debit(total);
    this.wallet.credit(total);
  };
}

/**********************************************************
 * Customer: defines a customer
 * Subclasses Person
 *
 * wallet: a Wallet instance initially with 10.
 *
 * _isInRange(vendor): checks if the customer is in range of vendor.
 *
 * _haveEnoughMoney(vendor, numberOfIceCreams): checks if the customer
 *     has enough money to buy a specific number of ice creams from vendor.
 *
 * requestIceCream(vendor, numberOfIceCreams): if the customer is in the vendor's
 *     range and has enough money for icecream, a request is sent to the vendor.
 *
 * new customer = new Customer(name, x, y);
 **********************************************************/
class Customer extends Person {
  constructor(name, x, y) {
    super(name, x, y);
    this.wallet = new Wallet(10);
  }
  _isInRange = vendor => {
    let distance = this.location.distanceTo(vendor.location);
    if (distance <= vendor.range) {
      return true;
    }
    return false;
  };
  _haveEnoughMoney = (vendor, numberOfIceCreams) => {
    let total = vendor.price * numberOfIceCreams;
    if (total <= this.wallet.money) return true;
    else return false;
  };
  requestIceCream = (vendor, numberOfIceCreams) => {
    if (
      this._isInRange(vendor) &&
      this._haveEnoughMoney(vendor, numberOfIceCreams)
    ) {
      vendor.sellTo(this, numberOfIceCreams);
    }
  };
}

export { Point, Wallet, Person, Customer, Vendor };

/***********************************************************
 * If you want examples of how to use the
 * these classes and how to test your code manually,
 * check out the README.md file
 ***********************************************************/
