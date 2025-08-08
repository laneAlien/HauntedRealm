export const STORAGE_KEYS = {
  USER_ID: "haunted_realm_user_id",
  WALLET_ADDRESS: "haunted_realm_wallet_address",
  THEME: "haunted_realm_theme",
  DECK_BUILDER_STATE: "haunted_realm_deck_builder",
} as const;

export const RARITY_COLORS = {
  Common: "from-gray-600 to-gray-800",
  Rare: "from-blue-600 to-blue-800", 
  Epic: "from-purple-600 to-purple-800",
  Legendary: "from-yellow-500 to-yellow-600",
} as const;

export const FACTION_ICONS = {
  "Shadow Realm": "fas fa-mask",
  "Moonlight Court": "fas fa-moon",
  "Ethereal Spirits": "fas fa-ghost",
} as const;

export const MANA_COLORS = {
  low: "bg-green-600", // 0-2 mana
  medium: "bg-blue-600", // 3-4 mana  
  high: "bg-purple-600", // 5-6 mana
  extreme: "bg-red-600", // 7+ mana
} as const;

export const API_ENDPOINTS = {
  USERS: "/api/users",
  NFTS: "/api/nfts", 
  DECKS: "/api/decks",
  EVENTS: "/api/events",
  TRANSACTIONS: "/api/transactions",
  LEADERBOARD: "/api/leaderboard",
  ANALYTICS: "/api/analytics",
  WALLET_CONNECT: "/api/wallet/connect",
} as const;

export const DECK_LIMITS = {
  MAX_CARDS: 30,
  MIN_CARDS: 15,
} as const;

export const EVENT_TYPES = {
  TOURNAMENT: "Tournament",
  CHALLENGE: "Challenge", 
  GATHERING: "Gathering",
} as const;

export const EVENT_STATUS = {
  ACTIVE: "Active",
  UPCOMING: "Upcoming", 
  ENDED: "Ended",
  SOON: "Soon",
} as const;

export const TRANSACTION_TYPES = {
  PURCHASE: "Purchase",
  SALE: "Sale",
  ENHANCEMENT: "Enhancement", 
  REWARD: "Reward",
} as const;

export const LEADERBOARD_PERIODS = {
  WEEKLY: "Weekly",
  MONTHLY: "Monthly", 
  ALL_TIME: "AllTime",
} as const;

// TON blockchain configuration (for future integration)
export const TON_CONFIG = {
  NETWORK: process.env.VITE_TON_NETWORK || "testnet",
  MANIFEST_URL: process.env.VITE_TON_MANIFEST_URL || "",
  // Add other TON-specific configuration as needed
} as const;

// Animation durations for consistent timing
export const ANIMATIONS = {
  FAST: "150ms",
  DEFAULT: "300ms", 
  SLOW: "500ms",
  PARTICLE_FLOAT: "8s",
  CARD_HOVER: "300ms",
} as const;

// Responsive breakpoints matching Tailwind
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;
