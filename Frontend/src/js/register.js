import "../scss/main.scss";

const API_URL = "http://localhost:3000";

const registerForm = document.querySelector("#registerForm");
const messageElement = document.querySelector("#message");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  messageElement.textContent = "";
  messageElement.className = "message";

  const username = document.querySelector("#username").value.trim();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();

  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        email,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      messageElement.textContent = data.message || "Något gick fel vid registrering.";
      messageElement.classList.add("error");
      return;
    }

    messageElement.textContent = "Kontot skapades. Du kan nu logga in.";
    messageElement.classList.add("success");

    registerForm.reset();
  } catch (error) {
    messageElement.textContent = "Kunde inte ansluta till servern.";
    messageElement.classList.add("error");
    console.error(error);
  }
});