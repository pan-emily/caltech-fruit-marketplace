/**
 * CS 132
 * Name: Gabriella Twombly and Emily Pan
 * CS 132 Spring 2023
 *
 * This is the javascript code for my e-commerce store that will
 * handle all of the backend javascript necessary to go between
 * Node and API.
 *
 * Some source code inspired by Cafe API Case Study
 * Author: El Hovik
 *
 * Requests/endpoints: 
 *   Home & Product page endpoints:
 *   GET /fruits 
 *   GET /fruit/fruit
 *   GET /fruitoptions
 * 
 *   Cart endpoints:
 *   POST /addtocart/:fruit 
 *   GET /getcart
 *   POST /removefromcart/:fruit
 *  
 *   Card customization endpoints:
 *   POST /customize 
 *   GET /getcustom 
 * 
 *   Contact page & FAQ endpoints: 
 *   POST /contact-us
 *   GET /faq
 */

const express = require("express");
const multer = require("multer");
const fs = require("fs/promises");
const path = require("path");
const { response } = require("express");
const res = require("express/lib/response");
const { json } = require("express/lib/response");
const cors = require("cors");

const SERVER_ERROR =
  "Something went wrong on the server, please try again later.";
const SERVER_ERR_CODE = 500;
const CLIENT_ERR_CODE = 400;
const DEBUG = true;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(multer().none());
app.use(cors());

/** 
 * This function returns all the fruit products in our
 * database as a JSON response. Relies in the file 
 * structure: 
 * data/fruits
 *   | (fruit1)
 *     | info.txt 
 *  | (fruit2)
 *     | info.txt 
 *  ...
 * 
 * Returns a 500 error for server errors. 
 * 
 * Return type is JSON 
 */
app.get("/fruits", async (req, res, next) => {
  try {
    let fruits = await getFruits();
    res.json(fruits);
  } catch (err) {
    res.status(SERVER_ERR_CODE);
    err.message = SERVER_ERROR;
    next(err);
  }
});

/** 
 * This function returns all the information on an
 * individual fruit product in our database.
 * 
 * If the individual searches for an invalid fruit (the)
 * fruit does not exist in our database, returns a 400
 * client error. 
 * Returns a 500 error code for server errors. 
 * 
 * Return type is JSON. 
 */
app.get("/fruit/:fruit", async (req, res, next) => {
  try {
    let fruit = req.params.fruit;

    // get all categories names of fruit in the datbase 
    // check if the fruit is in the database, otherwise throw client error
    // get the fruit information and output 

    let fruitPath = "data/fruit/" + fruit;
    let fruitData = await getFruitData(fruitPath);
    res.json(fruitData);
  } catch (err) {
    if (err.code == "ENOENT") {
      res.status(CLIENT_ERR_CODE);
      err.message = "The fruit requested does not exist.";
    } else {
      res.status(SERVER_ERR_CODE);
      err.message = SERVER_ERROR;
    }
    next(err);
  }
});

/**
 * Returns a list of all the names of the fruit available. 
 * The names of the fruit are extracted from directory names
 * for each of the fruit. Relies on the file structure: 
 *   data/fruits
 *     | (fruit1)
 *       | info.txt 
 *    | (fruit2)
 *       | info.txt 
 *    ...
 * 
 * Returns a 500 error for server issues. 
 * Return type is JSON.
 */
app.get("/fruitoptions", async (req, res, next) => {
  try {
    let fruits = await getFruitOptions();
    res.json(fruits);
  } catch (err) {
    res.status(SERVER_ERR_CODE);
    err.message = SERVER_ERROR;
    next(err);
  }
});

/**
 * This function adds a fruit to the cart. Given the fruit
 * by the API endpoint call, we add the information of the 
 * fruit desired to data/cart.txt, which is our database
 * file for cart storage. 
 * 
 * If the individual attempts to add an invalid fruit to the
 * cart, returns a 400 client error and warns the user. 
 * 
 * Return type is text. 
 */
app.post("/addtocart/:fruit", async(req, res, next) => {
  let path = "data/cart.txt";
  let fruit = req.params.fruit;
  const fruitPath = "data/fruit/" + fruit
  const fruitInfo = await getFruitData(fruitPath);
  // write info to cart.txt
  let info = `${fruit}\n${fruitInfo.price}\n${fruitInfo.description}\n${fruitInfo.customization}\n`;

  try {
    await fs.appendFile(path, info, "utf-8");
    res.type("text");
    res.send(`Added ${fruit} to cart.`);
  } catch(err) {
    res.status(CLIENT_ERR_CODE);
    err.message(`${fruit} cannot be added to the cart.`);
  }
  
});

