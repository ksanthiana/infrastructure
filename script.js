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
