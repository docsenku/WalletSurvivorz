"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sun,
  Moon,
  Users,
  Shield,
  Wallet,
  Play,
  Pause,
  Settings,
  TreePine,
  Wrench,
  Apple,
  Heart,
  Zap,
  User,
  Sword,
  Hammer,
  Search,
  Plus,
  Home,
  Target,
  Package,
  Copy,
  RefreshCw,
  Coins,
  TrendingUp,
  Gift,
  ExternalLink,
} from "lucide-react"

// ===== TYPES =====
interface Survivor {
  id: string
  name: string
  level: number
  health: number
  maxHealth: number
  attack: number
  defense: number
  specialty: "builder" | "fighter" | "scavenger" | "medic"
  isActive: boolean
}

interface BaseStructure {
  id: string
  type: "wall" | "turret" | "generator" | "medical" | "storage"
  level: number
  health: number
  maxHealth: number
  position: { x: number; y: number }
  isActive: boolean
}

interface Resources {
  wood: number
  metal: number
  food: number
  medicine: number
  ammunition: number
}

interface WalletData {
  address: string
  balance: string
  tokenBalance: number
  isConnected: boolean
}

interface GameState {
  isDay: boolean
  dayCount: number
  timeRemaining: number
  isIdle: boolean
  baseHealth: number
  maxBaseHealth: number
  survivors: Survivor[]
  structures: BaseStructure[]
  resources: Resources
  wallet: WalletData
}

