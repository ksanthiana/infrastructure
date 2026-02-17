// Active nav link highlight based on current page
(function () {
    const path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(a => {
        const href = (a.getAttribute("href") || "").split("/").pop();
        if (href === path) a.classList.add("active");
    });
})();

// Simple client-side filter for cards using data-tags + search input
function filterCards({ searchId, selectId, cardsSelector }) {
    const search = document.getElementById(searchId);
    const select = document.getElementById(selectId);
    const cards = Array.from(document.querySelectorAll(cardsSelector));

    const run = () => {
        const q = (search?.value || "").toLowerCase().trim();
        const tag = (select?.value || "all").toLowerCase();

        cards.forEach(card => {
            const text = (card.innerText || "").toLowerCase();
            const tags = ((card.getAttribute("data-tags") || "")).toLowerCase();
            const matchQ = !q || text.includes(q);
            const matchTag = tag === "all" || tags.includes(tag);
            card.style.display = (matchQ && matchTag) ? "" : "none";
        });
    };

    search?.addEventListener("input", run);
    select?.addEventListener("change", run);
    run();
}

// Mobile navbar toggle + auto-close on link click
(function () {
    const btn = document.querySelector(".nav-toggle");
    const nav = document.getElementById("siteNav");
    if (!btn || !nav) return;

    const icon = btn.querySelector(".nav-toggle-icon");
    const text = btn.querySelector(".nav-toggle-text");

    const setState = (open) => {
        nav.classList.toggle("open", open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        if (icon) icon.textContent = open ? "✕" : "☰";
        if (text) text.textContent = open ? "Close" : "Menu";
    };

    btn.addEventListener("click", () => {
        const open = !nav.classList.contains("open");
        setState(open);
    });

    // Auto-close when any nav link is clicked (mobile)
    nav.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", () => setState(false));
    });

    // Close menu when user taps outside (mobile)
    document.addEventListener("click", (e) => {
        const isSmall = window.matchMedia("(max-width: 820px)").matches;
        if (!isSmall) return;
        if (!nav.classList.contains("open")) return;
        if (nav.contains(e.target) || btn.contains(e.target)) return;
        setState(false);
    });

    // Ensure correct state if resized
    window.addEventListener("resize", () => {
        const isSmall = window.matchMedia("(max-width: 820px)").matches;
        if (!isSmall) setState(false);
    });
})();
