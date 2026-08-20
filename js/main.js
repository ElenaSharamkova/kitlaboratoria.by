document.addEventListener("DOMContentLoaded", () => {
  initBurger();
  initPhoneMask();
  initScrollTop();
  initAccordion();
  initSlider();
  initCookieBanner()
});

function initBurger() {
  //Бургер меню
  const burger = document.getElementById("burger");
  const menu = document.getElementById("menu");
  const body = document.querySelector("body");
  if (!burger || !menu) return;

  burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    menu.classList.toggle("active");
    body.classList.toggle("no-scroll");
  });
}

function initPhoneMask() {
  //Проверка телефона
  const phoneInput = document.getElementById("phone");
  if (!phoneInput) return;

  phoneInput.addEventListener("input", function (e) {
    let x = e.target.value.replace(/\D/g, "").substring(0, 12);

    let formatted = "+375";

    if (x.length > 3) formatted += " (" + x.substring(3, 5);
    if (x.length >= 5) formatted += ") " + x.substring(5, 8);
    if (x.length >= 8) formatted += "-" + x.substring(8, 10);
    if (x.length >= 10) formatted += "-" + x.substring(10, 12);

    e.target.value = formatted;
  });
}
function initScrollTop() {
  const btn = document.getElementById("scrollTopBtn");
  const footer = document.querySelector("footer");
  if (!btn || !footer) return;

  window.addEventListener("scroll", () => {
    const footerPosition = footer.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    btn.style.display =
      window.scrollY > 300 && footerPosition > windowHeight ? "block" : "none";
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initSlider() {
  const sliderElement = document.querySelector(".slider");
  if (!sliderElement) return;

  new Slider(sliderElement, {
    interval: 4000,
  });
}
class Slider {
  constructor(root, options = {}) {
    this.root = root;

    this.slides = root.querySelectorAll(".slide");
    this.nextBtn = root.querySelector(".next");
    this.prevBtn = root.querySelector(".prev");
    this.dotsContainer = root.querySelector(".dots");
    this.slidesWrapper = root.querySelector(".slides");

    this.index = 0;
    this.intervalTime = options.interval || 3000;
    this.timer = null;

    this.startX = 0;
    this.endX = 0;

    this.init();
  }

  init() {
    if (!this.slides.length) return;

    this.createDots();
    this.update();
    this.bindEvents();
    this.startAuto();
  }

  // ===== dots =====
  createDots() {
    this.dots = [];

    this.slides.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.classList.add("dot");

      if (i === 0) dot.classList.add("active");

      dot.addEventListener("click", () => {
        this.goTo(i);
        this.restartAuto();
      });

      this.dotsContainer.appendChild(dot);
      this.dots.push(dot);
    });
  }

  // ===== обновление =====
  update() {
    const offset = -this.index * 100;
    this.slidesWrapper.style.transform = `translateX(${offset}%)`;

    this.dots.forEach((d) => d.classList.remove("active"));
    this.dots[this.index].classList.add("active");
  }

  // ===== навигация =====
  next() {
    this.index = (this.index + 1) % this.slides.length;
    this.update();
  }

  prev() {
    this.index = (this.index - 1 + this.slides.length) % this.slides.length;
    this.update();
  }

  goTo(i) {
    this.index = i;
    this.update();
  }

  // ===== автопрокрутка =====
  startAuto() {
    this.stopAuto();

    this.timer = setTimeout(() => {
      this.next();
      this.startAuto();
    }, this.intervalTime);
  }

  stopAuto() {
    clearTimeout(this.timer);
  }

  restartAuto() {
    this.stopAuto();
    this.startAuto();
  }

  // ===== свайп =====
  onTouchStart(e) {
    this.startX = e.touches[0].clientX;
    this.stopAuto();
  }

  onTouchMove(e) {
    this.endX = e.touches[0].clientX;
  }

  onTouchEnd() {
    const diff = this.startX - this.endX;

    if (diff > 50) this.next();
    if (diff < -50) this.prev();

    this.startAuto();
  }

  // ===== события =====
  bindEvents() {
    this.nextBtn?.addEventListener("click", () => {
      this.next();
      this.restartAuto();
    });

    this.prevBtn?.addEventListener("click", () => {
      this.prev();
      this.restartAuto();
    });

    // hover
    this.root.addEventListener("mouseenter", () => this.stopAuto());
    this.root.addEventListener("mouseleave", () => this.startAuto());

    // touch
    this.root.addEventListener("touchstart", (e) => this.onTouchStart(e));
    this.root.addEventListener("touchmove", (e) => this.onTouchMove(e));
    this.root.addEventListener("touchend", () => this.onTouchEnd());
  }
}

//Аккордеон
function initAccordion() {
  document.addEventListener("click", (e) => {
    const header = e.target.closest(".accordion-header");
    if (!header) return;

    const item = header.closest(".accordion-item");
    const body = item.querySelector(".accordion-body");

    const isOpen = item.classList.contains("active");

    // закрыть все
    document.querySelectorAll(".accordion-item").forEach((i) => {
      i.classList.remove("active");
      const b = i.querySelector(".accordion-body");
      b.style.height = b.scrollHeight + "px"; // фиксируем
      requestAnimationFrame(() => {
        b.style.height = "0px";
      });
    });

    // открыть текущий
    if (!isOpen) {
      item.classList.add("active");

      body.style.height = "auto";
      const height = body.scrollHeight + "px";
      body.style.height = "0px";

      requestAnimationFrame(() => {
        body.style.height = height;
      });
    }
  });
}

// Cookie

function initCookieBanner() {
  const cookieBanner = document.querySelector(".cookie-banner");
  const cookieBtn = document.querySelector(".cookie-btn");

  if (!cookieBanner || !cookieBtn) return;

  // Проверяем согласие
  const isAccepted = localStorage.getItem("cookieAccepted");

  // Если пользователь еще не принимал cookies
  if (!isAccepted) {
    cookieBanner.style.display = "flex";
  }

  // Кнопка подтверждения
  cookieBtn.addEventListener("click", () => {
    localStorage.setItem("cookieAccepted", "true");

    cookieBanner.classList.add("hide");

    setTimeout(() => {
      cookieBanner.style.display = "none";
    }, 300);
  });
}