// ===== RESOURCE PANEL COMPONENT =====
function ResourcePanel({ resources }: { resources: Resources }) {
  const resourceItems = [
    { key: "wood", icon: TreePine, color: "text-amber-400", value: resources.wood },
    { key: "metal", icon: Wrench, color: "text-slate-400", value: resources.metal },
    { key: "food", icon: Apple, color: "text-green-400", value: resources.food },
    { key: "medicine", icon: Heart, color: "text-red-400", value: resources.medicine },
    { key: "ammunition", icon: Zap, color: "text-yellow-400", value: resources.ammunition },
  ]

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-3">
        <div className="grid grid-cols-5 gap-2">
          {resourceItems.map(({ key, icon: Icon, color, value }) => (
            <div key={key} className="text-center">
              <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
              <div className="text-xs font-medium text-white">{value}</div>
              <div className="text-xs text-slate-400 capitalize">{key}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ===== WALLET INTEGRATION COMPONENT =====
function WalletIntegration({ wallet }: { wallet: WalletData }) {
  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address)
  }

  return (
    <div className="space-y-4">
      {/* Wallet Status */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-white">
            <Wallet className="w-4 h-4" />
            Wallet Status
            <Badge variant={wallet.isConnected ? "default" : "destructive"} className="ml-auto">
              {wallet.isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Address</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-mono text-white">
                {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
              </span>
              <Button size="sm" variant="ghost" onClick={copyAddress} className="h-6 w-6 p-0">
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">ETH Balance</span>
            <span className="text-sm font-medium text-white">{wallet.balance} ETH</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">MINT Tokens</span>
            <span className="text-sm font-medium text-green-400">{wallet.tokenBalance.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Game Rewards */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-white">
            <Gift className="w-4 h-4" />
            Game Rewards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Today's Earnings</span>
            <span className="text-sm font-medium text-green-400">+125 MINT</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Survival Streak</span>
            <span className="text-sm font-medium text-white">7 days</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Next Reward</span>
            <span className="text-xs text-slate-400">2h 15m</span>
          </div>

          <Button size="sm" className="w-full mt-3 bg-green-600 hover:bg-green-700">
            <Coins className="w-3 h-3 mr-1" />
            Claim Daily Bonus
          </Button>
        </CardContent>
      </Card>

      {/* Trading & Marketplace */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-white">
            <TrendingUp className="w-4 h-4" />
            Trading & Marketplace
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button size="sm" variant="outline" className="w-full justify-between">
            Buy Upgrades
            <ExternalLink className="w-3 h-3" />
          </Button>

          <Button size="sm" variant="outline" className="w-full justify-between">
            Sell Resources
            <ExternalLink className="w-3 h-3" />
          </Button>

          <Button size="sm" variant="outline" className="w-full justify-between">
            NFT Survivors
            <ExternalLink className="w-3 h-3" />
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-white">
            <RefreshCw className="w-4 h-4" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button size="sm" variant="outline" className="w-full">
            Sync Game Data
          </Button>

          <Button size="sm" variant="outline" className="w-full">
            Backup Progress
          </Button>

          <Button size="sm" variant="outline" className="w-full">
            View Transactions
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// ===== SURVIVOR PANEL COMPONENT =====
function SurvivorPanel({ survivors }: { survivors: Survivor[] }) {
  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty) {
      case "fighter":
        return Sword
      case "builder":
        return Hammer
      case "scavenger":
        return Search
      case "medic":
        return Heart
      default:
        return User
    }
  }

  const getSpecialtyColor = (specialty: string) => {
    switch (specialty) {
      case "fighter":
        return "text-red-400"
      case "builder":
        return "text-blue-400"
      case "scavenger":
        return "text-green-400"
      case "medic":
        return "text-pink-400"
      default:
        return "text-slate-400"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">Active Survivors</h3>
        <Button size="sm" variant="outline" className="text-xs">
          <Plus className="w-3 h-3 mr-1" />
          Recruit
        </Button>
      </div>

      {survivors.map((survivor) => {
        const SpecialtyIcon = getSpecialtyIcon(survivor.specialty)
        const specialtyColor = getSpecialtyColor(survivor.specialty)

        return (
          <Card key={survivor.id} className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <SpecialtyIcon className={`w-4 h-4 ${specialtyColor}`} />
                  {survivor.name}
                  <Badge variant="secondary" className="text-xs">
                    Lv.{survivor.level}
                  </Badge>
                </CardTitle>
                <Badge variant={survivor.isActive ? "default" : "secondary"}>
                  {survivor.isActive ? "Active" : "Resting"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Health Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Health</span>
                  <span className="text-white">
                    {survivor.health}/{survivor.maxHealth}
                  </span>
                </div>
                <Progress value={(survivor.health / survivor.maxHealth) * 100} className="h-1" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Sword className="w-3 h-3" />
                    Attack
                  </span>
                  <span className="text-white font-medium">{survivor.attack}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Defense
                  </span>
                  <span className="text-white font-medium">{survivor.defense}</span>
                </div>
              </div>

              {/* Specialty */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Specialty</span>
                <span className={`capitalize font-medium ${specialtyColor}`}>{survivor.specialty}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1 text-xs">
                  {survivor.isActive ? "Rest" : "Activate"}
                </Button>
                <Button size="sm" variant="outline" className="flex-1 text-xs">
                  Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// ===== BASE BUILDER COMPONENT =====
function BaseBuilder({
  structures,
  resources,
  isDay,
}: {
  structures: BaseStructure[]
  resources: Resources
  isDay: boolean
}) {
  const getStructureIcon = (type: string) => {
    switch (type) {
      case "wall":
        return Shield
      case "turret":
        return Target
      case "generator":
        return Zap
      case "medical":
        return Home
      case "storage":
        return Package
      default:
        return Home
    }
  }

  const getStructureColor = (type: string) => {
    switch (type) {
      case "wall":
        return "text-blue-400"
      case "turret":
        return "text-red-400"
      case "generator":
        return "text-yellow-400"
      case "medical":
        return "text-green-400"
      case "storage":
        return "text-purple-400"
      default:
        return "text-slate-400"
    }
  }

  const buildableStructures = [
    { type: "wall", name: "Wall", cost: { wood: 50, metal: 20 } },
    { type: "turret", name: "Turret", cost: { metal: 75, ammunition: 25 } },
    { type: "generator", name: "Generator", cost: { metal: 100, wood: 30 } },
    { type: "medical", name: "Medical Bay", cost: { wood: 80, medicine: 15 } },
    { type: "storage", name: "Storage", cost: { wood: 60, metal: 40 } },
  ]

  return (
    <div className="space-y-4">
      {/* Current Structures */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Base Structures</h3>
        <div className="space-y-2">
          {structures.map((structure) => {
            const StructureIcon = getStructureIcon(structure.type)
            const structureColor = getStructureColor(structure.type)

            return (
              <Card key={structure.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StructureIcon className={`w-4 h-4 ${structureColor}`} />
                      <span className="text-sm text-white capitalize">{structure.type}</span>
                      <Badge variant="secondary" className="text-xs">
                        Lv.{structure.level}
                      </Badge>
                    </div>
                    <Badge variant={structure.isActive ? "default" : "destructive"}>
                      {structure.isActive ? "Active" : "Damaged"}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Health</span>
                      <span className="text-white">
                        {structure.health}/{structure.maxHealth}
                      </span>
                    </div>
                    <Progress value={(structure.health / structure.maxHealth) * 100} className="h-1" />
                  </div>

                  {isDay && (
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" className="flex-1 text-xs">
                        <Hammer className="w-3 h-3 mr-1" />
                        Repair
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs">
                        Upgrade
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Build New Structures */}
      {isDay && (
        <div>
          <h3 className="text-sm font-medium text-white mb-3">Build New</h3>
          <div className="grid grid-cols-1 gap-2">
            {buildableStructures.map((buildable) => {
              const StructureIcon = getStructureIcon(buildable.type)
              const structureColor = getStructureColor(buildable.type)
              const canAfford = Object.entries(buildable.cost).every(
                ([resource, cost]) => resources[resource as keyof Resources] >= cost,
              )

              return (
                <Card key={buildable.type} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StructureIcon className={`w-4 h-4 ${structureColor}`} />
                        <span className="text-sm text-white">{buildable.name}</span>
                      </div>
                      <Button size="sm" disabled={!canAfford} className="text-xs">
                        <Plus className="w-3 h-3 mr-1" />
                        Build
                      </Button>
                    </div>

                    <div className="flex gap-2 mt-2 text-xs">
                      {Object.entries(buildable.cost).map(([resource, cost]) => (
                        <span
                          key={resource}
                          className={`${
                            resources[resource as keyof Resources] >= cost ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {cost} {resource}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {!isDay && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-slate-400 text-sm">🌙 Night Phase - Building Disabled</div>
            <div className="text-xs text-slate-500 mt-1">Your survivors are defending the base</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ===== MAIN BROWSER EXTENSION COMPONENT =====
export default function BrowserExtension() {
  const [gameState, setGameState] = useState<GameState>({
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
  })

  const [activeTab, setActiveTab] = useState<"base" | "survivors" | "wallet">("base")

  useEffect(() => {
    const timer = setInterval(() => {
      setGameState((prev) => ({
        ...prev,
        timeRemaining: prev.timeRemaining > 0 ? prev.timeRemaining - 1 : 300,
      }))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const toggleIdle = () => {
    setGameState((prev) => ({ ...prev, isIdle: !prev.isIdle }))
  }

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-b from-slate-900 to-slate-800 text-white min-h-screen">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-green-400">SettleMints</h1>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={gameState.isIdle ? "default" : "outline"}
              onClick={toggleIdle}
              className="text-xs"
            >
              {gameState.isIdle ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {gameState.isIdle ? "Active" : "Idle"}
            </Button>
            <Button size="sm" variant="ghost">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Day/Night Cycle */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {gameState.isDay ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-400" />}
            <span className="text-sm font-medium">
              Day {gameState.dayCount} - {gameState.isDay ? "Building Phase" : "Survival Phase"}
            </span>
          </div>
          <Badge variant={gameState.isDay ? "default" : "destructive"}>{formatTime(gameState.timeRemaining)}</Badge>
        </div>

        {/* Base Health */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Base Health
            </span>
            <span>
              {gameState.baseHealth}/{gameState.maxBaseHealth}
            </span>
          </div>
          <Progress value={(gameState.baseHealth / gameState.maxBaseHealth) * 100} className="h-2" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-700">
        {[
          { id: "base", label: "Base", icon: Shield },
          { id: "survivors", label: "Survivors", icon: Users },
          { id: "wallet", label: "Wallet", icon: Wallet },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex-1 flex items-center justify-center gap-1 py-3 text-xs font-medium transition-colors ${
              activeTab === id ? "text-green-400 border-b-2 border-green-400" : "text-slate-400 hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "base" && (
          <div className="p-4 space-y-4">
            <ResourcePanel resources={gameState.resources} />
            <BaseBuilder structures={gameState.structures} resources={gameState.resources} isDay={gameState.isDay} />
          </div>
        )}

        {activeTab === "survivors" && (
          <div className="p-4">
            <SurvivorPanel survivors={gameState.survivors} />
          </div>
        )}

        {activeTab === "wallet" && (
          <div className="p-4">
            <WalletIntegration wallet={gameState.wallet} />
          </div>
        )}
      </div>
    </div>
  )
}
