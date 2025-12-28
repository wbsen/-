import React, { useState, useEffect } from 'react';
import { INITIAL_PRIZES } from './constants';
import { Prize, WonPrize } from './types';
import { drawPrize } from './services/lotteryService';
import { Gachapon } from './components/Gachapon';
import { RouletteGame } from './components/RouletteGame';
import { SmashEggGame } from './components/SmashEggGame';
import { ScratchCardGame } from './components/ScratchCardGame';
import { PrizeRevealModal } from './components/PrizeRevealModal';
import { PrizeDetailModal } from './components/PrizeDetailModal';
import { ParentZone } from './components/ParentZone';
import { Collection } from './components/Collection';
import { Gift, Sparkles, Coins, PackageOpen, User, Globe, ShieldCheck, ChevronLeft, Disc, Zap, Hammer, Ticket } from 'lucide-react';
import { translations, Language } from './i18n';

const SPIN_COST = 1;

// Define Game Modes
type GameMode = 'menu' | 'gachapon' | 'roulette' | 'smashegg' | 'scratch';

export default function App() {
  // State
  const [prizes, setPrizes] = useState<Prize[]>(INITIAL_PRIZES);
  const [inventory, setInventory] = useState<WonPrize[]>([]);
  const [coins, setCoins] = useState<number>(0);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<'draw' | 'collection' | 'mine'>('draw');
  const [gameMode, setGameMode] = useState<GameMode>('menu'); // Sub-navigation for Draw tab
  
  const [showParentZone, setShowParentZone] = useState(false);
  const [justWon, setJustWon] = useState<Prize | null>(null);
  const [selectedPrize, setSelectedPrize] = useState<Prize | WonPrize | null>(null); // For detail modal
  const [language, setLanguage] = useState<Language>('zh-CN');

  // Translation Helper
  const t = (key: keyof typeof translations['en']) => {
    return translations[language][key] || translations['en'][key];
  };

  // Dynamic Header Title
  const getHeaderTitle = () => {
    switch(activeTab) {
      case 'draw': 
        if (gameMode === 'gachapon') return t('gameGachapon');
        if (gameMode === 'roulette') return t('gameRoulette');
        if (gameMode === 'smashegg') return t('gameSmashEgg');
        if (gameMode === 'scratch') return t('gameScratch');
        return t('headerPlay');
      case 'collection': return t('headerCollection');
      case 'mine': return t('headerMine');
      default: return t('appTitle');
    }
  };

  // Handle Game Back Button
  const handleBackToMenu = () => {
    setGameMode('menu');
  };

  // --- PERSISTENCE & MIGRATION LOGIC ---
  useEffect(() => {
    const savedPrizes = localStorage.getItem('lion_lottery_prizes');
    const savedInventory = localStorage.getItem('lion_lottery_inventory');
    const savedCoins = localStorage.getItem('lion_lottery_coins');
    const savedLang = localStorage.getItem('lion_lottery_language');

    // 1. Load Prizes with Migration (Ensure 'price' and 'initialStock' exist)
    if (savedPrizes) {
      try {
        const parsedPrizes = JSON.parse(savedPrizes);
        if (Array.isArray(parsedPrizes)) {
          const migratedPrizes = parsedPrizes.map((p: any) => ({
            ...p,
            // Migration: If price is missing, try to find it in INITIAL_PRIZES, else 0
            price: typeof p.price === 'number' ? p.price : (INITIAL_PRIZES.find(ip => ip.id === p.id)?.price || 0),
            // Migration: Ensure initialStock
            initialStock: typeof p.initialStock === 'number' ? p.initialStock : (p.stock || 0)
          }));
          setPrizes(migratedPrizes);
        }
      } catch (e) {
        console.error("Error loading prizes:", e);
      }
    }

    // 2. Load Inventory with Migration (Ensure 'price' snapshot exists)
    if (savedInventory) {
      try {
        const parsedInv = JSON.parse(savedInventory);
        if (Array.isArray(parsedInv)) {
          const migratedInv = parsedInv.map((item: any) => ({
            ...item,
            // Migration: If price missing in history, default to 0
            price: typeof item.price === 'number' ? item.price : 0
          }));
          setInventory(migratedInv);
        }
      } catch (e) {
        console.error("Error loading inventory:", e);
      }
    }

    if (savedCoins) setCoins(parseInt(savedCoins) || 0);
    
    if (savedLang && (['en', 'zh-CN', 'zh-TW'] as const).includes(savedLang as any)) {
      setLanguage(savedLang as Language);
    }
  }, []);

  // Save changes
  useEffect(() => {
    localStorage.setItem('lion_lottery_prizes', JSON.stringify(prizes));
    localStorage.setItem('lion_lottery_inventory', JSON.stringify(inventory));
    localStorage.setItem('lion_lottery_coins', JSON.stringify(coins.toString()));
    localStorage.setItem('lion_lottery_language', language);
  }, [prizes, inventory, coins, language]);

  // Core Game Logic (Shared)
  const handleSpin = (): Prize | null => {
    if (coins < SPIN_COST) return null;
    const wonItem = drawPrize(prizes);
    setCoins(prev => prev - SPIN_COST);

    if (wonItem) {
      const updatedPrizes = prizes.map(p => 
        p.id === wonItem.id ? { ...p, stock: p.stock - 1 } : p
      );
      setPrizes(updatedPrizes);

      const newEntry: WonPrize = {
        id: Date.now().toString(),
        prizeId: wonItem.id,
        name: wonItem.name,
        image: wonItem.image,
        tier: wonItem.tier,
        wonAt: Date.now(),
        price: wonItem.price // Record price at time of winning
      };
      setInventory([newEntry, ...inventory]);
      return wonItem;
    } else {
      alert(t('emptyAlert'));
      return null;
    }
  };

  const handleReveal = (prize: Prize) => {
    setJustWon(prize);
  };

  // Admin Handlers
  const handleAddPrize = (prize: Prize) => setPrizes([...prizes, prize]);
  
  const handleUpdateStock = (id: string, delta: number) => {
    setPrizes(prizes.map(p => {
      if (p.id !== id) return p;
      const newStock = Math.max(0, p.stock + delta);
      return { ...p, stock: newStock, initialStock: Math.max(p.initialStock, newStock) };
    }));
  };

  const handleUpdatePrize = (updatedPrize: Prize) => {
    setPrizes(prizes.map(p => p.id === updatedPrize.id ? updatedPrize : p));
  };

  const handleDeletePrize = (id: string) => {
    setPrizes(prizes.filter(p => p.id !== id));
  };

  // Safe Reset Handler (Soft Reset)
  const handleFactoryReset = () => {
      // 1. Remove specific keys to avoid clearing unrelated storage
      localStorage.removeItem('lion_lottery_prizes');
      localStorage.removeItem('lion_lottery_inventory');
      localStorage.removeItem('lion_lottery_coins');
      localStorage.removeItem('lion_lottery_language');
      
      // 2. Manually reset all state to initial values
      setPrizes(INITIAL_PRIZES);
      setInventory([]);
      setCoins(0);
      setLanguage('zh-CN');
      
      // 3. Close the Parent Zone and return to home menu
      setShowParentZone(false);
      setActiveTab('draw');
      setGameMode('menu');
      
      alert("Data has been reset successfully!");
  };

  // --- SUB-COMPONENT: GAME MENU ---
  const GameMenu = () => (
      <div className="p-4 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
          <div className="col-span-2 text-center mb-1">
              <h2 className="text-xl font-bold text-orange-900/60 uppercase tracking-widest text-xs">{t('gameMenuTitle')}</h2>
          </div>

          {/* Card 1: Gachapon */}
          <button 
            onClick={() => setGameMode('gachapon')}
            className="col-span-2 group relative h-32 rounded-3xl overflow-hidden shadow-lg transition-all hover:scale-[1.02] active:scale-95 bg-gradient-to-br from-orange-400 to-pink-500 text-white p-6 flex items-center justify-between"
          >
              <div className="relative z-10 text-left">
                  <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-2 backdrop-blur-sm">
                     <Zap className="w-6 h-6 text-yellow-200 fill-yellow-200" />
                  </div>
                  <h3 className="font-black text-xl leading-none mb-1">{t('gameGachapon')}</h3>
                  <p className="text-orange-100 text-[10px] font-bold opacity-80">{t('gameGachaponDesc')}</p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
              <div className="text-5xl filter drop-shadow-lg transform group-hover:rotate-12 transition-transform">💊</div>
          </button>

          {/* Card 2: Roulette */}
          <button 
            onClick={() => setGameMode('roulette')}
            className="col-span-2 group relative h-32 rounded-3xl overflow-hidden shadow-lg transition-all hover:scale-[1.02] active:scale-95 bg-gradient-to-br from-indigo-500 to-cyan-500 text-white p-6 flex items-center justify-between"
          >
              <div className="relative z-10 text-left">
                  <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-2 backdrop-blur-sm">
                     <Disc className="w-6 h-6 text-cyan-200 animate-spin-slow" />
                  </div>
                  <h3 className="font-black text-xl leading-none mb-1">{t('gameRoulette')}</h3>
                  <p className="text-indigo-100 text-[10px] font-bold opacity-80">{t('gameRouletteDesc')}</p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
              <div className="text-5xl filter drop-shadow-lg transform group-hover:-rotate-12 transition-transform">🎡</div>
          </button>

          {/* Card 3: Smash Egg */}
          <button 
            onClick={() => setGameMode('smashegg')}
            className="group relative h-40 rounded-3xl overflow-hidden shadow-lg transition-all hover:scale-[1.02] active:scale-95 bg-gradient-to-br from-yellow-500 to-amber-600 text-white p-4 flex flex-col justify-between"
          >
               <div className="relative z-10 text-left">
                  <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center mb-2 backdrop-blur-sm">
                     <Hammer className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-black text-lg leading-tight mb-1">{t('gameSmashEgg')}</h3>
              </div>
               <div className="absolute right-2 bottom-2 text-5xl filter drop-shadow-md group-hover:scale-110 transition-transform">🥚</div>
          </button>

          {/* Card 4: Scratch Card */}
          <button 
            onClick={() => setGameMode('scratch')}
            className="group relative h-40 rounded-3xl overflow-hidden shadow-lg transition-all hover:scale-[1.02] active:scale-95 bg-gradient-to-br from-teal-500 to-emerald-600 text-white p-4 flex flex-col justify-between"
          >
               <div className="relative z-10 text-left">
                  <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center mb-2 backdrop-blur-sm">
                     <Ticket className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-black text-lg leading-tight mb-1">{t('gameScratch')}</h3>
              </div>
               <div className="absolute right-2 bottom-2 text-5xl filter drop-shadow-md group-hover:rotate-6 transition-transform">🎫</div>
          </button>
      </div>
  );

  return (
    <div className="h-[100dvh] w-full bg-yellow-50 font-fredoka flex flex-col max-w-lg mx-auto shadow-2xl overflow-hidden relative border-x border-yellow-200">
      
      {/* Floating Coin Balance */}
      {activeTab === 'draw' && (
        <div className="absolute top-4 right-4 z-40 flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full border border-white/20 shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-500">
            <Coins className="w-4 h-4 text-yellow-300 fill-yellow-400" />
            <span className="font-bold text-base font-mono text-white tracking-wide">{coins}</span>
        </div>
      )}

      {/* Fixed Header */}
      <header className={`shrink-0 h-14 px-4 text-white shadow-lg z-30 rounded-b-[2rem] relative transition-colors duration-500 flex justify-center items-center
        ${activeTab === 'draw' ? 'bg-gradient-to-r from-orange-400 to-pink-500' : ''}
        ${activeTab === 'collection' ? 'bg-gradient-to-r from-purple-500 to-indigo-600' : ''}
        ${activeTab === 'mine' ? 'bg-gradient-to-r from-slate-700 to-slate-800' : ''}
      `}>
         {/* Back Button (Only for Games) */}
         {activeTab === 'draw' && gameMode !== 'menu' && (
             <button 
                onClick={handleBackToMenu}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 p-1.5 rounded-full active:scale-90 transition-all"
             >
                 <ChevronLeft className="w-6 h-6 text-white" />
             </button>
         )}

        {/* Centered Title */}
        <div className="flex items-center gap-2">
            {(activeTab !== 'draw' || gameMode === 'menu') && (
                <div className="bg-white/20 p-1.5 rounded-full">
                    {activeTab === 'draw' && <Sparkles className="w-5 h-5 text-yellow-200 animate-pulse" />}
                    {activeTab === 'collection' && <PackageOpen className="w-5 h-5 text-purple-200" />}
                    {activeTab === 'mine' && <User className="w-5 h-5 text-slate-200" />}
                </div>
            )}
            <h1 className="font-bold text-lg leading-none tracking-wide text-shadow-sm">{getHeaderTitle()}</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative w-full">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
            backgroundSize: '20px 20px'
        }}></div>

        <div className="w-full h-full flex flex-col">
          
          {/* TAB: DRAW (Now with Sub-navigation) */}
          {activeTab === 'draw' && (
            <div className="flex-1 pb-20 pt-2">
                {gameMode === 'menu' && <GameMenu />}
                
                {gameMode === 'gachapon' && (
                     <div className="animate-in fade-in slide-in-from-right duration-300 p-4">
                        <Gachapon 
                            onSpin={handleSpin} 
                            onReveal={handleReveal}
                            onPrizeClick={setSelectedPrize}
                            canSpin={true} 
                            cost={SPIN_COST} 
                            userCoins={coins}
                            prizes={prizes}
                            t={t}
                        />
                     </div>
                )}

                {gameMode === 'roulette' && (
                     <div className="animate-in fade-in slide-in-from-right duration-300 p-4">
                        <RouletteGame 
                            onSpin={handleSpin} 
                            onReveal={handleReveal}
                            canSpin={true} 
                            cost={SPIN_COST} 
                            userCoins={coins}
                            prizes={prizes}
                            t={t}
                        />
                     </div>
                )}

                {gameMode === 'smashegg' && (
                     <div className="animate-in fade-in slide-in-from-right duration-300 p-4">
                        <SmashEggGame 
                            onSpin={handleSpin} 
                            onReveal={handleReveal}
                            canSpin={true} 
                            cost={SPIN_COST} 
                            userCoins={coins}
                            t={t}
                        />
                     </div>
                )}

                {gameMode === 'scratch' && (
                     <div className="animate-in fade-in slide-in-from-right duration-300 p-4">
                        <ScratchCardGame 
                            onSpin={handleSpin} 
                            onReveal={handleReveal}
                            canSpin={true} 
                            cost={SPIN_COST} 
                            userCoins={coins}
                            t={t}
                        />
                     </div>
                )}
            </div>
          )}

          {/* TAB: COLLECTION */}
          {activeTab === 'collection' && (
            <Collection inventory={inventory} setActiveTab={setActiveTab} onItemClick={setSelectedPrize} t={t} />
          )}

          {/* TAB: MINE */}
          {activeTab === 'mine' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-4 pb-20 p-4 pt-8">
                  {/* Profile */}
                  <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-4xl shadow-inner border-4 border-slate-200">
                          🦁
                      </div>
                      <div>
                          <h2 className="text-xl font-bold text-gray-800">{t('mine')}</h2>
                          <div className="bg-yellow-100 px-3 py-1 rounded-full inline-flex items-center gap-1 mt-1">
                              <Coins className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                              <span className="font-bold text-sm text-yellow-800">{coins}</span>
                          </div>
                      </div>
                  </div>

                  {/* Parent Zone Button */}
                  <button 
                      onClick={() => setShowParentZone(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-3xl shadow-lg border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all group overflow-hidden relative"
                  >
                      <ShieldCheck className="absolute -right-2 -bottom-4 w-24 h-24 text-white/5 rotate-12" />
                      <div className="relative z-10 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                  <ShieldCheck className="w-6 h-6 text-slate-200" />
                              </div>
                              <div className="text-left">
                                  <h3 className="font-bold text-lg leading-none">{t('parentZone')}</h3>
                                  <p className="text-xs text-blue-100 mt-1 font-medium">{t('enterParentZone')}</p>
                              </div>
                          </div>
                          <span className="text-blue-200 group-hover:translate-x-1 transition-transform bg-white/10 rounded-full p-2">➜</span>
                      </div>
                  </button>

                  {/* Language Settings */}
                  <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                      <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                          <Globe className="w-4 h-4 text-blue-500" /> 
                          {t('language')}
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                          {(['en', 'zh-CN', 'zh-TW'] as const).map(lang => (
                              <button 
                                  key={lang}
                                  onClick={() => setLanguage(lang)}
                                  className={`py-2 px-1 rounded-xl text-xs font-bold border-2 transition-all
                                      ${language === lang 
                                          ? 'border-blue-500 bg-blue-50 text-blue-600' 
                                          : 'border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100'}
                                  `}
                              >
                                  {lang === 'en' ? 'English' : lang === 'zh-CN' ? '简体中文' : '繁體中文'}
                              </button>
                          ))}
                      </div>
                  </div>
                  <div className="text-center mt-8"><p className="text-xs text-gray-300 font-bold">LUCKY LION v1.1</p></div>
              </div>
          )}
        </div>
      </main>

      {/* Fixed Bottom Nav */}
      <nav className="shrink-0 bg-white/95 backdrop-blur-md border-t border-gray-100 p-2 flex justify-around items-center pb-safe z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <NavButton 
            active={activeTab === 'draw'} 
            onClick={() => { setActiveTab('draw'); setGameMode('menu'); }}
            icon={<Gift size={24} />}
            label={t('play')}
            colorClass="text-orange-500"
        />
        <NavButton 
            active={activeTab === 'collection'} 
            onClick={() => setActiveTab('collection')}
            icon={<PackageOpen size={24} />}
            label={t('collection')}
            colorClass="text-purple-500"
        />
         <NavButton 
            active={activeTab === 'mine'} 
            onClick={() => setActiveTab('mine')}
            icon={<User size={24} />}
            label={t('mine')}
            colorClass="text-slate-600"
        />
      </nav>

      {/* Modals */}
      {justWon && <PrizeRevealModal prize={justWon} onClose={() => setJustWon(null)} t={t} />}
      {selectedPrize && <PrizeDetailModal prize={selectedPrize} onClose={() => setSelectedPrize(null)} t={t} />}
      {showParentZone && <ParentZone prizes={prizes} coins={coins} setCoins={setCoins} onAddPrize={handleAddPrize} onUpdateStock={handleUpdateStock} onUpdatePrize={handleUpdatePrize} onDeletePrize={handleDeletePrize} onResetData={handleFactoryReset} onClose={() => setShowParentZone(false)} t={t} />}

    </div>
  );
}

const NavButton = ({ active, onClick, icon, label, colorClass }: any) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 w-20 h-16
            ${active ? `bg-gray-50 ${colorClass} -translate-y-3 shadow-md border border-gray-100 font-bold` : 'text-gray-400 hover:bg-gray-50'}
        `}
    >
        {React.cloneElement(icon, { className: `w-6 h-6 mb-1 transition-colors ${active ? colorClass : 'text-gray-400'}` })}
        <span className="text-[10px] leading-none">{label}</span>
    </button>
);