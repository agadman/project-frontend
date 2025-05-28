import API_URL from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("jwt");
  const menuList = document.getElementById("menuList");
  const form = document.getElementById("addForm");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("jwt");
      window.location.href = "/login.html";
    });
  }

  async function fetchMenu() {
    try {
      const res = await fetch(`${API_URL}/menu`);
      const items = await res.json();
      menuList.innerHTML = "";

      items.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${item.name}</strong> (${item.category}) - ${item.price} kr
          <br>
          ${item.description}
          <button data-id="${item._id}">Ta bort</button>
        `;
        menuList.appendChild(li);

        li.querySelector("button").addEventListener("click", async () => {
          if (confirm(`Ta bort ${item.name}?`)) {
            await deleteItem(item._id);
            fetchMenu(); 
          }
        });
      });
    } catch (err) {
      console.error("Fel vid hämtning av meny:", err);
    }
  }

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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const description = document.getElementById("description").value.trim();
    const price = document.getElementById("price").value;
    const category = document.getElementById("category").value;

    if (!name || !description || !price || !category) {
      document.getElementById("form-message").textContent = "Fyll i alla fält!";
      return;
    }

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
        form.reset();
        fetchMenu();
      } else {
        const result = await res.json();
        alert(result.message || "Något gick fel");
      }
    } catch (err) {
      console.error("Fel vid tillägg:", err);
    }
  });

  fetchMenu(); 
});