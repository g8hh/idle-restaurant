/*

 @name    : 锅巴汉化 - Web汉化插件
 @author  : 麦子、JAR、小蓝、好阳光的小锅巴
 @version : V0.6.1 - 2019-07-09
 @website : http://www.g8hh.com

*/

//1.汉化杂项
var cnItems = {
    _OTHER_: [],

    //未分类：
    'Save': '保存',
    'Export': '导出',
    'Import': '导入',
    'Settings': '设置',
    'Achievements': '成就',
    'Statistics': '统计',
    'Ok': '好的',
    'Prestige': '声望',
    'PURCHASED.': '已购买。',
    'Shop': '商店',
    'Skills': '技能',
    'Sort': '排序',
    'Category Bonuses': '类别奖励',
    'Clean': '清理',
    'Close': '关闭',
    'CURRENCY': '货币',
    'Community and contacts': '社区和联系方式',
    'Cook': '烹饪',
    'Current stats': '当前统计',
    'Progress': '进度',
    'progress': '进度',
    'Put': '放',
    'Unlocked skills': '已解锁技能',
    'up': '提升',
    'THANK YOU!': '感谢你!',
    'so it doesn\'t work properly in': '所以它在里面不能正常工作',
    'Take': '拿',
    'New batch': '新一批',
    'History': '历史',
    'from text ←': '来自文本 ←',
    'Info': '信息',
    'Incognito mode': '无痕模式',
    'If you have questions please contact the dev': '如有疑问，请联系开发人员',
    'Options': '选项',
    'PERMANENT': '永久',
    'Restaurant': '餐馆',
    'Restaurant menu': '餐馆菜单',
    'Restaurant name': '餐馆名称',
    'Select all text': '全选文本',
    'Double Cook': '双重烹饪',
    'and earned': '并获得',
    'Dishes': '菜品',
    'Load': '加载',
    'All': '全部',
    'Game': '游戏',
    'Chicken nuggets': '鸡块',
    'Coffee': '咖啡',
    'Base income': '基本收入',
    'Cupcake': '纸杯蛋糕',
    'Eggs and bacon': '鸡蛋和培根',
    'Hamburger': '汉堡包',
    'Hotdog': '热狗',
    'Poultry legs': '鸡腿',
    'Sandwich': '三明治',
    'Steak': '牛排',
    'Taco': '墨西哥煎玉米卷',
    'Banana sandwich': '香蕉三明治',
    'Beer': '啤酒',
    'Cake roll': '蛋糕卷',
    'Crab': '大闸蟹',
    'Croissant': '羊角面包;',
    'Fish soup': '鱼汤',
    'French fries': '炸薯条',
    'Fried fish': '烧鱼',
    'Icecream': '冰激凌',
    'Lime cocktail': '酸橙鸡尾酒',
    'Local soda': '苏打水',
    'Mixed nuts': '混合坚果',
    'Mojito': '莫吉托',
    'Popcorn': '爆米花',
    'Rice ball': '饭团',
    'Seasoned fish': '调味鱼',
    'Shrimp tartlet': '虾馅饼',
    'Tea': '茶',
    'Sushi rolls': '寿司卷',
    'Wine': '葡萄酒',
    'Yoghurt': '酸奶',
    'Shift-click': '按住Shift并单击',
    'Smaller bar shows progress for each percent.': '较小的条显示每个百分比的进度。',
    'Themes': '主题',
    'to auto-place.': '自动放置。',
    'Total income': '总收入',
    'Unlock new dishes': '解锁新菜',
    'DEBUG': '调试',
    'up.': '上。',
    'Thousand $': '千 $',
    'Bonus from having a': '奖励来自拥有一个',
    'Bonus from': '奖励来自',
    'Dish income': '菜品收入',
    'or': '或者',
    'Press': '按',
    'Choose': '选择',
    'Duplicate': '复制',
    'to text →': '到文本 →',
    'Sextuple Cook': '六重烹饪',
    'Cancel': '取消',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    'You can earn your first money by washing dishes.': '您可以通过洗碗赚取第一笔钱。',
    'Oh, hello there!': '哦，你好！',
    'Not the most exciting job ever,': '这不是有史以来最令人兴奋的工作，',
    'I am George the Tutorial Chef and I\'ll guide you through the basics.': '我是指导厨师乔治，我将指导您完成所有基础操作。',
    'Hello!': '哈喽!',
    'gotta start somewhere.': '必须从某个地方开始。',
    'Hard Reset (right click or long hold': '硬重置（右键单击或长按',
    'Alright': '好的',
    'but well,': '但是好吧,',
    'To start your restaurant you\'ll need to get some money first.': '要开始您的餐厅，您需要先获得一些钱。',
    'Sort dishes by income.': '按收入对菜肴进行排序。',
    'Same as normal Cooking, but costs 1 coupon instead.': '与正常烹饪相同，但费用为1张优惠券。',
    'Does not increase normal Cooking price.': '不会增加正常的烹饪价格。',
    'Cook for coupons.': '烹饪优惠券。',
    'Prestige restaurant?': '声望你的餐馆?',
    'Current status: inactive.': '当前状态：无效。',
    'Current food categories in your restaurant and their bonuses.': '您餐厅的当前食物类别及其奖金。',
    'Wash': '洗',
    'Max level bonus reached': '达到最高等级奖励',
    'Current status: active.': '当前状态：有效。',
    'Coupons are used for free cooking.': '优惠券可用于免费烹饪。',
    'Also comes with a free Sort button.': '还带有一个免费的“排序”按钮。',
    'Promotes your restaurant with coupons.': '用优惠券促销您的餐馆。',
    'You\'ll get 1 coupon every 10 minutes.': '您每10分钟将获得1张优惠券。',
    'Adds a buff to the result of Supercooks for money.': '为超级烹饪的金钱增加增益。',
    'Buffs': '增益',
    'Buffs can be added to any dish to improve its income.': '增益可以添加到任何菜来提高它的收入。',
    'Each level adds a new buff type.': '每级增加一个新的增益类型。',
    'Min Cook': '最少烹饪',
    'Max Cook': '最少烹饪',
    'Max Level': '最高级',
    'Next: Exotic flavours every 3 Supercooks for money': '下一页：每3个超级烹饪都会获得异国风味的美食的金钱',
    'null': '空',
    'Hard Reset (right click or long hold': '硬复位 (右击或长时间保持',
    'Different icons visually represent the orders of magnitude (thousands, millions, etc).': '不同的图标在视觉上代表了数量级(数千、数百万等)。',
    'Your current income per second.': '你当前每秒的收入。',
    'You get charges by cooking normally.': '通过正常烹饪来收取费用。',
    'Select new dishes': '选择新菜',
    'Progress towards the next Prestige Point.': '游戏进度达到下一个声望点。',
    'Prestige Points this run': '本轮游戏声望点数',
    'Needs 6 charges to activate.': '需要6次充电才能激活。    ',
    'Money earned for next point': '赚到的钱达到下一个点数',
    'Bigger bar shows total progress.': '较大的条显示总进度。',
    'List of available dishes can be found on the Info tab.': '可用菜肴的列表可在“信息”标签里找到。',
    'Get more menu space': '获取更多菜单空间',
    'Get +20% income': '获得 +20％ 的收入',
    'Every use increases the cost, so use it wisely.': '每次使用都会增加成本，因此请明智地使用它。',
    'Cook 6 times for the price of 5.': '以5的价格烹饪6次。',
    'Cook 5 random dishes.': '随机烹饪5道菜。',
    'Your top performing dish is': '你表现最好的菜是',
    'and it made about': '它造成了',
    'of your income!': '您的收入！',
    'Right click to toggle progressbar animation (for even less CPU usage).': '右键单击以切换进度栏动画（以减少CPU使用率）。',
    'Restaurant bonuses (multipliers': '餐厅的奖金 (乘数',
    'Amount of money you currently have.': '您目前拥有的金额。',
    'For your first Prestige, it is good to get to about 10 Prestige Points, but if you': '对于您的第一次声望，最好获得大约10个声望点，但是如果您',
    'Exporting the game will load it and then  automatically prestige it to prevent exploits. Continue?': '导出游戏将加载它，然后自动声望它，以防止利用。继续吗?',
    'Every purchase supports the game and its solo dev.': '每次购买都支持该游戏及其单独开发。',
    'a third option too.': '还有第三种选择。',
    'Kitchen': '厨房',
    ' 1 Prestige Booster': '1声望助推器',
    '2 options to choose from, you\'ll get': '2种选择，您将获得',
    'You were away for': '你离开了',
    'Prestige Boosters': '声望助推器',
    'Loading error. The game requires JavaScript to be enabled. Here are the <a href=\"https://www.enable-javascript.com/\">\n instructions how to enable JavaScript in your web browser</a>': '载入错误。 游戏需要启用JavaScript。 这是<a href=\"https://www.enable-javascript.com/\"> \n说明，如何在网络浏览器中启用JavaScript </a>',
    'Welcome back!': '欢迎回来！',
    'want to start again, you can go earlier.': '要重新开始，可以早点去。',
    'Triple Cook': '三重烹饪',
    'Triple choice': '三重选择',
    'This is not the prestige system. You probably don\'t want to do this if you don\'t know what it means.': '这不是声望系统。 如果您不知道这意味着什么，那么您可能不想这样做。',
    'The game uses local storage to save progress,': '游戏使用本地存储来保存进度，',
    'Unlocks with Prestige Boosters skill': '使用声望助推器技能解锁',

    //原样
    '': '',
    '': '',

}


