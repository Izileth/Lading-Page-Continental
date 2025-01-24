// Inicialize o EmailJS (substitua pela sua Public Key)
emailjs.init('H6uZqEWGG1n2GZeoz'); 

// Capturar o formulário e o botão de envio
const form = document.getElementById('form');
const statusMessage = document.getElementById('statusMessage');

// Adicione um evento de envio ao formulário
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Previne o reload da página

    // Coleta os valores dos campos
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const nickname = document.getElementById('nickname').value;

    // Configuração do template do EmailJS
    const templateParams = {
        nome: nome,
        email: email,
        nickname: nickname
    };

    try {
        // Envia o email usando EmailJS
        await emailjs.send('service_inlp3md', 'template_40h51jh', templateParams);

        // Exibe mensagem de sucesso
        statusMessage.textContent = 'Email enviado com sucesso!';
        statusMessage.className = 'success';

        // Limpa o formulário
        form.reset();
    } catch (error) {
        // Exibe mensagem de erro
        statusMessage.textContent = 'Erro ao enviar o email. Tente novamente.';
        statusMessage.className = 'error';
        console.error('Erro ao enviar email:', error);
    }
});
