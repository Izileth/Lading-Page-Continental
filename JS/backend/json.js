document.addEventListener("DOMContentLoaded", function () {
    const forms = document.querySelectorAll(".postForm");

    forms.forEach((form) => {
        const trendingContainer = form.closest(".trending");
        const lista = trendingContainer.querySelector(".trending-list");
        const listaId = trendingContainer.dataset.id || "defaultList";

        let postagens = JSON.parse(localStorage.getItem(listaId)) || [];

        function renderizarPostagens() {
            lista.innerHTML = "";
            postagens.forEach((post, index) => {
                let item = document.createElement("li");
                item.innerHTML = `
                    ${post.categoria}: ${post.titulo} 
                    <button class="delete-btn" data-index="${index}" data-lista="${listaId}">X</button>
                `;
                lista.appendChild(item);
            });

            localStorage.setItem(listaId, JSON.stringify(postagens));
        }

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const categoria = form.querySelector(".categoria").value.trim();
            const titulo = form.querySelector(".titulo").value.trim();

            if (categoria && titulo) {
                postagens.push({ categoria, titulo });
                renderizarPostagens();
                form.reset();
            }
        });

        // Delegação de eventos para os botões de deletar
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
