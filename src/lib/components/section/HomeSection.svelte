<script lang="ts">
  import Icon from "@iconify/svelte";

  
    function changeChoice(newChoice: string) {
        IsRendered = newChoice;
    }

  let { IsRendered = $bindable("")} = $props();
</script>

<section class="home-welcome">
  <div class="welcome-card">
    <header class="welcome-header">
      <h1>
        Welcome, Dungeon Masters &amp; Curious Adventurers 
        <small>(no cheating!)</small>
      </h1>
      <p class="lead">
        Welcome to the DnD Toolbox — your quick helper for planning and balancing encounters.
      </p>
    </header>

    <div class="welcome-body">
      <p>In this tool you will find two main sections:</p>

      <div class="welcome-sections">
        <button class="welcome-section" onclick={() => changeChoice("CalcTool")}>
          <Icon icon="mdi:calculator-variant" width="28" />
          <div>
            <h3>Encounter Calculator</h3>
            <p>Balance encounters based on XP and party thresholds.</p>
          </div>
        </button>

        <button class="welcome-section" onclick={() => changeChoice("MonstersGrimoire")}>
          <Icon icon="mdi:book-open-variant" width="28" />
          <div>
            <h3>Monster Grimoire</h3>
            <p>Browse and search through the available monsters.</p>
          </div>
        </button>
      </div>

      <p class="final-note">
        Whether you are preparing a deadly fight or browsing the bestiary, this toolbox will help you. 
        Enjoy your stay — and may your dice roll true!
      </p>
    </div>
  </div>
</section>
<style>
    .home-welcome {
  padding: 1.25rem;
  display: flex;
  justify-content: center;
}

.welcome-card {
  max-width: 880px;
  width: 100%;
  padding: 1.5rem 2rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px) saturate(160%);
  box-shadow: 0 6px 18px rgba(0,0,0,0.50);
}

.welcome-header h1 {
  margin: 0 0 .5rem 0;
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--accent-color);
}

.welcome-header small {
  font-size: 0.9rem;
  font-weight: normal;
  color: var(--secondary-text-color);
}

.welcome-header .lead {
  margin: 0 0 1rem 0;
  color: var(--text-color);
  font-size: 1.05rem;
}

.welcome-body p {
  color: var(--secondary-text-color);
  line-height: 1.5;
}

.welcome-sections {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0;
}

.welcome-section {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.25s ease;
  text-align: left;
}

.welcome-section:hover {
  background: rgba(255,255,255,0.12);
  transform: translateY(-2px);
  border-color: var(--accent-color);
}

.welcome-section h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--accent-color);
}

.welcome-section p {
  margin: 0.25rem 0 0 0;
  font-size: 0.9rem;
  color: var(--secondary-text-color);
}

.final-note {
  margin-top: 1rem;
  font-style: italic;
  color: var(--secondary-text-color);
}

</style>