//需处理的前缀
var cnPrefix = {
    "(-": "(-",
    "(+": "(+",
    "(": "(",
    "-": "-",
    "+": "+",
    " ": " ",
    ": ": "： ",
    "\n": "",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    " ": "",
    "TIME: ": "时间: ",
    "Supercook": "超级烹饪",
    "Cheap": "便宜",
    "Cooks total": "总计烹饪",
    "Dessert": "点心",
    "Fastfood": "快餐",
    "Drink": "饮料",
    'Meat': '肉',
    'Seafood': '海鲜',
    "Income": "收入",
    "Vegan": "素食",
    "Skip ": "跳过 ",
    "Tier ": "层 ",
    "Max Cook Qty:": "最大烹饪数量：",
    "Max Dish Level:": "最高菜肴等级：",
    "Min Cook Qty:": "最小烹饪数量：",
    "Mult:": "加成:",
    "New (": "新 (",
    "Premium": "优质",
    "Active": "激活",
    "Dishwashing ": "洗盘子 ",
    "Email:": "邮箱:",
    "Buy": "购买",
    "Quantity:": "数量:",
    'You\'ll lose all your money and dishes and gain': '您将失去所有的金钱和菜肴并获得收益',
    "Cost:": "成本:",
    "Dif:": "差异:",
    "Maximum quantity:": "最大数量：",
    "Minimum quantity:": "最小数量：",
    "Next cost:": "下一个成本:",
    "level ": "等级 ",
    "Current charges:": "当前费用：",
    "Bonus from restaurant tier:": "餐厅层级的奖励：",
    "Set ": "选择 ",
    "Level bonus:": "等级奖励：",
    "Max level quantity:": "最大等级数量：",
    "Next Max level quantity:": "下一个最大等级数量：",
    "Increases minimum cooking quantity by": "最小烹饪量增加",
    "Increases maximum cooking quantity by": "最大烹饪量增加",
    "Increases maximum dish level by": "提高最高级别的菜品",
    "Current level": "当前等级",
    "Unlocks at": "解锁于",
    "Prestige Points:": "声望点:",
    "Bonus from prestige points:": "来自声望点的奖励：",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需处理的后缀
var cnPostfix = {
    ":": "：",
    "：": "：",
    ": ": "： ",
    "： ": "： ",
    "/s)": "/s)",
    "/s": "/s",
    ")": ")",
    "%": "%",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    " ": " ",
    "\n": "",
    " sec": " 秒",
    " Gems": " 宝石",
    "Coupons": "优惠券",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    'total Prestige Points.': '总声望点数。',
    "Skill Points.": "技能点。",
    "Prestige Points. Continue?": "声望点。继续？",
    "points": "点数",
    'Dark Mode': ' 深色模式',
    'Engineering-exponential notation': '工程指数符号',
    "Percent of coupons on MegaCook": "MegaCook上的优惠券百分比",
    " Thousand": " 千",
    'Whenever you get': '每当你得到',
    'on the right →': '在右边→',
    'When you Prestige, you restart the game to get Prestige Points and ': '当您获得声望时，您可以重新启动游戏以获得声望点和',
    'You can spend gems on ingame purchases': '您可以在游戏中购买宝石',
    'Prestige Points increase your total income by 10% each.': '声望点可将您的总收入提高10％。',
    "(Hover over skills and rainbow bar at the main screen to see more descriptions.": "（将鼠标悬停在主屏幕上的技能和彩虹条上可查看更多说明。",
    'Skill Points are used to buy skills below.': '技能点数用于购买以下技能。',
    'Hard Reset (right click or long hold': '硬重置（右键单击或长按',
}

//需排除的，正则匹配
var cnExcludeWhole = [
    /^(\d+)$/,
    /^([\d\.]+)$/,
    /^([\d\.]+) Million$/,
    /^(\d+)k$/,
    /^(\d+) m$/,
    /^(\d+) 秒$/,
    /^(\d+)\:(\d+)$/,
];
var cnExcludePostfix = [
]

//正则替换，带数字的固定格式句子
//纯数字：(\d+)
//逗号：([\d\.,]+)
//小数点：([\d\.]+)
//原样输出的字段：(.+)
var cnRegReplace = new Map([
    [/^requires ([\d\.]+) more research points$/, '需要$1个研究点'],
    [/^(.+)\(prestiges the game$/, '（对游戏进行声望'],
    [/^(.+)\(prestiges the game\)(.+)$/, '进行声望'],
    [/^(.+)Hard Reset \(right click or long hold(.+)$/, '硬重置（右键单击或长按'],
    [/^Unlocks at (.+)$/, '解锁于 $1'],
    [/^(.+)Sextuple Cook(.+)$/, '六重烹饪'],
    [/^(.+)On prestige you\'ll get:(.+)$/, '进行声望，您将获得：'],
    [/^(.+)Available Skill Points:(.+)$/, '可用技能点：'],
    [/^(.+)Total Prestige Points:(.+)$/, '总声望点：'],
    [/^(\d+) Royal points$/, '$1 皇家点数'],
    [/^Cost: (\d+) RP$/, '成本：$1 皇家点数'],
    [/^Usages: (\d+)\/$/, '用途：$1\/'],
    [/^workers: (\d+)\/$/, '工人：$1\/'],

]);