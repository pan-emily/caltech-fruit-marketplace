/**
 * CS 132
 * Name: Emily Pan
 * CS 132 Spring 2023
 *
 * This is the javascript code for my e-commerce store that will
 * handle all of the frontend javascript to allow for single-
 * product search and view. 
 */
(function () {
    "use strict";
  
    let DEBUG = false;

    /**
     * Initializes the search bar
     */
    function init() {
        // On load: create form to take user input  
        const form = id("fruit-form");
        form.addEventListener("submit", function(evt) {
            evt.preventDefault();
            searchFruit();
        });
    }

    /**
     * Determines if the searched fruit is valid. 
     * Shows the fruit searched for 
     */
    async function searchFruit() {
        // clear current children of item-showcase
        const old = id("item-showcase");
        while (old.firstChild) {
            old.removeChild(old.firstChild);
        }

        const fruit = id("fruit-search").value;

        // get the fruit in the database 
        const categories = await getCategories();

        // check if fruit is in the database 
        if (categories.includes(fruit.toLowerCase())) {
            // show fruit information 
            showFruit(fruit.toLowerCase());
        } else {
            // display an error message
            const msg = gen("p");
            msg.textContent = "We don't have that fruit. Try again.";
            id("item-showcase").appendChild(msg);
        }
    }

    /**
     * Gets all the fruits in the databse using the '/fruitoptions'
     * API endpint. 
     * @returns 
     */
    async function getCategories() {
        try {
            let resp = await fetch(`/fruitoptions`, {
                method: "GET",
            });
            let response = checkStatus(resp);
            let fruitOptions = await response.json();
            return fruitOptions;
        } catch (err) {
            errorHandler(err);
        }
    }

    /**
     * Gets all the information about a given fruit using the 
     * '/fruit/fruit' API endpint. 
     * @param {String} fruit 
     */
    async function showFruit(fruit) {
        try {
            let resp = await fetch(`/fruit/${fruit}`, {
                method: "GET",
            });
            let response = checkStatus(resp);
            let fruitInfo = await resp.json();

            displayFruit(fruitInfo);
        } catch (err) {
            errorHandler(err);
        }
    }

    /**
     * Adds fruit information as DOM elements
     * @param {Object} fruit all information about the fruit to show
     */
    function displayFruit(fruit) {
        let parent = id("item-showcase");
        
        let h2 = gen("h2");
        h2.textContent = formatText(fruit.name);
        parent.appendChild(h2);

        const img = gen("img");
        img.src = fruit.img;
        img.alt = fruit.alt;
        parent.appendChild(img);

        const price = gen("p");
        price.textContent = "Price: $" + formatText(fruit.price);
        parent.appendChild(price);

        const description = gen("p");
        description.textContent = formatText(fruit.description);
        parent.appendChild(description);

        const source = gen("p");
        source.textContent = "From: " + formatText(fruit.source);
        parent.appendChild(source);

        const qty = gen("p");
        qty.textContent = "Quantity remaining: " + formatText(fruit.quantity);
        parent.appendChild(qty);
        
    }

    function formatText(txt) {
        return txt.charAt(0).toUpperCase() + txt.slice(1);
    }

    function errorHandler(err) {
        if (DEBUG) {
          console.log(err);
        } else {
          id("faq-section").appendChild(gen("p")).textContent =
            "Sorry! Our website is facing issues. Please try again later.";
        }
      }
  
    window.onload = init;
  })();
  