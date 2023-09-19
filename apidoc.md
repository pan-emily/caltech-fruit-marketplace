# Berry Market API Documentation
This berry Market API allows for functionality to interface
with a file-based berry database. The API has endpoints to 
handle information about berries, berry-related information, 
customization features, cart information, as well as contact
and FAQ.

Client errors are handled with 400-level errors. 
Server errors are handled with 500-level errors. 

## *GET /fruits*
**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns all the fruit products in the database as a JSON response. 

**Supported Parameters** None

**Example Request:** /fruits

**Example Response:**
```
[
    {"name": "apple", 
     "price": "1.50, 
     "description": "crisp texture", 
     "img": "imgs/apple.jpg, 
     "alt":"bushel-of-apples",
     "source":"apple hill, ca",
     "quantity":"10",
     "customization":"No customizations"}, 
     {"name": "banana ...}
]
```

**Error Handling:**
500 errors indicate server errors, such as incorrect file structure or missing info.txt files. 

## GET /fruit/:fruit*
**Request Format:** /fruit/:fruit

**Returned Data Format**: JSON

**Description:** Gets all information in the database about a specified fruit.

**Supported Parameters** 
* /:fruit (required)
  * Specifies which fruit you are trying to obtain data about

**Example Request:** /fruit/apple

**Example Response:**

```json
{"name":"apple","price":"1.50","description":"crisp texture","img":"imgs/apple.jpeg","alt":"bushel-of-apples","source":"apple hill, ca","quantity":"10","customization":"No customizations"}
```

**Error Handling:**
If user requests an invalid fruit and the fruit does not exist in the database, then 400 client error is returned. 500 error is returned for server errors. 


## GET /fruitoptions **
**Request Format:** /fruitoptions

**Returned Data Format**: JSON

**Description:** Gets the list of all names of the fruits available. 

**Supported Parameters** None

**Example Request:** /fruitoptions

**Example Response:**

```json
["apple","banana","blackberry","blueberry","cherry","grape","kiwi","mango","papaya","peach","pear","pineapple","plum","strawberry","watermelon"]
```

## *POST /addtocart/:fruit*
**Request Format:** /addtocart/:fruit

**Returned Data Format**: text

**Description:** Adds a fruit to the cart. 

**Supported Parameters** :fruit
* POST body parameters:
    * fruit - (required) the name of the fruit to add to cart


**Example Request:** /addtocart/apple

**Example Response:**
```
Added apple to cart.
```

**Error Handling:**
If the user attempts to add an invalid fruit to the cart, returns a 400 client error. 

## *GET /getcart*
**Request Format:** /getcart

**Returned Data Format**: JSON

**Description:** Gets all the items in the cart. 

**Supported Parameters** None

**Example Request:** /getcart

**Example Response:**

```json
[{"name":"grape","price":"2.00","description":"small, juicy fruits available in various colors often used in wine","customization":"No customizations"},
{"name":"apple","price":"1.50","description":"crisp texture","customization":"No customizations"}]
```

**Error Handling:**
If no file is found then 500 server error is returned. 

## *POST /removefromcart/:fruit*
**Request Format:** /removefromcart/:fruit

**Returned Data Format**: text

**Description:** Removes an item from the cart. All other exiting items in the cart including multiples of the same item remain in the cart. Only single instance of the specified fruit is removed. If the fruit does not exist in the cart, then nothing is change. 

**Supported Parameters** 
* POST body parameters:
    * fruit - (required) name of the fruit to remove from cart

**Example Request:** /removefromcart/apple

**Example Response:**

```
Removed apple from cart.
```

**Error Handling:**
Attempting to remove an item that isn't already in the cart does not raise an error, just continues. 

## POST /customize*
**Request Format:** /customize

**Returned Data Format**: text

**Description:** updates the note as per user's customization

**Supported Parameters** None


**Example Request:** /customize

**Example Response:**
```
Added customization 
```

**Error Handling:**
Invalid customization options raise 400 level client errors. Server errors raise 500 level errors, such as failure to write to card.txt. 


## *GET /getcustom*
**Request Format:** /getcustom

**Returned Data Format**: JSON

**Description:** Gets information and color of the user's custom note. 

**Supported Parameters** None

**Example Request:** /getcustom

**Example Response:**

```json
{"info":"omg!","color":"blue"}
```
**Error Handling:**
If the user had not set a note, a default message will be added. Server errors  like inaccessible files are signaled with 500 level errors. 

## *GET /faq*
**Request Type:** GET

**Returned Data Format**: Plain Text

**Description:** Gets all the FAQ in the database.

**Supported Parameters** None

**Example Request:** /faq

**Example Response:**

```
Why did you choose to start a fruit market? We chose to start a fruit market because we love fruits and think that they are so important to health. But unfortunately Caltech does not have a great offering so we hope this can help! Can I customize my order? Yes! You can customize your order with a note. At the bottom of your cart, you can add a note and customize the color and text of the note. What kind of fruit do you sell? We work with local farmers and our close country neighbors to provide you with the freshest, tastiest, fruit! How do you search for an item? Click the "Product" tab and there is a search feature. Type in the fruit you are looking for and if we offer it, it will show you the information. Otherwise, we unfortuantely do not currently carry the fruit. You don't have the fruit I'm looking for. Where can I request it? We have a feedback/contact us form under the "Contact Us" tab. Please feel free to send us a message and we will try our hardest to add your fruit to our offerings!
```
**Error Handling:**
If FAQ file is inaccessible, then  500 error for server will be returned. 


## *GEt /contact-us*
**Request Type:** GET

**Returned Data Format**: Plain Text

**Description:** Records user feedback. 

**Supported Parameters** cemail: the email of the user input. cmsg: the message body of the feedback. 

**Example Request:** /contact-us

**Example Response:**

```
Thank you for contacting us. We will get back to you shortly. 
```

**Error Handling:**
Incorrect user input such as incorrect email format or too short of a message will raise client errors. If there is a failure to write the feedback to the database a server level error will be raised. 
