<script lang="ts">
  import monsters from "$lib/data/5e_monsters.json";
  import Icon from "@iconify/svelte";

  const allMonsters: Monster[] = monsters;
  const itemsPerPage = 6;

  let currentPage = $state(1);
  let searchBar = $state("");
  let filteredCr = $state("");
  let sortBy = $state("name");

  const crDisponibili: string[] = [
    "0",
    "1/8",
    "1/4",
    "1/2",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
  ];

  let filteredMonsters = $derived.by(() => {
    const filtered = allMonsters.filter((m) => {
      const matchesName = m.name
        .toLowerCase()
        .includes(searchBar.toLowerCase());
      const cr = m.Challenge.split(" ")[0];
      const matchesCr = filteredCr === "" || cr === filteredCr;
      return matchesName && matchesCr;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else {
        const crA = a.Challenge.split(" ")[0];
        const crB = b.Challenge.split(" ")[0];
        const indexA = crDisponibili.indexOf(crA);
        const indexB = crDisponibili.indexOf(crB);
        return (
          (indexA === -1 ? Infinity : indexA) -
          (indexB === -1 ? Infinity : indexB)
        );
      }
    });
  });

  // Derived: total pages based on filtered results
  let totalPages = $derived.by(() =>
    Math.max(1, Math.ceil(filteredMonsters.length / itemsPerPage))
  );

  // Derived: current page's monster slice
  let paginatedMonsters = $derived.by(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMonsters.slice(start, start + itemsPerPage);
  });

  function nextPage() {
    if (currentPage < totalPages) currentPage++;
  }

  function prevPage() {
    if (currentPage > 1) currentPage--;
  }
</script>

