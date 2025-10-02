<script lang="ts">
  import Icon from "@iconify/svelte";

  interface Entity {
    id: number;
    nome: string;
    roll: number;
    CA: number;
    HP: number;
    maxHP: number;
  }

  let entities = $state<Entity[]>([]);
  let counter = 1;
  
  function addRow() {
    entities.push({ 
      id: counter++, 
      nome: "New Entity", 
      roll: 0, 
      CA: 10, 
      HP: 10,
      maxHP: 10
    });
  }
  
  function removeRow(id: number) {
    entities = entities.filter(e => e.id !== id);
    if (sortedEntities.length === 0) {
      currentTurn = null;
    } else if (currentTurn !== null && currentTurn >= sortedEntities.length) {
      currentTurn = 0;
    }
  }
  
  function resetTable() {
    entities = [];
    counter = 1;
    currentTurn = null;
  }
  
  let sortedEntities = $derived([...entities].sort((a, b) => b.roll - a.roll));
  let currentTurn = $state<number | null>(null);
  
  function startBattle() {
    if (sortedEntities.length > 0) {
      currentTurn = 0;
    }
  }
  
  function endTurn() {
    if (currentTurn !== null) {
      currentTurn = (currentTurn + 1) % sortedEntities.length;
    }
  }
  
  function resumeTurn(index: number) {
    currentTurn = index;
  }

  function getHPColor(hp: number, maxHp: number): string {
    const percentage = (hp / maxHp) * 100;
    if (percentage > 75) return '#22c55e';
    if (percentage > 50) return '#f59e0b';
    if (percentage > 25) return '#ef4444';
    return '#dc2626';
  }

  function getHPPercentage(hp: number, maxHp: number): number {
    return Math.max(0, Math.min(100, (hp / maxHp) * 100));
  }
</script>

