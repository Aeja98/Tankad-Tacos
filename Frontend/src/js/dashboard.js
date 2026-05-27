import "../scss/main.scss";

const API_URL = "https://autentisering-backend.onrender.com";

const token = sessionStorage.getItem("token");
const username = sessionStorage.getItem("username");

const welcomeMessage = document.querySelector("#welcomeMessage");
const dashboardContent = document.querySelector("#dashboardContent");
const messageElement = document.querySelector("#message");
const logoutBtn = document.querySelector("#logoutBtn");

// If no token exists, user is not logged in
if (!token) {
  window.location.href = "login.html";
}

// Show username from sessionStorage
if (username) {
  welcomeMessage.textContent = `Välkommen, ${username}. Du är inloggad i adminpanelen.`;
}

// Get protected dashboard data
async function getDashboardData() {
  try {
    const response = await fetch(`${API_URL}/api/admin/dashboard`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      messageElement.textContent = data.message || "Du har inte behörighet att visa denna sida.";
      messageElement.classList.add("error");

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("username");

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);

      return;
    }

    renderDashboard(data);
  } catch (error) {
    messageElement.textContent = "Kunde inte hämta skyddad data från servern.";
    messageElement.classList.add("error");
    console.error(error);
  }
}

// Print protected data on page
function renderDashboard(data) {
  dashboardContent.innerHTML = `
    <article class="card">
      <h2>${data.restaurant.name}</h2>
      <p>${data.restaurant.concept}</p>
      <p><strong>Meddelande från API:</strong> ${data.message}</p>
      <p><strong>Inloggad användare:</strong> ${data.loggedInUser}</p>
    </article>

    <article class="card">
      <h2>Meny från databasen</h2>
      <ul class="menu-list">
        ${data.menu
          .map((item) => {
            const fillings = item.fillings || [];

            return `
              <li>
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p><strong>Kategori:</strong> ${item.category}</p>
                <p><strong>Fyllningar/alternativ:</strong> ${fillings.join(", ")}</p>
                <p><strong>Pris:</strong> ${item.price} kr</p>
              </li>
            `;
          })
          .join("")}
      </ul>
    </article>
  `;
}

// Log out user
logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("username");

  window.location.href = "login.html";
});

getDashboardData();