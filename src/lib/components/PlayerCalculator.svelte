<script lang="ts">
import { levelRules } from '$lib/data/LevelRules';
import Icon from "@iconify/svelte";
   interface Giocatore {
		livello: number;
	}

interface Difficulty {
  facile: number;
  medio: number;
  difficile: number;
  mortale: number;
}
type Difficolta = keyof Difficulty;
	let numeroGiocatori = $state(1);
	let listaPlayer = $state<Giocatore[]>([]);

const difficoltaList: Difficolta[] = ['facile', 'medio', 'difficile', 'mortale'];

let expTotale: Difficulty = $state({
  facile: 0,
  medio: 0,
  difficile: 0,
  mortale: 0
});
	// Usa $effect per aggiornare listaPlayer al cambiamento di numeroGiocatori
	$effect(() => {
		if (numeroGiocatori > listaPlayer.length) {
			const nuovi = Array.from({ length: numeroGiocatori - listaPlayer.length }, () => ({ livello: 1 }));
			listaPlayer.push(...nuovi);
		} else if (numeroGiocatori < listaPlayer.length) {
			listaPlayer.length = numeroGiocatori;
		}
	});



    function calcolaExp() {
  difficoltaList.forEach(difficolta => {
    let tempExp = 0;
    listaPlayer.forEach(giocatore => {
      const bonus = levelRules[difficolta]?.[giocatore.livello] ?? 0;
      tempExp += bonus;
    });
    expTotale[difficolta] = tempExp;
  });
  expTotale = expTotale;
}

$effect(()=>{
    if(expTotale.facile > 0){
        calcolaExp();
    }
})

</script>

{#snippet tabGiocatori()}
    <table class="border-collapse border border-gray-400 w-full mt-4">
        <thead>
          <tr>
            <th class="border px-2 py-1">Giocatore</th>
            <th class="border px-2 py-1">Livello</th>
          </tr>
        </thead>
        <tbody>
            {#each listaPlayer  as giocatore,index }
            <tr>
            <td class="border px-2 text-center">{index + 1}</td>
            <td class="border px-2 text-center">
              <input
                type="number"
                min="1"
                max="20"
                bind:value={giocatore.livello}
                class="w-full border px-1"
              />
            </td>
          </tr>
            {/each}
        </tbody>
        </table>
{/snippet}

{#snippet tabExp()}
<table>
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
        <th>{expTotale.facile}</th>
        <th>{expTotale.medio}</th>
        <th>{expTotale.difficile}</th>
        <th>{expTotale.mortale}</th>
    </tr>
    </tbody>
  </table>
{/snippet}

<div class="p-4 space-y-4">
    <div>
      <label for="num">
        Number of player:
    </label>
      <input
        id="num"
        type="number"
        min="0"
        bind:value={numeroGiocatori}
        class="ml-2 border px-2 py-1"
      />
      <Icon icon="mdi:shield-sword-outline" width={"40"} />
</div>
{#if numeroGiocatori > 0}
{@render tabGiocatori()}
{:else}
<h3>Insert a number of player up to 0</h3>
{/if}
{#if expTotale.facile > 0}
{@render tabExp()}
    {:else}
    <h3>No exp to show for now</h3>
{/if}

</div>
<button onclick={calcolaExp}>Calculate</button>
<style>

</style>