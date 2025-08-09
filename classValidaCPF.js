import { ref, get } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
export class ValidaCPF {
  constructor(cpfEnviado) {
    Object.defineProperty(this, 'cpfLimpo', {
      writable: false,
      enumerable: true,
      configurable: false,
      value: cpfEnviado.replace(/\D+/g, '')
    });
  }

  éSequência() {
    return this.cpfLimpo.charAt(0).repeat(11) === this.cpfLimpo;
  }

  geraNovoCpf() {
    const cpfSemDigitos = this.cpfLimpo.slice(0, -2);
    const digito1 = ValidaCPF.geraDigito(cpfSemDigitos);
    const digito2 = ValidaCPF.geraDigito(cpfSemDigitos + digito1);
    this.novoCPF = cpfSemDigitos + digito1 + digito2;
  }

  static geraDigito(cpfSemDigitos) {
    let total = 0;
    let reverso = cpfSemDigitos.length + 1;

    for (let stringNumerica of cpfSemDigitos) {
      total += reverso * Number(stringNumerica);
      reverso--;
    }

    const digito = 11 - (total % 11);
    return digito <= 9 ? String(digito) : '0';
  }

  valida() {
    if (!this.cpfLimpo) return false;
    if (typeof this.cpfLimpo !== 'string') return false;
    if (this.cpfLimpo.length !== 11) return false;
    if (this.éSequência()) return false;

    this.geraNovoCpf();
    return this.novoCPF === this.cpfLimpo;
  }
}

export async function cpfExisteNoFirebase(cpf, db) {
  const dbRef = ref(db, 'usuarios');
  const snapshot = await get(dbRef);

  let existe = false;
  snapshot.forEach(childSnapshot => {
    const cpfCadastrado = childSnapshot.val().cpf.replace(/\D/g, '');
    if (cpfCadastrado === cpf) {
      existe = true;
    }
  });
  return existe;
}

export async function mostrarStatusCPF(inputCPF, cpfStatus, db) {
  const raw = inputCPF.value.replace(/\D/g, '');
  let formatado = raw;

  if (raw.length > 9) {
    formatado = raw.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
  } else if (raw.length > 6) {
    formatado = raw.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
  } else if (raw.length > 3) {
    formatado = raw.replace(/(\d{3})(\d{1,3})/, "$1.$2");
  }

  inputCPF.value = formatado;

  const cpf = raw;
  const cpfValido = new ValidaCPF(cpf).valida();
  const existe = await cpfExisteNoFirebase(cpf, db);

  if (existe) {
    cpfStatus.textContent = '⚠️ CPF já cadastrado!';
    cpfStatus.className = 'alerta';
  } else {
    if (cpfValido) {
      cpfStatus.textContent = '✔️ CPF disponível!';
      cpfStatus.className = 'certo';
    } else {
      cpfStatus.textContent = '❌ CPF inválido!';
      cpfStatus.className = 'errado';
    }
  }
}
