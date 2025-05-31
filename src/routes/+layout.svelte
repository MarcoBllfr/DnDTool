<script lang="ts">
   import './app.css'
  
   let {children} = $props();
</script>
<div class="site-wrapper">
  
   {@render children()}
  
 </div>

 <style>
   .site-wrapper {
     width: 100%;
     max-width: 100%;
     overflow-x: hidden;
     position: relative;
   }
 </style>