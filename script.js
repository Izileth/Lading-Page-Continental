const openSidebar = document.getElementById("openSidebar");
const closeSidebar = document.getElementById("closeSidebar");
const mobileSidebar = document.getElementById("mobileSidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

openSidebar.addEventListener("click", () => {
  mobileSidebar.classList.add("open");
  sidebarOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
});

closeSidebar.addEventListener("click", () => {
  mobileSidebar.classList.remove("open");
  sidebarOverlay.classList.remove("open");
  document.body.style.overflow = "auto";
});

sidebarOverlay.addEventListener("click", () => {
  mobileSidebar.classList.remove("open");
  sidebarOverlay.classList.remove("open");
  document.body.style.overflow = "auto";
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // Close mobile sidebar if open
      mobileSidebar.classList.remove("open");
      sidebarOverlay.classList.remove("open");
      document.body.style.overflow = "auto";
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
    }
  });
}, observerOptions);

document.querySelectorAll(".fade-in-section").forEach((section) => {
  observer.observe(section);
});

// Carousel functionality
class Carousel {
  constructor({
    wrapperId,
    trackId,
    prevId,
    nextId,
    indicatorsId,
    autoplay = true,
    interval = 5000,
  }) {
    // DOM refs
    this.wrapper = document.getElementById(wrapperId);
    this.track = document.getElementById(trackId);
    this.prevBtn = document.getElementById(prevId);
    this.nextBtn = document.getElementById(nextId);
    this.indicatorsEl = document.getElementById(indicatorsId);

    // estado
    this.autoplay = autoplay;
    this.interval = interval;
    this.index = 1; // começa em 1 por causa dos clones
    this.isAnimating = false;

    // prepara slides + clones
    this.setupSlides();
    this.createIndicators();
    this.updateIndicators();

    // listeners
    this.prevBtn?.addEventListener("click", () => this.prev());
    this.nextBtn?.addEventListener("click", () => this.next());
    this.addTouchSupport();
    this.addHoverPause();

    // inicia auto-play
    if (this.autoplay) this.start();
  }

  setupSlides() {
    this.slides = Array.from(this.track.children);
    this.total = this.slides.length;

    // Clona primeiro e último → loop suave
    const firstClone = this.slides[0].cloneNode(true);
    const lastClone = this.slides[this.total - 1].cloneNode(true);
    firstClone.setAttribute("data-clone", "true");
    lastClone.setAttribute("data-clone", "true");
    this.track.appendChild(firstClone);
    this.track.prepend(lastClone);

    // Atualiza lista de slides (incluindo clones)
    this.slides = Array.from(this.track.children);

    // Garante largura e shrink corretos
    this.slides.forEach((slide) => {
      slide.style.minWidth = "100%";
      slide.style.flexShrink = "0";
    });

    // Posiciona no primeiro slide "real"
    this.moveTo(this.index, false);
  }

  createIndicators() {
    if (!this.indicatorsEl) return;
    this.indicatorsEl.innerHTML = "";
    for (let i = 0; i < this.total; i++) {
      const dot = document.createElement("div");
      dot.className = "carousel-indicator";
      dot.addEventListener("click", () => this.goTo(i));
      this.indicatorsEl.appendChild(dot);
    }
    this.dots = Array.from(this.indicatorsEl.children);
  }

  updateIndicators() {
    if (!this.dots) return;
    const realIndex = (this.index - 1 + this.total) % this.total;
    this.dots.forEach((d, i) => d.classList.toggle("active", i === realIndex));
  }

  moveTo(i, animate = true) {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.track.style.transition = animate
      ? "transform .5s ease-in-out"
      : "none";
    this.track.style.transform = `translateX(-${i * 100}%)`;

    // Depois da transição, corrige se estivermos num clone
    const handleTransitionEnd = () => {
      this.isAnimating = false;
      if (this.slides[i] && this.slides[i].dataset.clone) {
        // se foi para clone, pula (sem animação) para o slide real correspondente
        this.track.style.transition = "none";
        this.index = i === 0 ? this.total : 1;
        this.track.style.transform = `translateX(-${this.index * 100}%)`;
      } else {
        this.index = i;
      }
      this.updateIndicators();
      this.track.removeEventListener("transitionend", handleTransitionEnd);
    };

    if (animate) {
      this.track.addEventListener("transitionend", handleTransitionEnd);
    } else {
      setTimeout(handleTransitionEnd, 0);
    }
  }

