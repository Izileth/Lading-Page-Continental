const redirectBtn = document.getElementById('next-btn');
redirectBtn.addEventListener('click', () => {
    //Redireciona para uma seção do site
    window.location.href = '#racer';
    // O setTimeout é usado para garantir que o redirecionamento seja feito depois de 2 segundos
    setTimeout(() => {
        // Ao redirecionar, mostra um alerta com uma mensagem
        alert('Redirecionado para a próxima seção do site');
    }, 2000);
    // Para evitar que o botão seja clicado novamente enquanto o redirecionamento está acontecendo
    redirectBtn.disabled = true;
    // Ao redirecionar, desabilita o botão por 5 segundos
    setTimeout(() => {
        redirectBtn.disabled = false;
    }, 5000);
    // Ao redirecionar, muda o texto do botão para "Redirecionando..."
    redirectBtn.textContent = 'Redirecionando...';
});