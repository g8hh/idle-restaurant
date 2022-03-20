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
    'Duplicate': '重复',
    'to text →': '到文本 →',
    'Cancel': '取消',
    'Bypass': '绕过',
    'Cook next tutorial dishes.': '烹饪下一个教程菜。',
    'Dishes in restaurant menu earn you money every second.': '餐厅菜单上的菜肴每秒钟都能为您赚钱。',
    'Done': '完成',
    'You can earn your first money by washing dishes.': '您可以通过洗碗赚取第一笔钱。',
    'Oh, hello there!': '哦，你好！',
    'Not the most exciting job ever,': '这不是有史以来最令人兴奋的工作，',
    'I am George the Tutorial Chef and I\'ll guide you through the basics.': '我是指导厨师乔治，我将指导您完成所有基础操作。',
    'Hello!': '哈喽!',
    'gotta start somewhere.': '必须从某个地方开始。',
    'Alright': '好的',
    'but well,': '但是好吧,',
    'To start your restaurant you\'ll need to get some money first.': '要开始您的餐厅，您需要先获得一些钱。',
    'Sort dishes by income.': '按收入对菜肴进行排序。',
    'Same as normal Cooking, but costs 1 coupon instead.': '与正常烹饪相同，但费用为1张优惠券。',
    'Does not increase normal Cooking price.': '不会增加正常的烹饪价格。',
    'Cook for coupons.': '烹饪优惠券。',
    'Prestige restaurant?': '声望你的餐馆?',
    'Current status: inactive.': '当前状态：无效。',
    'Current food categories in your restaurant and their bonuses.': '您餐厅的当前食物类别及其奖励。',
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
    'Max Cook': '最大烹饪',
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
    'Restaurant bonuses (multipliers': '餐厅的奖励 (乘数',
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
    'Drag and drop': '拖放',
    'Every dish in restaurant menu gives bonus to all dishes of the same category.': '餐馆菜单上的每道菜都可以奖励所有相同类别的菜。',
    'Hard Reset (right click or long hold': '硬重置（右键单击或长按',
    'I\'ll give you access to this restaurant for the time of this tutorial.': '在撰写本教程时，我将为您提供这家餐厅的访问权限。',
    'Loading error. The game requires JavaScript to be enabled. Here are the <a data-brackets-id=\'160\' href=\"https://www.enable-javascript.com/\">\n instructions how to enable JavaScript in your web browser</a>': '载入错误。 游戏需要启用JavaScript。 这是<a data-brackets-id=\'160\' href=\"https://www.enable-javascript.com/\"> \ n说明，如何在网络浏览器中启用JavaScript </a>',
    'Now you have enough money to cook something.': '现在，您有足够的钱来烹饪一些东西。',
    'Sextuple Cook': '六重烹饪',
    'them to the tutorial restaurant\'s menu.': '它们到教程餐厅的菜单。',
    'They can also be replaced any time.': '它们也可以随时更换。',
    'We need to cook more.': '我们需要做更多的菜。',
    'Yes, these look nice!': '是的，这些看起来不错！',
    'your first dishes using the money you have.': '您的第一批菜就是用您所拥有的钱。',
    'You can stack them too': '您也可以堆叠它们',
    'Hard Reset (right click or long hold': '硬重置（右键单击或长按',
    'Using both hands while cooking makes it easier and faster.': '烹饪时用双手可以更轻松，更快捷地进行烹饪。',
    'we should totally try making some of them sometimes!': '我们有时应该完全尝试制作其中的一些！',
    'What a great start, some people actually came to your restaurant!': '这是一个很好的开始，真的有人来你的餐厅了!',
    'What about giving out coupons for a free meal from time to time?': '偶尔发些免费餐券怎么样?',
    'What if you start improving your standard recipes by adding new original flavors?': '如果您开始通过添加新的原始口味来改善标准食谱，该怎么办？',
    'when you want to move on to something new.': '当您想继续学习新事物时。',
    'will take me the rest of the day. And probably tomorrow too!\"': '剩下的时间会带给我。 大概明天也可以!\"',
    'with exactly 3 dishes in each (no more, no less).': '各有3个菜式（不多也不少）。',
    'Wouldn\'t it be nice to have a special way to highlight them': '有一种特殊的方式突出显示它们会不会很好',
    'Write down your recipes and keep them around so you don\'t have to google them every time.': '写下您的食谱并保留它们，以便您不必每次都用Google搜索。',
    'Yay, no more dishwashing!': '是的，不用再洗碗了！',
    'You can put labels on your sugar, salt, baking soda and flour cans so you don\'t have to identify them by taste every time.': '您可以在糖，盐，小苏打和面粉罐上贴标签，这样就不必每次都按口味来识别它们。',
    'You don\'t lose coupons on prestige.': '您不会因声望而失去优惠券。',
    'You earn one coupon every 10 minutes.': '您每10分钟可赚取一张优惠券。',
    'You feel confident enough in your abilities to try something new.': '您对尝试新事物的能力有足够的信心。',
    'You have finished your express training and ready to start.': '您已经完成了快速培训，可以开始了。',
    'You have noticed that some dishes perform better than others.': '您已经注意到，有些菜肴比其他菜肴表现更好。',
    'Your dishes are good, as good as in any other restaurant.': '您的菜肴与其他任何餐厅一样好。',
    'Your reputation grows so fast!': '你的名声增长得真快!',
    'Challenge': '挑战',
    'Challenges': '挑战',
    'Challenge accepted!': '接受挑战!',
    'Chef\'s secret technique': '厨师的秘密技术',
    'Comfy Bistro': '舒适小酒馆',
    'Corner Carpet': '角落里的地毯',
    'Cotton candy': '棉花糖',
    'Current number of coupons you have.': '您现有的优惠券数量。',
    'Dish of the Day': '今日例菜',
    'Doughnut': '油炸圈饼',
    'Egg sandwich': '鸡蛋三明治',
    'Estimated time': '预计时间',
    'Even if it\'s the same dish every day!': '即使每天都是同一道菜！',
    'Fish bagel': '鱼百吉饼',
    'Fusion soup': '融合汤',
    'Gallant Eats': '豪门美食',
    'Get 1 Prestige Booster every day.': '每天获得1个声望提升器',
    'Get a themed restaurant to start with.': '从一个主题餐厅开始。',
    'Get access to challenges. More info on Progress tab.': '获得挑战。更多信息在进度标签。',
    'Have': '有',
    'Hmm...': '嗯...',
    'How could you put even more flavors and decorations onto these dishes?': '你怎么能在这些盘子上添加更多的味道和装饰呢?',
    'In short: never trust a chinatown chef saying the dish is not too spicy.': '简而言之:永远不要相信唐人街厨师说的菜不是太辣。',
    'Increases max buff quantity by +50.': '增加最大增益数量+50。',
    'It is going to be great!': '一定会很棒的!',
    'It\'s time to show them what you are capable of!': '是时候向他们展示你的能力了!',
    'Juice': '果汁',
    'Like that one post about a chinatown fish soup.': '就像那个关于唐人街鱼汤的帖子。',
    'Look, they have so many different dishes and drinks,': '看，他们有那么多不同的菜肴和饮料，',
    'Martini': '马提尼',
    'Mastery': '精通',
    '"Max Buff': '最大增益',
    'Maxed': '已最大',
    'Milkshake': '奶昔',
    'Never know what you are going to learn next.': '永远不知道你接下来会学到什么。',
    'Now even renown restaurant owners offer you their restaurants to manage.': '现在，即使是知名的餐厅老板也会让你管理他们的餐厅。',
    'Oh hey, what about having a bigger plates to support all that?': '哦，嘿，有一个更大的盘子来支持所有这些怎么样?',
    'Once a day should be fine.': '一天一次就可以了。',
    'Onion rings': '洋葱圈',
    'Other restaurant owners started to notice your professionalism.': '其他餐馆老板开始注意到你的专业性。',
    'Oysters': '生蚝',
    'Peaceful Joint': '和平联合',
    'Perks': '津贴',
    'Pizza': '披萨',
    'possible categories in your menu': '您的菜单中可能的类别',
    'Prestige can\'t be silent, so why won\'t you start mentioning your success here and there?': '声望不能保持沉默，那么为什么不开始在这里和那里提起自己的成功呢？',
    'Prestige on export': '声望输出',
    'Prestige Points': '声望点',
    'Probably shouldn\'t do it too often so that people don\'t get too tired of it.': '大概不应该经常这样做，以免人们对此感到厌倦。',
    'Prodigious Deluxe': '极好的豪华房',
    'Reading random blog posts and articles about food could provide some good learning.': '阅读随机的博客文章和有关食品的文章可以提供一些很好的学习。',
    'Roasted chicken': '烤鸡',
    'Salad': '沙拉',
    'Science': '科学',
    'Select starter restaurant': '选择启动餐厅',
    'Shortcake': '脆饼',
    'Should definitely try that.': '绝对应该尝试一下。',
    'Shrimps n chips': '虾仁薯条',
    'some of them even offering you their restaurants to manage.': '其中一些甚至为您提供餐厅来管理。',
    'Sparkling water': '苏打水',
    'Spend them to boost time on Prestige.': '花时间来增加他们在声望上的时间。',
    'Starter Restaurants': '入门餐厅',
    'Sweet, sour, fresh or spicy - every dish has something good to add!': '甜，酸，新鲜或辛辣-每道菜都可以添加一些好东西！',
    'Taiyaki': '鲷鱼烧',
    'That\'s genius!': '这是天才!',
    'The Caterpillar Tree': '毛毛虫树',
    'They are buying, eating and drinking.': '他们正在购买，饮食和饮水。',
    'They come to you asking for advice,': '他们来找你咨询，',
    'Every Prestige Booster gives 4 hours of income.': '每个声望助推器都会带来4个小时的收入。',
    'Max Buff': '最大增益',
    'Maybe there is a way to attract more customers?': '也许有办法吸引更多的顾客？',
    'Megacook: you have 50+ coupons.': '超级烹饪：您有50+张优惠券。',
    'Mystery Pot': '神秘锅',
    'Number of Prestige Points you\'ll get and a percent of progress towards the next point.': '您将获得的声望点数，以及达到下一个点的进度百分比。',
    'Right click to switch modes.': '右键单击以切换模式。',
    'Starting Restaurants': '启动餐馆',
    'They trust you so much they are giving you full control now.': '他们如此信任你，现在让你全权掌控。',
    'This could be a great opportunity to get a head start': '这可能是抢先一步的好机会',
    'Tier 2 and 3 starters': '第2层和第3层入门',
    'Tier 3 Dishes': '第3层菜肴',
    ' Tier 3 Dishes': '第3层菜肴',
    'Time until next one': '直到下一个的时间',
    'Triples': '三元组',
    "You can change the percentage of used coupons on the Options tab.": "您可以在选项选项卡上更改使用优惠券的百分比。",
    "You gain 1 Prestige Booster every day.": "你每天获得1个声望增益器。",
    'You get charges by cooking for coupons.': '您可以通过烹饪优惠券来收取费用。',
    'A blog post, an interview for a local newspaper, honestly, anything would do.': '老实说，一篇博客文章，一份当地报纸的采访都可以。',
    'all': '全部',
    'and bring even more attention to the best ones?': '并把更多的注意力转移到最好的方面？',
    'And most importantly, enjoying it!': '最重要的是，享受它！',
    'And, yeah, working on this... err... project of taking notes of those': '是的，在做这个的时候…呃……记录这些的项目',
    'Apply some science to improve your starter restaurant.': '应用一些科学知识来改善您的启动餐厅。',
    'Boost your prestige by spending Prestige Boosters.': '花费您的声望助推器来提升您的声望。',
    'But that\'s the problem - they are exactly the same as in any other restaurant.': '但这就是问题-它们与其他任何一家餐厅都完全一样。',
    'Can you make a restaurant that fits specific criteria?': '您能做一家符合特定条件的餐厅吗？',
    'Caramel apples': '焦糖苹果',
    'Cook 12 times for the price of 10 coupons.': '以10张优惠券的价格煮12次。',
    'Current Prestige Boosters: ': '当前的声望助推器：',
    "All the unused food from your kitchen now goes to charity!": "您厨房里所有未使用的食物现在都捐给了慈善机构！",
    "Allow auto-placing buffs": "允许自动放置增益",
    "and": "和",
    "at least one drink": "至少一种饮料",
    "Blue theme": "蓝色主题",
    "BotBuySkills": "机器购买技能",
    "BotMakeDeliveries": "机器人送货",
    "but you can do it earlier if you want more action.": "但如果你想采取更多行动，你可以早点做。",
    "Charity": "慈善机构",
    "Claim": "宣称",
    "Click on the triangle to minimize.": "单击三角形以最小化。",
    "Daily backup reward": "每日备份奖励",
    "Dark theme": "深色主题",
    "Delivery": "送货",
    "Delivery current score: ": "交付当前分数：",
    "Delivery Duration": "交货时间",
    "Discord chat for hanging out": "闲逛的Discord聊天",
    "dishes.": "菜。",
    "Dishwashing": "洗碗",
    "e.g. 1e15 instead of 1 Quadrillion": "例如1e15 而不是 1 Quadrillion",
    "Every time you reach a breakpoint you can claim a reward for it.": "每次到达断点时，您都​​可以为其索取奖励。",
    "Exporting the game will load it and then  automatically prestige it once (to prevent potential exploits). Continue?": "导出游戏将加载它，然后自动对其进行一次声望（以防止潜在的漏洞利用）。继续？",
    "Food donated to charity: ": "捐赠给慈善机构的食物：",
    "For example, you can have a good restaurant with many": "例如，您可以拥有一家拥有许多",
    "For your first Prestige, it is good to get to about 10 Prestige Points,": "对于您的第一个声望，最好达到大约 10 个声望点，",
    "Gems": "宝石",
    "Goals": "目标",
    "Hard reset": "硬重置",
    "Having": "有",
    "Hello! My name is Alexander, but most people know me as 86com. I'm from Russia and I am the solo developer of this game. Hope you like it!": "你好！我的名字是亚历山大，但大多数人都知道我是 86com。我来自俄罗斯，我是这款游戏的独立开发者。希望你喜欢！",
    "Hotkey: Q": "热键：Q",
    "Hover/tap rainbow bars in the game for more info.": "悬停/点击游戏中的彩虹条以获取更多信息。",
    "Import your gamestate from the text. Automatically prestiges the game, so this is not a valid way to get better luck.": "从文本中导入你的游戏状态。自动声望游戏，因此这不是获得更好运气的有效方法。",
    "Include your email (or other contacts) if you want, otherwise I won't know how to contact you.": "如果需要，请包括您的电子邮件（或其他联系人），否则我将不知道如何与您联系。",
    "It is absolutely OK to send any kind of bug reports, even if by mistake.": "发送任何类型的错误报告都是绝对可以的，即使是错误的。",
    "left to right in main restaurant menu": "餐厅主菜单从左到右",
    "Level up!": "升级！",
    "List of available dishes": "可用菜肴列表",
    "Make delivery packages to improve your income.": "制作快递包裹以增加收入。",
    "Next breakpoint: ": "下一个断点：",
    "Next reward: ": "下一个奖励：",
    "Normal theme": "普通主题",
    "Note: full restaurant earns good money even without dishwashing.": "注意：即使没有洗碗，整间餐厅也能赚很多钱。",
    "Now you get standard 5-slot kitchen and $1000 for finishing the tutorial.": "现在您可以获得标准的 5 槽厨房和 1000 美元来完成教程。",
    "Packages only work limited time.": "套餐仅在有限的时间内有效。",
    "Pick a couple of food categories and focus on them.": "选择几个食物类别并专注于它们。",
    "Please state the following (if applicable": "请说明以下内容（如适用",
    "Prestige Booster": "威望助推器",
    "Prevent cooking when there are highlighted dishes in the kitchen": "厨房里有突出显示的菜肴时防止烹饪",
    "Put in": "投放",
    "Quantity record!": "数量记录！",
    "Report a bug": "报告错误",
    "Rewards": "奖励",
    "Right-click": "右键点击",
    "right-click).": "右键点击）。",
    "s are very important.": "s 很重要。",
    "Sextuple Cook": "六人厨师",
    "Skill Points are used to buy skills (below).": "技能点用于购买技能（下）。",
    "so you don't miss the good stuff": "所以你不会错过好东西",
    "Starter Restaurant": "开胃菜餐厅",
    "Subreddit for discussions": "讨论的子版块",
    "Thank you for helping to make this game better!": "感谢您帮助使这个游戏变得更好！",
    "That's pretty much it. You are now a certified restaurant manager!": "差不多就是这样。您现在是经过认证的餐厅经理！",
    "This tab will show history of your restaurants.": "此选项卡将显示您餐厅的历史记录。",
    "Tier-up menu animation": "分层菜单动画",
    "to file → 🗎": "归档 → 🗎",
    "Triple Cook": "三重厨师",
    "ups, etc.": "ups，等等",
    "Wash dishes to get money.": "洗碗来赚钱。",
    "When you Prestige, you restart the game with a bonus to income.": "当您获得声望时，您会以收入奖励重新开始游戏。",
    "will double your income.": "将使您的收入翻倍。",
    "You are good to go.": "你已准备好出发。",
    "You don't lose deliveries on Prestige.": "您不会在 声望 上丢失交货。",
    "You have": "你有",
    "Your gamestate will be automatically attached to the report.": "您的游戏状态将自动附加到报告中。",
    "Your report was sent. Thank you!": "您的报告已发送。谢谢！",
    "1. What's the problem?": "1. 有什么问题？",
    "2. What was expected instead? (if not obvious": "2. 期望的是什么？ （如果不明显",
    "Bonuses": "奖励",
    "Get any dish up to 10 quantity": "获得最多 10 个数量的任何菜肴",
    "Have 5 dishes in your restaurant": "在您的餐厅享用 5 道菜",
    "Hotkey: E": "快捷键：E",
    "Hotkey: W": "快捷键：W",
    "Records": "记录",
    "Sextuple Cook": "六人厨师",
    "The cost of cooking is only reset on prestige.": "烹饪费用仅根据声望重置。",
    "Top Restaurant": "顶级餐厅",
    "Triple Cook": "三重厨师",
    "(Hover/tap rainbow bars in the game for more info.": "（悬停/点击游戏中的彩虹条以获取更多信息。",
    "(seafood - vegan - drink": "（海鲜 - 素食 - 饮料",
    "Claim rewards": "收集奖励",
    "Warning": "警告",
    "you have a duplicate dish in your restaurant. Duplicates don't provide additional bonuses, so it is usually better to merge them.": "你的餐厅里有重复的菜。 重复不会提供额外的奖励，因此通常最好将它们合并。",
    "Unlock and use Supercook (2nd button": "解锁并使用 超级烹饪（第2个按钮",
    "Have 3 dishes of the same category": "拥有 3 道同类菜品",
    "Like 3 Seafood or 3 Premium dishes": "喜欢 3 道海鲜或 3 道高级菜肴",
    "Sextuple Cook": "六人厨师",
    "That may not strictly count as seafood, but it goes well with seafood-themed restaurants": "这可能不严格算作海鲜，但与海鲜主题餐厅很相配",
    "Seaweed + rice.": "海带+米饭。",
    "Good job! You can take a breather if you want!": "干得不错！ 如果你愿意，你可以喘口气！",
    "Keep in mind that the game may take many days to finish all chapters (real time).": "请记住，游戏可能需要很多天才能完成所有章节（实时）。",
    "The game saves automatically, so don't worry about that.": "游戏会自动保存，所以不用担心。",
    "Add": "添加",
    "Unlock and use Supercook (2nd button": "解锁并使用 超级烹饪（第二个按钮",
    "Unlock and use Tier Up (3rd button": "解锁并使用 层级提升（第三个按钮",
    "Unlock Delivery and make a package": "解锁交付并制作包裹",
    "You can come back any time to collect all your earnings.": "您可以随时回来领取所有收入。",
    "This game progresses at 100% speed at all times even when it's just an inactive tab of your browser.": "该游戏始终以 100% 的速度进行，即使它只是浏览器的非活动选项卡。",
    "This is an idle game after all.": "毕竟这是一款放置游戏。",
    "No need to make it a separate window.": "无需将其设为单独的窗口。",
    "It's ok to play it in short sessions, once or twice a day.": "可以短时间游戏，一天一到两次。",
    "It even works offline, after you close it. No limits.": "在您关闭它之后，它甚至可以离线工作。 无限。",
    "When Delivery Box limit is full, you'll get 1 Gift Box instead.": "当送货箱限额已满时，您将获得 1 个礼品盒。",
    "You don't lose any boxes on prestige.": "你不会失去任何盒子在声望时。",
    "You get 1 Delivery Box every 10 minutes.": "您每 10 分钟获得 1 个送货箱。",
    "Time to next box": "下一个盒子的时间",
    "Gift boxes are used to Cook additional times in a Delivery.": "礼品盒用于在交付中额外烹饪时间。",
    "Delivery boxes are used to make Deliveries.": "交货箱用于交货",
    "Also unlocks a Sort button.": "还解锁了排序按钮。",
    "and +1% permanent income bonus.": "和 +1% 的永久收入奖励。",
    "Every used 🌟 Prestige booster will give you": "每一个用过的🌟 声望 助推器都会给你",
    "Cucumber sandwich": "黄瓜三明治",
    "A local newspaper asked your permission to add": "当地一家报纸征求您的同意，以便添加",
    "\"FREE MEAL COUPON\"": "\"免费餐券\"",
    "You can prestige now to unlock the new skill, but it is recommended to wait for 10+ Prestige points first.": "您现在可以声望解锁新技能，但建议先等待10+声望点。",
    "You have washed some dishes and placed some food, and now suddenly you are a certified restaurant manager!": "您已经洗了一些盘子并放置了一些食物，现在您突然成为了一名认证的餐厅经理！",
    "Sure! What could go wrong?": "当然！ 会出什么问题？",
    "next to the photo of your restaurant.": "在您餐厅的照片旁边。",
    "Earn prestige points to finish chapters.": "赚取声望点来完成章节。",
    "Does it always happen like that?": "是不是总是这样？",
    " cupcake": "纸杯蛋糕",
    " record!": " 记录!",
    "\t\t\t\tprogress\n\t\t\t": "\t\t\t\t进度\n\t\t\t",
    "(drink - premium - cheap": "（饮料 - 高级 - 便宜",
    "Base score": "基础分数",
    "Cook new dishes for delivery.": "烹制新菜以供外卖。",
    "Delivery bonuses (multipliers": "交付奖励（乘数",
    "Dish score": "菜肴评分",
    "These rainbow bars show your progress towards the next Prestige Point.": "这些彩虹条显示了您在下一个声望点上的进度。",
    "Total score": "总分",
    "Main themes: Cheap, Seafood (doesn't affect anything outside that delivery": "主题：便宜，海鲜（不影响交付以外的任何东西",
    "You don't lose deliveries on prestige.": "你不会因为声望而失去交货。",
    "Time left": "时间剩余",
    "Additional income you get from deliveries.": "您从送货中获得的额外收入。",
    "Finish the delivery and put it in the specified slot at the top of the screen.": "完成交付并将其放入屏幕顶部的指定插槽中。",
    "Main themes: Cheap, Drink (doesn't affect anything outside that delivery": "主题：便宜，饮料（不影响交付之外的任何内容",
    "Sort dishes in delivery.": "在交付时对菜肴进行分类。",
    "to available dishes.": "到可用的菜肴。",
    "Yellow glow means your next prestige will double your income (or even more).": "黄色光芒意味着你的下一个声望将使你的收入翻倍（甚至更多）。",
    "Hotkey: D": "快捷键: D",
    "Fill all 3 delivery slots": "填满所有 3 个交货位置",
    "Cook 1": "烹饪 1",
    "Main themes: Vegan, Dessert (doesn't affect anything outside that delivery": "主题：素食，甜点（不影响交付之外的任何内容",
    "Prestige your restaurant": "声望你的餐馆",
    "Get 10 Prestige Points for the next Prestige (Rainbow bars below": "为下一个声望获得 10 声望点数（下方的彩虹条",
    "(premium - drink - cheap": "（高级 - 饮料 - 便宜",
    "Buff of the same type stack, buffs of different types multiply between each other.": "相同类型的buff叠加，不同类型的buff相互叠加。",
    "It shows up to 20 latest restaurants, but only the ones that earned Prestige Points.": "它显示多达 20 家最新的餐厅，但仅显示那些获得声望点数的餐厅。",
    "Mark restaurants as Favourite if you don't want them to ever get deleted.": "如果您不希望餐厅被删除，请将其标记为收藏。",
    "Next: Exotic Flavours every 3 Supercooks for money": "下一个： 每 3 个 超级烹饪 的异国风味",
    "This tab shows the history of your restaurants.": "此选项卡显示您餐厅的历史记录。",
    "Cook 6 times for the price of 5 coupons.": "以 5 张优惠券的价格烹饪 6 次。",
    "Get 30 total Prestige Points": "总共获得 30 点声望点",
    "Hotkey: A": "快捷键: A",
    "Hotkey: S": "快捷键: S",
    "Infinity": "无限",
    "Use coupons to cook for free.": "使用优惠券免费烹饪。",
    "You don't lose coupons on Prestige.": "您不会在 声望 时丢失优惠券。",
    "Exotic flavors": "异国风味",
    "Drag and drop on any dish to improve it.": "拖放任何菜肴以改进它。",
    "Delivery Tier": "交货层级",
    "Next: Food Decorations every 5 Supercooks for money": "下一个： 每 5 次 超级烹饪 的食品装饰物以换取金钱",
    "Main themes: Seafood, Drink (doesn't affect anything outside that delivery": "主题：海鲜、饮料（不影响交付以外的任何内容",
    "Upgrades the tier of dishes for the deliveries.": "升级外卖菜肴的等级。",
    "Adds a mode to cook 2 times in one click.": "添加一键烹饪 2 次的模式。",
    "Adds Charity tab to the Info page.": "将慈善标签添加到信息页面。",
    "Adds Tier 3 dishes.": "添加第 3 层菜肴。",
    "Same as normal Cooking, but costs coupons instead.": "与普通烹饪相同，但需要使用优惠券。",
    "(cheap - seafood - premium": "（便宜 - 海鲜 - 高级",
    " for coupons.": "使用优惠券",
    "Main themes: Fastfood, Meat (doesn't affect anything outside that delivery": "主题：快餐、肉类（不影响交付以外的任何内容",
    "Main themes: Meat, Fastfood (doesn't affect anything outside that delivery": "主题：肉类、快餐（不影响交付以外的任何内容",
    "Main themes: Seafood, Premium (doesn't affect anything outside that delivery": "主题：海鲜、高级（不影响交付之外的任何内容",
    "Main themes: Seafood, Cheap (doesn't affect anything outside that delivery": "主题：海鲜，便宜（不影响交付之外的任何东西",
    "and swipe right to add them to your list of favourites.": "并向右滑动以将它们添加到您的收藏夹列表中。",
    "If it's still slower than a day for you, you might need to readjust your strategy or seek advice on Reddit.": "如果对您来说仍然比一天慢，您可能需要重新调整策略或在 Reddit 上寻求建议。",
    "Keep in mind that Coupons earned during the day could greatly speed up your progress, so even if it looks slow now, it'll be faster later.": "请记住，白天获得的优惠券可以大大加快您的进度，因此即使现在看起来很慢，但以后会更快。",
    "Now you spend many hours on it every day, but hey, at least you've got a lot of new dish ideas!": "现在你每天都花很多时间在上面，但是，嘿，至少你有很多新的菜肴创意！",
    "Prestige to unlock new skills.": "声望解锁新技能。",
    "Sweet, sour, fresh or spicy - every dish has something good to add.": "甜的、酸的、新鲜的或辛辣的——每道菜都有一些很好的补充。",
    "The game is balanced so that it is always possible to at least double your Prestige Points every day (and much faster in the beginning).": "游戏是平衡的，因此每天至少可以使您的声望点数翻倍（并且在开始时要快得多）。",
    "Well, ok, maybe not broccoli.": "好吧，好吧，也许不是西兰花。",
    "You can make anything tasty, even broccoli!": "你可以做任何美味的东西，甚至是西兰花！",
    "You found a website called Foodinder where you can find infinite recipes and pictures of food": "您找到了一个名为 Foodinder 的网站，在那里您可以找到无限的食谱和食物图片",
    "(vegan - premium - dessert": "（素食 - 高级 - 甜点",
    "3 Dishes": "3 菜肴",
    "Although most drinks are vegan, this one is the best fit for the theme.": "虽然大多数饮料都是纯素的，但这一款最适合这个主题。",
    "Coconut cocktail": "椰子鸡尾酒",
    "Sausages": "香肠",
    "Well, it's not technically from the sea, but don\t tell anyone.": "好吧，从技术上讲，它不是来自大海，但不要告诉任何人。",
    " skewer": "串烧",
    "Main themes: Meat, Cheap (doesn't affect anything outside that delivery": "主题：肉类，便宜（不影响交付之外的任何内容",
    "Main themes: Drink, Dessert (doesn't affect anything outside that delivery": "主题：饮料、甜点（不影响交付之外的任何内容",
    "Main themes: Premium, Dessert (doesn't affect anything outside that delivery": "主题：高级，甜点（不影响交付之外的任何内容",
    "all the stuff that was cooked and then not used.": "所有煮熟然后没有使用的东西。",
    "Definitely need to read some more about those.": "绝对需要阅读更多关于这些的内容。",
    "deliveries have a random set of available dishes every time.": "每次送货都有一组随机的可用菜肴。",
    "Use \"List of available dishes\" when making a delivery to check them out.": "送货时使用“可用菜肴列表”查看。",
    "Well, looks like you'll have to find some other direction to send all that food to.": "好吧，看起来你必须找到其他方向才能将所有食物送到那里。",
    "What about charities? Food banks, soup kitchens?": "慈善机构呢？ 食物银行、施粥所？",
    "Your chef complains that it gets hard for him to always eat": "你的厨师抱怨他很难一直吃",
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
    "": "",
    "": "",
    "": "",
    "": "",

    //原样
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
    "\t\t\t\t\t\n\t\t\t\t\t": "\t\t\t\t\t\n\t\t\t\t\t",
    "\t\t\t\t\n\t\t\t": "\t\t\t\t\n\t\t\t",
    "\t\t\t\t\t\t  ": "\t\t\t\t\t\t  ",
    "\t\t\t\t\t\t": "\t\t\t\t\t\t",
    "\t\t\t\t\t": "\t\t\t\t\t",
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
    "Tier ": "层级 ",
    "Max Cook Qty:": "最大烹饪数量：",
    "Max Dish Level:": "最高菜肴等级：",
    "Min Cook Qty:": "最小烹饪数量：",
    "Mult:": "加成:",
    "New (": "新 (",
    "Premium": "高级",
    "Active": "激活",
    "Dishwashing ": "洗盘子 ",
    "Email:": "邮箱:",
    "Buy": "购买",
    "Quantity:": "数量:",
    'Hard Reset (right click or long hold': '硬重置（右键单击或长按',
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
    " (prestiges the game)": " ",
    " gives bonus to seafood, cheap gives bonus to cheap, etc.": "给海鲜带来好处，给便宜带来好处，等等。",
    "shift-click).": "shift-点击).",
    "Unlocks skill: ": "解锁技能: ",
    "Chapter ": "章节 ",
    "Infinity:": "无限:",
    "Mastery ": "精通 ",
    "Max Buff Qty: ": "最大增益数量: ",
    "PP: ": "声望点: ",
    "Reward: ": "奖励: ",
    "Unlocks at": "解锁于",
    "Coupons used: ": "使用的优惠券：",
    "Progress: ": "进度: ",
    "You have:": "你有:",
    "Delivery current score:": "交付当前分数：",
    "Available Skill Points:": "可用技能点：",
    "Food donated to charity:": "捐赠给慈善机构的食物：",
    "Total Prestige Points:": "总声望点数：",
    "Next breakpoint:": "下一个断点：",
    "Next reward:": "下一个奖励：",
    "On prestige you'll get:": "在声望中，您将获得：",
    "Unlockable skill:": "可解锁技能：",
    "Current bonus:": "当前奖励：",
    "Free cooks left:": "免费烹饪剩余：",
    "Score:": "分数:",
    "Multiplier:": "乘数:",
    "Base Income:": "基础收入：",
    "Total Income:": "总收入：",
    "Bonus from Deliveries:": "交货奖励：",
    "Resulting income:": "所得收入：",
    "Click here (opens new tab) Reward:": "点击这里（打开新标签）奖励：",
    "Effect:": "效果:",
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
    "(Max": "(最大",
    "(prestiges the game)\n\t\t\t\t": "(声望游戏)\n\t\t\t\t",
    'Sextuple Cook': '六重烹饪',
    'Hard Reset (right click or long hold': '硬重置（右键单击或长按',
    "(capped until 10 Prestige Points": "（上限为 10 声望点",
    "(Restaurant Income).": "(餐厅收入).",
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
    "per second": "每秒",
    " hours of additional progress for this prestige": " 小时此声望的额外进度",
    "Percent of coupons used": "使用的优惠券百分比",
    "Make delivery packages to improve your income.": "制作快递包裹以增加收入。",
    "You don't lose deliveries on Prestige.": "在 声望 时，您不会丢失交货。",
    'total Prestige Points.': '总声望点数。',
    "Skill Points.": "技能点。",
    "Prestige Points. Continue?": "声望点。继续？",
    "points": "点数",
    'Dark Mode': ' 深色模式',
    'Engineering-exponential notation': '工程指数符号',
    "Percent of coupons on MegaCook": "超级烹饪的优惠券百分比",
    " Thousand": " 千",
    'Whenever you get': '每当你得到',
    'on the right →': '在右边→',
    'When you Prestige, you restart the game to get Prestige Points and ': '当您获得声望时，您可以重新启动游戏以获得声望点和',
    'You can spend gems on ingame purchases': '您可以在游戏中购买宝石',
    'Prestige Points increase your total income by 10% each.': '声望点可将您的总收入提高10％。',
    "(Hover over skills and rainbow bar at the main screen to see more descriptions.": "（将鼠标悬停在主屏幕上的技能和彩虹条上可查看更多说明。",
    'Skill Points are used to buy skills below.': '技能点数用于购买以下技能。',
}