  next() {
    this.moveTo(this.index + 1);
  }
  prev() {
    this.moveTo(this.index - 1);
  }
  goTo(i) {
    this.moveTo(i + 1);
  } // +1 por causa do clone no início

  start() {
    this.stop(); // evita duplicar intervalos
    this.timer = setInterval(() => this.next(), this.interval);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
  }

  addHoverPause() {
    this.wrapper.addEventListener("mouseenter", () => this.stop());
    this.wrapper.addEventListener(
      "mouseleave",
      () => this.autoplay && this.start()
    );
  }

  addTouchSupport() {
    let startX = 0,
      dist = 0;
    const threshold = 50; // px para considerar swipe

    const onStart = (e) => {
      startX = e.touches[0].clientX;
    };
    const onMove = (e) => {
      dist = e.touches[0].clientX - startX;
    };
    const onEnd = () => {
      if (Math.abs(dist) > threshold) dist < 0 ? this.next() : this.prev();
      dist = 0;
    };

    this.wrapper.addEventListener("touchstart", onStart, { passive: true });
    this.wrapper.addEventListener("touchmove", onMove, { passive: true });
    this.wrapper.addEventListener("touchend", onEnd);
  }
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  new Carousel({
    wrapperId: "jdmWrapper",
    trackId: "jdmTrack",
    prevId: "jdmPrev",
    nextId: "jdmNext",
    indicatorsId: "jdmIndicators",
    autoplay: true,
    interval: 4000,
  });
});

const reviewsCarousel = new Carousel(
  "reviewsCarousel",
  "reviewsCarousel",
  "reviewsPrev",
  "reviewsNext",
  "reviewsIndicators"
);
reviewsCarousel.init();

// Category filtering

const categoryBtns = document.querySelectorAll(".category-btn");
const categoryItems = document.querySelectorAll(".category-item");

categoryBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.category;

    // Update active button
    categoryBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // Filter items
    categoryItems.forEach((item) => {
      if (category === "all" || item.dataset.category === category) {
        item.style.display = "block";
        item.style.opacity = "0";
        setTimeout(() => {
          item.style.opacity = "1";
        }, 100);
      } else {
        item.style.opacity = "0";
        setTimeout(() => {
          item.style.display = "none";
        }, 300);
      }
    });
  });
});

// Newsletter subscription
const newsletterBtn =
  document.querySelector('button[type="submit"]') ||
  document.querySelector("button:has(.loading-spinner)");
const newsletterInput = document.querySelector('input[type="email"]');
const loadingSpinner = document.querySelector(".loading-spinner");

if (newsletterBtn && newsletterInput) {
  newsletterBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = newsletterInput.value.trim();

    if (!email) {
      alert("Por favor, insira seu email.");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Por favor, insira um email válido.");
      return;
    }

    // Show loading
    loadingSpinner.classList.remove("hidden");
    newsletterBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      loadingSpinner.classList.add("hidden");
      newsletterBtn.disabled = false;
      newsletterInput.value = "";
      alert("Obrigado! Você foi inscrito com sucesso.");
    }, 2000);
  });
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Header background on scroll
const header = document.querySelector("header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.style.background = "rgba(0, 0, 0, 0.95)";
  } else {
    header.style.background = "rgba(0, 0, 0, 0.9)";
  }
});

// Parallax effect for hero section
const heroSection = document.getElementById("home");
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const rate = scrolled * -0.5;

  if (heroSection) {
    heroSection.style.transform = `translateY(${rate}px)`;
  }
});

// Card hover effects enhancement
document.querySelectorAll(".card-hover").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-8px) scale(1.02)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});

