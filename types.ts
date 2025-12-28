export enum PrizeTier {
  LEGENDARY = 'LEGENDARY', // 1% chance weight
  EPIC = 'EPIC',           // 10% chance weight
  RARE = 'RARE',           // 20% chance weight
  FUN = 'FUN',             // 30% chance weight
  COMMON = 'COMMON'        // 39% chance weight
}

export enum PrizeType {
  TOY = 'TOY',
  SNACK = 'SNACK',
  COUPON = 'COUPON',
  STATIONERY = 'STATIONERY',
  MONEY = 'MONEY'
}

export interface Prize {
  id: string;
  name: string;
  image: string; // Emoji or URL
  modelUrl?: string; // Optional 3D GLB model URL
  tier: PrizeTier;
  type: PrizeType;
  stock: number;
  initialStock: number;
  weight: number; 
  price: number;
}

export interface WonPrize {
  id: string;
  prizeId: string;
  name: string;
  image: string;
  modelUrl?: string; // Persist 3D info in history
  tier: PrizeTier;
  wonAt: number;
  price: number;
}

export const TIER_COLORS = {
  [PrizeTier.LEGENDARY]: 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 border-yellow-700 text-yellow-950',
  [PrizeTier.EPIC]: 'bg-gradient-to-br from-purple-300 via-purple-500 to-purple-600 border-purple-700 text-white',
  [PrizeTier.RARE]: 'bg-gradient-to-br from-blue-300 via-blue-500 to-blue-600 border-blue-700 text-white',
  [PrizeTier.FUN]: 'bg-gradient-to-br from-green-300 via-green-500 to-green-600 border-green-700 text-white',
  [PrizeTier.COMMON]: 'bg-white border-slate-300 text-slate-700 shadow-sm',
};