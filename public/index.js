/**
 * CS 132
 * Name: Emily Pan
 * CS 132 Spring 2023
 *
 * This is the javascript code for my e-commerce store that will
 * handle all of the frontend javascript to allow for main page
 * functionality. Allows users to view all items available. 
 */
(function () {
    "use strict";
  
    let DEBUG = false;
  
    /**
     * Initializes all the products avaialble. 
     */
    async function init() {
      // Populate fruits page with all available fruit
      let fruitsData = await fetchFruits();
      showFruits(fruitsData);
    }

    /**
     * Uses the API '/fruits' endpoint to get all the
     * fruit information to display
     * @returns 
     */
    async function fetchFruits() {
        try {
            let resp = await fetch(`/fruits`, {
                method: "GET",
            });
            resp = checkStatus(resp);
            let fruitsContent = resp.json();
            return fruitsContent
        } catch (err) {
            errorHandler(err);
        }
    }

    /**
     * Adds all the fruit information as DOM elements
     * @param {Object} fruitsContent 
     */
    function showFruits(fruitsContent) {
        let wrapper = id("item-container");
        fruitsContent.forEach(fruit => {
            const article = gen("article");
            const h3 = gen("h3");
            h3.textContent = formatText(fruit.name);
            article.appendChild(h3);

            const img = gen("img");
            img.src = fruit.img;
            img.alt = fruit.alt;
            article.appendChild(img);

            const button = gen("button");
            button.classList.add("single-view");
            button.id = fruit.name;
            button.classList.add(fruit.name + "-button");
            button.addEventListener("click", showProduct);
            button.textContent = "See More Information";
            article.appendChild(button);

            const button2 = gen("button");
            button2.classList.add("add-cart");
            button2.id = "cart-" + fruit.name;
            button2.classList.add("cart-" + fruit.name);
            button2.addEventListener("click", addToCart);
            button2.textContent = "Add to Cart";
            article.appendChild(button2)

            article.classList.add("item-preview");
            article.classList.add(fruit.name);

            wrapper.appendChild(article);
        });
    }

    /**
     * Formats all text so that first letter is capitalized. 
     * @param {String} txt 
     * @returns String formatted tex
     */
    function formatText(txt) {
        return txt.charAt(0).toUpperCase() + txt.slice(1);
    }

    /**
     * Adds a fruit to cart using the "/addtocart/fruit" API 
     * endpiont. 
     */
    async function addToCart() {
        const button = this.id;
        const fruit = button.slice(5);
        this.textContent = "Added to Cart";

        const params = new FormData();
        params.append("name", fruit);

        try {
            const resp = await fetch(`/addtocart/${fruit}`, {
                method: "POST",
                body: params
            });
            let response = checkStatus(resp);
            response = await response.text();
        } catch (err) {
            errorHandler(err);
        }
    }

    /**
     * Displays all the product information as DOM elements. 
     */
    async function showProduct() {
        const fruit = this.id;
        this.textContent = "Information";

        // fetch fruit info 
        let fruitData = await fetchFruit(fruit);

        // add fruit info to DOM element
        const div = gen("div");
        div.classList.add(fruit);

        const price = gen("p");
        price.textContent = "Price: $" + formatText(fruitData.price);
        div.appendChild(price);

        const description = gen("p");
        description.textContent = formatText(fruitData.description);
        div.appendChild(description);

        const source = gen("p");
        source.textContent = "From: " + formatText(fruitData.source);
        div.appendChild(source);

        const qty = gen("p");
        qty.textContent = "Quantity remaining: " + formatText(fruitData.quantity);
        div.appendChild(qty);

        const info = id(fruit);
        info.appendChild(div);

        // disable button clicking
        this.disabled = true; 
    }
   
    /**
     * Uses the API endpoint '/fruit/fruit' to obtain all the 
     * information about the fruits. 
     * @param {String} fruit 
     * @returns 
     */
    async function fetchFruit(fruit) {
        try {
            let resp = await fetch(`/fruit/${fruit}`, {
                method: "GET",
            });
            resp = checkStatus(resp);
            let fruitContent = resp.json();
            return fruitContent
        } catch (err) {
            errorHandler(err);
        }
        
    }
  
    function errorHandler(err) {
      if (DEBUG) {
        console.log(err);
      } else {
        id("faq-section").appendChild(gen("p")).textContent =
          "Sorry! Our website is facing issues. Please try again later.";
      }
    }
  
    init();
  })();
  