const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const header = document.querySelector(".header");
const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const toggle = document.querySelector(".nav-toggle");
const mobileNav = document.getElementById("mobile-nav");
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
  mobileNav.hidden = open;
});
mobileNav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", "false");
    mobileNav.hidden = true;
  })
);

const revealItems = document.querySelectorAll("[data-reveal]");
if (reduceMotion) {
  revealItems.forEach((el) => el.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        const siblings = [...entry.target.parentElement.children].filter((c) => c.hasAttribute("data-reveal"));
        const delay = Math.min(siblings.indexOf(entry.target), 6) * 70;
        setTimeout(() => entry.target.classList.add("is-visible"), delay);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  revealItems.forEach((el) => revealObserver.observe(el));
}

const counters = document.querySelectorAll("[data-count]");
const animateCount = (el) => {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  if (reduceMotion) {
    el.textContent = target + suffix;
    return;
  }
  const duration = 1400;
  let start = null;
  const step = (ts) => {
    if (start === null) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const countObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      obs.unobserve(entry.target);
    });
  },
  { threshold: 0.6 }
);
counters.forEach((el) => countObserver.observe(el));

const form = document.querySelector(".quote");
const status = form.querySelector(".quote__status");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  const name = form.querySelector("#name").value.trim().split(" ")[0] || "there";
  status.textContent = `Thanks, ${name} — your request is ready to send. Connect this form to your inbox or CRM to go live.`;
  form.querySelector('button[type="submit"]').textContent = "Request Prepared ✓";
});