// Typing effect for hero text
const heroTitle = document.querySelector("#home h1");
if (heroTitle) {
  const text = heroTitle.textContent;
  heroTitle.textContent = "";
  let i = 0;

  function typeWriter() {
    if (i < text.length) {
      heroTitle.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 200);
    }
  }

  // Start typing effect after page load
  setTimeout(typeWriter, 1000);
}

// Add loading state for page transitions
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

document.addEventListener("keydown", (e) => {
  konamiCode.push(e.code);
  if (konamiCode.length > konamiSequence.length) {
    konamiCode.shift();
  }

  if (konamiCode.join("") === konamiSequence.join("")) {
    // Easter egg activated
    document.body.style.filter = "hue-rotate(180deg)";
    setTimeout(() => {
      document.body.style.filter = "none";
    }, 3000);
    konamiCode = [];
  }
});

// Performance optimization: Lazy loading for images
const lazyImages = document.querySelectorAll("img[data-src]");
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove("lazy");
      imageObserver.unobserve(img);
    }
  });
});

lazyImages.forEach((img) => imageObserver.observe(img));

// Timeline Navigation
class Timeline {
  constructor(containerId, prevId, nextId) {
    this.container = document.getElementById(containerId);
    this.prevBtn = document.getElementById(prevId);
    this.nextBtn = document.getElementById(nextId);
    this.scrollPosition = 0;
    this.itemWidth = 320; // Largura aproximada de cada item + margin

    this.init();
  }

  init() {
    this.prevBtn.addEventListener("click", () => this.scroll("left"));
    this.nextBtn.addEventListener("click", () => this.scroll("right"));

    // Hide prev button initially
    this.toggleButtons();

    // Update button visibility on scroll
    this.container.addEventListener("scroll", () => {
      this.toggleButtons();
    });
  }

  scroll(direction) {
    const containerWidth = this.container.clientWidth;
    const scrollWidth = this.container.scrollWidth;

    if (direction === "left") {
      this.scrollPosition = Math.max(0, this.scrollPosition - this.itemWidth);
    } else {
      this.scrollPosition = Math.min(
        scrollWidth - containerWidth,
        this.scrollPosition + this.itemWidth
      );
    }

    this.container.scrollTo({
      left: this.scrollPosition,
      behavior: "smooth",
    });
  }

  toggleButtons() {
    const containerWidth = this.container.clientWidth;
    const scrollWidth = this.container.scrollWidth;
    const scrollLeft = this.container.scrollLeft;

    this.prevBtn.style.display = scrollLeft > 0 ? "flex" : "none";
    this.nextBtn.style.display =
      scrollLeft < scrollWidth - containerWidth - 1 ? "flex" : "none";
  }
}

// Initialize timeline
const timeline = new Timeline("timeline", "timelinePrev", "timelineNext");

// Tooltips for map
const mapPoints = document.querySelectorAll("[data-tooltip]");
mapPoints.forEach((point) => {
  const tooltip = document.createElement("div");
  tooltip.textContent = point.dataset.tooltip;
  tooltip.className =
    "absolute bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity -translate-y-8";

  point.appendChild(tooltip);
  point.classList.add("group", "cursor-pointer");

  // Position tooltip
  point.addEventListener("mouseenter", () => {
    const rect = point.getBoundingClientRect();
    tooltip.style.left = `${rect.width / 2 - tooltip.offsetWidth / 2}px`;
  });
});

