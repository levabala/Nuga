var div_test = document.querySelector("#test-div");

var bioTemplate = document.querySelector("#bio-content-template").content;
var cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
var card = cardTemplate.cloneNode(true);
card.appendChild(bioTemplate.cloneNode(true));
div_test.appendChild(card);
