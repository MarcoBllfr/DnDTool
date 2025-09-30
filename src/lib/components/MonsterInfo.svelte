<script lang="ts">
  import Icon from "@iconify/svelte";
  import monsters from "$lib/data/5e_monsters.json";
  import monstersIta from "$lib/data/5e_monsters_it.json";
  import { onMount } from "svelte";

  const allMonsters: Monster[] = monsters;
  const allMonstersIt: Monster[] = monstersIta;

  let monsterToUse: Monster[] = $state(allMonstersIt);
  let monster: Monster | null = $state(null);
  let loading = $state(true);
  let error = $state("");
  let language = $state<"it" | "en">("en");

  let { whatISee = $bindable() } = $props();

  function loadMonster() {
    loading = true;
    error = "";

    monsterToUse = language === "it" ? allMonstersIt : allMonsters;

    const foundMonster = monsterToUse.find((m) => m.name === whatISee);

    if (foundMonster) {
      monster = foundMonster;
    } else {
      const foundMonsterCaseInsensitive = monsterToUse.find(
        (m) => m.name.toLowerCase() === whatISee.toLowerCase()
      );

      if (foundMonsterCaseInsensitive) {
        monster = foundMonsterCaseInsensitive;
      } else {
        error = `Mostro "${whatISee}" non trovato`;
        monster = null;
      }
    }

    loading = false;
  }

  function toggleLanguage() {
    language = language === "it" ? "en" : "it";
    loadMonster();
  }

  onMount(() => {
    loadMonster();
  });
</script>