// Audio player functionality
const audioPlayers = document.querySelectorAll(".audio-player");
audioPlayers.forEach((player) => {
  const playBtn = player.querySelector(".play-btn");
  const progress = player.querySelector(".progress");
  const currentTime = player.querySelector(".current-time");
  const duration = player.querySelector(".duration");

  // Mock functionality
  playBtn.addEventListener("click", () => {
    player.classList.toggle("playing");

    if (player.classList.contains("playing")) {
      playBtn.innerHTML = "❚❚";
      // Simulate progress
      let time = 0;
      const interval = setInterval(() => {
        if (time >= 100) {
          clearInterval(interval);
          player.classList.remove("playing");
          playBtn.innerHTML = "▶";
          progress.style.width = "0%";
        } else {
          time += 1;
          progress.style.width = `${time}%`;
          currentTime.textContent = formatTime(time * 0.42); // 42s total
        }
      }, 420); // 420ms for 100 steps = 42s total
    } else {
      playBtn.innerHTML = "▶";
    }
  });
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// Rotating wheel animation
const wheelItems = document.querySelectorAll(".wheel-item");
wheelItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    const wheel = item.querySelector(".wheel-visual");
    if (wheel) {
      wheel.style.transform = "rotate(180deg)";
    }
  });

  item.addEventListener("mouseleave", () => {
    const wheel = item.querySelector(".wheel-visual");
    if (wheel) {
      wheel.style.transform = "rotate(0)";
    }
  });
});

const decadeFilters = document.querySelectorAll(".decade-filter");
const carCards = document.querySelectorAll(".car-card");

decadeFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const decade = filter.dataset.decade;

    // Atualizar filtro ativo
    decadeFilters.forEach((f) => f.classList.remove("active"));
    filter.classList.add("active");

    // Filtrar carros
    carCards.forEach((card) => {
      if (decade === "all" || card.dataset.decade === decade) {
        card.style.display = "block";
        setTimeout(() => {
          card.style.opacity = "1";
        }, 50);
      } else {
        card.style.opacity = "0";
        setTimeout(() => {
          card.style.display = "none";
        }, 300);
      }
    });
  });
});

// Mapa Interativo - Rotas
const routePoints = document.querySelectorAll("[data-route]");
routePoints.forEach((point) => {
  point.addEventListener("mouseenter", () => {
    const route = point.dataset.route;
    // Aqui você pode adicionar lógica para destacar a rota
    console.log(`Rota selecionada: ${route}`);
  });
});

// Mapa Interativo - Locais de Encontro
const locationPoints = document.querySelectorAll("[data-location]");
locationPoints.forEach((point) => {
  point.addEventListener("click", () => {
    const location = point.dataset.location;
    // Aqui você pode adicionar lógica para mostrar detalhes do local
    console.log(`Local selecionado: ${location}`);
  });
});

// Tooltips para os Mapas
function initMapTooltips() {
  const tooltip = document.createElement("div");
  tooltip.className =
    "absolute bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none opacity-0 transition-opacity z-10";
  document.body.appendChild(tooltip);

  document.querySelectorAll("[data-tooltip]").forEach((el) => {
    el.addEventListener("mouseenter", (e) => {
      tooltip.textContent = el.dataset.tooltip;
      tooltip.style.opacity = "1";

      const rect = el.getBoundingClientRect();
      tooltip.style.left = `${rect.left + window.scrollX}px`;
      tooltip.style.top = `${rect.top + window.scrollY - 30}px`;
    });

    el.addEventListener("mouseleave", () => {
      tooltip.style.opacity = "0";
    });
  });
}

initMapTooltips();

// Filtro por Década - Complemento
decadeFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    // Adiciona efeito visual de clique
    filter.style.transform = "scale(0.95)";
    setTimeout(() => {
      filter.style.transform = "scale(1)";
    }, 150);
  });
});

// Mapa Interativo - Rotas (Aprimorado)
routePoints.forEach((point) => {
  const route = point.dataset.route;

  point.addEventListener("mouseenter", () => {
    // Destacar todas as informações relacionadas à rota
    document
      .querySelectorAll(`[data-route-section="${route}"]`)
      .forEach((el) => {
        el.classList.add("route-highlight");
      });

    // Aumentar ponto no mapa
    point.style.transform = "scale(1.5)";
    point.style.zIndex = "10";
  });

  point.addEventListener("mouseleave", () => {
    // Remover destaque
    document
      .querySelectorAll(`[data-route-section="${route}"]`)
      .forEach((el) => {
        el.classList.remove("route-highlight");
      });

    // Voltar ao tamanho normal
    point.style.transform = "scale(1)";
    point.style.zIndex = "1";
  });
});

