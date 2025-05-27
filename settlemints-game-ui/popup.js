// SettleMints Browser Extension - Popup Script

const chrome = window.chrome // Declare the chrome variable

class SettleMintsGame {
  constructor() {
    this.gameState = {
      isDay: true,
      dayCount: 15,
      timeRemaining: 180,
      isIdle: false,
      baseHealth: 850,
      maxBaseHealth: 1000,
      survivors: [
        {
          id: "1",
          name: "Alex",
          level: 3,
          health: 80,
          maxHealth: 100,
          attack: 25,
          defense: 15,
          specialty: "fighter",
          isActive: true,
        },
        {
          id: "2",
          name: "Maya",
          level: 2,
          health: 90,
          maxHealth: 90,
          attack: 15,
          defense: 20,
          specialty: "builder",
          isActive: true,
        },
        {
          id: "3",
          name: "Zoe",
          level: 4,
          health: 70,
          maxHealth: 110,
          attack: 30,
          defense: 12,
          specialty: "scavenger",
          isActive: false,
        },
      ],
      structures: [
        {
          id: "1",
          type: "wall",
          level: 2,
          health: 200,
          maxHealth: 250,
          position: { x: 0, y: 0 },
          isActive: true,
        },
        {
          id: "2",
          type: "turret",
          level: 1,
          health: 100,
          maxHealth: 100,
          position: { x: 1, y: 1 },
          isActive: true,
        },
      ],
      resources: {
        wood: 245,
        metal: 89,
        food: 156,
        medicine: 23,
        ammunition: 78,
      },
      wallet: {
        address: "0x742d35Cc6634C0532925a3b8D4C9db96590b5",
        balance: "2.45",
        tokenBalance: 1250,
        isConnected: true,
      },
    }

    this.activeTab = "base"
    this.init()
  }

  async init() {
    // Load saved game state
    await this.loadGameState()

    // Start game timer
    this.startGameTimer()

    // Render the game
    this.render()

    // Hide loading screen
    document.getElementById("loading").style.display = "none"
    document.getElementById("game-container").style.display = "block"
  }

  async loadGameState() {
    try {
      const result = await chrome.storage.local.get(["settlemints_gamestate"])
      if (result.settlemints_gamestate) {
        this.gameState = { ...this.gameState, ...result.settlemints_gamestate }
      }
    } catch (error) {
      console.log("No saved game state found, using defaults")
    }
  }

  async saveGameState() {
    try {
      await chrome.storage.local.set({ settlemints_gamestate: this.gameState })
    } catch (error) {
      console.error("Failed to save game state:", error)
    }
  }

