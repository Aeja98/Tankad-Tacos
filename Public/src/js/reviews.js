import "../scss/main.scss";

const reviewForm = document.querySelector("#reviewForm");
const reviewsList = document.querySelector("#reviewsList");
const messageElement = document.querySelector("#message");

//filler code till the actual code is added
reviewsList.innerHTML = `
  <p>Recensionsfunktionen kommer att kopplas till webbtjänsten senare.</p>
`;

reviewForm.addEventListener("submit", (event) => {
  event.preventDefault();

  messageElement.textContent = "Recensioner sparas inte ännu. Backend-route läggs till senare.";
  messageElement.className = "message";
});