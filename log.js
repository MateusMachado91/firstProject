import { ref, onValue, remove } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { auth, onAuthStateChangedListener, db } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.getElementById('logout-button');

  onAuthStateChangedListener((user) => {
    if (user && user.email === 'mateusmachado.s@hotmail.com') {
      console.log('Acesso autorizado');
      const logsRef = ref(db, '/logs');
      const logList = document.getElementById('log-list');

      onValue(logsRef, (snapshot) => {
        logList.innerHTML = '';

        if (!snapshot.exists()) {
          const li = document.createElement('li');
          li.className = 'no-logs';
          li.textContent = 'Nenhuma ação registrada.';
          logList.appendChild(li);
          return;
        }

        snapshot.forEach(userLogs => {
          const userName = userLogs.key;
          const userItem = document.createElement('li');
          const userTitle = document.createElement('strong');
          userTitle.textContent = userName;
          userTitle.style.cursor = 'pointer';

          const userLogList = document.createElement('ul');
          userLogList.style.display = 'block';

         
          userTitle.addEventListener('click', (event) => {
            if (event.target === userTitle) {
              userLogList.style.display = userLogList.style.display === 'none' ? 'block' : 'none';
            }
          });

          userLogs.forEach(log => {
            const logData = log.val();
            
            const logItem = document.createElement('li');
            logItem.textContent = `[${logData.data}] - ${logData.acao} - Pontuação: ${logData.pontuacao}`;
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fas fa-trash-alt delete-icon';
            deleteIcon.style.cursor = 'pointer';


            deleteIcon.addEventListener('click', (event) => {
              event.stopPropagation();
              const logRef = ref(db, `/logs/${userName}/${log.key}`);
              remove(logRef)
                .then(() => {
                  console.log('Log excluído com sucesso');
                  logItem.remove();
                })
                .catch((error) => {
                  console.error('Erro ao excluir log: ', error);
                });
            });
            logItem.appendChild(deleteIcon);
            userLogList.appendChild(logItem);
          });

          userItem.appendChild(userTitle);
          userItem.appendChild(userLogList);
          logList.appendChild(userItem);
        });

        console.log("onValue: Logs agrupados por usuário exibidos.");
      });

    } else {
      if (window.location.pathname.includes('log')) {
        document.body.innerHTML = '<h2>Acesso negado</h2>';
      }
    }
  });

  logoutButton.addEventListener('click', () => {
    window.location.href = 'app.html';
  });

});