<section class="initiative-tracker">
  <div class="tracker-card">
    <header class="tracker-header">
      <div class="header-title">
        <Icon icon="mdi:sword-cross" width="32" />
        <h1>Initiative Tracker</h1>
      </div>
      <div class="underscore"></div>
    </header>

    <div class="action-buttons">
      <button class="btn-action btn-add" onclick={addRow}>
        <Icon icon="mdi:plus-circle" width="20" />
        <span>Add Entity</span>
      </button>
      
      {#if entities.length > 0}
        <button class="btn-action btn-start" onclick={startBattle} disabled={currentTurn !== null}>
          <Icon icon="mdi:play-circle" width="20" />
          <span>Start Battle</span>
        </button>
        
        <button class="btn-action btn-reset" onclick={resetTable}>
          <Icon icon="mdi:refresh" width="20" />
          <span>Reset</span>
        </button>
      {/if}
    </div>

    {#if sortedEntities.length > 0}
      <div class="table-container">
        <table class="initiative-table">
          <thead>
            <tr>
              <th class="col-turn">
                <Icon icon="mdi:chevron-right" width="20" />
              </th>
              <th class="col-name">Name</th>
              <th class="col-ac">
                <Icon icon="mdi:shield" width="18" />
                AC
              </th>
              <th class="col-hp">
                <Icon icon="mdi:heart" width="18" />
                HP
              </th>
              <th class="col-roll">
                <Icon icon="mdi:dice-d20" width="18" />
                Initiative
              </th>
              <th class="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each sortedEntities as entity, i (entity.id)}
              <tr class:current-turn={i === currentTurn} class:defeated={entity.HP <= 0}>
                <td class="turn-indicator">
                  {#if i === currentTurn}
                    <div class="turn-marker">
                      <Icon icon="mdi:arrow-right-bold" width="24" />
                    </div>
                  {:else}
                    <span class="turn-number">{i + 1}</span>
                  {/if}
                </td>
                
                <td class="entity-name">
                  <input 
                    type="text" 
                    bind:value={entity.nome} 
                    placeholder="Entity name"
                    class="input-name"
                  />
                </td>
                
                <td class="entity-ac">
                  <div class="number-input-wrapper">
                    <Icon icon="mdi:shield-outline" width="16" class="input-icon" />
                    <input 
                      type="number" 
                      bind:value={entity.CA} 
                      min="0"
                      class="input-number"
                    />
                  </div>
                </td>
                
                <td class="entity-hp">
                  <div class="hp-wrapper">
                    <div class="hp-inputs">
                      <input 
                        type="number" 
                        bind:value={entity.HP} 
                        min="0"
                        class="input-hp"
                      />
                      <span class="hp-separator">/</span>
                      <input 
                        type="number" 
                        bind:value={entity.maxHP} 
                        min="1"
                        class="input-hp-max"
                      />
                    </div>
                    <div class="hp-bar-container">
                      <div 
                        class="hp-bar-fill" 
                        style="width: {getHPPercentage(entity.HP, entity.maxHP)}%; background-color: {getHPColor(entity.HP, entity.maxHP)};"
                      ></div>
                    </div>
                  </div>
                </td>
                
                <td class="entity-roll">
                  <div class="number-input-wrapper">
                    <Icon icon="mdi:dice-multiple" width="16" class="input-icon" />
                    <input 
                      type="number" 
                      bind:value={entity.roll} 
                      class="input-number input-roll"
                    />
                  </div>
                </td>
                
                <td class="entity-actions">
                  <div class="action-group">
                    {#if i === currentTurn}
                      <button 
                        class="btn-small btn-end-turn" 
                        onclick={endTurn}
                        title="End Turn"
                      >
                        <Icon icon="mdi:skip-next" width="18" />
                      </button>
                    {:else}
                      <button 
                        class="btn-small btn-resume" 
                        onclick={() => resumeTurn(i)}
                        title="Resume Turn"
                      >
                        <Icon icon="mdi:play" width="18" />
                      </button>
                    {/if}
                    <button 
                      class="btn-small btn-delete" 
                      onclick={() => removeRow(entity.id)}
                      title="Delete Entity"
                    >
                      <Icon icon="mdi:delete" width="18" />
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <div class="empty-state">
        <Icon icon="mdi:sword" width="64" />
        <h3>No Entities Added</h3>
        <p>Add entities to start tracking initiative</p>
      </div>
    {/if}
  </div>
</section>

<style>
  .initiative-tracker {
    padding: 1rem;
    max-width: 100%;
  }

  .tracker-card {
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(12px) saturate(160%);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5);
    padding: 1.5rem;
    transition: all 0.3s ease;
  }

  .tracker-header {
    margin-bottom: 1.5rem;
  }

  .header-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .header-title h1 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--accent-color);
  }

  .action-buttons {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 1.5rem;
  }

  .btn-action {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-color);
    font-family: inherit;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s ease;
    font-size: 0.95rem;
  }

  .btn-action:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    border-color: var(--accent-color);
  }

  .btn-action:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-add {
    border-color: rgba(34, 197, 94, 0.5);
  }

  .btn-add:hover {
    background: rgba(34, 197, 94, 0.15);
    border-color: #22c55e;
  }

  .btn-start {
    border-color: rgba(59, 130, 246, 0.5);
  }

  .btn-start:hover:not(:disabled) {
    background: rgba(59, 130, 246, 0.15);
    border-color: #3b82f6;
  }

  .btn-reset {
    border-color: rgba(239, 68, 68, 0.5);
  }

  .btn-reset:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: #ef4444;
  }

  .table-container {
    overflow-x: auto;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .initiative-table {
    width: 100%;
    border-collapse: collapse;
    margin: 0;
  }

  .initiative-table thead {
    background: rgba(0, 0, 0, 0.3);
  }

  .initiative-table th {
    padding: 0.875rem 0.75rem;
    text-align: center;
    font-weight: 700;
    color: var(--accent-color);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 0.85rem;
    border-bottom: 2px solid var(--border-color);
  }

  .initiative-table tbody tr {
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.02);
  }

  .initiative-table tbody tr:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  .initiative-table tbody tr.current-turn {
    background: rgba(245, 158, 11, 0.2) !important;
    border-left: 4px solid #f59e0b;
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
  }

  .initiative-table tbody tr.defeated {
    opacity: 0.5;
  }

  .initiative-table td {
    padding: 0.75rem;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .col-turn {
    width: 50px;
  }

  .col-name {
    width: 140px;
    min-width: 100px;
  }

  .col-ac,
  .col-roll {
    width: 90px;
  }

  .col-hp {
    width: 130px;
  }

  .col-actions {
    width: 100px;
  }

  .turn-indicator {
    font-weight: 700;
    color: var(--secondary-text-color);
  }

  .turn-marker {
    color: #f59e0b;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.1); }
  }

  .turn-number {
    font-size: 0.9rem;
  }

  input {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    color: var(--text-color);
    font-family: inherit;
    transition: all 0.2s ease;
    font-size: 0.9rem;
  }

  input:focus {
    outline: none;
    border-color: var(--accent-color);
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 0 0 2px rgba(139, 0, 0, 0.1);
  }

  .input-name {
    width: 100%;
    padding: 0.5rem;
    font-weight: 600;
  }

  .number-input-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
  }

  .input-icon {
    color: var(--secondary-text-color);
  }

  .input-number {
    width: 60px;
    padding: 0.4rem;
    text-align: center;
  }

  .input-roll {
    font-weight: 700;
    font-size: 1rem;
  }

  .hp-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .hp-inputs {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
  }

  .input-hp,
  .input-hp-max {
    width: 50px;
    padding: 0.4rem;
    text-align: center;
  }

  .hp-separator {
    color: var(--secondary-text-color);
    font-weight: 600;
  }

  .hp-bar-container {
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    overflow: hidden;
  }

  .hp-bar-fill {
    height: 100%;
    transition: all 0.3s ease;
    border-radius: 2px;
  }

  .action-group {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .btn-small {
    width: 32px;
    height: 32px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-color);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-small:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.15);
  }

  .btn-end-turn {
    border-color: rgba(34, 197, 94, 0.5);
  }

  .btn-end-turn:hover {
    background: rgba(34, 197, 94, 0.2);
    border-color: #22c55e;
  }

  .btn-resume {
    border-color: rgba(59, 130, 246, 0.5);
  }

  .btn-resume:hover {
    background: rgba(59, 130, 246, 0.2);
    border-color: #3b82f6;
  }

  .btn-delete {
    border-color: rgba(239, 68, 68, 0.5);
  }

  .btn-delete:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: #ef4444;
  }

  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--secondary-text-color);
  }

  .empty-state h3 {
    margin: 1rem 0 0.5rem 0;
    color: var(--text-color);
    font-size: 1.3rem;
  }

  .empty-state p {
    margin: 0;
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    .tracker-card {
      padding: 1rem;
    }

    .header-title h1 {
      font-size: 1.4rem;
    }

    .col-name {
      width: 120px;
    }

    .col-ac,
    .col-roll {
      width: 85px;
    }

    .col-hp {
      width: 120px;
    }

    .initiative-table th {
      padding: 0.7rem 0.4rem;
      font-size: 0.85rem;
    }

    .initiative-table td {
      padding: 0.7rem 0.4rem;
    }

    .input-name {
      font-size: 0.85rem;
      padding: 0.45rem;
    }

    .input-number {
      width: 50px;
      padding: 0.4rem;
      font-size: 0.85rem;
    }

    .input-hp,
    .input-hp-max {
      width: 45px;
    }

    .btn-small {
      width: 30px;
      height: 30px;
    }

    .btn-action span {
      display: none;
    }
  }

  @media (max-width: 480px) {
    .col-turn,
    .col-ac,
    .col-hp,
    .turn-indicator,
    .entity-ac,
    .entity-hp {
      display: none;
    }

    .tracker-card {
      padding: 0.75rem;
    }

    .header-title h1 {
      font-size: 1.2rem;
    }

    .col-name {
      width: 85px;
      min-width: 70px;
    }

    .col-roll {
      width: 70px;
    }

    .col-actions {
      width: 75px;
    }

    .initiative-table th {
      padding: 0.6rem 0.3rem;
      font-size: 0.8rem;
    }

    .initiative-table td {
      padding: 0.6rem 0.3rem;
    }

    .input-name {
      font-size: 0.8rem;
      padding: 0.4rem 0.3rem;
    }

    .input-number {
      width: 45px;
      padding: 0.35rem;
      font-size: 0.85rem;
    }

    .btn-small {
      width: 28px;
      height: 28px;
    }

    .action-group {
      gap: 0.3rem;
    }

    .action-buttons {
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .btn-action {
      width: 100%;
      justify-content: center;
    }

    .btn-action span {
      display: inline;
    }

    .initiative-table tbody tr.current-turn {
      border-left: 4px solid #f59e0b;
    }
  }

  @media (max-width: 360px) {
    .header-title h1 {
      font-size: 1.1rem;
    }

    .col-name {
      width: 75px;
      min-width: 65px;
    }

    .col-roll {
      width: 65px;
    }

    .col-actions {
      width: 70px;
    }

    .initiative-table th,
    .initiative-table td {
      padding: 0.5rem 0.25rem;
      font-size: 0.75rem;
    }

    .input-name {
      font-size: 0.75rem;
      padding: 0.35rem 0.25rem;
    }

    .input-number {
      width: 42px;
      font-size: 0.8rem;
      padding: 0.3rem;
    }

    .btn-small {
      width: 26px;
      height: 26px;
    }

    .action-group {
      gap: 0.25rem;
    }
  }
</style>