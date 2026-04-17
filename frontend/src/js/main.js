import { API_URL } from "./env.js";

// todo o teu código existente aqui 👇
document.addEventListener("DOMContentLoaded", () => {
  fetch(`${API_URL}/content/hero`)
    .then((res) => res.json())
    .then((data) => {
      console.log("Hero data:", data);
      const heroTitle = document.getElementById("hero-title");
      const heroSpan = document.getElementById("hero-span");
      const heroSubtitle = document.getElementById("hero-subtitle");
      const heroDesc = document.getElementById("hero-description");
      const heroBtn = document.getElementById("hero-btn");
      const heroPhoto = document.getElementById("hero-photo");

      if (heroTitle) heroTitle.innerText = data.title || "";
      if (heroSpan) heroSpan.innerText = data.highlight || "";
      if (heroSubtitle) heroSubtitle.innerText = data.subtitle || "";
      if (heroDesc) heroDesc.innerText = data.description || "";
      if (heroBtn) heroBtn.innerText = data.buttonText || "Saiba mais";
      if (heroPhoto && data.images?.[0]) heroPhoto.src = data.images[0];
    })
    .catch((err) => console.error("Erro ao buscar Hero:", err));
});

// Carregar nome do site
fetch(`${API_URL}/content/site-config`)
  .then((res) => res.json())
  .then((data) => {
    if (data.pageTitle) {
      document.title = data.pageTitle;
    }

    document.querySelectorAll("#page-title").forEach((el) => {
      if (data.siteName) el.innerText = data.siteName;
    });

    // 🔥 Atualizar favicon
    if (data.favicon) {
      let favicon = document.getElementById("site-favicon");

      if (!favicon) {
        favicon = document.createElement("link");
        favicon.id = "site-favicon";
        favicon.rel = "icon";
        document.head.appendChild(favicon);
      }

      favicon.href = data.favicon + "?v=" + new Date().getTime();
    }
  });

// Título da seção Serviços
fetch(`${API_URL}/content/services-section`)
  .then((res) => res.json())
  .then((data) => {
    const headerEl = document.getElementById("service-header");
    if (headerEl) headerEl.innerText = data.header;
  });

// Carregar Serviços
fetch(`${API_URL}/content/services`)
  .then((res) => res.json())
  .then((services) => {
    const container = document.querySelector(".service_flex");
    container.innerHTML = "";

    services.forEach((service) => {
      container.innerHTML += `
        <div class="service_card">
          <div>
            <img src="${service.img}" alt="service"/>
          </div>
          <p>${service.title}</p>
        </div>
      `;
    });
  });

// Carregar conteúdo do Sobre
fetch(`${API_URL}/content/about`)
  .then((res) => res.json())
  .then((data) => {
    // título principal da seção
    document.getElementById("about-title").innerText = data.header || "";
    // seleciona todas as linhas de cards
    const rows = document.querySelectorAll("#about .about_row");
    // percorre os cards vindos do backend
    data.cards.forEach((card, i) => {
      const row = rows[i];
      if (!row) return;

      const img = row.querySelector("img[id^='about-img']");
      const desc = row.querySelector(`#about-desc-${i + 1}`);
      const title = row.querySelector("h4");

      if (img) img.src = card.img;
      if (desc) desc.innerText = card.description;
      if (title) title.innerText = card.title;
    });
  })
  .catch((err) => console.error("Erro ao carregar seção About:", err));

// Carregar depoimentos
fetch(`${API_URL}/content/section-control`)
  .then((res) => res.json())
  .then((control) => {
    if (!control.testimonialsEnabled) {
      const section = document.querySelector("#testimonials-section");
      if (section) section.style.display = "none";
      return;
    }

    // Só carrega depoimentos se estiver ativo
    fetch(`${API_URL}/content/testimonials`)
      .then((res) => res.json())
      .then((testimonials) => {
        const wrapper = document.querySelector(".swiper-wrapper");
        wrapper.innerHTML = "";

        testimonials.forEach((t) => {
          const slide = document.createElement("div");
          slide.className = "swiper-slide";
          slide.innerHTML = `
            <div class="client_card">
              <div class="client_details">
                <img src="${t.img}" alt="${t.name}" />
                <div>
                  <h4>${t.name}</h4>
                  <h5>${t.role}</h5>
                </div>
              </div>
              <p>${t.message}</p>
            </div>
          `;
          wrapper.appendChild(slide);
        });
      });
  });

new Swiper(".swiper", {
  loop: true,
  spaceBetween: 30,
  slidesPerView: 1,
  autoplay: {
    delay: 3000,
  },
  breakpoints: {
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
});

//Carregar posts do Instagram
fetch(`${API_URL}/content/instagram`)
  .then((res) => res.json())
  .then((posts) => {
    const grid = document.getElementById("instagram_grid");
    grid.innerHTML = "";

    posts.forEach((p) => {
      const block = document.createElement("blockquote");
      block.className = "instagram-media";
      block.setAttribute("data-instgrm-permalink", p.permalink);
      block.setAttribute("data-instgrm-version", "14");
      grid.appendChild(block);
    });

    // Reprocessa os embeds
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  });

// Carregar conteúdos dos Intros
fetch(`${API_URL}/content/intros`)
  .then((res) => res.json())
  .then((intros) => {
    intros.forEach((i, index) => {
      document.getElementById(`intro-${index + 1}-title`).innerText = i.title;
      document.getElementById(`intro-${index + 1}-description`).innerText =
        i.description;
      document.querySelector(`#intro-${index + 1} img`).src = i.img;
    });
  });

// Carregar conteúdo do footer/contato
fetch(`${API_URL}/content/footer`)
  .then((res) => res.json())
  .then((data) => {
    const addressEl = document.getElementById("contact-address");
    if (addressEl) addressEl.innerText = data.address || "";

    const phoneEl = document.getElementById("contact-phone");
    if (phoneEl) phoneEl.innerText = data.phone || "";

    const emailEl = document.getElementById("contact-email");
    if (emailEl) emailEl.innerText = data.email || "";

    const mapLink = document.getElementById("contact-map-link");
    if (mapLink && data.mapUrl) {
      mapLink.href = data.mapUrl;
    }

    // Redes sociais
    const list = document.querySelector(".footer_socials");
    if (!list) return;

    list.innerHTML = "";

    const socialIcons = {
      instagram: "ri-instagram-line",
      github: "ri-github-fill",
      facebook: "ri-facebook-fill",
      twitter: "ri-twitter-fill",
      youtube: "ri-youtube-fill",
      linkedin: "ri-linkedin-fill",
      tiktok: "ri-tiktok-fill",
      whatsapp: "ri-whatsapp-fill",
      pinterest: "ri-pinterest-fill",
      telegram: "ri-telegram-fill",
    };

    (data.socials || [])
      .filter((s) => s.enabled)
      .forEach((social) => {
        const key = social.name.toLowerCase().trim();
        const iconClass = socialIcons[key] || "ri-global-line";

        list.innerHTML += `
          <li>
            <a href="${social.url}" target="_blank" title="${social.name}">
              <i class="${iconClass}"></i>
            </a>
          </li>
        `;
      });
  });
