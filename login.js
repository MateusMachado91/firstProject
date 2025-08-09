import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form-login');
  const result = document.getElementById('login-result');

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const senha = document.getElementById('login-senha').value;

    result.textContent = '';
    result.style.color = 'red';

    try {
      const credenciais = await signInWithEmailAndPassword(auth, email, senha);
      const uid = credenciais.user.uid;

      result.textContent = 'Login realizado com sucesso!';
      result.style.color = 'green';

      setTimeout(() => {
        window.location.href = 'app.html';
      }, 500);

    } catch (error) {
      console.error('Erro no login:', error);
      result.textContent = 'E-mail ou senha inválidos.';
      result.style.color = 'red';
    }
  });
});

