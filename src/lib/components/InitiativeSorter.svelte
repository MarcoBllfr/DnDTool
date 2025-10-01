<script lang="ts">

interface Entity {
  nome: string;
  roll: number;
  CA: number;
  HP: number;
}


let entities  = $state([])
function addRow(){
  entities.push({ nome: "Drago", roll: 25, CA: 18, HP: 200 });
}
</script>
<div>
  <button onclick={addRow}> aggiungi riga</button>
</div>
<style>

</style>