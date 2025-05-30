import API_URL from './config.js';
import './style.css';

const menuDiv = document.querySelector('.app');

fetch(`${API_URL}/menu`)
  .then(response => response.json())
  .then(data => {
    const categories = {
      starter: [],
      main: [],
      dessert: []
    };

    // Sorterar data i respektive kategori
    data.forEach(item => {
      if (categories[item.category]) {
        categories[item.category].push(item);
      }
    });

    // Skriv ut i ordningen: starter → main → dessert
    const categoryTitles = {
      starter: "Förrätter",
      main: "Varmrätter",
      dessert: "Efterrätter"
    };

    ["starter", "main", "dessert"].forEach(category => {
      const items = categories[category];
      if (items.length > 0) {
        const section = document.createElement('section');
        section.classList.add('menu-category');
        section.innerHTML = `<h2 class="menu-heading">${categoryTitles[category]}</h2>`;

        items.forEach(item => {
          const itemDiv = document.createElement('div');
          itemDiv.classList.add('menu-item');
          itemDiv.innerHTML = `
            <h3>${item.name} - ${item.price} kr</h3>
            <p>${item.description}</p>
          `;
          section.appendChild(itemDiv);
        });

        menuDiv.appendChild(section);
      }
    });
  })
  .catch(error => {
    console.error('Fel vid hämtning av meny:', error);
    menuDiv.innerHTML = '<p>Kunde inte ladda menyn.</p>';
  });