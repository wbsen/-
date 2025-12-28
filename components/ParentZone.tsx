import React, { useState, useRef, useEffect } from 'react';
import { Prize, PrizeTier, PrizeType, TIER_COLORS } from '../types';
import { calculateProbability } from '../services/lotteryService';
import { Plus, Trash2, ChevronLeft, Coins, ShoppingBag, ArrowRight, BarChart3, List, Pencil, Save, AlertTriangle, Image as ImageIcon, Camera, Upload, Smile, X, CircleDollarSign, RotateCcw, Box } from 'lucide-react';
import { PrizeDetailModal } from './PrizeDetailModal'; 

interface ParentZoneProps {
  prizes: Prize[];
  coins: number;
  setCoins: (n: number) => void;
  onAddPrize: (prize: Prize) => void;
  onUpdateStock: (id: string, amount: number) => void;
  onUpdatePrize: (prize: Prize) => void; 
  onDeletePrize: (id: string) => void;
  onResetData?: () => void;
  onClose: () => void;
  t: (key: any) => string;
}

type ZoneView = 'menu' | 'add_coins' | 'pool_list' | 'add_prize' | 'edit_prize';

const EMOJI_PRESETS = [
    '🧸', '🏎️', '🪄', '🍫', '🎟️', '💰', '⭐', '🏷️', '🍬', 
    '🎁', '🎮', '🧩', '🎨', '🚲', '🛴', '🎧', '⌚', '📱',
    '⚽', '🏀', '🦄', '🦖', '🤖', '👾', '🌈', '🍦', '🍔'
];

const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800; 
                const MAX_HEIGHT = 800; 
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.85));
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