/**
 * Returns all the items in the cart as JSON. Items in cart
 * are stored in data/cart.txt. 
 * 
 * Expected cart.txt format is: 
 *   fruit name 
 *   price 
 *   description 
 *   customizations 
 * 
 * Returns a 500 error for server errors including no cart.txt
 * file found. 
 * 
 * Return type is JSON. 
 */
app.get("/getcart", async (req, res, next) => {
  try {
    let fruits = await getCart();
    res.json(fruits);
    return res
  } catch (err) {
    res.status(SERVER_ERR_CODE);
    err.message = SERVER_ERROR;
    next(err);
  }
});

/**
 * Removes an item from the cart as specified by the end point. 
 * All other existing items in the cart including multiples of
 * the same item remain in the cart, only a single instance
 * of the specified fruit is removed. If the fruit does not exist
 * in the cart, then nothing is changed. Updates cart.txt file.
 * 
 * Return type is text. 
 */
app.post("/removefromcart/:fruit", async(req, res, next) => {
  let path = "data/cart.txt";
  let fruit = req.params.fruit;
  let fruits = await getCart();
  await fs.writeFile(path, "", "utf-8");
  // copy everything up to fruit
  let seen = 0;
  for (let i = 0; i < fruits.length; i++) {
    const fruitInfo = fruits[i];
    if (fruitInfo.name == fruit && seen == 0) {
      // allows only 1 instance of the fruit to be removed if there are multiples
      seen = 1;
    } else {
      let info = `${fruitInfo.name}\n${fruitInfo.price}\n${fruitInfo.description}\n${fruitInfo.customization}\n`;
      await fs.appendFile(path, info, "utf-8");
      res.type("text");
    }
  }
  res.send(`Removed ${fruit} from cart.`);
});

/**
 * This function updates the note as per the user's customization.
 * Currently, the note's paper color and text content can be customized.
 * Card information is stored in data/card.txt. 
 * 
 * Server errors like failure to write to card.txt are
 * returned with 500 error. 
 * Returns 400 client errors like invalid customization attempts. 
 * 
 * Return type is text. 
 */
app.post("/customize", async(req, res, next) => {
  let info = req.body.info;
  let color = req.body.color;
  let txt = info + "\n" + color;

  try {
    await fs.writeFile("data/card.txt", txt, "utf8"); 
    res.type("text");
    res.send("Added customization");
  } catch (err) {
    if (err.code == "ENOENT") {
      res.status(CLIENT_ERR_CODE);
      err.message = "You can't do this customization.";
    }
    else {
      res.status(SERVER_ERR_CODE);
      err.message = SERVER_ERROR;
      next(err);
    }
  }
})

/**
 * Returns all the information about user note customization as JSON.
 * If there is no customization, a default message will be added. 
 * 
 * Returns a 500 error for server errors. 
 * 
 * Return type is JSON. 
 */
app.get("/getcustom", async(req, res, next)=> {
  try {
    let info = await getCustom();
    res.json(info);
  } catch (err) {
    res.status(SERVER_ERR_CODE);
    err.message = SERVER_ERROR;
    next(err);
  }
})

/**
 * Returns all the FAQ in the database as text. 
 * FAQ is stored in data/faq.txt
 * 
 * Returns a 500 error for server errors. 
 * 
 * Return type is text. 
 */
app.get("/faq", async(req, res, next)=> {
  try {
    let info = await getFAQ();
    res.type("text");
    res.send(info);
  } catch (err) {
    res.status(SERVER_ERR_CODE);
    err.message = SERVER_ERROR;
    next(err);
  }
})

/**
 * Records information when users leave a message on the contact-us
 * page. Users are required to input at least a 10 character long
 * message and leave an email in the correct email format.
 * Messages are recorded to data/contact-messages.txt. 
 * 
 * Returns 400 errors for client errors like messages and emails
 * that do not follow the requirements. 
 * Returns 500 errors for server errors. 
 * 
 * Return type is text.  
 */
app.post("/contact-us", async (req, res, next) => {
  let message;
  let email = req.body.cemail;
  let message_text = req.body.cmsg;

  if (email && message_text) {
    message = {
      email: email,
      message_text: message_text,
    };
  }
  if (!message) {
    res.status(CLIENT_ERR_CODE);
    next(Error("Please enter a minimum of 15 characters."));
  }

  try {
    let client_message = message.email + " : " + message.message_text + "\n";
    await fs.appendFile("data/contact-messages.txt", client_message, "utf8");
    res.type("text");
    res.send("Thank you for contacting us. We will get back to you as soon as we can.");
  } catch (err) {
    res.status(SERVER_ERR_CODE);
    err.message = SERVER_ERROR;
    next(err);
  }
});


