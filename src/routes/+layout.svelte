<script lang="ts">
  import { Header } from '$components';
   import '../app.css'
   import '../theme.css'
   let {children} = $props();
</script>
<div class="site-wrapper">
  <Header />
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