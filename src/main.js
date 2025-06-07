import API_URL from './config.js'; // Importerar API-URL från konfigurationsfil
import './style.css'; // Importerar CSS för att styla sidan

const menuDiv = document.querySelector('.app'); // Hämtar div där menyn ska visas

// Hämtar menydata från API
fetch(`${API_URL}/menu`)
  .then(response => response.json()) // Konverterar svaret till JSON
  .then(data => {
    // Skapar ett objekt för att sortera rätter efter kategori
    const categories = {
      starter: [], // Förrätter
      main: [], // VArmrätter
      dessert: [] // Efterrätter
    };

    /// Går igenom varje rätt och lägger den i rätt kategori
    data.forEach(item => {
      if (categories[item.category]) {
        categories[item.category].push(item);
      }
    });

    // Skriver ut översättningar för varje kategori
    const categoryTitles = {
      starter: "Förrätter",
      main: "Varmrätter",
      dessert: "Efterrätter"
    };

    // Går igenom kategorierna i ordning och skapar sektioner för varje
    ["starter", "main", "dessert"].forEach(category => {
      const items = categories[category]; // Hämtar rätter i aktuell kategori
      if (items.length > 0) {
        const section = document.createElement('section'); // Skapar en sektion för kategorin
        section.classList.add('menu-category');
        section.innerHTML = `<h2 class="menu-heading">${categoryTitles[category]}</h2>`; // Lägger till rubrik med kategorins namn

        items.forEach(item => {
          const itemDiv = document.createElement('div');
          itemDiv.classList.add('menu-item');
          itemDiv.innerHTML = `
            <h3>${item.name} - ${item.price} kr</h3>
            <p>${item.description}</p>
          `;
          section.appendChild(itemDiv); // Lägger till rätten i sektionen
        });

        menuDiv.appendChild(section); // Lägger till sektionen i huvuddiven på sidan
      }
    });
  })
  .catch(error => {
    // Om något går fel vid hämtning av data
    console.error('Fel vid hämtning av meny:', error);
    menuDiv.innerHTML = '<p>Kunde inte ladda menyn.</p>';
  });