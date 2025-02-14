document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('form');
    const statusMessage = document.getElementById('statusMessage');
    const whatsappNumber = '+5591993961874'; // Substitua pelo número do WhatsApp desejado (inclusivo com código do país)

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Previne o reload da página

        // Coleta os valores dos campos do formulário
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const nickname = document.getElementById('nickname').value;

        // Formata a mensagem para enviar ao WhatsApp
        const mensagem = encodeURIComponent(`*Novo Formulário Recebido!*\n\n📋 *Nome:* ${nome}\n📧 *Email:* ${email}\n👤 *Nickname:* ${nickname}`);

        // Cria o link para o WhatsApp
        const url = `https://wa.me/${whatsappNumber}?text=${mensagem}`;

        try {
            // Redireciona para o WhatsApp com a mensagem formatada
            window.open(url, '_blank');
            statusMessage.textContent = 'Formulário enviado com sucesso para o WhatsApp!';
            statusMessage.className = 'success';

            // Limpa o formulário
            form.reset();
        } catch (error) {
            // Exibe mensagem de erro
            statusMessage.textContent = 'Erro ao enviar o formulário. Tente novamente.';
            statusMessage.className = 'error';
            console.error('Erro ao enviar formulário para o WhatsApp:', error);
        }
    });
});
