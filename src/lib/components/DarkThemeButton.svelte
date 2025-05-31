<script lang="ts">
  import { onMount } from "svelte";
  import Icon from "@iconify/svelte";

  let isDarkMode: boolean = $state(false); 

  onMount(() => {
    const savedTheme = localStorage.getItem("dnd-theme");

    if (savedTheme) {
      isDarkMode = savedTheme === "dark";
    } else {
      isDarkMode = false;
    }

    applyTheme(isDarkMode);

    // vedo le preferenze di sistema
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("dnd-theme")) {
          isDarkMode = e.matches;
          applyTheme(isDarkMode);
        }
      });
  });

  function toggleTheme() {
    isDarkMode = !isDarkMode;
    applyTheme(isDarkMode);
    localStorage.setItem("dnd-theme", isDarkMode ? "dark" : "light");
  }

  function applyTheme(dark: boolean) {
    if (dark) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }
</script>

<button
  class="theme-toggle"
  onclick={toggleTheme}
  aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
  title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
>
  {#if isDarkMode}
    <Icon icon="mdi:weather-sunny" width="20" />
    <span class="theme-text">Light</span>
  {:else}
    <Icon icon="mdi:weather-night" width="20" />
    <span class="theme-text">Dark</span>
  {/if}
</button>

<style>
  .theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    font-weight: bold;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: var(--button-bg-color);
    color: var(--button-text-color);
    border: 2px solid var(--border-color);
  }

  .theme-toggle:hover {
    background: var(--button-hover-bg);
    transform: translateY(-1px);
  }

  .theme-text {
    font-size: 0.85rem;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .theme-text {
      display: none;
    }
    
    .theme-toggle {
      padding: 0.5rem;
      gap: 0;
    }
  }
</style>