  startGameTimer() {
    setInterval(() => {
      this.gameState.timeRemaining = this.gameState.timeRemaining > 0 ? this.gameState.timeRemaining - 1 : 300

      if (this.gameState.timeRemaining === 0) {
        this.gameState.isDay = !this.gameState.isDay
        if (this.gameState.isDay) {
          this.gameState.dayCount++
        }
      }

      this.updateTimer()
      this.saveGameState()
    }, 1000)
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  updateTimer() {
    const timerElement = document.getElementById("timer")
    if (timerElement) {
      timerElement.textContent = this.formatTime(this.gameState.timeRemaining)
    }

    const phaseElement = document.getElementById("phase")
    if (phaseElement) {
      phaseElement.textContent = this.gameState.isDay ? "Building Phase" : "Survival Phase"
    }
  }

  toggleIdle() {
    this.gameState.isIdle = !this.gameState.isIdle
    this.render()
    this.saveGameState()
  }

  switchTab(tab) {
    this.activeTab = tab
    this.render()
  }

  render() {
    const container = document.getElementById("game-container")
    container.innerHTML = `
            <div style="padding: 16px; border-bottom: 1px solid #374151;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h1 style="margin: 0; color: #10b981; font-size: 20px; font-weight: bold;">SettleMints</h1>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn ${this.gameState.isIdle ? "btn-primary" : ""}" onclick="game.toggleIdle()">
                            ${this.gameState.isIdle ? "⏸️ Active" : "▶️ Idle"}
                        </button>
                        <button class="btn">⚙️</button>
                    </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 20px;">${this.gameState.isDay ? "☀️" : "🌙"}</span>
                        <span style="font-size: 14px;">Day ${this.gameState.dayCount} - <span id="phase">${this.gameState.isDay ? "Building Phase" : "Survival Phase"}</span></span>
                    </div>
                    <span class="badge ${this.gameState.isDay ? "badge-success" : "badge-danger"}" id="timer">${this.formatTime(this.gameState.timeRemaining)}</span>
                </div>
                
                <div style="margin-bottom: 8px;">
                    <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                        <span>🛡️ Base Health</span>
                        <span>${this.gameState.baseHealth}/${this.gameState.maxBaseHealth}</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar" style="width: ${(this.gameState.baseHealth / this.gameState.maxBaseHealth) * 100}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="tabs">
                <button class="tab ${this.activeTab === "base" ? "active" : ""}" onclick="game.switchTab('base')">
                    🛡️ Base
                </button>
                <button class="tab ${this.activeTab === "survivors" ? "active" : ""}" onclick="game.switchTab('survivors')">
                    👥 Survivors
                </button>
                <button class="tab ${this.activeTab === "wallet" ? "active" : ""}" onclick="game.switchTab('wallet')">
                    💰 Wallet
                </button>
            </div>
            
            <div style="padding: 16px; height: 400px; overflow-y: auto;">
                ${this.renderTabContent()}
            </div>
        `
  }

  renderTabContent() {
    switch (this.activeTab) {
      case "base":
        return this.renderBaseTab()
      case "survivors":
        return this.renderSurvivorsTab()
      case "wallet":
        return this.renderWalletTab()
      default:
        return ""
    }
  }

  renderBaseTab() {
    return `
            <div class="card">
                <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; text-align: center;">
                    <div>
                        <div style="font-size: 16px; margin-bottom: 4px;">🌲</div>
                        <div style="font-size: 12px; font-weight: bold;">${this.gameState.resources.wood}</div>
                        <div style="font-size: 10px; color: #9ca3af;">Wood</div>
                    </div>
                    <div>
                        <div style="font-size: 16px; margin-bottom: 4px;">🔧</div>
                        <div style="font-size: 12px; font-weight: bold;">${this.gameState.resources.metal}</div>
                        <div style="font-size: 10px; color: #9ca3af;">Metal</div>
                    </div>
                    <div>
                        <div style="font-size: 16px; margin-bottom: 4px;">🍎</div>
                        <div style="font-size: 12px; font-weight: bold;">${this.gameState.resources.food}</div>
                        <div style="font-size: 10px; color: #9ca3af;">Food</div>
                    </div>
                    <div>
                        <div style="font-size: 16px; margin-bottom: 4px;">❤️</div>
                        <div style="font-size: 12px; font-weight: bold;">${this.gameState.resources.medicine}</div>
                        <div style="font-size: 10px; color: #9ca3af;">Medicine</div>
                    </div>
                    <div>
                        <div style="font-size: 16px; margin-bottom: 4px;">⚡</div>
                        <div style="font-size: 12px; font-weight: bold;">${this.gameState.resources.ammunition}</div>
                        <div style="font-size: 10px; color: #9ca3af;">Ammo</div>
                    </div>
                </div>
            </div>
            
            <h3 style="margin: 16px 0 8px 0; font-size: 14px;">Base Structures</h3>
            ${this.gameState.structures
              .map(
                (structure) => `
                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span>${this.getStructureIcon(structure.type)}</span>
                            <span style="text-transform: capitalize;">${structure.type}</span>
                            <span class="badge">Lv.${structure.level}</span>
                        </div>
                        <span class="badge ${structure.isActive ? "badge-success" : "badge-danger"}">
                            ${structure.isActive ? "Active" : "Damaged"}
                        </span>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                            <span>Health</span>
                            <span>${structure.health}/${structure.maxHealth}</span>
                        </div>
                        <div class="progress">
                            <div class="progress-bar" style="width: ${(structure.health / structure.maxHealth) * 100}%"></div>
                        </div>
                    </div>
                    ${
                      this.gameState.isDay
                        ? `
                        <div style="display: flex; gap: 8px;">
                            <button class="btn" style="flex: 1;">🔨 Repair</button>
                            <button class="btn" style="flex: 1;">⬆️ Upgrade</button>
                        </div>
                    `
                        : ""
                    }
                </div>
            `,
              )
              .join("")}
        `
  }

  renderSurvivorsTab() {
    return `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h3 style="margin: 0; font-size: 14px;">Active Survivors</h3>
                <button class="btn">➕ Recruit</button>
            </div>
            
            ${this.gameState.survivors
              .map(
                (survivor) => `
                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span>${this.getSpecialtyIcon(survivor.specialty)}</span>
                            <span>${survivor.name}</span>
                            <span class="badge">Lv.${survivor.level}</span>
                        </div>
                        <span class="badge ${survivor.isActive ? "badge-success" : ""}">
                            ${survivor.isActive ? "Active" : "Resting"}
                        </span>
                    </div>
                    
                    <div style="margin-bottom: 8px;">
                        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                            <span>Health</span>
                            <span>${survivor.health}/${survivor.maxHealth}</span>
                        </div>
                        <div class="progress">
                            <div class="progress-bar" style="width: ${(survivor.health / survivor.maxHealth) * 100}%"></div>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px; margin-bottom: 8px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span>⚔️ Attack</span>
                            <span>${survivor.attack}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>🛡️ Defense</span>
                            <span>${survivor.defense}</span>
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
                        <span>Specialty</span>
                        <span style="text-transform: capitalize; color: #10b981;">${survivor.specialty}</span>
                    </div>
                    
                    <div style="display: flex; gap: 8px;">
                        <button class="btn" style="flex: 1;">${survivor.isActive ? "Rest" : "Activate"}</button>
                        <button class="btn" style="flex: 1;">⬆️ Upgrade</button>
                    </div>
                </div>
            `,
              )
              .join("")}
        `
  }

  renderWalletTab() {
    return `
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span>💰</span>
                        <span style="font-size: 14px; font-weight: bold;">Wallet Status</span>
                    </div>
                    <span class="badge ${this.gameState.wallet.isConnected ? "badge-success" : "badge-danger"}">
                        ${this.gameState.wallet.isConnected ? "Connected" : "Disconnected"}
                    </span>
                </div>
                
                <div style="space-y: 8px;">
                    <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
                        <span style="color: #9ca3af;">Address</span>
                        <span style="font-family: monospace;">${this.gameState.wallet.address.slice(0, 6)}...${this.gameState.wallet.address.slice(-4)}</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
                        <span style="color: #9ca3af;">ETH Balance</span>
                        <span>${this.gameState.wallet.balance} ETH</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; font-size: 12px;">
                        <span style="color: #9ca3af;">MINT Tokens</span>
                        <span style="color: #10b981;">${this.gameState.wallet.tokenBalance.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                    <span>🎁</span>
                    <span style="font-size: 14px; font-weight: bold;">Game Rewards</span>
                </div>
                
                <div style="space-y: 8px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
                        <span style="color: #9ca3af;">Today's Earnings</span>
                        <span style="color: #10b981;">+125 MINT</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
                        <span style="color: #9ca3af;">Survival Streak</span>
                        <span>7 days</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; font-size: 12px;">
                        <span style="color: #9ca3af;">Next Reward</span>
                        <span style="color: #9ca3af;">2h 15m</span>
                    </div>
                </div>
                
                <button class="btn btn-primary" style="width: 100%;">🪙 Claim Daily Bonus</button>
            </div>
            
            <div class="card">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                    <span>📈</span>
                    <span style="font-size: 14px; font-weight: bold;">Trading & Marketplace</span>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <button class="btn" style="width: 100%;">Buy Upgrades 🔗</button>
                    <button class="btn" style="width: 100%;">Sell Resources 🔗</button>
                    <button class="btn" style="width: 100%;">NFT Survivors 🔗</button>
                </div>
            </div>
        `
  }

  getStructureIcon(type) {
    const icons = {
      wall: "🛡️",
      turret: "🎯",
      generator: "⚡",
      medical: "🏥",
      storage: "📦",
    }
    return icons[type] || "🏠"
  }

  getSpecialtyIcon(specialty) {
    const icons = {
      fighter: "⚔️",
      builder: "🔨",
      scavenger: "🔍",
      medic: "❤️",
    }
    return icons[specialty] || "👤"
  }
}

// Initialize the game when the popup loads
let game
document.addEventListener("DOMContentLoaded", () => {
  game = new SettleMintsGame()
})