//需排除的，正则匹配
var cnExcludeWhole = [
    /^ (\d+)$/,
    /^(\d+)$/,
    /^\t(.+)\t$/,
    /^([\d\.]+)$/,
    /^免费烹饪剩余： ([\d\.]+)$/,
    /^ ([\d\.]+)M\$$/,
    /^ ([\d\.]+)k\$$/,
    /^数量: ([\d\.]+)$/,
    /^([\d\.]+) Billion$/,
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
    [/^(.+) hour, (.+) efficiency$/, '$1 小时，效率 $2'],
    [/^(.+) hours, (.+) efficiency$/, '$1 小时，效率 $2'],
    [/^(.+)\(prestiges the game$/, '（对游戏进行声望'],
    [/^(.+)\(prestiges the game\)(.+)$/, '进行声望'],
    [/^(.+)Hard Reset \(right click or long hold(.+)$/, '硬重置（右键单击或长按'],
    [/^(.+) \(will give (.+) income$/, '$1（将提供 $2 的收入'],
    [/^s left for Exotic Flavors: (.+)$/, '留给异国风味：$1'],
    [/^s left for Food Decorations: (.+)$/, '留给食物装饰：$1'],
    [/^s left for Original Idea: (.+)$/, '最初的想法：$1'],
    [/^Cook \((\d+) left$/, '烹饪 （$1 剩余'],
    [/^Get (.+) total Prestige Points$/, '总共获得 $1 声望点'],
    [/^Double(.+)Cook$/, '双重烹饪'],
    [/^Earn(.+)Prestige(.+)Points(.+)to(.+)unlock(.+)more(.+)Skills.$/, '赚取声望点来解锁更多技能。'],
    [/^(.+)Prestige(.+)Points.(.+)The(.+)cooking(.+)costs(.+)will(.+)be(.+)reset.(.+)Continue?$/, '声望点。 烹饪费用将被重置。 继续？'],
    [/^Have (\d+)k$/, '拥有 $1k'],
    [/^Have (\d+)B$/, '拥有 $1k'],
    [/^Have (\d+)Qa$/, '拥有 $1k'],
    [/^Have (\d+)M$/, '拥有 $1M'],
    [/^Get any dish up to (\d+) quantity$/, '获得多达 $1 个任何菜肴'],
    [/^(\d+) Points$/, '$1 点'],
    [/^slot (\d+)$/, '插槽 $1'],
    [/^Delivery (\d+)$/, '送货 $1'],
    [/^Start (\d+)$/, '开始 $1'],
    [/^(\d+) kreds$/, '$1 kreds'],
    [/^Unlocks(.+)at(.+)$/, '解锁于 $2'],
    [/^Categories with (\d+) dishes\: (\d+)\/(\d+)$/, '$1种菜式：$2\/$3'],
    [/^(.+)Sextuple Cook(.+)$/, '六重烹饪'],
    [/^(.+)On prestige you\'ll get:(.+)$/, '进行声望，您将获得：'],
    [/^(.+)Available Skill Points:(.+)$/, '可用技能点：'],
    [/^(.+)Total Prestige Points:(.+)$/, '总声望点：'],
    [/^(\d+) Royal points$/, '$1 皇家点数'],
    [/^Cost: (\d+) RP$/, '成本：$1 皇家点数'],
    [/^Usages: (\d+)\/$/, '用途：$1\/'],
    [/^workers: (\d+)\/$/, '工人：$1\/'],

]);