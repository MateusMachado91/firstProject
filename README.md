# firstProject

GoodDaughter 👧📊
Um aplicativo simples para registrar e acompanhar o comportamento diário da minha filha.
O projeto inclui autenticação, cadastro e sistema de pontuação para recompensar ou retirar pontos conforme as ações do dia.

Funcionalidades

  - Tela de Login: Acesso por e-mail e senha.

  - Tela de Cadastro:

  - Validação de CPF (verifica se é válido e se já está cadastrado).

Tela Principal:

  - Adição e remoção de pontos conforme o comportamento.

  - Exibição do saldo de pontos atual.

Tecnologias Utilizadas
  - HTML5, CSS3, JavaScript

  - Validação de CPF com lógica personalizada

Armazenamento de dados (ex.: LocalStorage / DataBase Google)

Como Usar

  - Faça login com seu e-mail e senha.

  - Caso não tenha conta, cadastre-se informando CPF válido.

  - Na tela principal, registre comportamentos positivos ou negativos.

  - Acompanhe a evolução no saldo de pontos.


--------------------------    RealTime DataBase Rules   -----------------------------------

{
  "rules": {
    "pontuacaoGlobal": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "logs": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "usuarios": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    // Permite leitura e escrita sem autenticação para testes
    ".read": "auth == null",  // Permite leitura se o usuário NÃO estiver autenticado
    
  }
}

Objetivo

  - Esse projeto foi criado como ferramenta pessoal para acompanhamento do comportamento da minha filha,
  -  mas também serve como exemplo de aplicação com autenticação, cadastro e manipulação de dados.


