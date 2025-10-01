<script lang="ts">
  interface Entity {
    id: number;
    nome: string;
    roll: number;
    CA: number;
    HP: number;
  }

  let entities = $state<Entity[]>([]);
  let counter = 1;

  function addRow() {
    entities.push({ id: counter++, nome: "Nuovo", roll: 0, CA: 0, HP: 0 });
  }

  function removeRow(id: number) {
    entities = entities.filter(e => e.id !== id);
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
</script>

<div>
  <button onclick={addRow}>➕ Aggiungi riga</button>
  <button onclick={resetTable}>🔄 Reset</button>
  <button onclick={startBattle}>⚔️ Start Battle</button>

  {#if sortedEntities.length > 0}
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Roll</th>
          <th>CA</th>
          <th>HP</th>
          <th>Azioni</th>
        </tr>
      </thead>
      <tbody>
        {#each sortedEntities as entity, i (entity.id)}
          <tr class:selected={i === currentTurn}>
            <td><input type="text" bind:value={entity.nome} /></td>
            <td><input type="number" bind:value={entity.roll} /></td>
            <td><input type="number" bind:value={entity.CA} /></td>
            <td><input type="number" bind:value={entity.HP} /></td>
            <td class="actions">
  {#if i === currentTurn}
    <button onclick={endTurn}>➡️ Termina turno</button>
  {:else}
    <button onclick={() => resumeTurn(i)}>🎯 Riprendi turno</button>
  {/if}
  <button onclick={() => removeRow(entity.id)}>❌ Elimina</button>
</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<style>
  table {
    border-collapse: collapse;
    margin-top: 1rem;
    width: 100%;
  }
  th, td {
    border: 1px solid #ccc;
    padding: 6px 10px;
    text-align: center;
  }
  input {
    width: 80px;
    text-align: center;
  }
  td.actions {
    text-align: center;
  }
  tr.selected {
    background-color: #ffeeba; 
    font-weight: bold;
  }
  button {
    margin: 2px;
    padding: 4px 8px;
    cursor: pointer;
  }
</style>
