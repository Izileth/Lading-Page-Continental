const redirectBtn = document.getElementById('next-btn');
redirectBtn.addEventListener('click', () => {
    //Redireciona para uma seção do site
        // Seleciona o elemento pelo ID
        const destino = document.getElementById("racer");
    
        // Scroll suave até o elemento
        destino.scrollIntoView({ behavior: "smooth" });
    
        redirectBtn.disabled = true; // Disable the button while the new tab is loading.
    
        setTimeout(() => {
            redirectBtn.disabled = false; // Re-enable the button after 5 seconds.
        }, 2500); // 2.5 seconds delay before re-enabling the button.
});

const redirectRefBtns = document.querySelectorAll('.a'); // Seleciona todos os links com a classe "a"

redirectRefBtns.forEach(btn => {
    btn.addEventListener('click', (event) => {
        event.preventDefault(); // Evita o comportamento padrão do link

        // Seleciona o elemento pelo ID
        const destino = document.getElementById("mapa");

        // Scroll suave até o elemento
        if (destino) {
            destino.scrollIntoView({ behavior: "smooth" });

            // Desativa o botão temporariamente
            btn.disabled = true;

            setTimeout(() => {
                btn.disabled = false; // Reativa após 2.5s
            }, 2500);
        }
    });
});
