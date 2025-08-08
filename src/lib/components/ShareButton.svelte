<script lang="ts">
 import { buildCompactUrl } from '$lib/services/ShareService';
  import Icon from "@iconify/svelte";

  export let calcState: CalcState;
  
  let showCopied = false;

  function getCurrentUrl() {
  const base = `${window.location.origin}${window.location.pathname}`;
  return buildCompactUrl(base, calcState);
}
  function copyLink() {
    navigator.clipboard.writeText(getCurrentUrl());
    showCopied = true;
    setTimeout(() => {
      showCopied = false;
    }, 2000);
  }
</script>

<div class="share-container">
  <button onclick={copyLink} class="share-btn" aria-label="Share this configuration">
    <div class="share-btn-content">
      <Icon icon="mdi:share-variant" width="20" />
      <span class="share-btn-text">Share Configuration</span>
    </div>
    {#if showCopied}
      <div class="copied-indicator">
        <Icon icon="mdi:check" width="16" />
        <span>Copied!</span>
      </div>
    {/if}
  </button>
</div>

<style>
  .share-container {
    position: relative;
    display: flex;
    justify-content: center;
    margin: 1rem 0;
  }
  .share-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.875rem 1.5rem;
    background: var(--button-bg-color);
    color: var(--button-text-color);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: var(--box-shadow);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    min-width: 200px;
    overflow: hidden;
  }
  .share-btn:hover {
    background: var(--button-hover-bg);
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-hover);
    border-color: var(--accent-color);
  }
  .share-btn:active {
    transform: translateY(0);
  }
  .share-btn-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
  }
  .share-btn-text {
    font-weight: 600;
  }
  .copied-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: #22c55e; /* Verde success */
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
    white-space: nowrap;
    z-index: 10;
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
    animation: fadeInOut 2s ease-in-out;
  }
  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
    20% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    80% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
  }
  
  @media (max-width: 480px) {
    .share-btn {
      padding: 0.75rem 1.25rem;
      font-size: 0.9rem;
      min-width: 180px;
    }
    
    .share-btn-text {
      display: none;
    }
    
    .share-btn-content {
      gap: 0;
    }
    
    .share-btn-content::after {
      content: 'Share';
      margin-left: 0.5rem;
    }
  }
  @media (max-width: 320px) {
    .share-btn {
      padding: 0.625rem 1rem;
      font-size: 0.85rem;
      min-width: 120px;
    }
    
    .share-btn-content::after {
      display: none;
    }
  }

  .dark-mode .copied-indicator {
    background: #16a34a; 
    color: white;
    border: 1px solid #22c55e;
    box-shadow: 0 4px 12px rgba(22, 163, 74, 0.4);
  }
 
  .share-btn:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(139, 0, 0, 0.3);
  }
  .dark-mode .share-btn:focus {
    box-shadow: 0 0 0 3px rgba(248, 233, 192, 0.3);
  }
</style>