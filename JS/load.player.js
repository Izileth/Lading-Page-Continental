document.addEventListener("DOMContentLoaded", function () {
  const loadingScreen = document.getElementById("loadingScreen");
  const countdownElement = document.getElementById("countdown");
  const progressBar = document.getElementById("progressBar");
  const loadingMessage = document.getElementById("loadingMessage");
  const mainContent = document.getElementById("mainContent");
  const jdmText = document.getElementById("jdmText");
  const jdmLetters = document.querySelectorAll(".jdm-letter");

  // Caracteres para o efeito de scramble
  const scrambleChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  const originalText = ["J", "D", "M"];

  // Mensagens do sistema
  const messages = [
    "INICIALIZANDO SISTEMA",
    "CARREGANDO MÓDULOS",
    "VERIFICANDO INTEGRIDADE",
    "ESTABELECENDO CONEXÃO",
    "SINCRONIZANDO DADOS",
    "OTIMIZANDO PERFORMANCE",
    "CONFIGURANDO INTERFACE",
    "FINALIZANDO PROCESSO",
  ];

  // Intervalos específicos para o countdown
  const countdownValues = [60, 30, 20, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
  let currentCountdownIndex = 0;

  // Tempo total da animação
  const totalTime = 8000; // 8 segundos
  const startTime = Date.now();

  // Função para scramble das letras
  function scrambleLetters() {
    jdmLetters.forEach((letter, index) => {
      const progress = (Date.now() - startTime) / totalTime;
      const letterProgress = Math.max(0, (progress - index * 0.1) * 3);

      if (letterProgress < 1) {
        letter.classList.add("scramble");
        if (Math.random() < 0.3) {
          letter.textContent =
            scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }
      } else {
        letter.classList.remove("scramble");
        letter.textContent = originalText[index];
      }
    });
  }

  // Função principal de atualização
  function updateLoadingScreen() {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / totalTime, 1);

    // Atualiza o countdown baseado no progresso
    const countdownProgress = progress * (countdownValues.length - 1);
    const currentIndex = Math.floor(countdownProgress);

    if (currentIndex < countdownValues.length) {
      const currentValue = countdownValues[currentIndex];
      countdownElement.textContent = currentValue;

      // Adiciona efeito de warning quando menor que 10
      if (currentValue <= 10 && currentValue > 0) {
        countdownElement.classList.add("warning");
      }
    }

    // Atualiza a barra de progresso
    progressBar.style.width = `${progress * 100}%`;

    // Atualiza a mensagem
    const messageIndex = Math.floor(progress * messages.length);
    if (messageIndex < messages.length) {
      loadingMessage.textContent = messages[messageIndex];
    }

    // Efeito de scramble nas letras
    scrambleLetters();

    // Verifica se terminou
    if (progress >= 1) {
      setTimeout(() => {
        loadingScreen.classList.add("fade-out");
        setTimeout(() => {
          loadingScreen.style.display = "none";
          mainContent.classList.add("show");
        }, 500);
      }, 500);
      return;
    }

    // Continua a animação
    requestAnimationFrame(updateLoadingScreen);
  }

  // Inicia a animação
  updateLoadingScreen();

  // Força a exibição da tela de carregamento ao recarregar
  window.addEventListener("beforeunload", function () {
    window.scrollTo(0, 0);
  });

  // Sistema de redirecionamento
  initRedirectSystem();
});

// Sistema de redirecionamento
function initRedirectSystem() {
  const loadingRedirectScreen = document.getElementById(
    "loadingRedirectScreen"
  );
  const buttons = document.querySelectorAll(".btn-loading, a.btn-loading");

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const url = this.getAttribute("href") || this.getAttribute("data-href");
      if (!url) return;

      e.preventDefault();

      // Adiciona estado de loading ao botão
      this.classList.add("loading");
      const originalContent = this.innerHTML;
      this.innerHTML = `
                        <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                            <div class="btn-spinner"></div>
                            <span>CARREGANDO...</span>
                        </div>
                    `;

      // Mostra tela de carregamento
      loadingRedirectScreen.classList.add("show");

      // Redireciona após um breve delay
      setTimeout(() => {
        window.location.href = url;
      }, 1200);
    });
  });

  // Se o usuário voltar, esconde a tela de loading
  window.addEventListener("pageshow", function () {
    buttons.forEach((button) => {
      button.classList.remove("loading");
      const originalText =
        button.getAttribute("data-original-text") || button.textContent;
      button.innerHTML = originalText;
    });

    loadingRedirectScreen.classList.remove("show");
  });

  // Armazena textos originais dos botões
  buttons.forEach((button) => {
    button.setAttribute("data-original-text", button.innerHTML);
  });
}
