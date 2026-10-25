(() => {
  "use strict";

  const searchForm = document.querySelector("[data-character-search]");
  if (!searchForm) return;

  const searchInput = searchForm.querySelector("[type='search']");
  const clearButton = searchForm.querySelector("[data-search-clear]");
  const cards = Array.from(document.querySelectorAll("[data-character-card]"));
  const emptyState = document.querySelector("[data-empty-state]");
  const resultCount = document.querySelector("[data-result-count]");
  const resultLabel = document.querySelector("[data-result-label]");

  if (!searchInput || !resultCount || !cards.length) return;

  const total = cards.length;
  const normalize = (value) =>
    value
      .normalize("NFKC")
      .toLocaleLowerCase("zh-CN")
      .replace(/[\s\u3000]+/g, "");

  const render = () => {
    const query = normalize(searchInput.value);
    let matches = 0;

    cards.forEach((card) => {
      const haystack = normalize(card.dataset.search || card.textContent || "");
      const isMatch = !query || haystack.includes(query);
      card.hidden = !isMatch;
      if (isMatch) matches += 1;
    });

    if (clearButton) clearButton.hidden = !searchInput.value;
    if (emptyState) emptyState.hidden = !query || matches > 0;

    if (query) {
      resultCount.textContent = String(matches).padStart(2, "0");
      if (resultLabel) resultLabel.textContent = "份匹配档案";
    } else {
      resultCount.textContent = String(total).padStart(2, "0");
      if (resultLabel) resultLabel.textContent = "位角色";
    }
  };

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    render();
  });

  searchInput.addEventListener("input", render);

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      searchInput.value = "";
      render();
      searchInput.focus();
    });
  }

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && searchInput.value) {
      event.preventDefault();
      searchInput.value = "";
      render();
    }
  });

  render();
})();
