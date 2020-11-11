'use strict';
window.localStorage.setItem('test', 'test');
if (window.localStorage.getItem('test') !== 'test') {
	$('#loading').html('Error: failed to write to local storage. This game uses local storage to save progress so it will not work if local storage is blocked by incognito mode or plugins.');
}

if (window.localStorage.getItem('history') === undefined) {
	window.localStorage.setItem('history', '');
}
	let descInterval = '';
	let intervalScience = '';
	let everySec = '';
	let descFadeOutTimeOut = '';
	let startTime = Date.now();
	let pings = 0;
	let compensatedPings = 0;
	let dishwashingOpen = true;
	let cooksTotal = 0;
	let descFadeout = false;
	let currentScreen = 'game';
	let gameState = 'normal';
	let mealOfTheDayActive = false;	
	const PRESTIGE_BOOST_BREAKPOINT = 24*60*60; // 1 booster a day
	const PRESTIGE_BOOST_VALUE = 4*60*60; // 4 hours for booster
	let v = {}; // game variables
	v.version = 101;
	v.tutorialLevel = 'greetings0'; // where in the tutorial the player currently is
	v.money = 0;
	v.coupons = 0;
	v.couponShards = 0;
	v.couponShardsBreakpoint = 600; // 600 seconds for coupon
	v.refreshPrice = 300;
	v.activeIncome = 0;	
	v.storeSlots = 5;
	v.kitchenSlots = 5;
	v.restaurantName = '';
	v.activeIncomeMultiplier = 1;
	v.cookCount = 0; // number of times player cooked
	v.moneySuperCookCount = 0; // number of times player used Super Cook for money
	
	v.cookCouponsCount = 0;
	v.currentCookMode = 1;
	v.incomeBreakpoint = 900;
	v.fireworkN = 1; // to cycle through firework animations
	v.activeFood = []; // will put here only Tier 1 to start the game
	v.newFood = []; // non tier-1 food for unlocking
	v.foodClasses = {}; // to store food classes in the current restaurant, i.e. "3 肉类, 2 快餐, etc."
	v.hasDuplicates = false; // to store true if there is a duplicate dish
	v.skills = {}; // to store current active skills
	v.skills.minCook = 1;
	v.skills.maxCook = 2;
	v.skills.maxLevel = 4;
	v.skills.maxBuff = 1;
	v.perks = []; // to store current active perks
	v.exhaustedPerks = []; // to store perks that should no longer be offered
	v.newPerks = []; // perks that can be aquired
	v.discontinueTokens = 0;
	v.scienceCategory = ''; // Currently applied science category
	v.options = { animations: true }; // to store current options
	v.options.megacookPercent = 20;
	v.prestigePointCost = 2.5*1000*1000; 
	v.prestigePointMoneyEarned = 0;
	v.prestigePointsTotal = 0;
	v.skillPointsUnspent = 0;
	v.prestigePointsToGet = 0; //how much PP you get when you reset (not counting boosts)
	v.prestigeBoosters = 1;
	v.prestigeBoosterTimeLeft = PRESTIGE_BOOST_BREAKPOINT;
	
	let paid = {}; // paid stuff
	paid.gems = 0;
	paid.gems_spent = 0;
	paid.gems_from_challenges = 0;
	paid.gems_last_operation = 0;
	paid.triple_choice = false;
	paid.awarded_triple_choice = false;
	paid.awarded_gems = 0;
	paid.claimed_gems = 0;
	
	let debug = {tt10: 0, tt30: 0, tt70:0};
	let dishwashing = {}; // dishwashing variables
	dishwashing.dirty = [GetRandomInt(1,9),GetRandomInt(1,9),GetRandomInt(1,9),GetRandomInt(1,9),GetRandomInt(1,9)];
	dishwashing.sink = '';
	dishwashing.clean = ['','','','',''];

	const defaultSkillStats = {};

	defaultSkillStats.minCook				={visible_at: 0,			active_at: 15,			name:'烹饪下限', levels: [0, 0, 15, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000],
	desc: '提高烹饪数量下限 +1.'};
	defaultSkillStats.maxCook				={visible_at: 0,			active_at: 5,			name:'烹饪上限', levels: [0, 0, 0, 5, 15, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000],
	desc: '提高烹饪数量上限 +1.'};
	defaultSkillStats.maxLevel				={visible_at: 0,			active_at: 2,			name:'等级上限', levels: [0, 0, 0, 0, 0, 2, 25, 100, 250, 500, 1000, 10000, 100000],
	desc: '提高菜肴等级上限 +1.'};
	
	defaultSkillStats.coupons				={visible_at: 0,			active_at: 2,			name:'优惠券', levels: [0, 2],
	desc: '用优惠券提升你的餐馆.<br>你每10分钟获得1张优惠券.<br>优惠劵可以免费烹饪.<br>还提供了一个免费的排序按钮.'};	
	defaultSkillStats.buffs					={visible_at: 0,			active_at: 10,			name:'增益', levels: [0, 1, 10, 75],
	desc: '为超级烹饪的结果增加一个增益值.<br>增益可以添加到任意菜肴中来提高它的收入. <br>每个等级添加一个新的增益类型.'};
	
	defaultSkillStats.tier3food				={visible_at: 10,			active_at: 25,			name:'3阶菜肴', levels: [0, 5],
	desc: '添加3阶菜肴.'};
	defaultSkillStats.cook2					={visible_at: 10,			active_at: 30,			name:'双倍烹饪', levels: [0, 2],
	desc: '添加一次点击烹饪2次模式.'};	
	
	defaultSkillStats.prestigeBoosters		={visible_at: 30,			active_at: 50,			name:'重生助益', levels: [0, 1],
	desc: '每天获得1重生助益. <br>使用它们可以推动重生时间.'};	
	defaultSkillStats.starterRestaurants	={visible_at: 30,			active_at: 70,			name:'初始餐馆', levels: [0, 1],
	desc: '获得一家主题餐厅作为开始.'};
	
	defaultSkillStats.maxBuff				={visible_at: 70,			active_at: 100,			name:'增益上限', levels: [0, 0, 15, 100],
	desc: '提高增益数量上限 +50.'};
	defaultSkillStats.perks					={visible_at: 70,			active_at: 150,			name:'特权', levels: [0, 5],
	desc: '每次升阶时选择一个新特权.'};
	
	defaultSkillStats.cook3					={visible_at: 150,			active_at: 225,			name:'三倍烹饪', levels: [0, 5],
	desc: '添加一次点击烹饪3次模式.'};
	defaultSkillStats.challenges			={visible_at: 150,			active_at: 280,			name:'挑战', levels: [0, 5],
	desc: '获得挑战权限.更多信息见进度面板.'};
	defaultSkillStats.tier2_3starter		={visible_at: 150,			active_at: 310,			name:'2阶和3阶初始', levels: [0, 5],
	desc: '添加2阶和3阶菜肴到初始餐馆.'};
	
	defaultSkillStats.dishOfTheDay			={visible_at: 310,			active_at: 630,			name:'当日菜', levels: [0, 5],
	desc: '突出你餐厅的主菜,给它双倍的收入.'};	
		
	defaultSkillStats.cook6					={visible_at: 630,			active_at: 950,			name:'六倍烹饪', levels: [0, 5],
	desc: '添加一次点击烹饪6次模式.'};	
	
	defaultSkillStats.science				={visible_at: 630,			active_at: 1270,		name:'科学', levels: [0, 5],
	desc: '运用一些科学来改良你的初始餐馆.'};	
	
	defaultSkillStats.mealOfTheDay			={visible_at: 1270,			active_at: 2000,		name:'一日之餐', levels: [0, 5],
	desc: '突出你餐厅的主菜,给它三重倍的收入.<br>餐食包括:<br>- 主菜(不是甜品或饮料)<br>- 甜品<br>- 饮料<br>(覆盖当日菜加成)'};
	
	defaultSkillStats.novelty				={visible_at: 2000,			active_at: 3500,		name:'新奇奖励', levels: [0, 500],
	desc: '下次重生时较少使用的食物类别获得加成.<br><br>更多见信息/餐馆面板.'};
	
	defaultSkillStats.fasterCoupons			={visible_at: 2000,			active_at: 7000,		name:'电子优惠券', levels: [0, 1000],
	desc: '将获得优惠券的时间减半.<br><br><br>这是(当前)游戏的最终技能.<br><br>'};
	
	const defaultPerkStats = {};
	defaultPerkStats.disc1 		={prerequisite: '', name: '<span>🚫</span> 停止<br>上菜',	
									desc: '获得<b>1</b>停止代币停止烹饪某道菜(在信息面板使用).', 
									target: '', effect: 1};
	defaultPerkStats.disc2 		={prerequisite: 'disc1', name: '<span>🚫</span> 停止<br>上菜2',	
									desc: '获得<b>1</b>停止代币停止烹饪某道菜(在信息面板使用).',
									target: '', effect: 1};
	defaultPerkStats.disc3 		={prerequisite: 'disc2', name: '<span>🚫</span> 停止<br>上菜3',	
									desc: '获得<b>2</b>停止代币s停止烹饪某道菜(在信息面板使用).', 
									target: '', effect: 2};
									
	defaultPerkStats.coupons1 	={prerequisite: 'del', 		name: '<span>🔖</span> 瞬时<br>优惠券',		desc: '立即获得<b>10</b>优惠券.', 
									target: '', effect: 10};
	defaultPerkStats.coupons2 	={prerequisite: 'del', name: '<span>🔖</span> 瞬时<br>优惠券2',	desc: '立即获得<b>25</b>优惠券.', 
									target: '', effect: 25};
	defaultPerkStats.coupons3 	={prerequisite: 'del', name: '<span>🔖</span> 瞬时<br>优惠券3',	desc: '立即获得<b>50</b>优惠券.', 
									target: '', effect: 50};	
									
	defaultPerkStats.allFood1 	={prerequisite: '',			name: '<span>🍲</span> 所有菜肴<br>精通',	desc: '获得<b>+5%</b>所有菜肴收益.', 
									target: 'all', effect: 5};
	defaultPerkStats.allFood2 	={prerequisite: 'allFood1', name: '<span>🍲</span> 所有菜肴<br>精通2',desc: '获得<b>+10%</b>所有菜肴收益.', 
									target: 'all', effect: 10};
	defaultPerkStats.allFood3 	={prerequisite: 'allFood2', name: '<span>🍲</span> 所有菜肴<br>精通3',desc: '获得<b>+25%</b>所有菜肴收益.', 
									target: 'all', effect: 25};	
									
	defaultPerkStats.肉类1 		={prerequisite: '',			name: '<span>🍖</span> 肉类<br>精通',		desc: '获得<b>+10%</b>肉类菜肴收益.', 
									target: '肉类', effect: 10};
	defaultPerkStats.肉类2 		={prerequisite: '肉类1',	name: '<span>🍖</span> 肉类<br>精通2',		desc: '获得<b>+25%</b>肉类菜肴收益.', 
									target: '肉类', effect: 25};
	defaultPerkStats.肉类3 		={prerequisite: '肉类2',	name: '<span>🍖</span> 肉类<br>精通3',		desc: '获得<b>+50%</b>肉类菜肴收益.', 
									target: '肉类', effect: 50};
									
	defaultPerkStats.素食1 	={prerequisite: '',			name: '<span>🌿</span> 素食<br>精通',		desc: '获得<b>+10%</b>素食菜肴收益.', 
									target: '素食', effect: 10};
	defaultPerkStats.素食2 	={prerequisite: '素食1',	name: '<span>🌿</span> 素食<br>精通2',		desc: '获得<b>+25%</b>素食菜肴收益.', 
									target: '素食', effect: 25};
	defaultPerkStats.素食3 	={prerequisite: '素食2',	name: '<span>🌿</span> 素食<br>精通3',		desc: '获得<b>+50%</b>素食菜肴收益.', 
									target: '素食', effect: 50};	
									
	defaultPerkStats.海鲜1 	={prerequisite: '',		name: '<span>🐟</span> 海鲜<br>精通',		desc: '获得<b>+10%</b>海鲜菜肴收益.', 
									target: '海鲜', effect: 10};
	defaultPerkStats.海鲜2 	={prerequisite: '海鲜1',	name: '<span>🐟</span> 海鲜<br>精通2',desc: '获得<b>+25%</b>海鲜菜肴收益.', 
									target: '海鲜', effect: 25};
	defaultPerkStats.海鲜3 	={prerequisite: '海鲜2',	name: '<span>🐟</span> 海鲜<br>精通3',desc: '获得<b>+50%</b>海鲜菜肴收益.', 
									target: '海鲜', effect: 50};
									
	defaultPerkStats.快餐1 	={prerequisite: '',			name: '<span>🍔</span> 快餐<br>精通',desc: '获得<b>+10%</b>快餐菜肴收益.', 
									target: '快餐', effect: 10};
	defaultPerkStats.快餐2 	={prerequisite: '快餐1',name: '<span>🍔</span> 快餐<br>精通2',	desc: '获得<b>+25%</b>快餐菜肴收益.', 
									target: '快餐', effect: 25};
	defaultPerkStats.快餐3 	={prerequisite: '快餐2',name: '<span>🍔</span> 快餐<br>精通3',	desc: '获得<b>+50%</b>快餐菜肴收益.', 
									target: '快餐', effect: 50};
									
	defaultPerkStats.甜品1 	={prerequisite: '',			name: '<span>🍰</span> 甜品<br>精通',	desc: '获得<b>+10%</b>甜品菜肴收益.', 
									target: '甜品', effect: 10};
	defaultPerkStats.甜品2 	={prerequisite: '甜品1',	name: '<span>🍰</span> 甜品<br>精通2',desc: '获得<b>+25%</b>甜品菜肴收益.', 
									target: '甜品', effect: 25};
	defaultPerkStats.甜品3 	={prerequisite: '甜品2',	name: '<span>🍰</span> 甜品<br>精通3',desc: '获得<b>+50%</b>甜品菜肴收益.', 
									target: '甜品', effect: 50};	
									
	defaultPerkStats.廉价1 	={prerequisite: '',			name: '<span>💵</span> 廉价<br>精通',		desc: '获得<b>+10%</b>廉价菜肴收益.', 
									target: '廉价', effect: 10};
	defaultPerkStats.廉价2 	={prerequisite: '廉价1',	name: '<span>💵</span> 廉价<br>精通2',		desc: '获得<b>+25%</b>廉价菜肴收益.', 
									target: '廉价', effect: 25};
	defaultPerkStats.廉价3 	={prerequisite: '廉价2',	name: '<span>💵</span> 廉价<br>精通3',		desc: '获得<b>+50%</b>廉价菜肴收益.', 
									target: '廉价', effect: 50};	
									
	defaultPerkStats.高价1 	={prerequisite: '',			name: '<span>💳</span> 高价<br>精通',	desc: '获得<b>+10%</b>高价菜肴收益.', 
									target: '高价', effect: 10};
	defaultPerkStats.高价2 	={prerequisite: '高价1',	name: '<span>💳</span> 高价<br>精通2',desc: '获得<b>+25%</b>高价菜肴收益.', 
									target: '高价', effect: 25};
	defaultPerkStats.高价3 	={prerequisite: '高价2',	name: '<span>💳</span> 高价<br>精通3',desc: '获得<b>+50%</b>高价菜肴收益.', 
									target: '高价', effect: 50};
									
	defaultPerkStats.饮料1 	={prerequisite: '',			name: '<span>🍸</span> 饮料<br>精通',		desc: '获得<b>+10%</b>饮料收益.', 
									target: '饮料', effect: 10};
	defaultPerkStats.饮料2 	={prerequisite: '饮料1',	name: '<span>🍸</span> 饮料<br>精通2',		desc: '获得<b>+25%</b>饮料收益.', 
									target: '饮料', effect: 25};
	defaultPerkStats.饮料3 	={prerequisite: '饮料2',	name: '<span>🍸</span> 饮料<br>精通3',		desc: '获得<b>+50%</b>饮料收益.', 
									target: '饮料', effect: 50};

	const defaultFoodStats = {};

	// Tier 1 (3x every class)	
	defaultFoodStats.banana_sandwich		={class_a:'素食',			class_b:'甜品',		baseIncome: 1};//+
	defaultFoodStats.chicken_nuggets		={class_a:'肉类',			class_b:'快餐',		baseIncome: 1};//+		
	defaultFoodStats.coffee					={class_a:'饮料',			class_b:'高价',		baseIncome: 1};//+	
	defaultFoodStats.cupcake				={class_a:'甜品',		class_b:'高价',		baseIncome: 1};//+	
	defaultFoodStats.eggs_and_bacon			={class_a:'肉类',			class_b:'廉价',		baseIncome: 1};//+
	defaultFoodStats.french_fries			={class_a:'素食',			class_b:'快餐',		baseIncome: 1};//+	
	defaultFoodStats.hamburger				={class_a:'肉类',			class_b:'快餐',		baseIncome: 1};//+
	defaultFoodStats.local_soda				={class_a:'饮料',			class_b:'廉价',		baseIncome: 1};//+
	defaultFoodStats.rice_ball				={class_a:'素食',			class_b:'海鲜',		baseIncome: 1};//+
	defaultFoodStats.shrimp_tartlet			={class_a:'海鲜',		class_b:'高价',		baseIncome: 1};//+	
	defaultFoodStats.sushi_rolls			={class_a:'海鲜',		class_b:'廉价',		baseIncome: 1};//+
	defaultFoodStats.yoghurt				={class_a:'饮料',			class_b:'甜品',		baseIncome: 1};//+
	
	defaultFoodStats.exotic_flavors			={class_a:'buff',			class_b:'buff',			baseIncome: 1};//+

	// Tier 2
	defaultFoodStats.beer					={class_a:'饮料',			class_b:'廉价',		baseIncome:2};//+
	defaultFoodStats.cake_roll				={class_a:'甜品',		class_b:'高价',		baseIncome:2};//+
	defaultFoodStats.crab					={class_a:'海鲜',		class_b:'高价',		baseIncome:2};//+
	defaultFoodStats.croissant				={class_a:'甜品',		class_b:'高价',		baseIncome:2};//+	
	defaultFoodStats.fish_soup				={class_a:'海鲜',		class_b:'廉价',		baseIncome:2};//+	
	defaultFoodStats.fried_fish				={class_a:'海鲜',		class_b:'高价',		baseIncome:2};//+
	defaultFoodStats.hotdog					={class_a:'肉类',			class_b:'快餐',		baseIncome:2};//+
	defaultFoodStats.icecream				={class_a:'甜品',		class_b:'廉价',		baseIncome:2};//+		
	defaultFoodStats.lime_cocktail			={class_a:'饮料',			class_b:'高价',		baseIncome:2};//+
	defaultFoodStats.mixed_nuts				={class_a:'素食',			class_b:'高价',		baseIncome:2};//+
	defaultFoodStats.mojito					={class_a:'饮料',			class_b:'廉价',		baseIncome:2};//+	
	defaultFoodStats.poultry_legs			={class_a:'肉类',			class_b:'快餐',		baseIncome:2};//+
	defaultFoodStats.popcorn				={class_a:'素食',			class_b:'廉价',		baseIncome:2};//+
	defaultFoodStats.sandwich				={class_a:'肉类',			class_b:'快餐',		baseIncome:2};//+	
	defaultFoodStats.steak					={class_a:'肉类',			class_b:'高价',		baseIncome:2};//+
	defaultFoodStats.seasoned_fish			={class_a:'海鲜',		class_b:'廉价',		baseIncome:2};//+
	defaultFoodStats.taco					={class_a:'肉类',			class_b:'廉价',		baseIncome:2};//+	
	defaultFoodStats.tea					={class_a:'饮料',			class_b:'廉价',		baseIncome:2};//+	
	defaultFoodStats.vegan_cupcake			={class_a:'素食',			class_b:'甜品',		baseIncome:2};//+
	defaultFoodStats.wine					={class_a:'饮料',			class_b:'高价',		baseIncome:2};//+

	defaultFoodStats.food_decoration		={class_a:'buff',			class_b:'buff',			baseIncome:2};//+


	// Tier 3 
	defaultFoodStats.caramel_apples			={class_a:'素食',			class_b:'甜品',		baseIncome:4};//+	
	defaultFoodStats.cotton_candy			={class_a:'甜品',		class_b:'廉价',		baseIncome:4};//+
	defaultFoodStats.doughnut				={class_a:'甜品',		class_b:'快餐',		baseIncome:4};//+		
	defaultFoodStats.fish_bagel				={class_a:'海鲜',		class_b:'廉价',		baseIncome:4};//+	
	defaultFoodStats.egg_sandwich			={class_a:'快餐',		class_b:'廉价',		baseIncome:4};//+
	defaultFoodStats.juice					={class_a:'饮料',			class_b:'素食',		baseIncome:4};//+
	defaultFoodStats.martini				={class_a:'饮料',			class_b:'高价',		baseIncome:4};//+
	defaultFoodStats.meat_skewer			={class_a:'肉类',			class_b:'廉价',		baseIncome:4};//+
	defaultFoodStats.milkshake				={class_a:'饮料',			class_b:'快餐',		baseIncome:4};//+
	defaultFoodStats.onion_rings			={class_a:'素食',			class_b:'快餐',		baseIncome:4};//+	
	defaultFoodStats.oysters				={class_a:'海鲜',		class_b:'高价',		baseIncome:4};//+
	defaultFoodStats.pizza					={class_a:'肉类',			class_b:'快餐',		baseIncome:4};//+
	defaultFoodStats.roasted_chicken		={class_a:'肉类',			class_b:'高价',		baseIncome:4};//+
	defaultFoodStats.shortcake				={class_a:'甜品',		class_b:'高价',		baseIncome:4};//+
	defaultFoodStats.salad					={class_a:'素食',			class_b:'廉价',		baseIncome:4};//+
	defaultFoodStats.shrimps_n_chips		={class_a:'海鲜',		class_b:'快餐',		baseIncome:4};//+	
	defaultFoodStats.sparkling_water		={class_a:'饮料',			class_b:'廉价',		baseIncome:4};//+		
	defaultFoodStats.taiyaki				={class_a:'海鲜',		class_b:'甜品',		baseIncome:4};//+
	defaultFoodStats.vegan_pizza			={class_a:'素食',			class_b:'高价',		baseIncome:4};//+

	defaultFoodStats.original_idea			={class_a:'buff',			class_b:'buff',			baseIncome:4};//+
	
	defaultFoodStats.fortune_paper			={class_a:'buff',			class_b:'buff',			baseIncome:5};

	for (let prop in defaultFoodStats) {
		if ((defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].class_a != 'buff')) {
			if ( (defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].baseIncome == 1) ) {
				v.activeFood.push(prop);
			}
			if ( (defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].baseIncome == 2) ) {
				v.newFood.push(prop);
			}
			if ( (defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].baseIncome == 4) && (v.skills.tier3food >= 1) ) {
				v.newFood.push(prop);
			}
		}	
	}

	const colors = {
					肉类: '#f00',
					素食: '#5ab55a',
					海鲜: '#5050ff',
					快餐: '#ffd000',
					甜品: '#e7b2e0',
					廉价: '#dadada',
					高价: '#a8ee96',
					饮料: '#00e7ff',
					buff: 'rgba(0,0,0,0)',
				};
	let defaultCategoryBonuses = {
					肉类: 0.2,
					素食: 0.2,
					海鲜: 0.2,
					快餐: 0.2,
					甜品: 0.2,
					廉价: 0.15,
					高价: 0.2,
					饮料: 0.15
				};
	v.categoryBonuses = JSON.parse(JSON.stringify(defaultCategoryBonuses));//clone
	let style = '<style>';
	let preloadImages = '<div id="preload_images">';
	$.each(defaultFoodStats, function( k, v ) {
		style += '.fooditem[data-type="'+k+'"]  { background: url("img/food/'+k+'.png") no-repeat center; } \r\n';
		style += '.fooditem[data-type="'+k+'"]::after  { content: ""; border-radius: 5px; border: 3px solid '+ colors[v.class_a] +' ; } \r\n';
		style += '.fooditem[data-type="'+k+'"]::before { content: ""; border-radius: 5px; border: 3px solid '+ colors[v.class_b] +' ; } \r\n';
		preloadImages += '<img src="img/food/'+k+'.png">';
	});
	for (let i = 0; i < 9; i++) {
		preloadImages += '<img src="img/plates/plate_'+i+'.png">';
	}
	preloadImages += '<img src="img/other/cook.png">';
	preloadImages += '<img src="img/other/combine.png">';

	preloadImages += '</div>';

	style += '</style>';

	//$('#loading').append($(preloadImages));
			
	let $moneyCurrent = '';
	let $moneyIncome = '';
	let $moneyCoupons = '';
	let $cookTime = '';	
	let $superCookTime = '';
	let $cookCouponsTime = '';
	let $superCookCouponsTime = '';
	let $descriptionBox = '';
	let $progressbarPrestigeCover = '';
	let $progressbarPrestigeCover2 = '';
	let $progressbarPrestige2 = '';	
	
	let $cookButton = '';	
	let $cook2Button = '';	
	let $cook3Button = '';	
	let $cook6Button = '';		
	let $superCookButton = '';
	let $cookCouponsButton = '';	
	let $superCookCouponsButton = '';
	
	DefineNewVariables();

	$(window).on('load', function () {		
		$('html > head').append($(style));
		// removing spaces between inline-blocks
		let expandedHTML = $('#center_part').html();
		let collapsedHTML = expandedHTML.replace(/(<(pre|script|style|textarea)[^]+?<\/\2)|(^|>)\s+|\s+(?=<|$)/g, "$1$3");
		$('#center_part').html(collapsedHTML);
		SetJQReferences();
		everySec = setInterval(EverySecond, 1000);
		
		$('#loading').append($(preloadImages));
		setTimeout(function(){
				if ($('#loading').css('display') != 'none') {
					$('#loading').html('The loading is taking too long. Something went wrong? Maybe. Contact the dev so that he fixes it. It would be very helpful if you can look into your browser console and send error descriptions with file game.js.');
					$('#loading').html('The loading is taking too long. Something went wrong? Maybe. You can try prestiging your game for '+v.prestigePointsTotal+'+'+v.prestigePointsToGet+' points or contact the dev so he fixes it. It would be very helpful if you can look into your browser console and send error descriptions with file game.js. Ignore this if you know it\'s just problems of your internet connection. <button onclick="PrestigeRestaurant()>重生</button>"');
				}				
			}, 40*1000);
			
		StartGame();		
		$('#game_button').on('keydown', function(e) {
			if (e.which == 68) {
				//$('#debug_btns').toggle();
			}			
		});
		
		if ((isMobile()) && (!kongversion)) {
			$('body').addClass('isMobile');
		}
		if (true) { //switch if stuff breaks
			$('body').keypress(function( event ) {	
				let kitchenTarget = '';
				if ( event.which == 49 ) {//[1]
					if ($('#kitchen .fooditem').eq(0).length > 0) {
						kitchenTarget = $('#kitchen .fooditem').eq(0);
					}
				}
				if ( event.which == 50 ) {//[2]
					if ($('#kitchen .fooditem').eq(1).length > 0) {
						kitchenTarget = $('#kitchen .fooditem').eq(1);
					}
				}
				if ( event.which == 51 ) {//[3]
					if ($('#kitchen .fooditem').eq(2).length > 0) {
						kitchenTarget = $('#kitchen .fooditem').eq(2);
					}
				}
				if ( event.which == 52 ) {//[4]
					if ($('#kitchen .fooditem').eq(3).length > 0) {
						kitchenTarget = $('#kitchen .fooditem').eq(3);
					}
				}
				if ( event.which == 53 ) {//[5]
					if ($('#kitchen .fooditem').eq(4).length > 0) {
						kitchenTarget = $('#kitchen .fooditem').eq(4);
					}
				}
				
				if (kitchenTarget !== '') { //[1-5]
					let kitchenType = kitchenTarget.attr('data-type');
						
					let kitchenQty = kitchenTarget.attr('data-qty');
					if ((kitchenType != '') && (kitchenType != undefined)) {
						if (defaultFoodStats[kitchenType].class_a != 'buff') {
							let storeTarget = '';
							$('#default .fooditem, #storefront .fooditem').each( function() {
								if ($(this).attr('data-type') === kitchenType) {
									storeTarget = $(this);
								}
							});
							
							if (storeTarget !== '') { // merge
								kitchenTarget.attr('data-type', '');
								kitchenTarget.attr('data-qty', 1);
								kitchenTarget.html('');
								let oldStoreQty = +storeTarget.attr('data-qty');
								let newStoreQty = +oldStoreQty + +kitchenQty;
								storeTarget.attr('data-qty', newStoreQty);
								storeTarget.html('<span class="qty">'+newStoreQty+'</span>');
								storeTarget.parent().removeClass('glow_fast').addClass('glow_fast');
								setTimeout(function() {
									$('#default .fooditem-wrapper, #storefront .fooditem-wrapper').removeClass('glow_fast');
								},1000);
								if (GetLvFromQty(oldStoreQty) < GetLvFromQty(newStoreQty) ) { // if gained next breakpoint level
									if (v.fireworkN == 1) {
										v.fireworkN = 2;
										let position = storeTarget.offset();
										position.left = +position.left + 50;
										position.top  = +position.top + 50;
										$('#win_lower').css(position).show();
										setTimeout(function(){
											$('#win_lower').hide();
										}, 950);
									} else {
										v.fireworkN = 1;
										let position = storeTarget.offset();
										position.left = +position.left + 50;
										position.top  = +position.top + 50;
										$('#win_higher').css(position).show();
										setTimeout(function(){
											$('#win_higher').hide();
										}, 950);
									}
								}
								
								UpdateIncome();
								UpdateButtonsOnChange();
								if (v.skills['science'] >= 1) {
									UpdateThirdCategory();
								}
								
							} else { // cannot merge, maybe just add
								$('#default .fooditem, #storefront .fooditem').each( function() {
									if (($(this).attr('data-type') == '') && (storeTarget == '')) {
										storeTarget = $(this);
									}
								});
								
								if (storeTarget !== '') { // add
									storeTarget.attr('data-type', kitchenType);
									kitchenTarget.attr('data-type', '');
									kitchenTarget.attr('data-qty', 1);
									kitchenTarget.html('');
									let newStoreQty = +kitchenQty;
									
									storeTarget.attr('data-qty', newStoreQty);
									storeTarget.html('<span class="qty">'+newStoreQty+'</span>');
									storeTarget.parent().removeClass('glow_fast').addClass('glow_fast');								
									UpdateIncome();
									UpdateButtonsOnChange();
									if (v.skills['science'] >= 1) {
										UpdateThirdCategory();
									}
								}
							}
						}	
					}							
				}
			});
		}	
	});
	function StartGame() {
		if ( (window.localStorage.getItem('version') !== undefined) && (window.localStorage.getItem('version') !== '') && (window.localStorage.getItem('version') !== null) ){
			LoadGame();
			setTimeout(function(){
				$('#loading').hide();
				$('#main-wrapper').fadeIn('slow');
				$('#money').css('visibility','visible').fadeIn('slow');
				$descriptionBox.fadeIn('slow');
			}, 350);
		} else {
			setTimeout(function() {
				if (v.tutorialLevel == 'greetings0') {
					UpdateTutorial();
				}
			},6000);
			$moneyCurrent.html(AbbreviateNumberLong(v.money) + ' <span>💲</span>');
			$moneyIncome.html('+' + AbbreviateNumberEmoji(0));
			$moneyCoupons.html(v.coupons + ' <span>🔖</span>');
			setTimeout(function(){
				$('#loading').hide();
				$('#main-wrapper').fadeIn('slow');
				$('#money').fadeIn('slow');
				$descriptionBox.fadeIn('slow');
				$('#tutorial_box').fadeIn('slow');
			}, 5500);
		
			$('#default .fooditem, #kitchen .fooditem, #storefront .fooditem').each(
				function() {
					$(this).attr('data-type','');
					$(this).attr('data-qty',1);
					$(this).attr('data-buffs','');
				}
			);
			
			InitializeButtons();
			UpdateFoodItems();
		}
	}

	function ResetGame() {
		startTime = Date.now();
		pings = 0;
		compensatedPings = 0;

		v.money = 0;
		//v.coupons = 0;
		//v.couponShards = 0;
		v.refreshPrice = 300;
		v.activeIncome = 0;
		v.activeIncomeMultiplier = 1;
		v.cookCount = 0; // number of times player cooked
		v.moneySuperCookCount = 0; // number of times player used Super Cook for money
		v.currentCookMode = 1;
		v.cookCouponsCount = 0;
		v.incomeBreakpoint = 900;
		v.fireworkN = 1; // to cycle through firework animations
		v.newFood = []; // non tier-1 food for unlocking
		v.foodClasses = {}; // to store food classes in the current restaurant, i.e. "3 肉类, 2 快餐, etc."
		v.prestigePointCost = GetCostFromPP(v.prestigePointsTotal);
		//v.prestigePointMoneyEarned = 0;
		v.prestigePointsToGet = 0;
		dishwashing.dirty = ['','','','',''];
		dishwashing.sink = '';
		dishwashing.clean = ['','','','',''];
		
		v.categoryBonuses = JSON.parse(JSON.stringify(defaultCategoryBonuses));
		
		$('#dirty button').prop('disabled', true).text('拿取');		
		$('#sink button').prop('disabled', true).text('清理');
		$('#clean button').prop('disabled', false).text('新一批');

		v.activeFood = [];

		for (let prop in defaultFoodStats) {
			if ((defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].class_a != 'buff')) {
				if ( (defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].baseIncome == 1) ) {
					v.activeFood.push(prop);
				}
				if ( (defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].baseIncome == 2) ) {
					v.newFood.push(prop);
				}
				if ( (defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].baseIncome == 4) && (v.skills.tier3food >= 1) ) {
					v.newFood.push(prop);
				}
			}
		}
		
		v.perks = []; // to store current active perks	
		v.exhaustedPerks = []; // to store perks that should no longer be offered
		v.discontinueTokens = 0;
		
		v.scienceCategory = ''; // Currently applied science category

		$('#kitchen').html('<div class="tr_label">厨房</div><div class="fooditems"></div>');
		AddKitchenSlots(v.kitchenSlots);
		$('#storefront').html('<div class="tr_label">餐馆菜单</div><div class="fooditems"></div>');
		AddStoreSlots(v.storeSlots);

		$('#default .fooditem, #kitchen .fooditem, #storefront .fooditem').each(
			function() {
				$(this).attr('data-type','');
				$(this).attr('data-qty',1);
				$(this).attr('data-buffs','');
			}
		);
		$('#default .qty').remove();
		
		InitializeButtons();
		UpdateFoodItems();
		UpdateInfoScreen();
		DishwashingRefresh();		
	}
	
	function PrestigeRestaurant() {
		let historyHTML = window.localStorage.getItem('history');
		if (historyHTML == null) {
			historyHTML = '';
		}
		historyHTML += '<div class="history_restaurant">';
		if (v.skills.starterRestaurants >= 1) {
			historyHTML += $('#game #default').html();
		}
		historyHTML += $('#game #storefront').html().replace('Restaurant menu', '');
		historyHTML += '<div class="tr_label">收益: '+AbbreviateNumberEmoji(v.activeIncome)+'</div>';
		historyHTML += '</div>';	
		historyHTML = historyHTML.split('ui-draggable ui-draggable-handle').join('').split(' ui-droppable').join('').split('  ui-draggable-disabled').join('').split('<button class="science" onclick="DoScience();">应用科学</button>').join('');
		if ((v.activeIncome > 0) && (($('#storefront .fooditem').eq(0).attr('data-type') != '') && ($('#storefront .fooditem').eq(0).attr('data-type') != undefined)) ) {
			window.localStorage.setItem('history', historyHTML);
			$('#info_history').html(historyHTML);
		}		
		
		let prestigeBoostersUsed = +$('#prestige_boosters_input').val();
		if ( (v.skills.prestigeBoosters >= 1) && (prestigeBoostersUsed > 0) && (v.prestigeBoosters >= prestigeBoostersUsed) ) {			
			let prestigePointMoneyEarnedBoosted = v.prestigePointMoneyEarned + (v.activeIncome * prestigeBoostersUsed * PRESTIGE_BOOST_VALUE);
			let prestigePointsToGetBoosted = v.prestigePointsToGet;
			let prestigePointsTotalBoosted = +v.prestigePointsTotal +v.prestigePointsToGet;
			let prestigePointCostBoosted = v.prestigePointCost;
			
			while (prestigePointMoneyEarnedBoosted > prestigePointCostBoosted) {
				prestigePointMoneyEarnedBoosted = prestigePointMoneyEarnedBoosted - prestigePointCostBoosted;
				prestigePointsToGetBoosted++;
				prestigePointsTotalBoosted++;
				prestigePointCostBoosted = GetCostFromPP(prestigePointsTotalBoosted);
				if ((v.prestigePointsTotal + v.prestigePointsToGet) > 100000) {
					prestigePointsToGetBoosted = prestigePointsToGetBoosted + Math.floor(prestigePointMoneyEarnedBoosted / prestigePointCostBoosted);
					prestigePointsTotalBoosted = prestigePointsTotalBoosted + Math.floor(prestigePointMoneyEarnedBoosted / prestigePointCostBoosted);
					prestigePointMoneyEarnedBoosted = 0;
				}
			}
			
			v.prestigePointsTotal = +v.prestigePointsTotal + +prestigePointsToGetBoosted;
			v.skillPointsUnspent = +v.skillPointsUnspent + +prestigePointsToGetBoosted;
			v.prestigeBoosters = v.prestigeBoosters - prestigeBoostersUsed;
			v.prestigePointMoneyEarned = prestigePointMoneyEarnedBoosted;
		} else {
			let getpoints = v.prestigePointsToGet;
			v.prestigePointsTotal = +v.prestigePointsTotal + +getpoints;
			v.skillPointsUnspent = +v.skillPointsUnspent + +getpoints;
		}
		if (kongversion) {
			submitAchievements(v.prestigePointsTotal);
		}
		
		ResetGame();
		v.tutorialLevel = 'prestiged0';
		$('#shop_button').fadeIn(500);
		
		$('#prestige_button').css('background', '');
		UpdatePrestigeButtons();
		if (v.skills.starterRestaurants >= 1) {
			SelectStarterRestaurant();
		} else {
			$('#bottom_controls').show();
			$('#kitchen').show();
			$('#options').hide();
		}
		
		$('#prestige_boosters_input').val(0);
		v.scienceCategory = '';
		
			
		if (v.skills['novelty'] >= 1) {
			v.currentNovelty = JSON.parse(JSON.stringify(v.nextNovelty)); //clone
			for (let catName in v.categoryBonuses) {
				v.categoryBonuses[catName] = (Math.round(defaultCategoryBonuses[catName] * (100 + v.currentNovelty[catName]))/100);				
			}
		}	
	}	
	
	function EverySecond(times = 1){
		v.money = +v.money + (+v.activeIncome * times);
		$moneyCurrent.html(AbbreviateNumberLong(v.money) + ' <span>💲</span>');
		$moneyIncome.html('+' + AbbreviateNumberEmoji(v.activeIncome));
		$moneyCoupons.html(v.coupons + ' <span>🔖</span>');
		
		v.couponShards = +v.couponShards + +times;
		if (v.couponShards >= v.couponShardsBreakpoint) {			
			v.coupons = +v.coupons + Math.floor(v.couponShards / v.couponShardsBreakpoint);
			v.couponShards = (v.couponShards % v.couponShardsBreakpoint);
		}
		
		v.noveltyShards = +v.noveltyShards + +times;
		if (v.noveltyShards >= v.noveltyShardsBreakpoint) {			
			if ( (v.noveltyActiveCat1 != undefined) && (v.noveltyActiveCat2 != undefined) ) {
				let nTimes = Math.floor(v.noveltyShards / v.noveltyShardsBreakpoint);
				for (let nFoodCat in v.nextNovelty) {
					v.nextNovelty[nFoodCat] = +v.nextNovelty[nFoodCat] + nTimes;
				}
				
				v.nextNovelty[v.noveltyActiveCat1] = +v.nextNovelty[v.noveltyActiveCat1] - (4 * nTimes);				
				v.nextNovelty[v.noveltyActiveCat2] = +v.nextNovelty[v.noveltyActiveCat2] - (4 * nTimes);
				for (let nFoodCat in v.nextNovelty) {
					if (v.nextNovelty[nFoodCat] < 0) {
						v.nextNovelty[nFoodCat] = 0;
					}
					if (v.nextNovelty[nFoodCat] > 200) {
						v.nextNovelty[nFoodCat] = 200;
					}
				}
			}			
			v.noveltyShards = (v.noveltyShards % v.noveltyShardsBreakpoint);
		}

		let prestigeProgressbarPercent = 0;
		let prestigePointNextStep = +v.prestigePointMoneyEarned + (+v.activeIncome * times);

		let prestigeProgressbar2Percent = ((100 * (v.prestigePointMoneyEarned / v.prestigePointCost)) % 1) * 100;
		let prestigeProgressbar2PercentNextStep = ((100 * (prestigePointNextStep / v.prestigePointCost)) % 1) * 100;

		if (v.options.animations) {
			$progressbarPrestigeCover.css('transition', 'width 1s linear 0s');
			$progressbarPrestigeCover2.css('transition', 'width 1s linear 0s');
		} else {
			$progressbarPrestigeCover.css('transition', 'none');
			$progressbarPrestigeCover2.css('transition', 'none');
		}

		let prestigeProgressbarPercentSpeed = 100 * (v.activeIncome / v.prestigePointCost); // how many progress bar percents it gets in a second (e.g. 50%)

		if (prestigePointNextStep <= v.prestigePointCost) { // normal progression
			v.prestigePointMoneyEarned = prestigePointNextStep;
			prestigeProgressbarPercent = 100 * (v.prestigePointMoneyEarned / v.prestigePointCost);
			$progressbarPrestigeCover.css('width', (100-prestigeProgressbarPercent) + '%');
		} else { // if we get a new point on this step
			prestigeProgressbarPercent = 100 * (prestigePointNextStep / v.prestigePointCost);
			let prestigeProgressbarPercentStart = 100 * (v.prestigePointMoneyEarned / v.prestigePointCost); // how many percents were there at the start of the second (e.g. 80%)
			let prestigeProgressbarPercentLeftAtStart = 100 - prestigeProgressbarPercentStart; // how many percents were left at the start of the second (e.g. 100-80 = 20%)
			let prestigeProgressbarFillTime = prestigeProgressbarPercentLeftAtStart / prestigeProgressbarPercentSpeed; // fill time (e.g. 20/50 = 0.4 seconds)
			
			$progressbarPrestigeCover2.css('transition', 'width '+Math.floor(prestigeProgressbarFillTime * 1000)+'ms linear 0s');
			$progressbarPrestigeCover.css('width', (0) + '%');
			// let it fill the rest of the progress bar at the same speed

			v.prestigePointMoneyEarned = prestigePointNextStep;

			setTimeout(function() {
				PrestigeBar1Reset(prestigeProgressbarFillTime);
			}, Math.floor(prestigeProgressbarFillTime * 1000));

		}

		if (prestigeProgressbarPercentSpeed < 0.4) {
			$progressbarPrestige2.show();
		}
		if (prestigeProgressbarPercentSpeed > 0.6) {
			$progressbarPrestige2.hide();
		}

		if (prestigeProgressbar2Percent <= prestigeProgressbar2PercentNextStep) {  // normal progression
			$progressbarPrestigeCover2.css('width', (100-prestigeProgressbar2PercentNextStep) + '%');
		} else { // if we get a new point on this step
			let prestigeProgressbar2PercentStart = prestigeProgressbar2Percent; // how many percents were there at the start of the second (e.g. 80%)
			let prestigeProgressbar2PercentLeftAtStart = 100 - prestigeProgressbar2PercentStart; // how many percents were left at the start of the second (e.g. 100-80 = 20%)
			let prestigeProgressbar2PercentSpeed = +prestigeProgressbar2PercentLeftAtStart + +prestigeProgressbar2PercentNextStep; // how many progress bar percents it gets in a second (e.g. 50%)
			let prestigeProgressbar2FillTime = prestigeProgressbar2PercentLeftAtStart / prestigeProgressbar2PercentSpeed; // fill time (e.g. 20/50 = 0.4 seconds)
			
			if (v.options.animations) {
				$progressbarPrestigeCover2.css('transition', 'width '+Math.floor(prestigeProgressbar2FillTime * 1000)+'ms linear 0s');
			} else {
				$progressbarPrestigeCover.css('transition', 'none');
			}
			
			$progressbarPrestigeCover2.css('width', '0%');
			// let it fill the rest of the progress bar at the same speed

			setTimeout(function() {
				PrestigeBar2Reset(prestigeProgressbar2FillTime);
			}, Math.floor(prestigeProgressbar2FillTime * 1000));
		}
		
		let newTimeLeft = v.prestigeBoosterTimeLeft - times;
		if (newTimeLeft > 0) {
			v.prestigeBoosterTimeLeft = newTimeLeft;
		} else {
			if (newTimeLeft < (-24*60*60)) {
				let prestigeBoostersToGet = Math.floor(Math.abs(newTimeLeft / (-24*60*60)));
				newTimeLeft = Math.abs(newTimeLeft % (-24*60*60));
				v.prestigeBoosters = v.prestigeBoosters + prestigeBoostersToGet;
				v.prestigeBoosterTimeLeft = newTimeLeft;
			} else {
				v.prestigeBoosterTimeLeft = PRESTIGE_BOOST_BREAKPOINT + newTimeLeft;
				v.prestigeBoosters++;
			}			
		}		

		let currentTime = Date.now();
		let timeDif = (currentTime - startTime) / 1000;
		pings = +pings + +times;
		let pingDif = Math.floor(timeDif - pings);
		
		if (pingDif - compensatedPings > 3) {
			compensatedPings += pingDif - compensatedPings;
			EverySecond(pingDif - compensatedPings);
			//console.log('Compensated ' + (compensatedPings) + ' seconds for inactive tab slowdown.');
		}
		
		if (currentScreen === 'prestige') {
			let pBHoursLeft = Math.floor(v.prestigeBoosterTimeLeft / (60*60));
			if (pBHoursLeft < 10) {
				pBHoursLeft = '0' + pBHoursLeft;
			}
			let pBMinsLeft = Math.floor((v.prestigeBoosterTimeLeft % (60*60)) / 60);
			if (pBMinsLeft < 10) {
				pBMinsLeft = '0' + pBMinsLeft;
			}
			let pBSecsLeft = Math.floor(v.prestigeBoosterTimeLeft % 60);
			if (pBSecsLeft < 10) {
				pBSecsLeft = '0' + pBSecsLeft;
			}
			let pBTimeLeft = '';
			
			if (pBHoursLeft > 0) {
				pBTimeLeft = pBHoursLeft + ':' + pBMinsLeft + ':' + pBSecsLeft;
			} else {
				pBTimeLeft = pBMinsLeft + ':' + pBSecsLeft;
			}
			$('.prestige_booster_time_desc').text(pBTimeLeft);
		}

		$('#debug_box').html(
						'Active: ' + AbbreviateNumber(v.activeIncome) +
						'<br>Mult: ' + v.activeIncomeMultiplier +						
						'<br>PP: ' + v.prestigePointsToGet +
						'<br>Cooks total: ' + cooksTotal +
						'<br>TIME: ' + BeautifyTime(pings) + 
						'<br>tt10: ' + debug.tt10 +
						'<br>tt30: ' + debug.tt30 +
						'<br>tt70: ' + debug.tt70 +
						'<br>Dif: ' + Math.round(pingDif) );
		UpdateButtonsOnTick();
		if (currentScreen == 'prestige') {
			UpdatePrestigeScreen();
		}
	}
	
	let intervalEveryMinute = setInterval(EveryMinute, 60000);
	function EveryMinute() {
		if ( (t[v.tutorialLevel].val >= t['finished0'].val) ) {			
			SaveGame();
		}
		if (v.prestigePointsToGet >= (v.prestigePointsTotal + 10)) {
			$('#prestige_button').css('background', '#ecae21');
			$('#prestige_button').on('mouseover', function (e) {
				let desc = '黄色的光芒意味着你的下一个重生将使你的收入翻倍(或者更多).';
				$descriptionBox.html(desc);
				descFadeout = false;
				e.stopPropagation();
			});	
			$('#prestige_button').off('mouseout').on('mouseout', function (e) {
				DescStartFadeOut();
				e.stopPropagation();
			});		
		}
	}

	function PrestigeBar1Reset(prestigeProgressbarFillTime) {
		let doAnimations = true; // if there are multiple prestige points gained, don't even try to animate that
		if ( (v.prestigePointMoneyEarned / v.prestigePointCost) < 2) {
			$progressbarPrestigeCover.css('transition', 'all 0s linear 0s');
			$progressbarPrestigeCover.hide();
			$progressbarPrestigeCover.css('width', '100%');
			$progressbarPrestigeCover.show();
		} else {
			doAnimations = false;
		}

		while (v.prestigePointMoneyEarned > v.prestigePointCost) {
			v.prestigePointMoneyEarned = Math.floor(v.prestigePointMoneyEarned - v.prestigePointCost);
			v.prestigePointsToGet++;
			v.prestigePointCost = GetCostFromPP(v.prestigePointsTotal + v.prestigePointsToGet);
			if (v.prestigePointsToGet + v.prestigePointsTotal == 10) {
				debug.tt10 = BeautifyTime(pings);
			}
			if (v.prestigePointsToGet + v.prestigePointsTotal == 30) {
				debug.tt30 = BeautifyTime(pings);
			}
			if (v.prestigePointsToGet + v.prestigePointsTotal == 70) {
				debug.tt70 = BeautifyTime(pings);
			}
			
			if ((v.prestigePointsTotal + v.prestigePointsToGet) > 100000) {
				v.prestigePointsToGet += Math.floor(v.prestigePointMoneyEarned / v.prestigePointCost);
				v.prestigePointMoneyEarned = 0;
				return false;
			}
		}
		if (doAnimations) {
			let prestigeProgressbarTimeLeft = 1 - prestigeProgressbarFillTime;
			if (v.options.animations) {
				$progressbarPrestigeCover.css('transition', 'all ' +prestigeProgressbarTimeLeft + 's linear 0s');
			} else {
				$progressbarPrestigeCover.css('transition', 'none');
			}
			let prestigeProgressbarPercent = 100 * (v.prestigePointMoneyEarned / v.prestigePointCost);
			$progressbarPrestigeCover.css('width', (100-prestigeProgressbarPercent) + '%');
		}
	}

	function PrestigeBar2Reset(prestigeProgressbarFillTime) {
		$progressbarPrestigeCover2.css('transition', 'all 0s linear 0s');
		$progressbarPrestigeCover2.hide();
		$progressbarPrestigeCover2.css('width', '100%');
		$progressbarPrestigeCover2.show();

		let prestigeProgressbarTimeLeft = 1 - prestigeProgressbarFillTime;
		if (v.options.animations) {
			$progressbarPrestigeCover2.css('transition', 'all ' +prestigeProgressbarTimeLeft + 's linear 0s');
		} else {
			$progressbarPrestigeCover2.css('transition', 'none');
		}
		let prestigeProgressbar2Percent = ((100 * (v.prestigePointMoneyEarned / v.prestigePointCost)) % 1) * 100;
		$progressbarPrestigeCover2.css('width', (100-prestigeProgressbar2Percent) + '%');
	}

	let intervalDebugCheck = setInterval(DebugCheck, 100000);
	function DebugCheck() {
		let temp_income = v.activeIncome;
		UpdateIncome();
		if (temp_income != v.activeIncome) {
			console.log(new Date() + 'DEBUG: ' + temp_income + '|' + v.activeIncome);
		}
	}

	function UpdateIncome() {
		v.activeIncome = 0;
		const foodTypes = {};
		v.foodClasses = {};
		v.hasDuplicates = false;		
		
		if (v.skills.mealOfTheDay >= 1) {
			
			/*
			v.scienceCategory = tempCategory; 
			v.scienceType1 = defFood1; 
			v.scienceType2 = defFood2; 
			*/
			
			let food1 = $('#storefront .fooditem').eq(0).attr('data-type');			
			let food1science = '';			
			let food2 = $('#storefront .fooditem').eq(1).attr('data-type');
			let food2science = '';		
			let food3 = $('#storefront .fooditem').eq(2).attr('data-type');
			let food3science = '';		
			if (v.scienceCategory != '') { //
				if ((food1 == v.scienceType1) || (food1 == v.scienceType2)) {
					food1science = v.scienceCategory;					
				}	
				if ((food2 == v.scienceType1) || (food2 == v.scienceType2)) {
					food2science = v.scienceCategory;
				}
				if ((food3 == v.scienceType1) || (food3 == v.scienceType2)) {
					food3science = v.scienceCategory;
				}
			}
			if ((food1 != '') && (food2 != '') && (food3 != '')) {
				if (
					( (defaultFoodStats[food1].class_a != '甜品') && (defaultFoodStats[food1].class_a != '饮料') ) &&
					( (defaultFoodStats[food1].class_b != '甜品') && (defaultFoodStats[food1].class_b != '饮料') ) &&
					( (food1science 				   != '甜品') && (food1science 					 != '饮料') ) &&
					
					( (defaultFoodStats[food2].class_a == '甜品') || (defaultFoodStats[food2].class_b == '甜品') || (food2science == '甜品') ) &&
					
					( (defaultFoodStats[food3].class_a == '饮料') || (defaultFoodStats[food3].class_b == '饮料') || (food3science == '饮料') ) 
				) {					
					mealOfTheDayActive = true;					 
				} else {
					mealOfTheDayActive = false;
				}
			} else {
				mealOfTheDayActive = false;
			}
			$('#storefront .fooditem').eq(0).parent().css({'border': '3px solid #ffd000', 'border-right-color': '#f00', 'border-bottom-color': '#5ab55a', 'border-left-color': '#5050ff'});	
			$('#storefront .fooditem').eq(1).parent().css('border','3px solid #e7b2e0');	
			$('#storefront .fooditem').eq(2).parent().css('border','3px solid #00e7ff');
		}

		$('#storefront .fooditem, #default .fooditem').each(
			function() {
				if ($(this).attr('data-type') !== '') {
					if (foodTypes[$(this).attr('data-type')] != 'exists') {
						foodTypes[$(this).attr('data-type')] = 'exists';
					} else {
						v.hasDuplicates = true;
					}
				}
			}
		);
		Object.keys(foodTypes).forEach(function(key) {
			CountClasses(key);
		});

		let bonusLevels = '';
		let sortedBonuses = SortObjectByValue(v.foodClasses);
		sortedBonuses.forEach(function(item) {
			bonusLevels += '<b class="category_circle" style="color:'+colors[item.k]+'">●</b> ' + BeautifyDataType(item.k) + ': ' + item.v + '<br>';
		});

		if (bonusLevels == '') {
			$('#category_bonuses').fadeOut(500);
		} else {
			if (v.hasDuplicates) {
				bonusLevels += '<span style="font-size: 10px;vertical-align: top;">⚠️</span> 重复<br>';
			}
			if ((v.skills.mealOfTheDay >= 1) && (mealOfTheDayActive == false)) {
				bonusLevels += '<span style="font-size: 10px;vertical-align: top;">⚠️</span> 一日之餐<br>';
			}
			$('#category_bonuses').html('<span class="nomobile">主题:</span><br class="nomobile">' + bonusLevels);
			$('#category_bonuses').fadeIn(500);
		}
		
		let orderNum = 1;
		$('#storefront .fooditem').each( // setting the numbers of elements for 当日菜
			function() {
				$(this).attr('data-num', orderNum);
				orderNum++;
			}
		);	

		let kitchenNum = 1;
		$('#kitchen .fooditem').each( // setting the numbers of elements for 当日菜
			function() {
				$(this).attr('data-kitchen-num', kitchenNum);
				kitchenNum++;
				if (true) {
					let kitchenType = $(this).attr('data-type');
					if ((kitchenType != '') && (kitchenType != undefined)) {
						if ((foodTypes[$(this).attr('data-type')] === 'exists') || (defaultFoodStats[$(this).attr('data-type')].class_a === 'buff' ) ) {
							$(this).parent().css('border-color', '#f7d88c');
						} else {
							$(this).parent().css('border-color', '');
						}
					} else {
						$(this).parent().css('border-color', '');
					}
					
				}
			}
		);
		
		$('#storefront .fooditem, #default .fooditem').each(
			function() {				
				if ($(this).attr('data-type') !== '') {
					// BASE * QTY
					let thisGain = defaultFoodStats[$(this).attr('data-type')].baseIncome * $(this).attr('data-qty');

					// LEVELS: Double for every 10, 25, 50... levels of food					
					let thisLv = GetLvFromQty($(this).attr('data-qty'));
					thisGain = thisGain * (2 ** (thisLv-1));

					// BUFFS
					let thisBuffIncomeMult = 1;
					let thisBuffs = {};
					if ($(this).attr('data-buffs') != '') {
						thisBuffs = JSON.parse($(this).attr('data-buffs'));
					}
					for (let buff in thisBuffs) {
						let buffValue = defaultFoodStats[buff].baseIncome;
						let buffQty = thisBuffs[buff];
						thisBuffIncomeMult = thisBuffIncomeMult * ( 1 + ((buffValue * buffQty) / 100));
					}
					thisGain = thisGain * thisBuffIncomeMult;
					
					// CLASSES
					let class_a = defaultFoodStats[$(this).attr('data-type')].class_a;
					let class_b = defaultFoodStats[$(this).attr('data-type')].class_b;
					let class_c = '';
					
					if ( (v.scienceCategory !== undefined) && (v.scienceCategory !== '') && (($(this).attr('data-type') == v.scienceType1) || ($(this).attr('data-type') == v.scienceType2)) ) {
						class_c = v.scienceCategory;
					}
					// +15-20% for combos
					thisGain = thisGain * (1 + (v.categoryBonuses[class_a] * v.foodClasses[class_a]));
					thisGain = thisGain * (1 + (v.categoryBonuses[class_b] * v.foodClasses[class_b]));
					if ( (v.scienceCategory !== undefined) && (v.scienceCategory !== '') && (($(this).attr('data-type') == v.scienceType1) || ($(this).attr('data-type') == v.scienceType2)) ) {
						thisGain = thisGain * (1 + (v.categoryBonuses[v.scienceCategory] * v.foodClasses[v.scienceCategory]));						
					}
					
					let perkMulti = 1;
					//PERKS
					for (let perkName in v.perks) {
						if (defaultPerkStats[v.perks[perkName]] !== undefined) {
							if ( (defaultPerkStats[v.perks[perkName]].target === class_a) || (defaultPerkStats[v.perks[perkName]].target === class_b) || (defaultPerkStats[v.perks[perkName]].target === 'all') ) {
								perkMulti = perkMulti * (1 + (defaultPerkStats[v.perks[perkName]].effect / 100));
							}
							
							if ( (class_c != '') && (defaultPerkStats[v.perks[perkName]].target === class_c) ) {
								perkMulti = perkMulti * (1 + (defaultPerkStats[v.perks[perkName]].effect / 100));
							}
						}	
					}
					thisGain = thisGain * perkMulti;

					// 饮料
					if (v.foodClasses['饮料'] > 0) { // 200% income with a 饮料
						thisGain = thisGain * 2;
					}
					
					// CAFE TIER
					thisGain = thisGain * v.activeIncomeMultiplier;

					// PRESTIGE POINTS
					thisGain = thisGain * (1 + (v.prestigePointsTotal * 0.1));
					
					// DISH OF THE DAY
					if ((v.skills.dishOfTheDay >= 1) && (!mealOfTheDayActive)) {				
						if ($(this).attr('data-num') == 1) {
							$(this).parent().css('border','3px solid #ffd000');	
							thisGain = thisGain*2;
						}
					}
					
					// MEAL OF THE DAY
					if (mealOfTheDayActive) {
						if (
							($(this).attr('data-num') == 1) ||
							($(this).attr('data-num') == 2) ||
							($(this).attr('data-num') == 3)
							) {
							thisGain = thisGain*3;
						}
					}
					v.activeIncome += Math.round(thisGain);
					$(this).attr('data-income', Math.round(thisGain));
				} else {
					$(this).attr('data-income', 0);
				}
			}
		);
		v.activeIncome = Math.round(v.activeIncome);
		$moneyIncome.html('+' + AbbreviateNumberEmoji(v.activeIncome));
		if (v.activeIncome > 0) {
			$moneyIncome.fadeIn(500);
		}

		if ((v.tutorialLevel == 'cooking1') && (v.activeIncome > 5)) {
			$cookButton.prop('disabled', false);
			v.tutorialLevel = 'cooking2';
			UpdateTutorial();
		}

		if ((v.tutorialLevel == 'combining0') && (v.activeIncome >= 16)) {
			$cookButton.prop('disabled', false);
			v.tutorialLevel = 'combined0';
			UpdateTutorial();
		}

		if ((v.tutorialLevel == '饮料s0') && (v.foodClasses['饮料'] > 0)) {
			$cookButton.prop('disabled', true);
			v.tutorialLevel = 'has饮料s0';
			UpdateTutorial();
		}
		
		if (v.skills.coupons >= 1) {
			$('#cook_coupon_buttons').show();
			$('#money .coupons').show();
		}
		
		if (v.skills['novelty'] >= 1) {			
			let bestIncomeNum = 0;
			let bestIncomeType = '';
			$('#default .fooditem, #storefront .fooditem').each( function() {				
				if (+bestIncomeNum < +$(this).attr('data-income')) {
					bestIncomeNum = $(this).attr('data-income');
					bestIncomeType = $(this).attr('data-type');
				}
			});
			if (bestIncomeType !== '') {
				v.noveltyActiveCat1 = defaultFoodStats[bestIncomeType].class_a;
				v.noveltyActiveCat2 = defaultFoodStats[bestIncomeType].class_b;
			} else {
				v.noveltyActiveCat1 = '';
				v.noveltyActiveCat2 = '';
			}
		}
		
		if ( (t[v.tutorialLevel].val >= t['finished0'].val) ) {			
			SaveGame();
		}		
		
		if (isNaN(v.money)) {
			v.money = 0;
		}
		if (isNaN(v.prestigePointsToGet)) {
			v.prestigePointsToGet = 0;
		}
		if (isNaN(v.prestigePointMoneyEarned)) {
			v.prestigePointMoneyEarned = 0;
		}	
	}

	function CountClasses(item) {
		if (defaultFoodStats[item] === undefined) {
			console.log("undefined: " +item);
		}
		if (v.foodClasses[defaultFoodStats[item].class_a] > 0) {
			v.foodClasses[defaultFoodStats[item].class_a]++;
		} else {
			v.foodClasses[defaultFoodStats[item].class_a] = 1;
		}

		if (v.foodClasses[defaultFoodStats[item].class_b] > 0) {
			v.foodClasses[defaultFoodStats[item].class_b]++;
		} else {
			v.foodClasses[defaultFoodStats[item].class_b] = 1;
		}
		
		if (((item == v.scienceType1) || (item == v.scienceType2)) && (v.scienceCategory != '')) {
			if (v.foodClasses[v.scienceCategory] > 0) {
				v.foodClasses[v.scienceCategory]++;
			} else {
				v.foodClasses[v.scienceCategory] = 1;
			}
		}
	}

	function GetRandomActiveFoodType() {
		let rnd = GetRandomInt(0,v.activeFood.length - 1);		
		return v.activeFood[rnd];
	}

	function AddKitchenSlots(slotNum) {
		for (let i = 0; i < slotNum; i++) {
			$('#kitchen .fooditems').append('<div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="" data-qty="1"></div></div>');
		}
		UpdateFoodItems();
	}

	function AddStoreSlots(slotNum) {
		for (let i = 0; i < slotNum; i++) {
			$('#storefront .fooditems').append('<div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="" data-qty="1"></div></div>');
		}
		UpdateFoodItems();
	}
	
	function CheckChallenge(challengeID) {
		let checkResult = '';		
		switch (challengeID) {
			case 10:
			{
				checkResult += '<b>三倍</b><br>';
				checkResult += '<br>';
				checkResult += '在你的菜单里<i>所有</i>可能的类别,<br>每一个都有三个菜(不多不少).<br>';
				checkResult += '奖励: 10 💎 宝石<br>';
				
				let numCats = 0;
				let numCats3 = 0;
				for (let foodCat in v.foodClasses) {
					numCats++;
					if (v.foodClasses[foodCat] == 3) {
						numCats3++;
					}
				}
				
				if (numCats == 8) {
					checkResult += '激活类别: '+numCats+'/8 <span style="color: #86d686;">✓</span><br>';
				} else {
					checkResult += '激活类别: '+numCats+'/8 <span style="color: #FF0000;">X</span><br>';
				}
				if (numCats3 == 8) {
					checkResult += '3道菜肴类别: '+numCats3+'/8 <span style="color: #86d686;">✓</span><br>';
				} else {
					checkResult += '3道菜肴类别: '+numCats3+'/8 <span style="color: #FF0000;">X</span><br>';
				}		
				if ((numCats == 8) && (numCats3 == 8)) {
					v.currentChallenge = 11;
					checkResult += '<button onclick="v.currentChallenge = 20;paid.gems = +paid.gems + 10;paid.gems_from_challenges = +paid.gems_from_challenges + 10;UpdateProgressScreen();">完成</button>';
				}
			}	
			break;
			
			case 11:		
				checkResult += '<b>三倍</b><br>';
				checkResult += '<br>';
				checkResult += '在你的菜单里<i>所有</i>可能的类别,<br>每一个都有三个菜(不多不少).<br>';
				checkResult += '奖励: 10 💎 宝石<br>';
				checkResult += '激活类别: <span style="color: #86d686;">✓</span><br>';
				checkResult += '3道菜肴类别: <span style="color: #86d686;">✓</span><br>';
				checkResult += '<button onclick="v.currentChallenge = 20;paid.gems = +paid.gems + 10;paid.gems_from_challenges = +paid.gems_from_challenges + 10;UpdateProgressScreen();">完成</button>';
			break;
			
			case 20:
			{
				checkResult += '<b>Laser-tight focus</b><br>';
				checkResult += '<br>';
				checkResult += '在你的菜单中有多达4个类别,总共至少有10道菜.<br>';
				checkResult += '奖励: 20 💎 宝石<br>';
				
				let numCats = 0;
				for (let foodCat in v.foodClasses) {
					numCats++;					
				}
				let foodTypes = {};
				$('#default .fooditem, #storefront .fooditem').each( function() {
					if ($(this).attr('data-type') != '') {
						foodTypes[$(this).attr('data-type')] = 'exists';
					}
				});
				let numFoods = Object.keys(foodTypes).length;
				
				if (numCats <= 4) {
					checkResult += '激活类别: '+numCats+'/4 <span style="color: #86d686;">✓</span><br>';
				} else {
					checkResult += '激活类别: '+numCats+'/4 <span style="color: #FF0000;">X</span><br>';
				}
				if (numFoods >= 10) {
					checkResult += '菜肴: '+numFoods+'/10 <span style="color: #86d686;">✓</span><br>';
				} else {
					checkResult += '菜肴: '+numFoods+'/10 <span style="color: #FF0000;">X</span><br>';
				}		
				if ((numCats <= 4) && (numFoods >= 10)) {
					v.currentChallenge = 21;
					checkResult += '<button onclick="v.currentChallenge = 30;paid.gems = +paid.gems + 20;paid.gems_from_challenges = +paid.gems_from_challenges + 20;UpdateProgressScreen();">完成</button>';
				}
			}	
			break;
			
			case 21:
				checkResult += '<b>激光聚焦</b><br>';
				checkResult += '<br>';
				checkResult += '在你的菜单中有多达4个类别,总共至少有10道菜.<br>';
				checkResult += '奖励: 20 💎 宝石<br>';
				checkResult += '激活类别: <span style="color: #86d686;">✓</span><br>';
				checkResult += '菜肴: <span style="color: #86d686;">✓</span><br>';
				checkResult += '<button onclick="v.currentChallenge = 30;paid.gems = +paid.gems + 20;paid.gems_from_challenges = +paid.gems_from_challenges + 20;UpdateProgressScreen();">完成</button>';
			break;
			
			case 30:
			{
				checkResult += '<b>字母</b><br>';
				checkResult += '<br>';
				checkResult += '有7个不同的菜,以同一个字母开头.<br>';
				checkResult += '奖励: 30 💎 宝石<br>';
				let numCats = 0;
				let foodTypes = {};
				$('#default .fooditem, #storefront .fooditem').each( function() {
					if ($(this).attr('data-type') != '') {
						foodTypes[$(this).attr('data-type')] = 'exists';
					}
				});
				let foodFirstLetters = {};
				for (let foodType in foodTypes) {
					if (foodType[0] in foodFirstLetters) {
						foodFirstLetters[foodType[0]]++;
					} else {
						foodFirstLetters[foodType[0]] = 1;
					}
				}
				let maxNum = 0;
				let maxLetter = 0;				
				for (let foodFirstLetter in foodFirstLetters) {
					if (foodFirstLetters[foodFirstLetter] > maxNum) {
						maxNum = foodFirstLetters[foodFirstLetter];
						maxLetter = foodFirstLetter;
					}					
				}	
				if ((maxLetter !='') && (maxLetter != undefined)) {
					maxLetter = maxLetter.toUpperCase();
				}
				if (maxNum >= 7) {
					checkResult += '相同字母开头的菜肴: '+maxNum+'/7 (字母 '+maxLetter+') <span style="color: #86d686;">✓</span><br>';
					checkResult += '<button onclick="v.currentChallenge = 31;paid.gems = +paid.gems + 30;paid.gems_from_challenges = +paid.gems_from_challenges + 30;UpdateProgressScreen();">完成</button>';
				} else {
					checkResult += '相同字母开头的菜肴: '+maxNum+'/7 (字母 '+maxLetter+') <span style="color: #FF0000;">X</span><br>';
				}
			}	
			break;
			
			case 31:
				checkResult += '<b>所有当前可用的挑战都已完成</b><br>';
			break;
			
			default:
				return false;
		}
		return checkResult;	
	}


	function TierUpRestaurant() {
		if (v.newFood.length == 0) {
			v.activeIncomeMultiplier = (+v.activeIncomeMultiplier + 0.4);
			v.activeIncomeMultiplier = 0 + +v.activeIncomeMultiplier.toFixed(2);
			AddStoreSlots(1);
			v.incomeBreakpoint = v.incomeBreakpoint * 5;
			if (v.skills.perks > 0) {	
				SelectNewPerk();			
			}
			return false;
		}
		if (v.activeIncome >= v.incomeBreakpoint) {
			$('#kitchen').hide();
			$('#bottom_controls').hide();
			$('#options').show();
			gameState = 'tierup';
			// Get new foods
			let optionsHTML = '';
			let rnd1 = GetRandomInt(0,v.newFood.length - 1);
			let rnd2 = GetRandomInt(0,v.newFood.length - 1);
			while ((rnd1==rnd2) && (v.newFood.length > 1)) {
				rnd2 = GetRandomInt(0,v.newFood.length - 1);
			}

			let rnd3 = GetRandomInt(0,v.newFood.length - 1);
			let rnd4 = GetRandomInt(0,v.newFood.length - 1);
			while ((rnd3==rnd4) && (v.newFood.length > 1)) {
				rnd4 = GetRandomInt(0,v.newFood.length - 1);
			}

			let rnd5 = GetRandomInt(0,v.newFood.length - 1);
			let rnd6 = GetRandomInt(0,v.newFood.length - 1);
			while ((rnd5==rnd6) && (v.newFood.length > 1)) {
				rnd6 = GetRandomInt(0,v.newFood.length - 1);
			}

			for (let i = 0; i < 10; i++) { // making sure the choices are different
				if (
					((rnd3 == rnd1) && (rnd4 == rnd2))
					|| ((rnd3 == rnd2) && (rnd4 == rnd1))
					){ // if like first pair - reroll

					rnd3 = GetRandomInt(0,v.newFood.length - 1);
					rnd4 = GetRandomInt(0,v.newFood.length - 1);
					while ((rnd3==rnd4) && (v.newFood.length > 1)) {
						rnd4 = GetRandomInt(0,v.newFood.length - 1);
					}

				}
				if (
					((rnd5 == rnd1) && (rnd6 == rnd2))
					|| ((rnd5 == rnd2) && (rnd6 == rnd1))
					|| ((rnd5 == rnd3) && (rnd6 == rnd4))
					|| ((rnd5 == rnd4) && (rnd6 == rnd3))
					){ // if like first or second pair - reroll

					rnd5 = GetRandomInt(0,v.newFood.length - 1);
					rnd6 = GetRandomInt(0,v.newFood.length - 1);
					while ((rnd5==rnd6) && (v.newFood.length > 1)) {
						rnd6 = GetRandomInt(0,v.newFood.length - 1);
					}

				}
			}

			optionsHTML += '<div id="new1" style="padding: 3px; border: 1px solid #c78888; display:inline-block;margin-bottom: 12px;" ><b style="color:#c78888">集合1</b><br>';
			optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + v.newFood[rnd1] + '" data-qty="1"></div></div>';
			optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + v.newFood[rnd2] + '" data-qty="1"></div></div>';
			optionsHTML += 	'<br><button onClick="SetNewFood(1)">选择</button>';			
			optionsHTML += '</div>';
			optionsHTML += '<div id="new2" style="padding: 3px; border: 1px solid #c78888; display:inline-block;margin-bottom: 12px;"><b style="color:#c78888">集合2</b><br>';
			optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + v.newFood[rnd3] + '" data-qty="1"></div></div>';
			optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + v.newFood[rnd4] + '" data-qty="1"></div></div>';
			optionsHTML += 	'<br><button onClick="SetNewFood(2)">选择</button>';
			optionsHTML += '</div>';
			if (v.skills.triple_choice === 'HardResetGame()') {
				optionsHTML += '<div id="new3" style="padding: 3px; border: 1px solid #c78888; display:inline-block;margin-bottom: 12px;"><b style="color:#c78888">集合3</b><br>';
				optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + v.newFood[rnd5] + '" data-qty="1"></div></div>';
				optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + v.newFood[rnd6] + '" data-qty="1"></div></div>';
				optionsHTML += 	'<br><button onClick="SetNewFood(3)">选择</button>';
				optionsHTML += '</div>';
			}
			
			$('#options	.inner').html(optionsHTML);
			$('#options .tr_label').text('选择新的菜肴');
			$('#options .fooditem').each(
				function() {
					$(this).prop('onclick', null).off('click');

					$(this).off('mouseover');
					$(this).on('mouseover', function (e) {
						let thisDataType = $(this).attr('data-type');
						if (thisDataType == '') {
							return false;
						}

						let thisClassA = defaultFoodStats[thisDataType].class_a;
						let thisClassB = defaultFoodStats[thisDataType].class_b;
						let thisBaseIncome = defaultFoodStats[thisDataType].baseIncome;

						let thisDataTypeCapitalized = BeautifyDataType(thisDataType);

						let desc = '<b style="font-size: 16px;">' + thisDataTypeCapitalized + '</b><br>';
						desc += '<b class="category_circle" style="color:'+colors[thisClassA]+'">●</b> ' + BeautifyDataType(thisClassA) + '<br>';
						desc += '<b class="category_circle" style="color:'+colors[thisClassB]+'">●</b> ' + BeautifyDataType(thisClassB) + '<br>';
						desc += '基础收益: <b>' + thisBaseIncome + '</b><br>';
						$descriptionBox.html(desc);
						descFadeout = false;
						e.stopPropagation();
					});					
					$(this).off('mouseout').on('mouseout', function (e) {
						DescStartFadeOut();
						e.stopPropagation();
					});
				}
			);

			v.activeIncomeMultiplier = (+v.activeIncomeMultiplier + 0.2);
			v.activeIncomeMultiplier = 0 + +v.activeIncomeMultiplier.toFixed(2);
			AddStoreSlots(1);
			if ($('#storefront .fooditem').length > 18) {
				$('#game').addClass('bigmenu');
			} else {
				$('#game').removeClass('bigmenu');
			}
			v.incomeBreakpoint = v.incomeBreakpoint * 5;
			
			if ( (t[v.tutorialLevel].val <= t['finished0'].val) ) {			
				v.tutorialLevel = 'tierup0';
			}
			
			UpdateIncome();
			UpdateButtonsOnChange();
			UpdateFoodItems();
			SaveGame();
		}
	}	

	function SetNewFood(newVal) {		
		let newFood1 = $('#new'+newVal+ ' .fooditem').eq(0).attr('data-type');
		let newFood2 = $('#new'+newVal+ ' .fooditem').eq(1).attr('data-type');
		if (v.activeFood.indexOf(newFood1) === -1) {
			v.activeFood.push(newFood1);
		}
		if (v.activeFood.indexOf(newFood2) === -1) {
			v.activeFood.push(newFood2);
		}		
		RemoveFromArray(v.newFood, newFood1);
		RemoveFromArray(v.newFood, newFood2);
		
		if (v.skills.perks > 0) {	
			SelectNewPerk();			
		} else {
			$('#kitchen').show();
			$('#bottom_controls').show();
			$('#options').hide();
			gameState = 'normal';
			$('#options	.inner').html('');
			UpdateFoodItems();
			$('#progressbars').fadeIn(500);
			$('#prestige_button').fadeIn(500);
			$('#progress_button').fadeIn(500);
		}
	}
	
	function SelectNewPerk() {
		CheckAvailablePerks();
		if (v.newPerks.length < 1) {
			$('#kitchen').show();
			$('#bottom_controls').show();
			$('#options').hide();
			gameState = 'normal';
			$('#options	.inner').html('');
			
			UpdateIncome();
			UpdateButtonsOnChange();
			UpdateFoodItems();
			return false;
		}
		$('#kitchen').hide();
		$('#bottom_controls').hide();
		$('#options').show();
		gameState = 'perk';
		// Get perks
		let optionsHTML = '';
		let rnd1 = GetRandomInt(0,v.newPerks.length - 1);
		let rnd2 = GetRandomInt(0,v.newPerks.length - 1);
		for (let i = 0; i < 10; i++) { // making sure the choices are different
			if (rnd1==rnd2) {
				rnd2 = GetRandomInt(0,v.newPerks.length - 1);
			}
		}	
		let rnd3 = GetRandomInt(0,v.newPerks.length - 1);
		for (let i = 0; i < 10; i++) {
			if ((rnd3==rnd2) || (rnd3==rnd1)) {
				rnd3 = GetRandomInt(0,v.newPerks.length - 1);
			}
		}	
		
		optionsHTML += '<div id="new1" style="padding: 3px; width: 30%; display:inline-block;margin-bottom: 12px;" ><br>';
		optionsHTML += 	'<button class="perk" data-perk="'+v.newPerks[rnd1]+'" onClick="SetNewPerk(\''+v.newPerks[rnd1]+'\')">'+defaultPerkStats[v.newPerks[rnd1]].name+'</button>';			
		optionsHTML += '</div>';
		optionsHTML += '<div id="new2" style="padding: 3px; width: 30%; display:inline-block;margin-bottom: 12px;"><br>';
		optionsHTML += 	'<button class="perk" data-perk="'+v.newPerks[rnd2]+'" onClick="SetNewPerk(\''+v.newPerks[rnd2]+'\')">'+defaultPerkStats[v.newPerks[rnd2]].name+'</button>';
		optionsHTML += '</div>';
		if (v.skills.triple_choice === 'HardResetGame()') {
			optionsHTML += '<div id="new3" style="padding: 3px; width: 30%; display:inline-block;margin-bottom: 12px;"><br>';
			optionsHTML += '<button class="perk" data-perk="'+v.newPerks[rnd3]+'" onClick="SetNewPerk(\''+v.newPerks[rnd3]+'\')">'+defaultPerkStats[v.newPerks[rnd3]].name+'</button>';
			optionsHTML += '</div>';
		}
		
		$('#options	.inner').html(optionsHTML);
		$('#options .tr_label').text('选择一个特权');
		
		$('#options button').each(
			function() {
				$(this).off('mouseover').on('mouseover', function (e) {				
					let thisDataPerk = $(this).attr('data-perk');
					let thisName = $(this).text();
					if (thisDataPerk	 == '') {
						return false;
					}
					
					let desc = '<b style="font-size: 16px;">' + thisName + '</b><br>';
					desc += defaultPerkStats[thisDataPerk].desc;					
					$descriptionBox.html(desc);
					descFadeout = false;
					e.stopPropagation();
				});					
				$(this).off('mouseout').on('mouseout', function (e) {
					DescStartFadeOut();
					e.stopPropagation();
				});
			}
		);
		
		UpdateIncome();
		UpdateButtonsOnChange();
		UpdateFoodItems();
	}
	
	function CheckAvailablePerks() {
		v.newPerks = [];
		for (let perkName in defaultPerkStats) {
			if ( (defaultPerkStats[perkName].prerequisite == '') || (v.perks.includes(defaultPerkStats[perkName].prerequisite)) ) {
				if (!(v.exhaustedPerks.includes(perkName))) {
					v.newPerks.push(perkName);
				}	
			}
		}
	}
	
	function SetNewPerk(perkName) {
		v.perks.push(perkName);
		v.exhaustedPerks.push(perkName);
		RemoveFromArray(v.perks, defaultPerkStats[perkName].prerequisite);
		
		if ((perkName === 'disc1') || (perkName === 'disc2') || (perkName === 'disc3')) {
			v.discontinueTokens = +v.discontinueTokens + +defaultPerkStats[perkName].effect;
		}
		if ((perkName === 'coupons1') || (perkName === 'coupons2') || (perkName === 'coupons3')) {
			v.coupons = +v.coupons + +defaultPerkStats[perkName].effect;
		}
		
		$('#kitchen').show();
		$('#bottom_controls').show();
		$('#options').hide();
		gameState = 'normal';
		$('#options	.inner').html('');
		UpdateFoodItems();
		UpdateIncome();
		$('#progressbars').fadeIn(500);
		$('#prestige_button').fadeIn(500);
	}
	
	function SelectStarterRestaurant() {
		$('#dishwashing').hide();
		$('#default').hide();
		$('#storefront').hide();
		$('#kitchen').hide();
		$('#bottom_controls').hide();
		$('#options').show();
		gameState = 'selectStarterRestaurant';
		// Get food choices and making sure they are different enough
		
		let starterFood = v.activeFood.slice();
		let optionsHTML = '';
		
		if (!(v.skills['tier2_3starter'] >= 1)) { // not tier2-3 starter		
			let rnd1 = GetRandomInt(0,starterFood.length - 1);
			let rnd2 = GetRandomInt(0,starterFood.length - 1);
			let food1 = starterFood[rnd1];
			let food2 = starterFood[rnd2];
			let synergy1 = false;
			if ( 
				(defaultFoodStats[food1].class_a == defaultFoodStats[food2].class_a ) ||
				(defaultFoodStats[food1].class_a == defaultFoodStats[food2].class_b ) ||
				(defaultFoodStats[food1].class_b == defaultFoodStats[food2].class_a ) ||
				(defaultFoodStats[food1].class_b == defaultFoodStats[food2].class_b )
			   ) {
				synergy1 = true;
			}		
			for (let i = 0; i < 9; i++) {
				if ((rnd1==rnd2) || (synergy1 == false)) {
					rnd1 = GetRandomInt(0,starterFood.length - 1);
					rnd2 = GetRandomInt(0,starterFood.length - 1);
					food1 = starterFood[rnd1];
					food2 = starterFood[rnd2];
					if ( 
						(defaultFoodStats[food1].class_a == defaultFoodStats[food2].class_a ) ||
						(defaultFoodStats[food1].class_a == defaultFoodStats[food2].class_b ) ||
						(defaultFoodStats[food1].class_b == defaultFoodStats[food2].class_a ) ||
						(defaultFoodStats[food1].class_b == defaultFoodStats[food2].class_b )
					   ) {
						synergy1 = true;
					} else {
						synergy1 = false;
					}
				}
			}

			let rnd3 = GetRandomInt(0,starterFood.length - 1);
			let rnd4 = GetRandomInt(0,starterFood.length - 1);
			let food3 = starterFood[rnd3];
			let food4 = starterFood[rnd4];
			let synergy2 = false;
			if ( 
				(defaultFoodStats[food3].class_a == defaultFoodStats[food4].class_a ) ||
				(defaultFoodStats[food3].class_a == defaultFoodStats[food4].class_b ) ||
				(defaultFoodStats[food3].class_b == defaultFoodStats[food4].class_a ) ||
				(defaultFoodStats[food3].class_b == defaultFoodStats[food4].class_b )
			   ) {
				synergy2 = true;
			}
			for (let i = 0; i < 19; i++) {
				if ((rnd3==rnd4) || (rnd3==rnd1) || (rnd3==rnd2) || (rnd4==rnd1) || (rnd4==rnd2) || (synergy2 == false)) {
					rnd3 = GetRandomInt(0,starterFood.length - 1);
					rnd4 = GetRandomInt(0,starterFood.length - 1);
					food3 = starterFood[rnd3];
					food4 = starterFood[rnd4];
					if ( 
						(defaultFoodStats[food3].class_a == defaultFoodStats[food4].class_a ) ||
						(defaultFoodStats[food3].class_a == defaultFoodStats[food4].class_b ) ||
						(defaultFoodStats[food3].class_b == defaultFoodStats[food4].class_a ) ||
						(defaultFoodStats[food3].class_b == defaultFoodStats[food4].class_b )
					   ) {
						synergy2 = true;
					} else {
						synergy2 = false;
					}
				}
			}
			
			let rnd5 = GetRandomInt(0,starterFood.length - 1);
			let rnd6 = GetRandomInt(0,starterFood.length - 1);
			let food5 = starterFood[rnd5];
			let food6 = starterFood[rnd6];
			let synergy3 = false;
			if ( 
				(defaultFoodStats[food5].class_a == defaultFoodStats[food6].class_a ) ||
				(defaultFoodStats[food5].class_a == defaultFoodStats[food6].class_b ) ||
				(defaultFoodStats[food5].class_b == defaultFoodStats[food6].class_a ) ||
				(defaultFoodStats[food5].class_b == defaultFoodStats[food6].class_b )
			   ) {
				synergy3 = true;
			}
			for (let i = 0; i < 29; i++) {
				if ((rnd5==rnd6) || (rnd5==rnd1) || (rnd5==rnd2)|| (rnd5==rnd3)|| (rnd5==rnd4) || (rnd6==rnd1) || (rnd6==rnd2) || (rnd6==rnd3) || (rnd6==rnd4) || (synergy3 == false)) {
					rnd5 = GetRandomInt(0,starterFood.length - 1);
					rnd6 = GetRandomInt(0,starterFood.length - 1);
					food5 = starterFood[rnd5];
					food6 = starterFood[rnd6];
					if ( 
						(defaultFoodStats[food5].class_a == defaultFoodStats[food6].class_a ) ||
						(defaultFoodStats[food5].class_a == defaultFoodStats[food6].class_b ) ||
						(defaultFoodStats[food5].class_b == defaultFoodStats[food6].class_a ) ||
						(defaultFoodStats[food5].class_b == defaultFoodStats[food6].class_b )
					   ) {
						synergy3 = true;
					} else {
						synergy3 = false;
					}
				}
			}		
			
			let rndQty1 = GetRandomInt(v.skills.minCook,v.skills.maxCook);
			let rndQty2 = GetRandomInt(v.skills.minCook,v.skills.maxCook);
			let rndQty3 = GetRandomInt(v.skills.minCook,v.skills.maxCook);
			let rndQty4 = GetRandomInt(v.skills.minCook,v.skills.maxCook);
			let rndQty5 = GetRandomInt(v.skills.minCook,v.skills.maxCook);
			let rndQty6 = GetRandomInt(v.skills.minCook,v.skills.maxCook);

			optionsHTML += '<div id="new1" style="padding: 3px; border: 1px solid #c78888; display:inline-block;margin-bottom: 12px;" ><b class="restaurantname" style="color:#c78888; width:200px;height: 36px;display: block;">'+GenerateRestaurantName()+'</b>';
			optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + starterFood[rnd1] + '" data-qty="'+rndQty1+'"><span class="qty">'+rndQty1+'</span></div></div>';
			optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + starterFood[rnd2] + '" data-qty="'+rndQty2+'"><span class="qty">'+rndQty2+'</span></div></div>';
			optionsHTML += 	'<br><button onClick="SetDefaultFood(1)">选择</button>';			
			optionsHTML += '</div>';
			optionsHTML += '<div id="new2" style="padding: 3px; border: 1px solid #c78888; display:inline-block;margin-bottom: 12px;"><b class="restaurantname" style="color:#c78888; width:200px;height: 36px;display: block;">'+GenerateRestaurantName()+'</b>';
			optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + starterFood[rnd3] + '" data-qty="'+rndQty3+'"><span class="qty">'+rndQty3+'</span></div></div>';
			optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + starterFood[rnd4] + '" data-qty="'+rndQty4+'"><span class="qty">'+rndQty4+'</span></div></div>';
			optionsHTML += 	'<br><button onClick="SetDefaultFood(2)">选择</button>';
			optionsHTML += '</div>';
			if (v.skills.triple_choice === 'HardResetGame()') {
				optionsHTML += '<div id="new3" style="padding: 3px; border: 1px solid #c78888; display:inline-block;margin-bottom: 12px;"><b class="restaurantname" style="color:#c78888; width:200px;height: 36px;display: block;">'+GenerateRestaurantName()+'</b>';
				optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + starterFood[rnd5] + '" data-qty="'+rndQty5+'"><span class="qty">'+rndQty5+'</span></div></div>';
				optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + starterFood[rnd6] + '" data-qty="'+rndQty6+'"><span class="qty">'+rndQty6+'</span></div></div>';
				optionsHTML += 	'<br><button onClick="SetDefaultFood(3)">选择</button>';
				optionsHTML += '</div>';
			}
		} else { //Tier2-3			
			optionsHTML += '<select id="new_food_select_1">';
			for (let foodName in defaultFoodStats) {		
				if (defaultFoodStats[foodName].class_a != 'buff') {
					optionsHTML += '<option name="'+foodName+'" value="'+foodName+'" style="background-image:url(/img/food/'+foodName+'.png);line-height: 40px; height: 40px; padding-left: 45px;">'+BeautifyDataType(foodName)+'</options>';
				}	
			}
			optionsHTML += '</select>';
			optionsHTML += '<select id="new_food_select_2">';
			for (let foodName in defaultFoodStats) {				
				if (defaultFoodStats[foodName].class_a != 'buff') {
					optionsHTML += '<option name="'+foodName+'" value="'+foodName+'">'+BeautifyDataType(foodName)+'</options>';
				}
			}
			optionsHTML += '</select>';
			optionsHTML += '<br>';
			optionsHTML += '<div id="new1">';			
			optionsHTML += '<div class="fooditem-wrapper"><div id="" class="fooditem" data-buffs="" data-type="banana_sandwich" data-qty="'+v.skills['maxCook']+'"><span class="qty">'+v.skills['maxCook']+'</span></div></div>';
			optionsHTML += '<div class="fooditem-wrapper"><div id="" class="fooditem" data-buffs="" data-type="banana_sandwich" data-qty="'+v.skills['maxCook']+'"><span class="qty">'+v.skills['maxCook']+'</span></div></div>';
			optionsHTML += '<b class="restaurantname" style="color:#a618d2; display: block;">'+GenerateRestaurantName()+'</b>';
			optionsHTML += 	'<button onClick="SetDefaultFood(1)">选择</button>';
			optionsHTML += '</div>';
		}
		
		$('#options	.inner').html(optionsHTML);
		
		//select with images - could try some time later
		/*let ddData = [
			{
				text: "Facebook",
				value: 1,
				selected: false,
				description: "Description with Facebook",
				imageSrc: "https://i.imgur.com/XkuTj3B.png"
			}
		];
		for (let foodName in defaultFoodStats) {		
			//populate ddData	
		}*/
		
		if ((v.skills['tier2_3starter'] >= 1)) { // Tier2-3 starter	
			let sel1 = $('#new_food_select_1');			
			let opts_list1 = sel1.find('option');
			opts_list1.sort(function(a, b) { return $(a).text() > $(b).text() ? 1 : -1; });
			sel1.html('').append(opts_list1);
			sel1[0].selectedIndex = 0;
			sel1.off('change').on('change', function (e) {
				$('#new1 .fooditem').eq(0).attr('data-type', $(this).val()); 
			});
			
			let sel2 = $('#new_food_select_2');			
			let opts_list2 = sel2.find('option');
			opts_list2.sort(function(a, b) { return $(a).text() > $(b).text() ? 1 : -1; });
			sel2.html('').append(opts_list2);
			sel2[0].selectedIndex = 0;
			sel2.off('change').on('change', function (e) {
				$('#new1 .fooditem').eq(1).attr('data-type', $(this).val()); 
			});
		}
		
		$('#options .tr_label').text('选择初始餐馆');
		$('#options .fooditem').each(
			function() {
				$(this).prop('onclick', null).off('click');

				$(this).off('mouseover');
				$(this).on('mouseover', function (e) {
					let thisDataType = $(this).attr('data-type');
					if (thisDataType == '') {
						return false;
					}

					let thisClassA = defaultFoodStats[thisDataType].class_a;
					let thisClassB = defaultFoodStats[thisDataType].class_b;
					let thisBaseIncome = defaultFoodStats[thisDataType].baseIncome;

					let thisDataTypeCapitalized = BeautifyDataType(thisDataType);

					let desc = '<b style="font-size: 16px;">' + thisDataTypeCapitalized + '</b><br>';
					desc += '<b class="category_circle" style="color:'+colors[thisClassA]+'">●</b> ' + BeautifyDataType(thisClassA) + '<br>';
					desc += '<b class="category_circle" style="color:'+colors[thisClassB]+'">●</b> ' + BeautifyDataType(thisClassB) + '<br>';
					desc += '基础收益: <b>' + thisBaseIncome + '</b><br>';
					$descriptionBox.html(desc);
					descFadeout = false;
					e.stopPropagation();
				});					
				$(this).off('mouseout').on('mouseout', function (e) {
					DescStartFadeOut();
					e.stopPropagation();
				});
			}
		);		
		
		UpdateIncome();
		UpdateButtonsOnChange();
		UpdateFoodItems();
	}
	
	function SetDefaultFood(newVal) {		
		let newFood1 = $('#new'+newVal+ ' .fooditem').eq(0).attr('data-type');
		let newFood1Qty = $('#new'+newVal+ ' .fooditem').eq(0).attr('data-qty');
		let newFood2 = $('#new'+newVal+ ' .fooditem').eq(1).attr('data-type');
		let newFood2Qty = $('#new'+newVal+ ' .fooditem').eq(1).attr('data-qty');
		let newName = $('#new'+newVal+ ' .restaurantname').eq(0).text();
		let newDefaultHtml = '';
		v.restaurantName = newName;				
				
		$('#default').html('<div class="tr_label restaurantname">餐馆名称</div><div class="fooditems"></div>');		
		$('#game .restaurantname').text(newName);		
		$('#default .fooditems').append('<div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="'+newFood1+
			'" data-qty="'+newFood1Qty+'"><span class="qty">'+newFood1Qty+'</span></div></div>');
		$('#default .fooditems').append('<div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="'+newFood2+
			'" data-qty="'+newFood2Qty+'"><span class="qty">'+newFood2Qty+'</span></div></div>');
		
		if (v.skills['science'] >= 1) {
			$('#default').append('<button class="science" onClick="DoScience();">应用科学</button>');
		}
		
		if (v.skills['tier2_3starter'] >= 1) {
			if (v.activeFood.indexOf(newFood1) === -1) {
				v.activeFood.push(newFood1);				
				RemoveFromArray(v.newFood, newFood1);
			}	
			if (v.activeFood.indexOf(newFood2) === -1) {
				v.activeFood.push(newFood2);				
				RemoveFromArray(v.newFood, newFood2);
			}			
		}

		$('#default').show();
		$('#storefront').show();
		$('#kitchen').show();
		$('#bottom_controls').show();
		$('#options').hide();
		$('#dishwashing').hide();				
		$('#default').show();		
		gameState = 'normal';		
		$('#options	.inner').html('');
		UpdateFoodItems();
		UpdateIncome();
		UpdateButtonsOnChange();
		$('#game').removeClass('bigmenu');
	}
	
	function DoScience() {
		let tempCategories = Object.keys(v.categoryBonuses);			
		let defFood1 = $('#default .fooditem').eq(0).attr('data-type');
		let defFood2 = $('#default .fooditem').eq(1).attr('data-type');		
		// do not make 肉类 dishes 素食, 高价 dishes 廉价, and vice versa
		if (
			(defaultFoodStats[defFood1].class_a == '肉类') ||
			(defaultFoodStats[defFood1].class_b == '肉类') ||
			(defaultFoodStats[defFood2].class_a == '肉类') ||
			(defaultFoodStats[defFood2].class_b == '肉类')			
		   ) {
			tempCategories = tempCategories.filter(function(e) { return e !== '肉类' });
			tempCategories = tempCategories.filter(function(e) { return e !== '素食' });
		}	
		if (
			(defaultFoodStats[defFood1].class_a == '素食') ||
			(defaultFoodStats[defFood1].class_b == '素食') ||
			(defaultFoodStats[defFood2].class_a == '素食') ||
			(defaultFoodStats[defFood2].class_b == '素食')			
		   ) {
			tempCategories = tempCategories.filter(function(e) { return e !== '肉类' });
			tempCategories = tempCategories.filter(function(e) { return e !== '素食' });
		}	
		
		if (
			(defaultFoodStats[defFood1].class_a == '廉价') ||
			(defaultFoodStats[defFood1].class_b == '廉价') ||
			(defaultFoodStats[defFood2].class_a == '廉价') ||
			(defaultFoodStats[defFood2].class_b == '廉价')			
		   ) {
			tempCategories = tempCategories.filter(function(e) { return e !== '廉价' });
			tempCategories = tempCategories.filter(function(e) { return e !== '高价' });
		}	
		if (
			(defaultFoodStats[defFood1].class_a == '高价') ||
			(defaultFoodStats[defFood1].class_b == '高价') ||
			(defaultFoodStats[defFood2].class_a == '高价') ||
			(defaultFoodStats[defFood2].class_b == '高价')			
		   ) {
			tempCategories = tempCategories.filter(function(e) { return e !== '廉价' });
			tempCategories = tempCategories.filter(function(e) { return e !== '高价' });
		}
		
		tempCategories = tempCategories.filter(function(e) { return e !== defaultFoodStats[defFood1].class_a });
		tempCategories = tempCategories.filter(function(e) { return e !== defaultFoodStats[defFood1].class_b });
		tempCategories = tempCategories.filter(function(e) { return e !== defaultFoodStats[defFood2].class_a });
		tempCategories = tempCategories.filter(function(e) { return e !== defaultFoodStats[defFood2].class_b });
		
		let rnd1 = GetRandomInt(0, tempCategories.length -1);
		
		let tempCategory = tempCategories[rnd1];
		
		$('button.science').hide();
		$('#default').append('<p id="default_text">这些菜肴现在也<br><b id="default_dots">.</b></p>');
		$('#default').css('height', '206px');
		intervalScience = setInterval(function() {ScienceTick(tempCategory, defFood1, defFood2);}, 500);
	}
	
	let science_ticks = 0;
	const dot_symbol = '.';
	
	function ScienceTick(tempCategory, defFood1, defFood2) {
		science_ticks++;
		if (science_ticks < 10) {
			$('#default_dots').text(dot_symbol.repeat(science_ticks)); 
		}
		if (science_ticks === 10) {
			v.scienceCategory = tempCategory; 
			v.scienceType1 = defFood1; 
			v.scienceType2 = defFood2; 
			UpdateFoodItems();
			UpdateIncome();
			
			$('#default_dots').text(v.scienceCategory);
			if (v.scienceCategory !== '快餐') {
				$('#default_dots').css('color', colors[v.scienceCategory]);
			} else {
				$('#default_dots').css('color', '#cb8f8f');
			}
		}
		
		if (science_ticks > 22) {
			$('#default_text').remove();
			$('#default').css('height', '120px');
			clearInterval(intervalScience);
			science_ticks = 0;
		}
	}

	function DishwashingRefresh() {
		$('#dirty_stack .plate.pos1').attr('data-type',dishwashing.dirty[0]);
		$('#dirty_stack .plate.pos2').attr('data-type',dishwashing.dirty[1]);
		$('#dirty_stack .plate.pos3').attr('data-type',dishwashing.dirty[2]);
		$('#dirty_stack .plate.pos4').attr('data-type',dishwashing.dirty[3]);
		$('#dirty_stack .plate.pos5').attr('data-type',dishwashing.dirty[4]);
		$('#sink .plate').attr('data-type',dishwashing.sink);
		$('#clean_stack .plate.pos1').attr('data-type',dishwashing.clean[4]); //reverse order
		$('#clean_stack .plate.pos2').attr('data-type',dishwashing.clean[3]);
		$('#clean_stack .plate.pos3').attr('data-type',dishwashing.clean[2]);
		$('#clean_stack .plate.pos4').attr('data-type',dishwashing.clean[1]);
		$('#clean_stack .plate.pos5').attr('data-type',dishwashing.clean[0]);
	}

	function DishwashingTake() {
		if (dishwashing.sink == '') {
			let workDone = false;
			$.each(dishwashing.dirty, function( arIndex, arValue ) { // take top plate from the stack
				if (!workDone) {
					if (arValue != '') {
						dishwashing.dirty[arIndex] = '';
						dishwashing.sink = arValue;
						$('#dirty button').prop('disabled', true);
						$('#sink button').prop('disabled', false);
						$('#sink button').text('清理');
						workDone = true;
					}
				}
			});
		}

		DishwashingRefresh();
	}

	function DishwashingWash() {
		if (dishwashing.sink == '') { // do nothing
			DishwashingRefresh();
			return false;
		}

		if (dishwashing.sink == 'd') { // wash half-dirty plate
			dishwashing.sink = '0';
			$('#sink button').prop('disabled', true);
			$('#clean button').prop('disabled', false);
			$('#sink button').text('清理');
			$('#clean button').text('叠放');
			DishwashingRefresh();
			return false;
		}

		dishwashing.sink = 'd'; // clean full-dirty plate to half-dirty
		$("#sink button").text('清洗');
		DishwashingRefresh();
	}

	function DishwashingNewBatch() {
		if ( (dishwashing.clean.equals(["","","","",""])) && (dishwashing.dirty.equals(["","","","",""])) && (dishwashing.sink == "") ) { // get new batch
			dishwashing.dirty = [GetRandomInt(1,9),GetRandomInt(1,9),GetRandomInt(1,9),GetRandomInt(1,9),GetRandomInt(1,9)];			
			$('#clean button').prop('disabled', true);
			$('#dirty button').prop('disabled', false);
			DishwashingRefresh();
		}
		if (dishwashing.clean.equals(["0","0","0","0","0"])) { // Done - get money
			dishwashing.sink = '';
			dishwashing.clean = ['','','','',''];
			$("#sink button").text('清理');
			$("#clean button").text('新一批');
			DishwashingRefresh();
			let dishwashingReward = 300;
			if (v.skills.cook2 >= 1) {
				dishwashingReward = 600;				
			}
			if (v.skills.cook3 >= 1) {
				dishwashingReward = 900;
			}
			if (v.skills.cook6 >= 1) {
				dishwashingReward = 1800;
			}
			$('#plus_money').html('+'+dishwashingReward+'&nbsp;<span>💲</span>');
			v.money = +v.money + +dishwashingReward;
			DishwashingMoneyAnimation();
			if (v.tutorialLevel == 'dishwashing') {
				$('#storefront').fadeIn(500);
				$('#kitchen').fadeIn(500);
				$('#bottom_controls').fadeIn(500);
				$cookButton.addClass('glow');

				v.tutorialLevel = 'cooking0';
				UpdateTutorial();
			}
		}
		if (dishwashing.sink == '0') { // put plate to clean stack
			dishwashing.sink = '';
			let workDone = false;
			$.each(dishwashing.clean, function( arIndex, arValue ) {
				if (!workDone) {
					if (arValue == '') {
						dishwashing.clean[arIndex] = '0';
						workDone = true;
					}
				}
			});
			if (!(dishwashing.dirty.equals(['','','','','']))) {
				$('#clean button').prop('disabled', true);
				$('#dirty button').prop('disabled', false);
			} else {
				$("#clean button").text('完成');
			}
			DishwashingRefresh();
			return false;
		}
	}

	function DishwashingMoneyAnimation() {
		$('#plus_money').css('transform', 'translateY(30px)');
		$('#plus_money').show();
		$('#plus_money').css('transform', 'translateY(0px)');
		setTimeout(function() {
				$('#plus_money').hide();
			}, 1000);
	}
	
	function DishwashingToggle() {
		if (dishwashingOpen) {
			$('#dishwashing').css('height', '30px');
			$('#dishwashing .tr_label').text('洗盘子 ▼');
			$('#dishwashing #dirty').fadeOut(500);
			$('#dishwashing #sink').fadeOut(500);
			$('#dishwashing #clean').fadeOut(500);
			$('#dishwashing button').fadeOut(500);
			dishwashingOpen = false;
		} else {
			$('#dishwashing').css('height', '150px');
			$('#dishwashing .tr_label').text('洗盘子 ▲');
			$('#dishwashing #dirty').fadeIn(500);
			$('#dishwashing #sink').fadeIn(500);
			$('#dishwashing #clean').fadeIn(500);
			$('#dishwashing button').fadeIn(500);
			dishwashingOpen = true;
		}
	}

	function CookForMoney(numRolls = 1, isSuperCook = false) {
		if ( (isSuperCook) && (v.cookCount < 6) ) {
			return false;
		}
		
		let totalRefreshPrice = (v.refreshPrice * numRolls);
		if ( (numRolls == 6) && (isSuperCook) ) {
			totalRefreshPrice = v.refreshPrice * 5;
			v.moneySuperCookCount++;
		}
		
		let kitchenNum = 1;
		$('#kitchen .fooditem').each(
			function() {
				$(this).attr('data-kitchen-num',kitchenNum);
				kitchenNum++;
			}	
		);

		if (v.money - totalRefreshPrice >= 0) {
			$('#kitchen .fooditem').each(
				function() {
					let $tempItem = $(this);
					let rnd = GetRandomInt(v.skills.minCook,v.skills.maxCook);
					$tempItem.fadeOut(200);
					setTimeout(function(){
						$tempItem.fadeIn(200);
						let rndFoodType = GetRandomActiveFoodType();
						$tempItem.attr('data-type',rndFoodType);
						$tempItem.attr('data-buffs','');
						$tempItem.text('');
						$tempItem.attr('data-qty',rnd * numRolls);
						if ( (numRolls == 6) && (isSuperCook) ) {
							if (((v.moneySuperCookCount % 3) == 0) && (v.skills['buffs'] >= 1)) {
								if ($tempItem.attr('data-kitchen-num') == 1) {
									$tempItem.attr('data-type', 'exotic_flavors');
								}
							}
							if (((v.moneySuperCookCount % 5) == 0) && (v.skills['buffs'] >= 2)) {
								if ($tempItem.attr('data-kitchen-num') == 2) {
									$tempItem.attr('data-type', 'food_decoration');
								}
							}
							if (((v.moneySuperCookCount % 10) == 0) && (v.skills['buffs'] >= 3)) {
								if ($tempItem.attr('data-kitchen-num') == 3) {
									$tempItem.attr('data-type', 'original_idea');
								}
							}
						}
						if ((rnd * numRolls) > 1) {
							$tempItem.html('<span class="qty">'+(rnd * numRolls)+'</span>');
						}
						UpdateFoodItems();
						UpdateIncome();
					}, 190);
				}
			);

			if (v.tutorialLevel === 'cooking0') {
				$('#kitchen').html(
					'<div class="tr_label">厨房</div>' +
					'<div class="fooditems">' +
						'<div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="sushi_rolls" data-qty="1"></div></div>' +
						'<div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="rice_ball" data-qty="1"></div></div>' +
						'<div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="french_fries" data-qty="1"></div></div>' +
					'</div>'
					);
				v.tutorialLevel = 'cooking1';
				$cookButton.prop('disabled', true);
				UpdateTutorial();
				UpdateFoodItems();
			}

			if ( (t[v.tutorialLevel].val >= t['cooking2'].val) && (t[v.tutorialLevel].val < t['combined0'].val)) {
				$('#kitchen').html(
					'<div class="tr_label">厨房</div>' +
					'<div class="fooditems">' +
						'<div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="rice_ball" data-qty="2"><span class="qty">2</span></div></div>' +
						'<div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="french_fries" data-qty="3"><span class="qty">3</span></div></div>' +
						'<div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="sushi_rolls" data-qty="1"></div></div>' +
					'</div>'	
					);
				v.tutorialLevel = 'combining0';
				$cookButton.prop('disabled', true);
				UpdateTutorial();
				UpdateFoodItems();
			}

			if (v.tutorialLevel === 'combined0') {
				$('#kitchen').html(
					'<div class="tr_label">厨房</div>' +
					'<div class="fooditems">' +
						'<div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="coffee" data-qty="1"></div></div>' +
						'<div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="yoghurt" data-qty="1"></div></div>' +
						'<div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="local_soda" data-qty="1"></div></div>' +
					'</div>'
					);
				v.tutorialLevel = '饮料s0';
				$cookButton.prop('disabled', true);
				UpdateTutorial();
				UpdateFoodItems();
			}
			
			v.money = v.money - totalRefreshPrice;
			if ( (v.prestigePointsToGet + v.prestigePointsTotal == 0) && (v.refreshPrice >= v.activeIncome * 120) ) { // capped for tutorial
				//do not increase cook cost
			} else {
				if ( (numRolls == 6) && (isSuperCook) ) {
					v.cookCount = v.cookCount - 6;
					v.refreshPrice = Math.round(v.refreshPrice * (1.1 ** 5));					
				} else {
					v.cookCount = +v.cookCount + +numRolls;
					v.refreshPrice = Math.round(v.refreshPrice * (1.1 ** numRolls));
				}
			}
			
			if ((v.tutorialLevel === 'tierup0') && (v.refreshPrice >= v.activeIncome * 15)) { // show idle tutorial
				v.tutorialLevel = 'idle0';
				UpdateTutorial();
			}

			$moneyCurrent.html(AbbreviateNumberLong(v.money) + ' <span>💲</span>');

			if (numRolls == 1) {
				$cookButton.trigger('mouseover');
			}
			if (numRolls == 2) {
				$cook2Button.trigger('mouseover');
			}
			if (numRolls == 3) {
				$cook3Button.trigger('mouseover');
			}
			if (numRolls == 6) {
				if (isSuperCook) {
					$superCookButton.trigger('mouseover');
				} else {
					$cook6Button.trigger('mouseover');
				}
				
			}
			
		}
		UpdateButtonsOnChange();
		cooksTotal++;
		$cookButton.removeClass('glow');
	}

	function CookForCoupons(numRolls = 1) {
		if ( (numRolls > 1) && (v.cookCouponsCount < 6) ) {
			return false;
		}
		if (numRolls == 1) {
			if (v.coupons > 0) {
				v.coupons = v.coupons - 1;
				$('#kitchen .fooditem').each(
					function() {
						let $tempItem = $(this);
						let rnd = GetRandomInt(v.skills.minCook, v.skills.maxCook);
						$tempItem.fadeOut(200);
						setTimeout(function(){
							$tempItem.fadeIn(200);
							let rndFoodType = GetRandomActiveFoodType();
							$tempItem.attr('data-type',rndFoodType);
							$tempItem.attr('data-buffs','');
							$tempItem.text('');
							$tempItem.attr('data-qty',rnd);
							$tempItem.html('<span class="qty">'+(rnd)+'</span>');
							UpdateFoodItems();
							UpdateIncome();
						}, 190);
					}
				);
				v.cookCouponsCount++;
			}
		} else {
			let numSuperRolls = 1;
			if (v.coupons >= 50) {
				numSuperRolls = Math.floor(v.coupons / 20); // 586 coupons -> 29 rolls X 5 coupons (and X 6 results)
			}
			if (v.coupons - (numSuperRolls*5) >= 0) {
				v.coupons = v.coupons - (numSuperRolls*5);
				$('#kitchen .fooditem').each(
					function() {
						let $tempItem = $(this);
						let rnd = GetRandomInt(v.skills.minCook, v.skills.maxCook);
						$tempItem.fadeOut(200);
						setTimeout(function(){
							$tempItem.fadeIn(200);							
							let rndFoodType = GetRandomActiveFoodType();
							$tempItem.attr('data-type',rndFoodType);
							$tempItem.text('');
							$tempItem.attr('data-qty',rnd * (numSuperRolls*6));
							$tempItem.html('<span class="qty">'+(rnd * (numSuperRolls*6))+'</span>');
							UpdateFoodItems();
							UpdateIncome();
						}, 190);
					}
				);
				v.cookCouponsCount = v.cookCouponsCount - 6;
				
				setTimeout(function(){// guarantee superfail doesn't happen - megacook always should give at least one useful dish
					if (numSuperRolls > 1) { 
						let superFail = true; 
						const foodTypes = {};
						$('#storefront .fooditem, #default .fooditem').each(
							function() {
								if ($(this).attr('data-type') !== '') {
									if (foodTypes[$(this).attr('data-type')] != 'exists') {
										foodTypes[$(this).attr('data-type')] = 'exists';
									}
								}
							}
						);
						Object.keys(foodTypes).forEach(function(key) {
							$('#kitchen .fooditem').each(
							function() {
								let $tempItem = $(this);
								if ( key === $tempItem.attr('data-type') ) {
									superFail = false;
								}
							});						
						});
						
						if (superFail) {
							let $firstInStorefront = $('#storefront .fooditem-wrapper').eq(0).children('.fooditem').eq(0);
							let $firstInKitchen = $('#kitchen .fooditem-wrapper').eq(0).children('.fooditem').eq(0);
							if (($firstInStorefront.attr('data-type') != '') && ($('#storefront .fooditem[data-type=""]').length == 0)) {
								$firstInKitchen.attr('data-type', $firstInStorefront.attr('data-type'));
							}
						}
					}
					UpdateFoodItems();
					UpdateIncome();
				}, 200); // 10 ms more than it takes to animate fadeout of previous food	
				
			}
		}

		$moneyCoupons.html(v.coupons + ' <span>🔖</span>');
		
		UpdateButtonsOnChange();
		
	}
	
	function UpdateButtonsOnTick() {
		// check if user has money to cook
		if (v.money >= v.refreshPrice) {
			$cookButton.removeClass('disabled').html('烹饪<br>' + AbbreviateNumber( (v.refreshPrice * v.currentCookMode) ) + '$');
		} else {
			$cookButton.addClass('disabled').html('烹饪<br>' + AbbreviateNumber( (v.refreshPrice * v.currentCookMode) ) + '$');
		}
		if (v.money >= v.refreshPrice*2) {
			$cook2Button.removeClass('disabled').html('双倍烹饪 <br>' + AbbreviateNumber( (v.refreshPrice * v.currentCookMode) ) + '$');
		} else {
			$cook2Button.addClass('disabled').html('双倍烹饪 <br>' + AbbreviateNumber( (v.refreshPrice * v.currentCookMode) ) + '$');
		}
		if (v.money >= v.refreshPrice*3) {
			$cook3Button.removeClass('disabled').html('三倍烹饪 <br>' + AbbreviateNumber( (v.refreshPrice * v.currentCookMode) ) + '$');
		} else {
			$cook3Button.addClass('disabled').html('三倍烹饪 <br>' + AbbreviateNumber( (v.refreshPrice * v.currentCookMode) ) + '$');
		}
		if (v.money >= v.refreshPrice*6) {
			$cook6Button.removeClass('disabled').html('六倍烹饪<br>' + AbbreviateNumber( (v.refreshPrice * v.currentCookMode) ) + '$');
		} else {
			$cook6Button.addClass('disabled').html('六倍烹饪<br>' + AbbreviateNumber( (v.refreshPrice * v.currentCookMode) ) + '$');
		}		

		if (v.coupons >= 1) {
			$cookCouponsButton.removeClass('disabled');
		} else {
			$cookCouponsButton.addClass('disabled');
		}

		// check if user has money AND charges to super cook
		if ( (v.money >= v.refreshPrice * 5) && (v.cookCount >= 6) && (v.activeIncome >= 200) ) {
			$superCookButton.removeClass('disabled');
		} else {
			$superCookButton.addClass('disabled');
		}

		if ((v.coupons >= 5) && (v.cookCouponsCount >= 6)) {
			$superCookCouponsButton.removeClass('disabled');
		} else {
			$superCookCouponsButton.addClass('disabled');
		}
		
		if ((v.coupons >= 50) && (v.cookCouponsCount >= 6)) {
			$superCookCouponsButton.html('海量烹饪<br>' + (Math.floor(v.coupons / 20) *5) + '<span style="opacity:0.8">🔖</span>');
		}
		
		// timers
		
		let cookDiff = (v.refreshPrice * v.currentCookMode) - v.money;
		let cookTime = 0;
		if ( (cookDiff > 0) && (v.activeIncome > 0) && (t[v.tutorialLevel].val >= t['finished0'].val) ) {
			cookTime = BeautifyTime(cookDiff / v.activeIncome);
			$cookTime.text(cookTime);
		} else {
			$cookTime.text('');
		}

		let superCookPrice = v.refreshPrice * 5;
		let superCookDiff = superCookPrice - v.money;
		let superCookTime = 0;
		if ((superCookDiff > 0) && (v.activeIncome > 200) && (v.cookCount >= 6)) {
			superCookTime = BeautifyTime(superCookDiff / v.activeIncome);
			$superCookTime.text(superCookTime).show();
		} else {
			$superCookTime.hide();
		}
		 	
		let couponDiff = v.couponShardsBreakpoint - v.couponShards;
		let couponTime = BeautifyTime(couponDiff);
		if (v.coupons < 1) {
			$cookCouponsTime.text(couponTime);
		} else {
			$cookCouponsTime.text('');
		}
		
		if ((v.coupons < 5) && (v.cookCouponsCount >= 6) && (v.skills.coupons >= 1)) {
			let superCookcouponTime = 0;
			let couponDiff = v.couponShardsBreakpoint - v.couponShards;
			superCookcouponTime = ((4 - v.coupons) * v.couponShardsBreakpoint) + couponDiff;
			superCookcouponTime = BeautifyTime(superCookcouponTime);
			$superCookCouponsTime.text(superCookcouponTime);
		} else {
			$superCookCouponsTime.text('');
		}
		
		// chameleon button
		if (v.skills.chameleonButton >= 1) {
			let cooksLeftNormal = v.money / v.refreshPrice;
			let cooksLeftLog = Math.log(cooksLeftNormal)/Math.log(2); // ~10 at 1000 normal cooks
			if (cooksLeftLog > 10) {
				cooksLeftLog = 10;
			}
			
			let cookButtonColor1 = [126,210,126]; //green
			let cookButtonColor2 = [0,0,255]; //blue
			let cooksLeftRed = 		Math.round(cookButtonColor1[0] + ( (cookButtonColor2[0] - cookButtonColor1[0]) * (cooksLeftLog / 10) ));
			let cooksLeftGreen = 	Math.round(cookButtonColor1[1] + ( (cookButtonColor2[1] - cookButtonColor1[1]) * (cooksLeftLog / 10) ));
			let cooksLeftBlue = 	Math.round(cookButtonColor1[2] + ( (cookButtonColor2[2] - cookButtonColor1[2]) * (cooksLeftLog / 10) ));
			$cookButton.css('background', 'rgb('+cooksLeftRed+', '+cooksLeftGreen+', '+cooksLeftBlue+')');
			$cook2Button.css('background', 'rgb('+cooksLeftRed+', '+cooksLeftGreen+', '+cooksLeftBlue+')');
			$cook3Button.css('background', 'rgb('+cooksLeftRed+', '+cooksLeftGreen+', '+cooksLeftBlue+')');
			$cook6Button.css('background', 'rgb('+cooksLeftRed+', '+cooksLeftGreen+', '+cooksLeftBlue+')');
		}
	}

	function UpdateButtonsOnChange() {
		let supercookCouponsText = '......';
		if (v.cookCouponsCount >= 6) {
			$('.supercookCoupons').html('超级烹饪<br>5 <span style="opacity:0.8">🔖</span>');
		} else {
			for (let i = 0; i < v.cookCouponsCount; i++) {
				supercookCouponsText = SetCharAt(supercookCouponsText, i, 'o');
			}
			supercookCouponsText = supercookCouponsText.split('o').join('<span class="lightning">⚡</span>');
			supercookCouponsText = supercookCouponsText.split('.').join('<span class="lightning grayscale">⚡</span>');
			$('.supercookCoupons').html('超级烹饪&nbsp;<span style="opacity:0.8">🔖</span> <div style="padding-top: 2px">' + supercookCouponsText + '</div>');
		}

		// check if user has charges to super cook
		if ( (v.cookCount >= 6) && (v.activeIncome > 200) ) {
			$superCookButton.addClass('has_charges');
		} else {
			$superCookButton.removeClass('has_charges');
		}

		if (v.cookCouponsCount >= 6) {
			$superCookCouponsButton.addClass('has_charges');
		} else {
			$superCookCouponsButton.removeClass('has_charges');
		}

		// check if user has income to tier up the restaurant
		if (v.activeIncome >= v.incomeBreakpoint) {
			$('button.new').removeClass('disabled').html('升阶');
		} else {
			$('button.new').addClass('disabled').html('解锁于<br>'+AbbreviateNumberEmoji(v.incomeBreakpoint));
		}

		if (v.activeIncome >= 200) {
			let supercookText = '......';
			if (v.cookCount >= 6) {
				$superCookButton.html('超级烹饪<br>' + AbbreviateNumber(v.refreshPrice * 5) + '$');
			} else {
				for (let i = 0; i < v.cookCount; i++) {
					supercookText = SetCharAt(supercookText, i, 'o');
				}
				supercookText = supercookText.split('o').join('<span class="lightning">⚡</span>');
				supercookText = supercookText.split('.').join('<span class="lightning grayscale">⚡</span>');
				$superCookButton.html('超级烹饪 <div style="padding-top: 2px">' + supercookText + '</div>');
			}
		} else {
			$superCookButton.html('解锁于<br>200/秒 💸');
		}
				
		if (v.currentCookMode == 1) {
			$cookButton.show();
		} else {
			$cookButton.hide();
		}
		
		if (v.currentCookMode == 2) {
			$cook2Button.show();
		} else {
			$cook2Button.hide();
		}
		
		if (v.currentCookMode == 3) {
			$cook3Button.show();
		} else {
			$cook3Button.hide();
		}
		
		if (v.currentCookMode == 6) {
			$cook6Button.show();
		} else {
			$cook6Button.hide();
		}
		
		UpdateButtonsOnTick();
		
	}
	
	function DefineNewVariables() {		
		if (v.couponShardsBreakpoint === undefined) {
			v.couponShardsBreakpoint = 600;
		}
		if (v.currentNovelty == undefined) {
			v.currentNovelty =  {
					肉类: 50,
					素食: 50,
					海鲜: 50,
					快餐: 50,
					甜品: 50,
					廉价: 50,
					高价: 50,
					饮料: 50
				};
		}
		if (v.nextNovelty == undefined) {
			v.nextNovelty =  {
					肉类: 50,
					素食: 50,
					海鲜: 50,
					快餐: 50,
					甜品: 50,
					廉价: 50,
					高价: 50,
					饮料: 50
				};
		}
		if (v.noveltyShards === undefined) {
			v.noveltyShards = 0;
		}
		if (v.noveltyShardsBreakpoint === undefined) {
			v.noveltyShardsBreakpoint = 60*60; // 1 hour
		}	
		
	}	
	
	function InitializeButtons() {
		$cookButton.off('mouseover').on('mouseover', function (e) {
			let desc = '烹饪<br>';
			if ( t[v.tutorialLevel].val >= t['has饮料s1'].val ) {
				desc += '烹饪5道随机菜肴.<br>';
				desc += '可用的菜肴的列表可以在信息面板中找到.<br>';
				desc += '<b>每次使用会提高花费,所以谨慎使用.</b><br>';
			} else {
				desc += '烹饪下个教程菜肴.<br>';
			}

			desc += '数量下限: ' + v.skills.minCook + '<br>';
			desc += '数量上限: ' + v.skills.maxCook + '<br>';
			desc += '花费: ' + AbbreviateNumber(v.refreshPrice) + '$<br>';
			if ( (v.prestigePointsToGet + v.prestigePointsTotal == 0) && (v.refreshPrice >= v.activeIncome * 120) && (v.activeIncome >= 300) ) { // capped for tutorial
				desc += '下次花费: ' + AbbreviateNumber(Math.round(v.refreshPrice)) + '$ (已封顶,直到你下次重生)<br>';
			}  else {
				desc += '下次花费: ' + AbbreviateNumber(Math.round(v.refreshPrice * 1.1)) + '$<br>';
			}
			
			if ((v.skills.cook2 >= 1)) {
				desc += '<br>';
				if (isMobile()) {
					desc += '按住3秒来切换模式.<br>';
				} else {
					desc += '右键点击来切换模式.<br>';
				}				
			}
			
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {			
			DescStartFadeOut();
			e.stopPropagation();
		});
		
		$cook2Button.off('mouseover').on('mouseover', function (e) {
			let desc = '双倍烹饪<br>';
			desc += '烹饪5道随机菜肴.<br>';
			desc += '数量下限: ' + v.skills.minCook*2 + '<br>';
			desc += '数量上限: ' + v.skills.maxCook*2 + '<br>';
			desc += '花费: ' + AbbreviateNumber(v.refreshPrice*2) + '$<br>';
			desc += '下次花费: ' + AbbreviateNumber(Math.round(2 * v.refreshPrice * (1.1**2))) + '$<br>';
			desc += '<br>';
			if (isMobile()) {
				desc += '按住3秒来切换模式.<br>';
			} else {
				desc += '右键点击来切换模式.<br>';
			}	
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});
		
		$cook3Button.off('mouseover').on('mouseover', function (e) {
			let desc = '三倍烹饪<br>';
			desc += '烹饪5道随机菜肴.<br>';
			desc += '数量下限: ' + v.skills.minCook*3 + '<br>';
			desc += '数量上限: ' + v.skills.maxCook*3 + '<br>';
			desc += '花费: ' + AbbreviateNumber(v.refreshPrice*3) + '$<br>';
			desc += '下次花费: ' + AbbreviateNumber(Math.round(3 * v.refreshPrice * (1.1**3))) + '$<br>';
			desc += '<br>';
			if (isMobile()) {
				desc += '按住3秒来切换模式.<br>';
			} else {
				desc += '右键点击来切换模式.<br>';
			}	
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});
		
		$cook6Button.off('mouseover').on('mouseover', function (e) {
			let desc = '六倍烹饪<br>';
			desc += '烹饪5道随机菜肴.<br>';
			desc += '数量下限: ' + v.skills.minCook*6 + '<br>';
			desc += '数量上限: ' + v.skills.maxCook*6 + '<br>';
			desc += '花费: ' + AbbreviateNumber(v.refreshPrice*6) + '$<br>';
			desc += '下次花费: ' + AbbreviateNumber(Math.round(6 * v.refreshPrice * (1.1**6))) + '$<br>';
			if (isMobile()) {
				desc += '按住3秒来切换模式.<br>';
			} else {
				desc += '右键点击来切换模式.<br>';
			}
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});		

		$superCookButton.off('mouseover').on('mouseover', function (e) {
			let desc = '超级烹饪.<br>';
			desc += '以5优惠劵的价格烹饪6次.<br>';
			if (v.activeIncome >= 200) {
				desc += '需要充能6次进行激活.<br>';
				desc += '你正常烹饪时会获得充能.<hr>';
				desc += '当前充能: ' + v.cookCount + '<br>';
				desc += '数量下限: ' + (6*v.skills.minCook) + '<br>';
				desc += '数量上限: ' + (6*v.skills.maxCook) + '<br>';
				if (v.skills['buffs'] >= 1) {
					let scCount = 3 - (v.moneySuperCookCount % 3);
					if (scCount === 0) {						
						scCount = 3;
					}
					desc += '异国风味超级烹饪剩余: ' + scCount + '<br>';					
				}
				if (v.skills['buffs'] >= 2) {
					let scCount = 5 - (v.moneySuperCookCount % 5);
					if (scCount === 0) {						
						scCount = 5;
					}
					desc += '食品装饰超级烹饪剩余: ' + scCount + '<br>';					
				}
				if (v.skills['buffs'] >= 3) {
					let scCount = 10 - (v.moneySuperCookCount % 10);
					if (scCount === 0) {						
						scCount = 10;
					}
					desc += '原始创意超级烹饪剩余: ' + scCount + '<br>';					
				}				
			}
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});

		$('button.new').off('mouseover').on('mouseover', function (e) {
			let desc = '升阶.<br>';
			desc += '- 获得 +20% 收益<br>';
			desc += '- 获得更多菜单空间<br>';
			desc += '- 解锁新的菜肴<br>';
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});
		
		$cookCouponsButton.off('mouseover').on('mouseover', function (e) {
			let desc = '优惠劵烹饪.<br>';
			desc += '和普通烹饪一样,但是消耗1张优惠券.<br>';
			desc += '不会提高普通烹饪价格.<br>';
			desc += '数量下限: ' + v.skills.minCook + '<br>';
			desc += '数量上限: ' + v.skills.maxCook + '<br>';			
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});
		
		$superCookCouponsButton.off('mouseover').on('mouseover', function (e) {
			let desc = '';
			if (v.coupons >= 50) {				
				let numSuperRolls = Math.floor(v.coupons / 20); // 586 coupons -> 29 rolls X 5 coupons (and X 6 results)
				desc = '优惠劵超级烹饪.<br>';
				desc = '海量烹饪: 你拥有50+优惠劵.<br>';
				desc += '烹饪' + (numSuperRolls*6) + '次以' + (numSuperRolls*5) + '张优惠券的价格.<br>';
			} else {
				desc = '优惠劵超级烹饪.<br>';
				desc += '以5优惠劵的价格烹饪6次.<br>';
			}
			if (v.activeIncome >= 200) {
				desc += '需要充能6次进行激活.<br>使用优惠劵烹饪时获得充能.<hr>';
				desc += '当前充能: ' + v.cookCouponsCount + '<br>';
				if (v.coupons >= 50) {
					let numSuperRolls = Math.floor(v.coupons / 20); // 586 coupons -> 29 rolls X 5 coupons (and X 6 results)
					desc += '数量下限: ' + (numSuperRolls*6*v.skills.minCook) + '<br>';
					desc += '数量上限: ' + (numSuperRolls*6*v.skills.maxCook) + '<br>';	
				} else {	
					desc += '数量下限: ' + (6*v.skills.minCook) + '<br>';
					desc += '数量上限: ' + (6*v.skills.maxCook) + '<br>';			
				}	
			}
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});
		
		$('button.sortByIncome').off('mouseover').on('mouseover', function (e) {
			let desc = '按收益排序菜肴.<br>';
			if (v.skills.mealOfTheDay >= 1) {
				desc += '不替换当前一日之餐菜肴.<br>';
			}
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});
		
		$moneyCurrent.off('mouseover').on('mouseover', function (e) {
			let desc = '你当前拥有的金钱数量.<br>';
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});

		$moneyIncome.off('mouseover').on('mouseover', function (e) {
			let desc = '你当前的每秒收益.<br>不同的图标直观地表示数量级(千,百万,等等).';
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});

		$moneyCoupons.off('mouseover').on('mouseover', function (e) {
			let desc = '你当前拥有优惠券数量.<br>';
			if (!(v.skills['fasterCoupons'] >= 1)) {
				desc += '你可以每10分钟获得1张优惠券.<br>';
			} else {
				desc += '你可以每5分钟获得1张优惠券.<br>';
			}
			desc += '重生时你不会失去优惠券.';
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});

		$('#category_bonuses').off('mouseover').on('mouseover', function (e) {
			let desc = '你餐厅的当前食物种类及其加成.<br><br>';

			let bonusLevels = '';
			let sortedBonuses = SortObjectByValue(v.foodClasses);
			sortedBonuses.forEach(function(item) {
				bonusLevels += '<div style="width: 95%;"><b class="category_circle" style="color:'+colors[item.k]+'">●</b> ' + BeautifyDataType(item.k) + ': '
								+ '<div style="float:right;">' + Math.round(v.categoryBonuses[item.k] * 100) + ' x ' + item.v + ' = ' + Math.round(v.categoryBonuses[item.k] * 100 * item.v) + '%</div></div>';
			});

			desc += bonusLevels;

			if (v.hasDuplicates) {
				desc += '<br>注意:你的餐馆里有一道重复的菜.副本不会提供额外的加成,所以通常最好合并它们.';
			}
			
			if ((v.skills.mealOfTheDay >= 1) && (mealOfTheDayActive == false)) {
				desc += '<br>注意:你的一日之餐没有激活.激活需要:<br>' +
							'第1道菜肴: 非饮料,非甜品<br>' +
							'第2道菜肴: 甜品<br>' +
							'第3道菜肴: 饮料<br>'
							;
			}

			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});

		$('#progressbars').off('mouseover').on('mouseover', function (e) {
			ProgressBarShowDesc();
			if (!isMobile()) {
				descInterval = setInterval(function(){
					ProgressBarShowDesc();
				},1000);
				e.stopPropagation();
			}	
		}).off('mouseout').on('mouseout', function (e) {
			if (!isMobile()) {
				$descriptionBox.html('');
				clearInterval(descInterval);
				e.stopPropagation();
			}
		}).off('contextmenu').on('contextmenu', function (e) {
			v.options.animations = !v.options.animations;
			if (!v.options.animations) {
				$progressbarPrestigeCover.css('transition', 'none');
				$progressbarPrestigeCover2.css('transition', 'none');
			}
			ProgressBarShowDesc();
			e.stopPropagation();
			return false;
		});
		
		$('.screen_button').off('click').on('click', function(event){
				let target = $(this).attr('id').replace('_button', '');
				if (target == 'info') {
					UpdateInfoScreen();
				}
				if (target == 'prestige') {
					UpdatePrestigeButtons();
				}		
				if (target == 'progress') {
					UpdateProgressScreen();
				}
				if (target == 'preferences') {
					UpdateOptionsScreen();
				}		
				if (target == 'shop') {
					UpdateShopScreen();
				}	
				$('.screen').hide();
				$('.screen#' + target).show();
				currentScreen = target;
				$('#default .fooditem-wrapper, #storefront .fooditem-wrapper').removeClass('glow_fast');
			}
		);
		
		$('#start_tutorial').off('mouseover').on('mouseover', function (e) {
			$('#tutorial_box').html(t['greetings0'].text);
			e.stopPropagation();
		});
		
		
		$cookButton.hide().unbind('contextmenu').bind('contextmenu',function(e){
			if (v.skills.cook2 >= 1) {
				v.currentCookMode = 2;		
				UpdateButtonsOnChange();
			}
			return false;
		});
		
		$cook2Button.hide().unbind('contextmenu').bind('contextmenu',function(e){
			if (v.skills.cook3 >= 1) {
				v.currentCookMode = 3;				
			} else {
				v.currentCookMode = 1;			
			}
			UpdateButtonsOnChange();
			return false;
		});
		
		$cook3Button.hide().unbind('contextmenu').bind('contextmenu',function(e){
			if (v.skills.cook6 >= 1) {
				v.currentCookMode = 6;				
			} else {
				v.currentCookMode = 1;
			}
			UpdateButtonsOnChange();
			return false;
		});		
		
		$cook6Button.hide().unbind('contextmenu').bind('contextmenu',function(e){
			v.currentCookMode = 1;
			UpdateButtonsOnChange();
			return false;
		});		
		
		if (v.skills.cook6 >= 1) {
			v.currentCookMode = 6;
		} else if (v.skills.cook3 >= 1) {
			v.currentCookMode = 3;
		} else if (v.skills.cook2 >= 1) {
			v.currentCookMode = 2;
		} else {
			v.currentCookMode = 1;		
		}
			
		$('#hard_reset').off('contextmenu').on('contextmenu', function (e) {
			tmr_reset = setTimeout(function () {
				$( "#dialog-confirm" ).dialog({
					resizable: false,
					height: "auto",
					width: 400,
					modal: true,
					buttons: {
						"彻底重置": function() {
							window.localStorage.removeItem('v');
							window.localStorage.removeItem('date');
							window.localStorage.removeItem('version');
							window.localStorage.removeItem('gameState');
							window.localStorage.removeItem('gameData');
							window.localStorage.removeItem('tierupData');
							window.localStorage.removeItem('selectStarterRestaurantData');
							window.localStorage.removeItem('perkData');
							location.reload();
						},
						取消: function() {
						  $( this ).dialog( "close" );
						}
					}
				});
			}, 5000);
			return false;
		});				
		
		UpdateButtonsOnChange();
	}

	function UpdateFoodItems() {
		$('#default .fooditem, #storefront .fooditem, #kitchen .fooditem').each(
			function() {			
				if (!($(this).parent().hasClass('ui-droppable'))) {
					$(this).prop('onclick', null).off('click');
					
					if ($(this).attr('onMouseDown') === undefined) {
						$(this).on('mousedown', function (e) {						
								$(this).addClass('being-grabbed');
							}
						);
					}
					
					$(this).off('mouseup');
					$(this).on('mouseup', function (e) {
							$('#default .fooditem-wrapper, #storefront .fooditem-wrapper').each(
								function() {
									$(this).removeClass('highlighted2');
									$(this).removeClass('not_highlighted');
								}
							);
							$(this).removeClass('being-grabbed');
						}
					);

					$(this).draggable({
						revert: true,
						revertDuration: 150,
						//stack: 'div',
						drag: function(event, ui) {
							let thisDataType = $(this).attr('data-type');						
							if (thisDataType == '') {
								return false;
							} else {
								let thisClassA = defaultFoodStats[thisDataType].class_a;
								if (thisClassA == 'buff') {
									$('#default .fooditem-wrapper, #storefront .fooditem-wrapper').each(
										function() {
											let hlDataType = $(this).children('.fooditem').eq(0).attr('data-type');
											let hlBuffs = {};
											if ($(this).children('.fooditem').eq(0).attr('data-buffs') != '') {
												hlBuffs = JSON.parse($(this).children('.fooditem').eq(0).attr('data-buffs'));
											}
											let hlNeededBuff = 0;
											if (hlBuffs[thisDataType] > 0) {
												hlNeededBuff = hlBuffs[thisDataType];
											}
											if ( (hlDataType != '') && (hlNeededBuff < (50 * v.skills.maxBuff )) ) { //highlight if can buff
												$(this).addClass('highlighted2');
											} else {
												$(this).addClass('not_highlighted'); // red bg on hover
											}
										}
									);
								}
								
							}	
						}
					});

					$(this).off('mouseover');
					$(this).on('mouseover', function (e) {
						let thisDataType = $(this).attr('data-type');
						if (thisDataType == '') {
							return false;
						}
						let thisDataTypeCapitalized = BeautifyDataType(thisDataType);
						let thisDataQty = $(this).attr('data-qty');
						let thisLv = GetLvFromQty(thisDataQty);
						let nextLvBreakpoint = GetMaxQtyFromLv(thisLv);						

						let thisLvBonusMult = 2**(thisLv -1);
						let thisClassA = defaultFoodStats[thisDataType].class_a;
						let thisClassABonus = (v.foodClasses[thisClassA] || 0); // if not a number, then 0
						let thisClassB = defaultFoodStats[thisDataType].class_b;
						let thisClassBBonus = (v.foodClasses[thisClassB] || 0); // if not a number, then 0
						let thisBaseIncome = defaultFoodStats[thisDataType].baseIncome;
						let thisScienceCategoryBonus = (v.foodClasses[v.scienceCategory] || 0); // if not a number, then 0
						let thisClassC = '';
					
						if ( (v.scienceCategory !== undefined) && (v.scienceCategory !== '') && ((thisDataType == v.scienceType1) || (thisDataType == v.scienceType2)) ) {
							thisClassC = v.scienceCategory;
						}
						

						let thisBuffIncomeMult = 1;
						let thisBuffs = {};
						if ($(this).attr('data-buffs') != '') {
							thisBuffs = JSON.parse($(this).attr('data-buffs'));
						}
						for (let buff in thisBuffs) {
							let buffValue = defaultFoodStats[buff].baseIncome;
							let buffQty = thisBuffs[buff];
							thisBuffIncomeMult = thisBuffIncomeMult * ( 1 + ((buffValue * buffQty) / 100));
						}

						let thisCompoundIncome = (thisBaseIncome * thisDataQty * thisLvBonusMult * thisBuffIncomeMult);

						let thisTotalIncome = thisCompoundIncome * v.activeIncomeMultiplier;
						thisTotalIncome = thisTotalIncome * (1 + (v.categoryBonuses[thisClassA] * thisClassABonus));
						thisTotalIncome = thisTotalIncome * (1 + (v.categoryBonuses[thisClassB] * thisClassBBonus));
						if ( (v.scienceCategory !== undefined) && (v.scienceCategory !== '') && ((thisDataType == v.scienceType1) || (thisDataType == v.scienceType2)) ) {
							thisTotalIncome = thisTotalIncome * (1 + (v.categoryBonuses[v.scienceCategory] * thisScienceCategoryBonus));
						}

						if (v.foodClasses['饮料'] > 0) {
							thisTotalIncome = thisTotalIncome * 2;
						}
						
						let perkMulti = 1;
						//PERKS
						for (let perkId in v.perks) {
							if (defaultPerkStats[v.perks[perkId]] !== undefined) {
								if ( (defaultPerkStats[v.perks[perkId]].target === thisClassA) || (defaultPerkStats[v.perks[perkId]].target === thisClassB) || (defaultPerkStats[v.perks[perkId]].target === 'all') ) {
									perkMulti = perkMulti * (1 + (defaultPerkStats[v.perks[perkId]].effect / 100));
								}
								
								if ( (thisClassC != '') && (defaultPerkStats[v.perks[perkId]].target === thisClassC) ) {
									perkMulti = perkMulti * (1 + (defaultPerkStats[v.perks[perkId]].effect / 100));
								}
							}							
						}
						thisTotalIncome = thisTotalIncome * perkMulti;

						if (v.prestigePointsTotal > 0) {
							thisTotalIncome = thisTotalIncome * (1 + (v.prestigePointsTotal * 0.1));
						}
						
						if (mealOfTheDayActive) {
							if (
								($(this).attr('data-num') == 1) ||
								($(this).attr('data-num') == 2) ||
								($(this).attr('data-num') == 3)
								) {
									thisTotalIncome = thisTotalIncome * 3;
							}
						} else {
							if (v.skills.dishOfTheDay >= 1) {						
								if ($(this).attr('data-num') == 1) {							
									thisTotalIncome = thisTotalIncome * 2;
								}
							}
						}

						let desc = '';
						if (thisLv == v.skills.maxLevel) {
							desc = '<b style="font-size: 16px;">' + thisDataTypeCapitalized + '</b> 等级 ' + thisLv + ' (' + thisDataQty + ')<br>已达到等级加成上限<br>';
						} else {
							desc = '<b style="font-size: 16px;">' + thisDataTypeCapitalized + '</b> 等级 ' + thisLv + ' (' + thisDataQty + '/' + nextLvBreakpoint + ')<br>';
						}
						desc += '<b class="category_circle" style="color:'+colors[thisClassA]+'">●</b> ' + BeautifyDataType(thisClassA) + '<br>';
						desc += '<b class="category_circle" style="color:'+colors[thisClassB]+'">●</b> ' + BeautifyDataType(thisClassB) + '<br>';

						if ( (v.scienceCategory !== undefined) && (v.scienceCategory !== '') && ((thisDataType == v.scienceType1) || (thisDataType == v.scienceType2)) ) {
							desc += '<b class="category_circle" style="color:'+colors[v.scienceCategory]+'">●</b> ' + BeautifyDataType(v.scienceCategory) + '<br>';
						}
						desc += '基础收益: <b>' + thisBaseIncome + '</b><br>';
						desc += '数量: ' + thisDataQty + '<br>';
						if (thisLv > 1) {
							desc += '等级加成: x' + thisLvBonusMult + '<br>';
						}
						if (thisBuffIncomeMult > 1) {
							for (let buff in thisBuffs) {
								let buffValue = defaultFoodStats[buff].baseIncome;
								let buffQty = thisBuffs[buff];
								let buffMaxLvString = '';
								if (buffQty >= (50 * v.skills.maxBuff)) {
									buffMaxLvString = ' (max)';
								}
								desc += '加成来自<b>' + BeautifyDataType(buff) + '</b>: +' + (buffValue * buffQty) + '%' + buffMaxLvString + '<br>';
							}
						}
						
						desc += '菜肴收益: <b>' + AbbreviateNumber(thisCompoundIncome) + '</b>';
						desc += '<hr>';
						desc += '餐馆加成(倍率)<br>';
						desc += '加成来自<b class="category_circle" style="color:'+colors[thisClassA]+'">●</b> ' + BeautifyDataType(thisClassA) + ': +' + Math.round(thisClassABonus * (v.categoryBonuses[thisClassA]*100)) + '%</b><br>';
						desc += '加成来自<b class="category_circle" style="color:'+colors[thisClassB]+'">●</b> ' + BeautifyDataType(thisClassB) + ': +' + Math.round(thisClassBBonus * (v.categoryBonuses[thisClassB]*100)) + '%</b><br>';	
						
						if ( (v.scienceCategory !== undefined) && (v.scienceCategory !== '') && ((thisDataType == v.scienceType1) || (thisDataType == v.scienceType2)) ) {
							desc += '加成来自<b class="category_circle" style="color:'+colors[v.scienceCategory]+'">●</b> ' + BeautifyDataType(v.scienceCategory)+ ': +' + Math.round(thisScienceCategoryBonus * (v.categoryBonuses[v.scienceCategory]*100)) + '%</b><br>';
						}

						if (v.foodClasses['饮料'] > 0) {
							desc += '加成来自拥有一道<b class="category_circle" style="color:'+colors['饮料']+'">●</b> 饮料: x2</b><br>';
						}
						
						if (perkMulti !== 1) {						
							desc += '加成来自特权: +' + Math.round((perkMulti-1) * 100) + '%<br>';
						}
						
						if (v.activeIncomeMultiplier > 1) {
							desc += '加成来自餐馆等阶: x' + v.activeIncomeMultiplier + '</b><br>';
						}
						if (v.prestigePointsTotal > 0) {
							desc += '加成来自重生点数: +' + (v.prestigePointsTotal * 10) + '%</b><br>';
						}
						if (mealOfTheDayActive) {
							if (
								($(this).attr('data-num') == 1) ||
								($(this).attr('data-num') == 2) ||
								($(this).attr('data-num') == 3)
								) {
									desc += '加成来自一日之餐: x3</b><br>';
							}
						} else {
							if (v.skills.dishOfTheDay >= 1) {						
								if ($(this).attr('data-num') == 1) {							
									desc += '加成来自当日菜: x2</b><br>';
								}
							}
						}
						desc += '<hr>';
						desc += '总计收益: <b>' + AbbreviateNumber(thisTotalIncome) + '</b>';
						
						if (($(this).parent().parent().parent().attr('id') == 'default') && (!(v.skills['tier2_3starter']) >= 1)) {							
							desc += '<br>初始菜肴 - 无法被替换.<br>';
						}
						
						if ($(this).attr('data-kitchen-num') > 0) {
							desc += '<hr>按<b>'+$(this).attr('data-kitchen-num')+'</b>或<b>Shift-点击</b>来自动替换.<br>';
						}
						
						if (thisClassA == "buff") {
							desc = '<b style="font-size: 16px;">' + thisDataTypeCapitalized + '</b><br>';
							if (thisDataType == 'fortune_paper') {
								desc += '秘密增益.在盘子里放一张幸运纸<br>';
							}
							desc += '拖放到任意菜肴上改善它.<br>';
							
							desc += '效果: +<b>' + (thisBaseIncome * thisDataQty) + '%</b><br>';
						}
						
						$descriptionBox.html(desc);
						descFadeout = false;
						e.stopPropagation();
					});
					
					$(this).off('mouseout').on('mouseout', function (e) {
						DescStartFadeOut();
						e.stopPropagation();
					});
				}
			}
		);
		$('#default .fooditem-wrapper, #storefront .fooditem-wrapper, #kitchen .fooditem-wrapper').each(
			function() {
				if (!($(this).hasClass('ui-droppable'))) {
					$(this).prop('onclick', null).off('click');
					$(this).droppable({
						accept: '.fooditem',
						drop: function(event, ui) {
							let dragType = $(ui.draggable).attr('data-type');
							if (dragType == '') { // no dragging empty cells
								return false;
							}

							let dropType = $(this).children('.fooditem').attr('data-type');
							let dragQty = $(ui.draggable).attr('data-qty');
							let dropQty = $(this).children('.fooditem').attr('data-qty');
							let dragBuffs = {};
							let dropBuffs = {};

							if ($(ui.draggable).attr('data-buffs') != '') {
								dragBuffs = JSON.parse($(ui.draggable).attr('data-buffs'));
							}
							if ($(this).children('.fooditem').attr('data-buffs') != '') {
								dropBuffs = JSON.parse($(this).children('.fooditem').attr('data-buffs'));
							}

							let tempText = $(ui.draggable).html();

							// Spices-Buffs-etc
							// Merging
							if ((dropType == dragType) && (defaultFoodStats[dragType].class_a == 'buff')) {
								if ( (dropType !== '') && (!$(this).children(".fooditem").eq(0).hasClass('ui-draggable-dragging')) ) {
									$(this).children('.fooditem').attr('data-qty', +dragQty + +dropQty);
									$(this).children('.fooditem').html('<span class="qty">'+(+dragQty + +dropQty)+'</span>');
									$(ui.draggable).attr("data-type", '');
									$(ui.draggable).attr("data-qty", 1);
									$(ui.draggable).attr("data-buffs", '');
									$(ui.draggable).html('');
								}
								UpdateIncome();
								UpdateButtonsOnChange();
								return false;
							}

							// Adding
							if (defaultFoodStats[dragType].class_a == 'buff') {
								if ( (dropType !== '') && (!$(this).children('.fooditem').eq(0).hasClass('ui-draggable-dragging')) &&
								($(this).parent().parent().attr('id') !== 'kitchen') ) {
									let currentBuffQty = parseInt(dropBuffs[dragType], 10) || 0;
									if (+currentBuffQty + +dragQty <= (50 * v.skills.maxBuff)) {
										dropBuffs[dragType] = +currentBuffQty + +dragQty;
										$(this).children('.fooditem').attr('data-buffs', JSON.stringify(sortObjectByKey(dropBuffs)));
										$(ui.draggable).attr('data-type', '');
										$(ui.draggable).attr('data-qty', 1);
										$(ui.draggable).attr('data-buffs', '');
										$(ui.draggable).html('');									
									} else { // 50 + rest
										dropBuffs[dragType] = (50 * v.skills.maxBuff);
										let restQty = dragQty - ((50 * v.skills.maxBuff) - currentBuffQty);
										$(this).children('.fooditem').attr('data-buffs', JSON.stringify(sortObjectByKey(dropBuffs)));
										$(ui.draggable).attr('data-qty', restQty);
										$(ui.draggable).attr('data-buffs', '');
										$(ui.draggable).html('<span class="qty">' + restQty + '</span>');
									}								
								}
								UpdateIncome();
								UpdateButtonsOnChange();
								return false;
							}
							// Not swapping with empty space
							if (dropType !== '') {
								if ((defaultFoodStats[dragType].class_a != 'buff') && (defaultFoodStats[dropType].class_a == 'buff')) {
									UpdateIncome();
									UpdateButtonsOnChange();
									return false;
								}
							}

							// Normal food
							// Merging
							if ( (dragType == dropType) && (dragType !== '') && (dropType !== '') && (!$(this).children('.fooditem').eq(0).hasClass('ui-draggable-dragging')) ) {
								if (GetLvFromQty(dropQty) < GetLvFromQty(+dragQty + +dropQty) ) { // if gained next breakpoint level
									if (v.fireworkN == 1) {
										v.fireworkN = 2;
										let position = $(this).offset();
										position.left = +position.left + 50;
										position.top  = +position.top + 50;
										$('#win_lower').css(position).show();
										setTimeout(function(){
											$('#win_lower').hide();
										}, 950);
									} else {
										v.fireworkN = 1;
										let position = $(this).offset();
										position.left = +position.left + 50;
										position.top  = +position.top + 50;
										$('#win_higher').css(position).show();
										setTimeout(function(){
											$('#win_higher').hide();
										}, 950);
									}
								}
								$(ui.draggable).attr('data-type', '');
								$(ui.draggable).attr('data-qty', 1);
								$(ui.draggable).attr('data-buffs', '');
								$(ui.draggable).html('');
								$(this).children('.fooditem').attr('data-type', dragType);
								$(this).children('.fooditem').attr('data-qty', +dragQty + +dropQty);
								$(this).children('.fooditem').attr('data-buffs', JSON.stringify(sortObjectByKey(SumObj(dragBuffs, dropBuffs))));
								$(this).children('.fooditem').html('<span class="qty">'+(+dragQty + +dropQty)+'</span>');
							} else { // Normal food Swapping
								if (($(this).parent().parent().attr('id') == 'default') && (!(v.skills['tier2_3starter'] >= 1))) {
									//if default and not tier23 - nothing
								} else {	
									$(ui.draggable).attr('data-type', $(this).children('.fooditem').attr('data-type'));
									$(ui.draggable).attr('data-qty', $(this).children('.fooditem').attr('data-qty'));
									$(ui.draggable).attr('data-buffs', $(this).children('.fooditem').attr('data-buffs'));
									$(ui.draggable).html($(this).children('.fooditem').html());
									$(ui.draggable).attr('class', $(this).children('.fooditem').attr('class'));
									$(this).children('.fooditem').attr('data-type', dragType);
									$(this).children('.fooditem').attr('data-qty', dragQty);
									$(this).children('.fooditem').attr('data-buffs', JSON.stringify(dragBuffs));
									$(this).children('.fooditem').html(tempText);
								}							
							}
							UpdateIncome();
							UpdateButtonsOnChange();
							UpdateThirdCategory();
						},
						tolerance: 'pointer',
						hoverClass: 'highlighted'
					});
				}
			}	
		);
		
		$('#kitchen .fooditem').each(
			function() {
				$(this).off('click').on('click', function (e) {
					if (true) {
						if (e.shiftKey) {
							let kitchenTarget = $(this);
							if (kitchenTarget !== '') { //[1-5]
								let kitchenType = kitchenTarget.attr('data-type');
									
								let kitchenQty = kitchenTarget.attr('data-qty');
								if ((kitchenType != '') && (kitchenType != undefined)) {
									if (defaultFoodStats[kitchenType].class_a != 'buff') {
										let storeTarget = '';
										$('#default .fooditem, #storefront .fooditem').each( function() {
											if ($(this).attr('data-type') === kitchenType) {
												storeTarget = $(this);
											}
										});
										
										if (storeTarget !== '') { // merge
											kitchenTarget.attr('data-type', '');
											kitchenTarget.attr('data-qty', 1);
											kitchenTarget.html('');
											let oldStoreQty = +storeTarget.attr('data-qty');
											let newStoreQty = +oldStoreQty + +kitchenQty;
											storeTarget.attr('data-qty', newStoreQty);
											storeTarget.html('<span class="qty">'+newStoreQty+'</span>');
											storeTarget.parent().removeClass('glow_fast').addClass('glow_fast');
											setTimeout(function() {
												$('#default .fooditem-wrapper, #storefront .fooditem-wrapper').removeClass('glow_fast');
											},1000);
											if (GetLvFromQty(oldStoreQty) < GetLvFromQty(newStoreQty) ) { // if gained next breakpoint level
												if (v.fireworkN == 1) {
													v.fireworkN = 2;
													let position = storeTarget.offset();
													position.left = +position.left + 50;
													position.top  = +position.top + 50;
													$('#win_lower').css(position).show();
													setTimeout(function(){
														$('#win_lower').hide();
													}, 950);
												} else {
													v.fireworkN = 1;
													let position = storeTarget.offset();
													position.left = +position.left + 50;
													position.top  = +position.top + 50;
													$('#win_higher').css(position).show();
													setTimeout(function(){
														$('#win_higher').hide();
													}, 950);
												}
											}
											
											UpdateIncome();
											UpdateButtonsOnChange();
											if (v.skills['science'] >= 1) {
												UpdateThirdCategory();
											}
										} else { // cannot merge, maybe just add
											$('#default .fooditem, #storefront .fooditem').each( function() {
												if (($(this).attr('data-type') == '') && (storeTarget == '')) {
													storeTarget = $(this);
												}
											});
											
											if (storeTarget !== '') { // add
												storeTarget.attr('data-type', kitchenType);
												kitchenTarget.attr('data-type', '');
												kitchenTarget.attr('data-qty', 1);
												kitchenTarget.html('');
												let newStoreQty = +kitchenQty;
												
												storeTarget.attr('data-qty', newStoreQty);
												storeTarget.html('<span class="qty">'+newStoreQty+'</span>');
												storeTarget.parent().removeClass('glow_fast').addClass('glow_fast');								
												UpdateIncome();
												UpdateButtonsOnChange();
												if (v.skills['science'] >= 1) {
													UpdateThirdCategory();
												}
											}
										}
									}	
								}							
							}
						}
					}
				});
			}
		);
		if (!(v.skills['tier2_3starter'] >= 1)) { // not tier2-3 starter
			$('#default .fooditem').each(
				function() {
					$(this).draggable('disable');							
				}
			);	
		}
		
		UpdateThirdCategory();	
		if ( (t[v.tutorialLevel].val >= t['finished0'].val) ) {			
			SaveGame();
		}
	}
	
	function UpdateThirdCategory() {
		$('#game .fooditem .third_category').remove();
		$('#game .fooditem').each(
			function() {
				if ( ($(this).attr('data-type') == v.scienceType1) || ($(this).attr('data-type') == v.scienceType2) ) {					
					$(this).append('<div class="third_category '+v.scienceCategory+'"></div>');
				}
			}
		);
	}

	function ProgressBarShowDesc() {
		let desc = '朝下个重生点数进发.<br>';
		if ($progressbarPrestige2.css('display') != 'none') {
			desc += '较大的条形图显示总的进度.<br>较小的条形图显示每个的百分比进度.<br>';
		}
		desc += '<hr>下个点数需获得金钱: <br><b>' + AbbreviateNumber(v.prestigePointMoneyEarned) + '/' + AbbreviateNumber(v.prestigePointCost) + ' (' + ((v.prestigePointMoneyEarned/v.prestigePointCost) * 100).toFixed(2) + '%)</b><br>';
		if (v.prestigePointsToGet + v.prestigePointsTotal >= 10) {
			let estimatedTime = 0;
			estimatedTime = BeautifyTime(((v.prestigePointCost - v.prestigePointMoneyEarned) / v.activeIncome));
			desc += '预计时间: <b>' + estimatedTime + '</b><br>';
		}
		desc += '本次重生点数: <b>' + v.prestigePointsToGet + '</b><br>';
		desc += '<hr>';
		if (isMobile()) {
			desc += '长按来开关进度条动画(减轻CPU负担).<br>';
		} else {
			desc += '右键点击来开关进度条动画(减轻CPU负担).<br>';
		}	
		if (v.options.animations) {
			desc += '当前状态: 激活.<br>';
		} else {
			desc += '当前状态: 未激活.<br>';
		}

		$descriptionBox.html(desc);
	}
	
	function DescStartFadeOut() {		
		if ((descFadeout == false) && (isMobile() == false)) {
			$descriptionBox.html('<div id="description_fadeout">' + $descriptionBox.html() + '</div>');
			descFadeout = true;
			$('#description_fadeout').fadeOut(100);
			descFadeOutTimeOut = setTimeout(function(){
				DescAfterFadeOut();
			},100);
		}
	}	
	
	function DescAfterFadeOut() {
		if (descFadeout == true) {
			$descriptionBox.html('');
			descFadeout = false;
		} else {
			$('#description_fadeout').show();
		}
	}	

	function UpdateTutorial() {
		if (t[v.tutorialLevel].text != '') {
			$('#tutorial_box').html(t[v.tutorialLevel].text);
			$('#tutorial_box').fadeIn(500);
		} else {
			$('#tutorial_box').fadeOut(500);
		}
		if (event !== undefined) {
			event.stopPropagation();
		}
	}

	function UpdateInfoScreen() {
		//DISHES
		let infoHTML = '';

		infoHTML += '<div>';
		infoHTML += 	'<div id="info_tier1" style="min-height: 125px;"></div>';
		infoHTML += 	'<div id="info_tier2" style="min-height: 125px;"></div>';
		infoHTML += 	'<div id="info_tier3" style="min-height: 125px;"> </div>';
		infoHTML += '</div>';

		$('#info_dishes').html(infoHTML);
		let tier1FoodInfoHTML = '<div class="tr_label">1阶</div>';
		let tier2FoodInfoHTML = '<div class="tr_label">2阶</div>';
		let tier3FoodInfoHTML = '<div class="tr_label">3阶</div>';
		
		const foodTypes = {};
		$('#storefront .fooditem, #default .fooditem').each(
			function() {
				if ($(this).attr('data-type') !== '') {
					if (foodTypes[$(this).attr('data-type')] != 'exists') {
						foodTypes[$(this).attr('data-type')] = 'exists';
					}
				}
			}
		);
		
		for (let foodName in defaultFoodStats) {
			let opacityCSS = '';
			if (!(v.activeFood.includes(foodName))) {
				opacityCSS = ' opacity : 0.5; border-color: #fff0;';
			}
			if (foodTypes[foodName] === 'exists') {				
				opacityCSS += 'border-color: #f7d88c;';
			}

			if ((defaultFoodStats.hasOwnProperty(foodName)) && (defaultFoodStats[foodName].baseIncome == 1) && (defaultFoodStats[foodName].class_a != 'buff')) {
				tier1FoodInfoHTML += '<div class="fooditem-wrapper" style="transition: all 0.26s linear 0s; overflow:hidden;'+opacityCSS+'"><div class="fooditem" style="transition: all 0.26s linear 0s; overflow:hidden;" data-buffs="" data-type="' + foodName + '" data-qty="1"></div></div>';
			}
			if ((defaultFoodStats.hasOwnProperty(foodName)) && (defaultFoodStats[foodName].baseIncome == 2) && (defaultFoodStats[foodName].class_a != 'buff')) {
				tier2FoodInfoHTML += '<div class="fooditem-wrapper" style="transition: all 0.26s linear 0s; overflow:hidden;'+opacityCSS+'"><div class="fooditem" style="transition: all 0.26s linear 0s; overflow:hidden;" data-buffs="" data-type="' + foodName + '" data-qty="1"></div></div>';
			}
			if ((defaultFoodStats.hasOwnProperty(foodName)) && (defaultFoodStats[foodName].baseIncome == 4) && (defaultFoodStats[foodName].class_a != 'buff')) {
				tier3FoodInfoHTML += '<div class="fooditem-wrapper" style="transition: all 0.26s linear 0s; overflow:hidden;'+opacityCSS+'"><div class="fooditem" style="transition: all 0.26s linear 0s; overflow:hidden;" data-buffs="" data-type="' + foodName + '" data-qty="1"></div></div>';
			}
		}
		$('#info_dishes #info_tier1').html(tier1FoodInfoHTML);
		if (t[v.tutorialLevel].val >= t['tierup0'].val) {
			$('#info_dishes #info_tier2').html(tier2FoodInfoHTML);
		}
		if (v.skills.tier3food >= 1) {
			$('#info_dishes #info_tier3').html(tier3FoodInfoHTML);
		}

		$('#info_dishes .fooditem').each(
			function() {
				$(this).prop('onclick', null).off('click');
				$(this).off('contextmenu').on('contextmenu', function (e) {
					if ((v.discontinueTokens > 0) && (v.activeFood.includes($(this).attr('data-type')))) {
						v.discontinueTokens = +v.discontinueTokens - 1;
						RemoveFromArray(v.activeFood, $(this).attr('data-type'));
						UpdateInfoScreen();
					}
					return false;
				});				

				$(this).off('mouseover');
				$(this).on('mouseover', function (e) {
					let thisDataType = $(this).attr('data-type');
					if (thisDataType == '') {
						return false;
					}

					let thisClassA = defaultFoodStats[thisDataType].class_a;
					let thisClassB = defaultFoodStats[thisDataType].class_b;
					let thisBaseIncome = defaultFoodStats[thisDataType].baseIncome;

					let thisDataTypeCapitalized = BeautifyDataType(thisDataType);

					let desc = '<b style="font-size: 16px;">' + thisDataTypeCapitalized + '</b><br>';
					desc += '<b class="category_circle" style="color:'+colors[thisClassA]+'">●</b> ' + BeautifyDataType(thisClassA) + '<br>';
					desc += '<b class="category_circle" style="color:'+colors[thisClassB]+'">●</b> ' + BeautifyDataType(thisClassB) + '<br>';
					desc += '基础收益: <b>' + thisBaseIncome + '</b><br>';
					if (v.discontinueTokens > 0) {
						if (isMobile()) {
							desc += '<br><br>按住3秒来停止.<br>停止代币剩余: <b>' + v.discontinueTokens + '</b>';
						} else {
							desc += '<br><br>右键点击来停止.<br>停止代币剩余: <b>' + v.discontinueTokens + '</b>';
						}						
					}
					
					if (thisDataType === 'taiyaki') {
						desc += '<br><br>好吧,严格来说不算海鲜,但主题很好.(耸肩)';
					}
					if (thisDataType === 'juice') {
						desc += '<br><br>虽然大多数饮料都是纯素食的,但这一款最适合这个主题.';
					}
					$descriptionBox.html(desc);
					descFadeout = false;
					e.stopPropagation();
				});				
				$(this).off('mouseout').on('mouseout', function (e) {
					DescStartFadeOut();
					e.stopPropagation();
				});
			}
		);
		//RESTAURANT
		let infoRestaurantHTML = '';
		if ((v.restaurantName != '') && (v.restaurantName != '')) {
			if (!(v.skills['novelty'] >= 1)) {
				infoRestaurantHTML += '<div class="tr_label restaurantname" style="text-align: left; padding-left: 12%;">'+v.restaurantName+'</div>';
			} else {
				infoRestaurantHTML += '<div class="tr_label restaurantname" style="text-align: center;">'+v.restaurantName+'</div>';
			}
		}	
		if (!(v.skills['novelty'] >= 1)) {
			infoRestaurantHTML += '<div style="text-align: left; width: 30%;  padding-left: 10%; display: inline-block;">';
			infoRestaurantHTML += 	'<div class="tr_label" style="padding-bottom: 5px; text-align: left;">种类加成</div>';			
			for (let catName in v.categoryBonuses) {				
				infoRestaurantHTML += 	'<div><b class="category_circle" style="color:'+colors[catName]+'">●</b> '+BeautifyDataType(catName)+': '+(v.categoryBonuses[catName] * 100)+'%</div>';
			}					
			infoRestaurantHTML += '</div>';	
		} else {
			infoRestaurantHTML += '<div style="text-align: left; width: 98%; padding-left: 1%;">';	
			infoRestaurantHTML += 	'<div class="tr_label" style="padding-bottom: 7px; text-align: center;">种类加成</div>';
			infoRestaurantHTML +=	'<table id="category_novelty_bonus">';
			infoRestaurantHTML +=		'<thead>';
			infoRestaurantHTML +=			'<tr>';
			infoRestaurantHTML +=				'<th>种类</th>';
			infoRestaurantHTML +=				'<th>默认<br>加成</th>';
			infoRestaurantHTML +=				'<th>激活<br>修正</th>';
			infoRestaurantHTML +=				'<th><b>激活<br>加成<b></th>';			
			infoRestaurantHTML +=				'<th>下级<br>修正</th>';	
			infoRestaurantHTML +=				'<th>下级<br>加成</th>';
			infoRestaurantHTML +=			'</tr>';			
			infoRestaurantHTML +=		'</thead>';
			infoRestaurantHTML +=		'<tbody>';
			for (let catName in v.categoryBonuses) {
				let trendSymbol = '<span style="color: #5ab55a">&nbsp;▲</span>';
				if ( (v.noveltyActiveCat1 == catName) || (v.noveltyActiveCat2 == catName) ) {
					trendSymbol = '<span style="color: #d65353">&nbsp;▼</span>';
				}
				if ( (v.noveltyActiveCat1 == undefined) || (v.noveltyActiveCat1 == '') ) {
					trendSymbol = '';
				}
				infoRestaurantHTML +=		'<tr>';
				infoRestaurantHTML +=			'<td><b class="category_circle" style="color:'+colors[catName]+'">●</b> '+BeautifyDataType(catName)+'</td>';
				infoRestaurantHTML +=			'<td>'+defaultCategoryBonuses[catName]*100+'</td>';
				infoRestaurantHTML +=			'<td>+'+v.currentNovelty[catName]+'%</td>';
				infoRestaurantHTML +=			'<td><b>'+Math.round((defaultCategoryBonuses[catName]*100 * (100 + v.currentNovelty[catName]))/100)+'</b></td>';
				infoRestaurantHTML +=			'<td>+'+v.nextNovelty[catName]+'%</td>';
				infoRestaurantHTML +=			'<td>'+Math.round((defaultCategoryBonuses[catName]*100 * (100 + v.nextNovelty[catName]))/100)+trendSymbol+'</td>';
				infoRestaurantHTML +=		'</tr>';				
			}					
			infoRestaurantHTML +=		'</tbody>';
			infoRestaurantHTML +=	'</table>';			
			infoRestaurantHTML += '</div>';
		}
		
		infoRestaurantHTML += '<div style="text-align: left; width: 50%; padding-left:6%; display: inline-block; vertical-align: top;">';	
		infoRestaurantHTML += 	'<div class="tr_label" style="padding-bottom: 6px; text-align: left;">当前统计</div>';
		if (v.prestigePointsTotal > 0) {
			infoRestaurantHTML += 	'<div style="padding-bottom: 3px;">重生点数: '+v.prestigePointsTotal+'</div>';
		}
		if (v.skills.minCook > 0) {
			infoRestaurantHTML += 	'<div style="padding-bottom: 3px;">烹饪数量下限: '+v.skills.minCook+'</div>';
		}
		if (v.skills.maxCook > 0) {
			infoRestaurantHTML += 	'<div style="padding-bottom: 3px;">烹饪数量上限: '+v.skills.maxCook+'</div>';
		}
		if (v.skills.maxLevel > 0) {
			infoRestaurantHTML += 	'<div style="padding-bottom: 3px;">菜肴等级上限: '+v.skills.maxLevel+'</div>';
		}
		if ((v.skills.maxBuff > 0) && (v.skills.buffs > 1)) {
			infoRestaurantHTML += 	'<div style="padding-bottom: 3px;">增益数量上限: '+(v.skills.maxBuff*50)+'</div>';
		}
		infoRestaurantHTML += '</div>';	
		
		
		if (v.perks.length > 0) {
			infoRestaurantHTML += '<div>';
			infoRestaurantHTML += 	'<div class="tr_label" style="padding-bottom: 6px;">Active Perks</div>';
			for (let perkIndex in v.perks) {
				let perkName = v.perks[perkIndex];
				if (defaultPerkStats[perkName] !== undefined) {
					infoRestaurantHTML += 	'<button class="perk" data-perk="'+perkName+'">'+defaultPerkStats[perkName].name+'</button>';
				}	
			}	
			infoRestaurantHTML += '</div>';			
		}		
		$('#info_restaurant').html(infoRestaurantHTML);
		$('#info_restaurant button').each(
			function() {
				$(this).off('mouseover').on('mouseover', function (e) {				
					let thisDataPerk = $(this).attr('data-perk');
					let thisName = $(this).text();
					if (thisDataPerk	 == '') {
						return false;
					}
					
					let desc = '<b style="font-size: 16px;">' + thisName + '</b><br>';
					desc += defaultPerkStats[thisDataPerk].desc;					
					$descriptionBox.html(desc);
					descFadeout = false;
					e.stopPropagation();
				});					
				$(this).off('mouseout').on('mouseout', function (e) {
					DescStartFadeOut();
					e.stopPropagation();
				});
			}
		);
		$('#category_novelty_bonus').off('mouseover').on('mouseover', function (e) {
			let desc = '<b>新奇加成</b><br><br>'+
				'每小时,2个激活类别获得-3%修正以及1个非激活类别获得+1%修正.<br><br>'+
				'激活类别是拿手菜肴<i>基础</i>类别.<br><br>'+
				'修正尽在下次重生生效,当前重生修正不会改变.<br><br>'+
				'修正下限: 0%<br>'+
				'修正上限: +200%<br>';			
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		});				
		$('#category_novelty_bonus').off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});
	}
	
	function ShowInfoTab(tabName) {
		$('.tab').hide();
		$('.tab_' + tabName).show();
	}

	function FilterInfo(filterClass) {
		if (filterClass == 'all') {
			$('.screen#info #info_dishes .fooditem').css('width', '').parent().css({'padding': '','width': '', 'border-width': '', 'margin': ''});
			return false;
		}

		if (filterClass == 'active') {
			$('.screen#info #info_dishes .fooditem').each(function() {
				let thisDataType = $(this).attr('data-type');
				if (thisDataType == '') {
					return false;
				}

				if (v.activeFood.includes(thisDataType)) {
					$(this).css('width', '').parent().css({'padding': '','width': '', 'border-width': '', 'margin': ''});
				} else {
					$(this).css('width', 0).parent().css({'width': 0, 'padding': 0, 'border-width': 0, 'margin': 0});
				}
			});
			return false;
		}

		if (filterClass == 'inactive') {
			$('.screen#info #info_dishes .fooditem').each(function() {
				let thisDataType = $(this).attr('data-type');
				if (thisDataType == '') {
					return false;
				}

				if (!(v.activeFood.includes(thisDataType))) {
					$(this).css('width', '').parent().css({'padding': '','width': '', 'border-width': '', 'margin': ''});
				} else {
					$(this).css('width', 0).parent().css({'width': 0, 'padding': 0, 'border-width': 0, 'margin': 0});
				}
			});
			return false;
		}

		$('.screen#info #info_dishes .fooditem').each(function() {
			let thisDataType = $(this).attr('data-type');
			if (thisDataType == '') {
				return false;
			}
			if (defaultFoodStats[thisDataType] === undefined) {
				console.log(thisDataType);
			}
			let thisClassA = defaultFoodStats[thisDataType].class_a;
			
			let thisClassB = defaultFoodStats[thisDataType].class_b;

			if ( (thisClassA == filterClass) || (thisClassB == filterClass) ) {
				$(this).css('width', '').parent().css({'padding': '','width': '', 'border-width': '', 'margin': ''});
			} else {
				$(this).css('width', 0).parent().css({'width': 0, 'padding': 0, 'border-width': 0, 'margin': 0});
			}
		});

	}

	function UpdatePrestigeScreen() {
		$('.total_prestige_points').text(v.prestigePointsTotal);
		$('.added_prestige_points').text(v.prestigePointsToGet);
		$('.unspent_skill_points').text(v.skillPointsUnspent);
		$('.get_prestige_points').text(+v.prestigePointsTotal + +v.prestigePointsToGet);
		$('.get_skill_points').text(+v.skillPointsUnspent + +v.prestigePointsToGet);
		if (v.prestigePointsTotal == 0) {
			$('.before_first_prestige').show();
		} else {
			$('.before_first_prestige').hide();
		}		
		$( "#prestige_restaurant_button" ).off('click').on('click', function (e) {			
			$( "#dialog-confirm-prestige-qty" ).text(v.prestigePointsToGet);
			let prestigeBoostersUsed = +$('#prestige_boosters_input').val();
			let prestigePointMoneyEarnedBoosted = +v.prestigePointMoneyEarned + +(v.activeIncome * prestigeBoostersUsed * PRESTIGE_BOOST_VALUE);
			let prestigePointsToGetBoosted = +v.prestigePointsToGet;
			let prestigePointsTotalBoosted = +v.prestigePointsTotal +v.prestigePointsToGet;
			let prestigePointCostBoosted = +v.prestigePointCost;
			
			while (prestigePointMoneyEarnedBoosted > prestigePointCostBoosted) {
				prestigePointMoneyEarnedBoosted = prestigePointMoneyEarnedBoosted - prestigePointCostBoosted;
				prestigePointsToGetBoosted++;
				prestigePointsTotalBoosted++;
				prestigePointCostBoosted = +GetCostFromPP(prestigePointsTotalBoosted);
				if ((v.prestigePointsTotal + v.prestigePointsToGet) > 100000) {
					prestigePointsToGetBoosted = prestigePointsToGetBoosted + Math.floor(prestigePointMoneyEarnedBoosted / prestigePointCostBoosted);
					prestigePointsTotalBoosted = prestigePointsTotalBoosted + Math.floor(prestigePointMoneyEarnedBoosted / prestigePointCostBoosted);
					prestigePointMoneyEarnedBoosted = 0;
				}
			}
			
			
			if (prestigePointsToGetBoosted > v.prestigePointsToGet) {
				$( "#dialog-confirm-prestige-qty" ).text(v.prestigePointsToGet + ' (' + prestigePointsToGetBoosted + ')');
			}
			$( "#dialog-confirm-prestige" ).dialog({
				resizable: false,
				height: "auto",
				width: 400,
				modal: true,
				buttons: {
					"重生": function() {
						$( this ).dialog( "close" );
						PrestigeRestaurant();						
					},
					取消: function() {
						$( this ).dialog( "close" );
					}
				}
			});			
		});		
		
		if (v.skills.prestigeBoosters >= 1) {
			let prestigeBoostersUsed = +$('#prestige_boosters_input').val();
			let prestigePointMoneyEarnedBoosted = v.prestigePointMoneyEarned + (v.activeIncome * prestigeBoostersUsed * PRESTIGE_BOOST_VALUE);
			let prestigePointsToGetBoosted = v.prestigePointsToGet;
			let prestigePointsTotalBoosted = +v.prestigePointsTotal +v.prestigePointsToGet;
			let prestigePointCostBoosted = v.prestigePointCost;
			
			while (prestigePointMoneyEarnedBoosted > prestigePointCostBoosted) {
				prestigePointMoneyEarnedBoosted = prestigePointMoneyEarnedBoosted - prestigePointCostBoosted;
				prestigePointsToGetBoosted++;
				prestigePointsTotalBoosted++;
				prestigePointCostBoosted = GetCostFromPP(prestigePointsTotalBoosted);
				if ((v.prestigePointsTotal + v.prestigePointsToGet) > 100000) {
					prestigePointsToGetBoosted = prestigePointsToGetBoosted + Math.floor(prestigePointMoneyEarnedBoosted / prestigePointCostBoosted);
					prestigePointsTotalBoosted = prestigePointsTotalBoosted + Math.floor(prestigePointMoneyEarnedBoosted / prestigePointCostBoosted);
					prestigePointMoneyEarnedBoosted = 0;
				}
			}
			
			$('.added_prestige_points').text(prestigePointsToGetBoosted + ' (以及'+Math.floor((prestigePointMoneyEarnedBoosted/prestigePointCostBoosted) * 100) + '%)');
			$('.unspent_skill_points').text(v.skillPointsUnspent);
			$('.get_prestige_points').text(+v.prestigePointsTotal + +prestigePointsToGetBoosted );
			$('.get_skill_points').text(+v.skillPointsUnspent + prestigePointsToGetBoosted );
			$('#prestige .prestige_boosters').css('display', 'inline-block');
		}
		$("[type='number']").keypress(function (evt) {
			evt.preventDefault();
		});
	}
	
	function UpdatePrestigeButtons() {
		let unlockableSkillButtons = '';
		let finishedSkillButtons = '';
		for (let skill in defaultSkillStats) {
			let currentSkillLevel = v.skills[skill];
			if (currentSkillLevel === undefined) {
				currentSkillLevel = 0;
			}
			let nextLevelSkillPointCost = defaultSkillStats[skill].levels[currentSkillLevel+1];
			if ((v.prestigePointsTotal + v.prestigePointsToGet) >= defaultSkillStats[skill].visible_at) { // visible
				if (nextLevelSkillPointCost === undefined) { // already maxed
					finishedSkillButtons += '<button class="skillbutton finished disabled '+skill+'" data-skill="'+skill+'">' + defaultSkillStats[skill].name + '</button>';
				} else { // not maxed
					if ( (v.prestigePointsTotal >= defaultSkillStats[skill].active_at) && (v.skillPointsUnspent >= nextLevelSkillPointCost) ) { // available
						unlockableSkillButtons += '<button class="skillbutton '+skill+'" data-skill="'+skill+'" onClick="UpgradeSkill(\''+skill+'\');">' + defaultSkillStats[skill].name + '<br>' + nextLevelSkillPointCost + ' 点</button>';
					} else { //not available
						if (v.prestigePointsTotal < defaultSkillStats[skill].active_at) { //not unlocked
							unlockableSkillButtons += '<button class="skillbutton disabled '+skill+'" data-skill="'+skill+'">' + defaultSkillStats[skill].name + '<br>解锁于&nbsp;' + defaultSkillStats[skill].active_at + '</button>';
						} else {	
							if (v.skillPointsUnspent < nextLevelSkillPointCost) { //not enough points
								unlockableSkillButtons += '<button class="skillbutton disabled '+skill+'" data-skill="'+skill+'">' + defaultSkillStats[skill].name + '<br>' + nextLevelSkillPointCost + ' 点</button>';
							}
						}
					}
				}				 
			}			
		}		
		$('#unlockable_skill_buttons').html(unlockableSkillButtons);
		$('#finished_skill_buttons').html(finishedSkillButtons);
		if (finishedSkillButtons == '') {
			$('#finished_skill_label').hide();
		} else {
			$('#finished_skill_label').show();
		}
		
		$('#prestige .skillbutton').each( function() {
			$(this).off('mouseover').on('mouseover', function (e) {
				let skill = $(this).attr('data-skill');
				let desc = '<b>' + defaultSkillStats[skill].name + '</b><br>';
				desc += defaultSkillStats[skill].desc + '<br>';
				let currentSkillLevel = v.skills[skill];
				if (currentSkillLevel === undefined) {
					currentSkillLevel = 0;
				}
				if (currentSkillLevel > 0) {
					desc += '当前等级: ' + currentSkillLevel + '<br>';	
				}
				if (skill === 'buffs') {
					if ((currentSkillLevel === undefined) || (currentSkillLevel === 0)) {
						desc += '下次: 每3次金钱超级烹饪获得异国风味<br>';
					}
					if (currentSkillLevel === 1) {
						desc += '下次: 每5次金钱超级烹饪获得食品装饰<br>';
					}
					if (currentSkillLevel === 2) {
						desc += '下次: 每10次金钱超级烹饪获得原始创意<br>';
					}
				}
				if (skill === 'maxLevel') {
					desc += '等级上限数量: ' + GetMaxQtyFromLv(currentSkillLevel - 1) + '<br>';	
					desc += '下个等级上限数量: ' + GetMaxQtyFromLv(currentSkillLevel) + '<br>';	
				}
				if (v.prestigePointsTotal < defaultSkillStats[skill].active_at) {
					desc += '解锁于 ' + defaultSkillStats[skill].active_at + ' 总计重生点数.<br>';
				}	
				if (defaultSkillStats[skill].levels[currentSkillLevel+1] > 0) {
					desc += '花费: ' + defaultSkillStats[skill].levels[currentSkillLevel+1] + ' 技能点数.<br>';
				} else {
					desc += '已上限<br>';	
				}
				$descriptionBox.html(desc);
				descFadeout = false;
				e.stopPropagation();
			}).off('mouseout').on('mouseout', function (e) {
				DescStartFadeOut();
				e.stopPropagation();
			});
		});
		
		if (v.skills.prestigeBoosters > 0) {
			$('.added_prestige_points').off('mouseover').on('mouseover', function (e) {				
				let desc = '你会获得的重生点数以及向下一点前进的百分比.<br>';				
				$descriptionBox.html(desc);
				descFadeout = false;
				e.stopPropagation();
			}).off('mouseout').on('mouseout', function (e) {
				DescStartFadeOut();
				e.stopPropagation();
			});
			
			$('.prestige_boosters').off('mouseover').on('mouseover', function (e) {				
				let desc = '<b>重生助益</b><br>';
				let pBHoursLeft = Math.floor(v.prestigeBoosterTimeLeft / (60*60));
				if (pBHoursLeft < 10) {
					pBHoursLeft = '0' + pBHoursLeft;
				}
				let pBMinsLeft = Math.floor((v.prestigeBoosterTimeLeft % (60*60)) / 60);
				if (pBMinsLeft < 10) {
					pBMinsLeft = '0' + pBMinsLeft;
				}
				let pBSecsLeft = Math.floor(v.prestigeBoosterTimeLeft % 60);
				if (pBSecsLeft < 10) {
					pBSecsLeft = '0' + pBSecsLeft;
				}
				let pBTimeLeft = '';
				
				if (pBHoursLeft > 0) {
					pBTimeLeft = pBHoursLeft + ':' + pBMinsLeft + ':' + pBSecsLeft;
				} else {
					pBTimeLeft = pBMinsLeft + ':' + pBSecsLeft;
				}
				desc += '花费重生助益推进你的重生.<br>';
				desc += '每个重生助益给予4小时收益.<br>';
				desc += '你每天获得1个重生助益.<br>';
				desc += '当前重生助益: ' + v.prestigeBoosters + '<br>';				
				desc += '距离下个时间: <span class="prestige_booster_time_desc">' + pBTimeLeft + '</span><br>';
				
				$descriptionBox.html(desc);
				descFadeout = false;
				e.stopPropagation();
			}).off('mouseout').on('mouseout', function (e) {
				DescStartFadeOut();
				e.stopPropagation();
			});
		}
		
		$('#prestige_boosters_input').off('change').on('change', function (e) {
			UpdatePrestigeScreen();
		});
		if (v.prestigeBoosters > 0) {
			$('#prestige_boosters_input').attr('max', v.prestigeBoosters);			
			$('#prestige_boosters_total').text(' /' + v.prestigeBoosters);
		} else {
			$('#prestige_boosters_input').attr('max', 0);
			$('#prestige_boosters_total').text(' /' + v.prestigeBoosters);
		}
	}
	
	function UpdateProgressScreen() {
		let progressHTML = '';
		progressHTML += '<div class="tr_label" style="padding-bottom: 15px;">进度</div>';
		progressHTML += '<div id="progress_slides" style="padding-bottom: 20px; min-height:	250px;">';
		progressHTML += 	'<div>';
		progressHTML += 		'<button id="progressLeft" style="width: 30px;height: 30px;margin-right: 40px;"><</button>';
		progressHTML += 		'<button id="progressRight" class="disabled" style="width: 30px;height: 30px;">></button>';
		progressHTML += 	'</div>';
			
		for (let progressPoint in PROGRESS) {
			if (v.prestigePointsTotal + v.prestigePointsToGet >= PROGRESS[progressPoint].prestigePoints) {
				let startPP = PROGRESS[progressPoint].prestigePoints;
				let endPP = 1000000000000;
				if (PROGRESS[+progressPoint+1] !== undefined) {
					endPP = PROGRESS[+progressPoint+1].prestigePoints;
				}
				
				let progressGreenBar = 	100;
				let progressYellowBar = 0;	
				if (v.prestigePointsTotal >= endPP) {
					progressGreenBar = 100;
					progressYellowBar = 0;
				} else {
					let greenPoints = v.prestigePointsTotal - startPP;
					progressGreenBar = (greenPoints / (endPP - startPP)).toFixed(4)*100;
					if (progressGreenBar < 0) {
						progressGreenBar = 0;
					}
					let yellowPoints = 0;
					if (v.prestigePointsTotal + v.prestigePointsToGet >= endPP) {
						yellowPoints = (endPP - startPP) - greenPoints; // all that's not green is yellow
					} else {
						if (v.prestigePointsTotal < startPP) {
							yellowPoints = (v.prestigePointsTotal - startPP) + v.prestigePointsToGet ;
						} else {							
							yellowPoints = v.prestigePointsToGet ;
						}
						
					}
					progressYellowBar =  (yellowPoints / (endPP - startPP)).toFixed(4)*100;
					if (progressYellowBar >= 100) {
						progressYellowBar = 100 - progressGreenBar;
					}
					if (progressYellowBar <= 0) {
						progressYellowBar = 0;
					}
				}
				let progressBlankBar = (100-(progressGreenBar+progressYellowBar));
				if (progressBlankBar < 0) {
					progressBlankBar = 0;
				}
				
				let leftPointerMargin = (progressGreenBar-1);
				if (leftPointerMargin < 0) {
					leftPointerMargin = 0;
				}	
				if (leftPointerMargin > 93) {
					leftPointerMargin = 93;
				}	
				progressHTML += '<div id="ppid_'+progressPoint+'" class="progress_slide" >';
				progressHTML += 	'<div class="progress_text" >';
				progressHTML += 		PROGRESS[progressPoint].text;
				progressHTML += 	'</div>';
				progressHTML += 	'<table id="numerals_'+progressPoint+'" style="width: 100%;"><tbody><tr>';
				progressHTML += 		'<td class="progress_screen_pp_start" style="width: 33%; text-align: left;">'+startPP+'</td>';		
				progressHTML += 		'<td class="progress_screen_pp_label" style="width: 33%; text-align: center;"><b>重生点数</b></td>';		
				progressHTML += 		'<td class="progress_screen_pp_end" style="width: 33%; text-align: right;">'+endPP+'</td>';
				progressHTML += 	'</tr></tbody></table>';
				progressHTML += 	'<div class="progressbar_wrapper">';
				progressHTML += 		'<div style="width:'+progressBlankBar+'%;" class="progressbar_prestige_cover_progress_screen" id="progressbar_prestige_cover_progress_screen_'+progressPoint+'" style="width: 100%;"></div>';	
				progressHTML += 		'<div style="width:'+progressYellowBar+'%;" class="progressbar_prestige_progress_screen" id="progressbar_prestige_progress_screen_'+progressPoint+'"></div>';
							
				progressHTML += 	'</div>';
				progressHTML += '<div style="min-height: 18px;">';	
				if ((v.prestigePointsTotal > startPP) && (v.prestigePointsTotal < endPP)) {
					progressHTML += 	'<div class="current_pp_number" id="current_pp_number_'+progressPoint+
										'" style="position: relative; top: 0; left: '+leftPointerMargin+'%; width: 	1px; text-align: left;">';
					progressHTML += 		v.prestigePointsTotal
					progressHTML += 	'</div>';
				}	
				progressHTML += '</div>';
				progressHTML += '</div>';				
			}		
		}
		
		if (v.currentChallenge > 0) {
			progressHTML += '<div class="tr_label" style="padding-bottom: 15px;">挑战</div>';
			progressHTML += CheckChallenge(v.currentChallenge);
		}
			
		$('#progress').html(progressHTML);
			
		$('.progress_slide').hide();
		$('.progress_slide').last().addClass('active');

		$('#progressLeft').off('click').on('click', function (e) {
			let activeID = +$('.progress_slide.active').eq(0).attr('id').split('ppid_').join('');			
			if (activeID > 0) {
				$('.progress_slide.active').removeClass('active');			
				$('#ppid_'+(activeID-1)).addClass('active');
				$('#progressRight').removeClass('disabled');
			}
			if (activeID == 1) {
				$('#progressLeft').addClass('disabled');
			}
		});		
		$('#progressRight').off('click').on('click', function (e) {
			let activeID = +$('.progress_slide.active').eq(0).attr('id').split('ppid_').join('');
			if ($('#ppid_'+(activeID+1)).length > 0) {
				$('.progress_slide.active').removeClass('active');			
				$('#ppid_'+(activeID+1)).addClass('active');
				$('#progressLeft').removeClass('disabled');
			}
			if (activeID == $('.progress_slide').length - 2) {
				$('#progressRight').addClass('disabled');
			}
		});
		
		
	}
	
	function UpdateOptionsScreen() {
		if (v.options.darkmode === true) {
			$('#options_dark_mode').attr('checked', 'checked');
		}		
		$('#options_dark_mode').off('click').on('click', function (e) {
			if ($('#options_dark_mode').is(':checked')) {
				v.options.darkmode = true;
			} else {
				v.options.darkmode = false;
			}
			if (v.options.darkmode === true) {
				$('body').addClass('darkMode');
			} else {
				$('body').removeClass('darkMode');
			}
		});
		
		if (v.options.e_notation === true) {
			$('#options_e_notation').attr('checked', 'checked');
		}
		$('#options_e_notation').off('click').on('click', function (e) {
			if ($('#options_e_notation').is(':checked')) {
				v.options.e_notation = true;
			} else {
				v.options.e_notation = false;
			}
		});
			
		$('#import_btn').off('click').on('click', function (e) {
			SaveGame();
			let impVar = {};
			impVar.v = window.localStorage.getItem('v');
			impVar.paid = window.localStorage.getItem('paid');
			impVar.date = window.localStorage.getItem('date');
			impVar.gameState = window.localStorage.getItem('gameState');
			impVar.version = window.localStorage.getItem('version');
			impVar.tierupData = window.localStorage.getItem('tierupData');
			impVar.gameData = window.localStorage.getItem('gameData');
			impVar.history = window.localStorage.getItem('history');
			impVar.perkData = window.localStorage.getItem('perkData');
			impVar.selectStarterRestaurantData = window.localStorage.getItem('selectStarterRestaurantData');
			$('#import_export_box').text('.'+ btoa(encodeURIComponent(JSON.stringify(impVar))) +'.');
			$('#import_export_box').val('.'+ btoa(encodeURIComponent(JSON.stringify(impVar))) +'.');
		});
		$('#export_btn').off('click').on('click', function (e) {
			let expVar = $('#import_export_box').text();
			if (expVar == '') {
				expVar = $('#import_export_box').val(); //Opera thinks it's val
			}
			if ((expVar[0] === '.') && (expVar[expVar.length-1] === '.')) {
				$( "#dialog-confirm-export" ).dialog({
					resizable: false,
					height: "auto",
					width: 400,
					modal: true,
					buttons: {
						"Import": function() {
							
							$( this ).dialog( "close" );
							
							expVar = expVar.split('.').join('');			
							expVar = JSON.parse(decodeURIComponent(atob(expVar)));
							
							window.localStorage.setItem('v', JSON.stringify(JSON.parse(expVar.v)));
							if (expVar.paid != undefined) {
								window.localStorage.setItem('paid', JSON.stringify(JSON.parse(expVar.paid)));
							}	
							
							window.localStorage.setItem('date', expVar.date);
							window.localStorage.setItem('gameState', gameState);
							window.localStorage.setItem('version', expVar.version);
							window.localStorage.setItem('tierupData', JSON.stringify(JSON.parse(expVar.tierupData)));
							window.localStorage.setItem('gameData', JSON.stringify(JSON.parse(expVar.gameData)));
							window.localStorage.setItem('history', expVar.history);
							window.localStorage.setItem('perkData', JSON.stringify(JSON.parse(expVar.perkData)));
							window.localStorage.setItem('selectStarterRestaurantData', JSON.stringify(JSON.parse(expVar.selectStarterRestaurantData)));
							
							LoadGame(false);						
							
							$('#game_button').click();
							UpdatePrestigeButtons();
							UpdatePrestigeScreen();
							if (kongversion) {
								PrestigeRestaurant();
							}	
							SaveGame();
						},
						取消: function() {
						  $( this ).dialog( "close" );
						}
					}
				});				
			} else {
				alert('Wrong format');
			}
			
		});
		$('#select_all_btn').off('click').on('click', function (e) {
			$('#import_export_box').select();
		});
	}
	
	function UpdateShopScreen() {
		if (!kongversion) {
			$('#login_btn').on('click', function () {
				$.post("/login.php",
				  {
					username: $('#username_input').val(),
					password: $('#password_input').val()
				  },
				  function(data, status){
					alert("数据: " + data + "\n状态: " + status);
				  });
			});
			$('#register_btn').on('click', function () {
				$.post("/register.php",
				  {
					username: $('#username_input').val(),
					password: $('#password_input').val(),
					confirm_password: $('#password_input').val()
				  },
				  function(data, status){
					alert("数据: " + data + "\n状态: " + status);
				  });
			});
		}
		
		$("#gems").html(paid.gems+' <span>💎</span>');
		
		if (kongversion) {
			kongregate.mtx.requestUserItemList(null, onUserItems);
		}
		
		if (paid.triple_choice === true) {
			$("#btnBuyTriple").hide();
			$("#boughtTriple").show();			
		}
		
		if (v.skills['fasterCoupons'] >= 1) {
			$("#coupon_buy_qty").html('200');
		}
		
		if (v.skills['prestigeBoosters'] >= 1) {
			$("#cantBuyPrestigeBoosters").hide();
			$("#btnBuyPrestigeBoosters").show();
		} else {
			$("#cantBuyPrestigeBoosters").show();
			$("#btnBuyPrestigeBoosters").hide();
		}
		
		
	}
	
	function UpgradeSkill(skillName) {
		let currentSkillLevel = v.skills[skillName];
		if (currentSkillLevel === undefined) {
			currentSkillLevel = 0;
		}
		let nextLevelSkillPointCost = defaultSkillStats[skillName].levels[currentSkillLevel+1];
		if (nextLevelSkillPointCost !== undefined) {
			if (v.skillPointsUnspent >= nextLevelSkillPointCost) {
				v.skillPointsUnspent = v.skillPointsUnspent - nextLevelSkillPointCost;
				v.skills[skillName] = currentSkillLevel + 1;
			}
		}
		
		if (skillName.indexOf('tier3food') >= 0) {
			for (let prop in defaultFoodStats) {
				if ((defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].class_a != 'buff')) {					
					if ( (defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].baseIncome == 4) && (v.skills.tier3food >= 1) ) {
						v.newFood.push(prop);
					}
				}	
			}
			if (gameState === 'selectStarterRestaurant') {
				SelectStarterRestaurant();
			}
		}
		
		if (skillName.indexOf('cook') >= 0) {
			if (v.skills.cook6 >= 1) {
				v.currentCookMode = 6;
			} else if (v.skills.cook3 >= 1) {
				v.currentCookMode = 3;
			} else if (v.skills.cook2 >= 1) {
				v.currentCookMode = 2;
			} else {
				v.currentCookMode = 1;		
			}
			UpdateButtonsOnChange();
		}
		
		if ((skillName.indexOf('starterRestaurants') >= 0) && (v.activeIncome == 0)) {
			SelectStarterRestaurant();
		}
		
		if (skillName.indexOf('tier2_3starter') >= 0) {
			$('#game').addClass('tier23');
		}		
		if ((skillName.indexOf('tier2_3starter') >= 0) && (v.activeIncome == 0)) {
			SelectStarterRestaurant();
		}
			
		if (skillName.indexOf('challenges') >= 0) {
			v.currentChallenge = 10;
		}
		
		if (skillName.indexOf('novelty') >= 0) {
			for (let catName in v.categoryBonuses) {
				v.categoryBonuses[catName] = (Math.round(defaultCategoryBonuses[catName] * (100 + v.currentNovelty[catName])))/100;				
			}
		}
		
		if (skillName.indexOf('fasterCoupons') >= 0) {
			v.couponShardsBreakpoint = 300;
		}
		
		UpdateIncome();
		UpdatePrestigeScreen();
		UpdatePrestigeButtons();
		InitializeButtons();
		UpdateFoodItems();
		UpdateInfoScreen();
	}
	
	function SaveGame() {
		
		if (t[v.tutorialLevel].val >= t['finished0'].val) {			
			
			window.localStorage.setItem('v', JSON.stringify(v));
			if ((paid === null) || (paid === undefined)) {
				paid = {};
				paid.gems = 0;
				paid.gems_spent = 0;
				paid.gems_from_challenges = 0;
				paid.gems_last_operation = 0;
				paid.triple_choice = false;
				paid.awarded_triple_choice = false;
				paid.awarded_gems = 0;
				paid.claimed_gems = 0;
			}
			window.localStorage.setItem('paid', JSON.stringify(paid));
			window.localStorage.setItem('date', Date.now());
			window.localStorage.setItem('version', '1.01');
			window.localStorage.setItem('gameState', gameState);
			
			let gameData = {};
			
			gameData.defaultFI = [];
			$('#default .fooditem').each( function() {			
				let fooditem = {};
				fooditem.buffs = $(this).attr('data-buffs');
				fooditem.type = $(this).attr('data-type');
				fooditem.qty = $(this).attr('data-qty');
				gameData.defaultFI.push(fooditem);
			});
			
			gameData.storefrontFI = [];
			$('#storefront .fooditem').each( function() {			
				let fooditem = {};
				fooditem.buffs = $(this).attr('data-buffs');
				fooditem.type = $(this).attr('data-type');
				fooditem.qty = $(this).attr('data-qty');
				gameData.storefrontFI.push(fooditem);
			});
			
			
			gameData.kitchenFI = [];
			$('#kitchen .fooditem').each( function() {			
				let fooditem = {};
				fooditem.buffs = $(this).attr('data-buffs');
				fooditem.type = $(this).attr('data-type');
				fooditem.qty = $(this).attr('data-qty');
				gameData.kitchenFI.push(fooditem);
			});
			
			window.localStorage.setItem('gameData', JSON.stringify(gameData));	


			if (gameState == 'tierup') {
				let tierupData = [];				
				$('#options .fooditem').each( function() {			
					let fooditem = {};
					fooditem.type = $(this).attr('data-type');
					tierupData.push(fooditem);
				});
				window.localStorage.setItem('tierupData', JSON.stringify(tierupData));
			}
			
			if (gameState == 'selectStarterRestaurant') {
				let selectStarterRestaurantData = {};				
				selectStarterRestaurantData.food = [];				
				selectStarterRestaurantData.names = [];				
				$('#options .fooditem').each( function() {			
					let fooditem = {};
					fooditem.type = $(this).attr('data-type');
					fooditem.qty = $(this).attr('data-qty');
					selectStarterRestaurantData.food.push(fooditem);
				});
				$('#options .restaurantname').each( function() {			
					let tempRestaurantName = '';
					tempRestaurantName = $(this).text();
					selectStarterRestaurantData.names.push(tempRestaurantName);
				});
				window.localStorage.setItem('selectStarterRestaurantData', JSON.stringify(selectStarterRestaurantData));
			}	

			if (gameState == 'perk') {
				let perkData = [];				
				$('#options button.perk').each( function() {			
					let perkBtn = {};
					perkBtn.perk = $(this).attr('data-perk');
					perkData.push(perkBtn);
				});
				window.localStorage.setItem('perkData', JSON.stringify(perkData));
			}
		}
		
	}
	
	function LoadGame(showDialog = true) {		
		v = JSON.parse(window.localStorage.getItem('v'));
		v.prestigePointCost = GetCostFromPP(v.prestigePointsTotal + v.prestigePointsToGet);
		
		if (isNaN(v.money)) {
			v.money = 0;
		}
		if (isNaN(v.prestigePointsToGet)) {
			v.prestigePointsToGet = 0;
		}
		if (isNaN(v.prestigePointMoneyEarned)) {
			v.prestigePointMoneyEarned = 0;
		}		
		paid = JSON.parse(window.localStorage.getItem('paid'));
		DefineNewVariables();
		let gameData = JSON.parse(window.localStorage.getItem('gameData'));		
		gameState = window.localStorage.getItem('gameState');
		let currentTime = Date.now();
		let timeDif = Math.round((currentTime - window.localStorage.getItem('date')) / 1000);
			
		let defaultHTML = '';		
		for (let idefaultFI in gameData.defaultFI) {
			let qtySpan = '';
			if (gameData.defaultFI[idefaultFI].qty > 1) {
				qtySpan = '<span class="qty">'+gameData.defaultFI[idefaultFI].qty+'</span>';
			}
			let iBuffs = gameData.defaultFI[idefaultFI].buffs;
			if (iBuffs !== undefined) {
				iBuffs = iBuffs.split('"').join('&quot;');
				defaultHTML += '<div class="fooditem-wrapper"><div class="fooditem" data-buffs="'+iBuffs+'" data-type="'+gameData.defaultFI[idefaultFI].type+'" data-qty="'+gameData.defaultFI[idefaultFI].qty+'">'+qtySpan+'</div></div>';
			}	
		}		
		$('#default .fooditems').html(defaultHTML);
		if (defaultHTML != '') {
			$('#dishwashing').hide();				
			$('#default').show();	
			$('#game .restaurantname').text(v.restaurantName);			
		}
		
		let storefrontHTML = '';		
		for (let istorefrontFI in gameData.storefrontFI) {
			let qtySpan = '';
			if (gameData.storefrontFI[istorefrontFI].qty > 1) {
				qtySpan = '<span class="qty">'+gameData.storefrontFI[istorefrontFI].qty+'</span>';
			}
			let iBuffs = gameData.storefrontFI[istorefrontFI].buffs;
			if (iBuffs !== undefined) {
				iBuffs = iBuffs.split('"').join('&quot;');
				storefrontHTML += '<div class="fooditem-wrapper"><div class="fooditem" data-buffs="'+iBuffs+'" data-type="'+gameData.storefrontFI[istorefrontFI].type+'" data-qty="'+gameData.storefrontFI[istorefrontFI].qty+'">'+qtySpan+'</div></div>';
			}	
		}		
		$('#storefront .fooditems').html(storefrontHTML);
			
		let kitchenHTML = '';		
		for (let ikitchenFI in gameData.kitchenFI) {
			let qtySpan = '';
			if (gameData.kitchenFI[ikitchenFI].qty > 1) {
				qtySpan = '<span class="qty">'+gameData.kitchenFI[ikitchenFI].qty+'</span>';
			} 
			let iBuffs = gameData.kitchenFI[ikitchenFI].buffs;
			if (iBuffs !== undefined) {
				iBuffs = iBuffs.split('"').join('&quot;');
				kitchenHTML += '<div class="fooditem-wrapper"><div class="fooditem" data-buffs="'+iBuffs+'" data-type="'+gameData.kitchenFI[ikitchenFI].type+'" data-qty="'+gameData.kitchenFI[ikitchenFI].qty+'">'+qtySpan+'</div></div>';
			}	
		}		
		$('#kitchen .fooditems').html(kitchenHTML);
		
		dishwashing.dirty = ['','','','',''];
		dishwashing.sink = '';
		dishwashing.clean = ['','','','',''];
		
		$('#dirty button').prop('disabled', true).text('拿取');		
		$('#sink button').prop('disabled', true).text('清理');
		$('#clean button').prop('disabled', false).text('新一批');
		
		SetJQReferences();
		InitializeButtons();
		UpdateInfoScreen();
		UpdatePrestigeScreen();		
		DishwashingRefresh();	
		
		if (t[v.tutorialLevel].val >= t['tierup0'].val) {
			$('#progressbars').fadeIn(500);
			$('#prestige_button').fadeIn(500);
			$('#progress_button').fadeIn(500);
		}
		
	
		if (t[v.tutorialLevel].val >= t['idle3'].val) {				
			$('#shop_button').fadeIn(500);			
		}
		
		if (showDialog) {
			if ((timeDif > 0) && (gameState === 'normal')) {
				EverySecond(timeDif);
				UpdateIncome();
				let welcomeBackHTML = '你离开了<b>' + BeautifyTime(timeDif) + '</b>';
				welcomeBackHTML += '获得了<br><br><b class="money_earned">' + (AbbreviateNumberLong(timeDif * v.activeIncome)).toString().replace(' ', '<br>') + ' $</b><br><br>';
				let totalRestaurantIncome = 0;
				let bestIncomeNum = 0;
				let bestIncomeType = '';
				$('#default .fooditem, #storefront .fooditem').each( function() {
					totalRestaurantIncome = +totalRestaurantIncome + +$(this).attr('data-income');
					if (+bestIncomeNum < +$(this).attr('data-income')) {
						bestIncomeNum = $(this).attr('data-income');
						bestIncomeType = $(this).attr('data-type');
					}
				});
				if (bestIncomeType !== '') {
					let bestIncomePercent = (100*(bestIncomeNum/totalRestaurantIncome)).toFixed(0);
					
					welcomeBackHTML += '你最拿手的菜肴是<br>';
					welcomeBackHTML += '<div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="'+bestIncomeType+'" data-qty="1"></div></div>';
					welcomeBackHTML += '<br>它的收入占你总收益的<b class="percent_earned">'+bestIncomePercent+'%</b>!';
				}
				welcomeBackHTML += 
				$("#return_popup").html(welcomeBackHTML).dialog({
					position: { my: "center", at: "center", of: 'body' },
					modal: true,
					buttons: {
						好: function() {
							$( this ).dialog( "close" );
						}
					}
				});			
			}
			if ((timeDif > 0) && (gameState !== 'normal')) {
				EverySecond(timeDif);
				let welcomeBackHTML = '你离开了<br><b>' + BeautifyTime(timeDif) + ' </b><br>';
				welcomeBackHTML += '<br>获得了<br><b>' + AbbreviateNumberLong(timeDif * v.activeIncome) + ' $</b><br>';
				$("#return_popup").html(welcomeBackHTML).dialog({
					modal: true,
					buttons: {
						好: function() {
							$( this ).dialog( "close" );
						}
					}
				});			
			}
		} else {
			EverySecond(timeDif);
		}
		
		$('#info_button').fadeIn(500);
		$superCookButton.fadeIn(500);
		$('button.new').fadeIn(500);
		$('#main_menu').css('visibility','visible').fadeIn(500);
		$('#game').fadeIn(500);
		$('#storefront').fadeIn(500);
		$('#kitchen').fadeIn(500);
		$('#bottom_controls').fadeIn(500);
		$('#tutorial_box').hide();
		
		if (window.localStorage.getItem('history') !== '') {
			let historyHTML = window.localStorage.getItem('history');			
			$('#info_history').html(historyHTML);
		}			
		
		//TIER UP
		
		if (gameState == 'tierup') {
			let tierupData = JSON.parse(window.localStorage.getItem('tierupData'));	
			let optionsHTML = '';
			
			if ( (tierupData[0] !== undefined) && (tierupData[1] !== undefined) && (tierupData[2] !== undefined) && (tierupData[3] !== undefined) ) {		
				$('#kitchen').hide();
				$('#bottom_controls').hide();
				$('#options').show();
				
				optionsHTML += '<div id="new1" style="padding: 3px; border: 1px solid #c78888; display:inline-block;margin-bottom: 12px;" ><b style="color:#c78888">集合1</b><br>';
				optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + tierupData[0].type + '" data-qty="1"></div></div>';
				optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + tierupData[1].type + '" data-qty="1"></div></div>';
				optionsHTML += 	'<br><button onClick="SetNewFood(1)">选择</button>';			
				optionsHTML += '</div>';
				optionsHTML += '<div id="new2" style="padding: 3px; border: 1px solid #c78888; display:inline-block;margin-bottom: 12px;"><b style="color:#c78888">集合2</b><br>';
				optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + tierupData[2].type + '" data-qty="1"></div></div>';
				optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + tierupData[3].type + '" data-qty="1"></div></div>';
				optionsHTML += 	'<br><button onClick="SetNewFood(2)">选择</button>';
				optionsHTML += '</div>';
				if (v.skills.triple_choice === 'HardResetGame()') {
					if ( (tierupData[4] !== undefined) && (tierupData[5] !== undefined) ) {
						optionsHTML += '<div id="new3" style="padding: 3px; border: 1px solid #c78888; display:inline-block;margin-bottom: 12px;"><b style="color:#c78888">集合3</b><br>';
						optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + tierupData[4].type + '" data-qty="1"></div></div>';
						optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + tierupData[5].type + '" data-qty="1"></div></div>';
						optionsHTML += 	'<br><button onClick="SetNewFood(3)">选择</button>';
						optionsHTML += '</div>';
					}
				}
				
				$('#options	.inner').html(optionsHTML);
				$('#options .tr_label').text('升阶');
				$('#options .fooditem').each(
					function() {
						$(this).prop('onclick', null).off('click');

						$(this).off('mouseover');
						$(this).on('mouseover', function (e) {
							let thisDataType = $(this).attr('data-type');
							if (thisDataType == '') {
								return false;
							}

							let thisClassA = defaultFoodStats[thisDataType].class_a;
							let thisClassB = defaultFoodStats[thisDataType].class_b;
							let thisBaseIncome = defaultFoodStats[thisDataType].baseIncome;

							let thisDataTypeCapitalized = BeautifyDataType(thisDataType);

							let desc = '<b style="font-size: 16px;">' + thisDataTypeCapitalized + '</b><br>';
							desc += '<b class="category_circle" style="color:'+colors[thisClassA]+'">●</b> ' + BeautifyDataType(thisClassA) + '<br>';
							desc += '<b class="category_circle" style="color:'+colors[thisClassB]+'">●</b> ' + BeautifyDataType(thisClassB) + '<br>';
							desc += '基础收益: <b>' + thisBaseIncome + '</b><br>';
							$descriptionBox.html(desc);
							descFadeout = false;
							e.stopPropagation();
						});					
						$(this).off('mouseout').on('mouseout', function (e) {
							DescStartFadeOut();
							e.stopPropagation();
						});
					}
				);

				UpdateButtonsOnChange();
				UpdateFoodItems();
			}	
		}
		
		// SELECT STARTER RESTAURANT
		
		if (gameState == 'selectStarterRestaurant') {
			if (v.skills['tier2_3starter'] >= 1) {
				PrestigeRestaurant();
			} else {
				let selectStarterRestaurantData = JSON.parse(window.localStorage.getItem('selectStarterRestaurantData'));
				let optionsHTML = '';
				
				$('#dishwashing').hide();
				$('#default').hide();
				$('#storefront').hide();
				$('#kitchen').hide();
				$('#bottom_controls').hide();
				$('#options').show();
				
				
				optionsHTML += '<div id="new1" style="padding: 3px; border: 1px solid #c78888; display:inline-block;margin-bottom: 12px;" ><b class="restaurantname" style="color:#c78888; width:200px;height: 36px;display: block;">'+selectStarterRestaurantData.names[0]+'</b>';
				optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + selectStarterRestaurantData.food[0].type + '" data-qty="'+selectStarterRestaurantData.food[0].qty+'"><span class="qty">'+selectStarterRestaurantData.food[0].qty+'</span></div></div>';
				optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + selectStarterRestaurantData.food[1].type + '" data-qty="'+selectStarterRestaurantData.food[1].qty+'"><span class="qty">'+selectStarterRestaurantData.food[1].qty+'</span></div></div>';
				optionsHTML += 	'<br><button onClick="SetDefaultFood(1)">选择</button>';			
				optionsHTML += '</div>';
				optionsHTML += '<div id="new2" style="padding: 3px; border: 1px solid #c78888; display:inline-block;margin-bottom: 12px;"><b class="restaurantname" style="color:#c78888; width:200px;height: 36px;display: block;">'+selectStarterRestaurantData.names[1]+'</b>';
				optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + selectStarterRestaurantData.food[2].type + '" data-qty="'+selectStarterRestaurantData.food[2].qty+'"><span class="qty">'+selectStarterRestaurantData.food[2].qty+'</span></div></div>';
				optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + selectStarterRestaurantData.food[3].type + '" data-qty="'+selectStarterRestaurantData.food[3].qty+'"><span class="qty">'+selectStarterRestaurantData.food[3].qty+'</span></div></div>';
				optionsHTML += 	'<br><button onClick="SetDefaultFood(2)">选择</button>';
				optionsHTML += '</div>';
				if (v.skills.triple_choice === 'HardResetGame()') {
					optionsHTML += '<div id="new3" style="padding: 3px; border: 1px solid #c78888; display:inline-block;margin-bottom: 12px;"><b class="restaurantname" style="color:#c78888; width:200px;height: 36px;display: block;">'+selectStarterRestaurantData.names[2]+'</b>';
					optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + selectStarterRestaurantData.food[4].type + '" data-qty="'+selectStarterRestaurantData.food[4].qty+'"><span class="qty">'+selectStarterRestaurantData.food[4].qty+'</span></div></div>';
					optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + selectStarterRestaurantData.food[5].type + '" data-qty="'+selectStarterRestaurantData.food[5].qty+'"><span class="qty">'+selectStarterRestaurantData.food[5].qty+'</span></div></div>';
					optionsHTML += 	'<br><button onClick="SetDefaultFood(3)">选择</button>';
					optionsHTML += '</div>';
				}
				
				$('#options	.inner').html(optionsHTML);
				$('#options .tr_label').text('选择初始餐馆');
				$('#options .fooditem').each(
					function() {
						$(this).prop('onclick', null).off('click');

						$(this).off('mouseover');
						$(this).on('mouseover', function (e) {
							let thisDataType = $(this).attr('data-type');
							if (thisDataType == '') {
								return false;
							}

							let thisClassA = defaultFoodStats[thisDataType].class_a;
							let thisClassB = defaultFoodStats[thisDataType].class_b;
							let thisBaseIncome = defaultFoodStats[thisDataType].baseIncome;

							let thisDataTypeCapitalized = BeautifyDataType(thisDataType);

							let desc = '<b style="font-size: 16px;">' + thisDataTypeCapitalized + '</b><br>';
							desc += '<b class="category_circle" style="color:'+colors[thisClassA]+'">●</b> ' + BeautifyDataType(thisClassA) + '<br>';
							desc += '<b class="category_circle" style="color:'+colors[thisClassB]+'">●</b> ' + BeautifyDataType(thisClassB) + '<br>';
							desc += '基础收益: <b>' + thisBaseIncome + '</b><br>';
							$descriptionBox.html(desc);
							descFadeout = false;
							e.stopPropagation();
						});					
						$(this).off('mouseout').on('mouseout', function (e) {
							DescStartFadeOut();
							e.stopPropagation();
						});
					}
				);		

				UpdateButtonsOnChange();
			}	
		}
		
		// PERK
		
		if (gameState == 'perk') {
			let perkData = JSON.parse(window.localStorage.getItem('perkData'));
			let optionsHTML = '';
			
			if ((perkData[0] !== undefined) && (perkData[1] !== undefined)) {			
				$('#kitchen').hide();
				$('#bottom_controls').hide();
				$('#options').show();
				
				optionsHTML += '<div id="new1" style="padding: 3px; width: 30%; display:inline-block;margin-bottom: 12px;" ><br>';
				optionsHTML += 	'<button class="perk" data-perk="'+perkData[0].perk+'" onClick="SetNewPerk(\''+perkData[0].perk+'\')">'+defaultPerkStats[perkData[0].perk].name+'</button>';			
				optionsHTML += '</div>';
				optionsHTML += '<div id="new2" style="padding: 3px; width: 30%; display:inline-block;margin-bottom: 12px;"><br>';
				optionsHTML += 	'<button class="perk" data-perk="'+perkData[1].perk+'" onClick="SetNewPerk(\''+perkData[1].perk+'\')">'+defaultPerkStats[perkData[1].perk].name+'</button>';
				optionsHTML += '</div>';
				if (v.skills.triple_choice === 'HardResetGame()') {
					if ((perkData[2] !== undefined)) {
						optionsHTML += '<div id="new3" style="padding: 3px; width: 30%; display:inline-block;margin-bottom: 12px;"><br>';
						optionsHTML += '<button class="perk" data-perk="'+perkData[2].perk+'" onClick="SetNewPerk(\''+perkData[2].perk+'\')">'+defaultPerkStats[perkData[2].perk].name+'</button>';
						optionsHTML += '</div>';
					}
				}
				
				$('#options	.inner').html(optionsHTML);
				$('#options .tr_label').text('选择一个特权');
				
				$('#options button').each(
					function() {
						$(this).off('mouseover').on('mouseover', function (e) {				
							let thisDataPerk = $(this).attr('data-perk');
							let thisName = $(this).text();
							if (thisDataPerk	 == '') {
								return false;
							}
							
							let desc = '<b style="font-size: 16px;">' + thisName + '</b><br>';
							desc += defaultPerkStats[thisDataPerk].desc;					
							$descriptionBox.html(desc);
							descFadeout = false;
							e.stopPropagation();
						});					
						$(this).off('mouseout').on('mouseout', function (e) {
							DescStartFadeOut();
							e.stopPropagation();
						});
					}
				);
			}	
		
			UpdateButtonsOnChange();			
		}			
		
		if ((v.skills['science'] >= 1) && ((v.scienceCategory === undefined) || (v.scienceCategory === ''))) {
			$('#default').append('<button class="science" onClick="DoScience();">应用科学</button>');
		}
		if (v.options.darkmode === true) {
			$('body').addClass('darkMode');
		}
		UpdateIncome();		
		UpdateFoodItems();	
		if ($('#storefront .fooditem').length > 18) {
			$('#game').addClass('bigmenu');
		} else {
			$('#game').removeClass('bigmenu');
		}
		if (v.skills['tier2_3starter'] >= 1) {
			$('#game').addClass('tier23');
		} else {
			$('#game').removeClass('tier23');
		}
		if (paid.triple_choice == true) {
			v.skills.triple_choice = 'HardResetGame()';
		}
		
		if ((v.version == 100) && (v.prestigeBoosters == 0)) {
			v.version = 101;
			v.prestigeBoosters = 1;
		}		
	}
	
	function SetJQReferences() {
		$moneyCurrent = $('#money .current');	
		$moneyIncome = $('#money .income');
		$moneyCoupons = $('#money .coupons');
		$cookTime = $('#cook_time');	
		$superCookTime = $('#supercook_time');		
		$cookCouponsTime = $('#cook_coupons_time');
		$superCookCouponsTime = $('#supercook_coupons_time');
		$descriptionBox = $('#description_box');
		$progressbarPrestigeCover = $('#progressbar_prestige_cover');
		$progressbarPrestigeCover2 = $('#progressbar_prestige_cover2');
		$progressbarPrestige2 = $('#progressbar_prestige2');
		
		$cookButton = $('#game button.cook');	
		$cook2Button = $('#game button.cook2');	
		$cook3Button = $('#game button.cook3');	
		$cook6Button = $('#game button.cook6');		
		$superCookButton = $('#game button.supercook');
		$cookCouponsButton = $('#game button.cookCoupons');	
		$superCookCouponsButton = $('#game button.supercookCoupons');	
	}
	
	function BuyTripleChoiceKong() {
		kongregate.mtx.purchaseItems(["triplechoice"], onPurchaseResultTripleChoiceKong);
		function onPurchaseResultTripleChoiceKong(result) {
			if (result.success == true) {
				paid.triple_choice = true;
				v.skills['triple_choice'] = 'HardResetGame()';
				SaveGame();
				UpdateShopScreen();
				VerifyTransfer('kong', 'triple-kong');
			}
		}
	}
	
	function BuyGemsKong() {
		kongregate.mtx.purchaseItems(["fiftygems"], onPurchaseResultGemsKong);
		function onPurchaseResultGemsKong(result) {
			if (result.success == true) {
				paid.gems = +paid.gems + 50;
				SaveGame();
				UpdateShopScreen();
				VerifyTransfer('kong', 'gems-kong');
			}
		}
	}
	
	function BuyGemsTest() {
		paid.gems = +paid.gems + 50;
		SaveGame();
	}
	
	function BuyCoupons() {
		if (paid.gems >= 10) {
			paid.gems = +paid.gems - 10;
			if (v.skills['fasterCoupons'] >= 1) {
				v.coupons = +v.coupons + 200;
			} else {
				v.coupons = +v.coupons + 100;
			}			
			SaveGame();
			UpdateShopScreen();
		}	
	}
	
	function BuyPrestigeBoosters() {
		if (paid.gems >= 10) {
			paid.gems = +paid.gems - 10;
			v.prestigeBoosters = +v.prestigeBoosters + 1;		
			SaveGame();
			UpdateShopScreen();
		}	
	}

	function SortByIncome() {
		let sortedDivs = '';
		if (v.skills.mealOfTheDay >= 1) {
			sortedDivs = $('#storefront .fooditem-wrapper').css('border','').sort(function (a, b) {
				let contentA =	parseInt( $(a).children('.fooditem').attr('data-income') );
				let contentB =	parseInt( $(b).children('.fooditem').attr('data-income') );
				let placeA =	parseInt( $(a).children('.fooditem').attr('data-num') );
				let placeB =	parseInt( $(b).children('.fooditem').attr('data-num') );
				if ((placeA > 3) && (placeB > 3)) {
					return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
				} else {
					return 0;
				}
			});
		} else {
			sortedDivs = $('#storefront .fooditem-wrapper').css('border','').sort(function (a, b) {
				let contentA = parseInt( $(a).children('.fooditem').attr('data-income'));
				let contentB = parseInt( $(b).children('.fooditem').attr('data-income'));
				return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
			});
		}	

		$('#storefront .fooditems').html(sortedDivs);
		UpdateFoodItems();
		UpdateIncome();
		UpdateButtonsOnChange();
	}

	// Simple Functions
	
	function GetRandomInt(min, max) {
		if (min > max) {
			let temp = max;
			max = min;
			min = temp;
		}
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function RemoveFromArray(arr, item) {
		for (let i = arr.length; i--;) {
			if (arr[i] === item) {
				arr.splice(i, 1);
			}
		}
	}

	function GetRandomSubarray(arr, size) {
		let shuffled = arr.slice(0);
		let i = arr.length;
		let min = i - size;
		let temp, index;
		while (i-- > min) {
			index = Math.floor((i + 1) * Math.random());
			temp = shuffled[index];
			shuffled[index] = shuffled[i];
			shuffled[i] = temp;
		}
		return shuffled.slice(min);
	}

	function SortObjectByValue(obj) {
		let arr = [];
		for (let prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				arr.push({
					k: prop,
					v: obj[prop]
				});
			}
		}
		arr.sort(function(a, b) { return b.v - a.v; });
		// arr.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); // use this to sort as strings
		return arr; // returns array
	}
	
	function sortObjectByKey(obj) {
		return Object.keys(obj).sort().reduce(function (result, key) {
			result[key] = obj[key];
			return result;
		}, {});
	}

	function SumObj(obj1, obj2) {
		const sum = {};
		for (let prop in obj1) {
			sum[prop] = obj1[prop];
		}
		for (let prop in obj2) {
			if (sum.hasOwnProperty(prop)) {
				if ((obj1[prop] + obj2[prop]) < (50 * v.skills.maxBuff)) {
					sum[prop] = obj1[prop] + obj2[prop];
				} else {
					sum[prop] = (50 * v.skills.maxBuff);
				}	
			} else {
				sum[prop] = obj2[prop];
			}
		}
	  return sum;
	}

	let SI_SYMBOL = 			['', 'k', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Nn', 'Dc'];
	let SCIENTIFIC_NOTATION = 	['', 'e3', 'e6', 'e9', 'e12', 'e15', 'e18', 'e21', 'e24', 'e27', 'e30'];
	function AbbreviateNumber(num){
		let tier = Math.log10(num) / 3 | 0;
		if ((tier == 0) || (tier > 10)) return Math.round(num);
		let suffix = SI_SYMBOL[tier];
		if (v.options.e_notation) {
			suffix = SCIENTIFIC_NOTATION[tier];
		}
		let scale = Math.pow(10, tier * 3);
		let scaled = num / scale;
		return scaled.toFixed(2) + suffix;
	}

	//💰 💹 💴 💵 💷 💶 🎰 💱 🏧 💳 💸 💲
	let SI_SYMBOL_EMOJI = ['/秒&nbsp;<span>💸</span>', 'k/秒&nbsp;<span>💴</span>', 'M/秒&nbsp;<span>💵</span>', 'B/秒&nbsp;<span>💰</span>', 'T/秒&nbsp;<span>💳</span>', 'Qa/秒&nbsp;<span>💹</span>', 'Qi/秒&nbsp;<span>🎰</span>', 'Sx/秒&nbsp;<span>💱</span>', 'Sp/秒&nbsp;<span>🏧</span>', 'Nn/秒&nbsp;<span>🏦</span>', 'Dc/秒&nbsp;<span>🌐</span>'];
	let SCIENTIFIC_NOTATION_EMOJI = 	['/秒&nbsp;<span>💸</span>', 'e3/秒&nbsp;<span>💴</span>', 'e6/秒&nbsp;<span>💵</span>', 'e9/秒&nbsp;<span>💰</span>', 'e12/秒&nbsp;<span>💳</span>', 'e15/秒&nbsp;<span>💹</span>', 'e18/秒&nbsp;<span>🎰</span>', 'e21/秒&nbsp;<span>💱</span>', 'e24/秒&nbsp;<span>🏧</span>', 'e27/秒&nbsp;<span>🏦</span>', 'e30/秒&nbsp;<span>🌐</span>'];
	function AbbreviateNumberEmoji(num){
		let tier = Math.log10(num) / 3 | 0;
		if ((tier == 0) || (tier > 10)) return Math.round(num) + SI_SYMBOL_EMOJI[0];
		let suffix = SI_SYMBOL_EMOJI[tier];
		if (v.options.e_notation) {
			suffix = SCIENTIFIC_NOTATION[tier];
		}
		let scale = Math.pow(10, tier * 3);
		let scaled = num / scale;
		return scaled.toFixed(2) + suffix;
	}

	let SI_SYMBOL_LONG = ['', ' 10^3', ' 10^6', ' 10^9', ' 10^12', ' 10^15', ' 10^18', ' 10^21', ' 10^24', ' 10^27', ' 10^30'];
	
	function AbbreviateNumberLong(num){
		let tier = Math.log10(num) / 3 | 0;
		if ((tier == 0) || (tier > 10)) return Math.round(num);
		let suffix = SI_SYMBOL_LONG[tier];
		if (v.options.e_notation) {
			suffix = SCIENTIFIC_NOTATION[tier];
		}			
		let scale = Math.pow(10, tier * 3);
		let scaled = num / scale;
		return scaled.toFixed(2) + suffix;
	}

	function GetLvFromQtyOld(qty){
		let level = 1;
		let breakpointLvIterator = 10;
		while (qty >= breakpointLvIterator) { // 10, 30, 60, 100...
			level++;
			breakpointLvIterator = +breakpointLvIterator + 10 * level;
		}
		if (level >= v.skills.maxLevel) {
			level = v.skills.maxLevel;
		}
		return level;
	}
	
	function GetLvFromQty(qty){
		let level = 1;
		let firstDigit = qty.toString()[0];
		let secondDigit = qty.toString()[1];
		let digitCount = qty.toString().length;
		
		if (digitCount < 2) {
			return 1;
		}
		
		if (firstDigit === '1') { // 10, 100, 1000, ... = 2, 5, 8, ...
			level = 2 + (3 * (digitCount - 2))
		}	
		
		if (firstDigit === '2') { // 20, 28
			if (secondDigit < 5) { // 20
				level = 2 + (3 * (digitCount - 2));
			} else {				//28
				level = 3 + (3 * (digitCount - 2));
			}
		}	
		
		if ( (firstDigit > 2) && (firstDigit < 5) ) { //30, 40
			level = 3 + (3 * (digitCount - 2));
		}
		
		if (firstDigit >= 5) { //50+
			level = 4 + (3 * (digitCount - 2));
		}
		
		if (level >= v.skills.maxLevel) {
			level = v.skills.maxLevel;
		}
		return level;
	}
	
	function GetMaxQtyFromLv(level){
		let zeroes = Math.floor(level / 3);
		let numberType = level % 3;
		
		if (level === 1) {
			return '10';
		}
		
		switch (numberType) {
			case 0:
				return '5' + '0'.repeat(zeroes);
				break;
			case 1:
				return '10' + '0'.repeat(zeroes);
				break;	
			case 2:
				return '25' + '0'.repeat(zeroes);
				break;	
			default:
				return '???';				
		}		
	}

	function GetCostFromPP(PP){
		let resultCost = 2.5*1000*1000;
				
		if (PP > 9000) {
			return 22385023684915476;
		}

		for (let i = 1; i <= PP; i++) {
			if ((i > 0) && (i <= 10)) {				//0-10
				resultCost = resultCost * 1.1;
			} else if ((i > 10) && (i <= 30)) { 	//10-30
				resultCost = resultCost * 1.22;
			} else if ((i > 30) && (i <= 70)) {		//30-70
				resultCost = resultCost * 1.04;
			} else if ((i > 70) && (i <= 150)) { 	//70-150
				resultCost = resultCost * 1.025;
			} else if ((i > 150) && (i <= 310)) { 	//150-310
				resultCost = resultCost * 1.01;			
			} else if ((i > 310) && (i <= 630)) { 	//310-630
				resultCost = resultCost * 1.006;
			} else if ((i > 630) && (i <= 1270)) { 	//630-1270
				resultCost = resultCost * 1.0025;
			}
			else {
				resultCost = resultCost * 1.001;
			}
			if (i > 9000) {
				break;
			}
		}
		return Math.floor(resultCost);
	}

	function SetCharAt(str,index,chr) {
		if (index > str.length-1) return str;
		return str.substr(0,index) + chr + str.substr(index+1);
	}

	function BeautifyDataType(dataType) {
		if (dataType != '') {
			dataType = dataType[0].toUpperCase() + dataType.substring(1); // Capitalize
			dataType = dataType.replace('_', ' '); // Replace underscore
			dataType = dataType.replace('_', ' '); // Replace underscore again for fish_n_chips
		}
		return dataType;
	}
		
	function BeautifyTime(secondsLeft) { 
		let beautifulTime = '';
		if (secondsLeft < 60) {
			beautifulTime =  Math.round(secondsLeft) + '秒';
		} else {
			let hoursB = Math.round(Math.floor(secondsLeft / (60*60)));
			let minsB = Math.round(Math.floor((secondsLeft % (60*60)) /60));
			let secsB = Math.round(Math.floor(secondsLeft % 60));
			
			if (secsB < 10) {
				secsB = '0' + secsB;
			}
			
			if (hoursB > 0) {
				if (minsB < 10) {
					minsB = '0' + minsB;
				}
				beautifulTime = hoursB + ':' + minsB + ':' + secsB;
			} else {
				beautifulTime = minsB + ':' + secsB;
			}
		}
		return beautifulTime;
	}

	function BypassTurorial() {
		v.tutorialLevel = 'finished0';
		$('#info_button').fadeIn(500);
		$superCookButton.fadeIn(500);
		$('button.new').fadeIn(500);
		$('#main_menu').css('visibility','visible').fadeIn(500);
		$('#game').fadeIn(500);
		$('#money').css('visibility','visible').fadeIn(500);
		$('#storefront').fadeIn(500);
		$('#kitchen').fadeIn(500);
		$('#bottom_controls').fadeIn(500);
		AddKitchenSlots(5);
		v.money = 1000;
		UpdateTutorial();
	}


	if(Array.prototype.equals)
		console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
	Array.prototype.equals = function (array) {
		if (!array)
			return false;
		if (this.length != array.length)
			return false;
		for (let i = 0, l=this.length; i < l; i++) {
			// Check if we have nested arrays
			if (this[i] instanceof Array && array[i] instanceof Array) {
				// recurse into the nested arrays
				if (!this[i].equals(array[i]))
					return false;
			}
			else if (this[i] != array[i]) {
				// Warning - two different object instances will never be equal: {x:20} != {x:20}
				return false;
			}
		}
		return true;
	}
	// Hide method from for-in loops
	Object.defineProperty(Array.prototype, 'equals', {enumerable: false});
	
	function isMobile() { //or tablet
		if (!kongversion) {
		  let check = false;
		  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
		  return check;
		} else {
			return false;
		}
	};

	if (kongversion) {
		kongregateAPI.loadAPI(function(){
			window.kongregate = kongregateAPI.getAPI();
		});
		
    }
	
	function submitAchievements(score){
		if ((score != NaN) && (kongversion)) {
			if (window.kongregate !== undefined) {
				window.kongregate.stats.submit("Prestige points",score);
			}
		}
	}
	
	function VerifyTransfer(trIdent, trType) {
		$.post("https://restaurantidle.com/verify.php",
				  {
					ident: trIdent,
					type: trType
				  },
				  function(data, status){
					// TODO
				  });
	}
	
	function onUserItems(result) {	  
	  if(result.success) {
		for(var i=0; i < result.data.length; i++) {
			var item = result.data[i];
			if (item.identifier === 'triplechoice') {
				paid.triple_choice = true;
				v.skills['triple_choice'] = 'HardResetGame()';
			}
		}
	  }
	}
	