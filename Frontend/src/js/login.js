import "../scss/main.scss";

const API_URL = "http://localhost:3000";

const loginForm = document.querySelector("#loginForm");
const messageElement = document.querySelector("#message");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  messageElement.textContent = "";
  messageElement.className = "message";

  const username = document.querySelector("#username").value.trim();
  const password = document.querySelector("#password").value.trim();

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      messageElement.textContent = data.message || "Något gick fel vid inloggning.";
      messageElement.classList.add("error");
      return;
    }

    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("username", data.user.username);

    window.location.href = "dashboard.html";
  } catch (error) {
    messageElement.textContent = "Kunde inte ansluta till servern.";
    messageElement.classList.add("error");
    console.error(error);
  }
});