/**
 * CS 132
 * Name: Emily Pan
 * CS 132 Spring 2023
 *
 * This is the javascript code for my e-commerce store that will
 * handle all of the frontend javascript to allow for cart
 * functionality. Allows users to add or remove items from cart
 * as well as add and view customizations to a card. 
 */

(function () {
    "use strict";
  
    let DEBUG = false;

    /**
     * Initializes the cart view, card preview, and 
     * form submission. 
     * 
     * @param None 
     * @returns None 
     */
    async function init() {
        const cart = await fetchCart();
        showCart(cart);

        const card = await fetchPreview();
        showPreview(card);

        // On load: create form to take user input  
        const form = id("card-form");
        form.addEventListener("submit", function(evt) {
            evt.preventDefault();
            showCard();
        });

    }

    /**
     * Uses API to fetch all items in the cart using the '/getcart'
     * endpoint. 
     * @returns {Object} cart - all the items in the cart
     */
    async function fetchCart() {
        try {
            let resp = await fetch(`/getcart`, {
                method: "GET",
            });
            let response = checkStatus(resp);
            let cart = await response.json();
            return cart;
        } catch (err) {
            errorHandler(err);
        }
    }

    /**
     * Populates the #cart-wrapper DOM element with all the 
     * fruits in the cart as well as their information. 
     * Also adds button to allow for cart-removal functionality
     * 
     * @param {Object} cart - all the items in the cart
     * @returns None 
     */
    function showCart(cart) {
        const parent = id("cart-wrapper");
        for (let i = 0; i < cart.length; i++) {
            let fruit = cart[i];
            const div = gen("div");
            div.id = "in-cart-" + fruit.name;
            div.classList.add("fruit-cart");

            const h3 = gen("h3");
            h3.textContent = formatText(fruit.name);
            div.appendChild(h3);

            const price = gen('p');
            price.textContent = "Price: $" + fruit.price;
            div.appendChild(price);

            const description = gen("p");
            description.textContent = "Description: " + formatText(fruit.description);
            div.appendChild(description);

            const button = gen("button");
            button.classList.add("remove-cart");
            button.id = "remove-" + fruit.name;
            button.addEventListener("click", removeCart);
            button.textContent = "Remove from cart";
            div.appendChild(button);

            parent.appendChild(div);
        }
    }

    /**
     * Removes item from cart. Both removes from database
     * using the 'removefromcart/fruit' endpoint as well as
     * from the DOM by reloading the cart after the data
     * is removed from the cart file. 
     * 
     * @param None 
     * @returns None
     */
    async function removeCart() {
        const button = this.id;
        let fruit = button.slice(7);
        this.textContent = "Removed from Cart";

        const params = new FormData()
        params.append("name", fruit);

        try {
            const resp = await fetch(`/removefromcart/${fruit}`, {
                method: "POST",
                body: params
            });
            let response = checkStatus(resp);
            response = await response.text();

        } catch (err) {
            errorHandler(err);
        }

        // remove everything in cart and re-show 
        const old = id("cart-wrapper");
        while (old.firstChild) {
            old.removeChild(old.firstChild);
        }

        init();
    }

    /**
     * Fetches customization data using the '/getcustom' API 
     * endpoint. Returns all data of customizations as a JSON. 
     * @returns {Object} card - card customizations 
     */
    async function fetchPreview() {
        try {
            let resp = await fetch(`/getcustom`, {
                method: "GET",
            });
            let response = checkStatus(resp);
            let card = await response.json();
            return card;
        } catch (err) {
            errorHandler(err);
        }
    }

    /**
     * Adds elements to #card-text to display a preview
     * of the card as customized by the user. 
     * @param {Object} cardInfo - customizations: color, info
     */
    async function showPreview(cardInfo) {
        parent = id("card-text");
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }

        const color = cardInfo.color;
        const info = cardInfo.info;

        const msg1 = gen("h3");
        msg1.textContent = "Card Information"
        parent.appendChild(msg1);

        let disp = ""
        if (color) {
            disp = formatText(color) + " paper: ";
        }

        const msg2 = gen("p");
        msg2.textContent = disp + info;
        parent.appendChild(msg2);
    }

    /**
     * Adds the customization based on user input 
     * from the form. Gets values from #card-search
     * and #paper-color and updates the data file. 
     * Then updates the card preview DOM elements accordingly.
     */
    async function showCard() {
        const info = id("card-search").value;
        const color = id("paper-color").value;

        const params = new FormData();
        params.append("info", info);
        params.append("color", color);

        try {
            const resp = await fetch(`/customize`, {
                method: "POST",
                body: params, 
            });
            let response = checkStatus(resp);
            response = await response.text();

        } catch (err) {
            errorHandler(err);
        }

        const cardInfo = {info: info, color: color};
        showPreview(cardInfo);
    }

    /**
     * Formats text by capitalizing first letter of the string. 
     * @param {String} txt 
     * @returns returns the text input with first letter capitalized
     */
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
  
    init();
  })();
  