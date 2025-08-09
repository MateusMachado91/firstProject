import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { auth, db } from './firebase-config.js';
import { cpfExisteNoFirebase, ValidaCPF, mostrarStatusCPF } from './classValidaCPF.js';

document.addEventListener('DOMContentLoaded', function () {
  const inputCPF = document.getElementById('cpfInput');
  const cpfStatus = document.getElementById('cpfStatus');

  inputCPF.addEventListener('input', async function () {
    await mostrarStatusCPF(inputCPF, cpfStatus, db);
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-cadastro');
  const result = document.getElementById('result');

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const sobrenome = document.getElementById('sobrenome').value.trim();
    const cpf = document.getElementById('cpfInput').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const repetirSenha = document.getElementById('repsenha').value;

    result.textContent = '';
    result.style.color = '#f33';

    if (!nome || !sobrenome || !cpf || !email || !senha || !repetirSenha) {
      result.textContent = 'Preencha todos os campos!';
      return;
    }

    if (senha !== repetirSenha) {
      result.textContent = 'As senhas não coincidem!';
      return;
    }

    const validaCPF = new ValidaCPF(cpf);
    if (!validaCPF.valida()) {
      result.textContent = 'CPF inválido!';
      return;
    }

    const existeCpf = await cpfExisteNoFirebase(cpf);
    if (existeCpf) {
      result.textContent = '⚠️ CPF já cadastrado!';
      result.style.color = '#f33';
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, senha);
      const uid = cred.user.uid;

      await set(ref(db, 'usuarios/' + uid), { nome, sobrenome, cpf, email });

      result.style.color = '#4a4';
      result.textContent = 'Cadastro realizado com sucesso!';
      form.reset();

      setTimeout(() => window.location.href = 'index.html', 2000);
    } catch (e) {
      console.error('Erro ao cadastrar:', e);
      result.textContent = 'Erro ao cadastrar, verifique seus dados novamente.';
    }
  });
  document.getElementById('btn-voltar')?.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
});
