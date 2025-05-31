<script lang="ts">
  import Icon from "@iconify/svelte";
  import { DarkModeButton } from "$lib/components";
</script>

<header class="header">
  <div class="header-content">
    <div class="logo-section">
      <Icon icon="mdi:dice-d20" width="32" style="color: var(--accent-color);" />
      <h2 class="logo">D&D Tools</h2>
    </div>
    
    <div class="header-actions">
      <DarkModeButton />
    </div>
  </div>
</header>

<style>
  .header {
    background-color: var(--header-bg-color);
    padding: 1rem 2rem;
    border-bottom: 2px solid var(--border-color);
    box-shadow: var(--box-shadow);
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  .logo-section {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .logo {
    color: var(--accent-color);
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    .header {
      padding: 1rem;
    }

    .logo {
      font-size: 1.25rem;
    }
  }

  @media (max-width: 480px) {
    .header-content {
      gap: 1rem;
    }

    .logo-section {
      gap: 0.5rem;
    }

    .logo {
      font-size: 1.1rem;
    }
  }
</style>