/** Possible helper functions
 */

/**
 * Gets all the existing card customizations. Card customizations 
 * are stored in the data/card.txt file. If there is no customization
 * yet, then default "No message added" and "No color selected" information
 * is populated. 
 * 
 * @param None 
 * @returns {JSON Object} Card customizations {info, color}
 */
async function getCustom() {
  let file_info = await fs.readFile("data/card.txt", "utf8");
  if (file_info.length == 0) {
    return {info: "No message added" , color: "No color selected"}
  } else {
    let data = file_info.split("\n");
    let info = data[0];
    let color = data[1];
    return {
      info: info,
      color: color
    };
  }
}

/**
 * Gets all the fruits in the database. Fruits are defined by their
 * folder names. All fruit folders are under the data/ directory. 
 * 
 * This function only identifies a fruit if it is a subdirectory of the
 * data/ directory. 
 * @param None 
 * @returns {JSON Object} All information about all fruits 
 *   {fruitName: {
 *       fruit.name 
 *       fruit.price 
 *       fruit.description 
 *       fruit.img 
 *       fruit.alt
 *       fruit.source
 *       fruit.quantity
 *       fruit.customizations}, 
 *     ...}
 */
async function getFruits() {
  let result = [];
  try {
    // reads directory and only allows paths that are directories to be added
    let path = "data/fruit/";
    // let itemDirs = await fs.readdir(path, {withFileTypes:true});
    let itemDirs = await fs.readdir(path, { withFileTypes: true }, (error, files) => {
      const dirs = files
          .filter((item) => item.isDirectory())
          .map((item) => item.name);
    });

    // assembles all fruit data
    for (let i = 0; i < itemDirs.length; i++) {
      // get fruit path 
      let fruitPath = itemDirs[i].path + itemDirs[i].name;
      // get fruit data
      let fruitData = await getFruitData(fruitPath);
      result.push(fruitData);
    }

    return result;
  } catch (err) {
    throw err;
  }
}

/**
 * Gets all the fruit options by only reading directories. 
 * Only returns the names of the fruit, not all the associated information.
 * @returns {JSON Object} JSON of all the fruit names in the database
 */
async function getFruitOptions() {
  let result = [];
  try {
    let path = "data/fruit/";
    let itemDirs = await fs.readdir(path, { withFileTypes: true }, (error, files) => {
      const dirs = files
          .filter((item) => item.isDirectory())
          .map((item) => item.name);
    });

    for (let i = 0; i < itemDirs.length; i++) {
      let fruitPath = itemDirs[i].path + itemDirs[i].name;
      let fruitData = await getFruitData(fruitPath);
      result.push(fruitData.name);
    }

    return result;
  } catch (err) {
    throw err;
  }
}

/**
 * This function will find the path to the data for
 * our API for a single fruit product and generate its
 * JSON.
 * 
 * @returns {JSON Object} All the information for a fruit
 */
async function getFruitData(fruitPath) {
  let file_info = await fs.readFile(fruitPath + "/info.txt", "utf8");
  let data = file_info.split("\n");
  let name = data[0];
  let price = data[1];
  let description = data[2];
  let img = data[3];
  let alt = data[4];
  let source = data[5];
  let quantity = data[6];
  let customization = data[7];
  return {
    name: name,
    price: price,
    description: description,
    img: img,
    alt: alt,
    source: source,
    quantity: quantity,
    customization: customization,
  };
}

/**
 * Gets all items in the cart
 * Cart information is stored in data/cart.txt
 * 
 * @returns {JSON Object} Fruit info 
 */
async function getCart() {
  let file_info = await fs.readFile("data/cart.txt", "utf8");
  let data = file_info.split("\n");
  line = 0
  let res = []
  while (data[line+1]) {
    let name = data[line];
    let price = data[line+1];
    let description = data[line+2];
    let customization = data[line + 3];
    line += 4;
    res.push( { name : name, price : price, description : description, customization: customization});
  }
  return res
}

/**
 * Gets all the FAQ info from the data/faq.txt file. 
 * @returns String text of FAQ information
 */
async function getFAQ() {
  let file_info = await fs.readFile("data/faq.txt", "utf8");
  return file_info;
}


/**
 * This function handles the errors
 */
function errorHandler(err, req, res, next) {
  if (DEBUG) {
    console.error(err);
  }
  res.type("text");
  res.send(err.message);
}

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("LISTENING ON PORT " + PORT + "...");
});