export const ParentZone: React.FC<ParentZoneProps> = ({ 
    prizes, coins, setCoins, onAddPrize, onUpdateStock, onUpdatePrize, onDeletePrize, onResetData, onClose, t 
}) => {
  const [view, setView] = useState<ZoneView>('menu');
  const [coinInput, setCoinInput] = useState('');
  const [poolTab, setPoolTab] = useState<'items' | 'stats'>('items');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [previewPrize, setPreviewPrize] = useState<Prize | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imagePickerTab, setImagePickerTab] = useState<'emoji' | 'upload' | 'camera'>('emoji');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Prize>>({
    name: '',
    image: '🎁',
    modelUrl: '',
    stock: 1, 
    weight: 300,
    tier: PrizeTier.COMMON,
    type: PrizeType.TOY,
    price: 0
  });

  const probabilities = calculateProbability(prizes);
  const totalPoolValue = prizes.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const totalPoolItems = prizes.reduce((sum, p) => sum + p.stock, 0);

  const getWeightForTier = (tier: PrizeTier) => {
      switch(tier) {
          case PrizeTier.LEGENDARY: return 10;
          case PrizeTier.EPIC: return 40;
          case PrizeTier.RARE: return 100;
          case PrizeTier.FUN: return 150;
          case PrizeTier.COMMON: return 300;
          default: return 300;
      }
  };

  const handleTierChange = (newTier: PrizeTier) => {
      setFormData(prev => ({
          ...prev,
          tier: newTier,
          weight: getWeightForTier(newTier)
      }));
  };

  const startCamera = async () => {
      try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ 
              video: { facingMode: 'environment' }
          });
          setStream(mediaStream);
          if (videoRef.current) {
              videoRef.current.srcObject = mediaStream;
          }
      } catch (err) {
          console.error("Error accessing camera:", err);
          alert(t('ipCameraError'));
      }
  };

  const stopCamera = () => {
      if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
      }
  };

  const takePhoto = () => {
      if (videoRef.current) {
          const canvas = document.createElement('canvas');
          const size = Math.min(videoRef.current.videoWidth, videoRef.current.videoHeight);
          const OUTPUT_SIZE = 800;
          canvas.width = OUTPUT_SIZE;
          canvas.height = OUTPUT_SIZE;
          const ctx = canvas.getContext('2d');
          const sx = (videoRef.current.videoWidth - size) / 2;
          const sy = (videoRef.current.videoHeight - size) / 2;
          ctx?.drawImage(videoRef.current, sx, sy, size, size, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
          setCapturedPhoto(canvas.toDataURL('image/jpeg', 0.85));
      }
  };

  useEffect(() => {
      if (!showImagePicker || imagePickerTab !== 'camera') {
          stopCamera();
          setCapturedPhoto(null);
      } else if (showImagePicker && imagePickerTab === 'camera') {
          startCamera();
      }
      return () => stopCamera();
  }, [showImagePicker, imagePickerTab]);

  const handleAddCoins = () => {
    const amount = parseInt(coinInput);
    if (!isNaN(amount) && amount > 0) {
        setCoins(coins + amount);
        setCoinInput('');
        alert(`Added ${amount} coins!`);
    }
  };

  const handleStartAdd = () => {
    setFormData({ 
        name: '', 
        image: '🎁', 
        modelUrl: '',
        stock: 1, 
        weight: 300, 
        tier: PrizeTier.COMMON, 
        type: PrizeType.TOY, 
        price: 0 
    });
    setView('add_prize');
  };

  const handleStartEdit = (prize: Prize) => {
      setEditingId(prize.id);
      setFormData({ ...prize });
      setView('edit_prize');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (view === 'add_prize') {
        onAddPrize({
            ...formData,
            id: Date.now().toString(),
            initialStock: formData.stock || 0,
            price: formData.price || 0
        } as Prize);
    } else if (view === 'edit_prize' && editingId) {
        onUpdatePrize({
            ...formData,
            id: editingId,
        } as Prize);
    }
    setView('pool_list');
    setEditingId(null);
  };

  const handleBack = () => {
      if (view === 'add_prize' || view === 'edit_prize') {
          setView('pool_list');
          setEditingId(null);
      } else if (view === 'menu') {
          onClose(); 
      } else {
          setView('menu');
      }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          try {
              const base64 = await resizeImage(e.target.files[0]);
              setFormData({...formData, image: base64});
              setShowImagePicker(false);
          } catch (err) { console.error(err); }
      }
  };

  const getTierTheme = (tier: PrizeTier | undefined) => {
      switch(tier) {
          case PrizeTier.LEGENDARY: return { bg: 'bg-yellow-50', border: 'border-yellow-200', btn: 'bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-yellow-900/20', text: 'text-yellow-800' };
          case PrizeTier.EPIC: return { bg: 'bg-purple-50', border: 'border-purple-200', btn: 'bg-gradient-to-r from-purple-500 to-purple-600 shadow-purple-900/20', text: 'text-purple-800' };
          case PrizeTier.RARE: return { bg: 'bg-blue-50', border: 'border-blue-200', btn: 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-900/20', text: 'text-blue-800' };
          case PrizeTier.FUN: return { bg: 'bg-green-50', border: 'border-green-200', btn: 'bg-gradient-to-r from-green-500 to-green-600 shadow-green-900/20', text: 'text-green-800' };
          default: return { bg: 'bg-slate-50', border: 'border-slate-200', btn: 'bg-slate-800 shadow-slate-900/20', text: 'text-slate-800' };
      }
  };

  const formTheme = getTierTheme(formData.tier);

  const getTierLabel = (tier: PrizeTier) => {
      switch(tier) {
          case PrizeTier.LEGENDARY: return t('tierLegendary');
          case PrizeTier.EPIC: return t('tierEpic');
          case PrizeTier.RARE: return t('tierRare');
          case PrizeTier.FUN: return t('tierFun');
          case PrizeTier.COMMON: return t('tierCommon');
          default: return tier;
      }
  };

  const MenuCard = ({ title, icon: Icon, color, onClick, desc, rightContent }: any) => (
    <button onClick={onClick} className={`w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md hover:border-${color}-200 transition-all active:scale-[0.98]`}>
        <div className="flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl bg-${color}-50 flex items-center justify-center text-${color}-600`}><Icon className="w-7 h-7" /></div>
            <div className="text-left">
                <h3 className="font-bold text-lg text-slate-800">{title}</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">{desc}</p>
            </div>
        </div>
        <div className="flex items-center gap-3">
             {rightContent}
             <div className={`w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-${color}-500 group-hover:text-white transition-colors`}><ArrowRight className="w-5 h-5" /></div>
        </div>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-slate-100/90 backdrop-blur-md z-[100] animate-in slide-in-from-bottom duration-300">
        <div className="h-full flex flex-col max-w-lg mx-auto bg-slate-50 shadow-2xl relative overflow-hidden">
            <header className="shrink-0 h-14 px-4 text-white shadow-lg z-30 rounded-b-[2rem] relative flex justify-center items-center bg-blue-600 transition-colors duration-500">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <button onClick={handleBack} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors active:scale-90 flex items-center justify-center"><ChevronLeft className="w-6 h-6 text-white" /></button>
                </div>
                <h1 className="font-bold text-lg leading-none tracking-wide text-shadow-sm">
                    {view === 'menu' && t('adminTitle')}
                    {view === 'add_coins' && t('pzRefill')}
                    {view === 'pool_list' && t('pzPool')}
                    {view === 'add_prize' && t('pzAdd')}
                    {view === 'edit_prize' && t('pzEdit')}
                </h1>
            </header>

            <div className="flex-1 overflow-y-auto p-6 relative">
                {view === 'menu' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <MenuCard title={t('pzRefill')} desc={t('addCoinsTitle')} icon={Coins} color="yellow" onClick={() => setView('add_coins')} rightContent={<div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-lg"><span className="font-bold text-sm text-yellow-700">{coins}</span><Coins className="w-3 h-3 text-yellow-600 fill-yellow-500" /></div>}/>
                        <MenuCard title={t('pzPool')} desc={t('currentPool')} icon={ShoppingBag} color="blue" onClick={() => setView('pool_list')} />
                        <div className="mt-8 pt-8 border-t border-slate-200">
                            <MenuCard title="Reset Data" desc="Clear all data & restart" icon={RotateCcw} color="red" onClick={() => setShowResetConfirm(true)} />
                        </div>
                    </div>
                )}

                {view === 'add_coins' && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 text-center">
                            <div className="mb-6">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Current Balance</p>
                                <div className="inline-flex items-center gap-2 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-200"><Coins className="w-8 h-8 text-yellow-500 fill-yellow-400" /><span className="text-3xl font-black text-slate-800">{coins}</span></div>
                            </div>
                            <input type="number" min="1" max="100" value={coinInput} onChange={(e) => setCoinInput(e.target.value)} placeholder={t('coinsPlaceholder')} className="w-full text-center bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-4 font-mono text-2xl font-bold outline-none focus:border-yellow-400 mb-4" />
                            <button onClick={handleAddCoins} className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-4 rounded-2xl transition-all shadow-[0_4px_0_#ca8a04] active:shadow-none active:translate-y-[4px]">{t('addCoinsBtn')}</button>
                        </div>
                    </div>
                )}

                {view === 'pool_list' && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-300 pb-24">
                        <div className="flex p-1 bg-white rounded-xl mb-6 shadow-sm border border-slate-200">
                            <button onClick={() => setPoolTab('items')} className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${poolTab === 'items' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}><List className="w-4 h-4" /> {t('poolTabList')}</button>
                            <button onClick={() => setPoolTab('stats')} className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${poolTab === 'stats' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}><BarChart3 className="w-4 h-4" /> {t('poolTabStats')}</button>
                        </div>
                        {poolTab === 'items' && (
                            <div className="space-y-3">
                                {prizes.map(prize => (
                                    <div key={prize.id} className={`p-4 rounded-2xl shadow-sm border-l-8 flex items-center gap-4 ${prize.tier === PrizeTier.LEGENDARY ? 'border-yellow-400 bg-yellow-50' : prize.tier === PrizeTier.EPIC ? 'border-purple-400 bg-purple-50' : 'border-slate-200 bg-white'}`}>
                                        <button onClick={() => setPreviewPrize(prize)} className="w-20 h-20 flex-shrink-0 flex items-center justify-center bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100 hover:scale-105 active:scale-95 transition-transform">
                                            {prize.image.startsWith('data:') ? <img src={prize.image} className="w-full h-full object-cover" /> : <span className="text-5xl">{prize.image}</span>}
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-slate-800 truncate text-lg">{prize.name}</h4>
                                                <span className="text-sm font-black bg-amber-50 text-amber-500 px-2 py-0.5 rounded-md shrink-0 ml-1 border border-amber-100 font-mono">￥{prize.price}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-white/50 border border-black/5 text-slate-500">{getTierLabel(prize.tier)}</span>
                                                {prize.modelUrl && <span className="text-[8px] px-1 bg-blue-500 text-white rounded font-black">3D</span>}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5 shrink-0">
                                            <div className="flex items-center gap-1"><button onClick={() => onUpdateStock(prize.id, -1)} className="w-8 h-7 bg-white hover:bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold border border-slate-200">-</button><button onClick={() => onUpdateStock(prize.id, 1)} className="w-8 h-7 bg-white hover:bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold border border-slate-200">+</button></div>
                                            <div className="flex items-center gap-1"><button onClick={() => handleStartEdit(prize)} className="flex-1 h-7 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg flex items-center justify-center"><Pencil className="w-3.5 h-3.5" /></button><button onClick={() => setDeletingId(prize.id)} className="flex-1 h-7 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {poolTab === 'stats' && (
                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-2xl shadow-lg text-white border border-slate-700 flex justify-between items-center">
                                    <div><h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Total Pool Value</h4><div className="text-3xl font-black text-amber-400 flex items-baseline gap-0.5 font-mono"><span className="text-xl">￥</span>{totalPoolValue}</div></div><div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center"><CircleDollarSign className="w-6 h-6 text-amber-400" /></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {(view === 'add_prize' || view === 'edit_prize') && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-300 pb-10">
                        <form onSubmit={handleFormSubmit} className={`p-6 rounded-[2rem] shadow-sm border transition-colors duration-300 space-y-5 ${formTheme.bg} ${formTheme.border}`}>
                            <div><label className={`block text-xs font-bold uppercase mb-2 ml-1 ${formTheme.text}`}>{t('prizeName')}</label><input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 outline-none focus:border-blue-500 shadow-sm" placeholder={t('enterPrizeName')} /></div>
                            <div><label className={`block text-xs font-bold uppercase mb-2 ml-1 ${formTheme.text}`}>{t('tier')}</label><select value={formData.tier} onChange={e => handleTierChange(e.target.value as PrizeTier)} className="w-full p-4 rounded-xl border border-slate-200 font-bold bg-white text-slate-700 shadow-sm outline-none appearance-none">{Object.values(PrizeTier).map(t => (<option key={t} value={t}>{getTierLabel(t)}</option>))}</select></div>
                            
                            {/* 3D Model URL Input */}
                            <div>
                                <label className={`block text-xs font-bold uppercase mb-2 ml-1 ${formTheme.text} flex items-center gap-1`}>
                                  <Box className="w-3.5 h-3.5" /> 3D Model URL (.glb)
                                </label>
                                <input 
                                  type="text" 
                                  value={formData.modelUrl} 
                                  onChange={e => setFormData({...formData, modelUrl: e.target.value})} 
                                  className="w-full p-4 rounded-xl bg-white border border-slate-200 font-mono text-xs shadow-sm" 
                                  placeholder="https://example.com/model.glb"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={`block text-xs font-bold uppercase mb-2 ml-1 ${formTheme.text}`}>{t('emojiIcon')}</label><button type="button" onClick={() => setShowImagePicker(true)} className="w-full h-[60px] rounded-xl bg-white border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors overflow-hidden relative shadow-sm">{formData.image ? (formData.image.startsWith('data:') ? (<img src={formData.image} className="w-full h-full object-cover" />) : (<span className="text-3xl">{formData.image}</span>)) : (<ImageIcon className="text-slate-400" />)}<div className="absolute bottom-0 right-0 bg-black/50 p-1 rounded-tl-lg"><Pencil className="w-3 h-3 text-white" /></div></button></div>
                                <div><label className={`block text-xs font-bold uppercase mb-2 ml-1 ${formTheme.text}`}>{t('value')}</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">￥</span><input type="number" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} className="w-full p-4 pl-8 rounded-xl bg-white border border-slate-200 font-mono font-bold shadow-sm" /></div></div>
                            </div>
                            <div><label className={`block text-xs font-bold uppercase mb-2 ml-1 ${formTheme.text}`}>{t('stock')}</label><input type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} className="w-full p-4 rounded-xl bg-white border border-slate-200 font-mono font-bold shadow-sm" /></div>
                            <button type="submit" className={`w-full text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] mt-4 flex items-center justify-center gap-2 ${formTheme.btn}`}>{view === 'add_prize' ? <Plus className="w-5 h-5" /> : <Save className="w-5 h-5" />} {view === 'add_prize' ? t('addBtn') : t('saveBtn')}</button>
                        </form>
                    </div>
                )}
            </div>
            
            {view === 'pool_list' && (<div className="absolute bottom-6 right-6 z-50 animate-in zoom-in duration-300"><button onClick={handleStartAdd} className="w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white active:scale-90 transition-transform"><Plus className="w-8 h-8" /></button></div>)}
            {(deletingId || showResetConfirm) && (<div className="absolute inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"><div className="bg-white rounded-[2rem] p-6 shadow-2xl max-w-xs w-full animate-in zoom-in-95 duration-200 flex flex-col items-center text-center"><div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-4"><AlertTriangle className="w-7 h-7" /></div><h3 className="text-lg font-black text-slate-800 mb-2">{showResetConfirm ? "Reset Everything?" : t('deleteConfirm')}</h3><div className="flex gap-3 w-full"><button onClick={() => { setDeletingId(null); setShowResetConfirm(false); }} className="flex-1 py-3.5 rounded-2xl font-bold bg-slate-100 text-slate-600">Cancel</button><button onClick={() => { if (showResetConfirm) { if(onResetData) onResetData(); } else if (deletingId) { onDeletePrize(deletingId); setDeletingId(null); } }} className="flex-1 py-3.5 rounded-2xl font-bold bg-red-500 text-white">Confirm</button></div></div></div>)}
            {previewPrize && <PrizeDetailModal prize={previewPrize} onClose={() => setPreviewPrize(null)} t={t} />}
        </div>
    </div>
  );
};