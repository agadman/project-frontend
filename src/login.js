import API_URL from "./config";

// Hämtar formuläret och lägger på eventlyssnare
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Så att inte sidan laddas om vid submit
  
    // Hämtar värden från formuläret
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
      // Skickar en POST-förfrågan med e-post och lösenord
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      // Om förfrågan lyckas, lagra JWT-token i sessionStorage
      const result = await res.json();
      if (res.ok) {
        const token = result.token;
        sessionStorage.setItem('jwt', token); 
        window.location.href = '/admin.html'; // Omdirigerar till admin sidan
      } else {
        document.getElementById('message').textContent = result.error || 'Fyll i användarnamn/lösenord';
      }
    } catch (err) {
      console.error(err);
      document.getElementById('message').textContent = 'Something went wrong';
    }
  });