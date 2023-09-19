/**
 * CS 132
 * Name: Emily Pan
 * CS 132 Spring 2023
 *
 * This is the javascript code for my e-commerce store that will
 * handle all of the frontend javascript to allow for users
 * to submit feedback to the website owners. 
 */
(function () {
  "use strict";

  let DEBUG = false;

  /**
   * Initalizes the form to accept user input for 
   * the customer feedback form. 
   */
  function init() {
    const form = id("contact-form");
    form.addEventListener("submit", (submitting) => {
      submitting.preventDefault();
      shareContact();
    });
  }

  /**
   * Gets the contact information from the form. 
   * Uses the API "/contact-us" endpoint to write the 
   * contact information and message to the database. 
   */
  async function shareContact() {
    let params = new FormData();
    const cemail = id("email").value;
    params.append("cemail",cemail);
    const cmsg = id("msg").value;
    params.append("cmsg", cmsg);

    try {
      let resp = await fetch("/contact-us", {
        method: "POST", 
        body: params 
      });
      resp = checkStatus(resp);
      resp = await resp.text();
      id("response").textContent = resp;
    } catch (err) {
      errorHandler(err);
    }
  }

  /**
   * Handles errors with contact form. 
   * Users must enter emails and text correctly to submit. 
   * @param {String} err 
   */
  function errorHandler(err) {
    if (DEBUG) {
      console.log(err);
    } else {
      id("submit-result").textContent =
        "Your message could not be submitted at this time." +
        "Please refresh and try again." +
        "If the issue persists, please try again later.";
    }
  }

  init();
})();
