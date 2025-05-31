<script lang="ts">
    import { levelRules } from '$lib/data/LevelRules';
   interface Giocatore {
		livello: number;
	}

	let numeroGiocatori = $state(1);
	let listaPlayer = $state<Giocatore[]>([]);
    let totalExp = 0;


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
        let tempExp = 0;
        listaPlayer.forEach(giocatore => {
            const bonus = levelRules.facile[giocatore.livello] ?? 0;
            tempExp += bonus;
         
       });
       totalExp = tempExp ;
       console.log(totalExp);
       tempExp = 0;
       totalExp = 0;
    }
</script>

{#snippet tabGiocatori()}
    <table class="border-collapse border border-gray-400 w-full mt-4">
        <thead>
          <tr>
            <th class="border px-2 py-1">Giocatore #</th>
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

<div class="p-4 space-y-4">
    <div>
      <label for="num">Numero di giocatori:</label>
      <input
        id="num"
        type="number"
        min="0"
        bind:value={numeroGiocatori}
        class="ml-2 border px-2 py-1"
      />
</div>
{#if numeroGiocatori > 0}
{@render tabGiocatori()}
{:else}
<h3>Insert a number of player up to 0</h3>
{/if}

</div>
<button onclick={calcolaExp}>Calculate</button>