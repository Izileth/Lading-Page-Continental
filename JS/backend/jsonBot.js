document.addEventListener("DOMContentLoaded", function () {
    const forms = document.querySelectorAll(".postForm");
    const botToken = "7858099082:AAE9gQvpaUmw2UqfjE3a-UqPK3a2aCnCDOE";
    const chatId = "-1002398023615";

    forms.forEach((form) => {
        const lista = form.closest(".trending").querySelector(".trending-list");
        const listaId = lista.dataset.id || "trending_posts";
        let postagens = JSON.parse(localStorage.getItem(listaId)) || [];

        function renderizarPostagens() {
            lista.innerHTML = "";
            postagens.forEach((post, index) => {
                let item = document.createElement("li");
                item.innerHTML = `
                    ${post.categoria}: ${post.titulo}
                    <button class="delete-btn" data-index="${index}">X</button>
                `;
                lista.appendChild(item);
            });

            localStorage.setItem(listaId, JSON.stringify(postagens));
        }

        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            const categoria = form.querySelector(".categoria").value.trim();
            const titulo = form.querySelector(".titulo").value.trim();

            if (categoria && titulo) {
                const novaPostagem = { categoria, titulo };
                postagens.push(novaPostagem);
                renderizarPostagens();
                form.reset();

                const mensagem = `📢 *Nova Tendência Adicionada!*\n\n📌 *Categoria:* ${categoria}\n📝 *Título:* ${titulo}`;
                const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
                const params = { chat_id: chatId, text: mensagem, parse_mode: "Markdown" };

                try {
                    await fetch(url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(params),
                    });
                    console.log("Mensagem enviada para o Telegram com sucesso!");
                } catch (error) {
                    console.error("Erro ao enviar mensagem para o Telegram:", error);
                }
            }
        });

        lista.addEventListener("click", function (e) {
            if (e.target.classList.contains("delete-btn")) {
                const index = e.target.dataset.index;
                postagens.splice(index, 1);
                renderizarPostagens();
            }
        });

        renderizarPostagens();
    });
});