{#snippet buttonL()}
  <div class="back-button">
    <button onclick={() => (whatISee = "monsterList")} class="back-link">
      <Icon icon="mdi:arrow-left" width="20" />
      {language === "it" ? "Torna alla lista mostri" : "Back to monster list"}
    </button>
  </div>
{/snippet}

{#if whatISee != ""}
  {#if loading}
    <div class="loading-state">
      <div class="loading-spinner">
        <Icon icon="mdi:loading" width="48" class="spin" />
      </div>
      <p>Caricamento mostro...</p>
    </div>
  {:else if error}
    <div class="error-state">
      <Icon icon="mdi:alert-circle" width="64" />
      <h1>Errore</h1>
      <p>{error}</p>
      {@render buttonL()}
    </div>
  {:else if monster}
    <p>
      <title>{monster.name} - Dettagli Mostro</title>
      <meta
        name="description"
        content="Dettagli completi per {monster.name} - D&D 5e"
      />
    </p>

    <div class="monster-detail">
      <div class="monster-header">
        <div class="header-row">
          <h1>{monster.name}</h1>

          <div class="language-switch">
            <button onclick={toggleLanguage} aria-label="Cambia lingua">
              {#if language === "it"}
                <Icon icon="twemoji:flag-for-flag-italy" width="32" />
              {:else}
                <Icon icon="twemoji:flag-for-flag-united-states" width="32" />
              {/if}
            </button>
          </div>
        </div>

        <p class="monster-meta">{monster.meta}</p>
      </div>

      <div class="monster-content">
        <div class="monster-image">
          <img src={monster.img_url} alt={monster.name} />
        </div>

        <div class="monster-stats-detailed">
          <div class="basic-stats">
            <div class="stat-row">
              <Icon icon="mdi:shield" />
              <strong>Armor Class:</strong>
              {monster["Armor Class"]}
            </div>
            <div class="stat-row">
              <Icon icon="mdi:heart" />
              <strong>Hit Points:</strong>
              {monster["Hit Points"]}
            </div>
            <div class="stat-row">
              <Icon icon="mdi:run" />
              <strong>Speed:</strong>
              {monster.Speed}
            </div>
          </div>

          <div class="ability-scores">
            <h3>Ability Scores</h3>
            <div class="abilities">
              <div class="ability">
                <div class="ability-name">STR</div>
                <div class="ability-score">{monster.STR}</div>
                <div class="ability-mod">({monster.STR_mod})</div>
              </div>
              <div class="ability">
                <div class="ability-name">DEX</div>
                <div class="ability-score">{monster.DEX}</div>
                <div class="ability-mod">({monster.DEX_mod})</div>
              </div>
              <div class="ability">
                <div class="ability-name">CON</div>
                <div class="ability-score">{monster.CON}</div>
                <div class="ability-mod">({monster.CON_mod})</div>
              </div>
              <div class="ability">
                <div class="ability-name">INT</div>
                <div class="ability-score">{monster.INT}</div>
                <div class="ability-mod">({monster.INT_mod})</div>
              </div>
              <div class="ability">
                <div class="ability-name">WIS</div>
                <div class="ability-score">{monster.WIS}</div>
                <div class="ability-mod">({monster.WIS_mod})</div>
              </div>
              <div class="ability">
                <div class="ability-name">CHA</div>
                <div class="ability-score">{monster.CHA}</div>
                <div class="ability-mod">({monster.CHA_mod})</div>
              </div>
            </div>
          </div>

          {#if monster["Saving Throws"]}
            <div class="stat-row">
              <strong>Saving Throws:</strong>
              {monster["Saving Throws"]}
            </div>
          {/if}

          {#if monster.Skills}
            <div class="stat-row">
              <strong>Skills:</strong>
              {monster.Skills}
            </div>
          {/if}

          {#if monster["Damage Vulnerabilities"]}
            <div class="stat-row">
              <strong>Damage Vulnerabilities:</strong>
              {monster["Damage Vulnerabilities"]}
            </div>
          {/if}

          {#if monster["Damage Resistances"]}
            <div class="stat-row">
              <strong>Damage Resistances:</strong>
              {monster["Damage Resistances"]}
            </div>
          {/if}

          {#if monster["Damage Immunities"]}
            <div class="stat-row">
              <strong>Damage Immunities:</strong>
              {monster["Damage Immunities"]}
            </div>
          {/if}

          {#if monster["Condition Immunities"]}
            <div class="stat-row">
              <strong>Condition Immunities:</strong>
              {monster["Condition Immunities"]}
            </div>
          {/if}

          <div class="stat-row">
            <strong>Senses:</strong>
            {monster.Senses}
          </div>

          <div class="stat-row">
            <strong>Languages:</strong>
            {monster.Languages}
          </div>

          <div class="stat-row">
            <Icon icon="mdi:sword-cross" />
            <strong>Challenge:</strong>
            {monster.Challenge}
          </div>
        </div>
      </div>

      {#if monster.Traits}
        <div class="monster-section">
          <h3>Special Traits</h3>
          <div class="monster-html-content">
            {@html monster.Traits}
          </div>
        </div>
      {/if}

      {#if monster.Actions}
        <div class="monster-section">
          <h3>Actions</h3>
          <div class="monster-html-content">
            {@html monster.Actions}
          </div>
        </div>
      {/if}

      {#if monster.Reactions}
        <div class="monster-section">
          <h3>Reactions</h3>
          <div class="monster-html-content">
            {@html monster.Reactions}
          </div>
        </div>
      {/if}

      {#if monster["Legendary Actions"]}
        <div class="monster-section">
          <h3>Legendary Actions</h3>
          <div class="monster-html-content">
            {@html monster["Legendary Actions"]}
          </div>
        </div>
      {/if}

      {@render buttonL()}
    </div>
  {/if}
{/if}

<style>
  .monster-header {
    text-align: center;
    margin-bottom: 2rem;
    border-bottom: 3px solid var(--monster-accent-color);
    padding-bottom: 1rem;
  }

  .header-row {
    display: flex;
    align-items: center;
    justify-content: center; 
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .monster-header h1 {
    font-size: 2.5rem;
    color: var(--monster-title-color);
    margin: 0;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }

  .monster-meta {
    font-style: italic;
    color: var(--secondary-text-color);
    font-size: 1.1rem;
    margin: 0;
  }

  /* Language switch button */
  .language-switch button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.35rem;
    border-radius: 8px;
    border: 2px solid var(--monster-accent-color);
    background: var(--card-bg-color);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .language-switch button:hover {
    background: var(--monster-accent-color);
    transform: scale(1.05);
    box-shadow: var(--box-shadow-hover);
  }

  /* Loading State */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
    color: var(--secondary-text-color);
    background: var(--card-bg-color);
    border-radius: 12px;
    margin: 2rem;
    border: 2px solid var(--border-color);
    box-shadow: var(--box-shadow);
  }

  .loading-spinner {
    margin-bottom: 1rem;
    color: var(--monster-accent-color);
  }

  :global(.spin) {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Error State */
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
    color: var(--text-color);
    background: var(--card-bg-color);
    border-radius: 12px;
    margin: 2rem;
    border: 2px solid var(--border-color);
    box-shadow: var(--box-shadow);
    padding: 2rem;
  }

  .error-state h1 {
    color: var(--monster-accent-color);
    margin: 1rem 0;
  }

  .back-link {
    margin-top: 2rem;
    color: var(--monster-accent-color);
    text-decoration: none;
    font-weight: bold;
    padding: 0.75rem 1.5rem;
    border: 2px solid var(--monster-accent-color);
    border-radius: 6px;
    transition: all 0.3s ease;
    background: var(--card-bg-color);
  }

  .back-link:hover {
    background: var(--monster-accent-color);
    color: var(--button-text-color);
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-hover);
  }

  /* Monster Detail Styles */
  .monster-detail {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family: inherit;
  }

  .monster-header {
    text-align: center;
    margin-bottom: 2rem;
    border-bottom: 3px solid var(--monster-accent-color);
    padding-bottom: 1rem;
  }

  .monster-header h1 {
    font-size: 2.5rem;
    color: var(--monster-title-color);
    margin-bottom: 0.5rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }

  .monster-meta {
    font-style: italic;
    color: var(--secondary-text-color);
    font-size: 1.1rem;
  }

  .monster-content {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .monster-image {
    text-align: center;
  }

  .monster-image img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: var(--box-shadow);
    border: 2px solid var(--border-color);
  }

  .stat-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    padding: 0.75rem;
    background: var(--input-bg-color);
    border-left: 4px solid var(--monster-accent-color);
    border-radius: 6px;
    border: 1px solid var(--border-color);
    transition: all 0.2s ease;
  }

  .stat-row:hover {
    background: var(--hover-color);
    transform: translateX(2px);
  }

  .ability-scores {
    margin: 1.5rem 0;
    padding: 1rem;
    background: var(--card-bg-color);
    border-radius: 8px;
    border: 2px solid var(--border-color);
  }

  .ability-scores h3 {
    color: var(--monster-accent-color);
    margin-bottom: 1rem;
    text-align: center;
    font-weight: bold;
  }

  .abilities {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.75rem;
  }

  .ability {
    text-align: center;
    padding: 0.75rem 0.5rem;
    background: var(--input-bg-color);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .ability:hover {
    border-color: var(--monster-accent-color);
    transform: translateY(-2px);
    box-shadow: var(--box-shadow);
  }

  .ability-name {
    font-weight: bold;
    font-size: 0.8rem;
    color: var(--monster-accent-color);
    margin-bottom: 0.25rem;
    text-transform: uppercase;
  }

  .ability-score {
    font-size: 1.4rem;
    font-weight: bold;
    color: var(--text-color);
  }

  .ability-mod {
    font-size: 0.9rem;
    color: var(--secondary-text-color);
  }

  .monster-section {
    margin: 2rem 0;
    padding: 1.5rem;
    background: var(--card-bg-color);
    border-radius: 8px;
    box-shadow: var(--box-shadow);
    border: 2px solid var(--border-color);
    transition: all 0.3s ease;
  }

  .monster-section:hover {
    box-shadow: var(--box-shadow-hover);
    transform: translateY(-1px);
  }

  .monster-section h3 {
    color: var(--monster-accent-color);
    border-bottom: 2px solid var(--monster-accent-color);
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .monster-html-content {
    line-height: 1.6;
    color: var(--text-color);
  }

  .monster-html-content :global(p) {
    margin-bottom: 1rem;
    color: var(--text-color);
  }

  .monster-html-content :global(strong) {
    color: var(--monster-accent-color);
    font-weight: bold;
  }

  .back-button {
    margin-top: 3rem;
    text-align: center;
    padding-top: 2rem;
    border-top: 2px solid var(--border-color);
  }

  .back-button a {
    color: var(--monster-accent-color);
    text-decoration: none;
    font-weight: bold;
    font-size: 1.1rem;
    padding: 0.75rem 1.5rem;
    border: 2px solid var(--monster-accent-color);
    border-radius: 6px;
    transition: all 0.3s ease;
    background: var(--card-bg-color);
  }

  .back-button a:hover {
    background: var(--monster-accent-color);
    color: var(--button-text-color);
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-hover);
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .monster-content {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .abilities {
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
    }

    .monster-detail {
      padding: 1rem;
    }

    .monster-header h1 {
      font-size: 2rem;
    }

    .ability {
      padding: 0.5rem 0.25rem;
    }

    .ability-score {
      font-size: 1.2rem;
    }

    .stat-row {
      padding: 0.5rem;
      font-size: 0.9rem;
    }

    .monster-section {
      padding: 1rem;
    }

    .loading-state,
    .error-state {
      margin: 1rem;
      padding: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .abilities {
      grid-template-columns: repeat(2, 1fr);
    }

    .monster-header h1 {
      font-size: 1.75rem;
    }

    .monster-detail {
      padding: 0.75rem;
    }

    .ability {
      padding: 0.5rem 0.25rem;
    }

    .ability-score {
      font-size: 1.1rem;
    }

    .ability-name {
      font-size: 0.7rem;
    }

    .stat-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
      text-align: left;
    }

    .back-button a {
      padding: 0.5rem 1rem;
      font-size: 1rem;
    }
  }
</style>
