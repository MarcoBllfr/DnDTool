<script lang="ts">
	import { getCrExperience, levelRules } from '$lib/data/LevelRules';
    import { onMount } from 'svelte';
    interface Mostro{
        Cr:string;
        quantity:number;
    }

    function monsterMultiplier(monsterCount: number) : number {
  if (monsterCount === 1) return 1;
  if (monsterCount === 2) return 1.5;
  if (monsterCount >= 3 && monsterCount <= 6) return 2;
  if (monsterCount >= 7 && monsterCount <= 10) return 2.5;
  if (monsterCount >= 11 && monsterCount <= 14) return 3;
  if (monsterCount >= 15) return 4;
  return 0;
    }

    let listaMonster = $state<Mostro[]>([]);
    let tempMonsterNumber = $state(1);
    let totalExp = $state(0);
    function addMonster(){
        if (tempMonsterNumber > listaMonster.length) {
    const nuovi = Array.from({ length: tempMonsterNumber - listaMonster.length }, () => ({  Cr: "1/8" , quantity :1 }));
    listaMonster.push(...nuovi);
  } else if (tempMonsterNumber < listaMonster.length) {
    listaMonster.length = tempMonsterNumber;
  }
  tempMonsterNumber += 1;
    }

    onMount(()=>{
        addMonster();
    });

    function expCalculation(){
        let tempExp = 0;
        let totalMonster = 0;
           listaMonster.forEach(monster =>{
            tempExp += getCrExperience(monster.Cr)*monster.quantity;
            totalMonster += monster.quantity;
        });
        totalExp = tempExp * monsterMultiplier(totalMonster);
    }

    $effect(()=>{
        expCalculation();
    })
</script>

<div>
    {#each listaMonster as monster }
        <p>{monster.Cr} ; {monster.quantity}</p>
    {/each}
    <p>Total exp : {totalExp}</p>
    <button onclick={()=>{addMonster()}}>add monster</button>
    <button onclick={()=>{expCalculation()}}>calc</button>
</div>