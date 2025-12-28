import { Prize } from '../types';

/**
 * Calculates the current winning probability for each prize based on STOCK * WEIGHT.
 * This simulates a physical machine: more items = higher chance to pick one of them.
 */
export const calculateProbability = (prizes: Prize[]): { prize: Prize; percent: number }[] => {
  // Include items with 0 stock in the list for visibility, but they have 0% chance
  const activePrizes = prizes; 
  
  // Total Weight = Sum of (Item Weight * Item Stock)
  const totalWeight = activePrizes.reduce((sum, p) => sum + (p.weight * p.stock), 0);

  if (totalWeight === 0) {
    return activePrizes.map(p => ({ prize: p, percent: 0 }));
  }

  return activePrizes.map(p => ({
    prize: p,
    percent: ((p.weight * p.stock) / totalWeight) * 100
  }));
};

/**
 * Performs a weighted random draw based on Stock * Weight.
 */
export const drawPrize = (prizes: Prize[]): Prize | null => {
  const availablePrizes = prizes.filter(p => p.stock > 0);
  
  if (availablePrizes.length === 0) return null;

  // Calculate total weight based on stock
  const totalWeight = availablePrizes.reduce((sum, p) => sum + (p.weight * p.stock), 0);
  let random = Math.random() * totalWeight;

  for (const prize of availablePrizes) {
    const itemWeight = prize.weight * prize.stock;
    if (random < itemWeight) {
      return prize;
    }
    random -= itemWeight;
  }

  return availablePrizes[availablePrizes.length - 1];
};