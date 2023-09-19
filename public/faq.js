/**
 * CS 132
 * Name: Emily Pan
 * CS 132 Spring 2023
 *
 * This is the javascript code for my e-commerce store that will
 * handle all of the frontend javascript to allow for FAQ functionality.
 */
(function () {
  "use strict";

  let DEBUG = false;

  /**
   * Initializes the Q&A
   */
  async function init() {
    getQA();
  }

  /**
   * Uses the "/faq" endpoint to get all the FAQ text
   * from the database. 
   */
  async function getQA() {
    try {
      let resp = await fetch(`/faq`, {
                method: "GET",
            });
      let response = checkStatus(resp);
      let faqContent = await response.text();
      let parsed = getFAQData(faqContent);
      appendFAQData(parsed);
    } catch (err) {
      errorHandler(err);
    }
  }

  /**
   * Parses FAQ text into a list to be displayed
   * @param {String} faqContent 
   * @returns faqData - List of strings
   */
  function getFAQData(faqContent) {
    const faqLines = faqContent.split("\n");
    const faqData = [];

    for (let i = 0; i < faqLines.length; i += 2) {
      const question = faqLines[i];
      const answer = faqLines[i + 1];
      faqData.push({ question, answer });
    }

    return faqData;
  }

  /**
   * Adds all the data from the database into the website
   * as DOM elements. 
   * @param {Object} faqs 
   */
  function appendFAQData(faqs) {
    const faqSection = id("faq-section");

    for (let i = 0; i < faqs.length; i++) {
      const question = faqs[i].question;
      const answer = faqs[i].answer;

      const questionElement = gen("h2");
      questionElement.textContent = question;

      const answerElement = gen("p");
      answerElement.textContent = answer;

      faqSection.appendChild(questionElement);
      faqSection.appendChild(answerElement);
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
