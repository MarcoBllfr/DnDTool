<script lang="ts">
  import { loadDataPlayer } from "$services/LocalStorage";
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";

  interface EncounterDifficulty {
    level: 'trivial' | 'easy' | 'medium' | 'hard' | 'deadly' | 'epic';
    description: string;
    color: string;
    icon: string;
    advice: string;
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
    playerExpThresholds= $bindable<Difficulty>({
    facile: 0,
    medio: 0,
    difficile: 0,
    mortale: 0
  })
  } = $props();



  let encounterDifficulty: EncounterDifficulty = $state({
    level: 'trivial',
    description: 'Configuration needed',
    color: '#666',
    icon: 'mdi:help-circle',
    advice: 'Set up players and monsters to calculate the difficulty'
  });

  
 


  // Effetto reattivo che si aggiorna quando cambiano monsterTotalExp o playerExpThresholds
  $effect(() => {
    const thresholds = playerExpThresholds as Difficulty;
    if (playerExpThresholds.facile > 0) {
      encounterDifficulty = calculateEncounterDifficulty(thresholds , monsterTotalExp);
    }
  });

  function calculateEncounterDifficulty(playerThresholds: Difficulty, monsterExp: number): EncounterDifficulty {
    if (monsterExp === 0 || playerThresholds.facile === 0) {
      return {
        level: 'trivial',
        description: 'No encounter configured',
        color: 'var(--secondary-text-color)',
        icon: 'mdi:sleep',
        advice: 'Add monsters and players to get started'
      };
    }
    if (monsterExp < playerThresholds.facile) {
      return {
        level: 'trivial',
        description: 'Very easy',
        color: '#4ade80', 
        icon: 'mdi:emoticon-happy',
        advice: 'The players will win easily. Consider adding more monsters.'
      };
    } else if (monsterExp < playerThresholds.medio) {
      return {
        level: 'easy',
        description: 'Easy',
        color: '#22c55e', 
        icon: 'mdi:thumb-up',
        advice: 'A relaxed encounter that should require minimal resources.'
      };
    } else if (monsterExp < playerThresholds.difficile) {
      return {
        level: 'medium',
        description: 'Medium',
        color: '#f59e0b',
        icon: 'mdi:scale-balance',
        advice: 'A balanced encounter that will test the players.'
      };
    } else if (monsterExp < playerThresholds.mortale) {
      return {
        level: 'hard',
        description: 'Hard',
        color: '#ef4444', 
        icon: 'mdi:alert-circle',
        advice: 'A challenging encounter. Players will need tactics and resources.'
      };
    } else if (monsterExp < playerThresholds.mortale * 2) {
      return {
        level: 'deadly',
        description: 'Deadly',
        color: '#dc2626', 
        icon: 'mdi:skull',
        advice: 'WARNING: High risk of character death!'
      };
    } else {
      return {
        level: 'epic',
        description: 'Epic/Impossible',
        color: '#7c2d12', 
        icon: 'mdi:fire',
        advice: 'EXTREME DANGER: Players may be completely overwhelmed!'
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

<div class="container">
  <div class="card encounter-card">
    <h1 class="text-center mb-m">
      <Icon icon="mdi:sword-cross" width="32" style="vertical-align: middle; margin-right: 12px;" />
      Encounter Difficulty
    </h1>
    <div class="underscore mb-l"></div>

   
      
      <div class="stats-grid mb-m">
        <div class="stat-item">
          <Icon icon="mdi:account-group" width="20" />
          <span class="stat-label">Players:</span>
          <span class="stat-value">{playerCount}</span>
        </div>
        <div class="stat-item">
          <Icon icon="mdi:sword" width="20" />
          <span class="stat-label">Monsters:</span>
          <span class="stat-value">{monsterCount}</span>
        </div>
        <div class="stat-item">
          <Icon icon="mdi:star" width="20" />
          <span class="stat-label">EXP for win:</span>
          <span class="stat-value important">{expToGive}</span>
        </div>
      </div>

      
      <div class="difficulty-result" style="border-color: {encounterDifficulty.color};">
        <div class="difficulty-header">
          <Icon 
            icon={encounterDifficulty.icon} 
            width="32" 
            style="color: {encounterDifficulty.color};" 
          />
          <h2 class="difficulty-title" style="color: {encounterDifficulty.color};">
            {encounterDifficulty.description}
          </h2>
        </div>
        
        <p class="difficulty-advice">{encounterDifficulty.advice}</p>
        
        
        {#if playerExpThresholds.mortale > 0}
          <div class="progress-container">
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
        {/if}
      </div>

     
      {#if playerExpThresholds.facile > 0}
<div class="thresholds-section">
  <h3 class="mb-s">
    <Icon icon="mdi:chart-line" width="20" style="vertical-align: middle; margin-right: 8px;" />
    Difficulty Thresholds
  </h3>
  <table class="table">
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
{/if}
  </div>
</div>

<style>
  .encounter-card {
    background: linear-gradient(135deg, var(--card-bg-color) 0%, rgba(var(--accent-color), 0.05) 100%);
    border: 2px solid var(--border-color);
    position: relative;
    overflow: hidden;
  }

  .encounter-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, 
      #4ade80 0%, 
      #22c55e 25%, 
      #f59e0b 50%, 
      #ef4444 75%, 
      #dc2626 100%
    );
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: rgba(var(--accent-color), 0.05);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 0.9rem;
  }

  .stat-label {
    color: var(--secondary-text-color);
    font-weight: 500;
  }

  .stat-value {
    font-weight: bold;
    color: var(--text-color);
  }

  .difficulty-result {
    padding: 1.5rem;
    border: 3px solid;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.02);
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .difficulty-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .difficulty-title {
    margin: 0;
    font-size: 1.8rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .difficulty-advice {
    font-size: 1rem;
    color: var(--secondary-text-color);
    font-style: italic;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }

  .progress-container {
    margin-top: 1rem;
  }

  .progress-labels {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.8rem;
    color: var(--secondary-text-color);
  }

  .progress-bar {
    position: relative;
    height: 20px;
    background: rgba(var(--border-color), 0.2);
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid var(--border-color);
  }

  .progress-fill {
    height: 100%;
    transition: all 0.5s ease;
    border-radius: 10px;
    position: relative;
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

  .thresholds-section {
    margin-top: 1.5rem;
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

  .loading-state {
    padding: 2rem;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    .difficulty-header {
      flex-direction: column;
      gap: 0.5rem;
    }

    .difficulty-title {
      font-size: 1.4rem;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .progress-labels {
      font-size: 0.7rem;
    }
  }
</style>