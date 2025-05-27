import API_URL from './config';
import './style.css'

const menuDiv = document.getElementById('app');

fetch(`${API_URL}/menu`) 
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.innerHTML = `
        <h3>${item.name} - ${item.price} kr</h3>
        <p>${item.description}</p>
        <small>Kategori: ${item.category}</small>
        <hr>
      `;
      menuDiv.appendChild(itemDiv);
    });
  })
  .catch(error => {
    console.error('Fel vid hämtning av meny:', error);
    menuDiv.innerHTML = '<p>Kunde inte ladda menyn.</p>';
  });