// Mapa Interativo - Locais de Encontro (Aprimorado)
locationPoints.forEach((point) => {
  const location = point.dataset.location;

  point.addEventListener("mouseenter", () => {
    // Destacar card correspondente
    document
      .querySelector(`[data-location-card="${location}"]`)
      .classList.add("location-highlight");

    // Adicionar linha de conexão animada
    point.insertAdjacentHTML(
      "afterend",
      `<div class="location-connection" data-location="${location}"></div>`
    );
  });

  point.addEventListener("mouseleave", () => {
    // Remover destaque
    document
      .querySelector(`[data-location-card="${location}"]`)
      .classList.remove("location-highlight");

    // Remover linha de conexão
    document
      .querySelector(`.location-connection[data-location="${location}"]`)
      .remove();
  });
});

// Tooltips para os Mapas (Aprimorado)
function initMapTooltips() {
  const tooltip = document.createElement("div");
  tooltip.className = "map-tooltip";
  document.body.appendChild(tooltip);

  document.querySelectorAll("[data-tooltip]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      tooltip.textContent = el.dataset.tooltip;
      tooltip.style.opacity = "1";

      // Posicionar tooltip seguindo o mouse
      tooltip.style.left = `${e.clientX + 15}px`;
      tooltip.style.top = `${e.clientY + 15}px`;
    });

    el.addEventListener("mouseleave", () => {
      tooltip.style.opacity = "0";
    });
  });
}

// Animação de Destaque para Cards (Completa)
function setupCardHighlights() {
  const cards = document.querySelectorAll(
    ".car-card, .location-card, .route-card"
  );

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.boxShadow = "0 10px 30px rgba(255, 255, 255, 0.1)";
      card.style.transform = "translateY(-5px)";

      // Efeito de brilho
      const glow = document.createElement("div");
      glow.className = "card-glow";
      card.appendChild(glow);

      // Animação de info (se existir)
      const info = card.querySelector(".card-info");
      if (info) {
        info.style.opacity = "1";
        info.style.transform = "translateY(0)";
      }
    });

    card.addEventListener("mouseleave", () => {
      card.style.boxShadow = "";
      card.style.transform = "";

      // Remover brilho
      const glow = card.querySelector(".card-glow");
      if (glow) glow.remove();

      // Resetar info
      const info = card.querySelector(".card-info");
      if (info) {
        info.style.opacity = "0";
        info.style.transform = "translateY(10px)";
      }
    });
  });
}

// Modal para Detalhes dos Carros
function setupCarModals() {
  const modal = document.createElement("div");
  modal.className = "car-modal hidden";
  modal.innerHTML = `
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <div class="modal-body"></div>
                </div>
            `;
  document.body.appendChild(modal);

  document.querySelectorAll(".car-card button").forEach((btn) => {
    btn.addEventListener("click", function () {
      const card = this.closest(".car-card");
      const title = card.querySelector("h3").textContent;
      const specs = card.querySelectorAll(".bg-gray-700");

      let specsHtml = "";
      specs.forEach((spec) => {
        specsHtml += `
                            <div class="spec-item">
                                <div>${
                                  spec.querySelector(".font-semibold")
                                    .textContent
                                }</div>
                                <div>${
                                  spec.querySelector(".text-gray-400")
                                    .textContent
                                }</div>
                            </div>
                        `;
      });

      modal.querySelector(".modal-body").innerHTML = `
                        <h2>${title}</h2>
                        <div class="specs-grid">${specsHtml}</div>
                        <p class="modal-description">${
                          card.querySelector("p").textContent
                        }</p>
                    `;

      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    });
  });

  modal.querySelector(".modal-close").addEventListener("click", () => {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  });
}

// Inicializar todos os componentes
document.addEventListener("DOMContentLoaded", () => {
  initMapTooltips();
  setupCardHighlights();
  setupCarModals();
  new RouteTimeline();

  // Intersection Observer para animações
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".fade-in-section").forEach((section) => {
    observer.observe(section);
  });
});

