import API_URL from "./config.js"; // Importerar API-URL från en separat konfigurationsfil

// Väntar tills hela sidan har laddats
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("jwt"); // Hämtar JWT-token från localStorage
  // Referenser till olika element i DOM
  const menuList = document.getElementById("menuList");
  const form = document.getElementById("addForm");
  const logoutBtn = document.getElementById("logoutBtn");

  // Om ingen token finns, skicka användaren till inloggningssidan
  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  // Om logga ut - ta bort token och gå till login-sidan
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("jwt");
      window.location.href = "/login.html";
    });
  }

  // Funktion för att hämta menyn från API och visa den på sidan
  async function fetchMenu() {
    try {
      const res = await fetch(`${API_URL}/menu`);
      const items = await res.json();
      menuList.innerHTML = ""; // Töm listan först

      items.forEach((item) => {
        // Skapar en li för varje menyobjekt
        const li = document.createElement("li");
        li.classList.add("menu-item");

        // Skapar ett textblock för namn, kategori, pris och beskrivning
        const textWrapper = document.createElement("div");
        textWrapper.classList.add("menu-item-text");
        textWrapper.innerHTML = `
          <strong>${item.name}</strong> (${item.category}) - ${item.price} kr<br>
          ${item.description}
        `;

        // Ändra-knapp
        const editBtn = document.createElement("button");
        editBtn.textContent = "Ändra";
        editBtn.classList.add("edit-btn");
        editBtn.addEventListener("click", () => showEditForm(item, li));

        // Ta bort-knapp
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Ta bort";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", async () => {
          if (confirm(`Ta bort ${item.name}?`)) {
            await deleteItem(item._id);
            fetchMenu(); // Uppdatera listan
          }
        });

        // Lägg till text och knappar i listobjektet
        li.appendChild(textWrapper);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        menuList.appendChild(li);
      });
    } catch (err) {
      console.error("Fel vid hämtning av meny:", err);
    }
  }

  // Funktion för att ta bort ett menyobjekt
  async function deleteItem(id) {
    try {
      await fetch(`${API_URL}/menu/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Fel vid borttagning:", err);
    }
  }

  // Funktion för att uppdatera ett menyobjekt
  async function updateItem(id, updatedData) {
    try {
      const res = await fetch(`${API_URL}/menu/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        fetchMenu(); // Laddar om listan efter uppdatering
      } else {
        const result = await res.json();
        alert(result.message || "Kunde inte uppdatera.");
      }
    } catch (err) {
      console.error("Fel vid uppdatering:", err);
    }
  }

  // Visar formulär för att redigera ett menyobjekt direkt i listan
  function showEditForm(item, li) {
    const formWrapper = document.createElement("div");
    formWrapper.classList.add("edit-form");

    formWrapper.innerHTML = `
      <input type="text" value="${item.name}" placeholder="Namn" class="edit-input name">
      <input type="text" value="${item.category}" placeholder="Kategori" class="edit-input category">
      <input type="number" value="${item.price}" placeholder="Pris" class="edit-input price">
      <input type="text" value="${item.description}" placeholder="Beskrivning" class="edit-input description">
      <button class="save-btn">Spara</button>
      <button class="cancel-btn">Avbryt</button>
    `;

    li.innerHTML = ""; // Rensar li 
    li.appendChild(formWrapper); // Lägger till formuläret i li

    const saveBtn = formWrapper.querySelector(".save-btn");
    const cancelBtn = formWrapper.querySelector(".cancel-btn");

    // När användaren sparar
    saveBtn.addEventListener("click", () => {
      const name = formWrapper.querySelector(".name").value.trim();
      const category = formWrapper.querySelector(".category").value.trim();
      const price = formWrapper.querySelector(".price").value.trim();
      const description = formWrapper.querySelector(".description").value.trim();

      if (name && category && price && description) {
        updateItem(item._id, { name, category, price, description });
      } else {
        alert("Alla fält måste fyllas i!");
      }
    });

    // Om användaren ångrar sig
    cancelBtn.addEventListener("click", () => {
      fetchMenu(); // Laddar om listan igen
    });
  }

  // Hanterar formulär för att lägga till ny rätt
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Stoppar sidan från att laddas om

    // Hämtar värden från formuläret
    const name = document.getElementById("name").value.trim();
    const description = document.getElementById("description").value.trim();
    const price = document.getElementById("price").value;
    const category = document.getElementById("category").value;

    // Kollar att alla fält är ifyllda
    const missingFields = [];
    if (!name) missingFields.push("namn");
    if (!description) missingFields.push("beskrivning");
    if (!price) missingFields.push("pris");
    if (!category) missingFields.push("kategori");

    // Visar felmeddelande om något saknas
    if (missingFields.length > 0) {
      document.getElementById("form-message").textContent =
        "Följande fält saknas: " + missingFields.join(", ");
      return;
    }

    // Skickar nytt menyobjekt till servern
    try {
      const res = await fetch(`${API_URL}/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, price, category }),
      });

      if (res.ok) {
        form.reset(); // Nollställar formuläret
        fetchMenu(); // LAddar om menyn
      } else {
        const result = await res.json();
        alert(result.message || "Något gick fel");
      }
    } catch (err) {
      console.error("Fel vid tillägg:", err);
    }
  });

  fetchMenu(); // Kör funktionen som hämtar och visar menyn
});