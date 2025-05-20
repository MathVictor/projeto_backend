document.getElementById('eventForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    title: document.getElementById('title').value,
    date: document.getElementById('date').value,
    userId: document.getElementById('userId').value.trim()
  };

  try {
    const res = await fetch('http://localhost:3000/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const json = await res.json();
    if (json.status === 'created') {
      showPopup();
      document.getElementById('eventForm').reset();
    } else {
      showPopupError(json.error || 'Erro ao salvar');
    }
  } catch (err) {
    showPopupError('Erro de conexão com o servidor.');
  }
});

document.getElementById('searchBtn').addEventListener('click', () => {
  const userId = document.getElementById('searchUserId').value.trim();
  const resultTitle = document.getElementById('searchResultTitle');

  if (!userId) {
    resultTitle.textContent = 'Informe o ID do usuário.';
    resultTitle.classList.remove('hidden');
    return;
  }

  resultTitle.textContent = `Compromissos de ${userId}`;
  resultTitle.classList.remove('hidden');
  fetchAndRenderEvents(userId);
});

function fetchAndRenderEvents(userId) {
  fetch(`http://localhost:3000/events?userId=${encodeURIComponent(userId)}`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('eventList');
      list.innerHTML = '';

      if (!data || data.length === 0) {
        list.innerHTML = `<p style="color:#aaa;">Nenhum compromisso encontrado.</p>`;
      } else {
        data.forEach(event => {
          const card = document.createElement('div');
          card.classList.add('event-card');
          card.innerHTML = `
            <h3>${event.title}</h3>
            <p>Data: ${new Date(event.date).toLocaleString()}</p>
          `;
          list.appendChild(card);
        });
      }

      list.classList.remove('hidden');
    })
    .catch(err => {
      console.error('Erro ao buscar eventos:', err);
    });
}

function showPopup() {
  const overlay = document.getElementById('popupOverlay');
  overlay.classList.remove('hidden');
  setTimeout(() => overlay.classList.add('hidden'), 4000);
}

function closePopup() {
  document.getElementById('popupOverlay').classList.add('hidden');
}

function showPopupError(message) {
  const popup = document.querySelector('#popupOverlay .popup');
  popup.querySelector('h2').textContent = 'Erro ao salvar';
  popup.querySelector('p').textContent = message;
  document.getElementById('popupOverlay').classList.remove('hidden');
}

