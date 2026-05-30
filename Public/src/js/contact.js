import "../scss/main.scss";

const contactForm = document.querySelector("#contactForm");
const messageElement = document.querySelector("#message");

//filler code till the actual code is added
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  messageElement.textContent = "Meddelanden sparas inte ännu. Backend-route läggs till senare.";
  messageElement.className = "message";
});