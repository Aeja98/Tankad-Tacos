import "../scss/main.scss";

const API_URL = "http://localhost:3000";

const token = sessionStorage.getItem("token");
const username = sessionStorage.getItem("username");

const welcomeMessage = document.querySelector("#welcomeMessage");
const logoutBtn = document.querySelector("#logoutBtn");
const menuForm = document.querySelector("#menuForm");
const menuItemId = document.querySelector("#menuItemId");
const formTitle = document.querySelector("#formTitle");
const nameInput = document.querySelector("#name");
const categoryInput = document.querySelector("#category");
const descriptionInput = document.querySelector("#description");
const fillingsInput = document.querySelector("#fillings");
const priceInput = document.querySelector("#price");
const isSpecialInput = document.querySelector("#isSpecial");
const isAvailableInput = document.querySelector("#isAvailable");
const submitButton = document.querySelector("#submitButton");
const cancelBtn = document.querySelector("#cancelBtn");
const messageElement = document.querySelector("#message");
const menuList = document.querySelector("#menuList");

//redirect if user isnt logged in
if (!token) {
  window.location.href = "login.html";
}

//show logged-in user
if (username) {
  welcomeMessage.textContent = `Välkommen, ${username}. Du är inloggad i adminpanelen.`;
}

//show messages on page
function showMessage(text, type) {
  messageElement.textContent = text;
  messageElement.className = `message ${type}`;
}

//clear message text
function clearMessage() {
  messageElement.textContent = "";
  messageElement.className = "message";
}

//fetch all menu items from admin route
async function getMenuItems() {
  try {
    const response = await fetch(`${API_URL}/api/admin/menu`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || "Kunde inte hämta menyn.", "error");

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("username");

        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
      }

      return;
    }

    renderMenuItems(data);
  } catch (error) {
    showMessage("Kunde inte ansluta till servern.", "error");
    console.error(error);
  }
}

//render menu items in admin dashboard
function renderMenuItems(menuItems) {
  if (!menuItems.length) {
    menuList.innerHTML = "<p>Det finns inga menyobjekt ännu.</p>";
    return;
  }

  menuList.innerHTML = menuItems
    .map((item) => {
      const fillings = item.fillings && item.fillings.length
        ? item.fillings.join(", ")
        : "Inga alternativ angivna";

      const specialText = item.isSpecial ? "Ja" : "Nej";
      const availableText = item.isAvailable ? "Ja" : "Nej";

      return `
        <article class="menuItemCard">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <p><strong>Kategori:</strong> ${item.category}</p>
          <p><strong>Fyllningar/alternativ:</strong> ${fillings}</p>
          <p><strong>Pris:</strong> ${item.price} kr</p>
          <p><strong>Weekend special:</strong> ${specialText}</p>
          <p><strong>Synlig:</strong> ${availableText}</p>

          <div class="btnGroup">
            <button type="button" data-id="${item._id}" class="editBtn">Ändra</button>
            <button type="button" data-id="${item._id}" class="deleteBtn secondBtn">Radera</button>
          </div>
        </article>
      `;
    })
    .join("");
}

//add/update menu item
menuForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage();

  const id = menuItemId.value;

  const menuItem = {
    name: nameInput.value.trim(),
    category: categoryInput.value.trim(),
    description: descriptionInput.value.trim(),
    fillings: fillingsInput.value.trim(),
    price: priceInput.value,
    isSpecial: isSpecialInput.checked,
    isAvailable: isAvailableInput.checked
  };

  const url = id
    ? `${API_URL}/api/admin/menu/${id}`
    : `${API_URL}/api/admin/menu`;

  const method = id ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(menuItem)
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || "Något gick fel när menyobjektet skulle sparas.", "error");
      return;
    }

    showMessage(data.message || "Menyobjekt sparades.", "success");
    resetForm();
    getMenuItems();
  } catch (error) {
    showMessage("Kunde inte ansluta till servern.", "error");
    console.error(error);
  }
});

//listen for edit/delete btns
menuList.addEventListener("click", async (event) => {
  const clickedButton = event.target;

  if (clickedButton.classList.contains("editBtn")) {
    const id = clickedButton.dataset.id;
    const menuItems = await fetchMenuItemsForEdit();
    const itemToEdit = menuItems.find((item) => item._id === id);

    if (itemToEdit) {
      fillFormForEdit(itemToEdit);
    }
  }

  if (clickedButton.classList.contains("deleteBtn")) {
    const id = clickedButton.dataset.id;
    deleteMenuItem(id);
  }
});

//fetch menu items to find the one being edited
async function fetchMenuItemsForEdit() {
  try {
    const response = await fetch(`${API_URL}/api/admin/menu`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

//fill form with existing menu item data
function fillFormForEdit(item) {
  menuItemId.value = item._id;
  nameInput.value = item.name;
  categoryInput.value = item.category;
  descriptionInput.value = item.description;
  fillingsInput.value = item.fillings ? item.fillings.join(", ") : "";
  priceInput.value = item.price;
  isSpecialInput.checked = item.isSpecial;
  isAvailableInput.checked = item.isAvailable;

  formTitle.textContent = "Ändra menyobjekt";
  submitButton.textContent = "Uppdatera menyobjekt";
  cancelBtn.hidden = false;

  window.scrollTo({
    top: menuForm.offsetTop - 40,
    behavior: "smooth"
  });
}

//delete menu item
async function deleteMenuItem(id) {
  const confirmDelete = confirm("Är du säker på att du vill radera detta menyobjekt?");

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/admin/menu/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || "Kunde inte radera menyobjektet.", "error");
      return;
    }

    showMessage(data.message || "Menyobjekt raderades.", "success");
    getMenuItems();
  } catch (error) {
    showMessage("Kunde inte ansluta till servern.", "error");
    console.error(error);
  }
}

//reset form to add mode
function resetForm() {
  menuForm.reset();
  menuItemId.value = "";
  isAvailableInput.checked = true;

  formTitle.textContent = "Lägg till menyobjekt";
  submitButton.textContent = "Spara menyobjekt";
  cancelBtn.hidden = true;
}

//cancel edit mode
cancelBtn.addEventListener("click", () => {
  resetForm();
  clearMessage();
});

//log out
logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("username");

  window.location.href = "login.html";
});

//load menu items when page opens
getMenuItems();