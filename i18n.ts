export type Language = 'en' | 'zh-CN' | 'zh-TW';

export const translations = {
  en: {
    // Dynamic Headers
    headerPlay: "Game Center",
    headerCollection: "My Collection",
    headerMine: "My Zone",
    
    appTitle: "Lucky Lion",
    appSubtitle: "Daily Treasure Hunt",
    coins: "Coins",
    play: "Play",
    collection: "Collection",
    mine: "Mine",
    
    // Game Menu
    gameMenuTitle: "Choose a Game",
    gameGachapon: "Magic Gachapon",
    gameGachaponDesc: "Classic capsule fun!",
    gameRoulette: "Lucky Wheel",
    gameRouletteDesc: "Round and round it goes!",
    gameSmashEgg: "Golden Egg",
    gameSmashEggDesc: "Pick one and SMASH!",
    gameScratch: "Scratch Card",
    gameScratchDesc: "Scratch to reveal!",
    
    // Tabs
    tabItems: "My Treasures",
    tabBadges: "Achievements",
    
    gachaponTitle: "Magical Gachapon",
    gachaponSubtitle: "Spin to win Legendary prizes!",
    needCoins: "Need more coins! Ask your parents!",
    goodLuck: "Good Luck! 🍀",
    tapToSpin: "Tap the handle to spin! 👇",
    price: "PRICE",
    legendaryLeft: "Legendary Prizes Left",
    allClaimed: "Whoa! All big prizes claimed! Restocking soon...",
    
    // Collection
    itemsCollected: "items collected",
    emptyChest: "Your chest is empty!",
    goSpin: "Go spin!",
    comingSoon: "Coming Soon!",
    badgesDesc: "Keep playing to unlock badges like 'Collector', 'Lucky Star', and more!",
    owned: "Owned",

    // Reveal
    drop: "DROP!",
    yayAdded: "Yay! This has been added to your treasure chest.",
    awesome: "Awesome!",
    soldOut: "SOLD OUT",
    left: "Left",

    // Parent Zone & Admin
    adminTitle: "Parent Control Panel",
    language: "Language",
    parentZone: "Parent Zone",
    enterParentZone: "Enter Parent Zone",
    
    // Parent Zone Navigation
    pzRefill: "Refill Coins",
    pzPool: "Manage Pool",
    pzAdd: "New Prize",
    pzEdit: "Edit Prize",
    
    // Functionality
    addCoinsTitle: "Add Coins",
    addCoinsBtn: "Add Coins",
    coinsPlaceholder: "Amount (1-100)",
    
    managePrizes: "Manage Prize Pool",
    currentPool: "Current Prize Pool",
    probCheck: "Probability Check",
    probNote: "* Probs adjust automatically.",

    // Pool Tabs
    poolTabList: "Prize List",
    poolTabStats: "Stats Monitor",
    
    addNew: "Add New Prize",
    enterPrizeName: "Please enter prize name",
    prizeName: "Prize Name",
    emojiIcon: "Icon / Image",
    stock: "Stock",
    tier: "Tier (Rarity)",
    weight: "Weight",
    value: "Value",
    addBtn: "Add to Machine",
    saveBtn: "Save Changes",
    deleteConfirm: "Delete this prize?",
    emptyAlert: "Oh no! The machine is empty! Ask admin to refill.",

    // Tier Names
    tierLegendary: "🌟 LEGENDARY",
    tierEpic: "✨ EPIC",
    tierRare: "💎 RARE",
    tierFun: "🍀 FUN",
    tierCommon: "📦 COMMON",

    // Image Picker
    ipTitle: "Select Icon",
    ipPresets: "Presets",
    ipUpload: "Upload",
    ipCamera: "Camera",
    ipTakePhoto: "Take Photo",
    ipRetake: "Retake",
    ipUsePhoto: "Use Photo",
    ipDragDrop: "Click to upload image",
    ipCameraError: "Camera not accessible",

    // New Games
    pickEgg: "Pick an Egg!",
    buyTicket: "Buy Ticket",
    scratchArea: "Scratch Here!",
    scratchHint: "Rub the screen to see what you won!",
    
    // Smash Egg Specific
    refreshBoard: "Refresh Eggs",
    smashCost: "Hit",
    eggsCleared: "All Cleared!"
  },
  'zh-CN': {
    headerPlay: "游戏大厅",
    headerCollection: "我的收藏",
    headerMine: "我的地盘",

    appTitle: "幸运小狮子",
    appSubtitle: "每日寻宝",
    coins: "金币",
    play: "游乐场",
    collection: "收藏",
    mine: "我的",

    gameMenuTitle: "选择一个游戏",
    gameGachapon: "魔法扭蛋机",
    gameGachaponDesc: "经典的扭蛋乐趣！",
    gameRoulette: "幸运跑马灯",
    gameRouletteDesc: "转转转，好运来！",
    gameSmashEgg: "欢乐砸金蛋",
    gameSmashEggDesc: "选一个金蛋，用力砸！",
    gameScratch: "幸运刮刮乐",
    gameScratchDesc: "动动手指，刮出惊喜！",

    tabItems: "我的宝物",
    tabBadges: "成就徽章",

    gachaponTitle: "魔法扭蛋机",
    gachaponSubtitle: "转动把手，赢取传说大奖！",
    needCoins: "金币不足！快去找爸爸妈妈！",
    goodLuck: "祝你好运！🍀",
    tapToSpin: "点击把手开始抽奖！👇",
    price: "价格",
    legendaryLeft: "剩余传说大奖",
    allClaimed: "哇！大奖都被领光了！正在补货中...",
    
    itemsCollected: "个藏品",
    emptyChest: "宝箱是空的！",
    goSpin: "快去玩游戏！",
    comingSoon: "敬请期待！",
    badgesDesc: "继续玩，解锁“收藏家”、“幸运星”等徽章！",
    owned: "已拥有",

    drop: "掉落！",
    yayAdded: "太棒了！已经放入你的宝箱。",
    awesome: "太酷了！",
    soldOut: "已抢光",
    left: "剩余",

    adminTitle: "家长控制面板",
    language: "语言设置",
    parentZone: "家长专区",
    enterParentZone: "进入家长专区",

    pzRefill: "金币充值",
    pzPool: "奖池管理",
    pzAdd: "新品上架",
    pzEdit: "编辑奖品",

    addCoinsTitle: "发放奖励金币",
    addCoinsBtn: "充值",
    coinsPlaceholder: "数量 (1-100)",
    
    managePrizes: "管理奖池",
    currentPool: "当前奖池列表",
    probCheck: "动态概率监测",
    probNote: "* 概率会根据库存和权重自动调整。",

    poolTabList: "当前奖池",
    poolTabStats: "概览监测",
    
    addNew: "添加新奖品",
    enterPrizeName: "请输入奖品名称",
    prizeName: "奖品名称",
    emojiIcon: "图标/图片",
    stock: "库存",
    tier: "稀有度",
    weight: "权重",
    value: "价值 (￥)",
    addBtn: "加入扭蛋机",
    saveBtn: "保存修改",
    deleteConfirm: "确定删除这个奖品吗？",
    emptyAlert: "糟糕！扭蛋机空了！请管理员补货。",

    // Tier Names
    tierLegendary: "🌟 传说",
    tierEpic: "✨ 史诗",
    tierRare: "💎 稀有",
    tierFun: "🍀 趣味",
    tierCommon: "📦 普通",

    // Image Picker
    ipTitle: "选择图标",
    ipPresets: "预设表情",
    ipUpload: "上传图片",
    ipCamera: "拍照",
    ipTakePhoto: "拍摄",
    ipRetake: "重拍",
    ipUsePhoto: "确认使用",
    ipDragDrop: "点击上传图片",
    ipCameraError: "无法访问摄像头",

    pickEgg: "选一个金蛋！",
    buyTicket: "购买刮刮卡",
    scratchArea: "刮奖区",
    scratchHint: "在屏幕上摩擦，看看你赢了什么！",
    
    refreshBoard: "刷新一轮",
    smashCost: "砸蛋",
    eggsCleared: "全部砸完啦！"
  },
  'zh-TW': {
    headerPlay: "遊戲大廳",
    headerCollection: "我的收藏",
    headerMine: "我的地盤",

    appTitle: "幸運小獅子",
    appSubtitle: "每日尋寶",
    coins: "金幣",
    play: "遊樂場",
    collection: "收藏",
    mine: "我的",

    gameMenuTitle: "選擇一個遊戲",
    gameGachapon: "魔法扭蛋機",
    gameGachaponDesc: "經典的扭蛋樂趣！",
    gameRoulette: "幸運跑馬燈",
    gameRouletteDesc: "轉轉轉，好運來！",
    gameSmashEgg: "歡樂砸金蛋",
    gameSmashEggDesc: "選一個金蛋，用力砸！",
    gameScratch: "幸運刮刮樂",
    gameScratchDesc: "動動手指，刮出驚喜！",

    tabItems: "我的寶物",
    tabBadges: "成就徽章",

    gachaponTitle: "魔法扭蛋機",
    gachaponSubtitle: "轉動把手，贏取傳說大獎！",
    needCoins: "金幣不足！快去找爸爸媽媽！",
    goodLuck: "祝你好運！🍀",
    tapToSpin: "點擊把手開始抽獎！👇",
    price: "價格",
    legendaryLeft: "剩餘傳說大獎",
    allClaimed: "哇！大獎都被領光了！正在補貨中...",
    
    itemsCollected: "個藏品",
    emptyChest: "寶箱是空的！",
    goSpin: "快去玩遊戲！",
    comingSoon: "敬請期待！",
    badgesDesc: "繼續玩，解鎖「收藏家」、「幸運星」等徽章！",
    owned: "已擁有",

    drop: "掉落！",
    yayAdded: "太棒了！已經放入你的寶箱。",
    awesome: "太酷了！",
    soldOut: "已搶光",
    left: "剩餘",

    adminTitle: "家長控制面板",
    language: "語言設置",
    parentZone: "家長專區",
    enterParentZone: "進入家長專區",

    pzRefill: "金幣充值",
    pzPool: "獎池管理",
    pzAdd: "新品上架",
    pzEdit: "編輯獎品",

    addCoinsTitle: "發放獎勵金幣",
    addCoinsBtn: "充值",
    coinsPlaceholder: "數量 (1-100)",
    
    managePrizes: "管理獎池",
    currentPool: "當前獎池列表",
    probCheck: "動態機率監測",
    probNote: "* 機率會根據庫存和權重自動調整。",

    poolTabList: "當前獎池",
    poolTabStats: "概覽監測",
    
    addNew: "添加新獎品",
    enterPrizeName: "請輸入獎品名稱",
    prizeName: "獎品名稱",
    emojiIcon: "圖標/圖片",
    stock: "庫存",
    tier: "稀有度",
    weight: "權重",
    value: "價值 (￥)",
    addBtn: "加入扭蛋機",
    saveBtn: "保存修改",
    deleteConfirm: "確定刪除這個獎品嗎？",
    emptyAlert: "糟糕！扭蛋機空了！請管理員補貨。",

    // Tier Names
    tierLegendary: "🌟 傳說",
    tierEpic: "✨ 史詩",
    tierRare: "💎 稀有",
    tierFun: "🍀 趣味",
    tierCommon: "📦 普通",

    // Image Picker
    ipTitle: "選擇圖標",
    ipPresets: "預設表情",
    ipUpload: "上傳圖片",
    ipCamera: "拍照",
    ipTakePhoto: "拍攝",
    ipRetake: "重拍",
    ipUsePhoto: "確認使用",
    ipDragDrop: "點擊上傳圖片",
    ipCameraError: "無法訪問攝像頭",

    pickEgg: "選一個金蛋！",
    buyTicket: "購買刮刮卡",
    scratchArea: "刮獎區",
    scratchHint: "在屏幕上摩擦，看看你贏了什麼！",
    
    refreshBoard: "刷新一輪",
    smashCost: "砸蛋",
    eggsCleared: "全部砸完啦！"
  }
};