<div class="container">
<div class="monster-list-header">
    <h1 class="text-center mb-m">The Monsters</h1>
    <div class="underscore mb-l"></div>
    
    <div class="filter-controls">
      <div class="filter-row">
        <div class="search-container">
          <input 
            type="text" 
            bind:value={searchBar}
            class="search-input"
            placeholder="Search monsters..."
          />
        </div>
        
        <select
          bind:value={filteredCr}
          class="cr-select"
          aria-label="Challenge Rating"
        >
          <option value="">All CR</option>
          {#each crDisponibili as cr}
            <option value={cr}>CR {cr}</option>
          {/each}
        </select>
      </div>
      
      <div class="filter-row">
        <div class="sort-controls">
          <button 
            onclick={() => (sortBy = "cr")} 
            class="sort-btn"
            class:active={sortBy === "cr"}
          >
            <Icon icon="mdi:chart-bar" width="18" />
            Order by CR
          </button>
          <button
            onclick={() => (sortBy = "name")}
            class="sort-btn"
            class:active={sortBy === "name"}
          >
            <Icon icon="mdi:sort-alphabetical-ascending" width="18" />
            Order by Name
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="monsters-grid">
    {#each paginatedMonsters as monster}
      <div class="card monster-card">
        <h2 class="monster-name">{monster.name}</h2>
        <div class="monster-image-box">
          <img src={monster.img_url} alt={monster.name} loading="lazy" />
        </div>

        <div class="monster-stats">
          <div class="stat-item">
            <Icon icon="mdi:s" width="18" />
            <span class="stat-label">CR:</span>
            <span class="stat-value important">{monster.Challenge}</span>
          </div>

          <div class="stat-item">
            <Icon icon="mdi:shield" width="18" />
            <span class="stat-label">CA:</span>
            <span class="stat-value">{monster["Armor Class"]}</span>
          </div>

          <div class="stat-item">
            <Icon icon="mdi:heart" width="18" />
            <span class="stat-label">Hit Points:</span>
            <span class="stat-value">{monster["Hit Points"]}</span>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <div class="pagination-wrapper">
    <div class="pagination">
      <button
        class="pagination-btn"
        onclick={prevPage}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <Icon icon="mdi:chevron-left" width="20" />
        <span class="pagination-text">Previous</span>
      </button>

      <div class="pagination-info">
        <span class="pagination-current">{currentPage}</span>
        <span class="pagination-separator">of</span>
        <span class="pagination-total">{totalPages}</span>
      </div>

      <button
        class="pagination-btn"
        onclick={nextPage}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <span class="pagination-text">Next</span>
        <Icon icon="mdi:chevron-right" width="20" />
      </button>
    </div>
  </div>
</div>

<style>
  .container {
    padding: 1rem;
    max-width: 100%;
  }

  .monster-list-header {
    margin-bottom: 2rem;
  }

  .monster-list-header h1 {
    color: var(--monster-title-color);
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  /* Filter Controls Styling */
  .filter-controls {
    background: var(--card-bg-color);
    border: 2px solid var(--border-color);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: var(--box-shadow);
    margin-bottom: 2rem;
  }

  .filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
  }

  .filter-row:last-child {
    margin-bottom: 0;
  }

  .search-container {
    position: relative;
    flex: 1;
    min-width: 200px;
    max-width: 300px;
  }

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--secondary-text-color);
    pointer-events: none;
    z-index: 1;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    font-size: 1rem;
    font-family: inherit;
    background: var(--input-bg-color);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-color);
    transition: all 0.3s ease;
    box-sizing: border-box;
  }

  .search-input::placeholder {
    color: var(--secondary-text-color);
    font-style: italic;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--monster-accent-color);
    box-shadow: 0 0 0 3px rgba(139, 0, 0, 0.1);
  }

  .dark-mode .search-input:focus {
    box-shadow: 0 0 0 3px rgba(255, 68, 68, 0.2);
  }

  .cr-select {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    font-family: inherit;
    font-weight: 600;
    background: var(--input-bg-color);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-color);
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 140px;
  }

  .cr-select:focus {
    outline: none;
    border-color: var(--monster-accent-color);
    box-shadow: 0 0 0 3px rgba(139, 0, 0, 0.1);
  }

  .dark-mode .cr-select:focus {
    box-shadow: 0 0 0 3px rgba(255, 68, 68, 0.2);
  }

  .cr-select option {
    background: var(--input-bg-color);
    color: var(--text-color);
    padding: 0.5rem;
  }

  .sort-controls {
    display: flex;
    gap: 0.5rem;
    background: rgba(0, 0, 0, 0.05);
    padding: 4px;
    border-radius: 10px;
    border: 2px solid var(--border-color);
  }

  .dark-mode .sort-controls {
    background: rgba(255, 255, 255, 0.05);
  }

  .sort-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    font-size: 0.95rem;
    font-weight: 600;
    font-family: inherit;
    background: transparent;
    color: var(--text-color);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
  }

  .sort-btn:hover {
    background: var(--hover-color);
    transform: translateY(-1px);
  }

  .sort-btn.active {
    background: var(--monster-accent-color);
    color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .sort-btn.active:hover {
    background: var(--monster-accent-color);
    filter: brightness(1.1);
  }

  .monsters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .monster-card {
    background: var(--card-bg-color);
    border: 2px solid var(--border-color);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: var(--box-shadow);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .monster-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--monster-accent-color);
  }

  .monster-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--box-shadow-hover);
    border-color: var(--monster-accent-color);
  }

  .monster-name {
    color: var(--monster-title-color);
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-align: center;
    line-height: 1.2;
  }

  .monster-image-box {
    width: 100%;
    height: 180px;
    overflow: hidden;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    margin-bottom: 1.25rem;
    background: var(--input-bg-color);
    position: relative;
  }

  .monster-image-box::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 6px;
    background: linear-gradient(
      135deg,
      transparent 0%,
      rgba(0, 0, 0, 0.1) 100%
    );
    pointer-events: none;
  }

  .monster-image-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .monster-card:hover .monster-image-box img {
    transform: scale(1.05);
  }

  .monster-stats {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    border: 1px solid var(--border-color);
    transition: all 0.2s ease;
  }

  .dark-mode .stat-item {
    background: rgba(255, 255, 255, 0.05);
  }

  .stat-label {
    font-weight: 600;
    color: var(--text-color);
    min-width: 80px;
  }

  .stat-value {
    font-weight: 500;
    color: var(--secondary-text-color);
  }

  .pagination-wrapper {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 2px solid var(--border-color);
  }

  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }

  .pagination-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--button-bg-color);
    color: var(--button-text-color);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
    cursor: pointer;
    min-width: 44px;
    justify-content: center;
  }

  .pagination-btn:hover:not(:disabled) {
    background: var(--button-hover-bg);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .pagination-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .pagination-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--card-bg-color);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    font-weight: 600;
    color: var(--text-color);
    font-size: 0.95rem;
    flex-shrink: 0;
  }

  .pagination-current {
    color: var(--important-color);
    font-weight: bold;
  }

  .pagination-separator {
    color: var(--secondary-text-color);
    font-size: 0.9rem;
  }

  .pagination-total {
    color: var(--text-color);
  }

  /* Responsive Design */
  @media (max-width: 480px) {
    .filter-controls {
      padding: 1rem;
    }

    .filter-row {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }

    .search-container {
      max-width: 100%;
    }

    .sort-controls {
      flex-direction: column;
      gap: 0.25rem;
    }

    .sort-btn {
      justify-content: center;
      padding: 0.875rem 1rem;
    }

    .monsters-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .monster-card {
      padding: 1rem;
    }

    .monster-name {
      font-size: 1.25rem;
    }

    .monster-image-box {
      height: 160px;
    }

    .pagination {
      max-width: 280px;
    }

    .pagination-text {
      display: none;
    }

    .pagination-btn {
      padding: 0.75rem;
      min-width: 50px;
    }

    .pagination-info {
      padding: 0.5rem 0.75rem;
      font-size: 0.9rem;
    }

    .stat-item {
      padding: 0.375rem;
    }

    .stat-label {
      min-width: 60px;
      font-size: 0.9rem;
    }
  }

  @media (min-width: 768px) {
    .filter-controls {
      padding: 2rem;
    }

    /* Layout orizzontale compatto su desktop - tutto in una riga */
    .filter-controls {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .filter-row {
      display: contents; /* Rimuove il wrapper per far fluire gli elementi */
      margin-bottom: 0;
    }

    .search-container {
      flex: 0 1 auto;
      max-width: 250px;
      min-width: 200px;
    }

    .cr-select {
      flex-shrink: 0;
      min-width: 120px;
    }

    .sort-controls {
      flex-shrink: 0;
      margin: 0;
    }

    .container {
      padding: 2rem;
    }

    .monsters-grid {
      gap: 2rem;
    }

    .monster-card {
      padding: 2rem;
    }

    .monster-name {
      font-size: 1.75rem;
    }

    .monster-image-box {
      height: 200px;
    }

    .stat-item {
      padding: 0.75rem;
    }
  }

  @media (min-width: 1024px) {
    .monsters-grid {
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    }

    .monster-list-header h1 {
      font-size: 3rem;
    }

    .monster-image-box {
      height: 220px;
    }
  }

  @media (min-width: 1200px) {
    .container {
      padding: 3rem;
    }

    .monsters-grid {
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      gap: 2.5rem;
    }

    .monster-list-header h1 {
      font-size: 3.5rem;
    }
  }
</style>