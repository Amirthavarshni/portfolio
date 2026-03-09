const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const yearEl = document.getElementById("year");
const revealEls = document.querySelectorAll(".reveal");
const chips = document.querySelectorAll(".skill-chip");
const skillCards = document.querySelectorAll("#skillsGrid .card");
const tiltCards = document.querySelectorAll(".tilt-card");
const scrollProgress = document.getElementById("scrollProgress");
const counters = document.querySelectorAll(".counter");

menuBtn.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(isOpen));
});

yearEl.textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach((el) => revealObserver.observe(el));

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");

    const filter = chip.dataset.filter;
    skillCards.forEach((card) => {
      const matches = filter === "all" || card.dataset.group === filter;
      card.style.display = matches ? "block" : "none";
    });
  });
});

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = (x / rect.width - 0.5) * 8;
    const rotateX = (y / rect.height - 0.5) * -8;
    card.style.transform = `perspective(600px) rotateX(${rotateX.toFixed(1)}deg) rotateY(${rotateY.toFixed(1)}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

const updateScrollProgress = () => {
  const winScroll = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
  scrollProgress.style.width = `${scrolled}%`;
};

window.addEventListener("scroll", updateScrollProgress);
updateScrollProgress();

const animateCounter = (counter) => {
  const target = Number(counter.dataset.target);
  const step = Math.max(1, Math.ceil(target / 28));
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    counter.textContent = `${current}${target === 30 ? "%" : "+"}`;
  }, 28);
};

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

counters.forEach((counter) => counterObserver.observe(counter));