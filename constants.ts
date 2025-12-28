import { Prize, PrizeTier, PrizeType } from './types';

export const INITIAL_PRIZES: Prize[] = [
  {
    id: '1',
    name: '超级泰迪熊',
    image: '🧸',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Test model 1
    tier: PrizeTier.LEGENDARY,
    type: PrizeType.TOY,
    stock: 1,
    initialStock: 1,
    weight: 10,
    price: 100
  },
  {
    id: '2',
    name: '遥控赛车',
    image: '🏎️',
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb', // Test model 2
    tier: PrizeTier.EPIC,
    type: PrizeType.TOY,
    stock: 2,
    initialStock: 2,
    weight: 40,
    price: 50
  },
  {
    id: '3',
    name: '魔法棒',
    image: '🪄',
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb', // Test model 3
    tier: PrizeTier.EPIC,
    type: PrizeType.TOY,
    stock: 2,
    initialStock: 2,
    weight: 40,
    price: 45
  },
  {
    id: '4',
    name: '美味巧克力',
    image: '🍫',
    tier: PrizeTier.RARE,
    type: PrizeType.SNACK,
    stock: 8,
    initialStock: 8,
    weight: 100,
    price: 15
  },
  {
    id: '5',
    name: '免做家务券',
    image: '🎟️',
    tier: PrizeTier.FUN,
    type: PrizeType.COUPON,
    stock: 5,
    initialStock: 5,
    weight: 150,
    price: 0
  },
  {
    id: '6',
    name: '1元零花钱',
    image: '💰',
    tier: PrizeTier.FUN,
    type: PrizeType.MONEY,
    stock: 5,
    initialStock: 5,
    weight: 150,
    price: 1
  },
  {
    id: '7',
    name: '奖励星星',
    image: '⭐',
    tier: PrizeTier.FUN,
    type: PrizeType.COUPON,
    stock: 10,
    initialStock: 10,
    weight: 150,
    price: 0
  },
  {
    id: '8',
    name: '酷炫贴纸',
    image: '🏷️',
    tier: PrizeTier.COMMON,
    type: PrizeType.STATIONERY,
    stock: 20,
    initialStock: 20,
    weight: 300,
    price: 2
  },
  {
    id: '9',
    name: '泡泡糖',
    image: '🍬',
    tier: PrizeTier.COMMON,
    type: PrizeType.SNACK,
    stock: 30,
    initialStock: 30,
    weight: 300,
    price: 1
  },
];