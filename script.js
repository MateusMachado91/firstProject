import { auth, db } from './firebase-config.js';
import { signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { ref, get, set, onValue, push, runTransaction } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

let usuario = null;
let uid = null;

const pontuacaoSpan = document.getElementById('pontuacao');
const ctx = document.getElementById('gaugeChart').getContext('2d');
let pontuacao = 5;
let gaugeChart = null;

const maxPontuacao = 40;
const faixaBaixa = Math.floor(maxPontuacao / 3);
const faixaMedia = Math.floor(maxPontuacao / 3);
const faixaAlta = maxPontuacao - faixaBaixa - faixaMedia;

function getGaugeData(p) {
  let restante = p;
  let preenchidoBaixo = Math.min(restante, faixaBaixa);
  restante -= preenchidoBaixo;
  let preenchidoMedio = Math.min(restante, faixaMedia);
  restante -= preenchidoMedio;
  let preenchidoAlto = Math.min(restante, faixaAlta);

  return [preenchidoBaixo, preenchidoMedio, preenchidoAlto, maxPontuacao - p];
}

function atualizarCorPontuacao(p) {
  if (p <= faixaBaixa) {
    pontuacaoSpan.style.color = '#e53935';
  } else if (p <= faixaBaixa + faixaMedia) {
    pontuacaoSpan.style.color = '#ffeb3b';
  } else {
    pontuacaoSpan.style.color = '#43a047';
  }
}

function registrarLog(acao, usuario) {
  
  const pontuacaoRef = ref(db, 'pontuacaoGlobal');
  get(pontuacaoRef).then((snapshot) => {
    const pontuacaoAtual = snapshot.val() ?? 0;

    const logsRef = ref(db, `logs/${usuario}`);
    const newLogRef = push(logsRef);
    const logData = {
      acao: acao,
      data: new Date().toLocaleString(),
      pontuacao: pontuacaoAtual
    };
    set(newLogRef, logData);
  }).catch((error) => {
    console.error("Erro ao obter pontuação para log:", error);
  });
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  uid = user.uid;

  const userRef = ref(db, 'usuarios/' + uid);
  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const dadosUsuario = snapshot.val();
      usuario = dadosUsuario.usuario || dadosUsuario.nome || user.email.split('@')[0];

      const nomeCompleto = (dadosUsuario.nome || '') + ' ' + (dadosUsuario.sobrenome || '');
      document.getElementById('nomeUsuario').innerText = nomeCompleto.trim() || usuario;
      registrarLog("Página carregada", usuario);  
    } else {
      usuario = user.email.split('@')[0];
      document.getElementById('nomeUsuario').innerText = usuario;
      registrarLog("Página carregada", usuario);
    }


    if (user.email === 'mateusmachado.s@hotmail.com') {
      const especialButton = document.getElementById('especialButton');
      especialButton.style.display = 'block';


      especialButton.addEventListener('click', function() {
        window.location.href = 'log.html';
      });
    }

  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
  }

  const pontuacaoRefGlobal = ref(db, 'pontuacaoGlobal');
  onValue(pontuacaoRefGlobal, (snapshot) => {
    pontuacao = snapshot.val() ?? 5;
    pontuacaoSpan.innerText = pontuacao;
    atualizarCorPontuacao(pontuacao);

    if (!gaugeChart) {
      gaugeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: getGaugeData(pontuacao),
            backgroundColor: ['#e53935', '#ffeb3b', '#43a047', '#e0e0e0'],
            borderWidth: 0
          }]
        },
        options: {
          circumference: 180,
          rotation: 270,
          cutout: '80%',
          plugins: { legend: { display: false } }
        }
      });
    } else {
      gaugeChart.data.datasets[0].data = getGaugeData(pontuacao);
      gaugeChart.update();
    }
  });

  window.alterarPontuacao = function (valor) {
    const pontuacaoRef = ref(db, 'pontuacaoGlobal');
    runTransaction(pontuacaoRef, (pontuacaoAtual) => {
      if (pontuacaoAtual === null) return Math.max(0, Math.min(maxPontuacao, 5 + valor));
      return Math.max(0, Math.min(maxPontuacao, pontuacaoAtual + valor));
    }).then(() => {
      registrarLog("Alteração de pontuação", usuario);
    }).catch((error) => {
      console.error("Erro ao alterar pontuação:", error);
    });
  };

  window.resetarPontuacao = function () {
    set(ref(db, 'pontuacaoGlobal'), 0).catch((error) => {
      console.error("Erro ao resetar pontuação:", error);
    });
  };

  window.logout = function () {
    registrarLog("Logout", usuario);
    signOut(auth).then(() => {
      window.location.href = "index.html";
    });
  };

  window.addEventListener('beforeunload', function (e) {
  });
});