lazyImages.forEach((img) => imageObserver.observe(img));

// Anime Video Buttons
document.querySelectorAll(".anime-card button").forEach((button) => {
  button.addEventListener("click", function (e) {
    e.preventDefault();
    const animeTitle =
      this.closest(".anime-card").querySelector("h3").textContent;

    // Criar modal de vídeo
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4";
    modal.innerHTML = `
                    <div class="relative w-full max-w-4xl">
                        <button class="absolute -top-10 right-0 text-white text-2xl">&times;</button>
                        <div class="aspect-w-16 aspect-h-9 bg-gray-800 rounded-lg overflow-hidden">
                            <div class="w-full h-full flex items-center justify-center">
                                <p class="text-gray-400">Opening de ${animeTitle}</p>
                            </div>
                        </div>
                    </div>
                `;

    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";

    // Fechar modal
    modal.querySelector("button").addEventListener("click", () => {
      modal.remove();
      document.body.style.overflow = "";
    });
  });
});

// Timeline Animation
const timelineStories = document.querySelectorAll(".timeline-story");
timelineStories.forEach((story, index) => {
  // Adicionar atraso para animação sequencial
  story.style.animationDelay = `${index * 0.15}s`;

  // Linha da timeline
  if (index < timelineStories.length - 1) {
    const line = document.createElement("div");
    line.className = "timeline-line";
    story.appendChild(line);
  }
});

// Hover Effects for Info Cards
document.querySelectorAll("#extras .bg-gray-800").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.querySelector("svg").classList.add("text-white");
    this.querySelector("h3").classList.add("text-white");
  });

  card.addEventListener("mouseleave", function () {
    this.querySelector("svg").classList.remove("text-white");
    this.querySelector("h3").classList.remove("text-white");
  });
});

//Animação do Mapa de Rotas

// Informações das rotas
const routeData = {
  wangan: {
    name: "Wangan",
    description: "Rodovia Bayshore - Corridas de alta velocidade",
    features: ["300+ km/h", "Túneis neon", "GT-Rs"],
  },
  touge: {
    name: "Touge (峠)",
    description: "Montanhas sinuosas - Técnica e drift",
    features: ["Curvas fechadas", "AE86 & RX-7", "Attack/Defense"],
  },
  c1: {
    name: "C1 Loop",
    description: "Circuito interno de Tóquio - 22km",
    features: ["Túneis", "Memorização", "Variedade"],
  },
};

function showRouteInfo(routeKey) {
  const info = routeData[routeKey];
  const infoPanel = document.getElementById("routeInfo");
  const content = document.getElementById("routeInfoContent");

  content.innerHTML = `
                <h4 class="text-lg font-bold mb-2">${info.name}</h4>
                <p class="text-gray-300 text-sm mb-3">${info.description}</p>
                <ul class="space-y-1">
                    ${info.features
                      .map(
                        (feature) => `
                        <li class="text-xs text-gray-400 flex items-center gap-2">
                            <div class="w-1 h-1 bg-white rounded-full"></div>
                            ${feature}
                        </li>
                    `
                      )
                      .join("")}
                </ul>
            `;

  infoPanel.classList.remove("hidden");

  // Hide after 3 seconds
  setTimeout(() => {
    infoPanel.classList.add("hidden");
  }, 3000);
}

// Seção de Timeline

// Timeline stories observer
const timelineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  {
    threshold: 0.3,
  }
);

// Observar stories da timeline
document.querySelectorAll(".timeline-story").forEach((el) => {
  timelineObserver.observe(el);
});

// Hover effects para as tags
document.querySelectorAll(".tag").forEach((tag) => {
  tag.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-2px) scale(1.05)";
  });

  tag.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});

// Parallax effect para os indicadores de década
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const indicators = document.querySelectorAll(".decade-indicator");

  indicators.forEach((indicator) => {
    const speed = 0.3;
    const yPos = -(scrolled * speed);
    indicator.style.transform = `translateY(${yPos}px)`;
  });
});
