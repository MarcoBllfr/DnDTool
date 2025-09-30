<script lang="ts">
  import Icon from "@iconify/svelte";

  interface EncounterDifficulty {
    level: 'trivial' | 'easy' | 'medium' | 'hard' | 'deadly' | 'epic';
    description: string;
    color: string;
    icon: string;
    advice: string;
    bgColor: string;
    borderColor: string;
  }

  interface Difficulty {
    facile: number;
    medio: number;
    difficile: number;
    mortale: number;
  }

  let { 
    monsterTotalExp = $bindable(0),
    expToGive = $bindable(0),
    monsterCount = $bindable(0),
    playerCount = $bindable(0),
    playerExpThresholds = $bindable<Difficulty>({
      facile: 0,
      medio: 0,
      difficile: 0,
      mortale: 0
    })
  } = $props();

  let encounterDifficulty: EncounterDifficulty = $state({
    level: 'trivial',
    description: 'Configuration needed',
    color: '#6b7280',
    icon: 'mdi:help-circle',
    advice: 'Set up players and monsters to calculate the difficulty',
    bgColor: 'rgba(107, 114, 128, 0.1)',
    borderColor: 'rgba(107, 114, 128, 0.3)'
  });

  // Effetto reattivo che si aggiorna quando cambiano monsterTotalExp o playerExpThresholds
  $effect(() => {
    const thresholds = playerExpThresholds as Difficulty;
    if (playerExpThresholds.facile > 0) {
      encounterDifficulty = calculateEncounterDifficulty(thresholds, monsterTotalExp);
    }
  });

  function calculateEncounterDifficulty(playerThresholds: Difficulty, monsterExp: number): EncounterDifficulty {
    if (monsterExp === 0 || playerThresholds.facile === 0) {
      return {
        level: 'trivial',
        description: 'No Encounter',
        color: '#6b7280',
        icon: 'mdi:sleep',
        advice: 'Add monsters and players to get started',
        bgColor: 'rgba(107, 114, 128, 0.1)',
        borderColor: 'rgba(107, 114, 128, 0.3)'
      };
    }
    if (monsterExp < playerThresholds.facile) {
      return {
        level: 'trivial',
        description: 'Trivial',
        color: '#4ade80',
        icon: 'mdi:emoticon-happy',
        advice: 'The players will win easily. Consider adding more monsters.',
        bgColor: 'rgba(74, 222, 128, 0.1)',
        borderColor: 'rgba(74, 222, 128, 0.3)'
      };
    } else if (monsterExp < playerThresholds.medio) {
      return {
        level: 'easy',
        description: 'Easy',
        color: '#22c55e',
        icon: 'mdi:thumb-up',
        advice: 'A relaxed encounter that should require minimal resources.',
        bgColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgba(34, 197, 94, 0.3)'
      };
    } else if (monsterExp < playerThresholds.difficile) {
      return {
        level: 'medium',
        description: 'Medium',
        color: '#f59e0b',
        icon: 'mdi:scale-balance',
        advice: 'A balanced encounter that will test the players.',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        borderColor: 'rgba(245, 158, 11, 0.3)'
      };
    } else if (monsterExp < playerThresholds.mortale) {
      return {
        level: 'hard',
        description: 'Hard',
        color: '#ef4444',
        icon: 'mdi:alert-circle',
        advice: 'A challenging encounter. Players will need tactics and resources.',
        bgColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 0.3)'
      };
    } else if (monsterExp < playerThresholds.mortale * 2) {
      return {
        level: 'deadly',
        description: 'Deadly',
        color: '#dc2626',
        icon: 'mdi:skull',
        advice: 'WARNING: High risk of character death!',
        bgColor: 'rgba(220, 38, 38, 0.1)',
        borderColor: 'rgba(220, 38, 38, 0.3)'
      };
    } else {
      return {
        level: 'epic',
        description: 'Epic',
        color: '#7c2d12',
        icon: 'mdi:fire',
        advice: 'EXTREME DANGER: Players may be completely overwhelmed!',
        bgColor: 'rgba(124, 45, 18, 0.1)',
        borderColor: 'rgba(124, 45, 18, 0.3)'
      };
    }
  }

  function getProgressPercentage(): number {
    if (playerExpThresholds.mortale === 0) return 0;
    return Math.min((monsterTotalExp / playerExpThresholds.mortale) * 100, 200);
  }

  function getProgressColor(): string {
    const percentage = getProgressPercentage();
    if (percentage < 25) return '#4ade80';
    if (percentage < 50) return '#22c55e';
    if (percentage < 75) return '#f59e0b';
    if (percentage < 100) return '#ef4444';
    return '#dc2626';
  }
</script>

