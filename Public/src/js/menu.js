import "../scss/main.scss";

const API_URL = "http://localhost:3000";

const weekendSpecial = document.querySelector("#weekendSpecial");
const standardMenu = document.querySelector("#standardMenu");
const messageElement = document.querySelector("#message");

//fetch menu items from the public API route
async function getMenuItems() {
  try {
    const response = await fetch(`${API_URL}/api/menu`);
    const data = await response.json();

    //if server response isnt successful-show an error message
    if (!response.ok) {
      showMessage(data.message || "Kunde inte hämta menyn.", "error");
      return;
    }

    //if fetch is successful-send the menu data to renderMenu()
    renderMenu(data);
  } catch (error) {
    //runs if frontend cant connect to the backend at all
    showMessage("Kunde inte ansluta till servern.", "error");
    console.error(error);
  }
}

//splits the menu into weekend specials + regular menu items
function renderMenu(menuItems) {
  const specials = menuItems.filter((item) => item.isSpecial);
  const standardItems = menuItems.filter((item) => !item.isSpecial);

  renderMenuSection(weekendSpecial, specials, "Ingen weekend special finns just nu.");
  renderMenuSection(standardMenu, standardItems, "Inga menyobjekt finns just nu.");
}

//laods one menu section inside container
function renderMenuSection(container, items, emptyMessage) {
  //if section doesnt have items-display fallback message
  if (!items.length) {
    container.innerHTML = `<p>${emptyMessage}</p>`;
    return;
  }

  //create html for each menu item + insert it into page
  container.innerHTML = items
    .map((item) => {
      //converts the fillings/options array into string
      //if no options exist-show fallback text
      const fillings = item.fillings && item.fillings.length
        ? item.fillings.join(", ")
        : "Inga alternativ angivna";

      return `
        <article class="menuItemCard">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <p><strong>Kategori:</strong> ${item.category}</p>
          <p><strong>Fyllningar/alternativ:</strong> ${fillings}</p>
          <p><strong>Pris:</strong> ${item.price} kr</p>
        </article>
      `;
    })
    .join("");
}

//display status or error messages on pg
function showMessage(text, type) {
  messageElement.textContent = text;
  messageElement.className = `message ${type}`;
}

//start loading menu when pg opens
getMenuItems();