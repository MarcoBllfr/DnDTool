<script lang="ts">
    import Icon from "@iconify/svelte";
    
    let { IsRendered = $bindable("")} = $props();

    function changeChoice(newChoice: string) {
        IsRendered = newChoice;
    }

  
    const sections = {
        home: {
            label: "Home",
            icon: "mdi:castle",
            description: "Main Hall"
        },
        CalcTool: {
            label: "Encounter Calculator",
            icon: "mdi:calculator-variant",
            description: "Battle Planner"
        },
        MonstersGrimoire: {
            label: "Monster Grimoire",
            icon: "mdi:book-open-variant",
            description: "Bestiary"
        }
    };

   
    function getAvailableSections() {
        return Object.entries(sections).filter(([key]) => key !== IsRendered);
    }
</script>

<nav class="dnd-navbar">
  
    <div class="navbar-border-top"></div>
    
    <div class="navbar-content">
        
        <div class="current-section">
            <div class="current-section-icon">
                <Icon icon={sections[IsRendered]?.icon || "mdi:help-circle"} width="32" />
            </div>
            <div class="current-section-info">
                <h2 class="current-title">{sections[IsRendered]?.label || "Unknown"}</h2>
                <p class="current-description">{sections[IsRendered]?.description || ""}</p>
            </div>
        </div>

        <div class="navbar-separator">
            <Icon icon="mdi:sword" width="24" />
        </div>

        <div class="navigation-buttons">
            {#each getAvailableSections() as [key, section]}
                <button 
                    class="nav-button"
                    onclick={() => changeChoice(key)}
                    title="Go to {section.label}"
                >
                    <div class="nav-button-icon">
                        <Icon icon={section.icon} width="20" />
                    </div>
                    <div class="nav-button-content">
                        <span class="nav-button-label">{section.label}</span>
                        <span class="nav-button-description">{section.description}</span>
                    </div>
                    <div class="nav-button-arrow">
                        <Icon icon="mdi:chevron-right" width="16" />
                    </div>
                </button>
            {/each}
        </div>
    </div>

    <div class="navbar-border-bottom"></div>
</nav>

<style>
    .dnd-navbar {
        background-color: var(--background-color);
        position: relative;
        box-shadow: var(--box-shadow);
        margin-bottom: 2rem;
    }

    .navbar-border-top,
    .navbar-border-bottom {
        height: 4px;
        background: linear-gradient(90deg, 
            transparent 0%,
            var(--border-color) 10%,
            #d4af37 30%,
            #ffd700 50%,
            #d4af37 70%,
            var(--border-color) 90%,
            transparent 100%
        );
        position: relative;
    }

    .navbar-border-top::after,
    .navbar-border-bottom::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, 
            transparent 0%,
            rgba(212, 175, 55, 0.3) 25%,
            rgba(255, 215, 0, 0.5) 50%,
            rgba(212, 175, 55, 0.3) 75%,
            transparent 100%
        );
        animation: golden-shimmer 3s ease-in-out infinite;
    }

    @keyframes golden-shimmer {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.8; }
    }

    .navbar-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.5rem 2rem;
        gap: 2rem;
        position: relative;
    }

    .current-section {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex: 0 0 auto;
    }

    .current-section-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        background: var(--accent-color); 
        border: 2px solid var(--border-color);
        border-radius: 50%;
        color: var(--button-text-color);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

   
    .current-section-info {
        display: flex;
        flex-direction: column;
    }

    .current-title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--accent-color);
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    }

    .current-description {
        margin: 0;
        font-size: 0.9rem;
        color: var(--secondary-text-color);
        font-style: italic;
    }

    .navbar-separator {
        display: flex;
        align-items: center;
        color: var(--border-color);
        opacity: 0.6;
        transform: rotate(45deg);
    }

    .navigation-buttons {
        display: flex;
        gap: 1rem;
        flex: 1;
        justify-content: flex-end;
    }

    .nav-button {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1.25rem;
        background: linear-gradient(135deg, var(--card-bg-color), rgba(var(--border-color), 0.1));
        border: 2px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-color);
        font-family: inherit;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        min-width: 180px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    .nav-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(var(--border-color), 0.2) 50%, 
            transparent 100%
        );
        transition: left 0.5s ease;
    }

    .nav-button:hover::before {
        left: 100%;
    }

    .nav-button:hover {
        transform: translateY(-2px) scale(1.02);
        border-color: var(--accent-color);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        background: linear-gradient(135deg, var(--hover-color), rgba(var(--accent-color), 0.1));
    }

    .nav-button:active {
        transform: translateY(0) scale(0.98);
    }

    .nav-button-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: var(--accent-color);
        border-radius: 6px;
        color: var(--button-text-color);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
    }

    
  

    
    .nav-button:hover .nav-button-icon {
        transform: scale(1.1);
        border: 2px solid var(--accent-color);
    }


    :not(.dark-mode) .nav-button:hover .nav-button-icon {
        background: var(--button-hover-bg);
    }


    .nav-button-content {
        display: flex;
        flex-direction: column;
        flex: 1;
        text-align: left;
    }

    .nav-button-label {
        font-weight: 600;
        font-size: 0.95rem;
        color: var(--text-color);
    }

    .nav-button-description {
        font-size: 0.8rem;
        color: var(--secondary-text-color);
        font-style: italic;
    }

    .nav-button-arrow {
        display: flex;
        align-items: center;
        color: var(--secondary-text-color);
        transition: all 0.3s ease;
    }

    .nav-button:hover .nav-button-arrow {
        color: var(--accent-color);
        transform: translateX(4px);
    }


    @media (max-width: 1024px) {
        .navbar-content {
            flex-direction: column;
            gap: 1.5rem;
            padding: 1.25rem 1rem;
        }

        .navigation-buttons {
            justify-content: center;
            flex-wrap: wrap;
        }

        .nav-button {
            min-width: 160px;
        }

        .navbar-separator {
            transform: rotate(0deg);
            order: 1;
        }

        .current-section {
            order: 0;
        }

        .navigation-buttons {
            order: 2;
        }
    }

    @media (max-width: 768px) {
        .navbar-content {
            padding: 1rem 0.75rem;
        }

        .current-section {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
        }

        .current-section-icon {
            width: 50px;
            height: 50px;
        }

        .current-title {
            font-size: 1.25rem;
        }

        .nav-button {
            min-width: 140px;
            padding: 0.6rem 1rem;
        }

        .nav-button-content {
            gap: 0.25rem;
        }

        .navigation-buttons {
            gap: 0.75rem;
        }
    }

    @media (max-width: 480px) {
        .navigation-buttons {
            flex-direction: column;
            width: 100%;
        }

        .nav-button {
            min-width: 100%;
        }
    }
</style>