{#snippet statsCards()}
  <div class="exp-cards-grid">
    <div 
      class="exp-card" 
      style="
        --card-color: #3b82f6;
        --card-bg: rgba(59, 130, 246, 0.1);
        --card-border: rgba(59, 130, 246, 0.3);
      "
    >
      <div class="exp-card-header">
        <Icon 
          icon="mdi:account-group" 
          width="24" 
          style="color: #3b82f6;" 
        />
        <h4 class="exp-card-title">Players</h4>
      </div>
      <div class="exp-card-value">
        {playerCount}
      </div>
    </div>

    <div 
      class="exp-card" 
      style="
        --card-color: #ef4444;
        --card-bg: rgba(239, 68, 68, 0.1);
        --card-border: rgba(239, 68, 68, 0.3);
      "
    >
      <div class="exp-card-header">
        <Icon 
          icon="mdi:sword" 
          width="24" 
          style="color: #ef4444;" 
        />
        <h4 class="exp-card-title">Monsters</h4>
      </div>
      <div class="exp-card-value">
        {monsterCount}
      </div>
    </div>

    <div 
      class="exp-card total-exp-card" 
      style="
        --card-color: #f59e0b;
        --card-bg: rgba(245, 158, 11, 0.1);
        --card-border: rgba(245, 158, 11, 0.3);
      "
    >
      <div class="exp-card-header">
        <Icon 
          icon="mdi:star" 
          width="24" 
          style="color: #f59e0b;" 
        />
        <h4 class="exp-card-title">XP Reward</h4>
      </div>
      <div class="exp-card-value">
        {expToGive}
      </div>
    </div>
  </div>
{/snippet}

{#snippet difficultyCard()}
  <div 
    class="exp-card difficulty-card" 
    style="
      --card-color: {encounterDifficulty.color};
      --card-bg: {encounterDifficulty.bgColor};
      --card-border: {encounterDifficulty.borderColor};
    "
  >
    <div class="exp-card-header">
      <Icon 
        icon={encounterDifficulty.icon} 
        width="32" 
        style="color: {encounterDifficulty.color};" 
      />
      <h4 class="exp-card-title difficulty-large">{encounterDifficulty.description}</h4>
    </div>
    <p class="difficulty-advice">{encounterDifficulty.advice}</p>
  </div>
{/snippet}

{#snippet progressBar()}
  <div class="progress-wrapper">
    <div class="progress-labels">
      <span class="progress-label">Easy</span>
      <span class="progress-label">Medium</span>
      <span class="progress-label">Hard</span>
      <span class="progress-label">Deadly</span>
    </div>
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        style="width: {getProgressPercentage()}%; background-color: {getProgressColor()};"
      ></div>
      <div class="progress-markers">
        <div class="marker" style="left: {(playerExpThresholds.facile / playerExpThresholds.mortale) * 100}%;"></div>
        <div class="marker" style="left: {(playerExpThresholds.medio / playerExpThresholds.mortale) * 100}%;"></div>
        <div class="marker" style="left: {(playerExpThresholds.difficile / playerExpThresholds.mortale) * 100}%;"></div>
        <div class="marker marker-deadly" style="left: 100%;"></div>
      </div>
    </div>
  </div>
{/snippet}

{#snippet thresholdsTable()}
  <div class="thresholds-table-wrapper">
    <table class="thresholds-table">
      <thead>
        <tr>
          <th>Easy</th>
          <th>Medium</th>
          <th>Hard</th>
          <th>Deadly</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class={monsterTotalExp >= playerExpThresholds.facile ? 'threshold-exceeded' : 'threshold-safe'}>
            {playerExpThresholds.facile}
          </td>
          <td class={monsterTotalExp >= playerExpThresholds.medio ? 'threshold-exceeded' : 'threshold-safe'}>
            {playerExpThresholds.medio}
          </td>
          <td class={monsterTotalExp >= playerExpThresholds.difficile ? 'threshold-exceeded' : 'threshold-safe'}>
            {playerExpThresholds.difficile}
          </td>
          <td class={monsterTotalExp >= playerExpThresholds.mortale ? 'threshold-exceeded' : 'threshold-safe'}>
            {playerExpThresholds.mortale}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
{/snippet}

<div class="container">
  <div class="card encounter-card">
    <h1 class="text-center mb-m">Encounter Outcome</h1>
    <div class="underscore mb-l"></div>

    {#if playerCount > 0 && monsterCount > 0}
      <div class="section">
        <h3 class="section-title">
          <Icon icon="mdi:chart-box" width="24" />
          Encounter Statistics
        </h3>
        {@render statsCards()}
      </div>

      <div class="section">
        <h3 class="section-title">
          <Icon icon="mdi:gauge" width="24" />
          Difficulty Assessment
        </h3>
        {@render difficultyCard()}
      </div>

      {#if playerExpThresholds.mortale > 0}
        <div class="section">
          <h3 class="section-title">
            <Icon icon="mdi:chart-timeline-variant" width="24" />
            Progress Visualization
          </h3>
          {@render progressBar()}
        </div>

        <div class="section">
          <h3 class="section-title">
            <Icon icon="mdi:table" width="24" />
            Difficulty Thresholds
          </h3>
          {@render thresholdsTable()}
        </div>
      {/if}
    {:else}
      <div class="empty-state">
        <Icon icon="mdi:alert-circle-outline" width="48" />
        <h3>Configure Your Encounter</h3>
        <p class="dark-grey">Use Heroes and Monster calculators to set up your encounter</p>
      </div>
    {/if}
  </div>
</div>

<style>
  
  .container {
    padding: 1rem;
    max-width: 100%;
  }

  
  .section {
    margin-bottom: 2rem;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    color: var(--text-color);
    font-size: 1.25rem;
  }

 
  .exp-cards-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .exp-card {
    background: var(--card-bg);
    border: 2px solid var(--card-border);
    border-radius: 12px;
    padding: 1.25rem;
    text-align: center;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .exp-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--card-color);
  }

  .exp-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: var(--card-color);
  }

  .total-exp-card {
    grid-column: 1 / -1;
  }

  .difficulty-card {
    grid-column: 1 / -1;
    padding: 1.5rem;
  }

  .exp-card-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .exp-card-title {
    color: var(--card-color);
    font-weight: 700;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0;
  }

  .difficulty-large {
    font-size: 1.3rem;
  }

  .exp-card-value {
    font-size: 2rem;
    font-weight: 800;
    color: var(--card-color);
    line-height: 1;
  }

  .difficulty-advice {
    font-size: 0.95rem;
    color: var(--secondary-text-color);
    font-style: italic;
    margin: 0;
    line-height: 1.5;
  }

  
  .progress-wrapper {
    background: var(--input-bg-color);
    border: 2px solid var(--border-color);
    border-radius: 12px;
    padding: 1.5rem;
  }

  .progress-labels {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    font-size: 0.8rem;
    color: var(--secondary-text-color);
    font-weight: 600;
  }

  .progress-label {
    text-align: center;
    flex: 1;
  }

  .progress-bar {
    position: relative;
    height: 24px;
    background: var(--input-bg-color);
    border-radius: 12px;
    overflow: hidden;
    border: 2px solid var(--border-color);
  }

  .progress-fill {
    height: 100%;
    transition: all 0.5s ease;
    border-radius: 10px;
  }

  .progress-markers {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }

  .marker {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: rgba(0, 0, 0, 0.3);
    transform: translateX(-1px);
  }

  .marker-deadly {
    background: #dc2626;
    width: 3px;
  }

  
  .thresholds-table-wrapper {
    border: 2px solid var(--border-color);
    border-radius: 12px;
    background: var(--card-bg-color);
    overflow: hidden;
  }

  .thresholds-table {
    width: 100%;
    border-collapse: collapse;
    margin: 0;
  }

  .thresholds-table thead {
    background: var(--table-header-bg);
  }

  .thresholds-table thead th {
    padding: 1rem;
    border-bottom: 2px solid var(--border-color);
    background: var(--table-header-bg);
    text-align: center;
    font-weight: 700;
    color: var(--text-color);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .thresholds-table tbody tr {
    transition: background-color 0.2s ease;
  }

  .thresholds-table tbody tr:hover {
    background-color: var(--table-row-hover);
  }

  .thresholds-table tbody td {
    padding: 1rem;
    text-align: center;
    border: 1px solid var(--border-color);
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s ease;
  }

  .threshold-exceeded {
    background-color: rgba(239, 68, 68, 0.2) !important;
    color: #ef4444 !important;
    font-weight: bold;
  }

  .threshold-safe {
    background-color: rgba(34, 197, 94, 0.1) !important;
    color: var(--text-color);
  }

  
  .empty-state {
    text-align: center;
    padding: 2rem;
    color: var(--secondary-text-color);
  }

  .empty-state h3 {
    margin: 1rem 0 0.5rem 0;
    color: var(--text-color);
  }

  
  @media (min-width: 480px) {
    .exp-cards-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .total-exp-card {
      grid-column: 1 / -1;
    }
    
    .difficulty-card {
      grid-column: 1 / -1;
    }
  }

  @media (min-width: 768px) {
    .container {
      padding: 1rem;
    }
    
    .exp-cards-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .exp-card-value {
      font-size: 2.25rem;
    }
    
    .section-title {
      font-size: 1.5rem;
    }

    .difficulty-large {
      font-size: 1.5rem;
    }

    .progress-labels {
      font-size: 0.85rem;
    }
  }

  @media (min-width: 1024px) {
    .exp-card {
      padding: 1.5rem;
    }
    
    .exp-card-value {
      font-size: 2rem;
    }
    
    .exp-card-title {
      font-size: 1.1rem;
    }

    .difficulty-card {
      padding: 2rem;
    }

    .difficulty-large {
      font-size: 1.6rem;
    }
  }

  @media (min-width: 1200px) {
    .container {
      padding: 3rem;
    }
    
    .exp-card-value {
      font-size: 3rem;
    }

    .difficulty-large {
      font-size: 1.8rem;
    }
  }

  @media (max-width: 320px) {
    .exp-cards-grid {
      gap: 0.75rem;
    }
    
    .exp-card {
      padding: 1rem;
    }
    
    .exp-card-value {
      font-size: 1.75rem;
    }
    
    .section-title {
      font-size: 1.1rem;
    }

    .difficulty-large {
      font-size: 1.1rem;
    }

    .progress-labels {
      font-size: 0.7rem;
    }
  }
</style>