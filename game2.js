'use strict';

// Please don't post any spoilers or cheats you find reading this code.
// It's there for transparency purposes - so anyone can see the game does nothing bad.
// This is _not_ an Open Source project. 

window.localStorage.setItem('test', 'test');
let tempRC = false;
let debug1 = false;
let debug2 = false; // for bot
if (window.localStorage.getItem('test') !== 'test') {
	$('#loading').html('Error: failed to write to local storage. This game uses local storage to save progress so it will not work if local storage is blocked by incognito mode or plugins.');
}

if ((window.localStorage.getItem('history') === undefined) || (window.localStorage.getItem('history') === null)) {
	window.localStorage.setItem('history', '');
}
	let descInterval = '';
	let currentdeliveryDesc = '';
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
	let mealOfTheDayDeliveryActive = false;	
	const PRESTIGE_BOOST_BREAKPOINT = 24*60*60; // 1 booster a day
	const PRESTIGE_BOOST_VALUE = 4*60*60; // 4 hours for booster
	let v = {}; // game variables
	v.version = 201;
	v.tutorialLevel = 'greetings0'; // where in the tutorial the player currently is
	v.money = 0;
	v.coupons = 0;
	v.couponShards = 0;
	v.couponShardsBreakpoint = 600; // 600 seconds for coupon
	v.refreshPrice = 300;
	v.activeIncome = 0;	
	v.incomeWithDeliveries = 0;
	v.storeSlots = 5;
	v.kitchenSlots = 5;
	v.restaurantName = '';
	v.restaurantTier = 0;
	v.activeIncomeMultiplier = 1;
	v.cookCount = 0; // number of times player cooked
	v.moneySuperCookCount = 0; // number of times player used Super Cook for money
	v.deliveries = [{},{},{}]; // to store deliveries as objects
	v.deliveryCooksMax = 20;
	
	v.charityFood = 0;
	v.charityBreakpoint = 4;
	
	v.cookCouponsCount = 0;
	v.currentCookMode = 1;
	v.currentCookCouponsMode = 1;
	v.incomeBreakpoint = 900;
	v.fireworkN = 1; // to cycle through firework animations
	v.activeFood = []; // will put here only Tier 1 to start the game
	v.deliveryStatus = 'wait';
	v.deliveryFood = []; // will put here only Tier 1 to start the game
	v.deliveryBoxes = 0;
	v.deliveryBoxesShards = 0;
	v.deliveryBoxesShardsBreakpoint = 600;
	v.deliveryGiftBoxes = 0;	
	v.deliveryGiftBoxesCost = 1;
	v.goals = {c1: 1, c2: 1, c3: 1};
	v.unclaimedGoals = {c1: 0, c2: 0, c3: 0};
	v.newFood = []; // non tier-1 food for unlocking
	v.foodClasses = {}; // to store food classes in the current restaurant, i.e. "3 meat, 2 fastfood, etc."
	v.foodClassesDelivery = {}; // to store food classes in the current delivery, i.e. "3 meat, 2 fastfood, etc."
	v.foodClassesDeliveryPool = {}; // to store potential food classes in the current delivery pool, i.e. "3 meat, 2 fastfood, etc."
	v.hasDuplicates = false; // to store true if there is a duplicate dish
	v.skills = {}; // to store current active skills
	v.skills.minCook = 1;
	v.skills.maxCook = 2;
	v.skills.maxLevel = 4;
	v.skills.maxBuff = 1;
	v.skills.deliveryTier = 1;
	v.perks = []; // to store current active perks
	v.exhaustedPerks = []; // to store perks that should no longer be offered
	v.newPerks = []; // perks that can be aquired
	v.discontinueTokens = 0;
	v.scienceCategory = ''; // Currently applied science category
	v.options = { animations: true }; // to store current options
	v.options.megacookPercent = 20;
	v.options.gotRedditReward = false;
	v.options.gotDiscordReward = false;
	v.prestigePointCost = 2.5*1000*1000; 
	v.prestigePointMoneyEarned = 0;
	v.prestigePointsTotal = 0;
	v.skillPointsUnspent = 0;
	v.prestigePointsToGet = 0; //how much PP you get when you reset (not counting boosts)
	v.incomeMultipliers = {};
	v.incomeMultipliers.used_boosters = 1;	
	v.prestigeBoosters = 1;
	v.prestigeBoosterTimeLeft = PRESTIGE_BOOST_BREAKPOINT;
	v.bestRestaurant = {};
	v.bestRestaurant.income = 0;
	v.bestFood = {};
	v.bestFood.income = 0;
	v.biggestFood = {}; 
	v.biggestFood.qty = 0; 
	v.gotDishQtyRecord = false;
	v.gotDishIncomeRecord = false;
	v.gotRestaurantIncomeRecord = false;
	v.region = 0;
	v.regionFinishedQuests = {};
	v.regionRewardedQuests = {};	
	
	let paid = {}; // paid stuff
	paid.gems = 0;
	paid.gems_spent = 0;
	paid.gems_from_challenges = 0;
	paid.gems_last_operation = 0;
	paid.triple_choice = false;
	paid.awarded_triple_choice = false;
	paid.awarded_gems = 0;
	paid.claimed_gems = 0;
	
	let debug = {tt10: 0, tt30: 0, tt70:0, tt150:0, tt310:0, tt630:0, tt1270:0, tt2000:0, tt4000:0, tt8000:0, tt16000:0, tt32000:0};
	let dishwashing = {}; // dishwashing variables
	dishwashing.dirty = [GetRandomInt(1,9),GetRandomInt(1,9),GetRandomInt(1,9),GetRandomInt(1,9),GetRandomInt(1,9)];
	dishwashing.sink = '';
	dishwashing.clean = ['','','','',''];

	const defaultSkillStats = {};
	
	defaultSkillStats.testInvisibleSkill	={visible_at: -1,			active_at: 2000000,		name:'Invisible', levels: [0, 1],
	desc: 'BUG: If you see this, please report to the dev.'};
	defaultSkillStats.biggerDeliveries		={visible_at: -1,			active_at: 2000000,		name:'Bigger Deliveries', levels: [0, 1],
	desc: 'After 10 Delivery Cooks, your delivery will get an additional slot. Works once per delivery.'};
	defaultSkillStats.biggestDeliveries		={visible_at: -1,			active_at: 2000000,		name:'Biggest Deliveries', levels: [0, 1],
	desc: 'After 20 Delivery Cooks, your delivery will get an additional slot. Works once per delivery.'};

	defaultSkillStats.minCook				={visible_at: 0,			active_at: 15,			name:'Min Cook', levels: [0, 0, 15, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 
100000, 250000, 500000, 
1000000, 2500000, 5000000, 
10000000, 25000000, 50000000, 
100000000, 250000000, 500000000, 
1000000000, 2500000000, 5000000000, 
10000000000, 25000000000, 50000000000, 
100000000000, 250000000000, 500000000000, 
1000000000000, 2500000000000, 5000000000000, 
10000000000000, 25000000000000, 50000000000000, 
100000000000000, 250000000000000, 500000000000000, 
1000000000000000, 2500000000000000, 5000000000000000, 
10000000000000000, 25000000000000000, 50000000000000000, 100000000000000000],
	desc: 'Increases minimum cooking quantity by +1.'};
	defaultSkillStats.maxCook				={visible_at: 0,			active_at: 5,			name:'Max Cook', levels: [0, 0, 0, 5, 15, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 
100000, 250000, 500000, 
1000000, 2500000, 5000000, 
10000000, 25000000, 50000000, 
100000000, 250000000, 500000000, 
1000000000, 2500000000, 5000000000, 
10000000000, 25000000000, 50000000000, 
100000000000, 250000000000, 500000000000, 
1000000000000, 2500000000000, 5000000000000, 
10000000000000, 25000000000000, 50000000000000, 
100000000000000, 250000000000000, 500000000000000, 
1000000000000000, 2500000000000000, 5000000000000000, 
10000000000000000, 25000000000000000, 50000000000000000, 100000000000000000],
	desc: 'Increases maximum cooking quantity by +1.'};
	defaultSkillStats.maxLevel				={visible_at: 0,			active_at: 2,			name:'Max Level', levels: [0, 0, 0, 0, 0, 5, 25, 100, 250, 500, 5000],
	desc: 'Increases maximum dish level by +1.'};
	defaultSkillStats.coupons				={visible_at: 0,			active_at: 2,			name:'<span class="em">🔖</span> Coupons', levels: [0, 2],
	desc: 'Promotes your restaurant with coupons.<br> You\'ll get 1 coupon every 10 minutes. <br>Coupons are used for free cooking.<br> Also unlocks a Sort button.'};
	defaultSkillStats.buffs					={visible_at: 0,			active_at: 10,			name:'Buffs', levels: [0, 1, 10, 75 /*, 5000*/ ],
	desc: 'Adds a buff to the result of Supercooks for money.<br> Buffs can be added to any dish to improve its income. <br>Each level adds a new buff type.<br> Buff of the same type stack, buffs of different types multiply between each other.'};	

	defaultSkillStats.tier3food				={visible_at: 10,			active_at: 25,			name:'Tier 3 Dishes', levels: [0, 5],
	desc: 'Adds Tier 3 dishes.'};
	defaultSkillStats.cook2					={visible_at: 10,			active_at: 30,			name:'Double Cook', levels: [0, 2],
	desc: 'Adds a mode to cook 2 times in one click.'};

	defaultSkillStats.deliveryTier			={visible_at: 30,			active_at: 50,			name:'Delivery Tier', levels: [0, 0, 5, 150],
	desc: 'Upgrades the tier of dishes for the deliveries.'};
	defaultSkillStats.charity				={visible_at: 30,			active_at: 70,			name:'Charity', levels: [0, 1],
	desc: 'Adds Charity tab to the Info page.'};	

	defaultSkillStats.prestigeBoosters		={visible_at: 70,			active_at: 100,			name:'<span class="em">🌟</span> Prestige Boosters', levels: [0, 5],
	desc: 'Get 1 <span class="em">🌟</span> Prestige Booster every day. <br>Spend them to boost time on&nbsp;Prestige.'};	
	defaultSkillStats.starterRestaurants	={visible_at: 70,			active_at: 150,			name:'Starter Restaurants', levels: [0, 5],
	desc: 'Get a small restaurant to start with. Replaces dishwashing.'};
	defaultSkillStats.cook3					={visible_at: 70,			active_at: 200,			name:'Triple Cook', levels: [0, 3],
	desc: 'Adds a mode to cook 3 times in one click.'};

	defaultSkillStats.maxBuff				={visible_at: 150,			active_at: 230,			name:'Max Buff', levels: [0, 0, 15, 90],
	desc: 'Increases max buff quantity by +50.'};
	defaultSkillStats.perks					={visible_at: 150,			active_at: 310,			name:'<span class="em">📚</span> Perks', levels: [0, 5],
	desc: 'Choose a new perk on every Tier&nbsp;Up.'};	

	
	defaultSkillStats.challenges			={visible_at: 310,			active_at: 500,			name:'Challenges', levels: [0, 5],
	desc: 'Get access to challenges. More info on Progress tab.'};
	defaultSkillStats.supersort				={visible_at: 310,			active_at: 575,			name:'Super Sort', levels: [0, 10],
	desc: 'Whenever you press the Sort button, all the highlighted dishes from your kitchen will get automatically placed into your restaurant. <br><br> There is also an Option to auto-place Buffs.'};
	defaultSkillStats.tier2_3starter		={visible_at: 310,			active_at: 630,			name:'Tier 2&nbsp;and&nbsp;3 starters', levels: [0, 5],
	desc: 'Add tier 2 and 3 dishes to starter restaurants and ability to swap them out any time.'};

	defaultSkillStats.complimentary_drink	={visible_at: 630,			active_at: 750,			name:'Complimentary Drink', levels: [0, 5],
	desc: 'Adds a free drink to your deliveries (in a modern recyclable bottle).'};
	defaultSkillStats.dishOfTheDay			={visible_at: 630,			active_at: 1000,			name:'Dish of the Day', levels: [0, 5],
	desc: 'Highlights the main dish of your restaurant to give it double income.<br> Works for deliveries too!'};
	defaultSkillStats.prolonged_delivery	={visible_at: 630,			active_at: 1270,			name:'Prolonged Delivery', levels: [0, 25],
	desc: 'When delivery runs out, it will not stop. It will keep working for unlimited time, but with 40% of the effect.'};	

	defaultSkillStats.cook6					={visible_at: 1270,			active_at: 1500,			name:'Sextuple Cook', levels: [0, 6],
	desc: 'Adds a mode to cook 6 times in one click.'};	
	defaultSkillStats.science				={visible_at: 1270,			active_at: 2000,		name:'Science', levels: [0, 5],
	desc: 'Apply some science to improve your starter restaurant.'};	

	defaultSkillStats.mealOfTheDay			={visible_at: 2000,			active_at: 3000,		name:'Meal of the Day', levels: [0, 5],
	desc: 'Highlights the main meal of your restaurant to give it triple income.<br> Meal consists of:<br>- main dish (not dessert or drink)<br>- dessert<br>- drink<br>(Only works for restaurants, not deliveries)<br>(Overrides Dish of the Day bonus)<br>(Can\'t get screwed by Science)'};
	defaultSkillStats.precise_science		={visible_at: 2000,			active_at: 4000,		name:'Precise Science', levels: [0, 50],
	desc: 'Science will no longer be random.'};
	defaultSkillStats.advanced_coupon_supercook	={visible_at: 2000,			active_at: 4000,		name:'Advanced <span class="em">🔖</span> Supercook', levels: [0, 50],
	desc: 'Your <span class="em">🔖</span> <b>Coupon</b> Supercooks and Megacooks will now <i>always</i> cook at least one stack of the first dish in your restaurant.<br> (You can temporarily put whatever you want in that slot - the first slot of Meal of the Day.)'};

	defaultSkillStats.novelty				={visible_at: 4000,			active_at: 6000,		name:'Novelty Bonus', levels: [0, 500],
	desc: 'Gain bonuses to less used food categories for the next prestige.<br><br>Change your main categories every prestige to get bigger bonus.<br><br> More on Info/Restaurant tab.<br><br>(Only works for restaurants, not deliveries)'};
	defaultSkillStats.tier4perks			={visible_at: 4000,			active_at: 8000,		name:'Tier 4 Perks', levels: [0, 50],
	desc: 'Gain access to Tier 4 Perks.'};

	defaultSkillStats.tier4food				={visible_at: 8000,			active_at: 12000,		name:'Tier 4 Dishes', levels: [0, 500],
	desc: 'Gain access to Tier 4 dishes.'};
	defaultSkillStats.tier4delivery			={visible_at: 8000,			active_at: 16000,		name:'Tier 4 Deliveries', levels: [0, 500],
	desc: 'Gain access to Tier 4 dishes in deliveries.'};

	defaultSkillStats.tier4buff				={visible_at: 16000,		active_at: 24000,		name:'Tier 4 Boost', levels: [0, 500],
	desc: 'Gain access to Tier 4 boost. <br> Fortune paper every 25 Supercooks for money.'};
	defaultSkillStats.fasterCoupons			={visible_at: 16000,		active_at: 32000,		name:'Faster Coupons', levels: [0, 1000],
	desc: 'Halve the amount of time for getting a coupon.<br>'};
	
	defaultSkillStats.tier100perks			={visible_at: 32000,			active_at: 64000,		name:'Tier 100 Perks', levels: [0, 10000],
	desc: 'Gain access to Tier 5-100 Perks, but only the ones that give a percentage bonus to income.'};
	
	const defaultPerkStats = {};
	defaultPerkStats.disc1 		={prerequisite: '', name: '<span class="em">🚫</span><span class="ppd"> +2</span><br> Discontinue<br> Dish',	
									desc: 'Gain <b>2</b> Discontinue Tokens to stop cooking a certain dish (used on the Info tab).', 
									target: '', effect: 2};
	defaultPerkStats.disc2 		={prerequisite: 'disc1', name: '<span class="em">🚫</span><span class="ppd"> +2</span><br> Discontinue<br> Dish 2',	
									desc: 'Gain <b>2</b> Discontinue Tokens to stop cooking a certain dish (used on the Info tab).',
									target: '', effect: 2};
	defaultPerkStats.disc3 		={prerequisite: 'disc2', name: '<span class="em">🚫</span><span class="ppd"> +3</span><br> Discontinue<br> Dish 3',	
									desc: 'Gain <b>3</b> Discontinue Tokens to stop cooking a certain dish (used on the Info tab).', 
									target: '', effect: 3};
	defaultPerkStats.disc4 		={prerequisite: 'disc3', name: '<span class="em">🚫</span><span class="ppd"> +3</span><br> Discontinue<br> Dish 4',	
									desc: 'Gain <b>3</b> Discontinue Tokens to stop cooking a certain dish (used on the Info tab).', 
									target: '', effect: 3};										
									
	defaultPerkStats.allFood1 	={prerequisite: '',			name: '<span class="em">🍲</span><span class="ppd"> +5%</span><br> All Dishes<br> Mastery',	desc: 'Gain <b>+5%</b> to all dishes income.', 
									target: 'all', effect: 5};
	defaultPerkStats.allFood2 	={prerequisite: 'allFood1', name: '<span class="em">🍲</span><span class="ppd"> +10%</span><br> All Dishes<br> Mastery 2',desc: 'Gain <b>+10%</b> to all dishes income.', 
									target: 'all', effect: 10};
	defaultPerkStats.allFood3 	={prerequisite: 'allFood2', name: '<span class="em">🍲</span><span class="ppd"> +25%</span><br> All Dishes<br> Mastery 3',desc: 'Gain <b>+25%</b> to all dishes income.', 
									target: 'all', effect: 25};	
	defaultPerkStats.allFood4 	={prerequisite: 'allFood3', name: '<span class="em">🍲</span><span class="ppd"> +40%</span><br> All Dishes<br> Mastery 4',desc: 'Gain <b>+40%</b> to all dishes income.', 
									target: 'all', effect: 40};
	
	for (let iPerks = 5; iPerks <= 100; iPerks++) {
		let perkAllFoodEffect = 40 + ((iPerks - 4)*15);
		let perkAllFoodEffectString = '<span class="ppd"> +'+perkAllFoodEffect+'%</span><br>';
		let perkEffect = 75 + ((iPerks - 4)*25);
		let perkEffectString = '<span class="ppd"> +'+perkEffect+'%</span><br>';
		
		defaultPerkStats['allFood' + iPerks] = 
								{prerequisite: 'allFood'+(iPerks-1), name: '<span class="em">🍲</span>'+perkAllFoodEffectString+' All Dishes<br> Mastery '+iPerks,desc: 'Gain <b>+'+perkAllFoodEffect+'%</b> to all dishes income.', 
									target: 'all', effect: perkAllFoodEffect};
		defaultPerkStats['meat' + iPerks] = 
								{prerequisite: 'meat'+(iPerks-1), name: '<span class="em">🍖</span>'+perkEffectString+' Meat<br> Mastery '+iPerks,desc: 'Gain <b>+'+perkEffect+'%</b> to meat dishes income.', 
									target: 'meat', effect: perkEffect};
		defaultPerkStats['vegan' + iPerks] = 
								{prerequisite: 'vegan'+(iPerks-1), name: '<span class="em">🌿</span>'+perkEffectString+' Vegan<br> Mastery '+iPerks,desc: 'Gain <b>+'+perkEffect+'%</b> to vegan dishes income.', 
									target: 'vegan', effect: perkEffect};
		defaultPerkStats['seafood' + iPerks] = 
								{prerequisite: 'seafood'+(iPerks-1), name: '<span class="em">🐟</span>'+perkEffectString+' Seafood<br> Mastery '+iPerks,desc: 'Gain <b>+'+perkEffect+'%</b> to seafood dishes income.', 
									target: 'seafood', effect: perkEffect};
		defaultPerkStats['fastfood' + iPerks] = 
								{prerequisite: 'fastfood'+(iPerks-1), name: '<span class="em">🍔</span>'+perkEffectString+' Fastfood<br> Mastery '+iPerks,desc: 'Gain <b>+'+perkEffect+'%</b> to fastfood dishes income.', 
									target: 'fastfood', effect: perkEffect};
		defaultPerkStats['dessert' + iPerks] = 
								{prerequisite: 'dessert'+(iPerks-1), name: '<span class="em">🍰</span>'+perkEffectString+' Dessert<br> Mastery '+iPerks,desc: 'Gain <b>+'+perkEffect+'%</b> to dessert dishes income.', 
									target: 'dessert', effect: perkEffect};
		defaultPerkStats['cheap' + iPerks] = 
								{prerequisite: 'cheap'+(iPerks-1), name: '<span class="em">💵</span>'+perkEffectString+' Cheap<br> Mastery '+iPerks,desc: 'Gain <b>+'+perkEffect+'%</b> to cheap dishes income.', 
									target: 'cheap', effect: perkEffect};
		defaultPerkStats['premium' + iPerks] = 
								{prerequisite: 'premium'+(iPerks-1), name: '<span class="em">💳</span>'+perkEffectString+' Premium<br> Mastery '+iPerks,desc: 'Gain <b>+'+perkEffect+'%</b> to premium dishes income.', 
									target: 'premium', effect: perkEffect};
		defaultPerkStats['drink' + iPerks] = 
								{prerequisite: 'drink'+(iPerks-1), name: '<span class="em">🍸</span>'+perkEffectString+' Drink<br> Mastery '+iPerks,desc: 'Gain <b>+'+perkEffect+'%</b> to drinks income.', 
									target: 'drink', effect: perkEffect};				
	}
									
	defaultPerkStats.meat1 		={prerequisite: '',			name: '<span class="em">🍖</span><span class="ppd"> +10%</span><br> Meat<br> Mastery',		desc: 'Gain <b>+10%</b> to meat dishes income.', 
									target: 'meat', effect: 10};
	defaultPerkStats.meat2 		={prerequisite: 'meat1',	name: '<span class="em">🍖</span><span class="ppd"> +25%</span><br> Meat<br> Mastery 2',		desc: 'Gain <b>+25%</b> to meat dishes income.', 
									target: 'meat', effect: 25};
	defaultPerkStats.meat3 		={prerequisite: 'meat2',	name: '<span class="em">🍖</span><span class="ppd"> +50%</span><br> Meat<br> Mastery 3',		desc: 'Gain <b>+50%</b> to meat dishes income.', 
									target: 'meat', effect: 50};
	defaultPerkStats.meat4 		={prerequisite: 'meat3',	name: '<span class="em">🍖</span><span class="ppd"> +75%</span><br> Meat<br> Mastery 4',		desc: 'Gain <b>+75%</b> to meat dishes income.', 
									target: 'meat', effect: 75};
									
	defaultPerkStats.vegan1 	={prerequisite: '',			name: '<span class="em">🌿</span><span class="ppd"> +10%</span><br> Vegan<br> Mastery',		desc: 'Gain <b>+10%</b> to vegan dishes income.', 
									target: 'vegan', effect: 10};                 
	defaultPerkStats.vegan2 	={prerequisite: 'vegan1',	name: '<span class="em">🌿</span><span class="ppd"> +25%</span><br> Vegan<br> Mastery 2',		desc: 'Gain <b>+25%</b> to vegan dishes income.', 
									target: 'vegan', effect: 25};                 
	defaultPerkStats.vegan3 	={prerequisite: 'vegan2',	name: '<span class="em">🌿</span><span class="ppd"> +50%</span><br> Vegan<br> Mastery 3',		desc: 'Gain <b>+50%</b> to vegan dishes income.', 
									target: 'vegan', effect: 50};                 
	defaultPerkStats.vegan4 	={prerequisite: 'vegan3',	name: '<span class="em">🌿</span><span class="ppd"> +75%</span><br> Vegan<br> Mastery 4',		desc: 'Gain <b>+75%</b> to vegan dishes income.', 
									target: 'vegan', effect: 75};								
									
	defaultPerkStats.seafood1 	={prerequisite: '',			name: '<span class="em">🐟</span><span class="ppd"> +10%</span><br> Seafood<br> Mastery',		desc: 'Gain <b>+10%</b> to seafood dishes income.', 
									target: 'seafood', effect: 10};               
	defaultPerkStats.seafood2 	={prerequisite: 'seafood1',	name: '<span class="em">🐟</span><span class="ppd"> +25%</span><br> Seafood<br> Mastery 2',desc: 'Gain <b>+25%</b> to seafood dishes income.', 
									target: 'seafood', effect: 25};               
	defaultPerkStats.seafood3 	={prerequisite: 'seafood2',	name: '<span class="em">🐟</span><span class="ppd"> +50%</span><br> Seafood<br> Mastery 3',desc: 'Gain <b>+50%</b> to seafood dishes income.', 
									target: 'seafood', effect: 50};               
	defaultPerkStats.seafood4 	={prerequisite: 'seafood3', name: '<span class="em">🐟</span><span class="ppd"> +75%</span><br> Seafood<br> Mastery 4',desc: 'Gain <b>+75%</b> to seafood dishes income.', 
									target: 'seafood', effect: 75};								
									
	defaultPerkStats.fastfood1 	={prerequisite: '',			name: '<span class="em">🍔</span><span class="ppd"> +10%</span><br> Fastfood<br> Mastery',desc: 'Gain <b>+10%</b> to fastfood dishes income.', 
									target: 'fastfood', effect: 10};              
	defaultPerkStats.fastfood2 	={prerequisite: 'fastfood1',name: '<span class="em">🍔</span><span class="ppd"> +25%</span><br> Fastfood<br> Mastery 2',	desc: 'Gain <b>+25%</b> to fastfood dishes income.', 
									target: 'fastfood', effect: 25};              
	defaultPerkStats.fastfood3 	={prerequisite: 'fastfood2',name: '<span class="em">🍔</span><span class="ppd"> +50%</span><br> Fastfood<br> Mastery 3',	desc: 'Gain <b>+50%</b> to fastfood dishes income.', 
									target: 'fastfood', effect: 50};              
	defaultPerkStats.fastfood4 	={prerequisite: 'fastfood3',name: '<span class="em">🍔</span><span class="ppd"> +75%</span><br> Fastfood<br> Mastery 4',	desc: 'Gain <b>+75%</b> to fastfood dishes income.', 
									target: 'fastfood', effect: 75};								
									
	defaultPerkStats.dessert1 	={prerequisite: '',			name: '<span class="em">🍰</span><span class="ppd"> +10%</span><br> Dessert<br> Mastery',	desc: 'Gain <b>+10%</b> to dessert dishes income.', 
									target: 'dessert', effect: 10};               
	defaultPerkStats.dessert2 	={prerequisite: 'dessert1',	name: '<span class="em">🍰</span><span class="ppd"> +25%</span><br> Dessert<br> Mastery 2',desc: 'Gain <b>+25%</b> to dessert dishes income.', 
									target: 'dessert', effect: 25};               
	defaultPerkStats.dessert3 	={prerequisite: 'dessert2',	name: '<span class="em">🍰</span><span class="ppd"> +50%</span><br> Dessert<br> Mastery 3',desc: 'Gain <b>+50%</b> to dessert dishes income.', 
									target: 'dessert', effect: 50};	              
	defaultPerkStats.dessert4 	={prerequisite: 'dessert3', name: '<span class="em">🍰</span><span class="ppd"> +75%</span><br> Dessert<br> Mastery 4',desc: 'Gain <b>+75%</b> to dessert dishes income.', 
									target: 'dessert', effect: 75};									
									
	defaultPerkStats.cheap1 	={prerequisite: '',			name: '<span class="em">💵</span><span class="ppd"> +10%</span><br> Cheap<br> Mastery',		desc: 'Gain <b>+10%</b> to cheap dishes income.', 
									target: 'cheap', effect: 10};                 
	defaultPerkStats.cheap2 	={prerequisite: 'cheap1',	name: '<span class="em">💵</span><span class="ppd"> +25%</span><br> Cheap<br> Mastery 2',		desc: 'Gain <b>+25%</b> to cheap dishes income.', 
									target: 'cheap', effect: 25};                 
	defaultPerkStats.cheap3 	={prerequisite: 'cheap2',	name: '<span class="em">💵</span><span class="ppd"> +50%</span><br> Cheap<br> Mastery 3',		desc: 'Gain <b>+50%</b> to cheap dishes income.', 
									target: 'cheap', effect: 50};                 
	defaultPerkStats.cheap4 	={prerequisite: 'cheap3',	name: '<span class="em">💵</span><span class="ppd"> +75%</span><br> Cheap<br> Mastery 4',	desc: 'Gain <b>+75%</b> to cheap dishes income.', 
									target: 'cheap', effect: 75};								
									
	defaultPerkStats.premium1 	={prerequisite: '',			name: '<span class="em">💳</span><span class="ppd"> +10%</span><br> Premium<br> Mastery',	desc: 'Gain <b>+10%</b> to premium dishes income.', 
									target: 'premium', effect: 10};               
	defaultPerkStats.premium2 	={prerequisite: 'premium1',	name: '<span class="em">💳</span><span class="ppd"> +25%</span><br> Premium<br> Mastery 2',desc: 'Gain <b>+25%</b> to premium dishes income.', 
									target: 'premium', effect: 25};               
	defaultPerkStats.premium3 	={prerequisite: 'premium2',	name: '<span class="em">💳</span><span class="ppd"> +50%</span><br> Premium<br> Mastery 3',desc: 'Gain <b>+50%</b> to premium dishes income.', 
									target: 'premium', effect: 50};               
	defaultPerkStats.premium4 	={prerequisite: 'premium3', name: '<span class="em">💳</span><span class="ppd"> +75%</span><br> Premium<br> Mastery 4',desc: 'Gain <b>+75%</b> to premium dishes income.', 
									target: 'premium', effect: 75};								
									
	defaultPerkStats.drink1 	={prerequisite: '',			name: '<span class="em">🍸</span><span class="ppd"> +10%</span><br> Drink<br> Mastery',		desc: 'Gain <b>+10%</b> to drinks income.', 
									target: 'drink', effect: 10};                 
	defaultPerkStats.drink2 	={prerequisite: 'drink1',	name: '<span class="em">🍸</span><span class="ppd"> +25%</span><br> Drink<br> Mastery 2',		desc: 'Gain <b>+25%</b> to drinks income.', 
									target: 'drink', effect: 25};                 
	defaultPerkStats.drink3 	={prerequisite: 'drink2',	name: '<span class="em">🍸</span><span class="ppd"> +50%</span><br> Drink<br> Mastery 3',		desc: 'Gain <b>+50%</b> to drinks income.', 
									target: 'drink', effect: 50};                 
	defaultPerkStats.drink4 	={prerequisite: 'drink3',	name: '<span class="em">🍸</span><span class="ppd"> +75%</span><br> Drink<br> Mastery 4',		desc: 'Gain <b>+75%</b> to drinks income.', 
									target: 'drink', effect: 75};								
									
	defaultPerkStats.delivery1 	={prerequisite: '',			 name: '<span class="em">🚚</span><span class="ppd"> +2</span><br> Delivery<br> Mastery',	desc: 'Gain <b>+2 roll</b> to deliveries.', 
									target: '', effect: 2};                        
	defaultPerkStats.delivery2 	={prerequisite: 'delivery1', name: '<span class="em">🚚</span><span class="ppd"> +4</span><br> Delivery<br> Mastery 2',desc: 'Gain <b>+4 rolls</b> to deliveries.', 
									target: '', effect: 2};                        
	defaultPerkStats.delivery3 	={prerequisite: 'delivery2', name: '<span class="em">🚚</span><span class="ppd"> +6</span><br> Delivery<br> Mastery 3',desc: 'Gain <b>+6 rolls</b> to deliveries.',
									target: '', effect: 2};                        
	defaultPerkStats.delivery4 	={prerequisite: 'delivery3', name: '<span class="em">🚚</span><span class="ppd"> +8</span><br> Delivery<br> Mastery 4',desc: 'Gain <b>+8 rolls</b> to deliveries.',
									target: '', effect: 2};								
	const defaultFoodStats = {};

	// Tier 1 (3x every class)	12+1
	defaultFoodStats.banana_sandwich		={class_a:'vegan',			class_b:'dessert',		baseIncome: 1,	tier: 1};//+
	defaultFoodStats.chicken_nuggets		={class_a:'meat',			class_b:'fastfood',		baseIncome: 1,	tier: 1};//+		
	defaultFoodStats.coffee					={class_a:'drink',			class_b:'premium',		baseIncome: 1,	tier: 1};//+	
	defaultFoodStats.cupcake				={class_a:'dessert',		class_b:'premium',		baseIncome: 1,	tier: 1};//+	
	defaultFoodStats.eggs_and_bacon			={class_a:'meat',			class_b:'cheap',		baseIncome: 1,	tier: 1};//+
	defaultFoodStats.french_fries			={class_a:'vegan',			class_b:'fastfood',		baseIncome: 1,	tier: 1};//+	
	defaultFoodStats.hamburger				={class_a:'meat',			class_b:'fastfood',		baseIncome: 1,	tier: 1};//+
	defaultFoodStats.local_soda				={class_a:'drink',			class_b:'cheap',		baseIncome: 1,	tier: 1};//+
	defaultFoodStats.rice_ball				={class_a:'vegan',			class_b:'seafood',		baseIncome: 1,	tier: 1};//+
	defaultFoodStats.shrimp_tartlet			={class_a:'seafood',		class_b:'premium',		baseIncome: 1,	tier: 1};//+	
	defaultFoodStats.sushi_rolls			={class_a:'seafood',		class_b:'cheap',		baseIncome: 1,	tier: 1};//+
	defaultFoodStats.yoghurt				={class_a:'drink',			class_b:'dessert',		baseIncome: 1,	tier: 1};//+
	
	defaultFoodStats.exotic_flavors			={class_a:'buff',			class_b:'buff',			baseIncome: 1,	tier: 1};//+

	// Tier 2 21+1
	defaultFoodStats.beer					={class_a:'drink',			class_b:'cheap',		baseIncome:2,	tier: 2};//+
	defaultFoodStats.cake_roll				={class_a:'dessert',		class_b:'premium',		baseIncome:2,	tier: 2};//+
	defaultFoodStats.crab					={class_a:'seafood',		class_b:'premium',		baseIncome:2,	tier: 2};//+
	defaultFoodStats.croissant				={class_a:'dessert',		class_b:'premium',		baseIncome:2,	tier: 2};//+
	defaultFoodStats.cucumber_sandwich		={class_a:'vegan',			class_b:'fastfood',		baseIncome:2,	tier: 2};//+	
	defaultFoodStats.fish_soup				={class_a:'seafood',		class_b:'cheap',		baseIncome:2,	tier: 2};//+	
	defaultFoodStats.fried_fish				={class_a:'seafood',		class_b:'premium',		baseIncome:2,	tier: 2};//+
	defaultFoodStats.hotdog					={class_a:'meat',			class_b:'fastfood',		baseIncome:2,	tier: 2};//+
	defaultFoodStats.icecream				={class_a:'dessert',		class_b:'cheap',		baseIncome:2,	tier: 2};//+		
	defaultFoodStats.lime_cocktail			={class_a:'drink',			class_b:'premium',		baseIncome:2,	tier: 2};//+
	defaultFoodStats.mixed_nuts				={class_a:'vegan',			class_b:'premium',		baseIncome:2,	tier: 2};//+
	defaultFoodStats.mojito					={class_a:'drink',			class_b:'cheap',		baseIncome:2,	tier: 2};//+	
	defaultFoodStats.popcorn				={class_a:'vegan',			class_b:'cheap',		baseIncome:2,	tier: 2};//+
	defaultFoodStats.poultry_legs			={class_a:'meat',			class_b:'fastfood',		baseIncome:2,	tier: 2};//+
	defaultFoodStats.sandwich				={class_a:'meat',			class_b:'fastfood',		baseIncome:2,	tier: 2};//+	
	defaultFoodStats.seasoned_fish			={class_a:'seafood',		class_b:'cheap',		baseIncome:2,	tier: 2};//+
	defaultFoodStats.steak					={class_a:'meat',			class_b:'premium',		baseIncome:2,	tier: 2};//+	
	defaultFoodStats.taco					={class_a:'meat',			class_b:'cheap',		baseIncome:2,	tier: 2};//+	
	defaultFoodStats.tea					={class_a:'drink',			class_b:'cheap',		baseIncome:2,	tier: 2};//+	
	defaultFoodStats.vegan_cupcake			={class_a:'vegan',			class_b:'dessert',		baseIncome:2,	tier: 2};//+
	defaultFoodStats.wine					={class_a:'drink',			class_b:'premium',		baseIncome:2,	tier: 2};//+

	defaultFoodStats.food_decoration		={class_a:'buff',			class_b:'buff',			baseIncome:2,	tier: 2};//+


	// Tier 3  22+1
	defaultFoodStats.caramel_apples			={class_a:'vegan',			class_b:'dessert',		baseIncome:4,	tier: 3};//+
	defaultFoodStats.coconut_cocktail		={class_a:'drink',			class_b:'dessert',		baseIncome:4,	tier: 3};//+
	defaultFoodStats.cotton_candy			={class_a:'dessert',		class_b:'cheap',		baseIncome:4,	tier: 3};//+	
	defaultFoodStats.doughnut				={class_a:'dessert',		class_b:'fastfood',		baseIncome:4,	tier: 3};//+
	defaultFoodStats.egg_sandwich			={class_a:'fastfood',		class_b:'cheap',		baseIncome:4,	tier: 3};//+
	defaultFoodStats.fish_bagel				={class_a:'seafood',		class_b:'cheap',		baseIncome:4,	tier: 3};//+		
	defaultFoodStats.fusion_soup			={class_a:'meat',			class_b:'seafood',		baseIncome:4,	tier: 3};//+
	defaultFoodStats.juice					={class_a:'drink',			class_b:'vegan',		baseIncome:4,	tier: 3};//+	
	defaultFoodStats.martini				={class_a:'drink',			class_b:'premium',		baseIncome:4,	tier: 3};//+
	defaultFoodStats.meat_skewer			={class_a:'meat',			class_b:'cheap',		baseIncome:4,	tier: 3};//+
	defaultFoodStats.milkshake				={class_a:'drink',			class_b:'fastfood',		baseIncome:4,	tier: 3};//+
	defaultFoodStats.onion_rings			={class_a:'vegan',			class_b:'fastfood',		baseIncome:4,	tier: 3};//+	
	defaultFoodStats.oysters				={class_a:'seafood',		class_b:'premium',		baseIncome:4,	tier: 3};//+	
	defaultFoodStats.pizza					={class_a:'meat',			class_b:'fastfood',		baseIncome:4,	tier: 3};//+
	defaultFoodStats.roasted_chicken		={class_a:'meat',			class_b:'premium',		baseIncome:4,	tier: 3};//+
	defaultFoodStats.salad					={class_a:'vegan',			class_b:'cheap',		baseIncome:4,	tier: 3};//+	
	defaultFoodStats.sausages				={class_a:'meat',			class_b:'cheap',		baseIncome:4,	tier: 3};//+
	defaultFoodStats.shortcake				={class_a:'dessert',		class_b:'premium',		baseIncome:4,	tier: 3};//+	
	defaultFoodStats.shrimps_n_chips		={class_a:'seafood',		class_b:'fastfood',		baseIncome:4,	tier: 3};//+	
	defaultFoodStats.sparkling_water		={class_a:'drink',			class_b:'cheap',		baseIncome:4,	tier: 3};//+		
	defaultFoodStats.taiyaki				={class_a:'seafood',		class_b:'dessert',		baseIncome:4,	tier: 3};//+	
	defaultFoodStats.vegan_pizza			={class_a:'vegan',			class_b:'premium',		baseIncome:4,	tier: 3};//+

	defaultFoodStats.original_idea			={class_a:'buff',			class_b:'buff',			baseIncome:4,	tier: 3};//+
	
	// Tier 4 34+1
	defaultFoodStats.assorted_macarons		={class_a:'dessert',		class_b:'premium',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.blueberry_yoghurt		={class_a:'drink',			class_b:'dessert',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.cherry_milkshake		={class_a:'drink',			class_b:'fastfood',		baseIncome:8,	tier: 4};//+	
	defaultFoodStats.coconut_sweet_soup		={class_a:'vegan',			class_b:'dessert',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.cookies				={class_a:'dessert',		class_b:'cheap',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.cured_salmon			={class_a:'seafood',		class_b:'cheap',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.corndogs				={class_a:'meat',			class_b:'fastfood',		baseIncome:8,	tier: 4};//+	
	defaultFoodStats.dumplings				={class_a:'meat',			class_b:'cheap',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.fruit_salad			={class_a:'vegan',			class_b:'dessert',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.fish_sticks			={class_a:'seafood',		class_b:'fastfood',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.grits					={class_a:'vegan',			class_b:'cheap',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.hot_chocolate			={class_a:'drink',			class_b:'dessert',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.hot_pot				={class_a:'meat',			class_b:'seafood',		baseIncome:8,	tier: 4};//+	
	defaultFoodStats.khachapuri				={class_a:'fastfood',		class_b:'cheap',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.leg_ham				={class_a:'meat',			class_b:'premium',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.lemonade				={class_a:'drink',			class_b:'cheap',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.lobster				={class_a:'seafood',		class_b:'premium',		baseIncome:8,	tier: 4};//+	
	defaultFoodStats.mate_tea				={class_a:'drink',			class_b:'premium',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.noodles				={class_a:'vegan',			class_b:'cheap',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.orange_juice			={class_a:'drink',			class_b:'vegan',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.pancakes				={class_a:'dessert',		class_b:'cheap',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.pasta_salad			={class_a:'vegan',			class_b:'premium',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.pork_chops				={class_a:'meat',			class_b:'premium',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.pyttipanna				={class_a:'meat',			class_b:'cheap',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.pureed_veggie_soup		={class_a:'vegan',			class_b:'premium',		baseIncome:8,	tier: 4};//+	
	defaultFoodStats.salmon_soup			={class_a:'seafood',		class_b:'cheap',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.sausage_and_potatoes	={class_a:'meat',			class_b:'fastfood',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.shrimp_pizza			={class_a:'seafood',		class_b:'fastfood',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.skewer_set				={class_a:'meat',			class_b:'seafood',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.takeaway_coffee		={class_a:'drink',			class_b:'fastfood',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.tropical_cocktail		={class_a:'drink',			class_b:'premium',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.udon					={class_a:'seafood',		class_b:'premium',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.veggie_wrap			={class_a:'vegan',			class_b:'fastfood',		baseIncome:8,	tier: 4};//+
	defaultFoodStats.waffles				={class_a:'dessert',		class_b:'premium',		baseIncome:8,	tier: 4};//+
	
	defaultFoodStats.fortune_paper			={class_a:'buff',			class_b:'buff',			baseIncome:8,	tier: 4};//+
		
	defaultFoodStats.rice_with_veggies		={class_a:'vegan',			class_b:'cheap',		baseIncome:9,	tier: 4};//+
	defaultFoodStats.assorted_macaroons		={class_a:'dessert',		class_b:'premium',		baseIncome:9,	tier: 4};//+
	
	const regionsStats = {};
	const REGIONS_NUM = 10;
	
		
	regionsStats[0] = {}; 
	regionsStats[1] = { //(64k - 256k)
		name: 'Region 1/'+REGIONS_NUM+' - First Journey',
		desc: 'Quests are optional and can be done in any order.<br> Once a quest is done, it will stay done, even after prestige.',		
		challenges: ['R1_19_Drink', 'R1_21_Fastfood', 'R1_23_Dessert']
	};
	regionsStats[2] = { //(256k - 2M)
		name: 'Region 2/'+REGIONS_NUM+' - Halloween Land',
		desc: '⚠️ All food here looks <b style="color: #2cc32c;">spooky</b>. ⚠️',
		challenges: ['R2_MOTD', 'R2_17_Dishes', 'R2_10_Spiced']
		//shrimp_tartlet, banana_sandwich, coffee 
	};
	regionsStats[3] = { //(2M - 16M)
		name: 'Region 3/'+REGIONS_NUM+' - No-seafood Land',
		desc: '<b class="category_circle" style="color:#5050ff">●</b> Seafood category bonus in this region is 0.',
		challenges: ['R3_CheckWord_Restaurant', 'R3_CheckWord_Idle']
	};	
	regionsStats[4] = { //(16M - 128M)
		name: 'Region 4/'+REGIONS_NUM+' - Underwater Land',
		desc: '<b>Tier 3</b> food now gives the best income (doesn\'t affect deliveries). <br><b class="category_circle" style="color:#00e7ff">●</b> Drink category bonus in this region is 0 (but other drink bonuses remain).',
		challenges: ['R4_8_1_Alphabetical_Categories'] 
	};
	regionsStats[5] = { //(128M - 1B)
		name: 'Region 5/'+REGIONS_NUM+' - Diet Land',
		desc: '<b class="category_circle" style="color:#ffd000">●</b> Fastfood and <b class="category_circle" style="color:#e7b2e0">●</b> Dessert category bonuses in this region are 0.',
		challenges: ['R5_Riddle_Glass', 'R5_Assorti_Fastfood'] 
	}; 
	regionsStats[6] = { //(1B - 8B)
		name: 'Region 6/'+REGIONS_NUM+' - Ice Land',
		desc: 'All food looks <b style="color: #0f69d9;">frozen</b>.<br> All restaurants should have <b>at least</b> 3 dishes of every category to have income.',
		challenges: ['R6_Assorti_Dessert', 'R6_Left_Choice']
	};
	regionsStats[7] = { //(8B - 64B)
		name: 'Region 7/'+REGIONS_NUM+' - Paradox Land',
		desc: '<b class="category_circle" style="color:#5ab55a">●</b> Vegan and <b class="category_circle" style="color:#f00">●</b> Meat category bonuses in this region are 0.',
		challenges: ['R7_Riddle_Cardboard_Plastic', 'R7_MOTD'] // R7_10k
	};
	regionsStats[8] = { //(64B - 512B)
		name: 'Region 8/'+REGIONS_NUM+' - Wallet Land',
		desc: '<b>Tier 2</b> food now gives the best income (doesn\'t affect deliveries).<br> <b class="category_circle" style="color:#a8ee96">●</b> Premium and <b class="category_circle" style="color:#dadada">●</b> Cheap category bonuses in this region are 0.',
		challenges: ['R8_MOTD', 'R8_No_Restaurant']
	};
	regionsStats[9] = { //(64B - 512B)
		name: 'Region 9/'+REGIONS_NUM+' - Sweet Land',
		desc: 'All food looks <b style="color:#e320d4">sweet</b>.<br> All restaurants should have at least 10 <b class="category_circle" style="color:#e7b2e0">●</b> Desserts to have income.',//
		challenges: ['R9_Assorti_Drink', 'R9_No_Coupons']
	};
	regionsStats[10] = { //(64B - 512B)
		name: 'Region 10/'+REGIONS_NUM+' - Final Boss Land',
		desc: '<b>Tier 1</b> food now gives the best income (doesn\'t affect deliveries).<br> All categories should have an <b>odd number</b> of dishes to have income.',
		challenges: ['R10_No_Tierup'] 
	};	
		
	const challengeStats = {};
	challengeStats.R1_19_Drink = [20, 'giftboxes'];
	challengeStats.R1_21_Fastfood = ['biggerDeliveries1', 'skill'];
	challengeStats.R1_23_Dessert = [10, 'gems'];
	
	challengeStats.R2_MOTD = [30, 'coupons'];
	challengeStats.R2_17_Dishes = [20, 'giftboxes'];
	challengeStats.R2_10_Spiced = [10, 'gems'];
	
	challengeStats.R3_CheckWord_Restaurant = [30, 'coupons'];
	challengeStats.R3_CheckWord_Idle = [10, 'gems'];
	
	challengeStats.R4_8_1_Alphabetical_Categories = [20, 'gems'];
	
	challengeStats.R5_Riddle_Glass = [30, 'coupons'];	
	challengeStats.R5_Assorti_Fastfood = [10, 'gems'];
	
	challengeStats.R6_Assorti_Dessert = [30, 'giftboxes'];	
	challengeStats.R6_Left_Choice = [10, 'gems'];
	
	challengeStats.R7_Riddle_Cardboard_Plastic = ['maxLevel11', 'skill'];;
	challengeStats.R7_MOTD = [10, 'gems'];
	
	challengeStats.R8_MOTD = [40, 'coupons'];
	challengeStats.R8_No_Restaurant = [10, 'gems'];
	
	challengeStats.R9_No_Coupons = [50, 'giftboxes'];
	challengeStats.R9_Assorti_Drink = [10, 'gems'];
	
	challengeStats.R10_No_Tierup = [20, 'gems'];

	challengeStats.R50_CheckPuzzleOuter = ['biggestDeliveries1', 'skill'];
	challengeStats.R70_CheckPuzzleOuter = ['maxLevel12', 'skill'];
		
	
	for (let prop in defaultFoodStats) {
		if ((defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].class_a != 'buff')) {
			if ( (defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].baseIncome == 1) ) {
				v.activeFood.push(prop);
				v.deliveryFood.push(prop);
			}
			if ( (defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].baseIncome == 2) ) {
				if (v.region > 0) {
					v.activeFood.push(prop);
				} else {
					v.newFood.push(prop);
				}
			}
			if ( (defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].baseIncome == 4) && (v.skills.tier3food >= 1) ) {
				if (v.region > 0) {
					v.activeFood.push(prop);
				} else {
					v.newFood.push(prop);
				}
			}
			if ( (defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].baseIncome == 8) && (v.skills.tier4food >= 1) ) {
				if (v.region > 0) {
					v.activeFood.push(prop);
				} else {
					v.newFood.push(prop);
				}
			}
		}	
	}
	
	let style = '<style>';

	const colors = {
					meat: '#f00',
					vegan: '#5ab55a',
					seafood: '#5050ff',
					fastfood: '#ffd000',
					dessert: '#e7b2e0',
					cheap: '#dadada',
					premium: '#a8ee96',
					drink: '#00e7ff',
					buff: 'rgba(0,0,0,0)',
				};	
	$.each(colors, function( key1, value1 ) {
		style += '.deliveryitem .theme1.'+key1+' { border: 3px solid '+value1+'; background: '+value1+';} \r\n';
		style += '.deliveryitem .theme2.'+key1+' { border: 3px solid '+value1+'; background: '+value1+';} \r\n';
	});	
	let science_select = '<select id="science_select">';
	science_select += '<option name="meat" value="meat">🍖Meat</option>';
	science_select += '<option name="vegan" value="vegan">🌿Vegan</option>';
	science_select += '<option name="seafood" value="seafood">🐟Seafood</option>';
	science_select += '<option name="fastfood" value="fastfood">🍔Fastfood</option>';
	science_select += '<option name="dessert" value="dessert">🍰Dessert</option>';
	science_select += '<option name="cheap" value="cheap">💵Cheap</option>';
	science_select += '<option name="premium" value="premium">💳Premium</option>';
	science_select += '<option name="drink" value="drink">🍸Drink</option>';
	science_select += '</select>';	
	
	let defaultCategoryBonuses = {
					meat: 0.2,
					vegan: 0.2,
					seafood: 0.2,
					fastfood: 0.2,
					dessert: 0.2,
					cheap: 0.15,
					premium: 0.2,
					drink: 0.15
				};
	v.categoryBonuses = JSON.parse(JSON.stringify(defaultCategoryBonuses));//clone
	
	let preloadImages = '<div id="preload_images">';
	$.each(defaultFoodStats, function( key1, value1 ) {
		style += '.fooditem[data-type="'+key1+'"]  { background: url("img/food/'+key1+'.png") no-repeat center; } \r\n';
		
		style += '.fooditem[data-type="'+key1+'"]::after  { content: ""; border-radius: 5px; border: 3px solid '+ colors[value1.class_a] +' ; background: '+colors[value1.class_a]+'; } \r\n';
		style += '.fooditem[data-type="'+key1+'"]::before { content: ""; border-radius: 5px; border: 3px solid '+ colors[value1.class_b] +' ; background: '+colors[value1.class_b]+'; } \r\n';
		
		if (value1.class_a == 'fastfood') {
			style += '.spooky .fooditem[data-type="'+key1+'"]::after, .frozen .fooditem[data-type="'+key1+'"]::after, .sweet .fooditem[data-type="'+key1+'"]::after  { content: ""; border-radius: 5px; border: 3px solid #ffb300 ; background: #ffb300; } \r\n';
		}
		if (value1.class_b == 'fastfood') {
			style += '.spooky .fooditem[data-type="'+key1+'"]::before, .frozen .fooditem[data-type="'+key1+'"]::before, .sweet .fooditem[data-type="'+key1+'"]::before { content: ""; border-radius: 5px; border: 3px solid #ffb300 ; background: #ffb300; } \r\n';
		}
		
		if (value1.class_a == 'seafood') {
			style += '.frozen .fooditem[data-type="'+key1+'"]::after { content: ""; border-radius: 5px; border: 3px solid #006bff ; background: #006bff; } \r\n';
		}
		if (value1.class_b == 'seafood') {
			style += '.frozen .fooditem[data-type="'+key1+'"]::before { content: ""; border-radius: 5px; border: 3px solid #006bff ; background: #006bff; } \r\n';
		}
		
		if (value1.baseIncome == 2) {
			style += '.fooditem[data-type="'+key1+'"]  { background-color: rgb(5 255 54 / 0.1); } \r\n';
			style += '.darkMode .fooditem[data-type="'+key1+'"]  { background-color: rgb(5 255 54 / 0.15); } \r\n';
		}
		if (value1.baseIncome == 4) {
			style += '.fooditem[data-type="'+key1+'"]  { background-color: rgb(255 5 5 / 0.1); } \r\n';
			style += '.darkMode .fooditem[data-type="'+key1+'"]  { background-color: rgb(255 5 5 / 0.15); } \r\n';
		}
		if (value1.baseIncome == 8) {
			style += '.fooditem[data-type="'+key1+'"]  { background-color: rgb(38 5 255 / 0.07); } \r\n';
			style += '.darkMode .fooditem[data-type="'+key1+'"]  { background-color: rgb(38 5 255 / 0.15); } \r\n';
		}
		
		preloadImages += '<img src="img/food/'+key1+'.png">';
	});
	for (let i = 0; i < 9; i++) {
		preloadImages += '<img src="img/plates/plate_'+i+'.png">';
	}
	preloadImages += '<img src="img/plates/plate_d.png">';	
	preloadImages += '<img src="img/other/charity.png">';	
	preloadImages += '<img src="img/other/charity_dark.png">';
	preloadImages += '<img src="img/other/combine.png">';
	preloadImages += '<img src="img/other/cook.png">';

	preloadImages += '<img src="img/discord_logo_100.png">';
	preloadImages += '<img src="img/reddit_logo_100.png">';
	preloadImages += '<img src="img/kred_single.png">';

	preloadImages += '</div>';

	style += '</style>';

	//$('#loading').append($(preloadImages));
			
	let $moneyCurrent = '';
	let $moneyIncome = '';
	let $moneyCoupons = '';
	let $moneyDeliveries = '';
	let $moneyGems = '';
	let $cookTime = '';	
	let $superCookTime = '';
	let $cookCouponsTime = '';
	let $superCookCouponsTime = '';
	let $descriptionBox = '';
	let $progressbarPrestigeCover = '';
	let $progressbarPrestigeCover2 = '';
	let $progressbarPrestige2 = '';	
	let $deliveryButton = '';	
	
	let $cookButton = '';	
	let $cook2Button = '';	
	let $cook3Button = '';	
	let $cook6Button = '';		
	let $superCookButton = '';
	let $cookCouponsButton = '';	
	let $cook2CouponsButton = '';	
	let $cook3CouponsButton = '';	
	let $cook6CouponsButton = '';	
	let $superCookCouponsButton = '';
	
	let $goalsBigButton = '';	
	let $goalsSmallButton = '';
	let $perksButton = '';
	
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
					$('#loading').html('The loading is taking too long. Something went wrong? Maybe. It would be very helpful if you can look into your browser console and send error descriptions with file game.js. Ignore this if you know it\'s just problems of your internet connection.<br>');
				}				
			}, 40*1000);
			
		StartGame();		
		$('#info_tab_button_charity').on('keydown', function(e) {
			if (e.which == 76) {
				//debug1 = true;
			}			
		});
	
		if ((isMobile()) && (!kongversion)) {
			$('body').addClass('isMobile');
			$('#hard_reset').html('Hard Reset (long&nbsp;hold)');
		}
		if (true) { //switch if stuff breaks
			$('body').keydown(function( event ) {
				if (currentScreen === 'game') {
					if ( event.which == 81 ) {//[q]
						if ((gameState == 'tierup') || (gameState == 'perk')) {
							$('#new1 button').trigger('click');
							return false;
						}
						
						if (v.currentCookMode == 1) {
							$cookButton.trigger('click');
						}
						if (v.currentCookMode == 2) {
							$cook2Button.trigger('click');
						}
						if (v.currentCookMode == 3) {
							$cook3Button.trigger('click');
						}
						if (v.currentCookMode == 6) {
							$cook6Button.trigger('click');
						}
					}
					if ( event.which == 87 ) {//[w]
						if ((gameState == 'tierup') || (gameState == 'perk')) {
							$('#new2 button').trigger('click');
							return false;
						}
						
						$('#game .supercook').trigger('click');						
					}
					if ( event.which == 69 ) {//[e]						
						if ((gameState == 'tierup') || (gameState == 'perk')) {
							$('#new3 button').trigger('click');
							return false;
						}
						
						$('#game .new').trigger('click');
					}
					if ( event.which == 65 ) {//[a]
						if (v.currentCookCouponsMode == 1) {
							$cookCouponsButton.trigger('click');
						}
						if (v.currentCookCouponsMode == 2) {
							$cook2CouponsButton.trigger('click');
						}
						if (v.currentCookCouponsMode == 3) {
							$cook3CouponsButton.trigger('click');
						}
						if (v.currentCookCouponsMode == 6) {
							$cook6CouponsButton.trigger('click');
						}
					}
					if ( event.which == 83 ) {//[s]
						$('#game .supercookCoupons').trigger('click');
					}
					if ( event.which == 68 ) {//[d]
						$('#game .sortByIncome').trigger('click');
					}
					
					let kitchenTarget = '';
					if (( event.which == 49 ) || ( event.which == 97 )) {//[1]
						if ($('#kitchen .fooditem').eq(0).length > 0) {
							kitchenTarget = $('#kitchen .fooditem').eq(0);
						}
					}
					if (( event.which == 50 ) || ( event.which == 98 )) {//[2]
						if ($('#kitchen .fooditem').eq(1).length > 0) {
							kitchenTarget = $('#kitchen .fooditem').eq(1);
						}
					}
					if (( event.which == 51 ) || ( event.which == 99 )) {//[3]
						if ($('#kitchen .fooditem').eq(2).length > 0) {
							kitchenTarget = $('#kitchen .fooditem').eq(2);
						}
					}
					if (( event.which == 52 ) || ( event.which == 100 )) {//[4]
						if ($('#kitchen .fooditem').eq(3).length > 0) {
							kitchenTarget = $('#kitchen .fooditem').eq(3);
						}
					}
					if (( event.which == 53 ) || ( event.which == 101 )) {//[5]
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
									storeTarget.html('<span class="qty">'+AbbreviateNumber2(newStoreQty)+'</span>');
									storeTarget.parent().removeClass('glow_fast').addClass('glow_fast');									
									setTimeout(function() {
										storeTarget.parent().removeClass('glow_fast');										
									},600);
									if (GetLvFromQty(oldStoreQty) < GetLvFromQty(newStoreQty) ) { // if gained next breakpoint level
										if (!(storeTarget.parent().css('display') == 'none')) {
											ShowFirework(storeTarget.offset(), true);											
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
										storeTarget.attr('data-buffs', kitchenTarget.attr('data-buffs'));
										kitchenTarget.attr('data-type', '');
										kitchenTarget.attr('data-qty', 1);
										kitchenTarget.html('');
										let newStoreQty = +kitchenQty;
										
										storeTarget.attr('data-qty', newStoreQty);
										storeTarget.html('<span class="qty">'+AbbreviateNumber2(newStoreQty)+'</span>');
										storeTarget.parent().removeClass('glow_fast').addClass('glow_fast');										
										setTimeout(function() {
											storeTarget.parent().removeClass('glow_fast');											
										},600);	
										UpdateIncome();
										UpdateButtonsOnChange();
										if (v.skills['science'] >= 1) {
											UpdateThirdCategory();
										}
									}
								}
							} else { // Buff
								if (v.options.buff_autoplacement === true) {
									let storeTarget = '';									
									$('#storefront .fooditem').each( function() {
										if (kitchenTarget.attr('data-type') != '') {											
											if (($(this).attr('data-type') != '') && ($(this).attr('data-type') != undefined)) {
												storeTarget = $(this);
												
												let dropBuffs = {};
												let dragType = kitchenTarget.attr('data-type');
												let dropType = storeTarget.attr('data-type');
												
												if (storeTarget.attr('data-buffs') != '') {
													dropBuffs = JSON.parse(storeTarget.attr('data-buffs'));
												}
												
												let currentBuffQty = parseInt(dropBuffs[dragType], 10) || 0;
												let dragQty = parseInt(kitchenTarget.attr('data-qty'), 10) || 0;
												
												if (+currentBuffQty < (50 * v.skills.maxBuff)) {
													if (+currentBuffQty + +dragQty <= (50 * v.skills.maxBuff)) {
														dropBuffs[dragType] = +currentBuffQty + +dragQty;
															
														storeTarget.attr('data-buffs', JSON.stringify(sortObjectByKey(dropBuffs)));
														kitchenTarget.attr('data-type', '');
														kitchenTarget.attr('data-qty', 1);
														kitchenTarget.attr('data-buffs', '');
														kitchenTarget.html('');	
														storeTarget.parent().removeClass('glow_fast').addClass('glow_fast');
														setTimeout(function() {
															$('#default .fooditem-wrapper, #storefront .fooditem-wrapper, #kitchen .fooditem-wrapper').removeClass('glow_fast');
														},600);	
													} else { // 50 + rest
														dropBuffs[dragType] = (50 * v.skills.maxBuff);
														let restQty = dragQty - ((50 * v.skills.maxBuff) - currentBuffQty);
														storeTarget.attr('data-buffs', JSON.stringify(sortObjectByKey(dropBuffs)));
														kitchenTarget.attr('data-qty', restQty);
														kitchenTarget.attr('data-buffs', '');
														kitchenTarget.html('<span class="qty">' + AbbreviateNumber2(restQty) + '</span>');
														storeTarget.parent().removeClass('glow_fast').addClass('glow_fast');
														setTimeout(function() {
															$('#default .fooditem-wrapper, #storefront .fooditem-wrapper, #kitchen .fooditem-wrapper').removeClass('glow_fast');
														},600);	
													}
												}
											}
										}	
									});
									
									UpdateIncome();
									UpdateButtonsOnChange();
								}
							}	
						}							
					}
				}	
				
				if (currentScreen === 'info') {
					if (selectedInfoDish !== undefined) {
						if ( event.which == 49 ) {//[1]
							SetAsStarterFood(1, selectedInfoDish);							
						}
						if ( event.which == 50 ) {//[2]
							SetAsStarterFood(2, selectedInfoDish);
						}
					}	
				}
				
				if ((currentScreen === 'delivery') && (v.deliveryStatus !== "wait")) {
					if ( event.which == 81 ) {//[q]
						$('#btn_cook_delivery').trigger('click');
					}					
					if ( event.which == 68 ) {//[d]
						$('#btn_sort_delivery').trigger('click');
					}
					let kitchenTarget = '';
					if ( event.which == 49 ) {//[1]
						if ($('#delivery_kitchen .fooditem').eq(0).length > 0) {
							kitchenTarget = $('#delivery_kitchen .fooditem').eq(0);
						}
					}
					if ( event.which == 50 ) {//[2]
						if ($('#delivery_kitchen .fooditem').eq(1).length > 0) {
							kitchenTarget = $('#delivery_kitchen .fooditem').eq(1);
						}
					}
					if ( event.which == 51 ) {//[3]
						if ($('#delivery_kitchen .fooditem').eq(2).length > 0) {
							kitchenTarget = $('#delivery_kitchen .fooditem').eq(2);
						}
					}
					if ( event.which == 52 ) {//[4]
						if ($('#delivery_kitchen .fooditem').eq(3).length > 0) {
							kitchenTarget = $('#delivery_kitchen .fooditem').eq(3);
						}
					}
					if ( event.which == 53 ) {//[5]
						if ($('#delivery_kitchen .fooditem').eq(4).length > 0) {
							kitchenTarget = $('#delivery_kitchen .fooditem').eq(4);
						}
					}
					
					if (kitchenTarget !== '') { //[1-5]
						let kitchenType = kitchenTarget.attr('data-type');
							
						let kitchenQty = kitchenTarget.attr('data-qty');
						if ((kitchenType != '') && (kitchenType != undefined)) {
							if (defaultFoodStats[kitchenType].class_a != 'buff') {
								let storeTarget = '';
								$('#delivery_storefront .fooditem').each( function() {
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
									storeTarget.html('<span class="qty">'+AbbreviateNumber2(newStoreQty)+'</span>');
									storeTarget.parent().removeClass('glow_fast').addClass('glow_fast');
									setTimeout(function() {
										storeTarget.parent().removeClass('glow_fast');
									},600);
									if (GetLvFromQty(oldStoreQty) < GetLvFromQty(newStoreQty) ) { // if gained next breakpoint level
										if (!(storeTarget.parent().css('display') == 'none')) {
											ShowFirework(storeTarget.offset(), true);
										}	
									}
									
									UpdateDeliveryIncome();
									UpdateButtonsOnChange();
									if (v.skills['science'] >= 1) {
										UpdateThirdCategory();
									}
									
								} else { // cannot merge, maybe just add
									$('#delivery_storefront .fooditem').each( function() {
										if (($(this).attr('data-type') == '') && (storeTarget == '')) {
											storeTarget = $(this);
										}
									});
									
									if (storeTarget !== '') { // add
										storeTarget.attr('data-type', kitchenType);
										storeTarget.attr('data-buffs', kitchenTarget.attr('data-buffs'));
										kitchenTarget.attr('data-type', '');
										kitchenTarget.attr('data-qty', 1);
										kitchenTarget.html('');
										let newStoreQty = +kitchenQty;
										
										storeTarget.attr('data-qty', newStoreQty);
										storeTarget.html('<span class="qty">'+AbbreviateNumber2(newStoreQty)+'</span>');
										storeTarget.parent().removeClass('glow_fast').addClass('glow_fast');
										setTimeout(function() {
											storeTarget.parent().removeClass('glow_fast');
										},600);	
										UpdateDeliveryIncome();
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
			});
		}	
	});
	
	function StartGame() {
		if ( (window.localStorage.getItem('version') !== undefined) && (window.localStorage.getItem('version') !== '') && (window.localStorage.getItem('version') !== null) ){			
			setTimeout(function(){
				$('#loading').hide();
				$('#main-wrapper').fadeIn('slow');
				$('#money').css('visibility','visible').fadeIn('slow');
				$descriptionBox.fadeIn('slow');
				LoadGame();
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
			SetGameState('normal');
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
		v.restaurantTier = 0;
		v.cookCount = 0; // number of times player cooked
		v.moneySuperCookCount = 0; // number of times player used Super Cook for money
		//v.currentCookMode = 1;
		//v.currentCookCouponsMode = 1;
		v.cookCouponsCount = 0;
		v.incomeBreakpoint = 900;
		v.fireworkN = 1; // to cycle through firework animations
		v.newFood = []; // non tier-1 food for unlocking
		v.foodClasses = {}; // to store food classes in the current restaurant, i.e. "3 meat, 2 fastfood, etc."
		v.foodClassesDelivery = {};
		v.foodClassesDeliveryPool = {};
		v.prestigePointCost = GetCostFromPP(v.prestigePointsTotal);
		//v.prestigePointMoneyEarned = 0;
		v.prestigePointsToGet = 0;
		dishwashing.dirty = ['','','','',''];
		dishwashing.sink = '';
		dishwashing.clean = ['','','','',''];
		//v.deliveries = [{},{},{}]; // to store deliveries as objects
		v.deliveryCooksMax = 20;
		
		v.gotDishQtyRecord = false;
		v.gotDishIncomeRecord = false;
		v.gotRestaurantIncomeRecord = false;
		
		//v.charityFood = 0;
		
		v.categoryBonuses = JSON.parse(JSON.stringify(defaultCategoryBonuses));
		
		$('#dwNewBatch').prop(	'disabled', false);
		$('#dwTake').prop(		'disabled', true);
		$('#dwClean').prop(		'disabled', true);
		$('#dwWash').prop(		'disabled', true);
		$('#dwPut').prop(		'disabled', true);
		$('#dwDone').prop(		'disabled', true);

		v.activeFood = [];
		v.deliveryFood = [];

		for (let prop in defaultFoodStats) {
			if ((defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].class_a != 'buff')) {
				if ( (defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].baseIncome == 1) ) {
					v.activeFood.push(prop);
					v.deliveryFood.push(prop);
				}
				if ( (defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].baseIncome == 2) ) {
					if (v.region > 0) {
						v.activeFood.push(prop);
					} else {
						v.newFood.push(prop);
					}	
				}
				if ( (defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].baseIncome == 4) && (v.skills.tier3food >= 1) ) {
					if (v.region > 0) {
						v.activeFood.push(prop);
					} else {
						v.newFood.push(prop);
					}
				}
				if ( (defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].baseIncome == 8) && (v.skills.tier4food >= 1) ) {
					if (v.region > 0) {
						v.activeFood.push(prop);
					} else {
						v.newFood.push(prop);
					}
				}
			}
		}
		
		v.perks = []; // to store current active perks	
		v.exhaustedPerks = []; // to store perks that should no longer be offered
		v.discontinueTokens = 0;
		
		v.scienceCategory = ''; // Currently applied science category

		$('#kitchen').html('<div class="tr_label">Kitchen</div><div class="fooditems"></div>');
		AddKitchenSlots(v.kitchenSlots);
		$('#storefront').html('<div class="tr_label">Restaurant menu</div>'+
							'<div class="navigation">'+
								'<button id="storefront_nav1" onClick="SetStorefrontPage(1)">1</button>'+
								'<button id="storefront_nav2" onClick="SetStorefrontPage(2)">2</button>'+
								'<button id="storefront_nav3" onClick="SetStorefrontPage(3)">3</button>'+
								'<button id="storefront_nav4" onClick="SetStorefrontPage(4)">4</button>'+
							'</div>'+
							'<div class="fooditems"></div>');
		$('#storefront').removeClass('multipage').removeClass('pages2').removeClass('pages3').removeClass('pages4');
		
		UpdateStorefrontSize();

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
		UpdateStorefrontSize();
	}
	
	function GetLastHistoryTopClass() {
		let foodClassesHistory = [];
		if ($("#info_history .history_restaurant:last-child .fooditem").length < 1) {
			return "fastfood";
		}
		$("#info_history .history_restaurant:last-child .fooditem").each(
			function() {
				let thisType = $(this).attr('data-type');	
				if (thisType) {
					if (foodClassesHistory[defaultFoodStats[thisType].class_a] > 0) {
						foodClassesHistory[defaultFoodStats[thisType].class_a]++;
					} else {
						foodClassesHistory[defaultFoodStats[thisType].class_a] = 1;
					}

					if (foodClassesHistory[defaultFoodStats[thisType].class_b] > 0) {
						foodClassesHistory[defaultFoodStats[thisType].class_b]++;
					} else {
						foodClassesHistory[defaultFoodStats[thisType].class_b] = 1;
					}
				}	
			}
		);
		let ret = SortObjectByValue(foodClassesHistory);
		if (ret.hasOwnProperty('0')) {
			if (ret[0].hasOwnProperty('k')) {
				return ret[0].k;
			}
		}
		return "fastfood";
	}
	
	function TrimHistory(maxRestaurants = 19) {
		if ($('#info_history .history_restaurant').length > maxRestaurants) {
			for (let i = 1; i <= $('#info_history .history_restaurant').length - maxRestaurants; i++) {
				let deleted = false;
				$('#info_history .history_restaurant').each( function() {
					if ( (!deleted) && ($(this).children('.fav:checked').length == 0) ) {
						$(this).remove();
						deleted = true;
					}
				});
			}
			
			window.localStorage.setItem('history', $('#info_history').html());
		}
	}
	
	let historyIDGlobal = 0;
	function AttemptFranchise(historyID) {
		if (gameState == 'selectStarterRestaurant') {
			FranchiseRestaurant(historyID);
		} else {
			historyIDGlobal = historyID;
			let franchiseHTML = 'Franchising will prestige and overwrite your current restaurant.';
			$("#franchise_dialog").html(franchiseHTML).dialog({
				position: { my: "center", at: "center", of: 'body' },
				modal: true,
				buttons: {
					Ok: function() {
						FranchiseRestaurant(historyIDGlobal);
						$( this ).dialog( "close" );
					},
					Cancel: function() {
						$( this ).dialog( "close" );
					}
				}
			});
		}
	}
	
	function FranchiseRestaurant(historyID) {
		let historyDishes = [];
		$('#info_history .history_restaurant').eq(historyID).find('.fooditem').each( function() {
			historyDishes.push($(this).attr('data-type'));
		});
		let lastRestaurantName = $('#info_history .history_restaurant').eq(historyID).find('.tr_label.restaurantname').html();
		
		PrestigeRestaurant();
		$('#default').html('<div class="tr_label restaurantname">Restaurant name</div><div class="fooditems"></div>');
		$('#game .restaurantname').text(lastRestaurantName);
		
		$('#default .fooditems').append('<div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="'+historyDishes[0]+
			'" data-qty="'+100+'"><span class="qty">'+AbbreviateNumber2(100)+'</span></div></div>');
		$('#default .fooditems').append('<div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="'+historyDishes[1]+
			'" data-qty="'+100+'"><span class="qty">'+AbbreviateNumber2(100)+'</span></div></div>');
		
		if (v.skills['precise_science'] >= 1) {
			$('#default').append('<div class="science_div"></div>');
			$('#default .science_div').append(science_select);
			$('#default .science_div').append('<button class="science" onClick="SetScience();">Apply science</button>');			
		} else if (v.skills['science'] >= 1) {
			$('#default').append('<button class="science" onClick="DoScience();">Apply science</button>');
		}		
		
		if (v.skills['tier2_3starter'] >= 1) {					
			v.starterFood1 = historyDishes[0];
			v.starterFood2 = historyDishes[1];
		}

		$('#default').show();
		$('#storefront').show();		
		$('#dishwashing').hide();				
		$('#default').show();		
		SetGameState('normal');		
		$('#options	.inner').html('');				
		
		$('#storefront .fooditem-wrapper').remove();
		for (let hDIndex in historyDishes) {
			if (hDIndex > 1) {
				if (hDIndex < 5) {
					$('#storefront .fooditems').append('<div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="'+historyDishes[hDIndex]+'" data-qty="1000"><span class="qty">1000</span></div></div>');
				} else {
					$('#storefront .fooditems').append('<div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="'+historyDishes[hDIndex]+'" data-qty="1"></div></div>');
				}
				
			}	
		}
		
		UpdateFoodItems();
		UpdateIncome();
		UpdateButtonsOnChange();
		UpdateStorefrontSize();
		$('#storefront').addClass('page1');
	}
		
	function PrestigeRestaurant() {
		if ((gameState == 'tierup') || (gameState == 'perk')) {
			SetGameState('normal');
		}
		
		TrimHistory(19);
		let historyHTML = window.localStorage.getItem('history');
		if (historyHTML == null) {
			historyHTML = '';
		}
		historyHTML += '<div class="history_restaurant">';
		historyHTML +=	'<div class="history_date">'+(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, 10)+'</div>';
		if (v.skills.starterRestaurants >= 1) {
			historyHTML += $('#game #default').html();
		}
		historyHTML += $('#game #storefront').html().replace('Restaurant menu', '');
		historyHTML += '<div class="tr_label">Income: '+AbbreviateNumberEmoji(v.activeIncome)+'</div>';
		historyHTML += '</div>';	
		// Cleanin up history from generated stuff
		historyHTML = historyHTML.split('ui-draggable ui-draggable-handle').join('')
			.split(' ui-droppable').join('')
			.split('  ui-draggable-disabled').join('')
			.split('<button class="science" onclick="DoScience();">Apply science</button>').join('')
			.split(science_select).join('')
			.split('<button class="science" onClick="SetScience();">Apply science</button>').join('');
		if ((v.prestigePointsToGet > 0) && (($('#storefront .fooditem').eq(0).attr('data-type') != '') && ($('#storefront .fooditem').eq(0).attr('data-type') != undefined)) ) {
			window.localStorage.setItem('history', historyHTML);
			$('#info_history').html(historyHTML);
		}		
				
		let prestigeBoostersUsed = +$('#prestige_boosters_input').val();
		if ( (v.skills.prestigeBoosters >= 1) && (prestigeBoostersUsed > 0) && (v.prestigeBoosters >= prestigeBoostersUsed) ) {			
			let prestigePointMoneyEarnedBoosted = v.prestigePointMoneyEarned + (v.incomeWithDeliveries * prestigeBoostersUsed * PRESTIGE_BOOST_VALUE);
			let prestigePointsToGetBoosted = v.prestigePointsToGet;
			let prestigePointsTotalBoosted = +v.prestigePointsTotal +v.prestigePointsToGet;
			let prestigePointCostBoosted = v.prestigePointCost;
			
			if (v.prestigePointsTotal < 100000) {			
				while (prestigePointMoneyEarnedBoosted > prestigePointCostBoosted) {
					prestigePointMoneyEarnedBoosted = prestigePointMoneyEarnedBoosted - prestigePointCostBoosted;
					prestigePointsToGetBoosted++;
					prestigePointsTotalBoosted++;
					prestigePointCostBoosted = GetCostFromPP(prestigePointsTotalBoosted);				
				}
			} else {	// Lategame calculation
				let ppEarnedBoosted = Math.floor(prestigePointMoneyEarnedBoosted / prestigePointCostBoosted);
				let ppMult = Math.pow(2, v.region-1);
				prestigePointsToGetBoosted = +prestigePointsToGetBoosted + (+ppEarnedBoosted*ppMult);
				prestigePointsTotalBoosted = +prestigePointsTotalBoosted + (+ppEarnedBoosted*ppMult);
				prestigePointMoneyEarnedBoosted = prestigePointMoneyEarnedBoosted - (prestigePointCostBoosted*ppEarnedBoosted);
			}
			
			v.prestigePointsTotal = +v.prestigePointsTotal + +prestigePointsToGetBoosted;
			v.skillPointsUnspent = +v.skillPointsUnspent + +prestigePointsToGetBoosted;
			v.prestigeBoosters = v.prestigeBoosters - prestigeBoostersUsed;
			v.prestigePointMoneyEarned = prestigePointMoneyEarnedBoosted;
			v.incomeMultipliers.used_boosters = (+v.incomeMultipliers.used_boosters + +(0.01 * prestigeBoostersUsed)).toFixed(2);
		} else {
			let getpoints = v.prestigePointsToGet;
			v.prestigePointsTotal = +v.prestigePointsTotal + +getpoints;
			v.skillPointsUnspent = +v.skillPointsUnspent + +getpoints;
		}
		if (kongversion) {
			submitAchievements(v.prestigePointsTotal);
		}
		
		let offsetUSP = $('.unspent_skill_points').eq(0).offset();
		offsetUSP.top = offsetUSP.top + 38;
		ShowFirework(offsetUSP);		
		
		ResetGame();
		
		v.tutorialLevel = 'prestiged0';
		$('#shop_button_locked').hide();
		$('#shop_button').fadeIn(500);		
		$('#delivery_button_locked').hide();
		$deliveryButton.fadeIn(500);
		
		$('#prestige_button').css('background', '');
		UpdatePrestigeButtons();
		if (v.skills.starterRestaurants >= 1) {
			SelectStarterRestaurant();
		}
		
		$('#prestige_boosters_input').val(0);
		v.scienceCategory = '';
		if (intervalScience) {
			clearInterval(intervalScience);
		}	
		
		if (v.currentChallenge == 31) {
			v.currentChallenge = 32;
		}
			
		if (v.skills['novelty'] >= 1) {
			v.currentNovelty = JSON.parse(JSON.stringify(v.nextNovelty)); //clone
			for (let catName in v.categoryBonuses) {
				v.categoryBonuses[catName] = (Math.round(defaultCategoryBonuses[catName] * (100 + v.currentNovelty[catName]))/100);				
			}
		}	
		
		if (v.region == 6) {
			v.onlyLeft = true;
		}		
		if (v.region == 8) {
			v.noRestaurant = true;			
			
		}
		if (v.region == 9) {
			v.noCoupons = true;
		}
		if (v.region == 10) {
			v.noTierup = true;
		}
		
		UpdateStorefrontSize();
	}	
	
	function EverySecond(times = 1, ignorePings = false) {	
		if ((times == 1) && (debug2)) {
			return false;
		}
		let addedDeliveryPercentage = 0;
		for (let i = 0; i < 3; i++) {			
			if ((v.deliveries[i].time > 0) || v.deliveries[i].expired) {
				addedDeliveryPercentage = +addedDeliveryPercentage + +v.deliveries[i].incomePercentMultiplied;
				v.deliveries[i].time = v.deliveries[i].time - times;
				if (v.deliveries[i].time <= 0) { // delivery expired right now
					if (v.skills['prolonged_delivery'] >= 1) {
						if (v.deliveries[i].expired == false) {
							v.deliveries[i].expired = true;
							v.deliveries[i].multiplier = (v.deliveries[i].multiplier * 0.4).toFixed(2);
							v.deliveries[i].incomePercentMultiplied = (v.deliveries[i].incomePercentMultiplied * 0.4).toFixed(2);
							v.deliveries[i].time = null;
							UpdateDeliveryScreen();
						}					
					} else {
						v.deliveries[i] = {};
						UpdateDeliveryScreen();
					}
				}	
			}
		}
		addedDeliveryPercentage = addedDeliveryPercentage.toFixed(1);		
		v.incomeWithDeliveries = +v.activeIncome * (1 + (addedDeliveryPercentage / 100));
		Object.keys(v.incomeMultipliers).forEach(function(key) {
			if (+v.incomeMultipliers[key] > 1) {
				v.incomeWithDeliveries = v.incomeWithDeliveries * v.incomeMultipliers[key];
			}	
		});
		
		v.incomeWithDeliveries = Math.round(v.incomeWithDeliveries);

		v.money = +v.money + (+v.incomeWithDeliveries * times);
		$moneyCurrent.html(AbbreviateNumberLong(v.money) + ' <span class="em">💲</span>');
		$moneyIncome.html('+' + AbbreviateNumberEmoji(v.activeIncome));
		$moneyCoupons.html(v.coupons + ' <span>🔖</span>');
		if (addedDeliveryPercentage > 0) {
			$moneyDeliveries.html('+' + addedDeliveryPercentage + '% <span class="em">🚚</span>');
			$moneyDeliveries.show();
		} else {
			if (v.prestigePointsTotal > 10) {
				$moneyDeliveries.html('+<b style="color:#f00;">0%</b> <span class="em">🚚</span>');
				$moneyDeliveries.show();
			} else {
				$moneyDeliveries.html('');
				$moneyDeliveries.hide();
			}	
		}	

		if ( (v.prestigePointsTotal > 20) && (!isMobile()) ) {
			$moneyGems.html(paid.gems+' <span class="em">💎</span>');
			$moneyGems.show();
		}
		
		v.couponShards = +v.couponShards + +times;
		if (v.couponShards >= v.couponShardsBreakpoint) {
			if (v.skills['coupons'] >= 1) {
				v.coupons = +v.coupons + Math.floor(v.couponShards / v.couponShardsBreakpoint);
				v.couponShards = (v.couponShards % v.couponShardsBreakpoint);
			}
		}
		
		v.deliveryBoxesShards = +v.deliveryBoxesShards + +times;
		if (v.deliveryBoxesShards >= v.deliveryBoxesShardsBreakpoint) {			
			v.deliveryBoxes = +v.deliveryBoxes + Math.floor(v.deliveryBoxesShards / v.deliveryBoxesShardsBreakpoint);
			v.deliveryBoxesShards = (v.deliveryBoxesShards % v.deliveryBoxesShardsBreakpoint);
			if (v.deliveryBoxes > 5) { //overflow boxes become gift boxes
				v.deliveryGiftBoxes = +v.deliveryGiftBoxes + + (v.deliveryBoxes - 5);
				v.deliveryBoxes = 5;
			}
		}
		
		if (currentScreen === 'delivery') {
			$('#delivery_resources').html('You have: ' + v.deliveryBoxes + '/5 <span class="em">📦</span> ' + v.deliveryGiftBoxes + ' <span class="em">🎁</span>');
			$('#delivery_box_time').html(BeautifyTime(v.deliveryBoxesShardsBreakpoint - v.deliveryBoxesShards));
		}
	
		v.noveltyShards = +v.noveltyShards + +times;
		if (v.noveltyShards >= v.noveltyShardsBreakpoint) {			
			if ( (v.noveltyActiveCat1 != undefined) && (v.noveltyActiveCat2 != undefined) ) {
				let nTimes = Math.floor(v.noveltyShards / v.noveltyShardsBreakpoint);
				
				if (v.noveltyActiveCat1 != '') {
					for (let nFoodCat in v.nextNovelty) {
						v.nextNovelty[nFoodCat] = +v.nextNovelty[nFoodCat] + nTimes;
					}
				}
				
				if (v.noveltyActiveCat1 != '') {
					v.nextNovelty[v.noveltyActiveCat1] = +v.nextNovelty[v.noveltyActiveCat1] - (4 * nTimes);	
				}	
				if (v.noveltyActiveCat2 != '') {
					v.nextNovelty[v.noveltyActiveCat2] = +v.nextNovelty[v.noveltyActiveCat2] - (4 * nTimes);
				}	
				
				/*if ((v.region > 10) && (v.noveltyActiveCat3 != '')) {
					v.nextNovelty[v.noveltyActiveCat3] = +v.nextNovelty[v.noveltyActiveCat3] - (4 * nTimes);
				}*/
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
		let prestigePointNextStep = +v.prestigePointMoneyEarned + (+v.incomeWithDeliveries * times);

		let prestigeProgressbar2Percent = ((100 * (v.prestigePointMoneyEarned / v.prestigePointCost)) % 1) * 100;
		let prestigeProgressbar2PercentNextStep = ((100 * (prestigePointNextStep / v.prestigePointCost)) % 1) * 100;

		if (v.options.animations) {
			$progressbarPrestigeCover.css('transition', 'width 1s linear 0s');
			$progressbarPrestigeCover2.css('transition', 'width 1s linear 0s');
		} else {
			$progressbarPrestigeCover.css('transition', 'none');
			$progressbarPrestigeCover2.css('transition', 'none');
		}
	
		let prestigeProgressbarPercentSpeed = 100 * (v.incomeWithDeliveries / v.prestigePointCost); // how many progress bar percents it gets in a second (e.g. 50%)

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
			
			if (prestigeProgressbarFillTime <= 0) {
				prestigeProgressbarFillTime = 1;
			}
			if (prestigeProgressbarFillTime > 2) {
				prestigeProgressbarFillTime = 1;
			}
			
			if (!debug2) {
				setTimeout(function() {
					PrestigeBar1Reset(prestigeProgressbarFillTime);
				}, Math.floor(prestigeProgressbarFillTime * 1000));
			} else {
				PrestigeBar1Reset(prestigeProgressbarFillTime);
			}
			

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
			if (!debug2) {
				setTimeout(function() {
					PrestigeBar2Reset(prestigeProgressbar2FillTime);
				}, Math.floor(prestigeProgressbar2FillTime * 1000));
			} else {
				PrestigeBar2Reset(prestigeProgressbar2FillTime);
			}	
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
		if (!ignorePings) {
			pings = +pings + +times;
		}	
		let pingDif = Math.floor(timeDif - pings);
		
		if (pingDif - compensatedPings > 3) {		
			let pingsToCompensate = pingDif - compensatedPings;
			compensatedPings += pingDif - compensatedPings;
			EverySecond(pingsToCompensate, true);
			//console.log('Compensated ' + (pingsToCompensate) + ' seconds for inactive tab slowdown.');
		}
		
		if (times > 60) {
			EveryMinute();
		}
		
		if (currentScreen === 'preferences') {			
			let lastSaveDate = window.localStorage.getItem('lastSaveToFile');
			if ((lastSaveDate == undefined) || (lastSaveDate == null)) {
				lastSaveDate = 0;
			}
			if ( (v.skills['coupons'] >= 1) && (Date.now() - lastSaveDate < 23*60*60*1000) ) {
				$('#daily_wait').html('Daily backup reward:<br>' + BeautifyTime((+lastSaveDate + 23*60*60*1000 - Date.now())/1000));
			}	
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
		
		if (currentScreen === 'delivery') {
			if (currentdeliveryDesc != '') {
				if (v.deliveries[currentdeliveryDesc-1].expired) {
					$('#current_delivery_time_desc').text('Infinity');
				} else {
					$('#current_delivery_time_desc').text(BeautifyTime(v.deliveries[currentdeliveryDesc-1].time));
				}				
			}
			if (v.deliveryBoxes < 1) {
				$('#btn_newdelivery').addClass('disabled');
			} else {
				$('#btn_newdelivery').removeClass('disabled');
			}
			if ((v.deliveryGiftBoxes < v.deliveryGiftBoxesCost) && (v.deliveryStatus == 'end')) {
				$('#btn_cook_delivery').addClass('disabled');
			} else {
				$('#btn_cook_delivery').removeClass('disabled');
			}
		}
		
		/*if (!debug2) {
			$('#debug_box').html(
						'Active: ' + AbbreviateNumber(v.activeIncome) +
						'<br>Mult: ' + v.activeIncomeMultiplier +						
						'<br>PP: ' + v.prestigePointsToGet +
						'<br>Cooks total: ' + cooksTotal +
						'<br>TIME: ' + BeautifyTime(pings) + 
						'<br>tt10(1h): ' + debug.tt10 +
						'<br>tt30(2h): ' + debug.tt30 +
						'<br>tt70(4h): ' + debug.tt70 +
						'<br>tt150(6h): ' + debug.tt150 +
						'<br>tt310(8h): ' + debug.tt310 +
						'<br>tt630(12h): ' + debug.tt630 +
						'<br>tt1270(18h): ' + debug.tt1270 +
						'<br>tt2000(24h): ' + debug.tt2000 +
						'<br>tt4000(28h): ' + debug.tt4000 +
						'<br>tt8000(32h): ' + debug.tt8000 +
						'<br>tt16000(36h): ' + debug.tt16000 +
						'<br>tt32000(48h): ' + debug.tt32000 +
						'<br>Pings: ' + pings +
						'<br>timeDif: ' + timeDif +
						'<br>compensatedPings: ' + compensatedPings +
						'<br>Dif: ' + BeautifyTime(Math.round(Math.abs(pingDif))) );
		}	*/			
		UpdateButtonsOnTick();
		if (currentScreen == 'prestige') {
			UpdatePrestigeScreen();
		}
		
		
		if (currentScreen == 'shop') {
			let code1 = GenerateRITCDCode();
			$('#ritcd_code').val(code1);
			$('#ritcd_return').val('https://restaurantidle.com/index.html?code='+code1);
			
			let code2 = GenerateRITCDCode2();
			$('#ritcd_code2').val(code2);
			$('#ritcd_return2').val('https://restaurantidle.com/index.html?code='+code2);
		}
	}
	
	function MultipleSeconds(times = 0) {
		let arrTimes = [9999999, 9999999, 9999999];
		if (times > 1) {
			for (let deliveryIndex = 0; deliveryIndex < 3; deliveryIndex++) {
				if ((v.deliveries[deliveryIndex].time > 0) && (v.deliveries[deliveryIndex].expired == false)) {
					arrTimes[deliveryIndex] = v.deliveries[deliveryIndex].time;
				}
			}
			let minTime = Math.min.apply(Math, arrTimes);
			if ((times < minTime) || (minTime == 9999999)) { // no deliveries expire during the time
				EverySecond(times, true);				
			} else { // something will expire - go to first expire and then relaunch
				EverySecond(+minTime + 1, true); // +1 so it definitely expires				
				MultipleSeconds(times - minTime);
			}		
		} else {
			EverySecond(1, true);
		}	
	}	
	
	let intervalEveryMinute = setInterval(EveryMinute, 60000);
	function EveryMinute() {
		if ( (t[v.tutorialLevel].val >= t['finished0'].val) ) {			
			SaveGame();
		}
		if (v.prestigePointsToGet >= (v.prestigePointsTotal + 10)) {
			$('#prestige_button').css('background', '#ecae21');
			$('#prestige_button').off('mouseover').on('mouseover', function (e) {
				let desc = 'Yellow glow means your next prestige will double your income (or even more).';
				$descriptionBox.html(desc);
				descFadeout = false;
				e.stopPropagation();
			});	
			$('#prestige_button').off('mouseout').on('mouseout', function (e) {
				DescStartFadeOut();
				e.stopPropagation();
			});		
		}
		
		let addedDeliveryPercentage = 0;
		for (let i = 0; i < 3; i++) {
			if (v.deliveries[i].time > 0) {
				addedDeliveryPercentage = +addedDeliveryPercentage + +v.deliveries[i].incomePercentMultiplied;				
			}
		}
		if (addedDeliveryPercentage == 0) {
			$deliveryButton.css('background','#ecae21');
		}
		
		if (findGetParameter('act') == 'cancel') {
			$('<div title="Cancelled" style="text-align:center;">Your transaction was cancelled.</div>').dialog({
				modal: true,
				buttons: {
					Ok: function() {
						$( this ).dialog( "close" );
					}
				}
			});
			window.history.pushState("", "", 'https://restaurantidle.com/');
		}
		if (findGetParameter('code') != null) {
			CheckRITCDCode(findGetParameter('code'));
			window.history.pushState("", "", 'https://restaurantidle.com/');
		}
	}
	
	function findGetParameter(parameterName) {
		var result = null,
			tmp = [];
		var items = location.search.substr(1).split("&");
		for (var index = 0; index < items.length; index++) {
			tmp = items[index].split("=");
			if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
		}
		return result;
	}

	function PrestigeBar1Reset(prestigeProgressbarFillTime) {
		let doAnimations = true; // if there are multiple prestige points gained, don't even try to animate that
		if (!debug2) {			
			if ( (v.prestigePointMoneyEarned / v.prestigePointCost) < 1) {
				$progressbarPrestigeCover.css('transition', 'all 0s linear 0s');
				$progressbarPrestigeCover.hide();
				$progressbarPrestigeCover.css('width', '100%');
				$progressbarPrestigeCover.show();
			} else {
				doAnimations = false;
			}
			v.prestigePointCost = GetCostFromPP(v.prestigePointsTotal + v.prestigePointsToGet);			
		}	
		
		let ppMult = 1;
		if (v.region > 1) {
			ppMult = Math.pow(2, v.region-1);
		}
		
		if ((!debug2) && (v.prestigePointsTotal < 100000)) {
			while (v.prestigePointMoneyEarned > v.prestigePointCost) {
				v.prestigePointMoneyEarned = Math.floor(v.prestigePointMoneyEarned - v.prestigePointCost);				
				v.prestigePointsToGet = +v.prestigePointsToGet + +(1 * ppMult);
				v.prestigePointCost = GetCostFromPP(v.prestigePointsTotal + v.prestigePointsToGet);
			}
		} else { //lategame calculation
			if (v.prestigePointMoneyEarned > v.prestigePointCost) {
				let ppEarned = Math.floor(v.prestigePointMoneyEarned / v.prestigePointCost);
				v.prestigePointMoneyEarned = v.prestigePointMoneyEarned - (v.prestigePointCost * ppEarned);	
				v.prestigePointsToGet = +v.prestigePointsToGet + +(ppEarned * ppMult);
			}
		}	
		
		if (!debug2) {
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
	}

	function PrestigeBar2Reset(prestigeProgressbarFillTime) {
		if (!debug2) {
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
	}

	let intervalDebugCheck = setInterval(DebugCheck, 5*60*1000);
	function DebugCheck() {
		let temp_income = v.activeIncome;
		UpdateIncome();
		if (temp_income != v.activeIncome) {
			console.log(new Date() + 'DEBUG: ' + temp_income + '|' + v.activeIncome);
		}
		CheckSaveToFile();
	}

	function UpdateIncome() {
		let oldActiveIncome = v.activeIncome;
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
					( (defaultFoodStats[food1].class_a != 'dessert') && (defaultFoodStats[food1].class_a != 'drink') ) &&
					( (defaultFoodStats[food1].class_b != 'dessert') && (defaultFoodStats[food1].class_b != 'drink') ) &&
					//( (food1science 				   != 'dessert') && (food1science 					 != 'drink') ) &&
					
					( (defaultFoodStats[food2].class_a == 'dessert') || (defaultFoodStats[food2].class_b == 'dessert') || (food2science == 'dessert') ) &&
					
					( (defaultFoodStats[food3].class_a == 'drink') || (defaultFoodStats[food3].class_b == 'drink') || (food3science == 'drink') ) 
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
		let firstCat = '';
		if (!debug2) {
			sortedBonuses.forEach(function(item) {
				bonusLevels += '<b class="category_circle" style="color:'+colors[item.k]+'">●</b> ' + BeautifyDataType(item.k) + ': ' + item.v + '<br>';
				if ((firstCat == '') && (item.v >= 5)){
					firstCat = item.k;
				}
			});
		}

		if (currentScreen != 'delivery') {
			if ((bonusLevels == '') && (!debug2)) {
				$('#category_bonuses').fadeOut(500);
			} else {
				if (v.hasDuplicates) {
					bonusLevels += '<span style="font-size: 10px;vertical-align: top;">⚠️</span> <b style="color:#f00;">Duplicate</b><br>';
				}
				if ((v.skills.mealOfTheDay >= 1) && (mealOfTheDayActive == false)) {
					bonusLevels += '<span style="font-size: 10px;vertical-align: top;">⚠️</span> <b style="color:#f00;">MotD</b><br>';
				}
				if (v.skills.novelty >=1) {			
					if (v.currentNovelty[firstCat] < 50) {
						bonusLevels += '<span style="font-size: 10px;vertical-align: top;">⚠️</span> <b style="color:#f00;">Novelty</b><br>';
					}
				}
				$('#category_bonuses').html('<span class="nomobile">Themes:</span><br class="nomobile">' + bonusLevels);
				$('#category_bonuses').fadeIn(500);
			}
			
			let orderNum = 1;
			$('#storefront .fooditem').each( // setting the numbers of elements for Dish of the Day
				function() {
					$(this).attr('data-num', orderNum);
					orderNum++;
					
					if (v.region == 10) {
						if ($(this).attr('data-type') !== '') {
							v.noRestaurant = false;
						}
					}
				}
			);	
		}

		let kitchenNum = 1;
		$('#kitchen .fooditem').each( // setting the numbers of elements for Dish of the Day
			function() {
				$(this).attr('data-kitchen-num', kitchenNum);
				kitchenNum++;
				if (true) {
					let kitchenType = $(this).attr('data-type');
					if ((kitchenType != '') && (kitchenType != undefined)) {
						if ((foodTypes[$(this).attr('data-type')] === 'exists') || ( (defaultFoodStats[$(this).attr('data-type')].class_a === 'buff' ) && (IsBuffUsable($(this).attr('data-type'))) ) ) {
							$(this).parent().css('border-color', '#ffcd53');
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
					let thisClassA = defaultFoodStats[$(this).attr('data-type')].class_a;
					let thisBaseIncome = defaultFoodStats[$(this).attr('data-type')].baseIncome;
					
					if ((v.region > 10) && (OUTER_REGIONS_DISHES[v.region - 11] != undefined)) {
						let currentTrend = OUTER_REGIONS_DISHES[v.region - 11];
						if ((currentTrend != undefined) && ($(this).attr('data-type') == currentTrend) && (!debug2)) {
							thisBaseIncome = 20;
						}
					}
					if (v.region > 99) {
						thisBaseIncome = 20;
					}
					
					if (!debug2) {
						if ( (v.region == 4) && (thisBaseIncome == 4) && (thisClassA != 'buff') ) {
							thisBaseIncome = 8;
						} else {
							if ( (v.region == 4) && (thisBaseIncome == 8) ) {
								thisBaseIncome = 4;
							}
						}
						
						if ( (v.region == 8) && (thisBaseIncome == 2) && (thisClassA != 'buff') ) {
							thisBaseIncome = 8;
						} else {
							if ( (v.region == 8) && (thisBaseIncome == 8) ) {
								thisBaseIncome = 2;
							}
						}
						
						if ( (v.region == 10) && (thisBaseIncome == 1) && (thisClassA != 'buff') ) {
							thisBaseIncome = 8;
						} else {
							if ( (v.region == 10) && (thisBaseIncome == 8) ) {
								thisBaseIncome = 1;
							}
						}
					}
					let thisGain = thisBaseIncome * Number($(this).attr('data-qty'));

					// LEVELS: Double for every 10, 25, 50... levels of food					
					let thisLv = GetLvFromQty(Number($(this).attr('data-qty')));
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

					// DRINK
					if (v.foodClasses['drink'] > 0) { // 200% income with a drink
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
					
					// check for records
					if (v.prestigePointsTotal > 100) {
						if (Math.round(thisGain) > Number(v.bestFood.income)) {				
							v.bestFood.income = Math.round(thisGain);
							v.bestFood.type = $(this).attr('data-type');
							v.bestFood.qty = Number($(this).attr('data-qty'));
							
							if (!v.gotDishIncomeRecord) {
								let position = $(this).offset();
								position.left = +position.left - 50;
								position.top  = +position.top - 50;
								if (!debug2) {
									$('#dish_income_record').css(position);
									DishIncomeRecordAnimation();
								}	
								v.gotDishIncomeRecord = true;
							}
							
												
						}
						if (Number($(this).attr('data-qty')) > Number(v.biggestFood.qty)) {
							v.biggestFood.qty = Number($(this).attr('data-qty'));
							v.biggestFood.type = $(this).attr('data-type');
							
							if (!v.gotDishQtyRecord) {
								let position = $(this).offset();
								position.left = +position.left - 50;
								position.top  = +position.top - 50;
								if (!debug2) {
									$('#dish_qty_record').css(position);
									DishQtyRecordAnimation();
								}
								v.gotDishQtyRecord = true;
							}	
						}
					}	
				} else {
					$(this).attr('data-income', 0);
				}
			}
		);
		
		if (v.region == 6) {
			if (
				(v.foodClasses['meat'] >= 3) &&
				(v.foodClasses['vegan'] >= 3) &&
				(v.foodClasses['seafood'] >= 3) &&
				(v.foodClasses['fastfood'] >= 3) &&
				(v.foodClasses['dessert'] >= 3) &&
				(v.foodClasses['cheap'] >= 3) &&
				(v.foodClasses['premium'] >= 3) &&
				(v.foodClasses['drink'] >= 3)
			) {
				// region 6 all good
			} else {
				v.activeIncome = 0;
			}	
		}		
		if (v.region == 9) {
			if (v.foodClasses['dessert'] >= 10) {
				
			} else {
				v.activeIncome = 0;
			}	
		}
		if (v.region == 10) {
			if (
				(v.foodClasses['meat'] % 2 == 1) &&
				(v.foodClasses['vegan'] % 2 == 1) &&
				(v.foodClasses['seafood'] % 2 == 1) &&
				(v.foodClasses['fastfood'] % 2 == 1) &&
				(v.foodClasses['dessert'] % 2 == 1) &&
				(v.foodClasses['cheap'] % 2 == 1) &&
				(v.foodClasses['premium'] % 2 == 1) &&
				(v.foodClasses['drink'] % 2 == 1)
			) {
				
			} else {
				v.activeIncome = 0;
			}	
		}
		
		v.activeIncome = Math.round(v.activeIncome);
		if (!debug2) {
			$moneyIncome.html('+' + AbbreviateNumberEmoji(v.activeIncome));
			
			if (v.activeIncome > 0) {
				$moneyIncome.fadeIn(500);
			}
			// check for records	
			if (v.activeIncome > (v.bestRestaurant.income)) {
				v.bestRestaurant.income = v.activeIncome;
				let sortedTypes = SortObjectByValue(v.foodClasses);
				let restType1 = '';
				let restType2 = '';
				let restType3 = '';
				if (sortedTypes[0] !== undefined) {
					restType1 = sortedTypes[0].k;
				}
				if (sortedTypes[1] !== undefined) {
					restType2 = sortedTypes[1].k;
				}
				if (sortedTypes[2] !== undefined) {
					restType3 = sortedTypes[2].k;
				}
				v.bestRestaurant.type = restType1 + ' - ' + restType2 + ' - ' + restType3;
				if ((v.prestigePointsTotal > 100) && (!v.gotRestaurantIncomeRecord)) {
					let position = $('#money .income').offset();
					position.left = +position.left - 50;
					position.top  = +position.top + 40;
					if (!debug2) {
						$('#restaurant_income_record').css(position);
						RestaurantIncomeRecordAnimation();
					}
					v.gotRestaurantIncomeRecord = true;
				}
			}		
			
		
		
		
			/*if ( (v.activeIncome > 100) && (oldActiveIncome < 100) ) {
				if (dishwashingOpen) {
					$('#dishwashing').css('height', '30px');
					$('#dishwashing .tr_label').text('Dishwashing ▼');
					$('#dishwashing #dirty').fadeOut(500);
					$('#dishwashing #sink').fadeOut(500);
					$('#dishwashing #clean').fadeOut(500);
					$('#dishwashing button').fadeOut(500);
					dishwashingOpen = false;
				}
			}*/

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

			if ((v.tutorialLevel == 'drinks0') && (v.foodClasses['drink'] > 0)) {
				$cookButton.prop('disabled', true);
				v.tutorialLevel = 'hasdrinks0';
				UpdateTutorial();
			}
			
			if (v.skills['coupons'] >= 1) {
				if (!debug2) {
					$('#cook_coupon_buttons').show();
					$goalsBigButton.hide();
					$goalsSmallButton.show();
					$('#money .coupons').show();
				}	
			} else {
				if (t[v.tutorialLevel].val >= t['finished0'].val) {
					$goalsBigButton.fadeIn(2000);
				}
			}
			
			if (v.skills['perks'] >= 1) {
				if (!debug2) {
					$perksButton.show();
				}	
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
					if (v.region > 10) {
						if ((bestIncomeType == v.scienceType1) || (bestIncomeType == v.scienceType2)) {
							//v.noveltyActiveCat3 = v.scienceCategory;
						} else {
							v.noveltyActiveCat3 = '';
						}
					}	
				} else {
					v.noveltyActiveCat1 = '';
					v.noveltyActiveCat2 = '';
				}
			}
			
			if ( (t[v.tutorialLevel].val >= t['finished0'].val) ) {			
				if (!debug2) {
					SaveGame();
				}	
			}		
			
			if (v.currentChallenge > 0) {
				CheckChallenge(v.currentChallenge);
			}
			
			if (v.region >= 1) {
				CheckRegionQuests();
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
			$('#storefront .fooditems').append('<div class="fooditem-wrapper"><div class="fooditem temp-small" data-buffs="" data-type="" data-qty="1"></div></div>');
		}
		setTimeout(function() {
			$('#storefront .fooditems .fooditem').each( function() {
				$(this).removeClass('temp-small');
			});
		},50);
		
		UpdateFoodItems();
	}
	
	function AddDeliverySlots(slotNum) {
		for (let i = 0; i < slotNum; i++) {
			$('#delivery .delivery_fooditems').append('<div class="fooditem-wrapper"><div class="fooditem temp-small" data-buffs="" data-type="" data-qty="1"></div></div>');			
		}
		setTimeout(function() {
			$('#delivery .delivery_fooditems .fooditem').each( function() {
				$(this).removeClass('temp-small');
			});
		},50);
		
		UpdateDeliveryScreen();
		UpdateFoodItems();
	}
	
	function CheckChallenge(challengeID) {
		let checkResult = '';		
		switch (challengeID) {
			case 10:
			{
				checkResult += '<b>Triples</b><br>';
				checkResult += '<br>';
				checkResult += 'Have <i>all</i> possible categories in your menu<br> with exactly 3 dishes in each category (no more, no less).<br>';
				checkResult += '<div style="text-align: left; padding: 7px 7px 7px 10px; border: 1px solid #a05555; border-radius: 10px; width: 100px; margin-left: 40%;margin-top: 5px;"><span>Themes:</span><br><b class="category_circle" style="color:#dadada">●</b> Cheap: 3<br><b class="category_circle" style="color:#e7b2e0">●</b> Dessert: 3<br><b class="category_circle" style="color:#00e7ff">●</b> Drink: 3<br><b class="category_circle" style="color:#ffd000">●</b> Fastfood: 3<br><b class="category_circle" style="color:#f00">●</b> Meat: 3<br><b class="category_circle" style="color:#a8ee96">●</b> Premium: 3<br><b class="category_circle" style="color:#5050ff">●</b> Seafood: 3<br><b class="category_circle" style="color:#5ab55a">●</b> Vegan: 3</div>';
				checkResult += 'Reward: 10 💎 Gems<br>';
				
				let numCats = 0;
				let numCats3 = 0;
				for (let foodCat in v.foodClasses) {
					numCats++;
					if (v.foodClasses[foodCat] == 3) {
						numCats3++;
					}
				}
				
				if (numCats == 8) {
					checkResult += 'Active categories: '+numCats+'/8 <span style="color: #86d686;">✓</span><br>';
				} else {
					checkResult += 'Active categories: '+numCats+'/8 <span style="color: #FF0000;">X</span><br>';
				}
				if (numCats3 == 8) {
					checkResult += 'Categories with 3 dishes: '+numCats3+'/8 <span style="color: #86d686;">✓</span><br>';
				} else {
					checkResult += 'Categories with 3 dishes: '+numCats3+'/8 <span style="color: #FF0000;">X</span><br>';
				}		
				if ((numCats == 8) && (numCats3 == 8)) {
					v.currentChallenge = 11;
					$('#progress_button').css('background', '#ecae21');
					checkResult += '<button onclick="v.currentChallenge = 20;paid.gems = +paid.gems + 10;paid.gems_from_challenges = +paid.gems_from_challenges + 10;UpdateProgressScreen();">Done</button>';
				}
			}	
			break;
			
			case 11:		
				checkResult += '<b>Triples</b><br>';
				checkResult += '<br>';
				checkResult += 'Have <i>all</i> possible categories in your menu<br> with exactly 3 dishes in each (no more, no less).<br>';
				checkResult += 'Reward: 10 💎 Gems<br>';
				checkResult += 'Active categories: <span style="color: #86d686;">✓</span><br>';
				checkResult += 'Categories with 3 dishes: <span style="color: #86d686;">✓</span><br>';
				checkResult += '<button onclick="v.currentChallenge = 20;paid.gems = +paid.gems + 10;paid.gems_from_challenges = +paid.gems_from_challenges + 10;UpdateProgressScreen();">Done</button>';
				$('#progress_button').css('background', '#ecae21');
			break;
			
			case 20:
			{
				$('#progress_button').css('background', '');
				checkResult += '<b>Laser-tight focus</b><br>';
				checkResult += '<br>';
				checkResult += 'Have up to 4 categories in your menu with at least 10 dishes total.<br>';
				checkResult += 'Reward: 20 💎 Gems<br>';
				
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
					checkResult += 'Active categories: '+numCats+'/4 <span style="color: #86d686;">✓</span><br>';
				} else {
					checkResult += 'Active categories: '+numCats+'/4 <span style="color: #FF0000;">X</span><br>';
				}
				if (numFoods >= 10) {
					checkResult += 'Dishes: '+numFoods+'/10 <span style="color: #86d686;">✓</span><br>';
				} else {
					checkResult += 'Dishes: '+numFoods+'/10 <span style="color: #FF0000;">X</span><br>';
				}		
				if ((numCats <= 4) && (numFoods >= 10)) {
					v.currentChallenge = 21;
					$('#progress_button').css('background', '#ecae21');
					checkResult += '<button onclick="v.currentChallenge = 30;paid.gems = +paid.gems + 20;paid.gems_from_challenges = +paid.gems_from_challenges + 20;UpdateProgressScreen();">Done</button>';
				}
			}	
			break;
			
			case 21:
				checkResult += '<b>Laser-focus</b><br>';
				checkResult += '<br>';
				checkResult += 'Have up to 4 categories in your menu with at least 10 dishes total.<br>';
				checkResult += 'Reward: 20 💎 Gems<br>';
				checkResult += 'Active categories: <span style="color: #86d686;">✓</span><br>';
				checkResult += 'Dishes: <span style="color: #86d686;">✓</span><br>';
				checkResult += '<button onclick="v.currentChallenge = 30;paid.gems = +paid.gems + 20;paid.gems_from_challenges = +paid.gems_from_challenges + 20;UpdateProgressScreen();">Done</button>';
				$('#progress_button').css('background', '#ecae21');
			break;
			
			case 30:
			{
				$('#progress_button').css('background', '');
				checkResult += '<b>Letters</b><br>';
				checkResult += '<br>';
				checkResult += 'Have 7 different dishes that start with the same letter (any letter).<br>';
				checkResult += 'Reward: 30 💎 Gems<br>';
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
					checkResult += 'Dishes starting with the same letter: '+maxNum+'/7 (Current top letter: '+maxLetter+') <span style="color: #86d686;">✓</span><br>';
					checkResult += '<button onclick="v.currentChallenge = 31;paid.gems = +paid.gems + 30;paid.gems_from_challenges = +paid.gems_from_challenges + 30;UpdateProgressScreen();">Done</button>';
					$('#progress_button').css('background', '#ecae21');
				} else {
					checkResult += 'Dishes starting with the same letter: '+maxNum+'/7 (Current top letter: '+maxLetter+') <span style="color: #FF0000;">X</span><br>';
				}
			}	
			break;
			
			case 31:
				$('#progress_button').css('background', '');
				checkResult += '<b>All currently available challenges are completed</b><br>';
			break;
			
			case 32:
				// nothing
			break;
			
			default:
				return false;
		}
		return checkResult;	
	}
	
	function SetGameState(gs) {
		$('#game').removeClass('gsNormal').removeClass('gsTierup').removeClass('gsPerk').removeClass('gsSelectStarterRestaurant');
		
		gameState = gs;
		if (gs == 'normal') {
			$('#game').addClass('gsNormal').addClass('kitchenTransition');
			setTimeout(function() {
				$('#game').removeClass('kitchenTransition');
			},500);
		}
		if (gs == 'tierup') {
			$('#game').addClass('gsTierup');
		}
		if (gs == 'perk') {
			$('#game').addClass('gsPerk');
		}
		if (gs == 'selectStarterRestaurant') {
			$('#game').addClass('gsSelectStarterRestaurant');
		}
	}	

	function TierUpRestaurant() {
		if (v.newFood.length == 0) { 
			if (v.activeIncome >= v.incomeBreakpoint) {
				v.activeIncomeMultiplier = (+v.activeIncomeMultiplier + 0.4);
				v.activeIncomeMultiplier = 0 + +v.activeIncomeMultiplier.toFixed(2);				
				v.restaurantTier++;
				UpdateStorefrontSize();				
				
				v.incomeBreakpoint = v.incomeBreakpoint * 5;
				if (v.skills.perks > 0) {	
					SelectNewPerk();			
				}
				UpdateIncome();
				UpdateButtonsOnChange();
				UpdateFoodItems();
				SaveGame();
				return false;
			}
		}
		if (v.activeIncome >= v.incomeBreakpoint) {			
			SetGameState('tierup');
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

			optionsHTML += '<div id="new1" style="padding: 3px; border: 1px solid #c78888; display:inline-block;margin-bottom: 12px;" ><b style="color:#c78888">Set 1</b><br>';
			optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + v.newFood[rnd1] + '" data-qty="1"></div></div>';
			optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + v.newFood[rnd2] + '" data-qty="1"></div></div>';
			optionsHTML += 	'<br><button onClick="SetNewFood(1)">Choose</button>';			
			optionsHTML += '</div>';
			optionsHTML += '<div id="new2" style="padding: 3px; border: 1px solid #c78888; display:inline-block;margin-bottom: 12px;"><b style="color:#c78888">Set 2</b><br>';
			optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + v.newFood[rnd3] + '" data-qty="1"></div></div>';
			optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + v.newFood[rnd4] + '" data-qty="1"></div></div>';
			optionsHTML += 	'<br><button onClick="SetNewFood(2)">Choose</button>';
			optionsHTML += '</div>';
			if (v.skills.triple_choice === 'HardResetGame()') {
				optionsHTML += '<div id="new3" style="padding: 3px; border: 1px solid #c78888; display:inline-block;margin-bottom: 12px;"><b style="color:#c78888">Set 3</b><br>';
				optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + v.newFood[rnd5] + '" data-qty="1"></div></div>';
				optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + v.newFood[rnd6] + '" data-qty="1"></div></div>';
				optionsHTML += 	'<br><button onClick="SetNewFood(3)">Choose</button>';
				optionsHTML += '</div>';
			}
			
			$('#options	.inner').html(optionsHTML);
			$('#options .tr_label').text('Select new dishes');
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
						
						if ( (v.region == 4) && (thisBaseIncome == 4) ) {
							thisBaseIncome = 8;
						} else {
							if ( (v.region == 4) && (thisBaseIncome == 8) ) {
								thisBaseIncome = 4;
							}
						}
						
						if ( (v.region == 8) && (thisBaseIncome == 2) ) {
							thisBaseIncome = 8;
						} else {
							if ( (v.region == 8) && (thisBaseIncome == 8) ) {
								thisBaseIncome = 2;
							}
						}
						
						if ( (v.region == 10) && (thisBaseIncome == 1) ) {
							thisBaseIncome = 8;
						} else {
							if ( (v.region == 10) && (thisBaseIncome == 8) ) {
								thisBaseIncome = 1;
							}
						}

						let thisDataTypeCapitalized = BeautifyDataType(thisDataType);

						let desc = '<b style="font-size: 16px;">' + thisDataTypeCapitalized + '</b><br>';
						desc += '<b class="category_circle" style="color:'+colors[thisClassA]+'">●</b> ' + BeautifyDataType(thisClassA) + '<br>';
						desc += '<b class="category_circle" style="color:'+colors[thisClassB]+'">●</b> ' + BeautifyDataType(thisClassB) + '<br>';
						desc += 'Base income: <b>' + thisBaseIncome + '</b><br>';
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
			$("#new1 button").off('mouseover').on('mouseover', function (e) {
					let desc = 'Add <b>' + BeautifyDataType(v.newFood[rnd1]) + '</b> and <b>' + BeautifyDataType(v.newFood[rnd2]) + '</b> to available dishes.<br>';
					if (!isMobile()) {
						desc += '<br>Hotkey: Q<br>';
					}	
					$descriptionBox.html(desc);
					descFadeout = false;
					e.stopPropagation();
				}).off('mouseout').on('mouseout', function (e) {
					DescStartFadeOut();
					e.stopPropagation();
				});
			$("#new2 button").off('mouseover').on('mouseover', function (e) {
					let desc = 'Add <b>' + BeautifyDataType(v.newFood[rnd3]) + '</b> and <b>' + BeautifyDataType(v.newFood[rnd4]) + '</b> to available dishes.<br>';
					if (!isMobile()) {
						desc += '<br>Hotkey: W<br>';
					}	
					$descriptionBox.html(desc);
					descFadeout = false;
					e.stopPropagation();
				}).off('mouseout').on('mouseout', function (e) {
					DescStartFadeOut();
					e.stopPropagation();
				});
			$("#new3 button").off('mouseover').on('mouseover', function (e) {
					let desc = 'Add <b>' + BeautifyDataType(v.newFood[rnd5]) + '</b> and <b>' + BeautifyDataType(v.newFood[rnd6]) + '</b> to available dishes.<br>';
					if (!isMobile()) {
						desc += '<br>Hotkey: E<br>';
					}	
					$descriptionBox.html(desc);
					descFadeout = false;
					e.stopPropagation();
				}).off('mouseout').on('mouseout', function (e) {
					DescStartFadeOut();
					e.stopPropagation();
				});	
				

			v.activeIncomeMultiplier = (+v.activeIncomeMultiplier + 0.2);
			v.activeIncomeMultiplier = 0 + +v.activeIncomeMultiplier.toFixed(2);
			v.restaurantTier++;
			UpdateStorefrontSize();
			
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
	
	function UpdateStorefrontSize() {			
		let storefrontSlots = $("#storefront .fooditem").length;
		let expectedSlots = 0;
		let regionBonus = 0;
		if (v.region >=2) {
			regionBonus = v.region -1;
		}
		
		expectedSlots = +v.storeSlots + +regionBonus + +v.restaurantTier;
		
		if (expectedSlots > 96) {
			expectedSlots = 96;
		}
		
		if (storefrontSlots < expectedSlots) {
			AddStoreSlots(expectedSlots - storefrontSlots);
		}
			
		storefrontSlots = $("#storefront .fooditem").length;	
		if (storefrontSlots > 18) {
			$('#game').addClass('bigmenu');
		} else {
			$('#game').removeClass('bigmenu');
		}			
		if (storefrontSlots == 25) {				
			$('#storefront').addClass('page1');
		}	
		if (storefrontSlots >= 25) {				
			$('#storefront').addClass('pages2').addClass('multipage');
		}			
		if (storefrontSlots >= 49) {
			$('#storefront').addClass('pages3');
		}
		if (storefrontSlots >= 73) {
			$('#storefront').addClass('pages4');
		}
	}

	function SetNewFood(newVal) {
		if (gameState != 'tierup') {
			return false;
		} 
		
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
			SetGameState('normal');			
			$('#options	.inner').html('');
			UpdateFoodItems();
			$('#progressbars').fadeIn(500);
			$('#prestige_button_locked').hide();
			$('#progress_button_locked').hide();
			$('#prestige_button').fadeIn(500);
			$('#progress_button').fadeIn(500);
		}
		
		if ((v.region == 6) && (newVal != 1)) {
			v.onlyLeft = false;
		}
	}
	
	function SelectNewPerk() {
		CheckAvailablePerks();
		if (v.newPerks.length < 1) {			
			SetGameState('normal');
			$('#options	.inner').html('');
			
			UpdateIncome();
			UpdateButtonsOnChange();
			UpdateFoodItems();
			return false;
		}		
		SetGameState('perk');
		// Get perks
		let optionsHTML = '';
		let rnd1 = GetRandomInt(0,v.newPerks.length - 1);
		
		if ((v.region > 10) || ( (v.region > 1) && (v.region > GetRandomInt(0, 19)) )) { // 1st perk guaranteed top in outer regions
			let perksArray = JSON.parse(JSON.stringify(v.perks));		
			perksArray = perksArray.sort(function (a, b) {						
			if (+GetPerkLevelFromName(a) > GetPerkLevelFromName(b)) {
					return -1;
				} else {
					return 1;
				}
			});			
						
			let nextTopPerk = '';
			if (perksArray.length > 0) {
				let topPerk = perksArray[0];				
									
				for (let perkName in defaultPerkStats) {
					if (defaultPerkStats[perkName].prerequisite == topPerk) {
						nextTopPerk = perkName;
					}
				}	
			}
			
			if (nextTopPerk != '') {
				for (let perkID in v.newPerks) {		
					if (v.newPerks[perkID] == nextTopPerk) {
						if (v.skills.triple_choice === 'HardResetGame()') {
							rnd1 = perkID;
						} else {
							if (GetRandomInt(0,1) == 1) {
								rnd1 = perkID;
							}
						}
					}	
				}	
			}
		}
		
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
		optionsHTML += 	'<button class="perk" data-perk="'+v.newPerks[rnd2]+'" onClick="SetNewPerk(\''+v.newPerks[rnd2]+'\');v.onlyLeft = false;">'+defaultPerkStats[v.newPerks[rnd2]].name+'</button>';
		optionsHTML += '</div>';
		if (v.skills.triple_choice === 'HardResetGame()') {
			optionsHTML += '<div id="new3" style="padding: 3px; width: 30%; display:inline-block;margin-bottom: 12px;"><br>';
			optionsHTML += '<button class="perk" data-perk="'+v.newPerks[rnd3]+'" onClick="SetNewPerk(\''+v.newPerks[rnd3]+'\');v.onlyLeft = false;">'+defaultPerkStats[v.newPerks[rnd3]].name+'</button>';
			optionsHTML += '</div>';
		}
		
		$('#options	.inner').html(optionsHTML);
		$('#options .tr_label').text('Choose one perk');
		
		$('#options button').each(
			function() {
				$(this).off('mouseover').on('mouseover', function (e) {				
					let thisDataPerk = $(this).attr('data-perk');
					let thisName = $(this).text();
					if (thisDataPerk == '') {
						return false;
					}
					
					let desc = '<b style="font-size: 16px;">' + thisName + '</b><br>';
					desc += defaultPerkStats[thisDataPerk].desc;

					if ($(this).parent().attr('id') == 'new1') {
						desc += '<br><br>Hotkey: Q<br>';
					}
					if ($(this).parent().attr('id') == 'new2') {
						desc += '<br><br>Hotkey: W<br>';
					}
					if ($(this).parent().attr('id') == 'new3') {
						desc += '<br><br>Hotkey: E<br>';
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
		
		UpdateIncome();
		UpdateButtonsOnChange();
		UpdateFoodItems();
	}
	
	function CheckAvailablePerks() {
		v.newPerks = [];
		for (let perkName in defaultPerkStats) {
			if ( (defaultPerkStats[perkName].prerequisite == '') || (v.perks.includes(defaultPerkStats[perkName].prerequisite)) ) {
				if (!(v.exhaustedPerks.includes(perkName))) {
					if (v.skills['tier100perks'] >= 1) {
						v.newPerks.push(perkName);
					} else {
						if (perkName[perkName.length-1] == '4') {
							if (v.skills['tier4perks'] >= 1) {
								v.newPerks.push(perkName);
							}
						} else {
							if (perkName[perkName.length-1] != '5') {
								v.newPerks.push(perkName);
							}								
						}
					}	
				}	
			}
		}
	}
	
	function SetNewPerk(perkName) {
		if (isMobile()) {
			$('#options	button').removeClass('selected');
			$('#options	button[data-perk="'+perkName+'"]').addClass('selected').trigger('hover');
			$('#options	.set_new_perk_mobile').remove();
			$('#options .inner').append('<div class="set_new_perk_mobile"><button onClick="SetNewPerkMobile(\''+perkName+'\');">Choose</button></div>');
			
			return false;
		}
		
		
		if (gameState != 'perk') {
			return false;
		}
		v.perks.push(perkName);
		v.exhaustedPerks.push(perkName);
		RemoveFromArray(v.perks, defaultPerkStats[perkName].prerequisite);
		
		if ((perkName === 'disc1') || (perkName === 'disc2') || (perkName === 'disc3') || (perkName === 'disc4')) {
			v.discontinueTokens = +v.discontinueTokens + +defaultPerkStats[perkName].effect;
		}
		if ((perkName === 'coupons1') || (perkName === 'coupons2') || (perkName === 'coupons3') || (perkName === 'coupons4')) {
			v.coupons = +v.coupons + +defaultPerkStats[perkName].effect;
		}
		if ((perkName === 'delivery1') || (perkName === 'delivery2') || (perkName === 'delivery3') || (perkName === 'delivery4')) {
			v.deliveryCooksMax = +v.deliveryCooksMax + +defaultPerkStats[perkName].effect;
		}		

		SetGameState('normal');
		$('#options	.inner').html('');
		UpdateFoodItems();
		UpdateIncome();
		$('#progressbars').fadeIn(500);
		$('#prestige_button_locked').hide();
		$('#prestige_button').fadeIn(500);
		
	}
	
	function SetNewPerkMobile(perkName) {
		if (gameState != 'perk') {
			return false;
		}
				
		if ( (v.region == 6) && 
			( ($('#options button').eq(1).hasClass('selected')) || ($('#options button').eq(2).hasClass('selected')) ) ) {
			v.onlyLeft = false;
		}		
		
		v.perks.push(perkName);
		v.exhaustedPerks.push(perkName);
		RemoveFromArray(v.perks, defaultPerkStats[perkName].prerequisite);
		
		if ((perkName === 'disc1') || (perkName === 'disc2') || (perkName === 'disc3') || (perkName === 'disc4')) {
			v.discontinueTokens = +v.discontinueTokens + +defaultPerkStats[perkName].effect;
		}
		if ((perkName === 'coupons1') || (perkName === 'coupons2') || (perkName === 'coupons3') || (perkName === 'coupons4')) {
			v.coupons = +v.coupons + +defaultPerkStats[perkName].effect;
		}
		if ((perkName === 'delivery1') || (perkName === 'delivery2') || (perkName === 'delivery3') || (perkName === 'delivery4')) {
			v.deliveryCooksMax = +v.deliveryCooksMax + +defaultPerkStats[perkName].effect;
		}		

		SetGameState('normal');
		$('#options	.inner').html('');
		UpdateFoodItems();
		UpdateIncome();
		$('#progressbars').fadeIn(500);
		$('#prestige_button_locked').hide();
		$('#prestige_button').fadeIn(500);
		$descriptionBox.html('');
	}
	
	function SelectStarterRestaurant() {
		$('#dishwashing').hide();
		$('#default').hide();
		$('#storefront').hide();
		SetGameState('selectStarterRestaurant');
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
			for (let i = 0; i < 19; i++) {
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
			optionsHTML += 	'<br><button onClick="SetDefaultFood(1)">Choose</button>';			
			optionsHTML += '</div>';
			optionsHTML += '<div id="new2" style="padding: 3px; border: 1px solid #c78888; display:inline-block;margin-bottom: 12px;"><b class="restaurantname" style="color:#c78888; width:200px;height: 36px;display: block;">'+GenerateRestaurantName()+'</b>';
			optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + starterFood[rnd3] + '" data-qty="'+rndQty3+'"><span class="qty">'+rndQty3+'</span></div></div>';
			optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + starterFood[rnd4] + '" data-qty="'+rndQty4+'"><span class="qty">'+rndQty4+'</span></div></div>';
			optionsHTML += 	'<br><button onClick="SetDefaultFood(2)">Choose</button>';
			optionsHTML += '</div>';
			if (v.skills.triple_choice === 'HardResetGame()') {
				optionsHTML += '<div id="new3" style="padding: 3px; border: 1px solid #c78888; display:inline-block;margin-bottom: 12px;"><b class="restaurantname" style="color:#c78888; width:200px;height: 36px;display: block;">'+GenerateRestaurantName()+'</b>';
				optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + starterFood[rnd5] + '" data-qty="'+rndQty5+'"><span class="qty">'+rndQty5+'</span></div></div>';
				optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + starterFood[rnd6] + '" data-qty="'+rndQty6+'"><span class="qty">'+rndQty6+'</span></div></div>';
				optionsHTML += 	'<br><button onClick="SetDefaultFood(3)">Choose</button>';
				optionsHTML += '</div>';
			}
		} else { //Tier2-3			
			optionsHTML += '<div style="font-size: 12px; margin-top: -5px; padding-bottom: 5px;">Now you can also swap them out during the game</div>';
			optionsHTML += '<select id="new_food_select_1">';
			for (let foodName in defaultFoodStats) {		
				if (defaultFoodStats[foodName].class_a != 'buff') {
					if ( (defaultFoodStats[foodName].baseIncome <= 4) || ((defaultFoodStats[foodName].baseIncome == 8) && (v.skills.tier4food >= 1)) ) {
						optionsHTML += '<option name="'+foodName+'" value="'+foodName+'" style="background-image:url(img/food/'+foodName+'.png);line-height: 40px; height: 40px; padding-left: 45px;">'+BeautifyDataType(foodName)+'</options>';
					}
				}	
			}
			optionsHTML += '</select>';
			optionsHTML += '<select id="new_food_select_2">';
			for (let foodName in defaultFoodStats) {				
				if (defaultFoodStats[foodName].class_a != 'buff') {
					if ( (defaultFoodStats[foodName].baseIncome <= 4) || ((defaultFoodStats[foodName].baseIncome == 8) && (v.skills.tier4food >= 1)) ) {
						optionsHTML += '<option name="'+foodName+'" value="'+foodName+'">'+BeautifyDataType(foodName)+'</options>';
					}	
				}
			}
			optionsHTML += '</select>';
			optionsHTML += '<br>';
			optionsHTML += '<div id="new1">';
			if (v.skills.tier4food >= 1) {
				optionsHTML += '<div class="fooditem-wrapper"><div id="starter_fooditem_1" class="fooditem" data-buffs="" data-type="assorted_macarons" data-qty="'+v.skills['maxCook']+'"><span class="qty">'+v.skills['maxCook']+'</span></div></div>';
				optionsHTML += '<div class="fooditem-wrapper"><div id="starter_fooditem_2" class="fooditem" data-buffs="" data-type="assorted_macarons" data-qty="'+v.skills['maxCook']+'"><span class="qty">'+v.skills['maxCook']+'</span></div></div>';
			} else {
				optionsHTML += '<div class="fooditem-wrapper"><div id="starter_fooditem_1" class="fooditem" data-buffs="" data-type="banana_sandwich" data-qty="'+v.skills['maxCook']+'"><span class="qty">'+v.skills['maxCook']+'</span></div></div>';
				optionsHTML += '<div class="fooditem-wrapper"><div id="starter_fooditem_2" class="fooditem" data-buffs="" data-type="banana_sandwich" data-qty="'+v.skills['maxCook']+'"><span class="qty">'+v.skills['maxCook']+'</span></div></div>';
			}
			optionsHTML += '<b class="restaurantname" style="color:#a618d2; display: block;">'+GenerateRestaurantName()+'</b>';
			optionsHTML += 	'<button onClick="SetDefaultFood(1)">Choose</button>';
			if (v.region >= 1) {
				optionsHTML += 	'<br>Or<br>';
				optionsHTML += 	'<button onClick="GoToHistory();">Franchise...</button>';
				$('#options').addClass('orFranchise');
			}	
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
		
		if ((v.skills['tier2_3starter'] >= 1)) { // Tier2-3 starter	- sort food items and select needed
			let sel1 = $('#new_food_select_1');			
			let opts_list1 = sel1.find('option');
			opts_list1.sort(function(a, b) { return $(a).text() > $(b).text() ? 1 : -1; });
			sel1[0].selectedIndex = 0;
			sel1.html('').append(opts_list1);
			sel1 = $('#new_food_select_1');	
			sel1.off('change').on('change', function (e) {
				$('#new1 .fooditem').eq(0).attr('data-type', $(this).val()); 
			});
			
			let sel2 = $('#new_food_select_2');			
			let opts_list2 = sel2.find('option');
			opts_list2.sort(function(a, b) { return $(a).text() > $(b).text() ? 1 : -1; });
			sel2[0].selectedIndex = 0;
			sel2.html('').append(opts_list2);
			sel2 = $('#new_food_select_2');					
			sel2.off('change').on('change', function (e) {
				$('#new1 .fooditem').eq(1).attr('data-type', $(this).val()); 
			});
			
			
			if ((v.starterFood1 === undefined) || (v.starterFood1 === '')) {
				sel1[0].selectedIndex = 0;
			} else {
				$('#new_food_select_1').val(v.starterFood1);				
				$('#new_food_select_1').change();
			}
			
			if ((v.starterFood2 === undefined) || (v.starterFood2 === '')) {
				sel2[0].selectedIndex = 0;
			} else {
				$('#new_food_select_2').val(v.starterFood2);
				$('#new_food_select_2').change();
			}
		}
		
		$('#options .tr_label').text('Select starter restaurant');
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
					
					if ( (v.region == 4) && (thisBaseIncome == 4) ) {
						thisBaseIncome = 8;
					} else {
						if ( (v.region == 4) && (thisBaseIncome == 8) ) {
							thisBaseIncome = 4;
						}
					}
					
					if ( (v.region == 8) && (thisBaseIncome == 2) ) {
						thisBaseIncome = 8;
					} else {
						if ( (v.region == 8) && (thisBaseIncome == 8) ) {
							thisBaseIncome = 2;
						}
					}
					
					if ( (v.region == 10) && (thisBaseIncome == 1) ) {
						thisBaseIncome = 8;
					} else {
						if ( (v.region == 10) && (thisBaseIncome == 8) ) {
							thisBaseIncome = 1;
						}
					}
					
					if ((v.region > 10) && (OUTER_REGIONS_DISHES[v.region - 10] != undefined)) {
						let currentTrend = OUTER_REGIONS_DISHES[v.region - 10];
						if ((currentTrend != undefined) && ($(this).attr('data-type') == currentTrend) && (!debug2)) {
							thisBaseIncome = 20;
						}
					}
					if (v.region > 99) {
						thisBaseIncome = 20;
					}

					let thisDataTypeCapitalized = BeautifyDataType(thisDataType);

					let desc = '<b style="font-size: 16px;">' + thisDataTypeCapitalized + '</b><br>';
					desc += '<b class="category_circle" style="color:'+colors[thisClassA]+'">●</b> ' + BeautifyDataType(thisClassA) + '<br>';
					desc += '<b class="category_circle" style="color:'+colors[thisClassB]+'">●</b> ' + BeautifyDataType(thisClassB) + '<br>';
					desc += 'Base income: <b>' + thisBaseIncome + '</b><br>';
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
	
	function GoToHistory() {
		$('#info_button').trigger('click');
		$('.infoTabMenu .info_tab_button').eq(2).trigger('click');
	}
	
	function SetDefaultFood(newVal) {		
		let newFood1 = $('#new'+newVal+ ' .fooditem').eq(0).attr('data-type');
		let newFood1Qty = $('#new'+newVal+ ' .fooditem').eq(0).attr('data-qty');
		let newFood2 = $('#new'+newVal+ ' .fooditem').eq(1).attr('data-type');
		let newFood2Qty = $('#new'+newVal+ ' .fooditem').eq(1).attr('data-qty');
		let newName = $('#new'+newVal+ ' .restaurantname').eq(0).text();
		let newDefaultHtml = '';
		v.restaurantName = newName;				
				
		$('#default').html('<div class="tr_label restaurantname">Restaurant name</div><div class="fooditems"></div>');		
		$('#game .restaurantname').text(newName);		
		$('#default .fooditems').append('<div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="'+newFood1+
			'" data-qty="'+newFood1Qty+'"><span class="qty">'+AbbreviateNumber2(newFood1Qty)+'</span></div></div>');
		$('#default .fooditems').append('<div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="'+newFood2+
			'" data-qty="'+newFood2Qty+'"><span class="qty">'+AbbreviateNumber2(newFood2Qty)+'</span></div></div>');
		
		if (v.skills['precise_science'] >= 1) {
			$('#default').append('<div class="science_div"></div>');
			$('#default .science_div').append(science_select);
			$('#default .science_div').append('<button class="science" onClick="SetScience();">Apply science</button>');
		} else if (v.skills['science'] >= 1) {
			$('#default').append('<button class="science" onClick="DoScience();">Apply science</button>');
		}		
		
		if (v.skills['tier2_3starter'] >= 1) {
			if (v.region < 1) {
				if (v.activeFood.indexOf(newFood1) === -1) {
					v.activeFood.push(newFood1);				
					RemoveFromArray(v.newFood, newFood1);
				}	
				if (v.activeFood.indexOf(newFood2) === -1) {
					v.activeFood.push(newFood2);				
					RemoveFromArray(v.newFood, newFood2);
				}		
			}	
			v.starterFood1 = newFood1;
			v.starterFood2 = newFood2;
		}

		$('#default').show();
		$('#storefront').show();		
		$('#dishwashing').hide();				
		$('#default').show();		
		SetGameState('normal');		
		$('#options	.inner').html('');
		UpdateFoodItems();
		UpdateIncome();
		UpdateButtonsOnChange();
		UpdateStorefrontSize();
	}
	
	function RenameRestaurant() {
		let newName = GenerateRestaurantName();
		v.restaurantName = newName;	
		$('#game .restaurantname').text(v.restaurantName);
		$('#info_restaurant .restaurantname').text(v.restaurantName);
	}
	
	function DoScience() {
		let tempCategories = Object.keys(v.categoryBonuses);			
		let defFood1 = $('#default .fooditem').eq(0).attr('data-type');
		let defFood2 = $('#default .fooditem').eq(1).attr('data-type');		
		// do not make meat dishes vegan, premium dishes cheap, and vice versa
		if (
			(defaultFoodStats[defFood1].class_a == 'meat') ||
			(defaultFoodStats[defFood1].class_b == 'meat') ||
			(defaultFoodStats[defFood2].class_a == 'meat') ||
			(defaultFoodStats[defFood2].class_b == 'meat')			
		   ) {
			tempCategories = tempCategories.filter(function(e) { return e !== 'meat' });
			tempCategories = tempCategories.filter(function(e) { return e !== 'vegan' });
		}	
		if (
			(defaultFoodStats[defFood1].class_a == 'vegan') ||
			(defaultFoodStats[defFood1].class_b == 'vegan') ||
			(defaultFoodStats[defFood2].class_a == 'vegan') ||
			(defaultFoodStats[defFood2].class_b == 'vegan')			
		   ) {
			tempCategories = tempCategories.filter(function(e) { return e !== 'meat' });
			tempCategories = tempCategories.filter(function(e) { return e !== 'vegan' });
		}	
		
		if (
			(defaultFoodStats[defFood1].class_a == 'cheap') ||
			(defaultFoodStats[defFood1].class_b == 'cheap') ||
			(defaultFoodStats[defFood2].class_a == 'cheap') ||
			(defaultFoodStats[defFood2].class_b == 'cheap')			
		   ) {
			tempCategories = tempCategories.filter(function(e) { return e !== 'cheap' });
			tempCategories = tempCategories.filter(function(e) { return e !== 'premium' });
		}	
		if (
			(defaultFoodStats[defFood1].class_a == 'premium') ||
			(defaultFoodStats[defFood1].class_b == 'premium') ||
			(defaultFoodStats[defFood2].class_a == 'premium') ||
			(defaultFoodStats[defFood2].class_b == 'premium')			
		   ) {
			tempCategories = tempCategories.filter(function(e) { return e !== 'cheap' });
			tempCategories = tempCategories.filter(function(e) { return e !== 'premium' });
		}
		
		tempCategories = tempCategories.filter(function(e) { return e !== defaultFoodStats[defFood1].class_a });
		tempCategories = tempCategories.filter(function(e) { return e !== defaultFoodStats[defFood1].class_b });
		tempCategories = tempCategories.filter(function(e) { return e !== defaultFoodStats[defFood2].class_a });
		tempCategories = tempCategories.filter(function(e) { return e !== defaultFoodStats[defFood2].class_b });
		
		let rnd1 = GetRandomInt(0, tempCategories.length -1);
		
		let tempCategory = tempCategories[rnd1];
		
		$('#game button.science').hide();
		$('#default').append('<p id="default_text">These dishes will now also be <br><b id="default_dots">.</b></p>');
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
			if (v.scienceCategory !== 'fastfood') {
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
	
	function SetScience() {		
		let defFood1 = $('#default .fooditem').eq(0).attr('data-type');
		let defFood2 = $('#default .fooditem').eq(1).attr('data-type');
		let selectedScience = $('#science_select').val(); 
		
		if ((defFood1 == undefined) || (defFood2 == undefined)) {
			$('<div title="Error" style="text-align:center;">Restaurant dish slot is empty.</div>').dialog({
				modal: true,
				buttons: {
					Ok: function() {
						$( this ).dialog( "close" );
					}
				}
			});	
			return false;
		}
		
		if (
			(defaultFoodStats[defFood1].class_a == selectedScience) ||
			(defaultFoodStats[defFood1].class_b == selectedScience) ||
			(defaultFoodStats[defFood2].class_a == selectedScience) ||
			(defaultFoodStats[defFood2].class_b == selectedScience) 
		   ) {
			$('<div title="Error" style="text-align:center;">Can\'t apply a category that\'s already on a dish.</div>').dialog({
				modal: true,
				buttons: {
					Ok: function() {
						$( this ).dialog( "close" );
					}
				}
			});	
			return false;   		
		}	   
		v.scienceCategory = selectedScience;
		v.scienceType1 = defFood1; 
		v.scienceType2 = defFood2; 
		UpdateFoodItems();
		UpdateIncome();
		$('#default_text').remove();
		$('#game button.science').hide();
		$('#science_select').hide();
		$('#default').css('height', '120px');		
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
			let workDone = false; //button triggered
			$.each(dishwashing.dirty, function( arIndex, arValue ) { // take top plate from the stack
				if (!workDone) {
					if (arValue != '') { // dirty plate in the sink - next clean it
						dishwashing.dirty[arIndex] = '';
						dishwashing.sink = arValue;
						$('#dwNewBatch').prop(	'disabled', true);
						$('#dwTake').prop(		'disabled', true);
						$('#dwClean').prop(		'disabled', false);
						$('#dwWash').prop(		'disabled', true);
						$('#dwPut').prop(		'disabled', true);
						$('#dwDone').prop(		'disabled', true);
						workDone = true;
					}
				}
			});
		}

		DishwashingRefresh();
	}
	
	function DishwashingClean() {
		if ((dishwashing.sink == '') || (dishwashing.sink == '0')) { // do nothing
			DishwashingRefresh();
			return false;
		}
		
		dishwashing.sink = 'd'; // clean full-dirty plate to half-dirty
		// the plate is half-dirty now, next to wash it
		$('#dwNewBatch').prop(	'disabled', true);
		$('#dwTake').prop(		'disabled', true);
		$('#dwClean').prop(		'disabled', true);
		$('#dwWash').prop(		'disabled', false);
		$('#dwPut').prop(		'disabled', true);
		$('#dwDone').prop(		'disabled', true);
		DishwashingRefresh();
	}	

	function DishwashingWash() {
		if (dishwashing.sink == 'd') { // wash half-dirty plate
			dishwashing.sink = '0';
			// the plate is clean now, next to put it
			$('#dwNewBatch').prop(	'disabled', true);
			$('#dwTake').prop(		'disabled', true);
			$('#dwClean').prop(		'disabled', true);
			$('#dwWash').prop(		'disabled', true);
			$('#dwPut').prop(		'disabled', false);
			$('#dwDone').prop(		'disabled', true);
			DishwashingRefresh();
			return false;
		}		
	}	
	
	function DishwashingPut() {
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
			if (!(dishwashing.dirty.equals(['','','','','']))) { // now take new plate
				$('#dwNewBatch').prop(	'disabled', true);
				$('#dwTake').prop(		'disabled', false);
				$('#dwClean').prop(		'disabled', true);
				$('#dwWash').prop(		'disabled', true);
				$('#dwPut').prop(		'disabled', true);
				$('#dwDone').prop(		'disabled', true);
			} else { // now press Done
				$('#dwNewBatch').prop(	'disabled', true);
				$('#dwTake').prop(		'disabled', true);
				$('#dwClean').prop(		'disabled', true);
				$('#dwWash').prop(		'disabled', true);
				$('#dwPut').prop(		'disabled', true);
				$('#dwDone').prop(		'disabled', false);
			}
			DishwashingRefresh();
			return false;
		}
	}
	
	function DishwashingDone() {
		if (dishwashing.clean.equals(["0","0","0","0","0"])) { // Done - get money
			dishwashing.sink = '';
			dishwashing.clean = ['','','','',''];
			$('#dwNewBatch').prop(	'disabled', false);
			$('#dwTake').prop(		'disabled', true);
			$('#dwClean').prop(		'disabled', true);
			$('#dwWash').prop(		'disabled', true);
			$('#dwPut').prop(		'disabled', true);
			$('#dwDone').prop(		'disabled', true);
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
			dishwashingReward = dishwashingReward + (v.incomeWithDeliveries*5);
			$('#plus_money').html('+'+AbbreviateNumber(dishwashingReward)+'&nbsp;<span>💲</span>');
			v.money = +v.money + +dishwashingReward;
			v.prestigePointMoneyEarned += +dishwashingReward;
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
	}

	function DishwashingNewBatch() {
		if ( (dishwashing.clean.equals(["","","","",""])) && (dishwashing.dirty.equals(["","","","",""])) && (dishwashing.sink == "") ) { // get new batch
			dishwashing.dirty = [GetRandomInt(1,9),GetRandomInt(1,9),GetRandomInt(1,9),GetRandomInt(1,9),GetRandomInt(1,9)];			
			$('#dwNewBatch').prop(	'disabled', true);
			$('#dwTake').prop(		'disabled', false);
			$('#dwClean').prop(		'disabled', true);
			$('#dwWash').prop(		'disabled', true);
			$('#dwPut').prop(		'disabled', true);
			$('#dwDone').prop(		'disabled', true);
			DishwashingRefresh();
		}		
	}
	
	function GoToDishwashing() {
		$('#dishwashing').show();
		$('#go_to_starter').show();		
		$('#default').hide();
	}
	
	function GoToStarter() {
		$('#dishwashing').hide();
		$('#default').show();
	}

	function DishwashingMoneyAnimation() {
		$('#plus_money').css('transform', 'translateY(30px)');
		$('#plus_money').show();
		$('#plus_money').css('transform', 'translateY(0px)');
		setTimeout(function() {
				$('#plus_money').hide();
			}, 1000);
	}
	
	function RestaurantIncomeRecordAnimation() {
		if (!debug2) {
			$('#restaurant_income_record').css('transform', 'translateY(-30px)');
			$('#restaurant_income_record').show();
			$('#restaurant_income_record').css('transform', 'translateY(0px)');
			setTimeout(function() {
				$('#restaurant_income_record').hide();
			}, 1000);
		}		
	}
	
	function DishIncomeRecordAnimation() {
		if (!debug2) {
			$('#dish_income_record').css('transform', 'translateY(30px)');
			$('#dish_income_record').show();
			$('#dish_income_record').css('transform', 'translateY(0px)');
			setTimeout(function() {
				$('#dish_income_record').hide();
			}, 1000);
		}		
	}
	
	function DishQtyRecordAnimation() {
		if (!debug2) {
			$('#dish_qty_record').css('transform', 'translateY(30px)');
			$('#dish_qty_record').show();
			$('#dish_qty_record').css('transform', 'translateY(0px)');
			setTimeout(function() {
				$('#dish_qty_record').hide();
			}, 1000);
		}		
	}
	
	function DishwashingToggle() {
		if (dishwashingOpen) {
			$('#dishwashing').css('height', '30px');
			$('#dishwashing .tr_label').text('Dishwashing ▼');
			$('#dwNewBatch').fadeOut(500);
			$('#dwTake').fadeOut(500);
			$('#dwClean').fadeOut(500);
			$('#dwWash').fadeOut(500);
			$('#dwPut').fadeOut(500);
			$('#dwDone').fadeOut(500);
			dishwashingOpen = false;
		} else {
			$('#dishwashing').css('height', '150px');
			$('#dishwashing .tr_label').text('Dishwashing ▲');
			$('#dwNewBatch').fadeIn(500);
			$('#dwTake').fadeIn(500);
			$('#dwClean').fadeIn(500);
			$('#dwWash').fadeIn(500);
			$('#dwPut').fadeIn(500);
			$('#dwDone').fadeIn(500);
			dishwashingOpen = true;
		}
	}
	
	let cookingAnimationActive = false;

	function CookForMoney(numRolls = 1, isSuperCook = false) {
		//console.log('Cook ' + numRolls);
		if ( (v.options.blockOnHL) && (CheckForBlockingHLFood()) ) {
			return false;
		}
		
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
			if ((v.skills['charity'] >= 1) && (!debug2)) {
				AddToCharity();
			}			 
			$('#kitchen .fooditem').each(
				function() {
					if (!debug2) {
						let rnd = GetRandomInt(v.skills.minCook,v.skills.maxCook);
						let $tempItem = $(this);
						$tempItem.fadeTo(20,0.01);
						$tempItem.addClass('small');
						cookingAnimationActive = true;
						setTimeout(function(){
							$tempItem.fadeTo(200,1);
							$tempItem.removeClass('small');
							cookingAnimationActive = false;
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
								if (((v.moneySuperCookCount % 25) == 0) && (v.skills['tier4buff'] >= 1)) {
									if ($tempItem.attr('data-kitchen-num') == 4) {
										$tempItem.attr('data-type', 'fortune_paper');
									}
								}
							}
							if ((rnd * numRolls) > 1) {
								$tempItem.html('<span class="qty">'+AbbreviateNumber2(rnd * numRolls)+'</span>');
							}
							UpdateFoodItems();
							UpdateIncome();
							$tempItem = null;
						}, 10);
						
					} else {
						let rnd = GetRandomInt(v.skills.minCook,v.skills.maxCook);						
						let $tempItem = $(this);
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
							if (((v.moneySuperCookCount % 25) == 0) && (v.skills['tier4buff'] >= 1)) {
								if ($tempItem.attr('data-kitchen-num') == 4) {
									$tempItem.attr('data-type', 'fortune_paper');
								}
							}
						}
						if ((rnd * numRolls) > 1) {
							$tempItem.html('<span class="qty">'+AbbreviateNumber2(rnd * numRolls)+'</span>');
						}
							
						$tempItem = null;
					}	
				}
			);
			
			if (debug2) {
				UpdateKitchenFoodItems();
				v.money = v.money - totalRefreshPrice;
				if ( (v.prestigePointsToGet + v.prestigePointsTotal < 10) && (v.refreshPrice >= v.activeIncome * 40) && (v.activeIncome >= 300) ) { // capped for tutorial
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
				return false;
			}

			if (v.tutorialLevel === 'cooking0') {
				$('#kitchen').html(
					'<div class="tr_label">Kitchen</div>' +
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
					'<div class="tr_label">Kitchen</div>' +
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
					'<div class="tr_label">Kitchen</div>' +
					'<div class="fooditems">' +
						'<div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="coffee" data-qty="1"></div></div>' +
						'<div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="yoghurt" data-qty="1"></div></div>' +
						'<div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="local_soda" data-qty="1"></div></div>' +
					'</div>'
					);
				v.tutorialLevel = 'drinks0';
				$cookButton.prop('disabled', true);
				UpdateTutorial();
				UpdateFoodItems();
			}
			
			v.money = v.money - totalRefreshPrice;
			if ( (v.prestigePointsToGet + v.prestigePointsTotal < 10) && (v.refreshPrice >= v.activeIncome * 40) && (v.activeIncome >= 300) ) { // capped for tutorial
				//do not increase cook cost
				if ( (numRolls == 6) && (isSuperCook) ) {
					v.cookCount = v.cookCount - 6;							
				} else {
					v.cookCount = +v.cookCount + +numRolls;					
				}
			} else {
				if ( (numRolls == 6) && (isSuperCook) ) {
					v.cookCount = v.cookCount - 6;
					v.refreshPrice = Math.round(v.refreshPrice * (1.1 ** 5));					
				} else {
					v.cookCount = +v.cookCount + +numRolls;
					v.refreshPrice = Math.round(v.refreshPrice * (1.1 ** numRolls));
				}
			}
			
			if (
				((v.tutorialLevel === 'tierup0') && (v.refreshPrice >= v.activeIncome * 15)) ||
				((v.tutorialLevel === 'tierup0') && (v.activeIncome >= 7000))
				){ // show idle tutorial
				v.tutorialLevel = 'idle0';
				UpdateTutorial();
			}
			
			if ((v.tutorialLevel == 'idle3') && (v.activeIncome >= 7000)) { // add deliveries
				v.tutorialLevel = 'idle4';	
				$('#delivery_button_locked').hide();
				$deliveryButton.fadeIn(500);
				if (v.deliveryBoxes < 1) {
					v.deliveryBoxes = 1;
				}
				let position = $('#delivery_button').offset();
				position.left  = +position.left + 5;
				position.top  = +position.top - 36;
				ShowFirework(position);
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

	function CookForCoupons(numRolls = 1, isSuperCook = false) {
		//console.log('CookC ' + numRolls);
		if (!(v.skills['coupons'] >= 1)) {
			return false;
		}
		if ( (v.options.blockOnHL) && (CheckForBlockingHLFood()) ) {
			return false;
		}
		if ( (numRolls > 1) && (v.cookCouponsCount < 6) && isSuperCook) {
			return false;
		}
		if (isSuperCook == false) {
			if (v.coupons >= numRolls) {
				v.coupons = v.coupons - numRolls;
				if (v.skills['charity'] >= 1) {
					AddToCharity();
				}
				$('#kitchen .fooditem').each(
					function() {
						let $tempItem = $(this);
						if (!debug2) {					
							let rnd = GetRandomInt(v.skills.minCook, v.skills.maxCook);							
							$tempItem.fadeTo(200,0.01);
							$tempItem.addClass('small');
							cookingAnimationActive = true;
							setTimeout(function(){
								$tempItem.fadeTo(200,1);
								$tempItem.removeClass('small');
								cookingAnimationActive = false;
								let rndFoodType = GetRandomActiveFoodType();
								$tempItem.attr('data-type',rndFoodType);
								$tempItem.attr('data-buffs','');
								$tempItem.text('');
								$tempItem.attr('data-qty',rnd * numRolls);
								$tempItem.html('<span class="qty">'+AbbreviateNumber2(rnd * numRolls)+'</span>');
								UpdateFoodItems();
								UpdateIncome();
								$tempItem = null;
							}, 190);
						} else {
							let rnd = GetRandomInt(v.skills.minCook, v.skills.maxCook);							
							let rndFoodType = GetRandomActiveFoodType();
							$tempItem.attr('data-type',rndFoodType);
							$tempItem.attr('data-buffs','');
							$tempItem.text('');
							$tempItem.attr('data-qty',rnd * numRolls);
							$tempItem.html('<span class="qty">'+AbbreviateNumber2(rnd * numRolls)+'</span>');							
							$tempItem = null;
						}						
					}
				);
				if (debug2) {	
					UpdateKitchenFoodItems();	
					v.cookCouponsCount = +v.cookCouponsCount + +numRolls;
					return false;
				}
				v.cookCouponsCount = +v.cookCouponsCount + +numRolls;
			}
		} else { // Ssupercook and Megacook
			let numSuperRolls = 1;
			if (v.coupons >= 50) {
				if ((v.options.megacookPercent == undefined) || (v.options.megacookPercent < 10) || (v.options.megacookPercent > 25)) {
					v.options.megacookPercent = 20;
				}
				numSuperRolls = Math.floor(v.coupons * v.options.megacookPercent / 500); //
			}
			if (v.coupons - (numSuperRolls*5) >= 0) {
				v.coupons = v.coupons - (numSuperRolls*5);
				if ((v.skills['charity'] >= 1) && (!debug2)) {
					AddToCharity();
				}
				let randomSlot = GetRandomInt(1,5);
				$('#kitchen .fooditem').each(
					function() {
						let $tempItem = $(this);
						if (!debug2) {
							let rnd = GetRandomInt(v.skills.minCook, v.skills.maxCook);							
							$tempItem.fadeTo(200,0.01);
							$tempItem.addClass('small');
							setTimeout(function(){
								$tempItem.fadeTo(200,1);
								$tempItem.removeClass('small');
								let rndFoodType = GetRandomActiveFoodType();
								$tempItem.attr('data-type',rndFoodType);
								$tempItem.text('');
								$tempItem.attr('data-qty',rnd * (numSuperRolls*6));
								$tempItem.html('<span class="qty">'+AbbreviateNumber2(rnd * (numSuperRolls*6))+'</span>');
								
								if ( 
									(v.skills['advanced_coupon_supercook'] >= 1) && 
									($('#storefront .fooditem').eq(0).attr('data-type') != '') && 
									($('#storefront .fooditem').eq(0).attr('data-type') != undefined) &&
									($tempItem.attr('data-kitchen-num') == (randomSlot))
									) {									
									$tempItem.attr('data-type',$('#storefront .fooditem').eq(0).attr('data-type'));									
								}
								
								UpdateFoodItems();
								UpdateIncome();
								$tempItem = null;
							}, 190);
						} else {
							let rnd = GetRandomInt(v.skills.minCook, v.skills.maxCook);							
							let rndFoodType = GetRandomActiveFoodType();
							$tempItem.attr('data-type',rndFoodType);
							$tempItem.text('');
							$tempItem.attr('data-qty',rnd * (numSuperRolls*6));
							$tempItem.html('<span class="qty">'+AbbreviateNumber2(rnd * (numSuperRolls*6))+'</span>');
							
							if ( 
								(v.skills['advanced_coupon_supercook'] >= 1) && 
								($('#storefront .fooditem').eq(0).attr('data-type') != '') && 
								($('#storefront .fooditem').eq(0).attr('data-type') != undefined) &&
								($tempItem.attr('data-kitchen-num') == (randomSlot))
								) {									
								$tempItem.attr('data-type',$('#storefront .fooditem').eq(0).attr('data-type'));
							}
								
							UpdateFoodItems();
							UpdateIncome();
							$tempItem = null;
						}	
					}
				);
				
				if (debug2) {	
					UpdateKitchenFoodItems();	
					v.cookCouponsCount = v.cookCouponsCount - 6;
					return false;
				}
				v.cookCouponsCount = v.cookCouponsCount - 6;
				
				
				
				if (!debug2) {
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
									if ( key === $(this).attr('data-type') ) {
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
		}

		$moneyCoupons.html(v.coupons + ' <span>🔖</span>');
		
		UpdateButtonsOnChange();
		
		if (v.region == 8) {
			v.noCoupons = false;
		}
		
	}
	
	function IsBuffUsable(buffName) {
		let result = false;
		if ( (buffName != 'exotic_flavors') && (buffName != 'food_decoration') && (buffName != 'original_idea') && (buffName != 'fortune_paper') ) {
			return false;
		} else {	
			let storeTarget = '';
			$('#storefront .fooditem').each( function() {													
				if (($(this).attr('data-type') != '') && ($(this).attr('data-type') != undefined)) {
					storeTarget = $(this);
					
					let dropBuffs = {};
					let dragType = buffName;
					let dropType = storeTarget.attr('data-type');
					
					if (storeTarget.attr('data-buffs') != '') {
						dropBuffs = JSON.parse(storeTarget.attr('data-buffs'));
					}
					
					let currentBuffQty = parseInt(dropBuffs[dragType], 10) || 0;															
					if (+currentBuffQty < (50 * v.skills.maxBuff)) {						
						 result = true;
					} 
				}					
			});
		}
		return result;
	}
	
	function CheckForBlockingHLFood() {
		let result = false;
		$('#kitchen .fooditem-wrapper').each( function() {
			if ($(this).css('border-color') == 'rgb(255, 205, 83)') {
				result = true;
			}	
		});
		return result;
	}
	
	function CheckForBlockingHLFoodDelivery() {
		let result = false;
		$('#delivery_kitchen .fooditem-wrapper').each( function() {
			if ($(this).css('border-color') == 'rgb(255, 205, 83)') {
				result = true;
			}	
		});
		return result;
	}
	
	function UpdateButtonsOnTick() {
		if (!debug2) {
			// check if user has money to cook
			if (v.money >= v.refreshPrice) {
				$cookButton.removeClass('disabled').html('Cook<br>' + AbbreviateNumber( (v.refreshPrice * v.currentCookMode) ) + '$');
			} else {
				$cookButton.addClass('disabled').html('Cook<br>' + AbbreviateNumber( (v.refreshPrice * v.currentCookMode) ) + '$');
			}
			if (v.money >= v.refreshPrice*2) {
				$cook2Button.removeClass('disabled').html('Double Cook <br>' + AbbreviateNumber( (v.refreshPrice * v.currentCookMode) ) + '$');
			} else {
				$cook2Button.addClass('disabled').html('Double Cook <br>' + AbbreviateNumber( (v.refreshPrice * v.currentCookMode) ) + '$');
			}
			if (v.money >= v.refreshPrice*3) {
				$cook3Button.removeClass('disabled').html('Triple Cook <br>' + AbbreviateNumber( (v.refreshPrice * v.currentCookMode) ) + '$');
			} else {
				$cook3Button.addClass('disabled').html('Triple Cook <br>' + AbbreviateNumber( (v.refreshPrice * v.currentCookMode) ) + '$');
			}
			if (v.money >= v.refreshPrice*6) {
				$cook6Button.removeClass('disabled').html('Sextuple&nbsp;Cook<br>' + AbbreviateNumber( (v.refreshPrice * v.currentCookMode) ) + '$');
			} else {
				$cook6Button.addClass('disabled').html('Sextuple&nbsp;Cook<br>' + AbbreviateNumber( (v.refreshPrice * v.currentCookMode) ) + '$');
			}		

			if (v.coupons >= 1) {
				$cookCouponsButton.removeClass('disabled');
			} else {
				$cookCouponsButton.addClass('disabled');
			}
			
			if (v.coupons >= 2) {
				$cook2CouponsButton.removeClass('disabled');
			} else {
				$cook2CouponsButton.addClass('disabled');
			}
			
			if (v.coupons >= 3) {
				$cook3CouponsButton.removeClass('disabled');
			} else {
				$cook3CouponsButton.addClass('disabled');
			}
			
			if (v.coupons >= 6) {
				$cook6CouponsButton.removeClass('disabled');
			} else {
				$cook6CouponsButton.addClass('disabled');
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
				if ((v.options.megacookPercent == undefined) || (v.options.megacookPercent < 10) || (v.options.megacookPercent > 25)) {
					v.options.megacookPercent = 20;
				}
				$superCookCouponsButton.html('Megacook<br>' + (Math.floor(v.coupons * v.options.megacookPercent / 500) *5) + '<span style="opacity:0.8">🔖</span>');
			}
			
			// timers
			
			let cookDiff = (v.refreshPrice * v.currentCookMode) - v.money;
			let cookTime = 0;
			if ( (cookDiff > 0) && (v.activeIncome > 0) && (t[v.tutorialLevel].val >= t['finished0'].val) ) {
				cookTime = BeautifyTime(cookDiff / v.incomeWithDeliveries);
				$cookTime.text(cookTime);
			} else {
				$cookTime.text('');
			}

			let superCookPrice = v.refreshPrice * 5;
			let superCookDiff = superCookPrice - v.money;
			let superCookTime = 0;
			if ((superCookDiff > 0) && (v.activeIncome > 200) && (v.cookCount >= 6)) {
				superCookTime = BeautifyTime(superCookDiff / v.incomeWithDeliveries);
				$superCookTime.text(superCookTime).show();
			} else {
				$superCookTime.hide();
			}
				
			let couponDiff = v.couponShardsBreakpoint - v.couponShards; // 1 min 2 sec
			let moreCouponsTime = (v.currentCookCouponsMode - (v.coupons + 1) ) * v.couponShardsBreakpoint; // 20 min for 2 coupons
			
			if (v.coupons < v.currentCookCouponsMode) {
				
				let couponTime = BeautifyTime(couponDiff + moreCouponsTime);			
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
			
			if (CheckMoneyGoal()) {
				v.unclaimedGoals['c2'] = 1;
			}
			
			if (v.prestigePointsTotal <= 150) {
				let checkGoalsResult = CheckGoals();
			
				if (checkGoalsResult[0]) {
					v.unclaimedGoals['c1'] = 1;
				}
				if (checkGoalsResult[1]) {
					v.unclaimedGoals['c2'] = 1;
				}
				if (checkGoalsResult[2]) {
					v.unclaimedGoals['c3'] = 1;
				}
			}
			
			let numUnclaimedGoals = +v.unclaimedGoals['c1'] + +v.unclaimedGoals['c2'] + +v.unclaimedGoals['c3'];
			
			if (numUnclaimedGoals > 0) {
				let bigHtml = '<span class="em">📑</span> Claim rewards <span class="unclaimed_goals">' +numUnclaimedGoals+ '</span>';
				let smallHtml = '<span class="em">📑</span> <span class="unclaimed_goals">' +numUnclaimedGoals+ '</span>';
				if ($goalsBigButton.html() != bigHtml) {
					$goalsBigButton.html(bigHtml);
				}
				if ($goalsSmallButton.html() != smallHtml) {
					$goalsSmallButton.html(smallHtml);
				}	
			} else {
				$goalsBigButton.html('<span class="em">📑</span> Goals');
				$goalsSmallButton.html('<span class="em">📑</span>');
			}	
		}
	}

	function UpdateButtonsOnChange() {
		if (!debug2) {
			let supercookCouponsText = '......';
			if (v.cookCouponsCount >= 6) {
				$('.supercookCoupons').html('Supercook<br>5 <span class="em" style="opacity:0.8">🔖</span>');
			} else {
				for (let i = 0; i < v.cookCouponsCount; i++) {
					supercookCouponsText = SetCharAt(supercookCouponsText, i, 'o');
				}
				supercookCouponsText = supercookCouponsText.split('o').join('<span class="lightning em">⚡</span>');
				supercookCouponsText = supercookCouponsText.split('.').join('<span class="lightning grayscale em">⚡</span>');
				$('.supercookCoupons').html('Supercook&nbsp;<span class="em" style="opacity:0.8">🔖</span> <div style="padding-top: 2px">' + supercookCouponsText + '</div>');
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
				$('button.new').removeClass('disabled').html('Tier up');
			} else {
				$('button.new').addClass('disabled').html('Unlocks at<br>'+AbbreviateNumberEmoji(v.incomeBreakpoint));
			}

			if (v.activeIncome >= 200) {
				let supercookText = '......';
				if (v.cookCount >= 6) {
					$superCookButton.html('Supercook<br>' + AbbreviateNumber(v.refreshPrice * 5) + '$');
				} else {
					for (let i = 0; i < v.cookCount; i++) {
						supercookText = SetCharAt(supercookText, i, 'o');
					}
					supercookText = supercookText.split('o').join('<span class="lightning em">⚡</span>');
					supercookText = supercookText.split('.').join('<span class="lightning grayscale em">⚡</span>');
					$superCookButton.html('Supercook <div style="padding-top: 2px">' + supercookText + '</div>');					
				}
			} else {
				$superCookButton.html('Unlocks at<br>200/s 💸');
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
			
			//coupons
			
			if (v.currentCookCouponsMode == 1) {
				$cookCouponsButton.show();
			} else {
				$cookCouponsButton.hide();
			}
			if (v.currentCookCouponsMode == 2) {
				$cook2CouponsButton.show();				
			} else {
				$cook2CouponsButton.hide();
			}
			
			if (v.currentCookCouponsMode == 3) {
				$cook3CouponsButton.show();
			} else {
				$cook3CouponsButton.hide();
			}
			
			if (v.currentCookCouponsMode == 6) {
				$cook6CouponsButton.show();
			} else {
				$cook6CouponsButton.hide();
			}
			
			if (v.skills.supersort >= 1) {
				$('.sortByIncome').addClass('supersort');
				$('#btn_sort_delivery').addClass('supersort');
			}
			
			let checkGoalsResult = CheckGoals();
			
			if (checkGoalsResult[0]) {
				v.unclaimedGoals['c1'] = 1;
			}
			if (checkGoalsResult[1]) {
				v.unclaimedGoals['c2'] = 1;
			}
			if (checkGoalsResult[2]) {
				v.unclaimedGoals['c3'] = 1;
			}			
			
			UpdateButtonsOnTick();
		}
	}
	
	function DefineNewVariables() {		
		if (v == null) {
			v = {};
		}
	
		if (v.couponShardsBreakpoint === undefined) {
			v.couponShardsBreakpoint = 600;
		}
		if (v.currentNovelty == undefined) {
			v.currentNovelty =  {
					meat: 50,
					vegan: 50,
					seafood: 50,
					fastfood: 50,
					dessert: 50,
					cheap: 50,
					premium: 50,
					drink: 50
				};
		}
		if (v.nextNovelty == undefined) {
			v.nextNovelty =  {
					meat: 50,
					vegan: 50,
					seafood: 50,
					fastfood: 50,
					dessert: 50,
					cheap: 50,
					premium: 50,
					drink: 50
				};
		}
		if (v.noveltyShards === undefined) {
			v.noveltyShards = 0;
		}
		if (v.noveltyShardsBreakpoint === undefined) {
			v.noveltyShardsBreakpoint = 60*60; // 1 hour
		}	
		
		if (v.bestRestaurant === undefined) {
			v.bestRestaurant = {};
			v.bestRestaurant.income = 0;
		}
		if (v.bestRestaurant.income === undefined) {
			v.bestRestaurant.income = 0;
		}	
		if (v.bestFood === undefined) {
			v.bestFood = {};	
			v.bestFood.income = 0;
		}
		if (v.bestFood.income === undefined) {
			v.bestFood.income = 0;
		}
		if (v.biggestFood === undefined) {
			v.biggestFood = {};	
			v.biggestFood.qty = 0;			
		}		
		if (v.biggestFood.qty === undefined) {
			v.biggestFood.qty = 0;	
		}	
		
		if (v.skills.deliveryTier === undefined) {
			v.skills.deliveryTier = 1;
		}
		
		if (v.deliveryStatus === undefined) {
			v.deliveryStatus = 'wait';
		}
		
		if (v.deliveries === undefined) {
			v.deliveries = [{},{},{}];
		}
		if (v.deliveryCooksMax === undefined) {
			v.deliveryCooksMax = 20;
		}		
		
		if (v.charityFood === undefined) {
			v.charityFood = 0;
		}
		
		if (v.charityBreakpoint === undefined) {
			v.charityBreakpoint = 4;
		}
		
		if (v.foodClassesDeliveryPool === undefined) {
			v.foodClassesDeliveryPool = {};
		}
		
		if (v.deliveryBoxes === undefined) {
			v.deliveryBoxes = 0;
		}
			
		if (v.deliveryBoxesShards === undefined) {
			v.deliveryBoxesShards = 0;
		}
		
		if (v.deliveryBoxesShardsBreakpoint === undefined) {
			v.deliveryBoxesShardsBreakpoint = 600;
		}
		
		if (v.deliveryGiftBoxes === undefined) {
			v.deliveryGiftBoxes = 0;
		}
		
		if (v.deliveryTime === undefined) {
			v.deliveryTime = 0;
		}
		
		if (v.deliveryGiftBoxesCost === undefined) {
			v.deliveryGiftBoxesCost = 1;
		}
		
		if (v.region === undefined) {
			v.region = 0;
		}
		if (v.regionFinishedQuests === undefined) {
			v.regionFinishedQuests = {};
		}
		if (v.regionRewardedQuests === undefined) {
			v.regionRewardedQuests = {};
		}
		
		if (v.incomeMultipliers === undefined) {
			v.incomeMultipliers = {};
			v.incomeMultipliers.used_boosters = 1;
		}
		
		if ((v.incomeMultipliers.used_boosters === undefined) || (isNaN(+v.incomeMultipliers.used_boosters)) || (v.incomeMultipliers.used_boosters === "NaN")) {
			v.incomeMultipliers.used_boosters = 1;
		}
		
		if (v.options.tu_animation === undefined) {
			v.options.tu_animation = false;
		}
		
		if ((v.goals === undefined) || (v.goals['c1'] === 0)) {
			v.goals = {c1: 1, c2: 1, c3: 1};
		}
		
		if ((v.unclaimedGoals === undefined) || (v.unclaimedGoals === 0)) {
			v.unclaimedGoals = {c1: 0, c2: 0, c3: 0};
		}	
		
		if (paid.codes === undefined) {
			paid.codes = [];
		}
	}	
	
	function InitializeButtons() {
		v.options.tu_animation = false;
		$cookButton.off('mouseover').on('mouseover', function (e) {
			let desc = 'Cook<br>';
			if ( t[v.tutorialLevel].val >= t['hasdrinks1'].val ) {
				desc += 'Cook 5 random dishes.<br>';
				desc += 'List of available dishes can be found on the Info tab.<br>';
				desc += '<b>Every use increases the cost, so use it wisely.</b><br>';
				desc += 'The cost of cooking is only reset on prestige.<br>';
			} else {
				desc += 'Cook next tutorial dishes.<br>';
			}

			desc += 'Minimum quantity: ' + v.skills.minCook + '<br>';
			desc += 'Maximum quantity: ' + v.skills.maxCook + '<br>';
			desc += 'Cost: ' + AbbreviateNumber(v.refreshPrice) + '$<br>';
			if ( (v.prestigePointsToGet + v.prestigePointsTotal < 10) && (v.refreshPrice >= v.activeIncome * 40) && (v.activeIncome >= 300) ) { // capped for tutorial
				desc += 'Next cost: ' + AbbreviateNumber(Math.round(v.refreshPrice)) + '$ (capped until 10 Prestige Points)<br>';
			}  else {
				desc += 'Next cost: ' + AbbreviateNumber(Math.round(v.refreshPrice * 1.1)) + '$<br>';
			}
			if (!(isMobile())) {
				desc += '<br>Hotkey: Q<br>';
			}			
			
			if ((v.skills.cook2 >= 1)) {
				desc += '<br>';
				if (isMobile()) {
					desc += 'Hold 3 sec to switch modes.<br>';
				} else {
					desc += 'Right click to switch modes.<br>';
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
			let desc = 'Double Cook<br>';
			desc += 'Cook 5 random dishes.<br>';
			desc += 'Minimum quantity: ' + v.skills.minCook*2 + '<br>';
			desc += 'Maximum quantity: ' + v.skills.maxCook*2 + '<br>';
			desc += 'Cost: ' + AbbreviateNumber(v.refreshPrice*2) + '$<br>';
			desc += 'Next cost: ' + AbbreviateNumber(Math.round(2 * v.refreshPrice * (1.1**2))) + '$<br>';
			if (!(isMobile())) {
				desc += '<br>Hotkey: Q<br>';
			}			
			if (isMobile()) {
				desc += 'Hold 3 sec to switch modes.<br>';
			} else {
				desc += 'Right click to switch modes.<br>';
			}	
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});
		
		$cook3Button.off('mouseover').on('mouseover', function (e) {
			let desc = 'Triple Cook<br>';
			desc += 'Cook 5 random dishes.<br>';
			desc += 'Minimum quantity: ' + v.skills.minCook*3 + '<br>';
			desc += 'Maximum quantity: ' + v.skills.maxCook*3 + '<br>';
			desc += 'Cost: ' + AbbreviateNumber(v.refreshPrice*3) + '$<br>';
			desc += 'Next cost: ' + AbbreviateNumber(Math.round(3 * v.refreshPrice * (1.1**3))) + '$<br>';
			if (!(isMobile())) {
				desc += '<br>Hotkey: Q<br>';
			}
			if (isMobile()) {
				desc += 'Hold 3 sec to switch modes.<br>';
			} else {
				desc += 'Right click to switch modes.<br>';
			}	
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});
		
		$cook6Button.off('mouseover').on('mouseover', function (e) {
			let desc = 'Sextuple Cook<br>';
			desc += 'Cook 5 random dishes.<br>';
			desc += 'Minimum quantity: ' + v.skills.minCook*6 + '<br>';
			desc += 'Maximum quantity: ' + v.skills.maxCook*6 + '<br>';
			desc += 'Cost: ' + AbbreviateNumber(v.refreshPrice*6) + '$<br>';
			desc += 'Next cost: ' + AbbreviateNumber(Math.round(6 * v.refreshPrice * (1.1**6))) + '$<br>';
			if (!(isMobile())) {
				desc += '<br>Hotkey: Q<br>';
			}
			if (isMobile()) {
				desc += 'Hold 3 sec to switch modes.<br>';
			} else {
				desc += 'Right click to switch modes.<br>';
			}
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});		

		$superCookButton.off('mouseover').on('mouseover', function (e) {
			let desc = 'Supercook.<br>';
			desc += 'Cook 6 times for the price of 5.<br>';
			if (v.activeIncome >= 200) {
				desc += 'Needs 6 charges to activate.<br>';
				desc += 'You get charges by cooking normally.<hr>';
				desc += 'Current charges: ' + v.cookCount + '<br>';
				if (v.cookCount > 20) {
					desc += '<b style="color:#f00;">You have a lot of Supercook charges. Please keep in mind that if you don\'t spend them all, your progress might be much slower.</b><br>';
				}
				desc += 'Minimum quantity: ' + (6*v.skills.minCook) + '<br>';
				desc += 'Maximum quantity: ' + (6*v.skills.maxCook) + '<br>';
				if (v.skills['buffs'] >= 1) {
					let scCount = 3 - (v.moneySuperCookCount % 3);
					if (scCount === 0) {						
						scCount = 3;
					}
					desc += 'Supercooks left for Exotic Flavors: ' + scCount + '<br>';					
				}
				if (v.skills['buffs'] >= 2) {
					let scCount = 5 - (v.moneySuperCookCount % 5);
					if (scCount === 0) {						
						scCount = 5;
					}
					desc += 'Supercooks left for Food Decorations: ' + scCount + '<br>';					
				}
				if (v.skills['buffs'] >= 3) {
					let scCount = 10 - (v.moneySuperCookCount % 10);
					if (scCount === 0) {						
						scCount = 10;
					}
					desc += 'Supercooks left for Original Idea: ' + scCount + '<br>';					
				}
				if (v.skills['tier4buff'] >= 1) {
					let scCount = 25 - (v.moneySuperCookCount % 25);
					if (scCount === 0) {						
						scCount = 25;
					}
					desc += 'Supercooks left for Fortune Paper: ' + scCount + '<br>';					
				}				
			}
			if (!(isMobile())) {
				desc += '<br>Hotkey: W<br>';
			}
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});

		$('button.new').off('mouseover').on('mouseover', function (e) {
			let desc = 'Tier up.<br>';
			desc += '- Get +20% income<br>';
			desc += '- Get more menu space<br>';
			desc += '- Unlock new dishes<br>';
			if (v.skills['perks'] >= 1) {
				desc += '- Get a perk<br>';
			}
			if (!(isMobile())) {
				desc += '<br>Hotkey: E<br>';
			}
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});
		
		$cookCouponsButton.off('mouseover').on('mouseover', function (e) {
			let desc = 'Cook for coupons.<br>';
			desc += 'Same as normal Cooking, but costs 1 coupon instead.<br>';
			desc += 'Does not increase normal Cooking price.<br>';
			desc += 'Minimum quantity: ' + v.skills.minCook + '<br>';
			desc += 'Maximum quantity: ' + v.skills.maxCook + '<br>';	
			if (!(isMobile())) {
				desc += '<br>Hotkey: A<br>';
			}
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});		
		$cook2CouponsButton.off('mouseover').on('mouseover', function (e) {
			let desc = 'Cook for coupons.<br>';
			desc += 'Same as normal Cooking, but costs coupons instead.<br>';
			desc += 'Does not increase normal Cooking price.<br>';
			desc += 'Minimum quantity: ' + v.skills.minCook + '<br>';
			desc += 'Maximum quantity: ' + v.skills.maxCook + '<br>';
			if (!(isMobile())) {
				desc += '<br>Hotkey: A<br>';
			}
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});	
		$cook3CouponsButton.off('mouseover').on('mouseover', function (e) {
			let desc = 'Cook for coupons.<br>';
			desc += 'Same as normal Cooking, but costs coupons instead.<br>';
			desc += 'Does not increase normal Cooking price.<br>';
			desc += 'Minimum quantity: ' + v.skills.minCook + '<br>';
			desc += 'Maximum quantity: ' + v.skills.maxCook + '<br>';
			if (!(isMobile())) {
				desc += '<br>Hotkey: A<br>';
			}
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});	
		$cook6CouponsButton.off('mouseover').on('mouseover', function (e) {
			let desc = 'Cook for coupons.<br>';
			desc += 'Same as normal Cooking, but costs coupons instead.<br>';
			desc += 'Does not increase normal Cooking price.<br>';
			desc += 'Minimum quantity: ' + v.skills.minCook + '<br>';
			desc += 'Maximum quantity: ' + v.skills.maxCook + '<br>';
			if (!(isMobile())) {
				desc += '<br>Hotkey: A<br>';
			}
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
				if ((v.options.megacookPercent == undefined) || (v.options.megacookPercent < 10) || (v.options.megacookPercent > 25)) {
					v.options.megacookPercent = 20;
				}	
				let numSuperRolls = Math.floor(v.coupons * v.options.megacookPercent / 500); // 586 coupons -> 29 rolls X 5 coupons (and X 6 results)
				//desc = 'Supercook for coupons.<br>';
				desc = 'Megacook: you have 50+ coupons.<br>';
				desc += 'You can change the percentage of used coupons on the Options tab.<br>';
				desc += 'Coupons used: ' + v.options.megacookPercent + '%<br>';
				desc += 'Cook ' + (numSuperRolls*6) + ' times for the price of ' + (numSuperRolls*5) + ' coupons.<br>';
			} else {
				desc = 'Supercook for coupons.<br>';
				desc += 'Cook 6 times for the price of 5 coupons.<br>';
			}
			if (v.activeIncome >= 200) {
				desc += 'Needs 6 charges to activate.<br>You get charges by cooking for coupons.<hr>';
				desc += 'Current charges: ' + v.cookCouponsCount + '<br>';
				if (v.coupons >= 50) {
					if ((v.options.megacookPercent == undefined) || (v.options.megacookPercent < 10) || (v.options.megacookPercent > 25)) {
						v.options.megacookPercent = 20;
					}
					let numSuperRolls = Math.floor(v.coupons * v.options.megacookPercent / 500); // 586 coupons -> 29 rolls X 5 coupons (and X 6 results)
					desc += 'Minimum quantity: ' + (numSuperRolls*6*v.skills.minCook) + '<br>';
					desc += 'Maximum quantity: ' + (numSuperRolls*6*v.skills.maxCook) + '<br>';	
				} else {	
					desc += 'Minimum quantity: ' + (6*v.skills.minCook) + '<br>';
					desc += 'Maximum quantity: ' + (6*v.skills.maxCook) + '<br>';			
				}	
			}
			if (!(isMobile())) {
				desc += '<br>Hotkey: S<br>';
			}
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});
		
		$('button.sortByIncome').off('mouseover').on('mouseover', function (e) {
			let desc = 'Sort dishes by income.<br>';
			if (v.skills.supersort >= 1) {
				desc += 'Supersort: also adds all highlighted dishes where they belong.<br>';
			}
			if (v.skills.mealOfTheDay >= 1) {
				desc += 'Does not replace current Meal of the Day dishes.<br>';
			}
			if (!(isMobile())) {
				desc += '<br>Hotkey: D<br>';
			}
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});
		
		$moneyCurrent.off('mouseover').on('mouseover', function (e) {
			let desc = 'Amount of money you currently have.<br>';
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});

		$moneyIncome.off('mouseover').on('mouseover', function (e) {
			let desc = 'Your current income per second.<br>Different icons visually represent the orders of magnitude (thousands, millions, etc).';
			
			Object.keys(v.incomeMultipliers).forEach(function(key) {
				let bonusPercentDesc = Math.round((v.incomeMultipliers[key] - 1)*100);
				if (bonusPercentDesc != 0) {
					desc += '<br><br>Bonus from '+BeautifyDataType(key)+': +' + bonusPercentDesc + '%';		
				}	
			});
			
			
			let addedDeliveryPercentage = 0;
			for (let i = 0; i < 3; i++) {			
				if ((v.deliveries[i].time > 0) || v.deliveries[i].expired) {
					addedDeliveryPercentage = +addedDeliveryPercentage + +v.deliveries[i].incomePercentMultiplied;					
				}
			}
			addedDeliveryPercentage = addedDeliveryPercentage.toFixed(1);
			if (addedDeliveryPercentage > 0) {				
				desc += '<br><br>Bonus from Deliveries: +' + addedDeliveryPercentage + '%';
				desc += '<br><br>Resulting income: ' + AbbreviateNumber(v.incomeWithDeliveries) + ' per second';
			}
			
			
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});
		
		$moneyDeliveries.off('mouseover').on('mouseover', function (e) {
			let desc = 'Additional income you get from deliveries.<br> You don\'t lose deliveries on prestige.';
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});
		
		$('#delivery_resources').off('mouseover').on('mouseover', function (e) {
			let desc = 'You get 1 Delivery Box every 10 minutes.<br> When Delivery Box limit is full, you\'ll get 1 Gift Box instead. <br><br>Delivery boxes are used to make Deliveries.<br>Gift boxes are used to Cook additional times in a Delivery.<br><br> You don\'t lose any boxes on prestige. <br><br> Time to next box: <span id="delivery_box_time">' + BeautifyTime(v.deliveryBoxesShardsBreakpoint - v.deliveryBoxesShards) + '</span>';
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});

		$moneyCoupons.off('mouseover').on('mouseover', function (e) {
			let desc = 'Current number of coupons you have.<br> Use coupons to cook for free.<br>';
			if (!(v.skills['fasterCoupons'] >= 1)) {
				desc += 'You earn one coupon every 10 minutes.<br>';
			} else {
				desc += 'You earn one coupon every 5 minutes.<br>';
			}
			desc += 'You don\'t lose coupons on Prestige.';
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});

		$('#category_bonuses').off('mouseover').on('mouseover', function (e) {
			if (currentScreen !== 'delivery') {
				let desc = 'Current food categories in your restaurant and their bonuses.<br><br>';

				let bonusLevels = '';
				let sortedBonuses = SortObjectByValue(v.foodClasses);
				let noveltyHelp = '';
				sortedBonuses.forEach(function(item) {
					bonusLevels += '<div style="width: 95%;"><b class="category_circle" style="color:'+colors[item.k]+'">●</b> ' + BeautifyDataType(item.k) + ': '
									+ '<div style="float:right;">' + Math.round(v.categoryBonuses[item.k] * 100) + ' x ' + item.v + ' = ' + Math.round(v.categoryBonuses[item.k] * 100 * item.v) + '%</div></div>';	
					if (v.currentNovelty[item.k] < 50) {
						noveltyHelp = noveltyHelp + BeautifyDataType(item.k)+ '<br>';
					}
				});

				desc += bonusLevels;

				if (v.hasDuplicates) {
					desc += '<br><b>Warning:</b> you have a duplicate dish in your restaurant. Duplicates don\'t provide additional bonuses, so it is usually better to merge them.';
				}
				
				if ((v.skills.mealOfTheDay >= 1) && (mealOfTheDayActive == false)) {
					desc += '<br><b>Warning:</b> your Meal of the Day is not active. Requirements for activation:<br>' +
								'1st dish: not drink, not dessert<br>' +
								'2nd dish: dessert<br>' +
								'3rd dish: drink<br>'
								;
				}
				
				if ((v.skills.novelty >= 1)) {
					if (noveltyHelp != '') {
						desc += '<br>Bad Novelty Category bonus:<br><b>' +
								noveltyHelp;
						desc += '</b>More information on <br>Info->Restaurant tab.';		
					}
					
				}

				$descriptionBox.html(desc);
				descFadeout = false;
			}	
			e.stopPropagation();
		}).off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});
		
		$('#dishwashing .tr_label').off('mouseover').on('mouseover', function (e) {
			let desc = 'Wash dishes to get money.<br><br>';
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
			desc += 'Rewards:<br> '+dishwashingReward+' + 5*(Restaurant Income).<br><br>';
			desc += 'Click on the triangle to minimize.<br><br>';
			desc += 'Note: full restaurant earns good money even without dishwashing.<br><br>';
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
				currentScreen = target;
				if (target == 'game') {
					UpdateGameScreen();
				}				
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
				if (target == 'delivery') {
					UpdateDeliveryScreen();
					$('#category_bonuses').addClass('delivery_active');
				} else {
					UpdateIncome();
					$('#category_bonuses').removeClass('delivery_active');
				}	
				$('.screen').hide();
				$('.screen#' + target).show();				
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
			v.currentCookCouponsMode = 6;
		} else if (v.skills.cook3 >= 1) {
			v.currentCookCouponsMode = 3;
		} else if (v.skills.cook2 >= 1) {
			v.currentCookCouponsMode = 2;
		} else {
			v.currentCookCouponsMode = 1;		
		}
		
		$cookCouponsButton.hide().unbind('contextmenu').bind('contextmenu',function(e){
			if (v.skills.cook2 >= 1) {
				v.currentCookCouponsMode = 2;		
				UpdateButtonsOnChange();
			}
			return false;
		});
		
		$cook2CouponsButton.hide().unbind('contextmenu').bind('contextmenu',function(e){
			if (v.skills.cook3 >= 1) {
				v.currentCookCouponsMode = 3;				
			} else {
				v.currentCookCouponsMode = 1;			
			}
			UpdateButtonsOnChange();
			return false;
		});
		
		$cook3CouponsButton.hide().unbind('contextmenu').bind('contextmenu',function(e){
			if (v.skills.cook6 >= 1) {
				v.currentCookCouponsMode = 6;				
			} else {
				v.currentCookCouponsMode = 1;
			}
			UpdateButtonsOnChange();
			return false;
		});		
		
		$cook6CouponsButton.hide().unbind('contextmenu').bind('contextmenu',function(e){
			v.currentCookCouponsMode = 1;
			UpdateButtonsOnChange();
			return false;
		});		
		
		
		if (v.skills.cook6 >= 1) {
			v.currentCookCouponsMode = 6;
		} else if (v.skills.cook3 >= 1) {
			v.currentCookCouponsMode = 3;
		} else if (v.skills.cook2 >= 1) {
			v.currentCookCouponsMode = 2;
		} else {
			v.currentCookCouponsMode = 1;		
		}
		
		$goalsBigButton.off('mouseover').on('mouseover', function (e) {
			ShowGoalsDesc();
			descFadeout = false;
			$descriptionBox.css('background', 'rgba(140,150,230,0.2)');
			e.stopPropagation();			
		});					
		$goalsBigButton.off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});
		
		$goalsSmallButton.off('mouseover').on('mouseover', function (e) {
			ShowGoalsDesc();
			descFadeout = false;
			$descriptionBox.css('background', 'rgba(140,150,230,0.2)');
			e.stopPropagation();
		});					
		$goalsSmallButton.off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});
		
		$perksButton.off('mouseover').on('mouseover', function (e) {
			ShowPerksDesc();
			descFadeout = false;
			$descriptionBox.css('background', 'rgba(140,150,230,0.2)');
			e.stopPropagation();
		});					
		$perksButton.off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});
		
		$('.screen_button_locked').off('mouseover').on('mouseover', function (e) {
			let desc = 'Locked for now.<br><br>';			
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		});
		$('.screen_button_locked').off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});
		
		
					
		$('#hard_reset').off('contextmenu').on('contextmenu', function (e) {			
				$( "#dialog-confirm" ).dialog({
					resizable: false,
					height: "auto",
					width: 400,
					modal: true,
					buttons: {
						"Hard reset": function() {
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
						Cancel: function() {
						  $( this ).dialog( "close" );
						}
					}
				});			
			return false;
		});				
		
		for (let perkName in defaultPerkStats) {
			defaultPerkStats[perkName].name = defaultPerkStats[perkName].name.split(' (max)').join('');
			if (v.skills['tier100perks'] >= 1) {
				
			} else {
				if (v.skills['tier4perks'] >= 1) {				
					defaultPerkStats[perkName].name = defaultPerkStats[perkName].name.split('Mastery 4').join('Mastery 4 (max)');
					defaultPerkStats[perkName].name = defaultPerkStats[perkName].name.split('Dish 4').join('Dish 4 (max)');
				} else {
					defaultPerkStats[perkName].name = defaultPerkStats[perkName].name.split('Mastery 3').join('Mastery 3 (max)');
					defaultPerkStats[perkName].name = defaultPerkStats[perkName].name.split('Dish 3').join('Dish 3 (max)');
				}
			}
		}
		
		UpdateButtonsOnChange();
	}
	
	function UpdateGameScreen() {
		UpdateIncome();
		UpdateButtonsOnChange();
	}

	function UpdateFoodItems() {
		if (!debug2) {
			$('#default .fooditem, #storefront .fooditem, #kitchen .fooditem').each(
				function() {			
					if ((!($(this).parent().hasClass('ui-droppable'))) && (!debug2)) {
						$(this).prop('onclick', null).off('click');
						
						if ($(this).attr('onMouseDown') === undefined) {
							$(this).on('mousedown', function (e) {		
									if (e.which == 1) {
										$(this).addClass('being-grabbed');
									}	
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
							revert: function() {
								let obj1 = $(this);
								if (obj1 !== undefined) {
									obj1.addClass('returning');
									setTimeout(function(obj_1 = obj1) {
										obj_1.removeClass('returning');
									},150);}
									return true;
								}	,
							revertDuration: 150,
							containment: ".main_table",
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
							},
							revert: function(event, ui) {
								$(this).removeClass('being-grabbed');
								return true;
							}	
						});
						
						if (!debug2) {

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
								
								if ((v.region > 10) && (OUTER_REGIONS_DISHES[v.region - 11] != undefined)) {
									let currentTrend = OUTER_REGIONS_DISHES[v.region - 11];
									if ((currentTrend != undefined) && ($(this).attr('data-type') == currentTrend) && (!debug2)) {
										thisBaseIncome = 20;
									}
								}
								if (v.region > 99) {
									thisBaseIncome = 20;
								}
								
								let thisScienceCategoryBonus = (v.foodClasses[v.scienceCategory] || 0); // if not a number, then 0
								let thisClassC = '';
							
								if ( (v.scienceCategory !== undefined) && (v.scienceCategory !== '') && ((thisDataType == v.scienceType1) || (thisDataType == v.scienceType2)) ) {
									thisClassC = v.scienceCategory;
								}
								
								if ( (v.region == 4) && (thisBaseIncome == 4) && (thisClassA != 'buff') ) {
									thisBaseIncome = 8;
								} else {
									if ( (v.region == 4) && (thisBaseIncome == 8) ) {
										thisBaseIncome = 4;
									}
								}
								
								if ( (v.region == 8) && (thisBaseIncome == 2) && (thisClassA != 'buff') ) {
									thisBaseIncome = 8;
								} else {
									if ( (v.region == 8) && (thisBaseIncome == 8) ) {
										thisBaseIncome = 2;
									}
								}
								
								if ( (v.region == 10) && (thisBaseIncome == 1) && (thisClassA != 'buff') ) {
									thisBaseIncome = 8;
								} else {
									if ( (v.region == 10) && (thisBaseIncome == 8) ) {
										thisBaseIncome = 1;
									}
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

								if (v.foodClasses['drink'] > 0) {
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
									desc = '<b style="font-size: 16px;">' + thisDataTypeCapitalized + '</b> level ' + thisLv + ' (' + thisDataQty + ')<br>Max level bonus reached<br>';
								} else {
									desc = '<b style="font-size: 16px;">' + thisDataTypeCapitalized + '</b> level ' + thisLv + ' (' + thisDataQty + '/' + nextLvBreakpoint + ')<br>';
								}
								desc += '<b class="category_circle" style="color:'+colors[thisClassA]+'">●</b> ' + BeautifyDataType(thisClassA) + '<br>';
								desc += '<b class="category_circle" style="color:'+colors[thisClassB]+'">●</b> ' + BeautifyDataType(thisClassB) + '<br>';

								if ( (v.scienceCategory !== undefined) && (v.scienceCategory !== '') && ((thisDataType == v.scienceType1) || (thisDataType == v.scienceType2)) ) {
									desc += '<b class="category_circle" style="color:'+colors[v.scienceCategory]+'">●</b> ' + BeautifyDataType(v.scienceCategory) + '<br>';
								}
								desc += 'Base income: <b>' + thisBaseIncome + '</b><br>';
								desc += 'Quantity: ' + thisDataQty + '<br>';
								if (thisLv > 1) {
									desc += 'Level bonus: x' + thisLvBonusMult + '<br>';
								}
								if (thisBuffIncomeMult > 1) {
									for (let buff in thisBuffs) {
										let buffValue = defaultFoodStats[buff].baseIncome;
										let buffQty = thisBuffs[buff];
										let buffMaxLvString = '';
										if (buffQty >= (50 * v.skills.maxBuff)) {
											buffMaxLvString = ' (max)';
										}
										desc += 'Bonus from <b>' + BeautifyDataType(buff) + '</b>: +' + (buffValue * buffQty) + '%' + buffMaxLvString + '<br>';
									}
								}
								
								desc += 'Dish income: <b>' + AbbreviateNumber(thisCompoundIncome) + '</b>';
								desc += '<hr>';
								desc += 'Restaurant bonuses (multipliers)<br>';
								desc += 'Bonus from <b class="category_circle" style="color:'+colors[thisClassA]+'">●</b> ' + BeautifyDataType(thisClassA) + ': +' + Math.round(thisClassABonus * (v.categoryBonuses[thisClassA]*100)) + '%</b><br>';
								desc += 'Bonus from <b class="category_circle" style="color:'+colors[thisClassB]+'">●</b> ' + BeautifyDataType(thisClassB) + ': +' + Math.round(thisClassBBonus * (v.categoryBonuses[thisClassB]*100)) + '%</b><br>';	
								
								if ( (v.scienceCategory !== undefined) && (v.scienceCategory !== '') && ((thisDataType == v.scienceType1) || (thisDataType == v.scienceType2)) ) {
									desc += 'Bonus from <b class="category_circle" style="color:'+colors[v.scienceCategory]+'">●</b> ' + BeautifyDataType(v.scienceCategory)+ ': +' + Math.round(thisScienceCategoryBonus * (v.categoryBonuses[v.scienceCategory]*100)) + '%</b><br>';
								}

								if (v.foodClasses['drink'] > 0) {
									desc += 'Bonus from having a <b class="category_circle" style="color:'+colors['drink']+'">●</b> Drink: x2</b><br>';
								}
								
								if (perkMulti !== 1) {						
									desc += 'Bonus from perks: +' + Math.round((perkMulti-1) * 100) + '%<br>';
								}
								
								if (v.activeIncomeMultiplier > 1) {
									desc += 'Bonus from restaurant tier: x' + v.activeIncomeMultiplier + '</b><br>';
								}
								if (v.prestigePointsTotal > 0) {
									if (v.prestigePointsTotal > 10000) {
										desc += 'Bonus from prestige points: +' + (AbbreviateNumber(v.prestigePointsTotal * 10)) + '%</b><br>';
									} else {
										desc += 'Bonus from prestige points: +' + (v.prestigePointsTotal * 10) + '%</b><br>';
									}
								}
								if (mealOfTheDayActive) {
									if (
										($(this).attr('data-num') == 1) ||
										($(this).attr('data-num') == 2) ||
										($(this).attr('data-num') == 3)
										) {
											desc += 'Bonus from meal of the day: x3</b><br>';
									}
								} else {
									if (v.skills.dishOfTheDay >= 1) {						
										if ($(this).attr('data-num') == 1) {							
											desc += 'Bonus from dish of the day: x2</b><br>';
										}
									}
								}
								desc += '<hr>';
								desc += 'Total income: <b>' + AbbreviateNumber(thisTotalIncome) + '</b>';
								
								if (($(this).parent().parent().parent().attr('id') == 'default') && (!(v.skills['tier2_3starter']) >= 1)) {							
									desc += '<br>Starter dish - cannot be replaced.<br>';
								}
								
								if ((!isMobile()) && ($(this).attr('data-kitchen-num') > 0)) {
									desc += '<hr>Press <b>'+$(this).attr('data-kitchen-num')+'</b> or <b>Right-click</b> to auto-place.<br>';
								}
								
								if (thisClassA == "buff") {
									desc = '<b style="font-size: 16px;">' + thisDataTypeCapitalized + '</b><br>';
									if (thisDataType == 'fortune_paper') {
										desc += 'Any dish could have fortune papers, not just cookies!<br>';
									}
									desc += 'Drag and drop on any dish to improve it.<br>';
									
									desc += 'Effect: +<b>' + (thisBaseIncome * thisDataQty) + '%</b><br>';
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
				}
			);
			
			$('#kitchen .fooditem').each(function() {			
				if (isMobile()) {
					$(this).off('click').on('click', function (e) {	
						let kitchenTarget = $(this);
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
									storeTarget.html('<span class="qty">'+AbbreviateNumber2(newStoreQty)+'</span>');
									storeTarget.parent().removeClass('glow_fast').addClass('glow_fast');
									blockSorting++;
									setTimeout(function() {
										storeTarget.parent().removeClass('glow_fast');
										blockSorting = blockSorting - 1;
									},600);
									if (GetLvFromQty(oldStoreQty) < GetLvFromQty(newStoreQty) ) { // if gained next breakpoint level
										if (!(storeTarget.parent().css('display') == 'none')) {
											ShowFirework(storeTarget.offset(), true);
										}	
									}
									
									UpdateIncome();
									UpdateButtonsOnChange();
									if (v.skills['science'] >= 1) {
										UpdateThirdCategory();
									}
									
								}
							} else { // Buff
								if (v.options.buff_autoplacement === true) {
									let storeTarget = '';									
									$('#storefront .fooditem').each( function() {
										if (kitchenTarget.attr('data-type') != '') {											
											if (($(this).attr('data-type') != '') && ($(this).attr('data-type') != undefined)) {
												storeTarget = $(this);
												
												let dropBuffs = {};
												let dragType = kitchenTarget.attr('data-type');
												let dropType = storeTarget.attr('data-type');
												
												if (storeTarget.attr('data-buffs') != '') {
													dropBuffs = JSON.parse(storeTarget.attr('data-buffs'));
												}
												
												let currentBuffQty = parseInt(dropBuffs[dragType], 10) || 0;
												let dragQty = parseInt(kitchenTarget.attr('data-qty'), 10) || 0;
												
												if (+currentBuffQty < (50 * v.skills.maxBuff)) {
													if (+currentBuffQty + +dragQty <= (50 * v.skills.maxBuff)) {
														dropBuffs[dragType] = +currentBuffQty + +dragQty;
															
														storeTarget.attr('data-buffs', JSON.stringify(sortObjectByKey(dropBuffs)));
														kitchenTarget.attr('data-type', '');
														kitchenTarget.attr('data-qty', 1);
														kitchenTarget.attr('data-buffs', '');
														kitchenTarget.html('');	
														storeTarget.parent().removeClass('glow_fast').addClass('glow_fast');
														blockSorting++;
														setTimeout(function() {
															$('#default .fooditem-wrapper, #storefront .fooditem-wrapper, #kitchen .fooditem-wrapper').removeClass('glow_fast');
															blockSorting = blockSorting - 1;
														},600);	
													} else { // 50 + rest
														dropBuffs[dragType] = (50 * v.skills.maxBuff);
														let restQty = dragQty - ((50 * v.skills.maxBuff) - currentBuffQty);
														storeTarget.attr('data-buffs', JSON.stringify(sortObjectByKey(dropBuffs)));
														kitchenTarget.attr('data-qty', restQty);
														kitchenTarget.attr('data-buffs', '');
														kitchenTarget.html('<span class="qty">' + AbbreviateNumber2(restQty) + '</span>');
														storeTarget.parent().removeClass('glow_fast').addClass('glow_fast');
														blockSorting++;
														setTimeout(function() {
															$('#default .fooditem-wrapper, #storefront .fooditem-wrapper, #kitchen .fooditem-wrapper').removeClass('glow_fast');
															blockSortingDelivery = blockSortingDelivery - 1;
														},600);	
													}
												}
											}
										}	
									});
									
									UpdateIncome();
									UpdateButtonsOnChange();
								}
							}
						}	
					});	
				}
			});
			
			$('#default .fooditem-wrapper, #storefront .fooditem-wrapper, #kitchen .fooditem-wrapper').each(
				function() {
					if ((!($(this).hasClass('ui-droppable'))) && (!debug2)) {
						$(this).prop('onclick', null).off('click');
						$(this).droppable({
							accept: '.fooditem',
							drop: function(event, ui) {
								if ($(ui.draggable).parent()[0] == $(this)[0]) {
									if (isMobile()) {
										$(this).find('.fooditem').trigger('contextmenu');									
									}
								}
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
										$(this).children('.fooditem').html('<span class="qty">'+AbbreviateNumber2(+dragQty + +dropQty)+'</span>');
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
										if (+currentBuffQty  < (50 * v.skills.maxBuff)) {
											if (+currentBuffQty + +dragQty <= (50 * v.skills.maxBuff)) {
												dropBuffs[dragType] = +currentBuffQty + +dragQty;
												$(this).children('.fooditem').attr('data-buffs', JSON.stringify(sortObjectByKey(dropBuffs)));
												$(ui.draggable).attr('data-type', '');
												$(ui.draggable).attr('data-qty', 1);
												$(ui.draggable).attr('data-buffs', '');
												$(ui.draggable).html('');	
												$(this).removeClass('glow_fast').addClass('glow_fast');
												setTimeout(function() {
													$('#default .fooditem-wrapper, #storefront .fooditem-wrapper, #kitchen .fooditem-wrapper').removeClass('glow_fast');
												},600);	
											} else { // 50 + rest
												dropBuffs[dragType] = (50 * v.skills.maxBuff);
												let restQty = dragQty - ((50 * v.skills.maxBuff) - currentBuffQty);
												$(this).children('.fooditem').attr('data-buffs', JSON.stringify(sortObjectByKey(dropBuffs)));
												$(ui.draggable).attr('data-qty', restQty);
												$(ui.draggable).attr('data-buffs', '');
												$(ui.draggable).html('<span class="qty">' + AbbreviateNumber2(restQty) + '</span>');
												$(this).removeClass('glow_fast').addClass('glow_fast');
												setTimeout(function() {
													$('#default .fooditem-wrapper, #storefront .fooditem-wrapper, #kitchen .fooditem-wrapper').removeClass('glow_fast');
												},600);
											}
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
										ShowFirework($(this).offset(), true);										
									}
									$(ui.draggable).attr('data-type', '');
									$(ui.draggable).attr('data-qty', 1);
									$(ui.draggable).attr('data-buffs', '');
									$(ui.draggable).html('');
									$(this).children('.fooditem').attr('data-type', dragType);
									$(this).children('.fooditem').attr('data-qty', +dragQty + +dropQty);
									$(this).children('.fooditem').attr('data-buffs', JSON.stringify(sortObjectByKey(SumObj(dragBuffs, dropBuffs))));
									$(this).children('.fooditem').html('<span class="qty">'+AbbreviateNumber2(+dragQty + +dropQty)+'</span>');
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
		}
		
		$('#kitchen .fooditem').each(
			function() {
				$(this).off('contextmenu').on('contextmenu', function (e) {					
					//if (!isMobile()) {						
						let kitchenTarget = $(this);
						if (kitchenTarget !== '') { // RIGHT CLICK
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
										if (!debug2) {
											storeTarget.html('<span class="qty">'+AbbreviateNumber2(newStoreQty)+'</span>');
											storeTarget.parent().removeClass('glow_fast').addClass('glow_fast');
											blockSorting++;
											setTimeout(function() {
												storeTarget.parent().removeClass('glow_fast');
												blockSorting = blockSorting - 1;
											},600);
											if (GetLvFromQty(oldStoreQty) < GetLvFromQty(newStoreQty) ) { // if gained next breakpoint level
												if (!(storeTarget.parent().css('display') == 'none')) {
													ShowFirework(storeTarget.offset(), true);													
												}	
											}
											DescStartFadeOut();
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
											storeTarget.attr('data-buffs', kitchenTarget.attr('data-buffs'));
											kitchenTarget.attr('data-type', '');
											kitchenTarget.attr('data-qty', 1);
											kitchenTarget.html('');
											let newStoreQty = +kitchenQty;
											
											storeTarget.attr('data-qty', newStoreQty);
											if (!debug2) {
												storeTarget.html('<span class="qty">'+AbbreviateNumber2(newStoreQty)+'</span>');
												storeTarget.parent().removeClass('glow_fast').addClass('glow_fast');	
												blockSorting++;
												setTimeout(function() {
													storeTarget.parent().removeClass('glow_fast');
													blockSorting = blockSorting - 1;
												},600);	
												DescStartFadeOut();
											}	
											UpdateIncome();
											UpdateButtonsOnChange();
											if (v.skills['science'] >= 1) {
												UpdateThirdCategory();
											}
											
										}
									}
								} else { // Buff
									if (v.options.buff_autoplacement === true) {
										let storeTarget = '';									
										$('#storefront .fooditem').each( function() {
											if (kitchenTarget.attr('data-type') != '') {											
												if (($(this).attr('data-type') != '') && ($(this).attr('data-type') != undefined)) {
													storeTarget = $(this);
													
													let dropBuffs = {};
													let dragType = kitchenTarget.attr('data-type');
													let dropType = storeTarget.attr('data-type');
													
													if (storeTarget.attr('data-buffs') != '') {
														dropBuffs = JSON.parse(storeTarget.attr('data-buffs'));
													}
													
													let currentBuffQty = parseInt(dropBuffs[dragType], 10) || 0;
													let dragQty = parseInt(kitchenTarget.attr('data-qty'), 10) || 0;
													
													if (+currentBuffQty < (50 * v.skills.maxBuff)) {
														if (+currentBuffQty + +dragQty <= (50 * v.skills.maxBuff)) {
															dropBuffs[dragType] = +currentBuffQty + +dragQty;
																
															storeTarget.attr('data-buffs', JSON.stringify(sortObjectByKey(dropBuffs)));
															kitchenTarget.attr('data-type', '');
															kitchenTarget.attr('data-qty', 1);
															kitchenTarget.attr('data-buffs', '');
															if (!debug2) {
																kitchenTarget.html('');	
																storeTarget.parent().removeClass('glow_fast').addClass('glow_fast');
																blockSorting++;
																setTimeout(function() {
																	$('#default .fooditem-wrapper, #storefront .fooditem-wrapper, #kitchen .fooditem-wrapper').removeClass('glow_fast');
																	blockSorting = blockSorting - 1;
																},600);	
															}	
														} else { // 50 + rest
															dropBuffs[dragType] = (50 * v.skills.maxBuff);
															let restQty = dragQty - ((50 * v.skills.maxBuff) - currentBuffQty);
															storeTarget.attr('data-buffs', JSON.stringify(sortObjectByKey(dropBuffs)));
															kitchenTarget.attr('data-qty', restQty);
															kitchenTarget.attr('data-buffs', '');
															if (!debug2) {
																kitchenTarget.html('<span class="qty">' + AbbreviateNumber2(restQty) + '</span>');
																storeTarget.parent().removeClass('glow_fast').addClass('glow_fast');
																blockSorting++;
																setTimeout(function() {
																	$('#default .fooditem-wrapper, #storefront .fooditem-wrapper, #kitchen .fooditem-wrapper').removeClass('glow_fast');
																	blockSorting = blockSorting - 1;
																},600);	
															}	
														}
													}
												}
											}	
										});
										
										UpdateIncome();
										UpdateButtonsOnChange();
									}
								}	
							}							
						}						
						return false;
					//}
				});
			}
		);
		$('#default .fooditem, #storefront .fooditem').each( //hotkeys to swap back to kitchen
			function() {
				$(this).off('contextmenu').on('contextmenu', function (e) { // RIGHT CLICK
					if (!isMobile()) {						
						let storeTarget = $(this);
						if (storeTarget !== '') { 
							let storeType = storeTarget.attr('data-type');
							let storeQty = storeTarget.attr('data-qty');
							let storeBuffs = storeTarget.attr('data-buffs');
							
							if ((storeType != '') && (storeType != undefined)) {
								let kitchenTarget = '';
							
								$('#kitchen .fooditem').each( function() {
										if ( (($(this).attr('data-type') === '') || ($(this).attr('data-type') === undefined)) && (kitchenTarget === '')) {
											kitchenTarget = $(this);
										}
									});
									
								if (kitchenTarget !== '') { // transfer to kitchen
									kitchenTarget.attr('data-type', storeType);
									kitchenTarget.attr('data-qty', storeQty);
									kitchenTarget.attr('data-buffs', storeBuffs);
									if (!debug2) {
										kitchenTarget.html('<span class="qty">'+AbbreviateNumber2(storeQty)+'</span>');
										kitchenTarget.parent().removeClass('glow_fast').addClass('glow_fast');
									}
									storeTarget.attr('data-type', '');
									storeTarget.attr('data-qty', 1);
									storeTarget.attr('data-buffs', '');
									storeTarget.html('');
									
									if (!debug2) {
										setTimeout(function() {
											kitchenTarget.parent().removeClass('glow_fast');
										},600);
										DescStartFadeOut();
									}	
									UpdateIncome();
									UpdateButtonsOnChange();
									if (v.skills['science'] >= 1) {
										UpdateThirdCategory();
									}
								}
							}							
						}						
						return false;
					}
				});
			}
		);
		
		if (!(v.skills['tier2_3starter'] >= 1)) { // not tier2-3 starter
			if (!debug2) {
				$('#default .fooditem').each(
					function() {
						$(this).draggable('disable');	
						$(this).off('contextmenu');
					}
				);	
			}	
		}
		
		UpdateThirdCategory();	
		if ( (t[v.tutorialLevel].val >= t['finished0'].val) ) {		
			if (!debug2) {
				SaveGame();
			}
		}
	}
	
	//only for bot
	function UpdateKitchenFoodItems() {
		$('#kitchen .fooditem').each( //hotkeys
			function() {
				$(this).off('contextmenu').on('contextmenu', function (e) {					
					//if (!isMobile()) {						
						let kitchenTarget = $(this);
						if (kitchenTarget !== '') { // RIGHT CLICK
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
											storeTarget.attr('data-buffs', kitchenTarget.attr('data-buffs'));
											kitchenTarget.attr('data-type', '');
											kitchenTarget.attr('data-qty', 1);
											kitchenTarget.html('');
											let newStoreQty = +kitchenQty;											
											storeTarget.attr('data-qty', newStoreQty);											
											UpdateIncome();
											UpdateButtonsOnChange();
											if (v.skills['science'] >= 1) {
												UpdateThirdCategory();
											}
											
										}
									}
								} else { // Buff
									if (v.options.buff_autoplacement === true) {
										let storeTarget = '';									
										$('#storefront .fooditem').each( function() {
											if (kitchenTarget.attr('data-type') != '') {											
												if (($(this).attr('data-type') != '') && ($(this).attr('data-type') != undefined)) {
													storeTarget = $(this);
													
													let dropBuffs = {};
													let dragType = kitchenTarget.attr('data-type');
													let dropType = storeTarget.attr('data-type');
													
													if (storeTarget.attr('data-buffs') != '') {
														dropBuffs = JSON.parse(storeTarget.attr('data-buffs'));
													}
													
													let currentBuffQty = parseInt(dropBuffs[dragType], 10) || 0;
													let dragQty = parseInt(kitchenTarget.attr('data-qty'), 10) || 0;
													
													if (+currentBuffQty < (50 * v.skills.maxBuff)) {
														if (+currentBuffQty + +dragQty <= (50 * v.skills.maxBuff)) {
															dropBuffs[dragType] = +currentBuffQty + +dragQty;
																
															storeTarget.attr('data-buffs', JSON.stringify(sortObjectByKey(dropBuffs)));
															kitchenTarget.attr('data-type', '');
															kitchenTarget.attr('data-qty', 1);
															kitchenTarget.attr('data-buffs', '');															
														} else { // 50 + rest
															dropBuffs[dragType] = (50 * v.skills.maxBuff);
															let restQty = dragQty - ((50 * v.skills.maxBuff) - currentBuffQty);
															storeTarget.attr('data-buffs', JSON.stringify(sortObjectByKey(dropBuffs)));
															kitchenTarget.attr('data-qty', restQty);
															kitchenTarget.attr('data-buffs', '');															
														}
													}
												}
											}	
										});
										
										UpdateIncome();
										UpdateButtonsOnChange();
									}
								}	
							}							
						}						
						return false;
					//}
				});
			}
		);
	}
	
	function UpdateThirdCategory() {
		if (!debug2) {
			$('#game .fooditem .third_category, #delivery .fooditem .third_category, #deliveryPoolDesc .fooditem .third_category, #return_popup .fooditem .third_category').remove();
			$('#game .fooditem, #delivery .fooditem, #deliveryPoolDesc .fooditem, #return_popup .fooditem').each(
				function() {
					if ( ($(this).attr('data-type') == v.scienceType1) || ($(this).attr('data-type') == v.scienceType2) ) {					
						$(this).append('<div class="third_category '+v.scienceCategory+'"></div>');
					}
				}
			);
		}
	}

	function ProgressBarShowDesc() {
		let desc = 'These rainbow bars show your progress towards the next Prestige Point.<br>';
		if ($progressbarPrestige2.css('display') != 'none') {
			desc += 'Bigger bar shows total progress.<br>Smaller bar shows progress for each percent.<br>';
		}
		desc += '<hr>Money earned for next point: <br><b>' + AbbreviateNumber(v.prestigePointMoneyEarned) + '/' + AbbreviateNumber(v.prestigePointCost) + ' (' + ((v.prestigePointMoneyEarned/v.prestigePointCost) * 100).toFixed(2) + '%)</b><br>';
		
		let estimatedTime = 0;
		estimatedTime = BeautifyTime(((v.prestigePointCost - v.prestigePointMoneyEarned) / v.incomeWithDeliveries));
		if (estimatedTime < 0) { estimatedTime = 0; }
		if (v.prestigePointCost > (v.incomeWithDeliveries*2)) {
			desc += 'Estimated time: <b>' + estimatedTime + '</b><br>';
		} else {
			let ppMult = 1;
			if (v.region > 1) {
				ppMult = Math.pow(2, v.region-1);
			}
			if (v.region > 0) {
				desc += 'Region Prestige Points Multiplier: <b>' + AbbreviateNumber(ppMult) + '</b><br>';
			}	
			desc += 'Prestige Points per second: <b>' + AbbreviateNumber((+v.incomeWithDeliveries / +v.prestigePointCost)*ppMult) + '</b><br>';
		}	
		
		if (v.prestigePointsToGet > 10000) {
			desc += 'Prestige Points this run: <b>' + (AbbreviateNumber(v.prestigePointsToGet)) + '</b><br>';
		} else {
			desc += 'Prestige Points this run: <b>' + v.prestigePointsToGet + '</b><br>';
		}
		desc += '<hr>';
		if (isMobile()) {
			desc += 'Long tap to toggle progressbar animation (for even less CPU usage).<br>';
		} else {
			desc += 'Right click to toggle progressbar animation (for even less CPU usage).<br>';
		}	
		if (v.options.animations) {
			desc += 'Current status: active.<br>';
		} else {
			desc += 'Current status: inactive.<br>';
		}

		$descriptionBox.html(desc);
	}
	
	function DescStartFadeOut() {		
		if ((descFadeout == false) && (isMobile() == false)) {
			$descriptionBox.html('<div id="description_fadeout">' + $descriptionBox.html() + '</div>');
			$descriptionBox.css('background', '');
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
		if (!debug2) {
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
	}
	
	let selectedInfoDish = undefined;

	function UpdateInfoScreen() {
		//DISHES
		let infoHTML = '';
		let finishedTrends = [];
		
		if (v.region > 11) {
			for (let i = 0; i <= v.region-12; i++) {
				finishedTrends.push(OUTER_REGIONS_DISHES[i]);
			}			
		}

		infoHTML += '<div>';
		infoHTML += 	'<div id="info_tier1" style="min-height: 125px;"></div>';
		infoHTML += 	'<div id="info_tier2" style="min-height: 125px;"></div>';
		infoHTML += 	'<div id="info_tier3" style="min-height: 125px;"></div>';
		infoHTML += 	'<div id="info_tier4" style="min-height: 125px;"></div>';
		infoHTML += '</div>';

		$('#info_dishes').html(infoHTML);
		let tier1FoodInfoHTML = '<div class="tr_label">Tier 1</div>';
		let tier2FoodInfoHTML = '<div class="tr_label">Tier 2</div>';
		let tier3FoodInfoHTML = '<div class="tr_label">Tier 3</div>';
		let tier4FoodInfoHTML = '<div class="tr_label">Tier 4</div>';
		
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
		
		let currentTrend = '';
		
		if ((v.region > 10) && (OUTER_REGIONS_DISHES[v.region - 11] != undefined)) {
			currentTrend = OUTER_REGIONS_DISHES[v.region - 11];
		}
		
		for (let foodName in defaultFoodStats) {
			let opacityCSS = '';
			if (!(v.activeFood.includes(foodName))) {
				opacityCSS = ' opacity : 0.5; border-style: dashed; ';
				if (!(v.newFood.includes(foodName))) {
					opacityCSS += 'border-color: #bb6f6f;';
				}	
			}
			if (foodTypes[foodName] === 'exists') {				
				opacityCSS += 'border-color: #ffcd53;';
			}			

			if ((defaultFoodStats.hasOwnProperty(foodName)) && (defaultFoodStats[foodName].baseIncome == 1) && (defaultFoodStats[foodName].class_a != 'buff')) {
				tier1FoodInfoHTML += '<div class="fooditem-wrapper" style="transition: all 0.26s linear 0s; overflow:hidden;'+opacityCSS+'"><div class="fooditem" style="transition: all 0.26s linear 0s;" data-buffs="" data-type="' + foodName + '" data-qty="1">';
				if (finishedTrends.includes(foodName)) {
					tier1FoodInfoHTML += '<span class="qty" style="color: #f3d43c;padding: 0px 4px 0 2px;font-size:20px;">🏆</span>';
				}
				if (currentTrend == foodName) {
					tier1FoodInfoHTML += '<span class="qty" style="color: #f3d43c;padding: 0px 4px 0 2px;font-size:20px;">👑</span>';
				}
				if (v.skills['tier2_3starter'] >= 1) {
					if (v.starterFood1 == foodName) {
						tier1FoodInfoHTML += '<span class="qty sel1" style="color: #8ce08c;padding: 0px 4px 0 4px;font-size:20px;top: 49px;left: 3px;">1</span>';
					}
					if (v.starterFood2 == foodName) {
						tier1FoodInfoHTML += '<span class="qty sel2" style="color: #8ce08c;padding: 0px 4px 0 4px;font-size:20px;top: 49px;left: 57px;">2</span>';
					}
				}
				tier1FoodInfoHTML += '</div></div>';
			}
			if ((defaultFoodStats.hasOwnProperty(foodName)) && (defaultFoodStats[foodName].baseIncome == 2) && (defaultFoodStats[foodName].class_a != 'buff')) {
				tier2FoodInfoHTML += '<div class="fooditem-wrapper" style="transition: all 0.26s linear 0s; overflow:hidden;'+opacityCSS+'"><div class="fooditem" style="transition: all 0.26s linear 0s;" data-buffs="" data-type="' + foodName + '" data-qty="1">';
				if (finishedTrends.includes(foodName)) {
					tier2FoodInfoHTML += '<span class="qty" style="color: #f3d43c;padding: 0px 4px 0 2px;font-size:20px;">🏆</span>';
				}
				if (currentTrend == foodName) {
					tier2FoodInfoHTML += '<span class="qty" style="color: #f3d43c;padding: 0px 4px 0 2px;font-size:20px;">👑</span>';
				}
				if (v.skills['tier2_3starter'] >= 1) {
					if (v.starterFood1 == foodName) {
						tier2FoodInfoHTML += '<span class="qty sel1" style="color: #8ce08c;padding: 0px 4px 0 4px;font-size:20px;top: 49px;left: 3px;">1</span>';
					}
					if (v.starterFood2 == foodName) {
						tier2FoodInfoHTML += '<span class="qty sel2" style="color: #8ce08c;padding: 0px 4px 0 4px;font-size:20px;top: 49px;left: 57px;">2</span>';
					}
				}
				tier2FoodInfoHTML += '</div></div>';
			}
			if ((defaultFoodStats.hasOwnProperty(foodName)) && (defaultFoodStats[foodName].baseIncome == 4) && (defaultFoodStats[foodName].class_a != 'buff')) {
				tier3FoodInfoHTML += '<div class="fooditem-wrapper" style="transition: all 0.26s linear 0s; overflow:hidden;'+opacityCSS+'"><div class="fooditem" style="transition: all 0.26s linear 0s;" data-buffs="" data-type="' + foodName + '" data-qty="1">';
				if (finishedTrends.includes(foodName)) {
					tier3FoodInfoHTML += '<span class="qty" style="color: #f3d43c;padding: 0px 4px 0 2px;font-size:20px;">🏆</span>';
				}
				if (currentTrend == foodName) {
					tier3FoodInfoHTML += '<span class="qty" style="color: #f3d43c;padding: 0px 4px 0 2px;font-size:20px;">👑</span>';
				}
				if (v.skills['tier2_3starter'] >= 1) {
					if (v.starterFood1 == foodName) {
						tier3FoodInfoHTML += '<span class="qty sel1" style="color: #8ce08c;padding: 0px 4px 0 4px;font-size:20px;top: 49px;left: 3px;">1</span>';
					}
					if (v.starterFood2 == foodName) {
						tier3FoodInfoHTML += '<span class="qty sel2" style="color: #8ce08c;padding: 0px 4px 0 4px;font-size:20px;top: 49px;left: 57px;">2</span>';
					}
				}
				tier3FoodInfoHTML += '</div></div>';
			}
			if ((defaultFoodStats.hasOwnProperty(foodName)) && (defaultFoodStats[foodName].baseIncome == 8) && (defaultFoodStats[foodName].class_a != 'buff')) {
				tier4FoodInfoHTML += '<div class="fooditem-wrapper" style="transition: all 0.26s linear 0s; overflow:hidden;'+opacityCSS+'"><div class="fooditem" style="transition: all 0.26s linear 0s;" data-buffs="" data-type="' + foodName + '" data-qty="1">';
				if (finishedTrends.includes(foodName)) {
					tier4FoodInfoHTML += '<span class="qty" style="color: #f3d43c;padding: 0px 4px 0 2px;font-size:20px;">🏆</span>';
				}
				if (currentTrend == foodName) {
					tier4FoodInfoHTML += '<span class="qty" style="color: #f3d43c;padding: 0px 4px 0 2px;font-size:20px;">👑</span>';
				}
				if (v.skills['tier2_3starter'] >= 1) {
					if (v.starterFood1 == foodName) {
						tier4FoodInfoHTML += '<span class="qty sel1" style="color: #8ce08c;padding: 0px 4px 0 4px;font-size:20px;top: 49px;left: 3px;">1</span>';
					}
					if (v.starterFood2 == foodName) {
						tier4FoodInfoHTML += '<span class="qty sel2" style="color: #8ce08c;padding: 0px 4px 0 4px;font-size:20px;top: 49px;left: 57px;">2</span>';
					}
				}
				tier4FoodInfoHTML += '</div></div>';
			}
		}
		$('#info_dishes #info_tier1').html(tier1FoodInfoHTML);
		if (t[v.tutorialLevel].val >= t['tierup0'].val) {
			$('#info_dishes #info_tier2').html(tier2FoodInfoHTML);
		}
		if (v.skills.tier3food >= 1) {
			$('#info_dishes #info_tier3').html(tier3FoodInfoHTML);
		}
		if (v.skills.tier4food >= 1) {
			$('#info_dishes #info_tier4').html(tier4FoodInfoHTML);
		}

		$('#info_dishes .fooditem').each(
			function() {
				$(this).prop('onclick', null).off('click');
				$(this).off('contextmenu').on('contextmenu', function (e) {
					if ((v.discontinueTokens > 0) && (v.activeFood.includes($(this).attr('data-type')))) {
						v.discontinueTokens = +v.discontinueTokens - 1;
						RemoveFromArray(v.activeFood, $(this).attr('data-type'));
						$(this).trigger('mouseover');
						$(this).parent().css('opacity', 0.5).css('border-color','#bb6f6f').css('border-style','dashed');
						//UpdateInfoScreen();
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
					
					if ((v.region > 10) && (OUTER_REGIONS_DISHES[v.region - 11] != undefined)) {
						let currentTrend = OUTER_REGIONS_DISHES[v.region - 11];
						if ((currentTrend != undefined) && ($(this).attr('data-type') == currentTrend) && (!debug2)) {
							thisBaseIncome = 20;
						}
					}
					if (v.region > 99) {
						thisBaseIncome = 20;
					}
					
					if ( (v.region == 4) && (thisBaseIncome == 4) && (thisClassA != 'buff') ) {
						thisBaseIncome = 8;
					} else {
						if ( (v.region == 4) && (thisBaseIncome == 8) ) {
							thisBaseIncome = 4;
						}
					}
					
					if ( (v.region == 8) && (thisBaseIncome == 2) && (thisClassA != 'buff') ) {
						thisBaseIncome = 8;
					} else {
						if ( (v.region == 8) && (thisBaseIncome == 8) ) {
							thisBaseIncome = 2;
						}
					}
					
					if ( (v.region == 10) && (thisBaseIncome == 1) && (thisClassA != 'buff') ) {
						thisBaseIncome = 8;
					} else {
						if ( (v.region == 10) && (thisBaseIncome == 8) ) {
							thisBaseIncome = 1;
						}
					}
					
					

					let thisDataTypeCapitalized = BeautifyDataType(thisDataType);

					let desc = '<b style="font-size: 16px;">' + thisDataTypeCapitalized + '</b><br>';
					desc += '<img style="width: 100px; heigth: auto;" src="img/food/' + thisDataType + '.png"><br>';
					desc += '<b class="category_circle" style="color:'+colors[thisClassA]+'">●</b> ' + BeautifyDataType(thisClassA) + '<br>';
					desc += '<b class="category_circle" style="color:'+colors[thisClassB]+'">●</b> ' + BeautifyDataType(thisClassB) + '<br>';
					desc += 'Base income: <b>' + thisBaseIncome + '</b><br>';
					if ( 
						(v.discontinueTokens > 0) && 
						(v.activeFood.includes(thisDataType))							
					   )						
						{
						if (isMobile()) {
							desc += '<br><br>Hold 3 seconds to discontinue.<br>Discontinue tokens left: <b>' + v.discontinueTokens + '</b>';
						} else {
							desc += '<br><br>Right click to discontinue.<br>Discontinue tokens left: <b>' + v.discontinueTokens + '</b>';
						}						
					}
					
					let finishedTrends = [];		
					if (v.region > 10) {
						for (let i = 0; i <= v.region-12; i++) {
							finishedTrends.push(OUTER_REGIONS_DISHES[i]);
						}	

						if (finishedTrends.includes(thisDataType)) {
							desc += '<br><span style="color: #f3d43c;">🏆</span> Trend Region completed';
						}
						
						if ((v.region > 10) && (OUTER_REGIONS_DISHES[v.region - 11] != undefined)) {
							let currentTrend = OUTER_REGIONS_DISHES[v.region - 11];
							if ((currentTrend != undefined) && ($(this).attr('data-type') == currentTrend) && (!debug2)) {
								desc += '<br><b>Trending in this Region</b>';
							}
						}
					}
					
					if (!(v.activeFood.includes(thisDataType))) {
						if (!(v.newFood.includes(thisDataType))) {
							desc += '<br><br><b>Discontinued.</b>';
						}	
					}	
						
					if (v.skills['tier2_3starter'] >= 1) {
						if (isMobile()) {
							if (v.starterFood1 == thisDataType) {
								desc += '<br><br><button style="background: #ecae21" onClick="SetAsStarterFood(1,\''+thisDataType+'\');">Set as Starter&nbsp;Dish&nbsp;1</button>';
							} else {
								desc += '<br><br><button onClick="SetAsStarterFood(1,\''+thisDataType+'\');">Set as Starter&nbsp;Dish&nbsp;1</button>';
							}					
							if (v.starterFood2 == thisDataType) {
								desc += '<br><br><button style="background: #ecae21" onClick="SetAsStarterFood(2,\''+thisDataType+'\');">Set as Starter&nbsp;Dish&nbsp;2</button>';
							} else {
								desc += '<br><br><button onClick="SetAsStarterFood(2,\''+thisDataType+'\');">Set as Starter&nbsp;Dish&nbsp;2</button>';
							}
						} else {
							if (v.starterFood1 == thisDataType) {
								desc += '<br><br><span id="sf1Text"><b style="color: #86d686;">✓</b> <b>Currently Starter Dish 1</b></span>';
							} else {
								desc += '<br><br><span id="sf1Text">Press <b>1</b> to set as Starter Dish 1</span>';
							}					
							if (v.starterFood2 == thisDataType) {
								desc += '<br><br><span id="sf2Text"><b style="color: #86d686;">✓</b> <b>Currently Starter Dish 2</b></span>';
							} else {
								desc += '<br><br><span id="sf2Text">Press <b>2</b> to set as Starter Dish 2</span>';
							}	
						}	
					}
					
					if (thisDataType === 'rice_ball') {
						desc += '<br><br>Seaweed + rice. <br>(That may not strictly count as seafood, but it goes well with seafood-themed restaurants)';
					}
					if (thisDataType === 'taiyaki') {
						desc += '<br><br>Well, it\'s not technically from the sea, but don\t tell anyone.';
					}
					if (thisDataType === 'juice') {
						desc += '<br><br>Although most drinks are vegan, this one is the best fit for the theme.';
					}
					
					selectedInfoDish = thisDataType;
					
					$descriptionBox.html(desc);
					descFadeout = false;
					e.stopPropagation();
				});				
				$(this).off('mouseout').on('mouseout', function (e) {
					selectedInfoDish = undefined;
					DescStartFadeOut();
					e.stopPropagation();
				});
			}
		);
		//RESTAURANT
		let infoRestaurantHTML = '';
		if ((v.restaurantName != '') && (v.restaurantName !== undefined)) {
			if (!(v.skills['novelty'] >= 1)) {
				infoRestaurantHTML += '<div class="tr_label restaurantname" style="text-align: left; padding-left: 12%;">'+v.restaurantName+'</div><a href="#" style="font-size: 12px;" onClick="RenameRestaurant();SaveGame();return false;">(rename)</a>';
			} else {
				infoRestaurantHTML += '<div class="tr_label restaurantname" style="text-align: center;">'+v.restaurantName+'</div><a href="#" style="font-size: 12px;" onClick="RenameRestaurant();SaveGame();return false;">(rename)</a>';
			}
		}	
		if (!(v.skills['novelty'] >= 1)) {
			infoRestaurantHTML += '<div style="text-align: left; width: 30%;  padding-left: 10%; display: inline-block;">';
			infoRestaurantHTML += 	'<div class="tr_label" style="padding-bottom: 5px; text-align: left;">Category Bonuses</div>';
			for (let catName in v.categoryBonuses) {				
				infoRestaurantHTML += 	'<div><b class="category_circle" style="color:'+colors[catName]+'">●</b> '+BeautifyDataType(catName)+': '+(v.categoryBonuses[catName] * 100)+'%</div>';
			}					
			infoRestaurantHTML += '</div>';	
		} else {			
			infoRestaurantHTML += '<div style="text-align: left; width: 98%; padding-left: 1%;">';	
			infoRestaurantHTML += 	'<div class="tr_label" style="padding-bottom: 7px; text-align: center;">Category Bonuses</div>';
			infoRestaurantHTML +=   '<div style="padding-bottom: 5px; text-align: center;">Make restaurants with different main categories to keep high bonus.</div>';
			infoRestaurantHTML +=	'<table id="category_novelty_bonus">';
			infoRestaurantHTML +=		'<thead>';
			infoRestaurantHTML +=			'<tr>';
			infoRestaurantHTML +=				'<th>Category</th>';
			infoRestaurantHTML +=				'<th>State</th>';
			infoRestaurantHTML +=				'<th>Default<br>Bonus</th>';
			infoRestaurantHTML +=				'<th>Active<br>Modifier</th>';
			infoRestaurantHTML +=				'<th><b style="color: #bb6f6f;">Active<br>Bonus<b></th>';			
			infoRestaurantHTML +=				'<th>Next<br>Modifier</th>';	
			infoRestaurantHTML +=				'<th>Next<br>Bonus</th>';
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
				
				if (v.categoryBonuses[catName] == 0) {
					infoRestaurantHTML +=			'<td><b style="color: #d65353;">BAD</b></td>';
				} else {
					if ( v.currentNovelty[catName] < 50) {
						infoRestaurantHTML +=		'<td><b style="color: #d65353;">BAD</b></td>';
					}	
					if ( v.currentNovelty[catName] >= 50 && v.currentNovelty[catName] < 100 ) {
						infoRestaurantHTML +=		'<td><b>FINE</b></td>';
					}
					if ( v.currentNovelty[catName] >= 100) {
						infoRestaurantHTML +=		'<td><b style="color: #5ab55a;">GOOD</b></td>';
					}
				}
				infoRestaurantHTML +=			'<td>'+defaultCategoryBonuses[catName]*100+'</td>';
				infoRestaurantHTML +=			'<td>+'+v.currentNovelty[catName]+'%</td>';
				infoRestaurantHTML +=			'<td><b style="color: #bb6f6f;">'+Math.round((defaultCategoryBonuses[catName]*100 * (100 + v.currentNovelty[catName]))/100)+'</b></td>';
				infoRestaurantHTML +=			'<td>+'+v.nextNovelty[catName]+'%</td>';
				infoRestaurantHTML +=			'<td>'+Math.round((defaultCategoryBonuses[catName]*100 * (100 + v.nextNovelty[catName]))/100)+trendSymbol+'</td>';
				infoRestaurantHTML +=		'</tr>';				
			}					
			infoRestaurantHTML +=		'</tbody>';
			infoRestaurantHTML +=	'</table>';			
			infoRestaurantHTML += '</div>';
		}
		
		infoRestaurantHTML += '<div style="text-align: left; width: 50%; padding-left:6%; display: inline-block; vertical-align: top;">';	
		infoRestaurantHTML += 	'<div class="tr_label" style="padding-bottom: 6px; text-align: left;">Records</div>';
		if (v.bestRestaurant != {}) {
			if (v.bestRestaurant.income != undefined) {
				infoRestaurantHTML += 	'<div style="padding-bottom: 3px;"><b>Top Restaurant:</b><br> '+AbbreviateNumberEmoji(v.bestRestaurant.income)+' ('+v.bestRestaurant.type+')' +'</div>';
			}			
		}	
		if (v.bestFood != {}) {
			if ((v.bestFood.income != undefined) && (v.bestFood.type != undefined)) {
				infoRestaurantHTML += 	'<div style="padding-bottom: 3px;"><b>Top Income dish:</b><br> '+AbbreviateNumberEmoji(v.bestFood.income)+' ('+BeautifyDataType(v.bestFood.type)+'['+v.bestFood.qty+']'+')' +'</div>';
			}
		}	
		if (v.biggestFood != {}) {
			if ((v.biggestFood.qty != undefined)  && (v.biggestFood.type != undefined)) {
				infoRestaurantHTML += 	'<div style="padding-bottom: 3px;"><b>Biggest dish:</b><br> '+v.biggestFood.qty+' ('+BeautifyDataType(v.biggestFood.type)+')' +'</div>';
			}
		}
		infoRestaurantHTML += '</div>';	
		
		infoRestaurantHTML += '<div style="text-align: left; width: 50%; padding-left:6%; display: inline-block; vertical-align: top;">';
		infoRestaurantHTML += 	'<div class="tr_label" style="padding-bottom: 6px; text-align: left;">Bonuses</div>';
		if (+v.incomeMultipliers.season_1 > 1) {
			infoRestaurantHTML += 	'<div style="padding-bottom: 3px;"><span class="em">🏆</span> <b>Season 1 Bonus:</b><br> +' + Math.round( (v.incomeMultipliers.season_1 - 1)*100 ) +'%</div>';
		}
		if (+v.incomeMultipliers.used_boosters > 1) {
			infoRestaurantHTML += 	'<div style="padding-bottom: 3px;"><span class="em">🌟</span> <b>Used Boosters:</b><br> +' + Math.round( (v.incomeMultipliers.used_boosters - 1)*100 ) + '%</div>';
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
			let desc = '<b>Novelty bonus</b><br><br>'+
				'Every hour, 2 active categories get -3% modifier and inactive ones get +1% modifier.<br><br>'+
				'Active categories are base categories of the top performing dish.<br><br>'+
				'Modifiers only apply for the next prestige, current prestige modifiers do not change, so you don\'t have to check this screen often.<br><br>'+
				'Empty restaurant doesn\'t grow any Novelty bonus.<br><br>'+
				'Min modifier: +0%<br>'+
				'Max modifier: +200%<br>';	
			/*if (v.region > 10) {
				desc = '<b>Novelty bonus</b><br><br>'+
				'Every hour, 2 active categories get -3% modifier and inactive ones get +1% modifier.<br><br>'+
				'Active categories are base categories of the top performing dish and science.<br><br>'+
				'Modifiers only apply for the next prestige, current prestige modifiers do not change.<br><br>'+
				'Min modifier: +0%<br>'+
				'Max modifier: +200%<br>';
			}*/
			$descriptionBox.html(desc);
			descFadeout = false;
			e.stopPropagation();
		});				
		$('#category_novelty_bonus').off('mouseout').on('mouseout', function (e) {
			DescStartFadeOut();
			e.stopPropagation();
		});
		
		// HISTORY HTML updated on  load
		if ($('#info_history').html() != '') {
			$('#info_history_text').html('This tab shows the history of your restaurants.<br> It shows up to 20 latest restaurants, but only the ones that earned Prestige Points.<br> Mark restaurants as Favourite if you don\'t want them to ever get deleted.');
		}
		let appendId = 0;
			
		$('#info_history .history_restaurant').each( function() {
			let favorited;
			if ($(this).find('.fav:checked').length == 0) {
				favorited = '';
			} else {
				favorited = 'checked="checked"';
			}
			let appendedHtml = '';
			appendedHtml += '<div class="favbox"><input type="checkbox" id="fav'+appendId+'" name="fav'+appendId+'" class="fav" value="fav'+appendId+'" '+favorited+'>';
			appendedHtml += '<label for="fav'+appendId+'">♥ Favorite</label></div>';
			if (v.region > 0) {
				appendedHtml += '<button class="franchise" onClick="AttemptFranchise('+appendId+')">Franchise</button>';
			}		
			
			$(this).children('.favbox').remove();
			$(this).children('button.franchise').remove();
			$(this).children('.tr_label.restaurantname').after(appendedHtml);	
			
			appendId++;
		});
		
		$('#info_history .history_restaurant .favbox input.fav').off('change').on('change', function (e) {
			if ($(this).is(':checked')) {
				$(this).attr('checked', 'checked');
				$(this).prop('checked', true);
			} else {
				$(this).removeAttr('checked');
				$(this).prop('checked', false);
			}
			window.localStorage.setItem('history', $('#info_history').html());
		});
		// CHARITY
		
		if (v.skills['charity'] >= 1) {
			$('#info_tab_button_charity').show();
			$('#charity_food').html(AbbreviateNumber(v.charityFood));
			$('#charity_breakpoint').html(AbbreviateNumber(GetMaxQtyFromLv(v.charityBreakpoint)));
			if (v.charityBreakpoint % 2 == 0) {
				$('#charity_reward').html( (10 + ((+v.charityBreakpoint - 4) *2.5)) + ' <span class="em">🔖</span>' );
			} else {
				$('#charity_reward').html( (10 + ((+v.charityBreakpoint - 5) *2.5)) + ' <span class="em">🎁</span>' );
			}
			if (v.charityFood >= GetMaxQtyFromLv(v.charityBreakpoint)) {
				$('#claim_charity_reward').show();
				$('#info_button').css('background', '#ecae21');
				$('#info_tab_button_charity').css('background', '#ecae21');
			} else {
				$('#claim_charity_reward').hide();
				$('#info_button').css('background', '');
				$('#info_tab_button_charity').css('background', '');
			}
		}		
	}
	
	function SetAsStarterFood(sfIndex, targetDish) {
		if (sfIndex == 1) {
			$('#info .sel1').remove();	
			let sel1 = $('#new_food_select_1');	
			v.starterFood1 = targetDish;	
			if ((v.starterFood1 === undefined) || (v.starterFood1 === '')) {
				sel1[0].selectedIndex = 0;
			} else {
				$('#new_food_select_1').val(v.starterFood1);
				$('#new_food_select_1').change();
				$('#info #info_dishes .fooditem[data-type='+targetDish+']').append('<span class="qty sel1" style="color: #8ce08c;padding: 0px 4px 0 4px;font-size:20px;top: 49px;left: 3px;">1</span>');
			}	
		}
		if (sfIndex == 2) {
			$('#info .sel2').remove();	
			let sel2 = $('#new_food_select_2');	
			v.starterFood2 = targetDish;
			if ((v.starterFood2 === undefined) || (v.starterFood2 === '')) {
				sel2[0].selectedIndex = 0;
			} else {
				$('#new_food_select_2').val(v.starterFood2);
				$('#new_food_select_2').change();
				$('#info #info_dishes .fooditem[data-type='+targetDish+']').append('<span class="qty sel2" style="color: #8ce08c;padding: 0px 6px 0 2px;font-size:20px;top: 49px;left: 57px;">2</span>');
			}
		}
		$('#info .fooditem[data-type='+targetDish+']').trigger('mouseover');			
	}
	
	function ClaimCharityReward() {
		let rewardForThisOne = '';
		if (v.charityBreakpoint % 2 == 0) {
			v.coupons = +v.coupons + (10 + ((+v.charityBreakpoint - 4) *2.5) );
			rewardForThisOne = '+<span class="em">🔖</span> ' + (10 + ((+v.charityBreakpoint - 4) *2.5) ) + ' coupons!';
		} else {
			v.deliveryGiftBoxes = +v.deliveryGiftBoxes + (10 + ((+v.charityBreakpoint - 5) *2.5));
			rewardForThisOne = '+<span class="em">🎁</span> ' + (10 + ((+v.charityBreakpoint - 5) *2.5) ) + ' giftboxes!';
		}
		v.charityBreakpoint++;
		
		let offsetCCR = $('#claim_charity_reward').eq(0).offset();
		offsetCCR.left = offsetCCR.left - 10;
		offsetCCR.top = offsetCCR.top - 50;
		ShowFirework(offsetCCR, true, rewardForThisOne);
		
		UpdateInfoScreen();
		if (v.skills['charity'] >= 1) {
			if (v.charityFood >= GetMaxQtyFromLv(v.charityBreakpoint)) {
				$('#info_button').css('background', '#ecae21');
				$('#info_tab_button_charity').css('background', '#ecae21');
			} else {
				$('#info_button').css('background', '');
				$('#info_tab_button_charity').css('background', '');
			}
		}
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
				console.log('undefined dt:' +thisDataType);
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
		if (v.prestigePointsTotal > 10000) {
			$('.total_prestige_points').text(AbbreviateNumber(v.prestigePointsTotal));
			$('.added_prestige_points').text(AbbreviateNumber(v.prestigePointsToGet));
			$('.unspent_skill_points').text(AbbreviateNumber(v.skillPointsUnspent));
			$('.get_prestige_points').text(AbbreviateNumber(+v.prestigePointsTotal + +v.prestigePointsToGet));
			$('.get_skill_points').text(AbbreviateNumber(+v.skillPointsUnspent + +v.prestigePointsToGet));
		} else {
			$('.total_prestige_points').text(v.prestigePointsTotal);
			$('.added_prestige_points').text(v.prestigePointsToGet);
			$('.unspent_skill_points').text(v.skillPointsUnspent);
			$('.get_prestige_points').text(+v.prestigePointsTotal + +v.prestigePointsToGet);
			$('.get_skill_points').text(+v.skillPointsUnspent + +v.prestigePointsToGet);
		}
		
		if (v.prestigePointsTotal == 0) {
			$('.before_first_prestige').show();
		} else {
			$('.before_first_prestige').hide();
		}		
		$( "#prestige_restaurant_button" ).off('click').on('click', function (e) {			
			$( "#dialog-confirm-prestige-qty" ).text(AbbreviateNumber(v.prestigePointsToGet));
			let prestigeBoostersUsed = +$('#prestige_boosters_input').val();
			let prestigePointMoneyEarnedBoosted = +v.prestigePointMoneyEarned + +(v.incomeWithDeliveries * prestigeBoostersUsed * PRESTIGE_BOOST_VALUE);
			let prestigePointsToGetBoosted = +v.prestigePointsToGet;
			let prestigePointsTotalBoosted = +v.prestigePointsTotal +v.prestigePointsToGet;
			let prestigePointCostBoosted = +v.prestigePointCost;
			
			if (v.prestigePointsTotal < 100000) {			
				while (prestigePointMoneyEarnedBoosted > prestigePointCostBoosted) {
					prestigePointMoneyEarnedBoosted = prestigePointMoneyEarnedBoosted - prestigePointCostBoosted;
					prestigePointsToGetBoosted++;
					prestigePointsTotalBoosted++;
					prestigePointCostBoosted = GetCostFromPP(prestigePointsTotalBoosted);				
				}
			} else {	// Lategame calculation
				let ppEarnedBoosted = Math.floor(prestigePointMoneyEarnedBoosted / prestigePointCostBoosted);
				let ppMult = Math.pow(2, v.region-1);
				prestigePointsToGetBoosted = +prestigePointsToGetBoosted + (+ppEarnedBoosted*ppMult);
				prestigePointsTotalBoosted = +prestigePointsTotalBoosted + (+ppEarnedBoosted*ppMult);
				prestigePointMoneyEarnedBoosted = prestigePointMoneyEarnedBoosted - (prestigePointCostBoosted*ppEarnedBoosted);
			}
			
			/*
			while (prestigePointMoneyEarnedBoosted > prestigePointCostBoosted) {
				prestigePointMoneyEarnedBoosted = prestigePointMoneyEarnedBoosted - prestigePointCostBoosted;
				prestigePointsToGetBoosted++;
				prestigePointsTotalBoosted++;
				prestigePointCostBoosted = +GetCostFromPP(prestigePointsTotalBoosted);				
			}
			*/
			
			
			if (prestigePointsToGetBoosted > v.prestigePointsToGet) {
				$( "#dialog-confirm-prestige-qty" ).text(AbbreviateNumber(v.prestigePointsToGet) + ' (' + AbbreviateNumber(prestigePointsToGetBoosted) + ')');
			}
			$( "#dialog-confirm-prestige" ).dialog({
				resizable: false,
				height: "auto",
				width: 400,
				modal: true,
				buttons: {
					"Prestige": function() {
						$( this ).dialog( "close" );
						PrestigeRestaurant();						
					},
					Cancel: function() {
						$( this ).dialog( "close" );
					}
				}
			});			
		});		
		
		if (v.skills.prestigeBoosters >= 1) {
			let prestigeBoostersUsed = +$('#prestige_boosters_input').val();
			let prestigePointMoneyEarnedBoosted = v.prestigePointMoneyEarned + (v.incomeWithDeliveries * prestigeBoostersUsed * PRESTIGE_BOOST_VALUE);
			let prestigePointsToGetBoosted = v.prestigePointsToGet;
			let prestigePointsTotalBoosted = +v.prestigePointsTotal +v.prestigePointsToGet;
			let prestigePointCostBoosted = v.prestigePointCost;
			
			if (v.prestigePointsTotal < 100000) {			
				while (prestigePointMoneyEarnedBoosted > prestigePointCostBoosted) {
					prestigePointMoneyEarnedBoosted = prestigePointMoneyEarnedBoosted - prestigePointCostBoosted;
					prestigePointsToGetBoosted++;
					prestigePointsTotalBoosted++;
					prestigePointCostBoosted = GetCostFromPP(prestigePointsTotalBoosted);				
				}
			} else {	// Lategame calculation
				let ppEarnedBoosted = Math.floor(prestigePointMoneyEarnedBoosted / prestigePointCostBoosted);
				let ppMult = Math.pow(2, v.region-1);
				prestigePointsToGetBoosted = +prestigePointsToGetBoosted + (+ppEarnedBoosted*ppMult);
				prestigePointsTotalBoosted = +prestigePointsTotalBoosted + (+ppEarnedBoosted*ppMult);
				prestigePointMoneyEarnedBoosted = prestigePointMoneyEarnedBoosted - (prestigePointCostBoosted*ppEarnedBoosted);
			}
			/*
			while (prestigePointMoneyEarnedBoosted > prestigePointCostBoosted) {
				prestigePointMoneyEarnedBoosted = prestigePointMoneyEarnedBoosted - prestigePointCostBoosted;
				prestigePointsToGetBoosted++;
				prestigePointsTotalBoosted++;
				prestigePointCostBoosted = GetCostFromPP(prestigePointsTotalBoosted);				
			}
			*/
			$('.added_prestige_points').text(AbbreviateNumber(prestigePointsToGetBoosted) + ' (and '+Math.floor((prestigePointMoneyEarnedBoosted/prestigePointCostBoosted) * 100) + '%)');
			$('.unspent_skill_points').text(AbbreviateNumber(v.skillPointsUnspent));
			$('.get_prestige_points').text(AbbreviateNumber(+v.prestigePointsTotal + +prestigePointsToGetBoosted ));
			$('.get_skill_points').text(AbbreviateNumber(+v.skillPointsUnspent + prestigePointsToGetBoosted ));
			
			$('#prestige .prestige_boosters').css('display', 'inline-block');
			$('#prestige .prestige_explanation').css('display', 'none');
			$('#prestige .prestige_boosters_used_bonus').css('display', 'block');
			
		}
		/*$("[type='number']").keydown(function (evt) {
			evt.preventDefault();
		});*/
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
			if ((v.prestigePointsTotal + v.prestigePointsToGet) >= +defaultSkillStats[skill].visible_at) { // visible
				if (nextLevelSkillPointCost === undefined) { // already maxed - add button to finished skills		
					finishedSkillButtons += '<button class="skillbutton finished disabled '+skill+'" data-skill="'+skill+'">' + defaultSkillStats[skill].name + '</button>';
				} else { // not maxed - add button to unlockable skills
					if (defaultSkillStats[skill].visible_at != -1) {
						if ( (v.prestigePointsTotal >= +defaultSkillStats[skill].active_at) && (v.skillPointsUnspent >= +nextLevelSkillPointCost) ) { // available
							unlockableSkillButtons += '<button class="skillbutton '+skill+'" data-skill="'+skill+'" data-cost="'+nextLevelSkillPointCost+'" onClick="UpgradeSkill(\''+skill+'\');">' + defaultSkillStats[skill].name + '<br>' + AbbreviateNumber(nextLevelSkillPointCost) + ' Points</button>';
						} else { //not available
							if (v.prestigePointsTotal < +defaultSkillStats[skill].active_at) { //not unlocked
								unlockableSkillButtons += '<button class="skillbutton disabled '+skill+'" data-skill="'+skill+'">' + defaultSkillStats[skill].name + '<br>Unlocks&nbsp;at&nbsp;' + defaultSkillStats[skill].active_at + '</button>';
							} else {	
								if (v.skillPointsUnspent < +nextLevelSkillPointCost) { //not enough points
									unlockableSkillButtons += '<button class="skillbutton disabled '+skill+'" data-skill="'+skill+'">' + defaultSkillStats[skill].name + '<br>' + AbbreviateNumber(nextLevelSkillPointCost) + ' Points</button>';
								}
							}
						}
					}	
				}				 
			}			
		}		
		if (v.prestigePointsTotal < 32000) {
			unlockableSkillButtons += '<div>Earn&nbsp;Prestige&nbsp;Points&nbsp;to&nbsp;unlock&nbsp;more&nbsp;Skills.</div>';
		}
		$('#unlockable_skill_buttons').html(unlockableSkillButtons);
		$('#finished_skill_buttons').html(finishedSkillButtons);
		if (finishedSkillButtons == '') {
			$('#finished_skill_label').hide();
			$('#finished_skill_buttons').hide();
		} else {
			$('#finished_skill_label').show();
			$('#finished_skill_buttons').show();
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
					desc += 'Current level: ' + currentSkillLevel + '<br>';	
				}
				if (skill === 'buffs') {
					if ((currentSkillLevel === undefined) || (currentSkillLevel === 0)) {
						desc += 'Next: Exotic Flavours every 3 Supercooks for money<br>';
					}
					if (currentSkillLevel === 1) {
						desc += 'Next: Food Decorations every 5 Supercooks for money<br>';
					}
					if (currentSkillLevel === 2) {
						desc += 'Next: Original Idea every 10 Supercooks for money<br>';
					}
					if (currentSkillLevel === 3) {
						desc += 'Next: Fortune Paper every 25 Supercooks for money<br>';
					}
				}
				if (skill === 'maxLevel') {
					desc += 'Max level quantity: ' + GetMaxQtyFromLv(currentSkillLevel - 1) + '<br>';
					if (GetMaxQtyFromLv(currentSkillLevel) < 10000) {
						desc += 'Next Max level quantity: ' + GetMaxQtyFromLv(currentSkillLevel) + '<br>';	
					}
				}
				if (v.prestigePointsTotal < defaultSkillStats[skill].active_at) {
					desc += 'Unlocks at ' + AbbreviateNumber(defaultSkillStats[skill].active_at) + ' total Prestige Points.<br>';
				}	
				if (defaultSkillStats[skill].levels[currentSkillLevel+1] > 0) {
					desc += 'Cost: ' + AbbreviateNumber(defaultSkillStats[skill].levels[currentSkillLevel+1]) + ' Skill Points.<br>';
				} else {
					desc += 'Maxed<br>';	
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
				let desc = 'Number of Prestige Points you\'ll get and a percent of progress towards the next point.<br>';				
				$descriptionBox.html(desc);
				descFadeout = false;
				e.stopPropagation();
			}).off('mouseout').on('mouseout', function (e) {
				DescStartFadeOut();
				e.stopPropagation();
			});
			
			$('.prestige_boosters').off('mouseover').on('mouseover', function (e) {				
				let desc = '<b>🌟 Prestige Boosters</b><br>';
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
				desc += 'Boost your prestige by spending 🌟 Prestige Boosters.<br>';
				desc += 'Every 🌟 Prestige Booster gives 4 hours of income.<br>';
				desc += 'You gain 1 🌟 Prestige Booster every day.<br>';
				desc += 'Current 🌟 Prestige Boosters: ' + v.prestigeBoosters + '<br>';				
				desc += 'Time until next one: <span class="prestige_booster_time_desc">' + pBTimeLeft + '</span><br>';
				
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
		
		if (v.incomeMultipliers.used_boosters === undefined) {
			v.incomeMultipliers.used_boosters = 1;
		}
		let bonusPercentDesc = Math.round((v.incomeMultipliers.used_boosters - 1)*100);
		if (v.prestigeBoosters > 0) {
			$('#prestige_boosters_input').attr('max', v.prestigeBoosters);			
			$('#prestige_boosters_total').text(' /' + v.prestigeBoosters);
			$('.prestige_boosters_used_bonus').html('Every used 🌟 Prestige booster will give you <br>4 hours of additional progress for this prestige<br>and +1% permanent income bonus.<br> Current bonus: ' + bonusPercentDesc + '%');
		} else {
			$('#prestige_boosters_input').attr('max', 0);
			$('#prestige_boosters_total').text(' /' + v.prestigeBoosters);
			$('.prestige_boosters_used_bonus').html('You get +1% permanent income bonus <br>for each 🌟 Prestige Booster used.<br> Current bonus: ' + bonusPercentDesc + '%');
		}
	}
	
	function UpdateProgressScreen() {
		let progressHTML = '';
		progressHTML += '<div class="tr_label" style="padding-bottom: 15px;">Progress</div>';
		if (v.region >= 1) {
			let ppMult = 1;
			if (v.region > 1) {
				ppMult = Math.pow(2, v.region-1);
			}
			progressHTML += '<div>';
			progressHTML += 'Current Region: <b>' + AbbreviateNumber(v.region) + '</b><br>';
			progressHTML += 'Current Region Prestige Points Multiplier: <b>' + AbbreviateNumber(ppMult) + '</b><br>';
			progressHTML += '</div>';
		}
		if ((v.prestigePointsTotal >= 0) || (v.prestigePointsToGet >= 2)) {
			progressHTML += '<div id="progress_slides" style="padding-bottom: 20px; min-height:	250px;">';
			progressHTML += 	'<div>';
			if (v.region > 10) {
				progressHTML += 		'<button id="progressLeftBig" style="width: 40px;height: 30px;margin-right: 10px;"><<</button>';
			}	
			progressHTML += 		'<button id="progressLeft" style="width: 30px;height: 30px;margin-right: 40px;"><</button>';
			progressHTML += 		'<button id="progressRight" class="disabled" style="width: 30px;height: 30px;">></button>';
			if (v.region > 10) {
				progressHTML += 		'<button id="progressRightBig" class="disabled" style="width: 40px;height: 30px;margin-left: 10px;">>></button>';
			}
			progressHTML += 	'</div>';
		}	
			
		for (let progressPoint in PROGRESS) {
			let requiredRegion = 0;
			if (PROGRESS[progressPoint].region !== undefined) {
				requiredRegion = PROGRESS[progressPoint].region;
			}
			if ((v.prestigePointsTotal + v.prestigePointsToGet >= PROGRESS[progressPoint].prestigePoints) && (v.region >= requiredRegion)) {
				let startPP = PROGRESS[progressPoint].prestigePoints;
				let endPP = 1000000000000;
				if (PROGRESS[+progressPoint+1] !== undefined) {
					endPP = PROGRESS[+progressPoint+1].prestigePoints;
				} else {
					endPP = 0;
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
				progressHTML += 		'<td class="progress_screen_pp_start" style="width: 33%; text-align: left;">'+AbbreviateNumber(startPP)+'</td>';		
				progressHTML += 		'<td class="progress_screen_pp_label" style="width: 33%; text-align: center;"><b>Prestige Points</b></td>';		
				progressHTML += 		'<td class="progress_screen_pp_end" style="width: 33%; text-align: right;">'+AbbreviateNumber(endPP)+'</td>';
				progressHTML += 	'</tr></tbody></table>';
				progressHTML += 	'<div class="progressbar_wrapper">';
				progressHTML += 		'<div style="width:'+progressBlankBar+'%;" class="progressbar_prestige_cover_progress_screen" id="progressbar_prestige_cover_progress_screen_'+progressPoint+'" style="width: 100%;"></div>';	
				progressHTML += 		'<div style="width:'+progressYellowBar+'%;" class="progressbar_prestige_progress_screen" id="progressbar_prestige_progress_screen_'+progressPoint+'"></div>';
							
				progressHTML += 	'</div>';
				progressHTML += '<div style="min-height: 18px;">';	
				if ((v.prestigePointsTotal > startPP) && (v.prestigePointsTotal < endPP)) {
					progressHTML += 	'<div class="current_pp_number" id="current_pp_number_'+progressPoint+
										'" style="position: relative; top: 0; left: '+leftPointerMargin+'%; width: 	1px; text-align: left;">';
					progressHTML += 		AbbreviateNumber(v.prestigePointsTotal);
					progressHTML += 	'</div>';
				}	
				progressHTML += '</div>';
				progressHTML += '</div>';				
			}		
		}
		
		if ((v.currentChallenge > 0) && (v.currentChallenge < 32)) {
			progressHTML += '<div class="tr_label" style="padding-bottom: 15px;">Challenge</div>';
			progressHTML += CheckChallenge(v.currentChallenge);
		}
			
		$('#progress').html(progressHTML);
		if (v.options.pingedDev) {
			$('#PingTheDev').hide();
		}
		
		if ((v.prestigePointsTotal + v.prestigePointsToGet >= 64000) && (v.region == 0)) {
			$('#go_to_first_region').html('<button style="height: 57px;" onClick="GoToFirstRegion();">Prestige and go to the first region!</button>');
		}
			
		$('.progress_slide').hide();
		$('.progress_slide').last().addClass('active');

		$('#progressLeft').off('click').on('click', function (e) {
			let activeID = +$('.progress_slide.active').eq(0).attr('id').split('ppid_').join('');			
			if (activeID > 0) {
				$('.progress_slide.active').removeClass('active');			
				$('#ppid_'+(activeID-1)).addClass('active');
				$('#progressRight').removeClass('disabled');
				$('#progressRightBig').removeClass('disabled');
			}
			if (activeID == 1) {
				$('#progressLeft').addClass('disabled');
				$('#progressLeftBig').addClass('disabled');
			}
		});		
		$('#progressRight').off('click').on('click', function (e) {
			let activeID = +$('.progress_slide.active').eq(0).attr('id').split('ppid_').join('');
			if ($('#ppid_'+(activeID+1)).length > 0) {
				$('.progress_slide.active').removeClass('active');			
				$('#ppid_'+(activeID+1)).addClass('active');
				$('#progressLeft').removeClass('disabled');
				$('#progressLeftBig').removeClass('disabled');
			}
			if (activeID == $('.progress_slide').length - 2) {
				$('#progressRight').addClass('disabled');
				$('#progressRightBig').addClass('disabled');
			}
		});
		$('#progressLeftBig').off('click').on('click', function (e) {
			let activeID = +$('.progress_slide.active').eq(0).attr('id').split('ppid_').join('');			
			if (activeID > 10) {
				$('.progress_slide.active').removeClass('active');			
				$('#ppid_'+(activeID-10)).addClass('active');
				$('#progressRight').removeClass('disabled');
				$('#progressRightBig').removeClass('disabled');
			}
			if (activeID == 1) {
				$('#progressLeft').addClass('disabled');
				$('#progressLeftBig').addClass('disabled');
			}
		});		
		$('#progressRightBig').off('click').on('click', function (e) {
			let activeID = +$('.progress_slide.active').eq(0).attr('id').split('ppid_').join('');
			if ($('#ppid_'+(activeID+10)).length > 0) {
				$('.progress_slide.active').removeClass('active');			
				$('#ppid_'+(activeID+10)).addClass('active');
				$('#progressLeft').removeClass('disabled');
				$('#progressLeftBig').removeClass('disabled');
			}
			if (activeID == $('.progress_slide').length - 10) {
				$('#progressRight').addClass('disabled');
				$('#progressRightBig').addClass('disabled');
			}
		});
		
		if (v.region >= 1) {
			for (let i = 0; i <= v.region; i++) {
				let regionHtml = '';
				
				if (i <= 10) {
					regionHtml += '<b>'+regionsStats[i].name+'</b><br><br>';
					regionHtml += regionsStats[i].desc+'<br><br>';
					for (let regionChallenge in regionsStats[i].challenges) {
						let challengeResult = window[regionsStats[i].challenges[regionChallenge]]();
						regionHtml += challengeResult[1];						
					}
					regionHtml += '<button class="button_dev_log" onClick="ToggleDevLog();">Dev Log</button>';
				} else {
					if (i < 100) {
						regionHtml += '<b>Outer Region '+(i-10)+'/89</b><br><br>';
						regionHtml += 'Trend dish:<br><div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="'+OUTER_REGIONS_DISHES[i-11]+'" data-qty="100" style="cursor: auto;"></div></div><br>';
						if (i % 2 == 1) {
							regionHtml += CheckWord(OUTER_REGIONS_WORDS[i-11], 'R'+i+'_CheckWordOuter')[1];							
						} else {
							regionHtml += CheckPuzzle(OUTER_REGIONS_WORDS[i-11], 'R'+i+'_CheckPuzzleOuter')[1];	
						}	
						if (i == 11) {
							regionHtml += 'Every Outer Region has a unique Trend Dish<br> that produces the biggest Base Income (20).<br> Deliveries are not affected.<br><br>Challenges give 2 prizes. Perks are randomized differently (most chosen perk appears more).';
						}						
					}	
				}
				
				if ( (i == v.region) && (v.prestigePointsTotal > PROGRESS[+i+CHAPTERQTY+1].prestigePoints) ) {
					regionHtml += '<br><button onClick="GoToNextRegion();">Go to the next region!</button>';
				}				
			
				$('#regions_text_'+i).html(regionHtml);
			}
			
		}
		showDevLog = false;
	}
	
	let showDevLog = false;
	function ToggleDevLog() {
		if (showDevLog) {
			$('#progress .dev_log').hide();			
			$('#progress .regions_text').show();
			showDevLog = false;			
		} else {
			$('#progress .dev_log').show();			
			$('#progress .regions_text').hide();
			showDevLog = true;
		}
	}
	
	function UpdateOptionsScreen() {
		CheckSaveToFile();
		$('#options_normal_mode').removeAttr('checked');
		$('#options_normal_mode').prop('checked', false);
		$('#options_dark_mode').removeAttr('checked');
		$('#options_dark_mode').prop('checked', false);
		$('#options_blue_mode').removeAttr('checked');
		$('#options_blue_mode').prop('checked', false);
		
		
		
		if (v.options.darkmode === true) {
			$('#options_dark_mode').attr('checked', 'checked');
			$('#options_dark_mode').prop('checked', true);
		}		
		if (v.options.bluemode === true) {
			$('#options_blue_mode').attr('checked', 'checked');
			$('#options_blue_mode').prop('checked', true);
		}
		if ( (!v.options.darkmode) && (!v.options.bluemode) ) {
			$('#options_normal_mode').attr('checked', 'checked');
			$('#options_normal_mode').prop('checked', true);
		}
		
		$('#options_normal_mode, #options_dark_mode, #options_blue_mode').off('click').on('click', function (e) {
			if ($('#options_normal_mode').is(':checked')) {
				v.options.darkmode = false;
				v.options.bluemode = false;
			}
			if ($('#options_dark_mode').is(':checked')) {
				v.options.darkmode = true;
			} else {
				v.options.darkmode = false;
			}
			if ($('#options_blue_mode').is(':checked')) {
				v.options.bluemode = true;
				v.options.darkmode = true;
			} else {
				v.options.bluemode = false;
			}
			if (v.options.darkmode === true) {
				$('body').addClass('darkMode');
			} else {				
				$('body').removeClass('darkMode');
			}
			
			if (v.options.bluemode === true) {
				$('body').addClass('blueMode');
			} else {				
				$('body').removeClass('blueMode');
			}
			
			SaveGame();
		});
		
		if (v.options.tu_animation === true) {
			$('#options_tu_animation').attr('checked', 'checked');
			$('#options_tu_animation').prop('checked', true);
		} else {
			$('#options_tu_animation').removeAttr('checked');
			$('#options_tu_animation').prop('checked', false);
		}
		$('#options_tu_animation').off('click').on('click', function (e) {
			if ($('#options_tu_animation').is(':checked')) {
				v.options.tu_animation = true;
			} else {
				v.options.tu_animation = false;
			}
			if (v.options.tu_animation === true) {
				$('body').addClass('tu_animation');
			} else {
				$('body').removeClass('tu_animation');
			}
		});
		
		if ((!v.options.gotRedditReward) && (v.skills['coupons'] >= 1)) {
			$('#reddit_link').html('https://www.reddit.com/r/restaurantidle/<br>Click here (opens new tab) Reward:+10🔖').on('click', function (e) {
				$(this).html('Checked out');
				if (!v.options.gotRedditReward) {
					v.options.gotRedditReward = true;
					v.coupons = +v.coupons + 10;
				}
			});
		};

		
		if ((!v.options.gotDiscordReward) && (v.skills['coupons'] >= 1)) {		
			$('#discord_link').html('https://discord.gg/rEgC33c<br>Click here (opens new tab) Reward:+10🔖').on('click', function (e) {
				$(this).html('Checked out');
				if (!v.options.gotDiscordReward) {
					v.options.gotDiscordReward = true;
					v.coupons = +v.coupons + 10;
				}
			});
		}
			
		if (v.options.e_notation === true) {
			$('#options_e_notation').attr('checked', 'checked');
			$('#options_e_notation').prop('checked', true);
		} else {
			$('#options_e_notation').removeAttr('checked');
			$('#options_e_notation').prop('checked', false);
		}
		$('#options_e_notation').off('click').on('click', function (e) {
			if ($('#options_e_notation').is(':checked')) {
				v.options.e_notation = true;
			} else {
				v.options.e_notation = false;
			}
		});
		
		if (v.options.blockOnHL === true) {
			$('#options_prevent_on_hl').attr('checked', 'checked');
			$('#options_prevent_on_hl').prop('checked', true);
		} else {
			$('#options_prevent_on_hl').removeAttr('checked');
			$('#options_prevent_on_hl').prop('checked', false);
		}
		$('#options_prevent_on_hl').off('click').on('click', function (e) {
			if ($('#options_prevent_on_hl').is(':checked')) {
				v.options.blockOnHL = true;
			} else {
				v.options.blockOnHL = false;
			}
		});
		
		if (v.skills['buffs'] >= 1) {
			$('#div_options_buff_autoplacement').show();
			if (v.options.buff_autoplacement === true) {
				$('#options_buff_autoplacement').attr('checked', 'checked');
				$('#options_buff_autoplacement').prop('checked', true);
			} else {
				$('#options_buff_autoplacement').removeAttr('checked');
				$('#options_buff_autoplacement').prop('checked', false);
			}
			$('#options_buff_autoplacement').off('click').on('click', function (e) {
				if ($('#options_buff_autoplacement').is(':checked')) {
					v.options.buff_autoplacement = true;
				} else {
					v.options.buff_autoplacement = false;
				}
			});
		} else {
			$('#div_options_buff_autoplacement').hide();
		}
		
		if (v.skills['coupons'] >= 1) {
			$('#div_options_megacook_percent').show();
		} else {			
			$('#div_options_megacook_percent').hide();
		}
		
		$('#tofile_btn').off('click').on('click', function (e) {
			if (!($('#daily_save').css('display') == 'none')) {
				v.coupons = +v.coupons + 10;
				window.localStorage.setItem('lastSaveToFile', Date.now());
			}
			SaveGame();
			let impVar = {};
			impVar.v = window.localStorage.getItem('v');
			impVar.paid = window.localStorage.getItem('paid');
			impVar.date = window.localStorage.getItem('date');
			impVar.gameState = window.localStorage.getItem('gameState');
			impVar.version = window.localStorage.getItem('version');
			impVar.tierupData = window.localStorage.getItem('tierupData');
			impVar.deliveryData = window.localStorage.getItem('deliveryData');
			impVar.gameData = window.localStorage.getItem('gameData');
			impVar.history = window.localStorage.getItem('history');
			impVar.perkData = window.localStorage.getItem('perkData');
			impVar.selectStarterRestaurantData = window.localStorage.getItem('selectStarterRestaurantData');
			impVar.lastSaveToFile = window.localStorage.getItem('lastSaveToFile');			
			let saveText = (btoa(encodeURIComponent(JSON.stringify(impVar))));
			let todayDate = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, 10);;
			downloadFile('restaurantidle_'+todayDate+'.txt', saveText);
			$('#daily_save').hide();		
			$('#daily_wait').show();		
			$('#tofile_btn').css('background', '');
			$('#preferences_button').css('background', '');			
		});
			
		$('#import_btn').off('click').on('click', function (e) { // import should have been called Export and vice versa :/ (shrug)
			SaveGame();
			let impVar = {};
			impVar.v = window.localStorage.getItem('v');
			impVar.paid = window.localStorage.getItem('paid');
			impVar.date = window.localStorage.getItem('date');
			impVar.gameState = window.localStorage.getItem('gameState');
			impVar.version = window.localStorage.getItem('version');
			impVar.tierupData = window.localStorage.getItem('tierupData');
			impVar.deliveryData = window.localStorage.getItem('deliveryData');
			impVar.gameData = window.localStorage.getItem('gameData');
			impVar.history = window.localStorage.getItem('history');
			impVar.perkData = window.localStorage.getItem('perkData');
			impVar.selectStarterRestaurantData = window.localStorage.getItem('selectStarterRestaurantData');
			impVar.lastSaveToFile = window.localStorage.getItem('lastSaveToFile');		
			$('#import_export_box').text(btoa(encodeURIComponent(JSON.stringify(impVar))));
			$('#import_export_box').val(btoa(encodeURIComponent(JSON.stringify(impVar))));
		});
		$('#export_btn').off('click').on('click', function (e) { // Import
			$( "#dialog-import" ).dialog({
					resizable: false,
					height: "auto",
					width: 400,
					modal: true,
					buttons: {
						"Import": function() {
							let expVar = $('#import_export_box').text();
							if (expVar == '') {
								expVar = $('#import_export_box').val(); //Opera thinks it's val
							}
							
							expVar = expVar.split('.').join(''); // deleting dots from an old version of save
							
							try {															
								expVar = JSON.parse(decodeURIComponent(atob(expVar)));
							} catch(err) {
								$('<div title="Error" style="text-align:center;">Wrong format 103. Please make sure you pasted the whole savefile text to the box.</div>').dialog({
									modal: true,
									buttons: {
										Ok: function() {
											$( this ).dialog( "close" );
										}
									}
								});	
								$( this ).dialog( "close" );
								return false;
							}
							
							if (expVar.v === undefined) {
								$('<div title="Error" style="text-align:center;">Wrong format 104. Please make sure you pasted the whole savefile text to the box.</div>').dialog({
									modal: true,
									buttons: {
										Ok: function() {
											$( this ).dialog( "close" );
										}
									}
								});	
								$( this ).dialog( "close" );
							}
							
							window.localStorage.setItem('v', JSON.stringify(JSON.parse(expVar.v))); // cleanup
							if (expVar.paid !== undefined) {
								window.localStorage.setItem('paid', JSON.stringify(JSON.parse(expVar.paid)));
							} else {
								paid = {}; // paid stuff
								paid.gems = 0;
								paid.gems_spent = 0;
								paid.gems_from_challenges = 0;
								paid.gems_last_operation = 0;
								paid.triple_choice = false;
								paid.awarded_triple_choice = false;
								paid.awarded_gems = 0;
								paid.claimed_gems = 0;
							}
							
							if (expVar.deliveryData === undefined) {
								expVar.deliveryData = null; 
							}
							window.localStorage.setItem('date', expVar.date);
							window.localStorage.setItem('lastSaveToFile', expVar.lastSaveToFile);
							window.localStorage.setItem('gameState', expVar.gameState);
							window.localStorage.setItem('version', expVar.version);
							window.localStorage.setItem('tierupData', JSON.stringify(JSON.parse(expVar.tierupData)));
							window.localStorage.setItem('deliveryData', JSON.stringify(JSON.parse(expVar.deliveryData)));
							window.localStorage.setItem('gameData', JSON.stringify(JSON.parse(expVar.gameData)));
							window.localStorage.setItem('history', expVar.history);
							window.localStorage.setItem('perkData', JSON.stringify(JSON.parse(expVar.perkData)));
							window.localStorage.setItem('selectStarterRestaurantData', JSON.stringify(JSON.parse(expVar.selectStarterRestaurantData)));
							
							$( this ).dialog( "close" );
							LoadGame(false);						
							
							$('#game_button').click();
							UpdatePrestigeButtons();
							UpdatePrestigeScreen();
							if (!debug1) {
								PrestigeRestaurant();
							}	
							SaveGame();						
						},
						Cancel: function() {
						  $( this ).dialog( "close" );
						}
					}
				});			
			return false;
			
			
			
		});
		$('#select_all_btn').off('click').on('click', function (e) {
			$('#import_export_box').select();
		});
		/*$("[type='number']").keydown(function (evt) {
			evt.preventDefault();
		});*/
		$('#megacook_percent_input').off('change').on('change', function (e) {
			let newMegagookPercent = $('#megacook_percent_input').val();
			if ((newMegagookPercent != undefined) && (newMegagookPercent >= 10) && (newMegagookPercent <= 25)) {
				v.options.megacookPercent = newMegagookPercent;
			}			
		});
		if ((v.options.megacookPercent != undefined) && (v.options.megacookPercent >= 10) && (v.options.megacookPercent <= 25)) {
			$('#megacook_percent_input').val(v.options.megacookPercent);
		}
	}
	
	function downloadFile(filename, text) {
	  var element = document.createElement('a');
	  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	  element.setAttribute('download', filename);

	  element.style.display = 'none';
	  document.body.appendChild(element);

	  element.click();

	  document.body.removeChild(element);
	}	
	
	function UpdateShopScreen() {
		$('#shop .ppImg').show();
		
		if (!kongversion) {
			$('#login_btn').on('click', function () {
				$.post("https://restaurantidle.com/login.php",
				  {
					username: $('#username_input').val(),
					password: $('#password_input').val()
				  },
				  function(data, status){
					alert("Data: " + data + "\nStatus: " + status);
				  });
			});
			$('#register_btn').on('click', function () {
				$.post("https://restaurantidle.com/register.php",
				  {
					username: $('#username_input').val(),
					password: $('#password_input').val(),
					confirm_password: $('#password_input').val()
				  },
				  function(data, status){
					alert("Data: " + data + "\nStatus: " + status);
				  });
			});
		}
		
		$("#gems").html(paid.gems+' <span>💎</span>');
		
		$("#purchase_help_center").hide();
		$("#shop_inner").show();	
		
		if (kongversion) {
			kongregate.mtx.requestUserItemList(null, onUserItems);
		}
		
		if (paid.triple_choice === true) {
			$(".btnBuyTriple").hide();
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
		EverySecond();
	}
	
	
	function ShowPurchaseHelp() {
		$("#purchase_help_center").show();
		$("#shop_inner").hide();		
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
						if (v.region < 1) {
							v.newFood.push(prop);
						} else {
							v.activeFood.push(prop);
						}	
					}
				}	
			}
			if (gameState === 'selectStarterRestaurant') {
				SelectStarterRestaurant();
			}
		}
		
		if (skillName.indexOf('tier4food') >= 0) {
			for (let prop in defaultFoodStats) {
				if ((defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].class_a != 'buff')) {					
					if ( (defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].baseIncome == 8) && (v.skills.tier4food >= 1) ) {
						if (v.region < 1) {
							v.newFood.push(prop);
						} else {
							v.activeFood.push(prop);
						}	
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
			if (!debug2) {
				v.currentChallenge = 10;
			}	
		}
			
		if (skillName.indexOf('novelty') >= 0) {			
			for (let catName in v.categoryBonuses) {
				if (catName == GetLastHistoryTopClass()) {
					v.currentNovelty[catName] = 50;
					v.categoryBonuses[catName] = (Math.round(defaultCategoryBonuses[catName] * (100 + v.currentNovelty[catName])))/100;			
				} else {
					v.categoryBonuses[catName] = (Math.round(defaultCategoryBonuses[catName] * (100 + v.currentNovelty[catName])))/100;			
				}	
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
		if (debug2) {
			return false;
		}
		if ((v.money == Number.POSITIVE_INFINITY) || (v.prestigePointsTotal == Number.POSITIVE_INFINITY)) {
			v.reachedInfinity = true;
		}
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
			window.localStorage.setItem('version', v.version);
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
			
			let deliveryData = {};
			deliveryData.kitchenFI = [];
			deliveryData.storefrontFI = [];
			if ((v.deliveryStatus == "play") || (v.deliveryStatus == "end")) {
				$('#delivery_storefront .fooditem').each( function() {			
					let fooditem = {};
					fooditem.buffs = $(this).attr('data-buffs');
					fooditem.type = $(this).attr('data-type');
					fooditem.qty = $(this).attr('data-qty');
					deliveryData.storefrontFI.push(fooditem);
				});
				$('#delivery_kitchen .fooditem').each( function() {			
					let fooditem = {};
					fooditem.buffs = $(this).attr('data-buffs');
					fooditem.type = $(this).attr('data-type');
					fooditem.qty = $(this).attr('data-qty');
					deliveryData.kitchenFI.push(fooditem);
				});
				window.localStorage.setItem('deliveryData', JSON.stringify(deliveryData));
			} else {
				//window.localStorage.setItem('deliveryData', null);	
			}

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
		if ((v == null) || (v === {})) {
			window.localStorage.removeItem('v');
			window.localStorage.removeItem('date');
			window.localStorage.removeItem('version');
			window.localStorage.removeItem('gameState');
			window.localStorage.removeItem('gameData');
			window.localStorage.removeItem('perkData');
			window.localStorage.removeItem('deliveryData');
			window.localStorage.removeItem('tierupData');
			window.localStorage.removeItem('selectStarterRestaurantData');
			window.localStorage.removeItem('history');
			location.reload();
		}
		v.prestigePointCost = GetCostFromPP(v.prestigePointsTotal + v.prestigePointsToGet);
		
		if (v.reachedInfinity == true) {
			v.money = Number.POSITIVE_INFINITY;
			v.prestigePointsTotal = Number.POSITIVE_INFINITY;
		}
		
		if (isNaN(v.money)) {
			v.money = 0;
			console.log('NaN!');
		}
		if (isNaN(v.prestigePointsToGet)) {
			v.prestigePointsToGet = 0;
			console.log('NaN!!');
		}
		if (isNaN(v.prestigePointMoneyEarned)) {
			v.prestigePointMoneyEarned = 0;
			console.log('NaN!!!');
		}	
		if (v.incomeMultipliers !== undefined) {
			if (v.incomeMultipliers.season_1 < 1) {
				v.incomeMultipliers.season_1 = 1;
				console.log('-inf');
			}	
		}	
		
		if (window.localStorage.getItem('paid') != null) {
			paid = JSON.parse(window.localStorage.getItem('paid'));
		}	
		DefineNewVariables();
		let gameData = JSON.parse(window.localStorage.getItem('gameData'));	
		if (gameData == null) {
			gameData = {};
		}
			
		SetGameState(window.localStorage.getItem('gameState'));
		let currentTime = Date.now();
		let timeDif = Math.round((currentTime - window.localStorage.getItem('date')) / 1000);
			
		let defaultHTML = '';		
		for (let idefaultFI in gameData.defaultFI) {
			let qtySpan = '';
			if (gameData.defaultFI[idefaultFI].qty > 1) {
				qtySpan = '<span class="qty">'+AbbreviateNumber2(gameData.defaultFI[idefaultFI].qty)+'</span>';
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
				qtySpan = '<span class="qty">'+AbbreviateNumber2(gameData.storefrontFI[istorefrontFI].qty)+'</span>';
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
				qtySpan = '<span class="qty">'+AbbreviateNumber2(gameData.kitchenFI[ikitchenFI].qty)+'</span>';
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
		
		$('#dwNewBatch').prop(	'disabled', false);
		$('#dwTake').prop(		'disabled', true);
		$('#dwClean').prop(		'disabled', true);
		$('#dwWash').prop(		'disabled', true);
		$('#dwPut').prop(		'disabled', true);
		$('#dwDone').prop(		'disabled', true);
		
		// DELIVERY
		
		if ((v.deliveryStatus == "play") || (v.deliveryStatus == "end")) { 
			let deliveryData = JSON.parse(window.localStorage.getItem('deliveryData'));	
			let delStorefrontHTML = '';
			if (deliveryData) {
				delStorefrontHTML += '<div class="delivery_fooditems">';
				for (let istorefrontFI in deliveryData.storefrontFI) {
					let qtySpan = '';
					if (deliveryData.storefrontFI[istorefrontFI].qty > 1) {
						qtySpan = '<span class="qty">'+AbbreviateNumber2(deliveryData.storefrontFI[istorefrontFI].qty)+'</span>';
					}
					let iBuffs = deliveryData.storefrontFI[istorefrontFI].buffs;
					if (iBuffs !== undefined) {
						iBuffs = iBuffs.split('"').join('&quot;');
						delStorefrontHTML += '<div class="fooditem-wrapper"><div class="fooditem" data-buffs="'+iBuffs+'" data-type="'+deliveryData.storefrontFI[istorefrontFI].type+'" data-qty="'+deliveryData.storefrontFI[istorefrontFI].qty+'">'+qtySpan+'</div></div>';
					}					
				}	
				delStorefrontHTML += '</div>';
			}	
			if (v.skills['complimentary_drink'] >= 1) {
				delStorefrontHTML += '<div id="img_complimentary_drink"></div>';
			}
			
			$('#delivery_storefront').html(delStorefrontHTML);
		
			let delKitchenHTML = '';		
			for (let ikitchenFI in deliveryData.kitchenFI) {
				let qtySpan = '';
				if (deliveryData.kitchenFI[ikitchenFI].qty > 1) {
					qtySpan = '<span class="qty">'+AbbreviateNumber2(deliveryData.kitchenFI[ikitchenFI].qty)+'</span>';
				} 
				let iBuffs = deliveryData.kitchenFI[ikitchenFI].buffs;
				if (iBuffs !== undefined) {
					iBuffs = iBuffs.split('"').join('&quot;');
					delKitchenHTML += '<div class="fooditem-wrapper"><div class="fooditem" data-buffs="'+iBuffs+'" data-type="'+deliveryData.kitchenFI[ikitchenFI].type+'" data-qty="'+deliveryData.kitchenFI[ikitchenFI].qty+'">'+qtySpan+'</div></div>';
				}	
			}		
			$('#delivery_kitchen').html(delKitchenHTML);
		}	
		
		SetJQReferences();
		InitializeButtons();
		UpdateInfoScreen();
		UpdatePrestigeScreen();		
		DishwashingRefresh();	
		
		if (t[v.tutorialLevel].val >= t['tierup0'].val) {
			$('#progressbars').fadeIn(500);
			$('#prestige_button_locked').hide();
			$('#progress_button_locked').hide();
			$('#prestige_button').fadeIn(500);
			$('#progress_button').fadeIn(500);
		}
		
	
		if (t[v.tutorialLevel].val >= t['idle3'].val) {		
			$('#shop_button_locked').hide();
			$('#shop_button').fadeIn(500);			
		}
		
		if ((v.tutorialLevel >= 'idle4')) { // add deliveries
			$('#delivery_button_locked').hide();
			$deliveryButton.fadeIn(500);
		}
		
		if (v.version < 201) {			
			Season1To2();
			return false;
		}
		
		if (showDialog) {
			if ((timeDif > 0) && (gameState === 'normal')) {
				let oldMoney = v.money;
				let oldCoupons = v.coupons;
				MultipleSeconds(timeDif);
				UpdateIncome();
				let couponsEarned = '';
				if (v.coupons - oldCoupons >= 1) {
					couponsEarned = 'and ' + (v.coupons - oldCoupons) + ' 🔖<br>';
				}
				let welcomeBackHTML = 'You were away for <b>' + BeautifyTime(timeDif) + ' </b>';
				welcomeBackHTML += ' and earned<br><br><b class="money_earned">' + (AbbreviateNumberLong(v.money - oldMoney)).toString().replace(' ', '<br>') + ' $</b><br>'+couponsEarned+'<br>';
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
					
					welcomeBackHTML += 'Your top performing dish is<br>';
					welcomeBackHTML += '<div class="fooditem-wrapper"><div class="fooditem" data-buffs="" data-type="'+bestIncomeType+'" data-qty="1"></div></div>';
					welcomeBackHTML += '<br>and it made about <b class="percent_earned">'+bestIncomePercent+'%</b> of your income!';
				}
				let today = new Date();
				let weekday = today.getUTCDay();
				if (weekday == 5) {				
					welcomeBackHTML += '<hr>Today is our weekly <br>"Nice Food Pics Day"<br>on Discord <a style="color: #f68c0b;" href="https://discord.gg/rEgC33c">(click here)</a>.<br> Come take a look!';
				}				
				$("#return_popup").html(welcomeBackHTML).dialog({
					position: { my: "center", at: "center", of: 'body' },
					modal: true,
					buttons: {
						Ok: function() {
							$( this ).dialog( "close" );
						}
					}
				});
			}
			if ((timeDif > 0) && (gameState !== 'normal')) {
				let oldMoney = v.money;
				let oldCoupons = v.coupons;
				MultipleSeconds(timeDif);
				let welcomeBackHTML = 'You were away for<br><b>' + BeautifyTime(timeDif) + ' </b><br>';
				welcomeBackHTML += '<br> and earned<br><b>' + AbbreviateNumberLong(v.money - oldMoney) + ' $</b><br>';
				$("#return_popup").html(welcomeBackHTML).dialog({
					modal: true,
					buttons: {
						Ok: function() {
							$( this ).dialog( "close" );
						}
					}
				});			
			}
		} else {
			MultipleSeconds(timeDif);
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
				optionsHTML += '<div id="new1" style="padding: 3px; border: 1px solid #c78888; display:inline-block;margin-bottom: 12px;" ><b style="color:#c78888">Set 1</b><br>';
				optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + tierupData[0].type + '" data-qty="1"></div></div>';
				optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + tierupData[1].type + '" data-qty="1"></div></div>';
				optionsHTML += 	'<br><button onClick="SetNewFood(1)">Choose</button>';			
				optionsHTML += '</div>';
				optionsHTML += '<div id="new2" style="padding: 3px; border: 1px solid #c78888; display:inline-block;margin-bottom: 12px;"><b style="color:#c78888">Set 2</b><br>';
				optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + tierupData[2].type + '" data-qty="1"></div></div>';
				optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + tierupData[3].type + '" data-qty="1"></div></div>';
				optionsHTML += 	'<br><button onClick="SetNewFood(2)">Choose</button>';
				optionsHTML += '</div>';
				if (v.skills.triple_choice === 'HardResetGame()') {
					if ( (tierupData[4] !== undefined) && (tierupData[5] !== undefined) ) {
						optionsHTML += '<div id="new3" style="padding: 3px; border: 1px solid #c78888; display:inline-block;margin-bottom: 12px;"><b style="color:#c78888">Set 3</b><br>';
						optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + tierupData[4].type + '" data-qty="1"></div></div>';
						optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + tierupData[5].type + '" data-qty="1"></div></div>';
						optionsHTML += 	'<br><button onClick="SetNewFood(3)">Choose</button>';
						optionsHTML += '</div>';
					}
				}
				
				$('#options	.inner').html(optionsHTML);
				$('#options .tr_label').text('Tier up');
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
							
							if ( (v.region == 4) && (thisBaseIncome == 4) && (thisClassA != 'buff') ) {
								thisBaseIncome = 8;
							} else {
								if ( (v.region == 4) && (thisBaseIncome == 8) ) {
									thisBaseIncome = 4;
								}
							}
							
							if ( (v.region == 8) && (thisBaseIncome == 2) && (thisClassA != 'buff') ) {
								thisBaseIncome = 8;
							} else {
								if ( (v.region == 8) && (thisBaseIncome == 8) ) {
									thisBaseIncome = 2;
								}
							}
							
							if ( (v.region == 10) && (thisBaseIncome == 1) && (thisClassA != 'buff') ) {
								thisBaseIncome = 8;
							} else {
								if ( (v.region == 10) && (thisBaseIncome == 8) ) {
									thisBaseIncome = 1;
								}
							}

							let thisDataTypeCapitalized = BeautifyDataType(thisDataType);

							let desc = '<b style="font-size: 16px;">' + thisDataTypeCapitalized + '</b><br>';
							desc += '<b class="category_circle" style="color:'+colors[thisClassA]+'">●</b> ' + BeautifyDataType(thisClassA) + '<br>';
							desc += '<b class="category_circle" style="color:'+colors[thisClassB]+'">●</b> ' + BeautifyDataType(thisClassB) + '<br>';
							desc += 'Base income: <b>' + thisBaseIncome + '</b><br>';
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
			} else { // broken tierup data
				SetGameState('normal');
			}
		}
		
		// SELECT STARTER RESTAURANT
		
		if (gameState == 'selectStarterRestaurant') {
			if (v.skills['tier2_3starter'] >= 1) {
				PrestigeRestaurant();
			} else {
				if (v.skills['starterRestaurants'] >= 1) {				
					let selectStarterRestaurantData = JSON.parse(window.localStorage.getItem('selectStarterRestaurantData'));
					let optionsHTML = '';
					
					$('#dishwashing').hide();
					$('#default').hide();
					$('#storefront').hide();
					
					optionsHTML += '<div id="new1" style="padding: 3px; border: 1px solid #c78888; display:inline-block;margin-bottom: 12px;" ><b class="restaurantname" style="color:#c78888; width:200px;height: 36px;display: block;">'+selectStarterRestaurantData.names[0]+'</b>';
					optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + selectStarterRestaurantData.food[0].type + '" data-qty="'+selectStarterRestaurantData.food[0].qty+'"><span class="qty">'+selectStarterRestaurantData.food[0].qty+'</span></div></div>';
					optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + selectStarterRestaurantData.food[1].type + '" data-qty="'+selectStarterRestaurantData.food[1].qty+'"><span class="qty">'+selectStarterRestaurantData.food[1].qty+'</span></div></div>';
					optionsHTML += 	'<br><button onClick="SetDefaultFood(1)">Choose</button>';			
					optionsHTML += '</div>';
					optionsHTML += '<div id="new2" style="padding: 3px; border: 1px solid #c78888; display:inline-block;margin-bottom: 12px;"><b class="restaurantname" style="color:#c78888; width:200px;height: 36px;display: block;">'+selectStarterRestaurantData.names[1]+'</b>';
					optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + selectStarterRestaurantData.food[2].type + '" data-qty="'+selectStarterRestaurantData.food[2].qty+'"><span class="qty">'+selectStarterRestaurantData.food[2].qty+'</span></div></div>';
					optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + selectStarterRestaurantData.food[3].type + '" data-qty="'+selectStarterRestaurantData.food[3].qty+'"><span class="qty">'+selectStarterRestaurantData.food[3].qty+'</span></div></div>';
					optionsHTML += 	'<br><button onClick="SetDefaultFood(2)">Choose</button>';
					optionsHTML += '</div>';
					if (v.skills.triple_choice === 'HardResetGame()') {
						optionsHTML += '<div id="new3" style="padding: 3px; border: 1px solid #c78888; display:inline-block;margin-bottom: 12px;"><b class="restaurantname" style="color:#c78888; width:200px;height: 36px;display: block;">'+selectStarterRestaurantData.names[2]+'</b>';
						optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + selectStarterRestaurantData.food[4].type + '" data-qty="'+selectStarterRestaurantData.food[4].qty+'"><span class="qty">'+selectStarterRestaurantData.food[4].qty+'</span></div></div>';
						optionsHTML += 	'<div class="fooditem-wrapper"><div class="fooditem" data-type="' + selectStarterRestaurantData.food[5].type + '" data-qty="'+selectStarterRestaurantData.food[5].qty+'"><span class="qty">'+selectStarterRestaurantData.food[5].qty+'</span></div></div>';
						optionsHTML += 	'<br><button onClick="SetDefaultFood(3)">Choose</button>';
						optionsHTML += '</div>';
					}
					
					$('#options	.inner').html(optionsHTML);
					$('#options .tr_label').text('Select starter restaurant');
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
								
								if ( (v.region == 4) && (thisBaseIncome == 4) && (thisClassA != 'buff') ) {
									thisBaseIncome = 8;
								} else {
									if ( (v.region == 4) && (thisBaseIncome == 8) ) {
										thisBaseIncome = 4;
									}
								}
								
								if ( (v.region == 8) && (thisBaseIncome == 2) && (thisClassA != 'buff') ) {
									thisBaseIncome = 8;
								} else {
									if ( (v.region == 8) && (thisBaseIncome == 8) ) {
										thisBaseIncome = 2;
									}
								}
								
								if ( (v.region == 10) && (thisBaseIncome == 1) && (thisClassA != 'buff') ) {
									thisBaseIncome = 8;
								} else {
									if ( (v.region == 10) && (thisBaseIncome == 8) ) {
										thisBaseIncome = 1;
									}
								}

								let thisDataTypeCapitalized = BeautifyDataType(thisDataType);

								let desc = '<b style="font-size: 16px;">' + thisDataTypeCapitalized + '</b><br>';
								desc += '<b class="category_circle" style="color:'+colors[thisClassA]+'">●</b> ' + BeautifyDataType(thisClassA) + '<br>';
								desc += '<b class="category_circle" style="color:'+colors[thisClassB]+'">●</b> ' + BeautifyDataType(thisClassB) + '<br>';
								desc += 'Base income: <b>' + thisBaseIncome + '</b><br>';
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
				} else {
					SetGameState('normal');	
				}
			}	
		}
		
		// PERK
		
		if (gameState == 'perk') {
			if (v.skills['perks'] >= 1) {
				let perkData = JSON.parse(window.localStorage.getItem('perkData'));
				let optionsHTML = '';
				
				if ((perkData[0] !== undefined) && (perkData[1] !== undefined)) {
					
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
					$('#options .tr_label').text('Choose one perk');
					
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
				} else {
					SetGameState('normal');	
				}	
			} else {
				SetGameState('normal');	
			}
			UpdateButtonsOnChange();			
		}	

		if ((v.skills['precise_science'] >= 1) && ((v.scienceCategory === undefined) || (v.scienceCategory === ''))) {
			$('#default').append('<div class="science_div"></div>');
			$('#default .science_div').append(science_select);
			$('#default .science_div').append('<button class="science" onClick="SetScience();">Apply science</button>');			
		} else if ((v.skills['science'] >= 1) && ((v.scienceCategory === undefined) || (v.scienceCategory === ''))) {
			$('#default').append('<button class="science" onClick="DoScience();">Apply science</button>');
		}
		if (v.options.darkmode === true) {
			$('body').addClass('darkMode');
		}
		if (v.options.bluemode === true) {
			$('body').addClass('darkMode');
			$('body').addClass('blueMode');
		}
		if (v.options.tu_animation === true) {
			$('body').addClass('tu_animation');
		}
		
		UpdateIncome();		
		UpdateFoodItems();	
		CheckSaveToFile();
		CheckRegionEffect();
		
		if ((v.tutorialLevel >= 'idle0') && (v.tutorialLevel <= 'idle3')) {
			UpdateTutorial();
		}
				
		if (v.skills['tier2_3starter'] >= 1) {
			$('#game').addClass('tier23');
		} else {
			$('#game').removeClass('tier23');
		}
		if (paid.triple_choice == true) {
			v.skills.triple_choice = 'HardResetGame()';
		}
		
		if (v.currentChallenge == 31) {
			v.currentChallenge = 32;
		}
		
		let storefrontSlots = $("#storefront .fooditem").length;
			
		if (storefrontSlots > 18) {
			$('#game').addClass('bigmenu');
		} else {
			$('#game').removeClass('bigmenu');
		}	
		
		if (storefrontSlots >= 25) {				
			$('#storefront').addClass('pages2').addClass('multipage');
			$('#storefront').addClass('page1');
		}			
		if (storefrontSlots >= 49) {
			$('#storefront').addClass('pages3');
			$('#storefront').addClass('page1');
		}
		if (storefrontSlots >= 73) {
			$('#storefront').addClass('pages4');
			$('#storefront').addClass('page1');
		}
		
		if (v.reachedInfinity === true) {
			v.money = Number.POSITIVE_INFINITY;
			v.prestigePointsTotal = Number.POSITIVE_INFINITY;
		}
		
		EveryMinute(); // update highlighted buttons
		FixMistakes();
		$('#cook_buttons .cook').css('margin-right', '');
	}
	
	function FixMistakes() { // shrug
		$('.fooditem').each( function() {
			if ($(this).attr('data-type') == 'assorted_macaroons') {
				$(this).attr('data-type','assorted_macarons');
			}
		});
		
		for (let index in v.activeFood) {
			if (v.activeFood[index] == 'assorted_macaroons') {
				v.activeFood[index] = 'assorted_macarons';
			}	
		}
	}
	
	function Season1To2() {		
		let ppWas = v.prestigePointsTotal;
		
		v.incomeMultipliers = {};		
		v.incomeMultipliers.season_1 = CalcSeason1Bonus(ppWas);		
		v.version = 201;
		
		v.season1Trophy = v.prestigePointsTotal;
		if (v.prestigePointsTotal > 10000) {
			v.prestigePointsTotal = 10000;
			v.prestigePointMoneyEarned = 0;
			v.prestigePointsToGet = 0;
			v.skillPointsUnspent = 10000;
			v.coupons = 500;				
			v.prestigeBoosters = 10;
		
			v.tutorialLevel = 'prestiged0';
			
			UpdateTutorial();

			v.skills = {}; // to store current active skills
			v.skills.minCook = 1;
			v.skills.maxCook = 2;
			v.skills.maxLevel = 4;
			v.skills.maxBuff = 1;

			v.skills.coupons = 0;
			v.skills.buffs = 0;
			v.skills.tier3food = 0;
			v.skills.cook2 = 0;
			v.skills.prestigeBoosters = 0;
			v.skills.starterRestaurants = 0;
			v.skills.perks = 0;
			v.skills.cook3 = 0;
			v.skills.challenges = 0;
			v.skills.tier2_3starter = 0;
			v.skills.dishOfTheDay = 0;
			v.skills.cook6 = 0;
			v.skills.science = 0;
			v.skills.mealOfTheDay = 0;
			v.skills.novelty = 0;
			v.skills.fasterCoupons = 0;
			v.regionFinishedQuests = {};
			v.regionRewardedQuests = {};
			v.charityBreakpoint = 4;
			v.charityFood = 0;
		} else {
			v.coupons = 100;				
			v.prestigeBoosters = 10;
			v.prestigePointMoneyEarned = 0;
			v.prestigePointsToGet = 0;
			v.prestigePointMoneyEarned = 0;
		}
		
		
		window.localStorage.setItem('history', '');

		v.currentNovelty =  {
						meat: 100,
						vegan: 100,
						seafood: 100,
						fastfood: 100,
						dessert: 100,
						cheap: 100,
						premium: 100,
						drink: 100
					};
		v.nextNovelty =  {
						meat: 100,
						vegan: 100,
						seafood: 100,
						fastfood: 100,
						dessert: 100,
						cheap: 100,
						premium: 100,
						drink: 100
					};

		DefineNewVariables();
		PrestigeRestaurant();
		
		let welcomeBackHTML = '<b style="color: #f68c0b;">SEASON 2 HAS ARRIVED!</b><br>';
		welcomeBackHTML += 'So in order to continue, we need to get back to where we left.<br><br>';
		welcomeBackHTML += 'You have earned <b style="color: #f68c0b;">' + AbbreviateNumber(ppWas) + '</b> Prestige Points in Season 1.<br><br>';
		welcomeBackHTML += 'Now you start the Season 2 with <b style="color: #f68c0b;">' +v.prestigePointsTotal+ '</b> Prestige Points.<br><br>';
		if (ppWas > 10000) {
			welcomeBackHTML += 'The rest of your Prestige Points will be converted into a permanent <b style="color: #f68c0b;">'+((CalcSeason1Bonus(ppWas)-1)*100).toFixed(2)+'%</b> bonus to all income. Most skills were refunded.<br><br>';	
		} else {
			welcomeBackHTML += 'You also get a permanent <b style="color: #f68c0b;">'+((CalcSeason1Bonus(ppWas)-1)*100).toFixed(2)+'%</b> bonus to all income.<br><br>';	
		}	
		welcomeBackHTML += 'There is a lot of new stuff in the game now. Make sure to check out new skills on <b style="color: #f68c0b;">Prestige tab</b>.'
		$("#return_popup").html(welcomeBackHTML).dialog({
			modal: true,
			buttons: {
				Ok: function() {
					$('#prestige_button').trigger('click');
					$( this ).dialog( "close" );					
				}
			}
		});	
		
		$('#prestige_button').trigger('click');
		LoadGame(false);
		$('#prestige_button').trigger('click');
	
	}
	function CalcSeason1Bonus(pp) {
		if (pp == 0) {
			pp = 1;
		}
		let num1 = (Math.log(pp) / Math.log(10)).toFixed(2);
		if (num1 > 10) {num1 = 10;}
		let num2 = (Math.log(pp) / Math.log(1000)).toFixed(2);
		if (num2 > 10) {num2 = 10;}
		let num3 = (Math.log(pp) / Math.log(100000)).toFixed(2);
		if (num3 > 10) {num3 = 10;}

		return (1 + +((+num1 + +num2 + +num3) /100)).toFixed(4);
	}
	
	function SetJQReferences() {
		$moneyCurrent = $('#money .current');	
		$moneyIncome = $('#money .income');
		$moneyDeliveries = $('#money #deliveries');
		$moneyCoupons = $('#money .coupons');		
		$moneyGems = $('#money .gems');
		$cookTime = $('#cook_time');	
		$superCookTime = $('#supercook_time');		
		$cookCouponsTime = $('#cook_coupons_time');
		$superCookCouponsTime = $('#supercook_coupons_time');
		$descriptionBox = $('#description_box');
		$progressbarPrestigeCover = $('#progressbar_prestige_cover');
		$progressbarPrestigeCover2 = $('#progressbar_prestige_cover2');
		$progressbarPrestige2 = $('#progressbar_prestige2');
		$deliveryButton = $('#delivery_button');
		
		$cookButton = $('#game button.cook');	
		$cook2Button = $('#game button.cook2');	
		$cook3Button = $('#game button.cook3');	
		$cook6Button = $('#game button.cook6');		
		$superCookButton = $('#game button.supercook');
		$cookCouponsButton = $('#game button.cookCoupons');			
		$cook2CouponsButton = $('#game button.cookCoupons2');	
		$cook3CouponsButton = $('#game button.cookCoupons3');	
		$cook6CouponsButton = $('#game button.cookCoupons6');	
		$superCookCouponsButton = $('#game button.supercookCoupons');

		$goalsBigButton = $('#game button#goals_big_button');
		$goalsSmallButton = $('#game button#goals_small_button');
		$perksButton = $('#game button#perks_button');
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
	
	function GenerateRITCDCode() {
		let timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();		
		timeStampInMs = timeStampInMs + GetRandomInt(0, 1000000000);
		timeStampInMs = timeStampInMs - GetRandomInt(0, 1000000000);
		let timeStampInMsStr = parseInt(timeStampInMs).toString();
		
		let dSum = 0;
		for (let i = 0; i < timeStampInMsStr.length-1; i++) {
			dSum = +dSum + +timeStampInMsStr[i];
		}		
		while (dSum >= 100) {
			dSum = dSum - 100;
		}
		if (dSum <= 9) {
			dSum = '0' + dSum;
		}		
		
		return ReverseStr(timeStampInMsStr + dSum);
	}
	
	function GenerateRITCDCode2() {
		let timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();		
		timeStampInMs = timeStampInMs + GetRandomInt(0, 1000000000);
		timeStampInMs = timeStampInMs - GetRandomInt(0, 1000000000);
		let timeStampInMsStr = parseInt(timeStampInMs).toString();
		
		let dSum = 0;
		for (let i = 0; i < timeStampInMsStr.length-1; i++) {
			dSum = +dSum + +timeStampInMsStr[i];
		}		
		while (dSum >= 100) {
			dSum = dSum - 100;
		}
		if (dSum <= 9) {
			dSum = '0' + dSum;
		}		
		
		return 'G' + ReverseStr(timeStampInMsStr + dSum);
	}
	
	function CheckRITCDCode(codeToCheckInitial) {
		let codeToCheck = codeToCheckInitial;
		if (
			(codeToCheck === undefined) ||
			(codeToCheck == '') ||
			(codeToCheck == '0') 
			) {
				$('<div title="Error" style="text-align:center;">Wrong code format.</div>').dialog({
				modal: true,
					buttons: {
						Ok: function() {
							$( this ).dialog( "close" );
						}
					}
				});	
			return false;
		}
		
		if (			
			(codeToCheck == '000000000000000') 
			) {
				$('<div title="Error" style="text-align:center;">Code disabled.</div>').dialog({
				modal: true,
					buttons: {
						Ok: function() {
							$( this ).dialog( "close" );
						}
					}
				});	
			return false;
		}
		
		for (let codeN in paid.codes) {
			if (paid.codes[codeN] == codeToCheckInitial) {
				$('<div title="Error" style="text-align:center;">Code already redeemed.</div>').dialog({
				modal: true,
					buttons: {
						Ok: function() {
							$( this ).dialog( "close" );
						}
					}
				});	
				return false;
			}
		}
		
		let isGemsCode = false;
		if (codeToCheck[0] == 'G') {
			isGemsCode = true;
			codeToCheck = codeToCheck.substring(1, codeToCheck.length);
		}
		
		codeToCheck = codeToCheck.toString();
		codeToCheck = ReverseStr(codeToCheck);
		
		let dSum2 = codeToCheck[codeToCheck.length-2] + codeToCheck[codeToCheck.length-1];
		let timeStampInMsStr = codeToCheck.substring(0, codeToCheck.length - 2);
		
		let dSum = 0;
		for (let i = 0; i < timeStampInMsStr.length-1; i++) {
			dSum = +dSum + +timeStampInMsStr[i];
		}
		while (dSum >= 100) {
			dSum = dSum - 100;
		}
		if (dSum <= 9) {
			dSum = '0' + dSum;
		}
		
		if (dSum2 == dSum) {
			paid.codes.push(codeToCheckInitial);
			if (isGemsCode) {
				paid.gems = +paid.gems + 50;
				SaveGame();
				//UpdateShopScreen();
				VerifyTransfer('site', 'gems-site');
				$('<div title="Thank you!" style="text-align:center;">Your purchase completed:<br> <div class="tr_label">+50 Gems.</div><br> Thank you for your support!</div>').dialog({
				modal: true,
					buttons: {
						Ok: function() {
							$( this ).dialog( "close" );
						}
					}
				});	
				return [true, 'triple'];				
			} else {
				paid.triple_choice = true;
				v.skills['triple_choice'] = 'HardResetGame()';
				SaveGame();
				//UpdateShopScreen();
				VerifyTransfer('site', 'triple-site');
				$('<div title="Thank you!" style="text-align:center;">Your purchase completed:<br> <div class="tr_label">Triple Choice.</div><br> Thank you for your support!</div>').dialog({
				modal: true,
					buttons: {
						Ok: function() {
							$( this ).dialog( "close" );
						}
					}
				});	
				return [true, 'gems'];
			}						
		} else {			
			if (isGemsCode) {
				$('<div title="Error" style="text-align:center;">Wrong code.</div>').dialog({
				modal: true,
					buttons: {
						Ok: function() {
							$( this ).dialog( "close" );
						}
					}
				});	
				return [false, 'gems'];
			} else {
				$('<div title="Error" style="text-align:center;">Wrong code.</div>').dialog({
				modal: true,
					buttons: {
						Ok: function() {
							$( this ).dialog( "close" );
						}
					}
				});	
				return [false, 'triple'];
			}		
		}
	}
	
	function ReverseStr(s){
		return s.split("").reverse().join("");
	}
	
	let blockSorting = 0;	
	function SortByIncome() {
		if (v.skills.supersort >= 1) {
			$('#kitchen .fooditem').each( function() {
				if ($(this).parent().css('border-color') == 'rgb(255, 205, 83)') {
					$(this).trigger('click');
					$(this).trigger('contextmenu');
				}
			});			
			UpdateIncome();
		}	
		
		if (!debug2) {
			if (blockSorting == 0) {
				let sortedDivs = '';
				if (v.skills.mealOfTheDay >= 1) {
					sortedDivs = $('#storefront .fooditem-wrapper').css('border','').sort(function (a, b) {
						let contentA =	Number( $(a).children('.fooditem').attr('data-income') );
						let contentB =	Number( $(b).children('.fooditem').attr('data-income') );
						let placeA =	Number( $(a).children('.fooditem').attr('data-num') );
						let placeB =	Number( $(b).children('.fooditem').attr('data-num') );
						if ((placeA > 3) && (placeB > 3)) {
							return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
						} else {
							return 0;
						}
					});
				} else {
					sortedDivs = $('#storefront .fooditem-wrapper').css('border','').sort(function (a, b) {
						let contentA = Number( $(a).children('.fooditem').attr('data-income'));
						let contentB = Number( $(b).children('.fooditem').attr('data-income'));				
						return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
					});
				}
				$('#storefront .fooditems').html(sortedDivs);
			} else {
				setTimeout(function() {
					if (blockSorting == 0) {
						let sortedDivs = '';
						if (v.skills.mealOfTheDay >= 1) {
							sortedDivs = $('#storefront .fooditem-wrapper').css('border','').sort(function (a, b) {
								let contentA =	Number( $(a).children('.fooditem').attr('data-income') );
								let contentB =	Number( $(b).children('.fooditem').attr('data-income') );
								let placeA =	Number( $(a).children('.fooditem').attr('data-num') );
								let placeB =	Number( $(b).children('.fooditem').attr('data-num') );
								if ((placeA > 3) && (placeB > 3)) {
									return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
								} else {
									return 0;
								}
							});
						} else {
							sortedDivs = $('#storefront .fooditem-wrapper').css('border','').sort(function (a, b) {
								let contentA = Number( $(a).children('.fooditem').attr('data-income'));
								let contentB = Number( $(b).children('.fooditem').attr('data-income'));				
								return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
							});
						}
						$('#storefront .fooditems').html(sortedDivs);
						UpdateFoodItems();
						UpdateIncome();
						UpdateButtonsOnChange();
					}
				},700);
			}
			
			UpdateFoodItems();
			UpdateIncome();
			UpdateButtonsOnChange();
		}
		//$('#storefront .fooditems .fooditem[data-num="1"]').html($('#storefront .fooditems .fooditem[data-num="2"]').html());
	
	}
	
	let blockSortingDelivery = 0;
	
	function SortByIncomeDelivery() {
		if (v.skills.supersort >= 1) {
			$('#delivery_kitchen .fooditem').each( function() {
				if ($(this).parent().css('border-color') == 'rgb(255, 205, 83)') {
					$(this).trigger('click');
					$(this).trigger('contextmenu');
				}
			});			
		}	
		
		if (blockSortingDelivery == 0) {
			let sortedDivs = '';		
			sortedDivs = $('#delivery_storefront .fooditem-wrapper').css('border','').sort(function (a, b) {
				let contentA = Number( $(a).children('.fooditem').attr('data-income'));
				let contentB = Number( $(b).children('.fooditem').attr('data-income'));
				return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
			});
			$('#delivery_storefront .delivery_fooditems').html(sortedDivs);			
		} else {
			setTimeout(function() {
				if (blockSortingDelivery == 0) {
					let sortedDivs = '';		
					sortedDivs = $('#delivery_storefront .fooditem-wrapper').css('border','').sort(function (a, b) {
						let contentA = Number( $(a).children('.fooditem').attr('data-income'));
						let contentB = Number( $(b).children('.fooditem').attr('data-income'));
						return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
					});
					$('#delivery_storefront .delivery_fooditems').html(sortedDivs);
					UpdateDeliveryIncome();
					UpdateDeliveryItems();
					UpdateThirdCategory();
					UpdateDeliveryScreen();
				}	
			},700);
			
		}
		
		UpdateDeliveryIncome();
		UpdateDeliveryItems();
		UpdateThirdCategory();
		UpdateDeliveryScreen();
		
	}
	
	function CheckSaveToFile() {
		let lastSaveDate = window.localStorage.getItem('lastSaveToFile');
		if ( (lastSaveDate == undefined) || (lastSaveDate == null) || (isNaN(+lastSaveDate)) ) {
			lastSaveDate = 0;
		}
		if (v.skills['coupons'] >= 1) {
			if (Date.now() - lastSaveDate > 23*60*60*1000) {
				$('#daily_save').show();
				$('#daily_wait').hide();			
				$('#tofile_btn').css('background', '#ecae21');
				$('#preferences_button').css('background', '#ecae21');
			} else {
				$('#daily_save').hide();
				$('#daily_wait').show();
			}
			
		}
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
	
	let SI_SYMBOL = 			['', 'k', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'Nn', 'Dc', 'UD', 'DD', 'TD', 'QaD', 'QiD', 'SxD', 'SpD', 'NnD', 'Vg', 'UVg', 'DVg'];
	let SCIENTIFIC_NOTATION = 	['', 'e3', 'e6', 'e9', 'e12', 'e15', 'e18', 'e21', 'e24', 'e27', 'e30', 'e33', 'e36', 'e39', 'e42', 'e45', 'e48', 'e51', 'e54', 'e57', 'e60']
	function AbbreviateNumber(num){
		if (num <= 9999) return Math.round(num);
		let tier = Math.log10(num) / 3 | 0;		
		if (tier == 0) return Math.round(num);
		if (tier > 20) return Math.round(num).toPrecision(2);
		let suffix = SI_SYMBOL[tier];
		if (v.options.e_notation) {
			suffix = SCIENTIFIC_NOTATION[tier];
		}
		let scale = Math.pow(10, tier * 3);
		let scaled = num / scale;
		return scaled.toFixed(2) + suffix;
	}
	
	function AbbreviateNumber2(num){
		if (num <= 9999) return Math.round(num);
		let tier = Math.log10(num) / 3 | 0;		
		if (tier == 0) return Math.round(num);
		if (num < 10000) return Math.round(num);
		if (tier > 20) return Math.round(num).toPrecision(2);
		let suffix = SI_SYMBOL[tier];
		if (v.options.e_notation) {
			suffix = SCIENTIFIC_NOTATION[tier];
		}
		let scale = Math.pow(10, tier * 3);
		let scaled = num / scale;
		return scaled.toFixed(1) + suffix;
	}

	//💰 💹 💴 💵 💷 💶 🎰 💱 🏧 💳 💸 💲
	let SI_SYMBOL_EMOJI = ['/s&nbsp;<span class="em">💸</span>', 'k/s&nbsp;<span class="em">💴</span>', 'M/s&nbsp;<span class="em">💵</span>', 'B/s&nbsp;<span class="em">💰</span>', 'T/s&nbsp;<span class="em">💳</span>', 'Qa/s&nbsp;<span class="em">💹</span>', 'Qi/s&nbsp;<span class="em">🎰</span>', 'Sx/s&nbsp;<span class="em">💱</span>', 'Sp/s&nbsp;<span class="em">🏧</span>', 'Oc/s&nbsp;<span class="em">🏦</span>', 'Nn/s&nbsp;<span class="em">🌐</span>',
	
	'Dc/s&nbsp;<span class="inv em">💸</span>', 'UD/s&nbsp;<span class="inv em">💴</span>', 'DD/s&nbsp;<span class="inv em">💵</span>', 'TD/s&nbsp;<span class="inv em">💰</span>', 'QaD/s&nbsp;<span class="inv em">💳</span>', 'QiD/s&nbsp;<span class="inv em">💹</span>', 'SxD/s&nbsp;<span class="inv em">🎰</span>', 'SpD/s&nbsp;<span class="inv em">💱</span>', 'OcD/s&nbsp;<span class="inv em">🏧</span>', 'NnD/s&nbsp;<span class="inv em">🏦</span>', 'Vg/s&nbsp;<span class="inv em">🌐</span>'];
	
	
	let SCIENTIFIC_NOTATION_EMOJI = 	['/s&nbsp;<span class="em">💸</span>', 'e3/s&nbsp;<span class="em">💴</span>', 'e6/s&nbsp;<span class="em">💵</span>', 'e9/s&nbsp;<span class="em">💰</span>', 'e12/s&nbsp;<span class="em">💳</span>', 'e15/s&nbsp;<span class="em">💹</span>', 'e18/s&nbsp;<span class="em">🎰</span>', 'e21/s&nbsp;<span class="em">💱</span>', 'e24/s&nbsp;<span class="em">🏧</span>', 'e27/s&nbsp;<span class="em">🏦</span>', 'e30/s&nbsp;<span class="em">🌐</span>',
	
	'e33/s&nbsp;<span class="inv em">💸</span>', 'e36/s&nbsp;<span class="inv em">💴</span>', 'e39/s&nbsp;<span class="inv em">💵</span>', 'e42/s&nbsp;<span class="inv em">💰</span>', 'e45/s&nbsp;<span class="inv em">💳</span>', 'e48/s&nbsp;<span class="inv em">💹</span>', 'e51/s&nbsp;<span class="inv em">🎰</span>', 'e54/s&nbsp;<span class="inv em">💱</span>', 'e57/s&nbsp;<span class="inv em">🏧</span>', '60/s&nbsp;<span class="inv em">🏦</span>', 'e63/s&nbsp;<span class="inv em">🌐</span>'];
	function AbbreviateNumberEmoji(num){
		if (num <= 9999) return Math.round(num) + SI_SYMBOL_EMOJI[0];
		let tier = Math.log10(num) / 3 | 0;
		if (tier == 0) return Math.round(num) + SI_SYMBOL_EMOJI[0];
		if (tier > 20) return Math.round(num).toPrecision(2) + SI_SYMBOL_EMOJI[0];
		let suffix = SI_SYMBOL_EMOJI[tier];
		if (v.options.e_notation) {
			suffix = SCIENTIFIC_NOTATION[tier];
		}
		let scale = Math.pow(10, tier * 3);
		let scaled = num / scale;
		return scaled.toFixed(2) + suffix;
	}

	let SI_SYMBOL_LONG = ['', ' Thousand', ' Million', ' Billion', ' Trillion', ' Quadrillion', ' Quintillion', ' Sextillion', ' Septillion', ' Octillion', ' Nonillion', ' Decillion', ' Undecillion', ' Duodecillion', ' Tredecillion', ' Quattuordecillion', ' Quindecillion', ' Sexdecillion', ' Septendecillion', ' Octodecillion', ' Novemdecillion', ' Vigintillion', ' Unvigintillion', ' Duovigintillion'];
	
	function AbbreviateNumberLong(num){
		if (num <= 9999) return Math.round(num);
		let tier = Math.log10(num) / 3 | 0;
		if (tier == 0) return Math.round(num);
		if (tier > 20) return Math.round(num).toPrecision(2);
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

	function GetCostFromPPOld(PP){
		let resultCost = 2.5*1000*1000;
				
		if (PP > 50000) {
			return 56887769861714880000;//GetCostFromPP(50000);
		}

		for (let i = 1; i <= PP; i++) {
			if ((i > 0) && (i <= 10)) {				//0-10+++
				resultCost = resultCost * 1.1;
			} else if ((i > 10) && (i <= 30)) { 	//10-30+++
				resultCost = resultCost * 1.23;
			} else if ((i > 30) && (i <= 70)) {		//30-70+++
				resultCost = resultCost * 1.01;
			} else if ((i > 70) && (i <= 150)) { 	//70-150+++
				resultCost = resultCost * 1.05;
			} else if ((i > 150) && (i <= 310)) { 	//150-310+++
				resultCost = resultCost * 1.004;
			} else if ((i > 310) && (i <= 630)) { 	//310-630+++
				resultCost = resultCost * 1.01; 
			} else if ((i > 630) && (i <= 1270)) { 	//630-1270+++
				resultCost = resultCost * 1.0019; 
			} else if ((i > 1270) && (i <= 2000)) { //+++
				resultCost = resultCost * 1.003;
			} else if ((i > 2000) && (i <= 4000)) { //+++
				resultCost = resultCost * 1.00113;
			} else if ((i > 4000) && (i <= 8000)) { //+++	
				resultCost = resultCost * 1.0003;
			} else if ((i > 8000) && (i <= 16000)) { //+++
				resultCost = resultCost * 1.00033;
			} else if ((i > 16000) && (i <= 32000)) { //+++	
				resultCost = resultCost * 1.00039;
			}
			else {
				resultCost = resultCost * 1.0001;
			}			
		}
		return Math.floor(resultCost);
	}
	
	function TSTNEWPP(PP = 0) {
		let time11 = Date.now();
		let res1 = GetCostFromPPOld(PP);
		let time12 = Date.now();
		let time21 = Date.now();
		let res2 = GetCostFromPP(PP);
		let time22 = Date.now();
		if (res1 != res2) {
			console.log('WRONG');
			console.log(res1);
			console.log(res2);
		} else {
			console.log('GOOD');
			console.log(res1);
		}
		console.log("Time 1:" + (time12 - time11));
		console.log("Time 2:" + (time22 - time21));
		
	}
	
	function GetCostFromPP(PP){
		let resultCost = 2.5*1000*1000;
			
		// exp req growth - shown level is LAST
		let k10 = 		1.1; 
		let k30 = 		1.23;
		let k70 = 		1.01;
		let k150 = 		1.05;
		let k310 = 		1.004;
		let k630 = 		1.01;
		let k1270 = 	1.0019;
		let k2000 = 	1.003;
		let k4000 = 	1.00113;
		let k8000 = 	1.00085;
		let k16000 = 	1.0005;
		let k32000 = 	1.00012;
		let k64000 = 	1.00010; 	//32-64		
		
		// number of times
		let k10n = 		0;
		let k30n = 		0;
		let k70n = 		0;
		let k150n = 	0;
		let k310n = 	0;
		let k630n = 	0;
		let k1270n = 	0;
		let k2000n = 	0;
		let k4000n = 	0;
		let k8000n = 	0;
		let k16000n = 	0;
		let k32000n = 	0;
		let k64000n = 	0;
		
		
		if ((PP > 0) &&  (PP <= 10)) {
			k10n = PP;
		} else if (PP > 10) {
			k10n = 10;
		}
		
		if ((PP > 10) &&  (PP <= 30)) {
			k30n = PP - 10;
		} else if (PP > 30) {
			k30n = 20;
		}
		
		if ((PP > 30) &&  (PP <= 70)) {
			k70n = PP - 30;
		} else if (PP > 70) {
			k70n = 40;
		}
		
		if ((PP > 70) &&  (PP <= 150)) {
			k150n = PP - 70;
		} else if (PP > 150) {
			k150n = 80;
		}
		
		if ((PP > 150) &&  (PP <= 310)) {
			k310n = PP - 150;
		} else if (PP > 310) {
			k310n = 160;
		}
		
		if ((PP > 310) &&  (PP <= 630)) {
			k630n = PP - 310;
		} else if (PP > 630) {
			k630n = 320;
		}
		
		if ((PP > 630) &&  (PP <= 1270)) {
			k1270n = PP - 630;
		} else if (PP > 1270) {
			k1270n = 640;
		}
		
		if ((PP > 1270) &&  (PP <= 2000)) {
			k2000n = PP - 1270;
		} else if (PP > 2000) {
			k2000n = 730;
		}
		
		if ((PP > 2000) &&  (PP <= 4000)) {
			k4000n = PP - 2000;
		} else if (PP > 4000) {
			k4000n = 2000;
		}
		
		if ((PP > 4000) &&  (PP <= 8000)) {
			k8000n = PP - 4000;
		} else if (PP > 8000) {
			k8000n = 4000;
		}
		
		if ((PP > 8000) &&  (PP <= 16000)) {
			k16000n = PP - 8000;
		} else if (PP > 16000) {
			k16000n = 8000;
		}
		
		if ((PP > 16000) &&  (PP <= 32000)) {
			k32000n = PP - 16000;
		} else if (PP > 32000) {
			k32000n = 16000;
		}
		
		if ((PP > 32000) &&  (PP <= 64000)) {
			k64000n = PP - 32000;
		} else if (PP > 64000) {
			k64000n = 32000;
		}
			
		resultCost = resultCost * (Math.pow(k10, k10n));
		resultCost = resultCost * (Math.pow(k30, k30n));
		resultCost = resultCost * (Math.pow(k70, k70n));
		resultCost = resultCost * (Math.pow(k150, k150n));
		resultCost = resultCost * (Math.pow(k310, k310n));
		resultCost = resultCost * (Math.pow(k630, k630n));
		resultCost = resultCost * (Math.pow(k1270, k1270n));
		resultCost = resultCost * (Math.pow(k2000, k2000n));
		resultCost = resultCost * (Math.pow(k4000, k4000n));
		resultCost = resultCost * (Math.pow(k8000, k8000n));
		resultCost = resultCost * (Math.pow(k16000, k16000n));
		resultCost = resultCost * (Math.pow(k32000, k32000n));
		resultCost = resultCost * (Math.pow(k64000, k64000n));
		
		if (PP >= 256000) { // 1.3
			// let PP = 256000;
			let doublePPAfter256k = Math.floor(PP/256000);
			doublePPAfter256k = Math.floor(Math.log(doublePPAfter256k)/Math.log(2));
			doublePPAfter256k = doublePPAfter256k + 1; // 256k = 1, 512k = 2, 1M = 2, 1M05 = 3 ...
			resultCost = resultCost * Math.pow(1.3, doublePPAfter256k);
		}
		
		if (PP >= 256000) {
			resultCost = resultCost * 1.25;
		}
		if (PP >= 380000) {
			resultCost = resultCost * 1.25;
		}
		if (PP >= 460000) {
			resultCost = resultCost * 1.25;
		}
		if (PP >= 512000) {
			resultCost = resultCost * 1.25;
		}
		if (PP >= 625000) {
			resultCost = resultCost * 1.25;
		}
		if (PP >= 750000) {
			resultCost = resultCost * 1.25;
		}
		if (PP >= 880000) {
			resultCost = resultCost * 1.1;
		}
		
		if (PP >= 1000000) { //1M
			resultCost = resultCost * 1.1;
		}
		if (PP >= 2000000) {
			resultCost = resultCost * 1.1;
		}		
		if (PP >= 4000000) {
			resultCost = resultCost * 1.5;
		}
		if (PP >= 6000000) {
			resultCost = resultCost * 1.5;
		}
		if (PP >= 8000000) {
			resultCost = resultCost * 1.1;
		}		
		if (PP >= 16000000) {
			resultCost = resultCost * 1.5;
		}
		if (PP >= 24000000) {
			resultCost = resultCost * 1.5;
		}
		if (PP >= 32000000) {
			resultCost = resultCost * 1.1;
		}
		if (PP >= 50000000) {
			resultCost = resultCost * 1.1;
		}
		if (PP >= 64000000) {
			resultCost = resultCost * 1.1;
		}
		if (PP >= 96000000) {
			resultCost = resultCost * 1.1;
		}
		if (PP >= 128000000) {
			resultCost = resultCost * 1.2;
		}
		if (PP >= 256000000) {
			resultCost = resultCost * 1.1;
		}
		if (PP >= 512000000) {
			resultCost = resultCost * 1.1;
		}
		
		if (PP >= 1000000000) { //1B
			resultCost = resultCost * 1.1;
		}		
		if (PP >= 8000000000) {
			resultCost = resultCost * 1.1;
		}
		if (PP >= 16000000000) {
			resultCost = resultCost * 1.1;
		}		
		if (PP >= 64000000000) {
			resultCost = resultCost * 1.2;
		}
		if (PP >= 128000000000) {
			resultCost = resultCost * 1.2;
		}
		if (PP >= 256000000000) {
			resultCost = resultCost * 1.1;
		}
		if (PP >= 512000000000) {
			resultCost = resultCost * 1.1;
		}
		
		if (PP >= 1000000000000) { //1T
			resultCost = resultCost * 1.25;
		}
		if (PP >= 2000000000000) { 
			resultCost = resultCost * 1.25;
		}
		if (PP >= 4000000000000) { 
			resultCost = resultCost * 1.25;
		}
		if (PP >= 8000000000000) { 
			resultCost = resultCost * 1.25;
		}
		if (PP >= 100000000000000) { 
			resultCost = resultCost * 1.25;
		}
		if (PP >= 250000000000000) { 
			resultCost = resultCost * 1.25;
		}
		
		if (PP >= 320000000000000) { 
			resultCost = resultCost * 2.5;
		}
		
		if (PP >= 500000000000000) { 
			resultCost = resultCost * 1.25;
		}
		
		if (PP >= 1000000000000000) { //1Qa
			resultCost = resultCost * 1.25;
		}
		if (PP >= 2000000000000000) { //1Qa
			resultCost = resultCost * 1.25;
		}
			
		return Math.floor(resultCost);
	}

	function SetCharAt(str,index,chr) {
		if (index > str.length-1) return str;
		return str.substr(0,index) + chr + str.substr(index+1);
	}

	function BeautifyDataType(dataType) {
		if ((dataType != '') && (dataType != undefined)) {
			dataType = dataType[0].toUpperCase() + dataType.substring(1); // Capitalize
			dataType = dataType.replace('_', ' '); // Replace underscore
			dataType = dataType.replace('_', ' '); // Replace underscore again for fish_n_chips
			dataType = dataType.replace('_', ' ');
		}
		return dataType;
	}
		
	function BeautifyTime(secondsLeft) {
		if (secondsLeft == undefined) {
			return '-';
		}
		if (isNaN(secondsLeft)) {
			return '(Something is wrong with the number)';
		}
		if (secondsLeft == Infinity) {
			return 'Infinity';
		}
		let beautifulTime = '';
		if (secondsLeft < 60) {
			beautifulTime =  Math.round(secondsLeft) + ' sec';
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
	
	// GOALS		
	const goalsStats = {};
	goalsStats['c1'] = {};
	goalsStats['c2'] = {};
	goalsStats['c3'] = {};
	// C1
	goalsStats['c1'][0] = {}
	for (let i = 1; i <= 9; i++) {
		if (i <= 5) {
			goalsStats['c1'][i] = {
				desc: 'Get any dish up to '+GetMaxQtyFromLv(i)+' quantity',
				progress: 'max_dish_qty',
				goal: GetMaxQtyFromLv(i),
				reward: [1000 * Math.pow(10, i), 'money']
			};
		} else {
			goalsStats['c1'][i] = {
				desc: 'Get any dish up to '+GetMaxQtyFromLv(i)+' quantity',
				progress: 'max_dish_qty',
				goal: GetMaxQtyFromLv(i),
				reward: [i*3, 'coupons']
			};
		}		
	}	
	//C2
	goalsStats['c2'][0] = {}
	for (let i = 1; i <= 20; i++) {
		if (i <= 6) { // 10k, 100k, 1m, 10m, 100m, 1b
			goalsStats['c2'][i] = {
				desc: 'Have '+AbbreviateNumber(1000 * Math.pow(10, i)).replace('.00','')+' <span class="en">💲</span>',
				progress: 'money',
				goal: 1000 * Math.pow(10, i),
				reward: [1000 * Math.pow(10, i), 'money']
			};
		} else { // 1T, 1Qa, 1Qi ...
			goalsStats['c2'][i] = {
				desc: 'Have '+AbbreviateNumber(1000*1000*1000 * Math.pow(1000, i-5)).replace('.00','')+' <span class="em">💲</span>',
				progress: 'money',
				goal: 1000*1000*1000 * Math.pow(1000, i-5),
				reward: [i*3, 'coupons']
			};
		}		
	}	
	//C3
	goalsStats['c3'][0] = {}
	goalsStats['c3'][1] = {
		desc: 'Have 5 dishes in your restaurant',
		progress: 'filled_spaces',
		goal: 5, 
		reward: [1000, 'money']
	};
	goalsStats['c3'][2] = {
		desc: 'Have 3 dishes of the same category',
		progress: 'same_cat_dishes',
		goal: 3,
		reward: [2000, 'money']
	};
	goalsStats['c3'][3] = {
		desc: 'Unlock and use Supercook (2nd&nbsp;button)',
		progress: 'income',
		goal: 200,
		reward: [10000, 'money']
	};
	goalsStats['c3'][4] = {
		desc: 'Unlock and use Tier Up (3rd&nbsp;button)',
		progress: 'income',
		goal: 900,
		reward: [100000, 'money']
	};
	goalsStats['c3'][5] = {
		desc: 'Unlock Delivery and make a package',
		progress: 'income',
		goal: 7000,
		reward: [1, 'del_box']
	};
	goalsStats['c3'][6] = {
		desc: 'Fill all 3 delivery slots',
		progress: 'del_slots',
		goal: 3,
		reward: [3, 'gift_box']
	};
	goalsStats['c3'][7] = {
		desc: 'Get 10&nbsp;Prestige&nbsp;Points for the next Prestige (Rainbow bars below)',
		progress: 'pp_to_get',
		goal: 10,
		reward: [4, 'gift_box']
	};
	goalsStats['c3'][8] = {
		desc: 'Prestige your restaurant',
		progress: '',
		goal: 1,
		reward: [5, 'gift_box']
	};
	goalsStats['c3'][9] = {
		desc: 'Get 30 total Prestige Points',
		progress: 'total_pp',
		goal: 30,
		reward: [20, 'coupons']
	};
	goalsStats['c3'][10] = {
		desc: 'Get 70 total Prestige Points',
		progress: 'total_pp',
		goal: 70,
		reward: [25, 'coupons']
	};
	goalsStats['c3'][11] = {
		desc: 'Get 150 total Prestige Points',
		progress: 'total_pp',
		goal: 150,
		reward: [10, 'gems']
	};
			
	function CheckGoals() { //v.goals = {c1: 1, c2: 1, c3: 1};		
		let result = [false,false,false];
		
		if (t[v.tutorialLevel].val >= t['finished0'].val) {		
			//QTY
			$('#default .fooditem, #storefront .fooditem').each( function() {
				if (goalsStats['c1'][v.goals['c1']] !== undefined) {					
					if (+$(this).attr('data-qty') >= goalsStats['c1'][v.goals['c1']].goal) {
						result[0] = true;
					}
				}	
			});
			
			//MONEY
			if (goalsStats['c2'][v.goals['c2']] !== undefined) {
				if (v.money >= goalsStats['c2'][v.goals['c2']].goal) {
					result[1] = true;
				}
			}
			
			//MISC
			if (v.goals['c3'] == 1) { // Have 5 dishes in your restaurant
				let filledDishQty = 0;
				$('#storefront .fooditem').each( function() {
					if ($(this).attr('data-type') != '') {
						filledDishQty++;
					}
				});
				if (filledDishQty >= 5) {
					result[2] = true;
				}
			}
			if (v.goals['c3'] == 2) {
				if ( //Have 3 dishes of the same category
					(v.foodClasses['meat'] >= 3) ||
					(v.foodClasses['vegan'] >= 3) ||
					(v.foodClasses['seafood'] >= 3) ||
					(v.foodClasses['fastfood'] >= 3) ||
					(v.foodClasses['dessert'] >= 3) ||
					(v.foodClasses['cheap'] >= 3) ||
					(v.foodClasses['premium'] >= 3) ||
					(v.foodClasses['drink'] >= 3)			
					) {
					result[2] = true;
				}
			}	
			if (v.goals['c3'] == 3) { //Unlock and use Supercook (2nd button)
				if (v.moneySuperCookCount > 0) {
					result[2] = true;
				}
			}	
			if (v.goals['c3'] == 4) { //Unlock and use Tier Up (3rd button)
				if (v.activeIncomeMultiplier > 1) {
					result[2] = true;
				}
			}
			if (v.goals['c3'] == 5) { //Unlock Delivery and make a package
				if ((v.deliveries[0].time > 0) || (v.deliveries[1].time > 0) || (v.deliveries[2].time > 0)) {
					result[2] = true;
				}
			}
			if (v.goals['c3'] == 6) { //Fill all 3 delivery slots
				if ((v.deliveries[0].time > 0) && (v.deliveries[1].time > 0) && (v.deliveries[2].time > 0)) {
					result[2] = true;
				}
			}
			if (v.goals['c3'] == 7) { //Get 10 PP to get
				if (v.prestigePointsToGet >= 10) {
					result[2] = true;
				}
			}
			if (v.goals['c3'] == 8) { //Prestige your restaurant
				if (v.prestigePointsTotal >= 10) {
					result[2] = true;
				}
			}
			if (v.goals['c3'] == 9) { //Get 30 total Prestige Points
				if (v.prestigePointsTotal >= 30) {
					result[2] = true;
				}
			}
			if (v.goals['c3'] == 10) { //Get 70 total Prestige Points
				if (v.prestigePointsTotal >= 70) {
					result[2] = true;
				}
			}
			if (v.goals['c3'] == 11) { //Get 150 total Prestige Points
				if (v.prestigePointsTotal >= 150) {
					result[2] = true;
				}
			}		
		
		}	
		return result;
	}		
	
	function CheckMoneyGoal() {
		let result = false;
		if (goalsStats['c2'][v.goals['c2']] !== undefined) {
			if (v.money >= goalsStats['c2'][v.goals['c2']].goal) {
				result = true;
			}
		}	
		return result;
	}
			
	function ShowGoalsDesc() {		
		let desc = '<div id="goals_desc">';
		
		if (GetGoalDesc(0) != '') {
			desc += '<div id="goal_desc_c1">';
			desc += GetGoalDesc(0);
			desc += '</div><hr>';
		}
		if (GetGoalDesc(1) != '') {
			desc += '<div id="goal_desc_c2">';
			desc += GetGoalDesc(1);
			desc += '</div><hr>';
		}
		if (GetGoalDesc(2) != '') {
			desc += '<div id="goal_desc_c3">';
			desc += GetGoalDesc(2);
			desc += '</div>';
		}
		
		if (v.region > 10) {
			if (v.region % 2 == 1) {
				desc += '<div id="goal_outer_region">';
				desc += ShowCurrentWord();
				desc += '</div>';
			} else {
				desc += '<div id="goal_outer_region">';
				desc += ShowCurrentPuzzle();
				desc += '</div>';
			}
		}
			
		desc += '</div>';
		$descriptionBox.html(desc);		
	}		
	
	function ShowPerksDesc() {		
		let desc = '';
		
		if (isMobile()) {
			desc += '<div id="perks_desc" style="width: 600px; position: absolute;text-align: center;">';
			desc += '<div class="tr_label" style="padding-bottom: 6px;">Active Perks</div>';
		} else {
			desc += '<div class="tr_label" style="padding-bottom: 6px;">Active Perks</div>';
			desc += '<div id="perks_desc" style="text-align: center;">';
		}
		
		
		let perksArray = JSON.parse(JSON.stringify(v.perks));		
		perksArray = perksArray.sort(function (a, b) {						
						if (+GetPerkLevelFromName(a) > GetPerkLevelFromName(b)) {
							return -1;
						} else {
							return 1;
						}
					});
		if (v.perks.length > 0) {
			for (let perkIndex in perksArray) {
				let perkName = perksArray[perkIndex];
				if (defaultPerkStats[perkName] !== undefined) {
					desc += '<button class="perk" data-perk="'+perkName+'">'+defaultPerkStats[perkName].name+'</button> ';
				}	
			}		
		} else {			
			desc += '<br><br> Tier Up to get Perks.';			
		}
			
		desc += '</div>';
		$descriptionBox.html(desc);	
		
		$('#description_box button').each(
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
	
	function GetPerkLevelFromName(perkName = '') {
		return perkName.replace(/[^0-9]/g, ''); 
	}
	
	function GetGoalDesc(goalID = 0) {
		let cN = 'c'+(+goalID+1);
		let desc = '';
		let checkGoalsResult = CheckGoals();
		
		if (goalsStats[cN][v.goals[cN]] != undefined) {			
			if (checkGoalsResult[goalID]) {
				desc += '<b style="color: #86d686;">✓ </b>';
			}
			if (goalsStats[cN][v.goals[cN]].desc != undefined) {
				desc += '<b>';
				desc += goalsStats[cN][v.goals[cN]].desc;
				desc += '</b><br>';
			}
			if (goalsStats[cN][v.goals[cN]].progress != undefined) {
				desc += 'Progress: ';
				if (goalsStats[cN][v.goals[cN]].progress == 'money') {
					desc += AbbreviateNumber(v.money);
					desc += ' / ';
					desc += AbbreviateNumber(goalsStats[cN][v.goals[cN]].goal);
					desc += ' 💲';
				}
				if (goalsStats[cN][v.goals[cN]].progress == 'income') {
					desc += AbbreviateNumber(v.incomeWithDeliveries);
					desc += '/s <b>/</b> ';
					desc += AbbreviateNumber(goalsStats[cN][v.goals[cN]].goal);
					desc += '/s 💸';
				}
				if (goalsStats[cN][v.goals[cN]].progress == 'max_dish_qty') {
					let maxQty = 0;
					$('#default .fooditem, #storefront .fooditem').each( function() {
						if (+$(this).attr('data-qty') >= maxQty) {
							maxQty  = +$(this).attr('data-qty');
						}
					});
					
					desc += maxQty;
					desc += ' / ';
					desc += goalsStats[cN][v.goals[cN]].goal;
				}
				if (goalsStats[cN][v.goals[cN]].progress == 'filled_spaces') {
					let filledDishQty = 0;
					$('#storefront .fooditem').each( function() {
						if ($(this).attr('data-type') != '') {
							filledDishQty++;
						}
					});
					
					desc += filledDishQty;
					desc += ' / ';
					desc += goalsStats[cN][v.goals[cN]].goal;
				}
				if (goalsStats[cN][v.goals[cN]].progress == 'same_cat_dishes') {
					// 2/3 may still confuse people, just don't count anything
					desc += 'Like '+goalsStats[cN][v.goals[cN]].goal+' Seafood or '+goalsStats[cN][v.goals[cN]].goal+' Premium dishes';
				}
				if (goalsStats[cN][v.goals[cN]].progress == 'del_slots') {
					let delSlots = 0;
					if (v.deliveries[0].time > 0) {
						delSlots++;
					}
					if (v.deliveries[1].time > 0) {
						delSlots++;
					}
					if (v.deliveries[2].time > 0) {
						delSlots++;
					}
					
					desc += delSlots;
					desc += ' / ';
					desc += goalsStats[cN][v.goals[cN]].goal;
				}
				if (goalsStats[cN][v.goals[cN]].progress == 'total_pp') {
					desc += v.prestigePointsTotal;
					desc += ' / ';
					desc += goalsStats[cN][v.goals[cN]].goal;
				}
				if (goalsStats[cN][v.goals[cN]].progress == 'pp_to_get') {
					desc += v.prestigePointsToGet;
					desc += ' / ';
					desc += goalsStats[cN][v.goals[cN]].goal;
				}
				desc += '<br>';
			}
			if (goalsStats[cN][v.goals[cN]].reward !== undefined) {
				desc += 'Reward: ';
				if (goalsStats[cN][v.goals[cN]].reward[1] == 'money') {						
					desc += AbbreviateNumber(goalsStats[cN][v.goals[cN]].reward[0]) + ' <span class="em">💲</span>';
				}
				if (goalsStats[cN][v.goals[cN]].reward[1] == 'coupons') {						
					desc += goalsStats[cN][v.goals[cN]].reward[0] + ' <span class="em">🔖</span>';
				}
				if (goalsStats[cN][v.goals[cN]].reward[1] == 'del_box') {						
					desc += goalsStats[cN][v.goals[cN]].reward[0] + ' <span class="em">📦</span>';
				}
				if (goalsStats[cN][v.goals[cN]].reward[1] == 'gift_box') {						
					desc += goalsStats[cN][v.goals[cN]].reward[0] + ' <span class="em">🎁</span>';
				}
				if (goalsStats[cN][v.goals[cN]].reward[1] == 'skill_points') {						
					desc += goalsStats[cN][v.goals[cN]].reward[0] + ' skill points';
				}
				if (goalsStats[cN][v.goals[cN]].reward[1] == 'gems') {						
					desc += goalsStats[cN][v.goals[cN]].reward[0] + ' <span class="em">💎</span>';
				}
			}			
		}
		
		return desc;
	}
	
	function ClaimGoals() {
		let desc = '';
		let cN = 'c1';
		let numLines = 0;
		for (let i = 1; i <= 3; i++) {
			cN = 'c' + i;			
			if (v.unclaimedGoals[cN] > 0) {
				desc += '+';
				if (goalsStats[cN][v.goals[cN]].reward[1] == 'money') {						
					desc += AbbreviateNumber(goalsStats[cN][v.goals[cN]].reward[0]) + ' <span class="em">💲</span>';
					v.money = +v.money + +goalsStats[cN][v.goals[cN]].reward[0];
					v.prestigePointMoneyEarned = +v.prestigePointMoneyEarned + +goalsStats[cN][v.goals[cN]].reward[0];
				}
				if (goalsStats[cN][v.goals[cN]].reward[1] == 'coupons') {						
					desc += goalsStats[cN][v.goals[cN]].reward[0] + ' <span class="em">🔖</span>';
					v.coupons = +v.coupons + +goalsStats[cN][v.goals[cN]].reward[0];
				}
				if (goalsStats[cN][v.goals[cN]].reward[1] == 'del_box') {						
					desc += goalsStats[cN][v.goals[cN]].reward[0] + ' <span class="em">📦</span>';
					if (v.deliveryBoxes < 5) {
						v.deliveryBoxes = +v.deliveryBoxes + + goalsStats[cN][v.goals[cN]].reward[0];
					}					
				}
				if (goalsStats[cN][v.goals[cN]].reward[1] == 'gift_box') {						
					desc += goalsStats[cN][v.goals[cN]].reward[0] + ' <span class="em">🎁</span>';
					v.deliveryGiftBoxes = +v.deliveryGiftBoxes + +goalsStats[cN][v.goals[cN]].reward[0];
				}
				if (goalsStats[cN][v.goals[cN]].reward[1] == 'skill_points') {						
					desc += goalsStats[cN][v.goals[cN]].reward[0] + ' skill points';
					v.skillPointsUnspent = +v.skillPointsUnspent + +goalsStats[cN][v.goals[cN]].reward[0];
				}
				if (goalsStats[cN][v.goals[cN]].reward[1] == 'gems') {						
					desc += goalsStats[cN][v.goals[cN]].reward[0] + ' <span class="em">💎</span>';
					paid.gems = +paid.gems + +goalsStats[cN][v.goals[cN]].reward[0];
				}
				desc += '<br>';
				numLines++;
				
				v.goals[cN]++;
				$('#goal_desc_'+cN).css("color","#559655").fadeOut("slow", function () {
																		FadeInGoals();
																	});
			}			
		}
			
		let position = 0;
		if (v.skills['coupons'] >= 1) {
			position = $goalsSmallButton.offset();
		} else {
			position = $goalsBigButton.offset();
			position.left  = +position.left + 150;
		}
		position.top  = +position.top - 65 - (20 * numLines);
		
		if (desc != '') { //if has claimed goals
			ShowFirework(position, true, desc, 'nofw');
			$goalsBigButton.html('📑 Goals');
			$goalsSmallButton.html('📑');
		} else {
			if ($descriptionBox.css('background') == 'rgba(140, 150, 230, 0.2) none repeat scroll 0% 0% / auto padding-box border-box') {
				$descriptionBox.css('background', 'rgba(126,129,210,0.1)');				
			} else {
				$descriptionBox.css('background', 'rgba(140,150,230,0.2)');				
			}				
			//console.log($descriptionBox.css('background'));
		}
		v.unclaimedGoals = {c1: 0, c2: 0, c3: 0};		
	}
	
	function FadeInGoals() {
		$('#goal_desc_c1').css("color","").html(GetGoalDesc(0)).fadeIn("slow");
		$('#goal_desc_c2').css("color","").html(GetGoalDesc(1)).fadeIn("slow");
		$('#goal_desc_c3').css("color","").html(GetGoalDesc(2)).fadeIn("slow", UpdateButtonsOnChange);
	}
	
	/*
	goalsStats['c3'][1] = {
		desc: 'Have 5 dishes in your restaurant',
		progress: 'filled_spaces',
		goal: 5, 
		reward: [1000, 'money']
	};
	*/
			
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
	
	function isMobile() {		
		if (!kongversion) { //or tablet
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
		if ((!isNaN(score)) && (kongversion)) { 
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
					// TODO: reject if already bought
					window.localStorage.setItem('lastSaveToFile', 0); // give another export bonus
					CheckSaveToFile(); 
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
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function ReportBug() {
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
		let saveText = ('.'+ btoa(encodeURIComponent(JSON.stringify(impVar))) +'.');
		
		$( "#dialog-report" ).dialog({
					resizable: false,
					height: "auto",
					width: 500,
					modal: true,
					buttons: {
						"Send": function() {							
							$.post("https://restaurantidle.com/report.php",
							  {
								text: $('#bugreport_textarea').val(),
								save: saveText
							  },
							  function(data, status){
								// confirm receive?
							  });
							$('#bugreport_status').show();
							$('#bugreport_textarea').hide();
							$('#bugreport_textarea').val('');							
							let obj1 = $(this);
							setTimeout(function() {
								obj1.dialog( "close" );
								$('#bugreport_status').hide();
								$('#bugreport_textarea').show();
							},2500);
							
						},
						Cancel: function() {
						  $( this ).dialog( "close" );
						}
					}
				});
	}
	function PingDev() {
		$.post("https://restaurantidle.com/report.php",
		  {
			text: 'PING!',
			save: ''
		  },
		  function(data, status){
					
		  });
		v.options.pingedDev = true;
		ShowFirework($('#BtnPingTheDev').offset(), true, 'PING!');
		UpdateProgressScreen();	
	}	  
	
	
	//Delivery stuff
	function NewDelivery() {
		if (v.deliveryBoxes >= 1) {
			$('#delivery_storefront .delivery_fooditems .fooditem-wrapper').slice(5, $('#delivery_storefront .delivery_fooditems .fooditem-wrapper').length).remove();
			UpdateDataForDelivery();
			v.deliveryTime = $('.deliveryTimeRB:checked').eq(0).val();
			v.options.preferred_delivery = $('.deliveryTimeRB:checked').eq(0).attr('id');
			v.deliveryStatus = 'play';
			v.deliveryBoxes = +v.deliveryBoxes - 1;
			v.deliveryGiftBoxesCost = 1;
			$('#btn_cook_delivery').text('Cook (' + v.deliveryCooksLeft + ' left)');
			UpdateDeliveryScreen();
		}
	}
	
	function DiscardDelivery() {
		$('#delivery .fooditem').each(
			function() {	
				$(this).attr("data-type", '');
				$(this).attr("data-qty", 1);
				$(this).attr("data-buffs", '');
				$(this).html('');
			}	
		);
		
		if ((v.prestigePointsTotal == 0) && (v.deliveryBoxes < 5)) {
			v.deliveryBoxes = +v.deliveryBoxes + 1;
		}
		
		v.deliveryStatus = 'wait';
		
		UpdateDeliveryScreen();		
	}	
	
	function SetDelivery(deliveryIndex) {
		let sortedBonuses = SortObjectByValue(v.foodClassesDelivery);
		
		if (sortedBonuses.length < 2) {	
			sortedBonuses[0] = {k:'cheap'};
			sortedBonuses[1] = {k:'cheap'};
		}
		
		v.deliveries[deliveryIndex].income = +v.deliveryIncome;
		if (v.deliveryIncome < 450) {
			v.deliveries[deliveryIndex].incomePercent = (v.deliveryIncome / 20).toFixed(1);			
		} else {
			v.deliveries[deliveryIndex].incomePercent = (Math.pow(+v.deliveryIncome - 400, 0.4)*5).toFixed(1);
		}
		
		v.deliveries[deliveryIndex].theme1 = sortedBonuses[0].k;
		v.deliveries[deliveryIndex].theme2 = sortedBonuses[1].k;	
		
		v.deliveries[deliveryIndex].time = v.deliveryTime * 60 * 60;

		let deliveryMultiplier = 1;
		if (v.deliveryTime == 1) {
			deliveryMultiplier = 2.0;
		}
		if (v.deliveryTime == 5) {
			deliveryMultiplier = 1.7;
		}
		if (v.deliveryTime == 10) {
			deliveryMultiplier = 1.3;
		}
		if (v.deliveryTime == 25) {
			deliveryMultiplier = 1.0;
		}
		
		v.deliveries[deliveryIndex].multiplier = deliveryMultiplier;
		
		v.deliveries[deliveryIndex].incomePercentMultiplied = (v.deliveries[deliveryIndex].incomePercent * deliveryMultiplier).toFixed(1);
		
		v.deliveries[deliveryIndex].expired = false;
		
		v.deliveryCooksLeft = v.deliveryCooksMax;
		$('#delivery .fooditem').each(
			function() {	
				$(this).attr("data-type", '');
				$(this).attr("data-qty", 1);
				$(this).attr("data-buffs", '');
				$(this).html('');
			}	
		);
		
		v.deliveryStatus = 'wait';
		
		$deliveryButton.css('background','');
		
		UpdateDeliveryScreen();		
	}
		
	function UpdateDeliveryScreen() {
		if (!debug2) {		
			switch (v.deliveryStatus) {
				case 'wait':
					$('#delivery_text').show();
					$('#delivery_title').show();
					$('#delivery_gameplay').hide();
					$('#delivery_settings').show();	
					if (v.options.preferred_delivery !== undefined) {						
						$("#"+v.options.preferred_delivery).attr('checked', 'checked');
						$("#"+v.options.preferred_delivery).prop('checked', true);
						
					}
					break;
				case 'play':
					$('#delivery_text').hide();
					$('#delivery_title').hide();
					$('#delivery_gameplay').show();
					$('#delivery_discardbtns').show();
					$('#delivery_endbtns').hide();
					$('#delivery_settings').hide();	
					$('#btn_cook_delivery').text('Cook (' + v.deliveryCooksLeft + ' left)');				
					break;	
				case 'end':
					$('#delivery_text').hide();
					$('#delivery_title').hide();
					$('#delivery_gameplay').show();
					$('#delivery_discardbtns').show();
					$('#delivery_endbtns').show();
					$('#delivery_settings').hide();	
					$('#btn_cook_delivery').html('Cook ' + v.deliveryGiftBoxesCost + '<span class="em">🎁</span>');
					
					$('#delivery_endbtns button').off('mouseover').on('mouseover', function (e) {
						$descriptionBox.html('Finish the delivery and put it in the specified slot at the top of the screen.');
						descFadeout = false;
						e.stopPropagation();
					});
					$('#delivery_endbtns button').off('mouseout').on('mouseout', function (e) {
						DescStartFadeOut();
						e.stopPropagation();
					});
					
					break;
			}
				
			$('#delivery .fooditem').each(
				function() {			
					if (!($(this).parent().hasClass('ui-droppable'))) {
						$(this).prop('onclick', null).off('click');
						
						if ($(this).attr('onMouseDown') === undefined) {
							$(this).on('mousedown', function (e) {	
									if (e.which == 1) {
										$(this).addClass('being-grabbed');
									}									
								}
							);
						}
						
						$(this).off('mouseup');
						$(this).on('mouseup', function (e) {
								$('#delivery .fooditem-wrapper').each(
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
							containment: "#delivery_gameplay",
							//stack: 'div',
							drag: function(event, ui) {
								let thisDataType = $(this).attr('data-type');						
								if (thisDataType == '') {
									return false;
								} else {
									let thisClassA = defaultFoodStats[thisDataType].class_a;
									if (thisClassA == 'buff') {
										$('#delivery .fooditem-wrapper').each(
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
							},
							revert: function(event, ui) {
								$(this).removeClass('being-grabbed');
								return true;
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
							let thisClassABonus = (v.foodClassesDelivery[thisClassA] || 0); // if not a number, then 0
							let thisClassB = defaultFoodStats[thisDataType].class_b;
							let thisClassBBonus = (v.foodClassesDelivery[thisClassB] || 0); // if not a number, then 0
							let thisBaseIncome = defaultFoodStats[thisDataType].baseIncome;
							let thisScienceCategoryBonus = (v.foodClassesDelivery[v.scienceCategory] || 0); // if not a number, then 0
							let thisClassC = '';
							let thisClassCBonus = 0; // if not a number, then 0
						
							if ( (v.scienceCategory !== undefined) && (v.scienceCategory !== '') && ((thisDataType == v.scienceType1) || (thisDataType == v.scienceType2)) ) {
								thisClassC = v.scienceCategory;
								thisClassCBonus = (v.foodClassesDelivery[thisClassC] || 0); // if not a number, then 0
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

							let thisTotalIncome = thisCompoundIncome; // * v.activeIncomeMultiplier;
							thisTotalIncome = thisTotalIncome * (1 + (defaultCategoryBonuses[thisClassA] * thisClassABonus));
							thisTotalIncome = thisTotalIncome * (1 + (defaultCategoryBonuses[thisClassB] * thisClassBBonus));
							
							if ( (v.scienceCategory !== undefined) && (v.scienceCategory !== '') && ((thisDataType == v.scienceType1) || (thisDataType == v.scienceType2)) ) {
								thisTotalIncome = thisTotalIncome * (1 + (defaultCategoryBonuses[thisClassC] * thisClassCBonus));
							}

							if (v.foodClassesDelivery['drink'] > 0) {
								thisTotalIncome = thisTotalIncome * 2;
							}
							
							if (v.skills.dishOfTheDay >= 1) {						
								if ($(this).attr('data-num') == 1) {							
									thisTotalIncome = thisTotalIncome * 2;
								}
							}	

							// DESC

							let desc = '';
							if (thisLv == v.skills.maxLevel) {
								desc = '<b style="font-size: 16px;">' + thisDataTypeCapitalized + '</b> level ' + thisLv + ' (' + thisDataQty + ')<br>Max level bonus reached<br>';
							} else {
								desc = '<b style="font-size: 16px;">' + thisDataTypeCapitalized + '</b> level ' + thisLv + ' (' + thisDataQty + '/' + nextLvBreakpoint + ')<br>';
							}
							desc += '<b class="category_circle" style="color:'+colors[thisClassA]+'">●</b> ' + BeautifyDataType(thisClassA) + '<br>';
							desc += '<b class="category_circle" style="color:'+colors[thisClassB]+'">●</b> ' + BeautifyDataType(thisClassB) + '<br>';
							

							if ( (v.scienceCategory !== undefined) && (v.scienceCategory !== '') && ((thisDataType == v.scienceType1) || (thisDataType == v.scienceType2)) ) {
								desc += '<b class="category_circle" style="color:'+colors[thisClassC]+'">●</b> ' + BeautifyDataType(thisClassC) + '<br>';
							}
							desc += 'Base score: <b>' + thisBaseIncome + '</b><br>';
							desc += 'Quantity: ' + thisDataQty + '<br>';
							if (thisLv > 1) {
								desc += 'Level bonus: x' + thisLvBonusMult + '<br>';
							}
							if (thisBuffIncomeMult > 1) {
								for (let buff in thisBuffs) {
									let buffValue = defaultFoodStats[buff].baseIncome;
									let buffQty = thisBuffs[buff];
									let buffMaxLvString = '';
									if (buffQty >= (50 * v.skills.maxBuff)) {
										buffMaxLvString = ' (max)';
									}
									desc += 'Bonus from <b>' + BeautifyDataType(buff) + '</b>: +' + (buffValue * buffQty) + '%' + buffMaxLvString + '<br>';
								}
							}
							
							desc += 'Dish score: <b>' + AbbreviateNumber(thisCompoundIncome) + '</b>';
							desc += '<hr>';
							desc += 'Delivery bonuses (multipliers)<br>';
							desc += 'Bonus from <b class="category_circle" style="color:'+colors[thisClassA]+'">●</b> ' + BeautifyDataType(thisClassA) + ': +' + Math.round(thisClassABonus * (defaultCategoryBonuses[thisClassA]*100)) + '%</b><br>';
							desc += 'Bonus from <b class="category_circle" style="color:'+colors[thisClassB]+'">●</b> ' + BeautifyDataType(thisClassB) + ': +' + Math.round(thisClassBBonus * (defaultCategoryBonuses[thisClassB]*100)) + '%</b><br>';	
								
							
							if ( (v.scienceCategory !== undefined) && (v.scienceCategory !== '') && ((thisDataType == v.scienceType1) || (thisDataType == v.scienceType2)) ) {
								desc += 'Bonus from <b class="category_circle" style="color:'+colors[thisClassC]+'">●</b> ' + BeautifyDataType(thisClassC) + ': +' + Math.round(thisClassCBonus * (defaultCategoryBonuses[thisClassC]*100)) + '%</b><br>';
							}

							if (v.foodClassesDelivery['drink'] > 0) {
								desc += 'Bonus from having a <b class="category_circle" style="color:'+colors['drink']+'">●</b> Drink: x2</b><br>';
							}
							
							if (v.skills.dishOfTheDay >= 1) {						
								if ($(this).attr('data-num') == 1) {							
									desc += 'Bonus from dish of the day: x2</b><br>';
								}
							}
							
							desc += '<hr>';
							desc += 'Total score: <b>' + AbbreviateNumber(thisTotalIncome) + '</b>';												
							
							if ((!isMobile()) && ($(this).attr('data-kitchennum') > 0)) {
								desc += '<hr>Press <b>'+$(this).attr('data-kitchennum')+'</b> or <b>Right-click</b> to auto-place.<br>';
							}
							
							if (thisClassA == "buff") {
								desc = '<b style="font-size: 16px;">' + thisDataTypeCapitalized + '</b><br>';							
								desc += 'Drag and drop on any dish to improve it.<br>';
								
								desc += 'Effect: +<b>' + (thisBaseIncome * thisDataQty) + '%</b><br>';
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
			$('#delivery_kitchen .fooditem').each(function() {
				if (isMobile()) {
					$(this).on('click', function (e) {
						let kitchenTarget = $(this);
						if (kitchenTarget !== '') { //[1-5]
							let kitchenType = kitchenTarget.attr('data-type');
								
							let kitchenQty = kitchenTarget.attr('data-qty');
							if ((kitchenType != '') && (kitchenType != undefined)) {
								if (defaultFoodStats[kitchenType].class_a != 'buff') {
									let storeTarget = '';
									$('#delivery_storefront .fooditem').each( function() {
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
										storeTarget.html('<span class="qty">'+AbbreviateNumber2(newStoreQty)+'</span>');
										storeTarget.parent().removeClass('glow_fast').addClass('glow_fast');
										blockSortingDelivery++;
										setTimeout(function() {
											storeTarget.parent().removeClass('glow_fast');
											blockSortingDelivery = blockSortingDelivery - 1;
										},600);
										if (GetLvFromQty(oldStoreQty) < GetLvFromQty(newStoreQty) ) { // if gained next breakpoint level
											if (!(storeTarget.parent().css('display') == 'none')) {
												ShowFirework(storeTarget.offset(), true);
											}	
										}
										DescStartFadeOut();
										UpdateDeliveryIncome();
										if (v.skills['science'] >= 1) {
											UpdateThirdCategory();
										}
									}
								}	
							}							
						}
					});
				}
			});
			$('#delivery .fooditem-wrapper').each(
				function() {
					if (!($(this).hasClass('ui-droppable'))) {
						$(this).prop('onclick', null).off('click');
						$(this).droppable({
							accept: '#delivery .fooditem',
							drop: function(event, ui) {
								if ($(ui.draggable).parent()[0] == $(this)[0]) {
									if (isMobile()) {
										$(this).find('.fooditem').trigger('contextmenu');									
									}
								}
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
										$(this).children('.fooditem').html('<span class="qty">'+AbbreviateNumber2(+dragQty + +dropQty)+'</span>');
										$(ui.draggable).attr("data-type", '');
										$(ui.draggable).attr("data-qty", 1);
										$(ui.draggable).attr("data-buffs", '');
										$(ui.draggable).html('');
									}
									UpdateDeliveryIncome();
									UpdateButtonsDelivery();
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
											$(ui.draggable).html('<span class="qty">' + AbbreviateNumber2(restQty) + '</span>');
										}								
									}
									UpdateDeliveryIncome();
									UpdateButtonsDelivery();
									return false;
								}
								// Not swapping with empty space
								if (dropType !== '') {
									if ((defaultFoodStats[dragType].class_a != 'buff') && (defaultFoodStats[dropType].class_a == 'buff')) {
										UpdateDeliveryIncome();
										UpdateButtonsDelivery();
										return false;
									}
								}

								// Normal food
								// Merging
								if ( (dragType == dropType) && (dragType !== '') && (dropType !== '') && (!$(this).children('.fooditem').eq(0).hasClass('ui-draggable-dragging')) ) {
									if (GetLvFromQty(dropQty) < GetLvFromQty(+dragQty + +dropQty) ) { // if gained next breakpoint level
										ShowFirework($(this).offset(), true);									
									}
									$(ui.draggable).attr('data-type', '');
									$(ui.draggable).attr('data-qty', 1);
									$(ui.draggable).attr('data-buffs', '');
									$(ui.draggable).html('');
									$(this).children('.fooditem').attr('data-type', dragType);
									$(this).children('.fooditem').attr('data-qty', +dragQty + +dropQty);
									$(this).children('.fooditem').attr('data-buffs', JSON.stringify(sortObjectByKey(SumObj(dragBuffs, dropBuffs))));
									$(this).children('.fooditem').html('<span class="qty">'+AbbreviateNumber2(+dragQty + +dropQty)+'</span>');
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
								UpdateDeliveryIncome();
								UpdateButtonsDelivery();
								UpdateThirdCategory();
							},
							tolerance: 'pointer',
							hoverClass: 'highlighted'
						});
					}
				}	
			);
		}
		$('#delivery_kitchen .fooditem').each(
			function() {
				$(this).off('contextmenu').on('contextmenu', function (e) {
					//if (!isMobile()) {						
						let kitchenTarget = $(this);
						if (kitchenTarget !== '') { //[1-5]
							let kitchenType = kitchenTarget.attr('data-type');
								
							let kitchenQty = kitchenTarget.attr('data-qty');
							if ((kitchenType != '') && (kitchenType != undefined)) {
								if (defaultFoodStats[kitchenType].class_a != 'buff') {
									let storeTarget = '';
									$('#delivery_storefront .fooditem').each( function() {
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
										storeTarget.html('<span class="qty">'+AbbreviateNumber2(newStoreQty)+'</span>');
										storeTarget.parent().removeClass('glow_fast').addClass('glow_fast');
										blockSortingDelivery++;
										setTimeout(function() {
											storeTarget.parent().removeClass('glow_fast');
											blockSortingDelivery = blockSortingDelivery - 1;
										},600);
										if (GetLvFromQty(oldStoreQty) < GetLvFromQty(newStoreQty) ) { // if gained next breakpoint level
											if (!(storeTarget.parent().css('display') == 'none')) {
												ShowFirework(storeTarget.offset(), true);												
											}
										}
										DescStartFadeOut();
										UpdateDeliveryIncome();
										if (v.skills['science'] >= 1) {
											UpdateThirdCategory();
										}
									} else { // cannot merge, maybe just add
										$('#delivery_storefront .fooditem').each( function() {
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
											storeTarget.html('<span class="qty">'+AbbreviateNumber2(newStoreQty)+'</span>');
											storeTarget.parent().removeClass('glow_fast').addClass('glow_fast');
											blockSortingDelivery++;
											setTimeout(function() {
												storeTarget.parent().removeClass('glow_fast');
												blockSortingDelivery = blockSortingDelivery - 1;
											},600);	
											DescStartFadeOut();
											UpdateDeliveryIncome();
											if (v.skills['science'] >= 1) {
												UpdateThirdCategory();
											}
										}
									}
								}	
							}							
						}
						return false;
					//}
				});
			}
		);
		$('#delivery_storefront .fooditem').each( //hotkeys to swap back to kitchen
			function() {
				$(this).off('contextmenu').on('contextmenu', function (e) { // RIGHT CLICK
					if (!isMobile()) {						
						let storeTarget = $(this);
						if (storeTarget !== '') { 
							let storeType = storeTarget.attr('data-type');
							let storeQty = storeTarget.attr('data-qty');
							let storeBuffs = storeTarget.attr('data-buffs');
							
							if ((storeType != '') && (storeType != undefined)) {
								let kitchenTarget = '';
							
								$('#delivery_kitchen .fooditem').each( function() {
										if ( (($(this).attr('data-type') === '') || ($(this).attr('data-type') === undefined)) && (kitchenTarget === '')) {
											kitchenTarget = $(this);
										}
									});
									
								if (kitchenTarget !== '') { // transfer to kitchen
									kitchenTarget.attr('data-type', storeType);
									kitchenTarget.attr('data-qty', storeQty);
									kitchenTarget.attr('data-buffs', storeBuffs);
									kitchenTarget.html('<span class="qty">'+AbbreviateNumber2(storeQty)+'</span>');
									kitchenTarget.parent().removeClass('glow_fast').addClass('glow_fast');
									
									storeTarget.attr('data-type', '');
									storeTarget.attr('data-qty', 1);
									storeTarget.attr('data-buffs', '');
									storeTarget.html('');
									
									
									setTimeout(function() {
										kitchenTarget.parent().removeClass('glow_fast');
									},600);
									DescStartFadeOut();
									UpdateDeliveryIncome();
									UpdateButtonsOnChange();
									if (v.skills['science'] >= 1) {
										UpdateThirdCategory();
									}
								}
							}							
						}						
						return false;
					}
				});
			}
		);

		if (!debug2) {
		
			if (v.skills['deliveryTier'] >= 2) {
				$('#delivery_additional_text').html('<b><span style="color:#bb6f6f">Tier 2+</span> deliveries have a random set of available dishes every time.<br> Use "List of available dishes" when making a delivery to check them out.</b>');
			}
			
			$('#deliveryTime').off('input change').on('input change', function (e) {
					if ($('#deliveryTime').val() == 1) {
						$('#deliveryTimeLabel').html('Duration: <b>1</b> hour. Multiplier: <b>' + (2.04 - ($('#deliveryTime').val() * 0.04)).toFixed(2) + '</b>');
					} else {
						$('#deliveryTimeLabel').html('Duration: <b>' + $('#deliveryTime').val() +	'</b> hours. Multiplier: <b>' + (2.04 - ($('#deliveryTime').val() * 0.04)).toFixed(2) + '</b>');
					}
				}
			);		
			$('#deliveryTime').change();
			
			if (v.deliveries[0] !== undefined) {
				if (v.deliveries[0].incomePercentMultiplied > 0) {
					$('.deliveryitem-inner').eq(0).css('filter', 'hue-rotate(-'+ConvertHue(v.deliveries[0].incomePercentMultiplied)+'deg)')
					.parent().css('visibility', '')
					.find('.qty').text(Math.round(v.deliveries[0].incomePercentMultiplied));
					$('.deliveryitem').eq(0).find('.theme1').removeClass().addClass('theme1').addClass(v.deliveries[0].theme1);
					$('.deliveryitem').eq(0).find('.theme2').removeClass().addClass('theme2').addClass(v.deliveries[0].theme2);
				} else {
					$('.deliveryitem-inner').eq(0).css('filter', '').parent().css('visibility', 'hidden');
				}			
			}
			if (v.deliveries[1] !== undefined) {
				if (v.deliveries[1].incomePercentMultiplied > 0) {
					$('.deliveryitem-inner').eq(1).css('filter', 'hue-rotate(-'+ConvertHue(v.deliveries[1].incomePercentMultiplied)+'deg)')
					.parent().css('visibility', '')
					.find('.qty').text(Math.round(v.deliveries[1].incomePercentMultiplied));
					$('.deliveryitem').eq(1).find('.theme1').removeClass().addClass('theme1').addClass(v.deliveries[1].theme1);
					$('.deliveryitem').eq(1).find('.theme2').removeClass().addClass('theme2').addClass(v.deliveries[1].theme2);
				} else {
					$('.deliveryitem-inner').eq(1).css('filter', '').parent().css('visibility', 'hidden');
				}
			}
			if (v.deliveries[2] !== undefined) {
				if (v.deliveries[2].incomePercentMultiplied > 0) {
					$('.deliveryitem-inner').eq(2).css('filter', 'hue-rotate(-'+ConvertHue(v.deliveries[2].incomePercentMultiplied)+'deg)')
					.parent().css('visibility', '')
					.find('.qty').text(Math.round(v.deliveries[2].incomePercentMultiplied));
					$('.deliveryitem').eq(2).find('.theme1').removeClass().addClass('theme1').addClass(v.deliveries[2].theme1);
					$('.deliveryitem').eq(2).find('.theme2').removeClass().addClass('theme2').addClass(v.deliveries[2].theme2);
				} else {
					$('.deliveryitem-inner').eq(2).css('filter', '').parent().css('visibility', 'hidden');
				}
			}
			
			$("#deliveryPool").off('mouseover').on('mouseover', function (e) {
				let desc = '';
				desc += '<div id="deliveryPoolDesc">';
				for (let fIndex in v.deliveryFood) {
					let hlCss = '';
					$('#delivery_storefront .fooditem').each( function() {
						if ($(this).attr('data-type') == v.deliveryFood[fIndex]) {
							hlCss = ' style="border-color: rgb(255, 205, 83);" ';
						}
					});
					desc += '<div class="fooditem-wrapper" '+hlCss+'><div class="fooditem" data-buffs="" data-type="'+v.deliveryFood[fIndex]+'" data-qty="1"></div></div>';
				}
				desc += '</div>';
				let bonusLevelsPool = '';
				let sortedBonuses = SortObjectByValue(v.foodClassesDeliveryPool);
				sortedBonuses.forEach(function(item) {
					bonusLevelsPool += '<b class="category_circle" style="color:'+colors[item.k]+'">●</b> ' + BeautifyDataType(item.k) + ': ' + item.v + '<br>';
				});
				desc += '<div id="deliveryPoolDescBonuses" style="column-count: 2;">';
				desc += bonusLevelsPool;
				desc += '</div>';
				$descriptionBox.html(desc);
				UpdateThirdCategory();
				descFadeout = false;
				e.stopPropagation();
			});	
			$("#deliveryPool").off('mouseout').on('mouseout', function (e) {
				DescStartFadeOut();
				e.stopPropagation();
			});
			
			$("#btn_cook_delivery").off('mouseover').on('mouseover', function (e) {
				let desc = '';
				desc += 'Cook new dishes for delivery.<br>';			
				desc += 'Free cooks left: ' + v.deliveryCooksLeft + '<br><br>';
				if (!(isMobile())) {
					desc += 'Hotkey: Q';
				}
				$descriptionBox.html(desc);			
				descFadeout = false;
				e.stopPropagation();
			});	
			$("#btn_cook_delivery").off('mouseout').on('mouseout', function (e) {
				DescStartFadeOut();
				e.stopPropagation();
			});
			
			$("#btn_sort_delivery").off('mouseover').on('mouseover', function (e) {
				let desc = '';
				desc += 'Sort dishes in delivery.<br>';
				if (v.skills.supersort >= 1) {
					desc += '<b>Supersort: also adds all highlighted dishes where they belong.</b><br>';
				}
				if (!(isMobile())) {
					desc += 'Hotkey: D';
				}
				$descriptionBox.html(desc);			
				descFadeout = false;
				e.stopPropagation();
			});	
			$("#btn_sort_delivery").off('mouseout').on('mouseout', function (e) {
				DescStartFadeOut();
				e.stopPropagation();
			});		
			
			$("#btn_cancel_delivery").off('mouseover').on('mouseover', function (e) {
				let desc = '';
				desc += 'Cancel current delivery setup.<br> The box is not refunded.';
				
				$descriptionBox.html(desc);			
				descFadeout = false;
				e.stopPropagation();
			});	
			$("#btn_cancel_delivery").off('mouseout').on('mouseout', function (e) {
				DescStartFadeOut();
				e.stopPropagation();
			});	
			
			if (v.skills['complimentary_drink'] >= 1) {
				if ($("#img_complimentary_drink").length > 0) {
					$("#img_complimentary_drink").css('display', 'inline-block');
				} else {
					$('#delivery_storefront').html($('#delivery_storefront').html() + '<div id="img_complimentary_drink"></div>');
					$("#img_complimentary_drink").css('display', 'inline-block');
				}
			}
			
			$("#img_complimentary_drink").off('mouseover').on('mouseover', function (e) {
				let desc = '<b>Complimentary Drink</b>';	
				desc += '<br><br>This delivery has an additional free drink.';
				$descriptionBox.html(desc);			
				descFadeout = false;
				e.stopPropagation();
			});	
			$("#img_complimentary_drink").off('mouseout').on('mouseout', function (e) {
				DescStartFadeOut();
				e.stopPropagation();
			});
		}	
		UpdateDeliveryItems();
		UpdateThirdCategory();
		UpdateDeliveryIncome();
	}
	
	function ConvertHue(hue = 0) {
		while (hue > 360) {
			hue = (hue - 360)/10;
		}
		return hue;
	}
	
	function CookDelivery() {
		if ( (v.options.blockOnHL) && (CheckForBlockingHLFoodDelivery()) ) {
			return false;
		}
		if ((v.deliveryCooksLeft <= 0) && (v.deliveryGiftBoxes < v.deliveryGiftBoxesCost)) {
			return false;
		}
		if (v.skills['charity'] >= 1) {
			AddToCharity('delivery');
		}
		if ((v.skills['biggerDeliveries'] >= 1) && (v.deliveryCooksLeft == v.deliveryCooksMax - 9)) {
			AddDeliverySlots(1);
		}
		if ((v.skills['biggestDeliveries'] >= 1) && (v.deliveryCooksLeft == v.deliveryCooksMax - 19)) {
			AddDeliverySlots(1);
		}
		$('#delivery_kitchen .fooditem').each(
			function() {
				if (!debug2) {
					let $tempItem = $(this);
					let rnd = GetRandomInt(v.skills.minCook, v.skills.maxCook);
					$tempItem.fadeTo(200,0.01);
					$tempItem.addClass('small');
					setTimeout(function(){
						$tempItem.fadeTo(200,1);
						$tempItem.removeClass('small');
						let rndFoodType = GetRandomDeliveryFoodType();
						$tempItem.attr('data-type',rndFoodType);
						$tempItem.attr('data-buffs','');
						$tempItem.text('');
						$tempItem.attr('data-qty',rnd);						
						if (rnd > 1) {
							$tempItem.html('<span class="qty">'+AbbreviateNumber2(rnd)+'</span>');
						}
						UpdateDeliveryIncome();
						UpdateThirdCategory();
					}, 190);
				} else {
					let $tempItem = $(this);
					let rnd = GetRandomInt(v.skills.minCook,v.skills.maxCook);	
					
					let rndFoodType = GetRandomDeliveryFoodType();
					$tempItem.attr('data-type',rndFoodType);
					$tempItem.attr('data-buffs','');
					$tempItem.text('');
					$tempItem.attr('data-qty',rnd);						
					if (rnd > 1) {
						$tempItem.html('<span class="qty">'+AbbreviateNumber2(rnd)+'</span>');
					}
					UpdateDeliveryIncome();
					UpdateThirdCategory();				
				}	
			}
		);
		
		if (v.deliveryCooksLeft >= 1) { // Cooking for limited chances
			v.deliveryCooksLeft = v.deliveryCooksLeft - 1;
			$('#btn_cook_delivery').text('Cook (' + v.deliveryCooksLeft + ' left)');
			if (v.deliveryCooksLeft == 0) { // Cooked last one for free
				$('#btn_cook_delivery').html('Cook ' + v.deliveryGiftBoxesCost + '<span class="em">🎁</span>');				
				v.deliveryStatus = 'end';
				UpdateDeliveryScreen();
			}
		} else { // Cooking for gift boxes
			v.deliveryGiftBoxes = v.deliveryGiftBoxes - v.deliveryGiftBoxesCost;
			v.deliveryGiftBoxesCost = v.deliveryGiftBoxesCost *2;
			$('#btn_cook_delivery').html('Cook ' + v.deliveryGiftBoxesCost + '<span class="em">🎁</span>');			
			v.deliveryStatus = 'end';	
			UpdateDeliveryScreen();
		}	
		UpdateThirdCategory();
	}
	
	function GetRandomDeliveryFoodType() {
		let rnd = GetRandomInt(0,v.deliveryFood.length - 1);		
		return v.deliveryFood[rnd];
	}
	
	function UpdateDeliveryItems() {
		if (!debug2) {
			$('.deliveryitem').each(
				function() {
					let deliveryNum = $(this).attr('data-deliverynum');
					if (v.deliveries[deliveryNum-1] !== undefined) {
						$(this).off('mouseover').on('mouseover', function (e) {
							let desc = '';
							desc += '<b>Delivery ' + deliveryNum + '</b><br>';
							desc += 'Main themes: ' + BeautifyDataType(v.deliveries[deliveryNum-1].theme1) +	', ' + BeautifyDataType(v.deliveries[deliveryNum-1].theme2) + ' (doesn\'t affect anything outside that delivery)<br>';
							desc += '<br>';						
							desc += 'Score: ' + v.deliveries[deliveryNum-1].income + '<br>';
							desc += 'Base Income: +' + (+v.deliveries[deliveryNum-1].incomePercent).toFixed(1) + '%<br>';						
							desc += 'Multiplier: ' + (+v.deliveries[deliveryNum-1].multiplier).toFixed(1) + '<br>';	
							desc += 'Total Income: +' + (+v.deliveries[deliveryNum-1].incomePercentMultiplied).toFixed(1) + '%<br>';
							if (v.deliveries[deliveryNum-1].expired) {
								desc += 'Time left: <span id="current_delivery_time_desc">Infinity</span><br>';
							} else {
								desc += 'Time left: <span id="current_delivery_time_desc">' + BeautifyTime(v.deliveries[deliveryNum-1].time) + '</span><br>';
							}						
							$descriptionBox.html(desc);
							currentdeliveryDesc = deliveryNum;
							descFadeout = false;
							e.stopPropagation();
						});	
						$(this).off('mouseout').on('mouseout', function (e) {
							DescStartFadeOut();
							currentdeliveryDesc = '';
							e.stopPropagation();
						});
					}				
				}
			);
		}	
	}
	
	function UpdateDataForDelivery() {
		v.deliveryFood = [];
		v.foodClassesDeliveryPool = {};
		v.deliveryGiftBoxesCost = 1;
		
		if ( (v.skills['deliveryTier'] === undefined) || (v.skills['deliveryTier'] <= 1) ) {
			for (let prop in defaultFoodStats) {
				if ((defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].class_a != 'buff')) {
					if ( (defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].baseIncome == 1) ) {				
						v.deliveryFood.push(prop);
					}				
				}
			}
		}	
		
		if (v.skills['deliveryTier'] == 2) {
			for (let prop in defaultFoodStats) {
				if ((defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].class_a != 'buff')) {
					if ( (defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].baseIncome == 2) ) {				
						v.deliveryFood.push(prop);
					}				
				}
			}
		}	
		
		if ( (v.skills['deliveryTier'] == 3) && (!(v.skills['tier4delivery'] == 1)) ) {
			for (let prop in defaultFoodStats) {
				if ((defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].class_a != 'buff')) {
					if ( (defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].baseIncome == 4) ) {				
						v.deliveryFood.push(prop);
					}				
				}
			}
		}	

		if (v.skills['tier4delivery'] == 1) {
			for (let prop in defaultFoodStats) {
				if ((defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].class_a != 'buff')) {
					if ( (defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].baseIncome == 8) ) {				
						v.deliveryFood.push(prop);
					}				
				}
			}
		}			
		
		while (v.deliveryFood.length > 13) {
			RemoveRandomDeliveryFood();
		}
		
		if (v.deliveryFood.length == 13) {
			UpdateDeliveryIncome();
			if (!(v.foodClassesDeliveryPool['dessert'] > 0)) {
				AddDessertToDeliveryPool();
			} else {
				AddDishToDeliveryPool();
			}	
			if (!(v.foodClassesDeliveryPool['drink'] > 0)) {
				AddDrinkToDeliveryPool();
			} else {
				AddDishToDeliveryPool();
			}	
		}
			
		v.foodClassesDelivery = {};
		v.deliveryCooksLeft = v.deliveryCooksMax;
	}
	
	function AddDessertToDeliveryPool() {
		let availableDesserts = [];
		let deliveryTierCost = 1;
		
		if (v.skills['deliveryTier'] == 2) {
			deliveryTierCost = 2;
		}	
		
		if (v.skills['deliveryTier'] == 3) {
			deliveryTierCost = 4;
		}			
		
		if (v.skills['tier4delivery'] == 1) {
			deliveryTierCost = 8;
		}
		
		for (let prop in defaultFoodStats) {
			if ((defaultFoodStats.hasOwnProperty(prop)) && ( (defaultFoodStats[prop].class_a == 'dessert') || (defaultFoodStats[prop].class_b == 'dessert') )) {
				if ( (defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].baseIncome == deliveryTierCost) ) {	
					if (!(v.deliveryFood.includes(prop))) {						
						availableDesserts.push(prop);
					}
				}				
			}
		}
		
		let randomDessert = GetRandomSubarray(availableDesserts, 1);
		v.deliveryFood.push(randomDessert[0]);
	}
	
	function AddDrinkToDeliveryPool() {
		let availableDrinks = [];
		let deliveryTierCost = 1;
		
		if (v.skills['deliveryTier'] == 2) {
			deliveryTierCost = 2;
		}	
		
		if (v.skills['deliveryTier'] == 3) {
			deliveryTierCost = 4;
		}			
		
		if (v.skills['tier4delivery'] == 1) {
			deliveryTierCost = 8;
		}
		
		for (let prop in defaultFoodStats) {
			if ((defaultFoodStats.hasOwnProperty(prop)) && ( (defaultFoodStats[prop].class_a == 'drink') || (defaultFoodStats[prop].class_b == 'drink') )) {
				if ( (defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].baseIncome == deliveryTierCost) ) {	
					if (!(v.deliveryFood.includes(prop))) {						
						availableDrinks.push(prop);
					}
				}				
			}
		}
		
		let randomDrink = GetRandomSubarray(availableDrinks, 1);
		v.deliveryFood.push(randomDrink[0]);
	}
	
	function AddDishToDeliveryPool() { // Random
		let availableDishes = [];
		let deliveryTierCost = 1;
		
		if (v.skills['deliveryTier'] == 2) {
			deliveryTierCost = 2;
		}	
		
		if (v.skills['deliveryTier'] == 3) {
			deliveryTierCost = 4;
		}			
		
		if (v.skills['tier4delivery'] == 1) {
			deliveryTierCost = 8;
		}
		
		for (let prop in defaultFoodStats) {
			if ((defaultFoodStats.hasOwnProperty(prop)) && ( (defaultFoodStats[prop].class_a != 'buff'))) {
				if ( (defaultFoodStats.hasOwnProperty(prop)) && (defaultFoodStats[prop].baseIncome == deliveryTierCost) ) {	
					if (!(v.deliveryFood.includes(prop))) {						
						availableDishes.push(prop);
					}
				}				
			}
		}
		
		let randomDish = GetRandomSubarray(availableDishes, 1);
		v.deliveryFood.push(randomDish[0]);
	}
		
	function RemoveRandomDeliveryFood() {
		RemoveFromArray(v.deliveryFood, GetRandomDeliveryFoodType());
	}
	
	function CountClassesDelivery(item) {
		if (defaultFoodStats[item] === undefined) {
			console.log("undefined delivery: " +item);
		}
		if (v.foodClassesDelivery[defaultFoodStats[item].class_a] > 0) {
			v.foodClassesDelivery[defaultFoodStats[item].class_a]++;
		} else {
			v.foodClassesDelivery[defaultFoodStats[item].class_a] = 1;
		}

		if (v.foodClassesDelivery[defaultFoodStats[item].class_b] > 0) {
			v.foodClassesDelivery[defaultFoodStats[item].class_b]++;
		} else {
			v.foodClassesDelivery[defaultFoodStats[item].class_b] = 1;
		}
		
		if (((item == v.scienceType1) || (item == v.scienceType2)) && (v.scienceCategory != '')) {
			if (v.foodClassesDelivery[v.scienceCategory] > 0) {
				v.foodClassesDelivery[v.scienceCategory]++;
			} else {
				v.foodClassesDelivery[v.scienceCategory] = 1;
			}
		}
	}
	
	function CountClassesDeliveryPool(item) {
		if (defaultFoodStats[item] === undefined) {
			console.log("undefined delivery: " +item);
		}
		if (v.foodClassesDeliveryPool[defaultFoodStats[item].class_a] > 0) {
			v.foodClassesDeliveryPool[defaultFoodStats[item].class_a]++;
		} else {
			v.foodClassesDeliveryPool[defaultFoodStats[item].class_a] = 1;
		}

		if (v.foodClassesDeliveryPool[defaultFoodStats[item].class_b] > 0) {
			v.foodClassesDeliveryPool[defaultFoodStats[item].class_b]++;
		} else {
			v.foodClassesDeliveryPool[defaultFoodStats[item].class_b] = 1;
		}
		
		if (((item == v.scienceType1) || (item == v.scienceType2)) && (v.scienceCategory != '')) {
			if (v.foodClassesDeliveryPool[v.scienceCategory] > 0) {
				v.foodClassesDeliveryPool[v.scienceCategory]++;
			} else {
				v.foodClassesDeliveryPool[v.scienceCategory] = 1;
			}
		}
	}
	
	function UpdateButtonsDelivery() {
		
	}
	
	function UpdateDeliveryIncome() {	
		v.deliveryIncome = 0;
		const foodTypesDelivery = {};
		v.foodClassesDelivery = {};
		v.hasDuplicatesDelivery = false;		
		
		$('#delivery_storefront .fooditem').each(
			function() {
				if ($(this).attr('data-type') !== '') {
					if (foodTypesDelivery[$(this).attr('data-type')] != 'exists') {
						foodTypesDelivery[$(this).attr('data-type')] = 'exists';
					} else {
						v.hasDuplicatesDelivery = true;
					}
				}
			}
		);
		Object.keys(foodTypesDelivery).forEach(function(key) {
			CountClassesDelivery(key);
		});
		if (v.skills['complimentary_drink'] >= 1) {
			if (v.foodClassesDelivery['drink'] > 0) {
				v.foodClassesDelivery['drink']++;
			} else {
				v.foodClassesDelivery['drink'] = 1;
			}
		}
		
		v.foodClassesDeliveryPool = {};
		for (let DFindex in v.deliveryFood) {
			CountClassesDeliveryPool(v.deliveryFood[DFindex]);
		}		

		let bonusLevels = '';
		let sortedBonuses = SortObjectByValue(v.foodClassesDelivery);
		sortedBonuses.forEach(function(item) {
			bonusLevels += '<b class="category_circle" style="color:'+colors[item.k]+'">●</b> ' + BeautifyDataType(item.k) + ': ' + item.v + '<br>';
		});
		
		if (!debug2) {
			if (bonusLevels == '') {
				$('#category_bonuses').fadeOut(500);
			} else {
				if (v.hasDuplicatesDelivery) {
					bonusLevels += '<span style="font-size: 10px;vertical-align: top;">⚠️</span>  <b style="color:#f00;">Duplicate</b><br>';
				}			
				$('#category_bonuses').html('<span class="nomobile">Themes:</span><br class="nomobile">' + bonusLevels);
				$('#category_bonuses').fadeIn(500);
			}
		}
		
		let orderNum = 1;
		$('#delivery_storefront .fooditem').each( // setting the numbers of elements for Dish of the Day
			function() {
				$(this).attr('data-num', orderNum);
				orderNum++;
			}
		);	
		
		let kitchenNum = 1;
		$('#delivery_kitchen .fooditem').each( // setting the numbers of elements for Dish of the Day
			function() {
				$(this).attr('data-kitchennum', kitchenNum);
				kitchenNum++;
				if (true) {
					let kitchenType = $(this).attr('data-type');
					if ((kitchenType != '') && (kitchenType != undefined)) {
						if ((foodTypesDelivery[$(this).attr('data-type')] === 'exists') || (defaultFoodStats[$(this).attr('data-type')].class_a === 'buff' ) ) {
							$(this).parent().css('border-color', '#ffcd53');
						} else {
							$(this).parent().css('border-color', '');
						}
					} else {
						$(this).parent().css('border-color', '');
					}
					
				}
			}
		);	
		
		$('#delivery_storefront .fooditem').each(
			function() {				
				if ($(this).attr('data-type') !== '') {
					let thisDataType = $(this).attr('data-type');
					
					let thisDataTypeCapitalized = BeautifyDataType(thisDataType);
					let thisDataQty = $(this).attr('data-qty');
					let thisLv = GetLvFromQty(thisDataQty);
					let nextLvBreakpoint = GetMaxQtyFromLv(thisLv);						

					let thisLvBonusMult = 2**(thisLv -1);
					let thisClassA = defaultFoodStats[thisDataType].class_a;
					let thisClassABonus = (v.foodClassesDelivery[thisClassA] || 0); // if not a number, then 0
					let thisClassB = defaultFoodStats[thisDataType].class_b;
					let thisClassBBonus = (v.foodClassesDelivery[thisClassB] || 0); // if not a number, then 0
					let thisBaseIncome = defaultFoodStats[thisDataType].baseIncome;
					let thisScienceCategoryBonus = (v.foodClassesDelivery[v.scienceCategory] || 0); // if not a number, then 0
					let thisClassC = '';
					let thisClassCBonus = 0; // if not a number, then 0
				
					if ( (v.scienceCategory !== undefined) && (v.scienceCategory !== '') && ((thisDataType == v.scienceType1) || (thisDataType == v.scienceType2)) ) {
						thisClassC = v.scienceCategory;
						thisClassCBonus = (v.foodClassesDelivery[thisClassC] || 0); // if not a number, then 0
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

					let thisTotalIncome = thisCompoundIncome;
					thisTotalIncome = thisTotalIncome * (1 + (defaultCategoryBonuses[thisClassA] * thisClassABonus));
					thisTotalIncome = thisTotalIncome * (1 + (defaultCategoryBonuses[thisClassB] * thisClassBBonus));
					
					if ( (v.scienceCategory !== undefined) && (v.scienceCategory !== '') && ((thisDataType == v.scienceType1) || (thisDataType == v.scienceType2)) ) {
						thisTotalIncome = thisTotalIncome * (1 + (defaultCategoryBonuses[thisClassC] * thisClassCBonus));
					}

					if (v.foodClassesDelivery['drink'] > 0) {
						thisTotalIncome = thisTotalIncome * 2;
					}
					
					if (v.skills.dishOfTheDay >= 1) {						
						if ($(this).attr('data-num') == 1) {
							$(this).parent().css('border','3px solid #ffd000');								
							thisTotalIncome = thisTotalIncome * 2;
						}
					}
					v.deliveryIncome += Math.round(thisTotalIncome);
					$(this).attr('data-income', Math.round(thisTotalIncome));
				} else {
					$(this).attr('data-income', 0);
					if (v.skills.dishOfTheDay >= 1) {						
						if ($(this).attr('data-num') == 1) {
							$(this).parent().css('border','3px solid #ffd000');	
						}
					}
				}
			}
		);
		v.deliveryIncome = Math.round(v.deliveryIncome);
		let tempIncomePercent = 0;
		if (v.deliveryIncome < 450) {
			tempIncomePercent = (v.deliveryIncome / 20).toFixed(1);			
		} else {
			tempIncomePercent = (Math.pow(+v.deliveryIncome - 400, 0.4)*5).toFixed(1);
		}
		
		let deliveryMultiplier = 1;
		if (v.deliveryTime == 1) {
			deliveryMultiplier = 2.0;
		}
		if (v.deliveryTime == 5) {
			deliveryMultiplier = 1.7;
		}
		if (v.deliveryTime == 10) {
			deliveryMultiplier = 1.3;
		}
		if (v.deliveryTime == 25) {
			deliveryMultiplier = 1.0;
		}
			
		tempIncomePercent = (tempIncomePercent * deliveryMultiplier).toFixed(1);
		
		$('#delivery_current').text(AbbreviateNumber(v.deliveryIncome) + ' (will give +' +tempIncomePercent+ '% income)');
		SaveGame();
	}
	
	function AddToCharity(targetKitchen = 'normal') {
		if (targetKitchen == 'normal') {
			$('#kitchen .fooditem').each(
				function() {
					if ($(this).attr('data-type') != '') {
						let thisDataQty = $(this).attr('data-qty');
						v.charityFood = +v.charityFood + +thisDataQty;
					}	
				}
			);	
		}
		if (targetKitchen == 'delivery') {
			$('#delivery_kitchen .fooditem').each(
				function() {	
					if ($(this).attr('data-type') != '') {
						let thisDataQty = $(this).attr('data-qty');
						v.charityFood = +v.charityFood + +thisDataQty;
					}	
				}
			);
		}
		
		if (v.skills['charity'] >= 1) {
			if (v.charityFood >= GetMaxQtyFromLv(v.charityBreakpoint)) {
				$('#info_button').css('background', '#ecae21');
				$('#info_tab_button_charity').css('background', '#ecae21');
			} else {
				$('#info_button').css('background', '');
				$('#info_tab_button_charity').css('background', '');
			}
		}
	}
	
	function CheckRegionQuests() {		
		if ((v.region >= 1) && (v.region <= 10) && (!debug2) ) {			
			for (let i = 1; i <= v.region; i++) {				
				for (let regionChallenge in regionsStats[i].challenges) {
					window[regionsStats[i].challenges[regionChallenge]]();			
				}
			}	
		}
	}
	
	function CheckRegionEffect() {
		let url = new URL(window.location.href);
		if ((v.region == 2) && (url.searchParams.get("c") != 'nofilter')) {
			$('#main-wrapper').addClass('spooky');  
		} else {
			$('#main-wrapper').removeClass('spooky');
		}
		
		if (v.region == 3) {
			defaultCategoryBonuses['seafood'] = 0;
			v.categoryBonuses['seafood'] = 0;
		} else {
			defaultCategoryBonuses['seafood'] = 0.2;
		}
		
		if (v.region == 4) {
			defaultCategoryBonuses['drink'] = 0;
			v.categoryBonuses['drink'] = 0;
		} else {
			defaultCategoryBonuses['drink'] = 0.15;
		}
		
		if (v.region == 5) {
			defaultCategoryBonuses['fastfood'] = 0;
			v.categoryBonuses['fastfood'] = 0;
			defaultCategoryBonuses['dessert'] = 0;
			v.categoryBonuses['dessert'] = 0;
		} else {
			defaultCategoryBonuses['fastfood'] = 0.2;
			defaultCategoryBonuses['dessert'] = 0.2;
		}
		
		if ((v.region == 6) && (url.searchParams.get("c") != 'nofilter')) {
			$('#main-wrapper').addClass('frozen');
			//have to have 3 dishes
		} else {
			$('#main-wrapper').removeClass('frozen');
		}
		
		if (v.region == 7) {
			defaultCategoryBonuses['vegan'] = 0;
			v.categoryBonuses['vegan'] = 0;
			defaultCategoryBonuses['meat'] = 0;
			v.categoryBonuses['meat'] = 0;
		} else {
			defaultCategoryBonuses['vegan'] = 0.2;
			defaultCategoryBonuses['meat'] = 0.2;
		}
		
		if (v.region == 8) {			
			//tier 2 boost
			defaultCategoryBonuses['premium'] = 0;
			v.categoryBonuses['premium'] = 0;
			defaultCategoryBonuses['cheap'] = 0;
			v.categoryBonuses['cheap'] = 0;
		} else {
			defaultCategoryBonuses['premium'] = 0.2;
			defaultCategoryBonuses['cheap'] = 0.15;
		}
		
		if ((v.region == 9) && (url.searchParams.get("c") != 'nofilter')) {
			$('#main-wrapper').addClass('sweet');
			//no motd main
			//have to have 10 desserts
		} else {
			$('#main-wrapper').removeClass('sweet');
		}		
		
		if (v.region == 10) {
			//tier 1 boost
		} else {
			
		}
		
		UpdateIncome();
		UpdateFoodItems();
	}	
	
	function GoToFirstRegion() {
		if ((v.prestigePointsTotal + v.prestigePointsToGet >= 64000) && (v.region == 0)) {
			v.region = 1;
		}
		PrestigeRestaurant();
		UpdateProgressScreen();
	}
	
	function GoToNextRegion() {
		if ((v.region >= 1) && (v.prestigePointsTotal > PROGRESS[+CHAPTERQTY+v.region-1].prestigePoints)) {			
			v.region++;
			CheckRegionEffect();
			
			if (v.region == 4) {
				v.categoryBonuses['seafood'] = (Math.round(defaultCategoryBonuses['seafood'] * (100 + v.currentNovelty['seafood']))/100);
			}
			if (v.region == 5) {				
				v.categoryBonuses['drink'] = (Math.round(defaultCategoryBonuses['drink'] * (100 + v.currentNovelty['drink']))/100);
			}
			if (v.region == 6) {		
				v.categoryBonuses['fastfood'] = (Math.round(defaultCategoryBonuses['fastfood'] * (100 + v.currentNovelty['fastfood']))/100);
				v.categoryBonuses['dessert'] = (Math.round(defaultCategoryBonuses['dessert'] * (100 + v.currentNovelty['dessert']))/100);
			}	
			if (v.region == 8) {
				v.categoryBonuses['vegan'] = (Math.round(defaultCategoryBonuses['vegan'] * (100 + v.currentNovelty['vegan']))/100);
				v.categoryBonuses['meat'] = (Math.round(defaultCategoryBonuses['meat'] * (100 + v.currentNovelty['meat']))/100);
			}
			if (v.region == 9) {
				v.categoryBonuses['premium'] = (Math.round(defaultCategoryBonuses['premium'] * (100 + v.currentNovelty['premium']))/100);
				v.categoryBonuses['cheap'] = (Math.round(defaultCategoryBonuses['cheap'] * (100 + v.currentNovelty['cheap']))/100);
			}
			UpdateProgressScreen();			
			UpdateIncome(); // maybe new region will make some changes to that			
		}		
	}
	
	function CheckAssorti(targetCat) {
		let allFromTargetCat = true;
		
		$('#default .fooditem, #storefront .fooditem').each( function() {
			if ($(this).attr('data-type') != '') {
				if (
					(defaultFoodStats[$(this).attr('data-type')].class_a == targetCat) ||
					(defaultFoodStats[$(this).attr('data-type')].class_b == targetCat) ||
					((v.scienceCategory == targetCat) && (v.scienceType1 == $(this).attr('data-type'))) ||
					((v.scienceCategory == targetCat) && (v.scienceType2 == $(this).attr('data-type')))
					)	{
					// good one
				} else {
					allFromTargetCat = false;
				}		
			}	
		});
		
		if (
			(allFromTargetCat) &&
			(v.foodClasses['cheap'] >= 1) &&
			(v.foodClasses['dessert'] >= 1) &&
			(v.foodClasses['drink'] >= 1) &&
			(v.foodClasses['fastfood'] >= 1) &&
			(v.foodClasses['meat'] >= 1) &&
			(v.foodClasses['premium'] >= 1) &&
			(v.foodClasses['seafood'] >= 1) &&
			(v.foodClasses['vegan'] >= 1)			
			) {
			return true;
		} else {
			return false;
		}
	}
	
	function CheckFoodType(foodTypeToCheck) {
		let foodTypesL = {};
		$('#default .fooditem, #storefront .fooditem').each( function() {
			if ($(this).attr('data-type') != '') {
				foodTypesL[$(this).attr('data-type')] = 'exists';
			}
		});
		if (foodTypesL[foodTypeToCheck] == 'exists') {
			return true;
		} else {
			return false;
		}
	}
	
	let PAPER_PLASTIC = [		
			'cupcake',
			'french_fries',
			'local_soda',
			'popcorn',
			'vegan_cupcake',			
			'milkshake',
			'onion_rings',
			'shrimps_n_chips',			
			'fish_sticks',
			'noodles',
			'sausage_and_potatoes',
			'takeaway_coffee',
			'veggie_wrap',
		];
	function CheckFoodTypePaperPlastic() {
		let foodTypesL = [];		
		
		$('#default .fooditem, #storefront .fooditem').each( function() {
			if ($(this).attr('data-type') != '') {		
				if (PAPER_PLASTIC.includes($(this).attr('data-type'))) {						
					foodTypesL[$(this).attr('data-type')] = $(this).attr('data-type');
				}				
			}
		});
		
		let numFoods = Object.keys(foodTypesL).length;
		
		if (numFoods < 13) {
			let notIncludedFoodName = '';
			for (let foodIndex in PAPER_PLASTIC) {
				if (!(Object.keys(foodTypesL).includes(PAPER_PLASTIC[foodIndex]))) {						
					notIncludedFoodName = PAPER_PLASTIC[foodIndex];
				}
			}			
			notIncludedFoodName = BeautifyDataType(notIncludedFoodName);			
			
			return [false, numFoods, Hintify(notIncludedFoodName)];				
		} else {
			return [true];
		}
	}	
		
	let GLASS = [		
			'yoghurt',
			'beer',
			'lime_cocktail',
			'mojito',
			'wine',
			'juice',
			'martini',
			'sparkling_water',
			'blueberry_yoghurt',
			'cherry_milkshake',
			'fruit_salad',
			'lemonade',
			'orange_juice',
			'pureed_veggie_soup',
			'tropical_cocktail',
		];
	function CheckFoodTypeGlass() {
		let foodTypesL = [];		
		
		$('#default .fooditem, #storefront .fooditem').each( function() {
			if ($(this).attr('data-type') != '') {		
				if (GLASS.includes($(this).attr('data-type'))) {						
					foodTypesL[$(this).attr('data-type')] = $(this).attr('data-type');
				}				
			}
		});
		
		let numFoods = Object.keys(foodTypesL).length;
		
		if (numFoods < 15) {
			let notIncludedFoodName = '';
			for (let foodIndex in GLASS) {
				if (!(Object.keys(foodTypesL).includes(GLASS[foodIndex]))) {						
					notIncludedFoodName = GLASS[foodIndex];
				}
			}			
			notIncludedFoodName = BeautifyDataType(notIncludedFoodName);			
			
			return [false, numFoods, Hintify(notIncludedFoodName)];			
		} else {
			return [true];
		}
	}
	
	function Hintify(inString) {
		let outString = '';
		for (let i = 0; i < inString.length; i++) {
			if ((i == 0) || (i == inString.length - 1) || (inString[i] == ' ')) {
				outString += inString[i];
			} else {
				outString += '.';
			}
		}
		return outString;
	}
	
	function CheckMOTD(foodType1, foodType2, foodType3) {
		let res1 = false;
		let res2 = false;
		let res3 = false;
		$('#storefront .fooditem').each( function() {
			if (($(this).attr('data-num') == 1) && ($(this).attr('data-type') == foodType1)) {		
				res1 = true;
			}
			if (($(this).attr('data-num') == 2) && ($(this).attr('data-type') == foodType2)) {		
				res2 = true;
			}
			if (($(this).attr('data-num') == 3) && ($(this).attr('data-type') == foodType3)) {		
				res3 = true;
			}
		});
		return [res1, res2, res3];
	}
	
	function R1_19_Drink() {
		let result = [];
		
		result[0] = false;
		
		if ((v.foodClasses['drink'] >= 19) || (v.regionFinishedQuests['R1_19_Drink'])) {
			result[0] = true;
			result[1] = '<b style="color: #86d686;">✓</b> Have 19 <b class="category_circle" style="color:#00e7ff">●</b> Drinks in your restaurant menu.<br><br>';
			if (!v.regionRewardedQuests['R1_19_Drink']) {
				result[1] += '<button class="reward" onClick="CollectReward(\'R1_19_Drink\')">Collect '+ShowReward('R1_19_Drink')+'</button><br><br>';
			}
			v.regionFinishedQuests['R1_19_Drink'] = 1;
			return result;
		}
		result[1] = '<b style="color: #FF0000;">❌</b> Have 19 <b class="category_circle" style="color:#00e7ff">●</b> Drinks in your restaurant menu.<br>';
		result[1] += +v.foodClasses['drink']|0;
		result[1] += '/19<br><br>';
		
		return result;
	}
	function R1_21_Fastfood() {
		let result = [];
		let currentQuest = 'R1_21_Fastfood';
		
		result[0] = false;
		
		if ((v.foodClasses['fastfood'] >= 21) || (v.regionFinishedQuests['R1_21_Fastfood'])) {
			result[0] = true;
			result[1] = '<b style="color: #86d686;">✓</b> Have 21 <b class="category_circle" style="color:#ffd000">●</b> Fastfood dishes in your restaurant menu.<br><br>';
			if (!v.regionRewardedQuests['R1_21_Fastfood']) {
				result[1] += '<b>New skill - Bigger Deliveries.</b><br> Now your deliveries gain an additional slot after the first 10 cooks.<br><br>'
				result[1] += '<button class="reward" onClick="CollectReward(\'R1_21_Fastfood\')">Collect '+ShowReward('R1_21_Fastfood')+'</button><br><br>';
			}
			v.regionFinishedQuests['R1_21_Fastfood'] = 1;
			return result;
		}
		result[1] = '<b style="color: #FF0000;">❌</b> Have 21 <b class="category_circle" style="color:#ffd000">●</b> Fastfood dishes in your restaurant menu.<br>';
		result[1] += +v.foodClasses['fastfood']|0;
		result[1] += '/21<br><br>';
		
		return result;
	}
	function R1_23_Dessert() {
		let result = [];
		
		result[0] = false;
		
		if ((v.foodClasses['dessert'] >= 23) || (v.regionFinishedQuests['R1_23_Dessert'])) {
			result[0] = true;
			result[1] = '<b style="color: #86d686;">✓</b> Have 23 <b class="category_circle" style="color:#e7b2e0">●</b> Dessert dishes in your restaurant menu.<br><br>';
			if (!v.regionRewardedQuests['R1_23_Dessert']) {
				result[1] += '<button class="reward" onClick="CollectReward(\'R1_23_Dessert\')">Collect '+ShowReward('R1_23_Dessert')+'</button><br><br>';
			}
			v.regionFinishedQuests['R1_23_Dessert'] = 1;
			return result;
		}
		result[1] = '<b style="color: #FF0000;">❌</b> Have 23 <b class="category_circle" style="color:#e7b2e0">●</b> Dessert dishes in your restaurant menu.<br>';
		result[1] += +v.foodClasses['dessert']|0;
		result[1] += '/23<br><br>';
		
		result[1] += '(You can switch Sextuple Cook to Normal Cook to have a lower price.)<br><br>';
		return result;
	}	
	
	//shrimp_tartlet, banana_sandwich, coffee 
	function R2_MOTD() {
		let result = [];
		let img1 = '';
		let img2 = '';
		let img3 = '';
		let foodType1 = 'shrimp_tartlet';
		let foodType2 = 'banana_sandwich';
		let foodType3 = 'coffee';		
		
		let checkResult = CheckMOTD(foodType1, foodType2, foodType3);
		
		if (checkResult[0] || (v.regionFinishedQuests['R2_MOTD'])) {
			img1 = '<img style="width: 80px; heighth: auto; margin: 0 20px;" src="img/food/'+foodType1+'.png" >';
		} else {
			img1 = '<img style="width: 80px; heighth: auto; margin: 0 20px; filter: contrast(0.0);" src="img/food/'+foodType1+'.png" >';
		}
		if (checkResult[1] || (v.regionFinishedQuests['R2_MOTD'])) {
			img2 = '<img style="width: 80px; heighth: auto; margin: 0 20px;" src="img/food/'+foodType2+'.png" >';
		} else {
			img2 = '<img style="width: 80px; heighth: auto; margin: 0 20px; filter: contrast(0.0);" src="img/food/'+foodType2+'.png" >';
		}
		if (checkResult[2] || (v.regionFinishedQuests['R2_MOTD'])) {
			img3 = '<img style="width: 80px; heighth: auto; margin: 0 20px;" src="img/food/'+foodType3+'.png" >';
		} else {
			img3 = '<img style="width: 80px; heighth: auto; margin: 0 20px; filter: contrast(0.0);" src="img/food/'+foodType3+'.png" >';
		}
		
		result[0] = false;
		
		if ((checkResult[0] && checkResult[1] && checkResult[2]) || (v.regionFinishedQuests['R2_MOTD'])) {
			result[0] = true;
			result[1] = '<b style="color: #86d686;">✓</b> Have these dishes in your Meal of the Day.<br><br>'+img1+img2+img3+'<br><br>';
			if (!v.regionRewardedQuests['R2_MOTD']) {
				result[1] += '<button class="reward" onClick="CollectReward(\'R2_MOTD\')">Collect '+ShowReward('R2_MOTD')+'</button><br><br>';
			}
			v.regionFinishedQuests['R2_MOTD'] = 1;			
			return result;
		}
		result[1] = '<b style="color: #FF0000;">❌</b> Have these dishes in your Meal of the Day.<br><br>'+img1+img2+img3+'<br><br>';		
		
		return result;
	}
	
	function R2_17_Dishes() {
		let result = [];
		let nCrab = 0;
		
		result[0] = false;
		
		$('#default .fooditem, #storefront .fooditem').each( function() {
			if ($(this).attr('data-type') == 'crab') {		
				nCrab++;				
			}
		});
		
		if ((nCrab >= 17) || (v.regionFinishedQuests['R2_17_Dishes'])) {
			result[0] = true;
			result[1] = '<b style="color: #86d686;">✓</b> Duplicates: Crab Hunt.<br>Have 17 slots with Crab in your restaurant.<br><br>';
			if (!v.regionRewardedQuests['R2_17_Dishes']) {
				result[1] += '<button class="reward" onClick="CollectReward(\'R2_17_Dishes\')">Collect '+ShowReward('R2_17_Dishes')+'</button><br><br>';
			}
			v.regionFinishedQuests['R2_17_Dishes'] = 1;
			return result;
		}
		result[1] = '<b style="color: #FF0000;">❌</b> Duplicates: Crab Hunt.<br>Have 17 slots with Crab in your restaurant.<br>';
		result[1] += nCrab;
		result[1] += '/17<br><br>';
		
		return result;
	}
	function R2_10_Spiced() {
		let result = [];
		
		result[0] = false;
		
		let flavorsCount = 0;
		$('#storefront .fooditem').each( function() {			
			if ($(this).attr('data-buffs') != '') {
				let thisBuffs = JSON.parse($(this).attr('data-buffs'));
				if (thisBuffs['exotic_flavors'] >= 1) {
					flavorsCount++;
				}
			}
		});
		
		if ((flavorsCount >= 10) || (v.regionFinishedQuests['R2_10_Spiced'])) {
			result[0] = true;
			result[1] = '<b style="color: #86d686;">✓</b> Have 10 dishes with Exotic Flavors in your restaurant menu.<br><br>';
			if (!v.regionRewardedQuests['R2_10_Spiced']) {
				result[1] += '<button class="reward" onClick="CollectReward(\'R2_10_Spiced\')">Collect '+ShowReward('R2_10_Spiced')+'</button><br><br>';
			}
			v.regionFinishedQuests['R2_10_Spiced'] = 1;
			return result;
		}
		result[1] = '<b style="color: #FF0000;">❌</b> Have 10 dishes with Exotic Flavors in your restaurant menu.<br>';
		result[1] += flavorsCount;
		result[1] += '/10<br><br>';
		
		return result;
	}
		
	function R3_CheckWord_Restaurant() {
		return CheckWord('restaurant', 'R3_CheckWord_Restaurant');
	}
	function R3_CheckWord_Idle() {
		return CheckWord('idle', 'R3_CheckWord_Idle');
	}	
	
	function R4_8_1_Alphabetical_Categories() {
		let result = [];
		
		result[0] = false;
		
		if ((
			(v.foodClasses['cheap'] == 8) &&
			(v.foodClasses['dessert'] == 7) &&
			(v.foodClasses['drink'] == 6) &&
			(v.foodClasses['fastfood'] == 5) &&
			(v.foodClasses['meat'] == 4) &&
			(v.foodClasses['premium'] == 3) &&
			(v.foodClasses['seafood'] == 2) &&
			(v.foodClasses['vegan'] == 1)			
			) || (v.regionFinishedQuests['R4_8_1_Alphabetical_Categories'])) {
			result[0] = true;
			result[1] = '<b style="color: #86d686;">✓</b> Make your restaurant\'s food themes go in alphabetical order and from 8 to 1.';
			if (!v.regionRewardedQuests['R4_8_1_Alphabetical_Categories']) {
				result[1] += '<button class="reward" onClick="CollectReward(\'R4_8_1_Alphabetical_Categories\')">Collect '+ShowReward('R4_8_1_Alphabetical_Categories')+'</button><br><br>';
			}
			v.regionFinishedQuests['R4_8_1_Alphabetical_Categories'] = 1;			
			return result;
		}
		
		result[1] = '';
		result[1] += '<b style="color: #FF0000;">❌</b> Make your restaurant\'s food themes go in alphabetical order and from 8 to 1.<br> Like this:<br>'+
'<div style="text-align: left; padding: 7px 7px 7px 10px; border: 1px solid #a05555; border-radius: 10px; width: 100px; margin-left: 40%;margin-top: 5px;">'+
'<span>Themes:</span>'+
'<br><b class="category_circle" style="color:#dadada">●</b> Cheap: 8'+
'<br><b class="category_circle" style="color:#e7b2e0">●</b> Dessert: 7'+
'<br><b class="category_circle" style="color:#00e7ff">●</b> Drink: 6'+
'<br><b class="category_circle" style="color:#ffd000">●</b> Fastfood: 5'+
'<br><b class="category_circle" style="color:#f00">●</b> Meat: 4'+
'<br><b class="category_circle" style="color:#a8ee96">●</b> Premium: 3'+
'<br><b class="category_circle" style="color:#5050ff">●</b> Seafood: 2'+
'<br><b class="category_circle" style="color:#5ab55a">●</b> Vegan: 1'+
'</div>';
		
		return result;
	}
	
	function R5_Riddle_Glass() {
		let result = [];
		let nGlass = CheckFoodTypeGlass()[1];
		
		result[0] = false;
		
		if ((CheckFoodTypeGlass()[0]) || (v.regionFinishedQuests['R5_Riddle_Glass'])) {		
			result[0] = true;
			result[1] = '<b style="color: #86d686;">✓</b> Find 15 dishes in glass containers and put them into your restaurant.<br><br>';
			if (!v.regionRewardedQuests['R5_Riddle_Glass']) {
				result[1] += '<button class="reward" onClick="CollectReward(\'R5_Riddle_Glass\')">Collect '+ShowReward('R5_Riddle_Glass')+'</button><br><br>';
			}
			v.regionFinishedQuests['R5_Riddle_Glass'] = 1;
			return result;
		}
		result[1] = '<b style="color: #FF0000;">❌</b> Find 15 dishes in glass containers and put them into your restaurant.<br>';
		result[1] += nGlass;
		result[1] += '/15<br>';
		result[1] += 'Hint for one of them: ' + CheckFoodTypeGlass()[2] + '<br><br>';
		
		return result;
	}
	function R5_Assorti_Fastfood() {
		let result = [];
		
		result[0] = false;		
		
		if ((CheckAssorti('fastfood')) || (v.regionFinishedQuests['R5_Assorti_Fastfood'])) {
			result[0] = true;
			result[1] = '<b style="color: #86d686;">✓</b> All kinds of Fastfood: have all categories in your restaurant. <br>All dishes have to be <b class="category_circle" style="color:#ffd000">●</b> Fastfood.<br><br>';
			if (!v.regionRewardedQuests['R5_Assorti_Fastfood']) {
				result[1] += '<button class="reward" onClick="CollectReward(\'R5_Assorti_Fastfood\')">Collect '+ShowReward('R5_Assorti_Fastfood')+'</button><br><br>';
			}
			v.regionFinishedQuests['R5_Assorti_Fastfood'] = 1;			
			return result;
		}
		result[1] = '<b style="color: #FF0000;">❌</b> All kinds of Fastfood: have all categories in your restaurant. <br>All dishes have to be <b class="category_circle" style="color:#ffd000">●</b> Fastfood.<br><br>';
		
		return result;
	}
	
	function R6_Assorti_Dessert() {
		let result = [];
		
		result[0] = false;		
		
		if ((CheckAssorti('dessert')) || (v.regionFinishedQuests['R6_Assorti_Dessert'])) {
			result[0] = true;
			result[1] = '<b style="color: #86d686;">✓</b> All kinds of Desserts: have all categories in your restaurant. <br>All dishes have to be <b class="category_circle" style="color:#e7b2e0">●</b> Desserts.<br><br>';
			if (!v.regionRewardedQuests['R6_Assorti_Dessert']) {
				result[1] += '<button class="reward" onClick="CollectReward(\'R6_Assorti_Dessert\')">Collect '+ShowReward('R6_Assorti_Dessert')+'</button><br><br>';
			}
			v.regionFinishedQuests['R6_Assorti_Dessert'] = 1;
			return result;
		}
		result[1] = '<b style="color: #FF0000;">❌</b> All kinds of Desserts: have all categories in your restaurant. <br>All dishes have to be <b class="category_circle" style="color:#e7b2e0">●</b> Desserts.<br><br>';
		
		return result;
	}
	function R6_Left_Choice() {
		let result = [];
		
		result[0] = false;
		
		if (((v.onlyLeft === true) && (v.prestigePointsToGet >= 10000000)) || (v.regionFinishedQuests['R6_Left_Choice'])) {
			result[0] = true;
			result[1] = '<b style="color: #86d686;">✓</b> Get 10M Prestige Points while only selecting the left Perk choices in all Tier Ups.<br><br>';
			if (!v.regionRewardedQuests['R6_Left_Choice']) {
				result[1] += '<button class="reward" onClick="CollectReward(\'R6_Left_Choice\')">Collect '+ShowReward('R6_Left_Choice')+'</button><br><br>';
			}
			v.regionFinishedQuests['R6_Left_Choice'] = 1;
			return result;
		}
		result[1] = '<b style="color: #FF0000;">❌</b> Get 10M Prestige Points while only selecting the left Perk choices in all Tier Ups.<br><br>';	
		if (v.onlyLeft === true) {
			result[1] += 'Status: active<br><br>';
		} else {
			result[1] += 'Status: inactive (needs prestige to start)<br><br>';
		}
		
		return result;
	}
	
	function R7_Riddle_Cardboard_Plastic() {
		let result = [];
		let nCbp = CheckFoodTypePaperPlastic()[1];
		
		result[0] = false;
		
		if ((CheckFoodTypePaperPlastic()[0]) || (v.regionFinishedQuests['R7_Riddle_Cardboard_Plastic'])) {		
			result[0] = true;
			result[1] = '<b style="color: #86d686;">✓</b> Find 13 dishes that have paper or plastic in their packaging and put them into your restaurant.<br><br>';
			if (!v.regionRewardedQuests['R7_Riddle_Cardboard_Plastic']) {
				result[1] += '<button class="reward" onClick="CollectReward(\'R7_Riddle_Cardboard_Plastic\')">Collect '+ShowReward('R7_Riddle_Cardboard_Plastic')+'</button><br><br>';
			}
			v.regionFinishedQuests['R7_Riddle_Cardboard_Plastic'] = 1;
			return result;
		}
		result[1] = '<b style="color: #FF0000;">❌</b> Find 13 dishes that have paper or plastic in their packaging and put them into your restaurant.<br>';
		result[1] += nCbp;
		result[1] += '/13<br>';
		result[1] += 'Hint for one of them: ' + CheckFoodTypePaperPlastic()[2] + '<br><br>';
		
		return result;
	}
	function R7_MOTD() {
		let result = [];
		let img1 = '';
		let img2 = '';
		let img3 = '';
		let foodType1 = 'mixed_nuts';
		let foodType2 = 'coconut_sweet_soup';
		let foodType3 = 'martini';		
		
		let checkResult = CheckMOTD(foodType1, foodType2, foodType3);
		
		if (checkResult[0] || (v.regionFinishedQuests['R7_MOTD'])) {
			img1 = '<img style="width: 80px; heighth: auto; margin: 0 20px;" src="img/food/'+foodType1+'.png" >';
		} else {
			img1 = '<img style="width: 80px; heighth: auto; margin: 0 20px; filter: contrast(0.0);" src="img/food/'+foodType1+'.png" >';
		}
		if (checkResult[1] || (v.regionFinishedQuests['R7_MOTD'])) {
			img2 = '<img style="width: 80px; heighth: auto; margin: 0 20px;" src="img/food/'+foodType2+'.png" >';
		} else {
			img2 = '<img style="width: 80px; heighth: auto; margin: 0 20px; filter: contrast(0.0);" src="img/food/'+foodType2+'.png" >';
		}
		if (checkResult[2] || (v.regionFinishedQuests['R7_MOTD'])) {
			img3 = '<img style="width: 80px; heighth: auto; margin: 0 20px;" src="img/food/'+foodType3+'.png" >';
		} else {
			img3 = '<img style="width: 80px; heighth: auto; margin: 0 20px; filter: contrast(0.0);" src="img/food/'+foodType3+'.png" >';
		}
		
		result[0] = false;
		
		if ((checkResult[0] && checkResult[1] && checkResult[2]) || (v.regionFinishedQuests['R7_MOTD'])) {
			result[0] = true;
			result[1] = '<b style="color: #86d686;">✓</b> Have these dishes in your Meal of the Day.<br><br>'+img1+img2+img3+'<br><br>';
			if (!v.regionRewardedQuests['R7_MOTD']) {
				result[1] += '<button class="reward" onClick="CollectReward(\'R7_MOTD\')">Collect '+ShowReward('R7_MOTD')+'</button><br><br>';
			}
			v.regionFinishedQuests['R7_MOTD'] = 1;			
			return result;
		}
		result[1] = '<b style="color: #FF0000;">❌</b> Have these dishes in your Meal of the Day.<br><br>'+img1+img2+img3+'<br><br>';		
		
		return result;
	}
	
	function R8_No_Restaurant() {
		let result = [];
		
		result[0] = false;
		
		if (((v.noRestaurant === true) && (v.prestigePointsToGet >= 1000)) || (v.regionFinishedQuests['R8_No_Restaurant']))  {
			result[0] = true;
			result[1] = '<b style="color: #86d686;">✓</b> Get 1000 Prestige Points while only having dishes in your 2-slot starter restaurant. No other dish slots allowed even for a second.<br><br>';
			if (!v.regionRewardedQuests['R8_No_Restaurant']) {
				result[1] += '<button class="reward" onClick="CollectReward(\'R8_No_Restaurant\')">Collect '+ShowReward('R8_No_Restaurant')+'</button><br><br>';
			}
			v.regionFinishedQuests['R8_No_Restaurant'] = 1;
			return result;
		}
		result[1] = '<b style="color: #FF0000;">❌</b> Get 1000 Prestige Points while only having dishes in your 2-slot starter restaurant. No other dish slots allowed even for a second.<br><br>';	
		if (v.noRestaurant === true) {
			result[1] += 'Status: active<br><br>';
		} else {
			result[1] += 'Status: inactive (needs prestige to start)<br><br>';
		}
		return result;
	}
	function R8_MOTD() {
		let result = [];
		let img1 = '';
		let img2 = '';
		let img3 = '';
		let foodType1 = 'salmon_soup';
		let foodType2 = 'cookies';
		let foodType3 = 'takeaway_coffee';		
		
		let checkResult = CheckMOTD(foodType1, foodType2, foodType3);
		
		if (checkResult[0] || (v.regionFinishedQuests['R8_MOTD'])) {
			img1 = '<img style="width: 80px; heighth: auto; margin: 0 20px;" src="img/food/'+foodType1+'.png" >';
		} else {
			img1 = '<img style="width: 80px; heighth: auto; margin: 0 20px; filter: contrast(0.0);" src="img/food/'+foodType1+'.png" >';
		}
		if (checkResult[1] || (v.regionFinishedQuests['R8_MOTD'])) {
			img2 = '<img style="width: 80px; heighth: auto; margin: 0 20px;" src="img/food/'+foodType2+'.png" >';
		} else {
			img2 = '<img style="width: 80px; heighth: auto; margin: 0 20px; filter: contrast(0.0);" src="img/food/'+foodType2+'.png" >';
		}
		if (checkResult[2] || (v.regionFinishedQuests['R8_MOTD'])) {
			img3 = '<img style="width: 80px; heighth: auto; margin: 0 20px;" src="img/food/'+foodType3+'.png" >';
		} else {
			img3 = '<img style="width: 80px; heighth: auto; margin: 0 20px; filter: contrast(0.0);" src="img/food/'+foodType3+'.png" >';
		}
		
		result[0] = false;
		
		if ((checkResult[0] && checkResult[1] && checkResult[2]) || (v.regionFinishedQuests['R8_MOTD'])) {
			result[0] = true;
			result[1] = '<b style="color: #86d686;">✓</b> Have these dishes in your Meal of the Day.<br><br>'+img1+img2+img3+'<br><br>';
			if (!v.regionRewardedQuests['R8_MOTD']) {
				result[1] += '<button class="reward" onClick="CollectReward(\'R8_MOTD\')">Collect '+ShowReward('R8_MOTD')+'</button><br><br>';
			}
			v.regionFinishedQuests['R8_MOTD'] = 1;			
			return result;
		}
		result[1] = '<b style="color: #FF0000;">❌</b> Have these dishes in your Meal of the Day.<br><br>'+img1+img2+img3+'<br><br>';		
		
		return result;
	}
	
	function R9_No_Coupons() {
		let result = [];
		
		result[0] = false;
		
		if (((v.noCoupons === true) && (v.prestigePointsToGet >= 10000000)) || (v.regionFinishedQuests['R9_No_Coupons'])) {
			result[0] = true;
			result[1] = '<b style="color: #86d686;">✓</b> Get 10M Prestige Points while not using any Cook for Coupons.<br><br>';
			if (!v.regionRewardedQuests['R9_No_Coupons']) {
				result[1] += '<button class="reward" onClick="CollectReward(\'R9_No_Coupons\')">Collect '+ShowReward('R9_No_Coupons')+'</button><br><br>';
			}
			v.regionFinishedQuests['R9_No_Coupons'] = 1;
			return result;
		}
		result[1] = '<b style="color: #FF0000;">❌</b> Get 10M Prestige Points while not using any Cook for Coupons.<br><br>';	
		if (v.noCoupons === true) {
			result[1] += 'Status: active<br><br>';
		} else {
			result[1] += 'Status: inactive (needs prestige to start)<br><br>';
		}		
		
		return result;
	}	
	function R9_Assorti_Drink() {
		let result = [];
		
		result[0] = false;		
		
		if ((CheckAssorti('drink')) || (v.regionFinishedQuests['R9_Assorti_Drink'])) {
			result[0] = true;
			result[1] = '<b style="color: #86d686;">✓</b> All kinds of Drinks: have all categories in your restaurant. <br>All dishes have to be <b class="category_circle" style="color:#00e7ff">●</b> Drinks.<br><br>';
			if (!v.regionRewardedQuests['R9_Assorti_Drink']) {
				result[1] += '<button class="reward" onClick="CollectReward(\'R9_Assorti_Drink\')">Collect '+ShowReward('R9_Assorti_Drink')+'</button><br><br>';
			}
			v.regionFinishedQuests['R9_Assorti_Drink'] = 1;
			return result;
		}
		result[1] = '<b style="color: #FF0000;">❌</b> All kinds of Drinks: have all categories in your restaurant. <br>All dishes have to be <b class="category_circle" style="color:#00e7ff">●</b> Drinks.<br><br>';
		
		return result;
	}
	
	function R10_No_Tierup() {
		let result = [];
		
		result[0] = false;
		
		if (((v.activeIncomeMultiplier == 1) && (v.prestigePointsToGet >= 10000000)) || (v.regionFinishedQuests['R10_No_Tierup'])) {
			result[0] = true;
			result[1] = '<b style="color: #86d686;">✓</b> Get 10M Prestige Points while not using Tier Up.<br><br>';
			if (!v.regionRewardedQuests['R10_No_Tierup']) {
				result[1] += '<button class="reward" onClick="CollectReward(\'R10_No_Tierup\')">Collect '+ShowReward('R10_No_Tierup')+'</button><br><br>';
			}
			v.regionFinishedQuests['R10_No_Tierup'] = 1;
			return result;
		}
		result[1] = '<b style="color: #FF0000;">❌</b> Get 10M Prestige Points while not using Tier Up.<br><br>';
		
		if (v.activeIncomeMultiplier == 1) {
			result[1] += 'Status: active<br><br>';
		} else {
			result[1] += 'Status: inactive (needs prestige to start)<br><br>';
		}		
		
		return result;
	}
	
	
	function Set200Novelty(targetNovelty) {
		v.currentNovelty[targetNovelty] = 200;
		v.nextNovelty[targetNovelty] = 200;
		v.categoryBonuses[targetNovelty] = (Math.round(defaultCategoryBonuses[targetNovelty] * (100 + v.currentNovelty[targetNovelty]))/100);
	}
	
	function Set200NoveltyAll() {
		for (let targetNovelty in v.currentNovelty) {
			v.currentNovelty[targetNovelty] = 200;
			v.nextNovelty[targetNovelty] = 200;
			v.categoryBonuses[targetNovelty] = (Math.round(defaultCategoryBonuses[targetNovelty] * (100 + v.currentNovelty[targetNovelty]))/100);
		}		
	}
	
	function R5_NoQuest() {
		let result = [false, ''];
		return result;
	}

	function CheckWord(word, questName) {
		if (word !== undefined) {
			let result = [];
			
			let goodLetters = [];
			let goodLettersCount = 0;
			for (let i=0; i < word.length; i++) {
				let tempItem = $('#storefront .fooditem').eq(i);
				let tempLetter = '';
				if (tempItem.attr('data-type') != undefined ) {
					tempLetter = tempItem.attr('data-type')[0];
				}
				if (tempLetter === undefined) {
					tempLetter = '_';
				}
				if ( tempLetter.toLowerCase() ==  word[i].toLowerCase() ) {
					goodLetters[i] = true;
					goodLettersCount++;
				} else {
					goodLetters[i] = false;
				}
				//console.log(tempLetter.toLowerCase() + '|' + word[i].toLowerCase());
			}
			
			if ((goodLettersCount === word.length) || v.regionFinishedQuests[questName]) {
				result[0] = true;
				result[1] = '<b style="color: #86d686;">✓</b> Write <b style="color: #86d686;">' + word + '</b> with the first letters of your dishes<br> in the main restaurant menu.<br><br>';
				if (!v.regionRewardedQuests[questName]) {
					if (questName.indexOf('Outer') !== -1 ) {						
						result[1] += '<button class="reward" onClick="Set200NoveltyAll();CollectReward(\''+questName+'\')">Max All Novelty</button><br><br>';
							
					} else {						
						result[1] += '<button class="reward" onClick="CollectReward(\''+questName+'\')">Collect '+ShowReward(questName)+'</button><br><br>';
					}	
				}
				if (questName.indexOf('Outer') !== -1 ) {
					if (!v.regionRewardedQuests[questName+'2ndNovelty']) {
						result[1] += '<button class="reward" onClick="Set200NoveltyAll();CollectReward(\''+questName+'2ndNovelty\')">Max All Novelty</button><br><br>';
					}
				}	
				v.regionFinishedQuests[questName] = 1;
				return result;
			} else {
				result[0] = false;
			}
			let result1 = '<b style="color: #FF0000;">❌</b> Write <b style="color: #bb6f6f;">' + word + '</b> with the first letters of your dishes<br> in the main restaurant menu.<br>';
			if (word.indexOf('_') > 0) {
				result1 += 'Spaces can be done with empty slots.<br>';				
			}
			
			for (let i=0; i < word.length; i++) {				
				if (goodLetters[i]) {
					result1 += '<span style="color: #4dd64d;">'+word[i]+'</span>'; // Green
				} else {
					result1 += '<span style="color: #bb6f6f;">'+word[i]+'</span>'; // Red
				}
			}
			
			if (questName.indexOf('Outer') !== -1 ) {
				result1 += '<br>(Use the Goals button on the game screen to keep track of the current quest).';
			}	
			
			result1 += '<br><br>';
			
			result[1] = result1;
			
			return result;	
		} else {
			return undefined;	
		}
	}
	
	function ShowCurrentWord() {
		let word = undefined;
		if (v.region > 10) {
			word = OUTER_REGIONS_WORDS[v.region-11];
		}
		if (word !== undefined) {
			let questName = 'R'+v.region+'_CheckWordOuter';
			if (v.regionFinishedQuests[questName]) {
				return '';
			}	
			let result = [];
			
			let goodLetters = [];
			let goodLettersCount = 0;
			for (let i=0; i < word.length; i++) {
				let tempItem = $('#storefront .fooditem').eq(i);
				let tempLetter = '';
				if (tempItem.attr('data-type') != undefined ) {
					tempLetter = tempItem.attr('data-type')[0];
				}
				if (tempLetter === undefined) {
					tempLetter = '_';
				}
				if ( tempLetter.toLowerCase() ==  word[i].toLowerCase() ) {
					goodLetters[i] = true;
					goodLettersCount++;
				} else {
					goodLetters[i] = false;
				}
				//console.log(tempLetter.toLowerCase() + '|' + word[i].toLowerCase());
			}			
			
			let result1 = 'Outer Region Quest:<br>';
			result1 += '<span style="word-break: break-all;">';
			for (let i=0; i < word.length; i++) {				
				if (goodLetters[i]) {
					if (word[i] !== '_') {
						result1 += '<span style="color: #4dd64d;">'+word[i]+'</span>'; // Green
					} else {
						result1 += '<span style="color: #4dd64d;">_</span>'; // Green
					}
				} else {
					if (word[i] !== '_') {
						result1 += '<span style="color: #bb6f6f;">'+word[i]+'</span>'; // Red
					} else {
						result1 += '<span style="color: #bb6f6f;">_</span>'; // Red
					}	
				}
			}
			result1 += '</span>'
			result1 += '<br><br>';
			
			result = result1;
			
			return result;	
		} else {
			return undefined;	
		}
	}
	
	function ShowCurrentPuzzle() {
		let goalsHTML = '';		
		
		goalsHTML += 'Order your restaurant\'s food themes and quantities.<br> Like this:<br>'+
			'<div style="text-align: left; padding: 7px 7px 7px 10px; border: 1px solid #a05555; border-radius: 10px; width: 100px; margin-left: 25%;margin-top: 5px;display:inline-block;">'+
			'<span>Themes:</span><br>';		
		goalsHTML += ShowPuzzleCats();
		goalsHTML += '</div>';
		
		return goalsHTML;
	}
	
	function ShowPuzzleCats(regionNum) {
		if (regionNum === undefined) {
			regionNum = v.region;
		}
		let catsHTML = '';
		let puzzleCats = ParsePuzzleGoals(OUTER_REGIONS_WORDS[regionNum-11]);		
		let sortedCats = SortObjectByValue(puzzleCats);
		sortedCats.forEach(function(item) {
			if (v.foodClasses[item.k] == puzzleCats[item.k]) {
				catsHTML += '<b class="category_circle" style="color:'+colors[item.k]+'">●</b> ' + BeautifyDataType(item.k) + ': <span style="color: #5ab55a;">' + item.v + '</span><br>'; //green
			} else {
				catsHTML += '<b class="category_circle" style="color:'+colors[item.k]+'">●</b> ' + BeautifyDataType(item.k) + ': <span style="color: #bb6f6f;">' + item.v + '</span><br>';
			}
		});
		return catsHTML;
	}	
		
	function CheckPuzzle(puzzleGoals, questName) {
		if (puzzleGoals !== undefined) {			
			let result = [];			
			result[0] = false;
			let regionNum = questName[1] + questName[2];
			
			puzzleGoals = ParsePuzzleGoals(puzzleGoals);
		
			if ((
				(v.foodClasses['cheap'] 	== puzzleGoals['cheap']) &&
				(v.foodClasses['dessert'] 	== puzzleGoals['dessert']) &&
				(v.foodClasses['drink'] 	== puzzleGoals['drink']) &&
				(v.foodClasses['fastfood'] 	== puzzleGoals['fastfood']) &&
				(v.foodClasses['meat'] 		== puzzleGoals['meat']) &&
				(v.foodClasses['premium'] 	== puzzleGoals['premium']) &&
				(v.foodClasses['seafood'] 	== puzzleGoals['seafood']) &&
				(v.foodClasses['vegan'] 	== puzzleGoals['vegan'])			
				) || (v.regionFinishedQuests[questName])) {
				result[0] = true;
				result[1] = '<b style="color: #86d686;">✓</b> Order your restaurant\'s food themes and quantities.<br>';
				if (!v.regionRewardedQuests[questName]) {
					if (questName == 'R50_CheckPuzzleOuter') {
						result[1] += '<br><button style="height:100px;" class="reward" onClick="Set200NoveltyAll();CollectReward(\''+questName+'\')">200 All Novelty and Biggest Deliveries</button><br><br>';
					} else if (questName == 'R75_CheckPuzzleOuter') {					
						result[1] += '<br><button style="height:100px;" class="reward" onClick="Set200NoveltyAll();CollectReward(\''+questName+'\')">200 All Novelty and Max Dish Level 12</button><br><br>';
					} else {
						result[1] += '<button class="reward" onClick="Set200NoveltyAll();CollectReward(\''+questName+'\')">Max All Novelty</button><br><br>';
					}	
				}
				if (questName.indexOf('Outer') !== -1 ) {
					if (!v.regionRewardedQuests[questName+'2ndNovelty']) {
						result[1] += '<button class="reward" onClick="Set200NoveltyAll();CollectReward(\''+questName+'2ndNovelty\')">Max All Novelty</button><br><br>';
					}
				}
				v.regionFinishedQuests[questName] = 1;			
				return result;
			}
			
			result[1] = '';
			result[1] += '<b style="color: #FF0000;">❌</b> Order your restaurant\'s food themes and quantities.<br> Like this:<br>'+
			'<div style="text-align: left; padding: 7px 7px 7px 10px; border: 1px solid #a05555; border-radius: 10px; width: 100px; margin-left: 40%;margin-top: 5px;">'+
			'<span>Themes:</span><br>'+
			ShowPuzzleCats(regionNum) +			
			'</div>';
			result[1] += '<br>(Use the Goals button on the game screen to keep track of the current quest).';
			
			return result;	
		} else {
			return undefined;	
		}
	}
		
	function ParsePuzzleGoals(strPuzzleGoals) {
		let arrPuzzleGoals = strPuzzleGoals.split('-');
		let objPuzzleGoals = {};
		objPuzzleGoals.cheap 		= arrPuzzleGoals[0];
		objPuzzleGoals.dessert 		= arrPuzzleGoals[1];  
		objPuzzleGoals.drink 		= arrPuzzleGoals[2];     
		objPuzzleGoals.fastfood 	= arrPuzzleGoals[3];  
		objPuzzleGoals.meat 		= arrPuzzleGoals[4];      
		objPuzzleGoals.premium 		= arrPuzzleGoals[5];   
		objPuzzleGoals.seafood 		= arrPuzzleGoals[6];   
		objPuzzleGoals.vegan 		= arrPuzzleGoals[7];
		return objPuzzleGoals;
	}
	
	function ShowReward(questName) {		
		if (challengeStats[questName][1] == 'coupons') {
			return challengeStats[questName][0] + '&nbsp;<span class="em">🔖</span>';
		}
		if (challengeStats[questName][1] == 'gems') {
			return challengeStats[questName][0] + '&nbsp;<span class="em">💎</span>';
		}
		if (challengeStats[questName][1] == 'giftboxes') {
			return challengeStats[questName][0] + '&nbsp;<span class="em">🎁</span>';
		}
		if (challengeStats[questName][1] == 'skill') {
			return 'New Skill';
		}
		if (v.region > 10) {
			return '<button>Refresh Novelty</button>';
		}
	}
	
	function CollectReward(questName) {
		if (v.regionRewardedQuests[questName] == undefined) {
			if (challengeStats[questName] !== undefined) {
				if (challengeStats[questName][1] == 'coupons') {
					v.coupons = +v.coupons + +challengeStats[questName][0];
				}
				if (challengeStats[questName][1] == 'gems') {
					paid.gems = +paid.gems + +challengeStats[questName][0];
				}
				if (challengeStats[questName][1] == 'giftboxes') {
					v.deliveryGiftBoxes = +v.deliveryGiftBoxes + +challengeStats[questName][0];
				}
				if (challengeStats[questName][1] == 'skill') {
					if (challengeStats[questName][0] == 'biggerDeliveries1') {
						if (v.skills.biggerDeliveries == undefined) {
							v.skills.biggerDeliveries = 1;
						}	
					}
					if (challengeStats[questName][0] == 'maxLevel11') {
						if (v.skills.maxLevel < 11) {
							v.skills.maxLevel = 11;
						}					
					}
					if (challengeStats[questName][0] == 'biggestDeliveries1') {
						if (v.skills.biggestDeliveries == undefined) {
							v.skills.biggestDeliveries = 1;
						}
					}
					if (challengeStats[questName][0] == 'maxLevel12') {
						if (v.skills.maxLevel < 12) {
							v.skills.maxLevel = 12;
						}					
					}
				}	
			}	
			v.regionRewardedQuests[questName] = 1;
			UpdateProgressScreen();
			UpdateIncome();
		}
	}
	
	function SetStorefrontPage(pagenum = 1) {
		$('#storefront').removeClass('page1');
		$('#storefront').removeClass('page2');
		$('#storefront').removeClass('page3');
		$('#storefront').removeClass('page4');
		$('#storefront').addClass('page' + pagenum);
	}
	
	function ShowFirework(fwOffset, levelUp = false, levelUpMessage = 'Level up!', fwOptions = '') {
		v.fireworkN++;
		if (+v.fireworkN >= 11) {
			v.fireworkN = 1;
		}
		let position = JSON.parse(JSON.stringify(fwOffset));
		if ((position.left <= 50) && (position.top <= 50)) {
			return false;
		}
		position.left = +position.left + 50;
		position.top  = +position.top + 50;
		let position2 = JSON.parse(JSON.stringify(fwOffset));
		position2.left = +position2.left - 12;
		position2.top  = +position2.top + 2;
		if (fwOptions === 'nofw') {
			// TODO: Add another visual effect
		} else {
			$('#firework' + v.fireworkN).css(position).show();
		}			
		if (levelUp) {
			$('#levelup' + v.fireworkN).html(levelUpMessage).css('transform', 'translateY(40px)');
			$('#levelup' + v.fireworkN).css(position2).show();
			$('#levelup' + v.fireworkN).css('transform', 'translateY(-5px)');
			
		}
		HideFirework(v.fireworkN);
			
	}
	
	function HideFirework(fwn) {
		let fwnl = fwn;
		setTimeout(function(){
			$('#firework' + fwnl).hide();
			$('#levelup' + fwnl).hide();
		}, 950, fwnl);
	}	
	
////////////////////////////// Bot for testing	
	function BotBuySkills() {
		//$('#prestige_button').trigger('click');
		UpdatePrestigeScreen();
		UpdatePrestigeButtons();
		
		let mincost = 0;
		let minskill = ''
		$('.skillbutton:not(.disabled)').each( function() {
			if (mincost == 0) {
				mincost = Number($(this).attr('data-cost'));
				minskill = $(this).attr('data-skill');
			}
			if (Number($(this).attr('data-cost')) < mincost) {
				mincost = Number($(this).attr('data-cost'));
				minskill = $(this).attr('data-skill');
			}
		});
		
		if ((mincost > 0) && (minskill != '') && (v.skillPointsUnspent >= mincost)) {
			$('.skillbutton.'+minskill).trigger('click');
			//console.log('Skills purchased: '+minskill + ' ' + mincost);
			BotBuySkills();
		} else {
			//console.log('Skills purchased: DONE');
		}
	}
	
	function BotMakeDeliveries() {
		debug2 = true;
		//$('#delivery_button').trigger('click');
		UpdateDeliveryScreen;
		DiscardDelivery();
		v.deliveryBoxes = 5;
		v.deliveryGiftBoxes = v.prestigePointsTotal;
		v.skills.supersort = 1;
		$('#hour25rb').prop('checked', 'checked');
		
		while (v.deliveryBoxes > 0) {	
			v.deliveryCooksMax = 20;
			if (v.prestigePointsTotal >= 10) {
				v.deliveryCooksMax++;				
			}
			if (v.prestigePointsTotal >= 30) {
				v.deliveryCooksMax++;				
			}
			if (v.prestigePointsTotal >= 70) {
				v.deliveryCooksMax++;				
			}
			if (v.prestigePointsTotal >= 150) {
				v.deliveryCooksMax++;				
			}
			if (v.prestigePointsTotal >= 310) {
				v.deliveryCooksMax++;				
			}
			if (v.prestigePointsTotal >= 630) {
				v.deliveryCooksMax++;				
			}
			if (v.prestigePointsTotal >= 1270) {
				v.deliveryCooksMax++;				
			}
			if (v.prestigePointsTotal >= 2000) {
				v.deliveryCooksMax++;				
			}
			if (v.prestigePointsTotal >= 4000) {
				v.deliveryCooksMax++;				
			}
			if (v.prestigePointsTotal >= 8000) {
				v.deliveryCooksMax++;				
			}
			if (v.prestigePointsTotal >= 16000) {
				v.deliveryCooksMax++;				
			}
			if (v.prestigePointsTotal >= 32000) {
				v.deliveryCooksMax++;				
			}
			
			NewDelivery();
			v.deliveryCooksLeft = v.deliveryCooksMax;
			CookDelivery();	
			
			while (v.deliveryCooksLeft > 0) {
				$('#delivery_kitchen .fooditem').each( function() {
					$(this).trigger('contextmenu');
				});
				CookDelivery();
			}	
			$('#delivery_kitchen .fooditem').each( function() {
				$(this).trigger('contextmenu');
			});
			
			if ((v.deliveryIncome > v.deliveries[0].income) || (v.deliveries[0].income === undefined)) {
				SetDelivery(0);
			} else
			if ((v.deliveryIncome > v.deliveries[1].income) || (v.deliveries[1].income === undefined)) {
				SetDelivery(1);
			} else
			if ((v.deliveryIncome > v.deliveries[2].income) || (v.deliveries[2].income === undefined)) {
				SetDelivery(2);
			}	
			DiscardDelivery();
		}
		
		v.deliveries[0].time = 10000000000;
		v.deliveries[1].time = 10000000000;
		v.deliveries[2].time = 10000000000;
		
		debug2 = false;
	}
	
	
	function BotTierUpRestaurant() {
		
		if (v.newFood.length == 0) {
			if (v.activeIncome >= v.incomeBreakpoint) {
				v.activeIncomeMultiplier = (+v.activeIncomeMultiplier + 0.4);
				v.activeIncomeMultiplier = 0 + +v.activeIncomeMultiplier.toFixed(2);				
				v.restaurantTier++;
				UpdateStorefrontSize();				
				
				v.incomeBreakpoint = v.incomeBreakpoint * 5;
				if (v.skills.perks > 0) {	
					BotSelectNewPerk();			
				}
				//UpdateIncome();
				//UpdateButtonsOnChange();
				//UpdateFoodItems();
				//console.log('TierUp');
				return false;				
			}
		}
		if (v.activeIncome >= v.incomeBreakpoint) {			
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
			}
			
			//console.log('Select food: ' + v.newFood[rnd1] + ',' + v.newFood[rnd2] + '|' + v.newFood[rnd3] + ',' + v.newFood[rnd4]);
			
			let set1goodCats = 0;
			let set2goodCats = 0;
			
			if ((defaultFoodStats[v.newFood[rnd1]].class_a == 'premium') || (defaultFoodStats[v.newFood[rnd1]].class_b == 'premium')) {
				set1goodCats = +set1goodCats + 2;
			}
			if ((defaultFoodStats[v.newFood[rnd1]].class_a == 'dessert') || (defaultFoodStats[v.newFood[rnd1]].class_b == 'dessert')) {
				set1goodCats = +set1goodCats + 2;
			}
			if ((defaultFoodStats[v.newFood[rnd1]].class_a == 'vegan') || (defaultFoodStats[v.newFood[rnd1]].class_b == 'vegan')) {
				set1goodCats = +set1goodCats + 1;
			}
			if ((defaultFoodStats[v.newFood[rnd2]].class_a == 'premium') || (defaultFoodStats[v.newFood[rnd2]].class_b == 'premium')) {
				set1goodCats = +set1goodCats + 2;
			}
			if ((defaultFoodStats[v.newFood[rnd2]].class_a == 'dessert') || (defaultFoodStats[v.newFood[rnd2]].class_b == 'dessert')) {
				set1goodCats = +set1goodCats + 2;
			}
			if ((defaultFoodStats[v.newFood[rnd2]].class_a == 'vegan') || (defaultFoodStats[v.newFood[rnd2]].class_b == 'vegan')) {
				set1goodCats = +set1goodCats + 1;
			}
			
			if ((defaultFoodStats[v.newFood[rnd3]].class_a == 'premium') || (defaultFoodStats[v.newFood[rnd3]].class_b == 'premium')) {
				set2goodCats = +set2goodCats + 2;
			}
			if ((defaultFoodStats[v.newFood[rnd3]].class_a == 'dessert') || (defaultFoodStats[v.newFood[rnd3]].class_b == 'dessert')) {
				set2goodCats = +set2goodCats + 2;
			}
			if ((defaultFoodStats[v.newFood[rnd3]].class_a == 'vegan') || (defaultFoodStats[v.newFood[rnd3]].class_b == 'vegan')) {
				set2goodCats = +set2goodCats + 1;
			}
			if ((defaultFoodStats[v.newFood[rnd4]].class_a == 'premium') || (defaultFoodStats[v.newFood[rnd4]].class_b == 'premium')) {
				set2goodCats = +set2goodCats + 2;
			}
			if ((defaultFoodStats[v.newFood[rnd4]].class_a == 'dessert') || (defaultFoodStats[v.newFood[rnd4]].class_b == 'dessert')) {
				set2goodCats = +set2goodCats + 2;
			}
			if ((defaultFoodStats[v.newFood[rnd4]].class_a == 'vegan') || (defaultFoodStats[v.newFood[rnd4]].class_b == 'vegan')) {
				set2goodCats = +set2goodCats + 1;
			}
			
			if (set1goodCats > set2goodCats) {
				BotSetNewFood(v.newFood[rnd1], v.newFood[rnd2]);
			} else {
				BotSetNewFood(v.newFood[rnd3], v.newFood[rnd4]);
			}
			
			v.activeIncomeMultiplier = (+v.activeIncomeMultiplier + 0.2);
			v.activeIncomeMultiplier = 0 + +v.activeIncomeMultiplier.toFixed(2);
			
			let storefrontSlots = $("#storefront .fooditem").length;
			
			if (storefrontSlots <= 96) {
				AddStoreSlots(1);
			}			
			
			//UpdateStorefrontSize();
			
			v.incomeBreakpoint = v.incomeBreakpoint * 5;
						
			//UpdateIncome();
			//UpdateButtonsOnChange();
			//UpdateFoodItems();			
		}
	}
	
	function BotSetNewFood(newFood1, newFood2) {
		if (v.activeFood.indexOf(newFood1) === -1) {
			v.activeFood.push(newFood1);
		}
		if (v.activeFood.indexOf(newFood2) === -1) {
			v.activeFood.push(newFood2);
		}		
		RemoveFromArray(v.newFood, newFood1);
		RemoveFromArray(v.newFood, newFood2);
		
		//console.log('Got food: ' +newFood1 + ',' + newFood2);
		
		if (v.skills.perks > 0) {	
			BotSelectNewPerk();			
		} else {			
			UpdateFoodItems();			
		}
	}
	
	function BotSelectNewPerk() {
		CheckAvailablePerks();
		if (v.newPerks.length < 1) {			
			SetGameState('normal');			
			
			UpdateIncome();
			UpdateButtonsOnChange();
			UpdateFoodItems();
			return false;
		}
	
		SetGameState('perk');
		// Get perks
		let optionsHTML = '';
		let rnd1 = GetRandomInt(0,v.newPerks.length - 1);
		let rnd2 = GetRandomInt(0,v.newPerks.length - 1);
		for (let i = 0; i < 10; i++) { // making sure the choices are different
			if (rnd1==rnd2) {
				rnd2 = GetRandomInt(0,v.newPerks.length - 1);
			}
		}	
		
		//console.log('Select perks: ' + v.newPerks[rnd1] + '|' + v.newPerks[rnd2]);
		
		let sortVals = [];//effect vals for perk buffs to see which one to upgrade - better to spread upgrades
		//sortVals[0] = {sKey: 'allFood', sVal: 0};
		sortVals[0] = {sKey: 'vegan', sVal: 0};
		sortVals[1] = {sKey: 'premium', sVal: 0};
		sortVals[2] = {sKey: 'dessert', sVal: 0};			
		for (let pIndex in v.perks) {
			/*if (v.perks[pIndex].indexOf('allFood') >= '0') {
				sortVals[0].sVal = +defaultPerkStats[v.perks[pIndex]].effect * 2;
			}*/
			if (v.perks[pIndex].indexOf('vegan') >= '0') {
				sortVals[0].sVal = +defaultPerkStats[v.perks[pIndex]].effect;
			}
			if (v.perks[pIndex].indexOf('premium') >= '0') {
				sortVals[1].sVal = +defaultPerkStats[v.perks[pIndex]].effect;
			}
			if (v.perks[pIndex].indexOf('dessert') >= '0') {
				sortVals[2].sVal = +defaultPerkStats[v.perks[pIndex]].effect;
			}			
		}				
		sortVals = sortVals.sort(function(obj1, obj2) {
		   return obj1.sVal - obj2.sVal;
		}).reverse();
		
		let newPerk = '';
		if (v.newPerks[rnd1].indexOf('allFood') >= '0') {
			newPerk = v.newPerks[rnd1];
		}
		if (v.newPerks[rnd2].indexOf('allFood') >= '0') {
			newPerk = v.newPerks[rnd2];
		}
		if (v.newPerks[rnd1].indexOf(sortVals[0].sKey) >= '0') {
			newPerk = v.newPerks[rnd1];
		}
		if (v.newPerks[rnd2].indexOf(sortVals[0].sKey) >= '0') {
			newPerk = v.newPerks[rnd2];
		}
		if (v.newPerks[rnd1].indexOf(sortVals[1].sKey) >= '0') {
			newPerk = v.newPerks[rnd1];
		}
		if (v.newPerks[rnd2].indexOf(sortVals[1].sKey) >= '0') {
			newPerk = v.newPerks[rnd2];
		}
		if (v.newPerks[rnd1].indexOf(sortVals[2].sKey) >= '0') {
			newPerk = v.newPerks[rnd1];
		}
		if (v.newPerks[rnd2].indexOf(sortVals[2].sKey) >= '0') {
			newPerk = v.newPerks[rnd2];
		}
		if (newPerk == '') {
			if (rnd1 > rnd2) {
				newPerk = v.newPerks[rnd1];
			} else {
				newPerk = v.newPerks[rnd2];
			}	
		}
		BotSetNewPerk(newPerk);		
		
		//UpdateIncome();
		//UpdateButtonsOnChange();
		//UpdateFoodItems();
	}
	
	function BotSetNewPerk(perkName) {
		v.perks.push(perkName);
		v.exhaustedPerks.push(perkName);
		RemoveFromArray(v.perks, defaultPerkStats[perkName].prerequisite);
			
		if ((perkName === 'delivery1') || (perkName === 'delivery2') || (perkName === 'delivery3') || (perkName === 'delivery4')) {
			v.deliveryCooksMax = +v.deliveryCooksMax + +defaultPerkStats[perkName].effect;
		}				
		SetGameState('normal');
		
		//UpdateFoodItems();
		//UpdateIncome();
		//console.log('Got Perk - ' + perkName);
	}
	
	// Premium - desert - vegan
	function BotArrangeFood() { 
		$('#kitchen .fooditem').each( function() {
			let thisDataType = $(this).attr('data-type');
			if ((thisDataType != '') && (thisDataType != undefined)) {
				if (
					(defaultFoodStats[thisDataType].class_a == 'premium') ||
					(defaultFoodStats[thisDataType].class_a == 'dessert') ||
					(defaultFoodStats[thisDataType].class_a == 'vegan') ||
					(defaultFoodStats[thisDataType].class_b == 'premium') ||
					(defaultFoodStats[thisDataType].class_b == 'dessert') ||
					(defaultFoodStats[thisDataType].class_b == 'vegan')					
				   ) {
					$(this).trigger('contextmenu');
				}
				
				if ((defaultFoodStats[thisDataType].class_a == 'buff') && (v.skills['dishOfTheDay'] >= 1) && (!(v.skills['mealOfTheDay'] >= 1))) {
					let firstSF = $('#storefront .fooditem').eq(0).attr('data-type');
					if ((firstSF != '') && (firstSF != undefined) && (v.skills['science'] != 1)) {
						if (
							(defaultFoodStats[firstSF].class_a != 'dessert') ||							
							(defaultFoodStats[firstSF].class_b != 'premium') ||
							(defaultFoodStats[firstSF].baseIncome == 1)
							){
							let newDessertPremium = '';							
							$('#storefront .fooditem').each( function() {
								let thisDataTypeSF = $(this).attr('data-type');
								if ((thisDataTypeSF != '') && (thisDataTypeSF != undefined)) {
									if (
										(defaultFoodStats[thisDataTypeSF].class_a == 'dessert') &&							
										(defaultFoodStats[thisDataTypeSF].class_b == 'premium') &&
										(defaultFoodStats[thisDataTypeSF].baseIncome >= 4)
										) {
											if (newDessertPremium == '') {
												newDessertPremium = thisDataTypeSF;
											} else {
												if (+defaultFoodStats[thisDataTypeSF].baseIncome > +defaultFoodStats[newDessertPremium].baseIncome) {
													newDessertPremium = thisDataTypeSF;
												}
											}
									}
								}	
							});		
							// here newDessertPremium should be set if relevant
							
							if ((newDessertPremium != '') && (newDessertPremium != 'cupcake')) {
								$('#storefront .fooditem').each( function() {
									let thisDataTypeSF = $(this).attr('data-type');
									let firstDataTypeSF = $('#storefront .fooditem').eq(0).attr('data-type');
									if (thisDataTypeSF == newDessertPremium) {
										$('#kitchen .fooditem').each( function() {
											if ( ($(this).attr('data-type') == '') || ( $(this).attr('data-type') == undefined) ) {
												$(this).attr('data-type','hamburger').attr('data-qty', 1);
											}
										});
										
										$('#kitchen .fooditem').eq(3).attr('data-type', '').attr('data-qty', 1);
										$('#kitchen .fooditem').eq(4).attr('data-type', '').attr('data-qty', 1);
										
										$('#storefront .fooditem').eq(0).trigger('contextmenu'); //goes to slot [3]
										$(this).trigger('contextmenu'); //goes to slot [4]
										
										$('#kitchen .fooditem').eq(4).trigger('contextmenu'); //goes to first
										$('#kitchen .fooditem').eq(3).trigger('contextmenu'); //goes to whatever	
										
										//console.log('Replaced: ' + firstDataTypeSF + ' <> ' + newDessertPremium);
									}
								});	
							}
						}	
					}	
					$(this).trigger('contextmenu');	
				}
				
				if ((defaultFoodStats[thisDataType].class_a == 'buff') && (v.skills['dishOfTheDay'] >= 1) && ((v.skills['mealOfTheDay'] >= 1))) {
					$(this).trigger('contextmenu');	
				}
			}
		});		
		
		SortByIncome();		
	}
	
	function BotReArrangeFood() {
		$('#kitchen .fooditem').each( function() {
			let thisDataType = $(this).attr('data-type');
			let thisDataTypeGoodNum = 0;
			let $kitchenDish = $(this);
			let $storefrontDish = undefined;
			
			if ((thisDataType != undefined) && (thisDataType != '')) {			
				if (defaultFoodStats[thisDataType].class_a == 'premium') {
					thisDataTypeGoodNum++;
				}
				if (defaultFoodStats[thisDataType].class_a == 'dessert') {
					thisDataTypeGoodNum++;
				}
				if (defaultFoodStats[thisDataType].class_a == 'vegan') {
					thisDataTypeGoodNum++;
				}
				if (defaultFoodStats[thisDataType].class_b == 'premium') {
					thisDataTypeGoodNum++;
				}
				if (defaultFoodStats[thisDataType].class_b == 'dessert') {
					thisDataTypeGoodNum++;
				}
				if (defaultFoodStats[thisDataType].class_b == 'vegan') {
					thisDataTypeGoodNum++;
				}
				if (thisDataTypeGoodNum > 1) {
					$('#storefront .fooditem').each( function() {
						if (Number($(this).attr('data-num')) > 3) {						
							let sfDataType = $(this).attr('data-type');
							let sfDataTypeGoodNum = 0;
							
							if ((sfDataType != undefined) && (sfDataType != '')) {
								if (defaultFoodStats[sfDataType].class_a == 'premium') {
									sfDataTypeGoodNum++;
								}
								if (defaultFoodStats[sfDataType].class_a == 'dessert') {
									sfDataTypeGoodNum++;
								}
								if (defaultFoodStats[sfDataType].class_a == 'vegan') {
									sfDataTypeGoodNum++;
								}
								if (defaultFoodStats[sfDataType].class_b == 'premium') {
									sfDataTypeGoodNum++;
								}
								if (defaultFoodStats[sfDataType].class_b == 'dessert') {
									sfDataTypeGoodNum++;
								}
								if (defaultFoodStats[sfDataType].class_b == 'vegan') {
									sfDataTypeGoodNum++;
								}
								
								if (sfDataTypeGoodNum < 2) {
									$storefrontDish = $(this);
								}
							}
						}	
					});	
					
					if ($storefrontDish != undefined) {
						$storefrontDish.attr('data-qty', 1).attr('data-type', '');
						$kitchenDish.trigger('contextmenu');
					}
				}		
			}	
		});
	}
	
	// Premium - desert - vegan		
	function BotSetup() { 
		if ((v.skills.starterRestaurants == 1) && (v.skills.tier2_3starter != 1)) {
			SetDefaultFood(1);
		}
	
		if ((v.skills.tier3food == 1) && (v.skills.tier2_3starter == 1) && (v.skills.tier4food != 1)) {
			$('#new_food_select_1').val("vegan_pizza").change();
			$('#new_food_select_2').val("juice").change();
			SetDefaultFood(1);
		}
		if (v.skills.tier4food == 1) {
			$('#new_food_select_1').val("pasta_salad").change();
			$('#new_food_select_2').val("pureed_veggie_soup").change();
			SetDefaultFood(1);
		}
		
		if (v.skills.science == 1) {
			let defFood1 = $('#default .fooditem').eq(0).attr('data-type');
			let defFood2 = $('#default .fooditem').eq(1).attr('data-type');
			let selectedScience = 'dessert'; 				
			   
			v.scienceCategory = selectedScience;
			v.scienceType1 = defFood1; 
			v.scienceType2 = defFood2; 
			UpdateFoodItems();
			UpdateIncome();
			$('#default_text').remove();
			$('#default').css('height', '120px');
			$('#game button.science').hide();
			$('#science_select').hide();
			
			$('#default .fooditem').eq(0).trigger('contextmenu');
			$('#default .fooditem').eq(1).trigger('contextmenu');
			
			$('#default .fooditem').eq(0).attr('data-type', 'banana_sandwich').attr('data-qty',1);
			$('#default .fooditem').eq(1).attr('data-type', 'cupcake').attr('data-qty',1);
			
			$('#kitchen .fooditem').eq(0).trigger('contextmenu');
			$('#kitchen .fooditem').eq(1).trigger('contextmenu');
			$('#kitchen .fooditem').eq(2).attr('data-type', 'coffee').attr('data-qty',1).trigger('contextmenu');
			
			if (v.prestigePointsTotal >= 64000) {
				$('#kitchen .fooditem').eq(3).attr('data-type', 'pasta_salad').attr('data-qty',1000).trigger('contextmenu');
			}
		}
	}
	
	
	
	let botResults = [];	
	function AddBotResult(botRes) {
		if (botResults[0] == undefined) {
			botResults[0] = botRes;
		} else 
		if (botResults[1] == undefined) {
			botResults[1] = botRes;
		} else 
		if (botResults[2] == undefined) {
			botResults[2] = botRes;
		} else 
		if (botResults[3] == undefined) {
			botResults[3] = botRes;
		} else 	
		if (botResults[4] == undefined) {
			botResults[4] = botRes;
			let sum = 0;
			for( let i = 0; i < botResults.length; i++ ){
				sum += parseInt( botResults[i], 10 );
			}
			var avg = sum/botResults.length;
			console.log('AVG: ' + avg);
			botResults = [];
		}	
	}
	
	let botUseCoupons = true;
	
	// Premium - desert - vegan
	function BotTestPPDouble(PP) { 
		//console.log("1: " + performance.now());
		$('#main-wrapper').hide();
		debug2 = true;
		v.deliveries = [{},{},{}]; // to store deliveries as objects
		v.deliveries[0].income = 0;
		v.deliveries[1].income = 0;
		v.deliveries[2].income = 0;		
		
		v.couponShardsBreakpoint = 600;
		v.options.buff_autoplacement = true;
		v.prestigePointsTotal = PP;
		v.skillPointsUnspent = PP;
		v.prestigePointsToGet = 0;
		v.prestigePointMoneyEarned = 0;
		v.skills = {}; // to store current active skills
		v.skills.supersort = 1;
		v.skills.minCook = 1;
		v.skills.maxCook = 2;
		v.skills.maxLevel = 4;
		v.skills.maxBuff = 1;
		v.skills.deliveryTier = 1;
		pings = 0;
		compensatedPings = 0;
		
		
		
		if (PP >= 6000) {
			v.currentNovelty = {
				cheap: 200,
				dessert: 200,
				drink: 200,
				fastfood: 200,
				meat: 200,
				premium: 200,
				seafood: 200,
				vegan: 200,
			};
			v.nextNovelty = {
				cheap: 200,
				dessert: 200,
				drink: 200,
				fastfood: 200,
				meat: 200,
				premium: 200,
				seafood: 200,
				vegan: 200,
			};
		}
		
		v.region = 0;		
		for (let progressPoint in PROGRESS) {			
			if (PROGRESS[progressPoint].region !== undefined) {
				if (v.prestigePointsTotal >= PROGRESS[progressPoint].prestigePoints) {
					v.region = PROGRESS[progressPoint].region;
				}
			}	
		}
		if (v.region >= 1) {
			v.skills.biggerDeliveries = 1;
		}		
		if (v.region >= 7) {
			v.skills.maxLevel = 11;
		}
		if (v.region >= 50) {
			v.skills.biggestDeliveries = 1;
		}
		if (v.region >= 70) {
			v.skills.maxLevel = 12;
		}
		PrestigeRestaurant();
		
		//console.log("2: " + performance.now());
		v.money = 30000;
		v.coupons = 50;	
		if (PP >= 4000) {
			v.coupons = 100;
		}
		if (PP >= 32000) {
			v.coupons = 200;
		}
		if (v.region >= 70) {
			v.coupons = 370;
		}
		
		
		if (PP >= 6000) {
			v.currentNovelty = {
				cheap: 200,
				dessert: 200,
				drink: 200,
				fastfood: 200,
				meat: 200,
				premium: 200,
				seafood: 200,
				vegan: 200,
			};
			v.nextNovelty = {
				cheap: 200,
				dessert: 200,
				drink: 200,
				fastfood: 200,
				meat: 200,
				premium: 200,
				seafood: 200,
				vegan: 200,
			};			
		}
		
		defaultCategoryBonuses = {
					meat: 0.2,
					vegan: 0.2,
					seafood: 0.2,
					fastfood: 0.2,
					dessert: 0.2,
					cheap: 0.15,
					premium: 0.2,
					drink: 0.15
				};
		
		BotBuySkills();
		
		//console.log("3: " + performance.now());
		BotSetup();
		
		//console.log("4: " + performance.now());
		BotMakeDeliveries();
		BotMakeDeliveries();
		BotMakeDeliveries();
		//console.log("5: " + performance.now());
		let actControl = 0;
		UpdateFoodItems();
		botUseCoupons = true;
		//console.log("6: " + performance.now());
		while ((v.prestigePointsToGet < (PP+10)) && (actControl >= 0) ) {
			let t0 = performance.now();
			
			BotMakeAction(PP);//do actions
			actControl++;
			
			let t1 = performance.now();
			//console.log("Action:" + Math.round(t1 - t0) + " milliseconds.");
		}
		BotArrangeFood();
		
		let addedDeliveryPercentage = 0;
		for (let i = 0; i < 3; i++) {			
			if ((v.deliveries[i].time > 0) || v.deliveries[i].expired) {
				addedDeliveryPercentage = +addedDeliveryPercentage + +v.deliveries[i].incomePercentMultiplied;					
			}
		}
		addedDeliveryPercentage = addedDeliveryPercentage.toFixed(1);
		
		debug2 = false;
		$('#main-wrapper').show();
		AddBotResult(BeautifyTime(pings));	
		
		//FirstItemDesc();
		return ( 'PP: ' + AbbreviateNumber(v.prestigePointsTotal) + ' => ' + AbbreviateNumber(+v.prestigePointsToGet + +v.prestigePointsTotal) +
					'('+v.region+')' + (+v.prestigePointsToGet + +v.prestigePointsTotal) + '; Time: ' + BeautifyTime(pings) + '; ACT: ' + actControl + '; nSalad: ' + $('#storefront .fooditem').eq(0).attr('data-qty') + '; Income: ' + AbbreviateNumber(v.incomeWithDeliveries) + '; Deliveries: ' + addedDeliveryPercentage);
					
	}
	
	let botTestTier = 1;
	
	function BotTestPPDouble5x5(PP, testTier) {
		$('#main-wrapper').hide();
		console.log('--- ' + AbbreviateNumber(PP) + '-' + AbbreviateNumber(PP*2) + ' ---');		
		console.log(BotTestPPDouble(PP));
		setTimeout(function() {
			console.log(BotTestPPDouble(PP));
			setTimeout(function() {
				console.log(BotTestPPDouble(PP));
				setTimeout(function() {
					console.log(BotTestPPDouble(PP));
					setTimeout(function() {
						console.log(BotTestPPDouble(PP));
						botTestTier++;
						if (+botTestTier > +testTier) {
							botTestTier = 1;
							$('#main-wrapper').show();
							console.log('DONE');
						} else {
							console.log(botTestTier + '/' + testTier);
							BotTestPPDouble5x5(PP*2, testTier);
						}						
					},100);
				},100);
			},100);
		},100);
	}
	
	
	function BotMakeAction(PP) {		
		debug2 = true;
		PrestigeBar1Reset(0);	
		let hadAction = false;
		if (v.activeIncome >= v.incomeBreakpoint) {
			let t0 = performance.now();
			
			BotTierUpRestaurant();			
			hadAction = true;
			
			let t1 = performance.now();
			//console.log("Tierup:" + Math.round(t1 - t0) + " milliseconds.");
		}
		
		// check if user has money AND charges to super cook
		if ( (v.money >= v.refreshPrice * 5) && (v.cookCount >= 6) && (v.activeIncome >= 200) ) {
			let t0 = performance.now();
			
			CookForMoney(6, true);	
			BotArrangeFood();
			hadAction = true;
			
			let t1 = performance.now();
			//console.log("Supercook:" + Math.round(t1 - t0) + " milliseconds.");
		}
		
		if ((v.money - (v.refreshPrice*6) >= 0) && ((v.cookCount < 6))) {
			let t0 = performance.now();
			
			CookForMoney(6);			
			BotArrangeFood();
			hadAction = true;
			
			let t1 = performance.now();
			//console.log("Cook6:" + Math.round(t1 - t0) + " milliseconds.");
		}
		
		if ((v.coupons >= 6) && (v.cookCouponsCount < 6) && botUseCoupons) {
			let t0 = performance.now();
			
			CookForCoupons(6);
			BotArrangeFood();
			hadAction = true;
			
			let t1 = performance.now();
			//console.log("CookCoupon6:" + Math.round(t1 - t0) + " milliseconds.");
		}

		if ((v.coupons >= 5) && (v.cookCouponsCount >= 6) && botUseCoupons) {
			let t0 = performance.now();
			
			CookForCoupons(6, true);
			UpdateFoodItems();
			BotArrangeFood();			
			BotReArrangeFood();
			hadAction = true;
			
			let t1 = performance.now();
			//console.log("Supercook Coupon:" + Math.round(t1 - t0) + " milliseconds.");
		}		
			
		if (!hadAction) {	
			let t0 = performance.now();
			
			EverySecond(60*30);
			botUseCoupons = false;
			
			let t1 = performance.now();
			//console.log("Everysec:" + Math.round(t1 - t0) + " milliseconds.");
		}
		
		//UpdateFoodItems();
		let t0 = performance.now();
		
		UpdateButtonsOnChange();
		UpdateIncome();		
		
		let t1 = performance.now();
		//console.log("Updates:" + Math.round(t1 - t0) + " milliseconds.");
	}
	
	function FirstItemDesc() {
		$('#storefront .fooditem').eq(0).each(
			function() {				
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
				
				if ((v.region > 10) && (OUTER_REGIONS_DISHES[v.region - 11] != undefined)) {
					let currentTrend = OUTER_REGIONS_DISHES[v.region - 11];
					if ((currentTrend != undefined) && ($(this).attr('data-type') == currentTrend) && (!debug2)) {
						thisBaseIncome = 20;
					}
				}
				if (v.region > 99) {
					thisBaseIncome = 20;
				}	
				
				let thisScienceCategoryBonus = (v.foodClasses[v.scienceCategory] || 0); // if not a number, then 0
				let thisClassC = '';
			
				if ( (v.scienceCategory !== undefined) && (v.scienceCategory !== '') && ((thisDataType == v.scienceType1) || (thisDataType == v.scienceType2)) ) {
					thisClassC = v.scienceCategory;
				}
				
				if ( (v.region == 4) && (thisBaseIncome == 4) && (thisClassA != 'buff') ) {
					thisBaseIncome = 8;
				} else {
					if ( (v.region == 4) && (thisBaseIncome == 8) ) {
						thisBaseIncome = 4;
					}
				}
				
				if ( (v.region == 8) && (thisBaseIncome == 2) && (thisClassA != 'buff') ) {
					thisBaseIncome = 8;
				} else {
					if ( (v.region == 8) && (thisBaseIncome == 8) ) {
						thisBaseIncome = 2;
					}
				}
				
				if ( (v.region == 10) && (thisBaseIncome == 1) && (thisClassA != 'buff') ) {
					thisBaseIncome = 8;
				} else {
					if ( (v.region == 10) && (thisBaseIncome == 8) ) {
						thisBaseIncome = 1;
					}
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

				if (v.foodClasses['drink'] > 0) {
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
					desc = '<b>' + thisDataTypeCapitalized + '</b> level ' + thisLv + ' (' + thisDataQty + ')<br>Max level|';
				} else {
					desc = '<b>' + thisDataTypeCapitalized + '</b> level ' + thisLv + ' (' + thisDataQty + '/' + nextLvBreakpoint + ')|';
				}
				desc += BeautifyDataType(thisClassA) + '|';
				desc += BeautifyDataType(thisClassB) + '|';

				if ( (v.scienceCategory !== undefined) && (v.scienceCategory !== '') && ((thisDataType == v.scienceType1) || (thisDataType == v.scienceType2)) ) {
					desc += BeautifyDataType(v.scienceCategory) + '\n';
				}
							
				if (thisLv > 1) {
					desc += 'Level bonus: x' + thisLvBonusMult + '\n';
				}
				if (thisBuffIncomeMult > 1) {
					for (let buff in thisBuffs) {
						let buffValue = defaultFoodStats[buff].baseIncome;
						let buffQty = thisBuffs[buff];
						let buffMaxLvString = '';
						if (buffQty >= (50 * v.skills.maxBuff)) {
							buffMaxLvString = ' (max)';
						}
						desc += 'Bonus from <b>' + BeautifyDataType(buff) + '</b>: +' + (buffValue * buffQty) + '%' + buffMaxLvString + '|';
					}
				}
				
				desc += '\n';
				
				desc += 'Bonus from ' + BeautifyDataType(thisClassA) + ': +' + Math.round(thisClassABonus * (v.categoryBonuses[thisClassA]*100)) + '%\n';
				desc += 'Bonus from ' + BeautifyDataType(thisClassB) + ': +' + Math.round(thisClassBBonus * (v.categoryBonuses[thisClassB]*100)) + '%\n';	
				
				if ( (v.scienceCategory !== undefined) && (v.scienceCategory !== '') && ((thisDataType == v.scienceType1) || (thisDataType == v.scienceType2)) ) {
					desc += 'Bonus from ' + BeautifyDataType(v.scienceCategory)+ ': +' + Math.round(thisScienceCategoryBonus * (v.categoryBonuses[v.scienceCategory]*100)) + '%\n';
				}

				if (v.foodClasses['drink'] > 0) {
					desc += 'Bonus from having a Drink: x2\n';
				}
				
				if (perkMulti !== 1) {						
					desc += 'Bonus from perks: +' + Math.round((perkMulti-1) * 100) + '%\n';
				}
				
				if (v.activeIncomeMultiplier > 1) {
					desc += 'Bonus from restaurant tier: x' + v.activeIncomeMultiplier + '\n';
				}
				if (v.prestigePointsTotal > 0) {
					if (v.prestigePointsTotal > 10000) {
						desc += 'Bonus from prestige points: +' + (AbbreviateNumber(v.prestigePointsTotal * 10)) + '%\n';
					} else {
						desc += 'Bonus from prestige points: +' + (v.prestigePointsTotal * 10) + '%\n';
					}
				}
				if (mealOfTheDayActive) {
					if (
						($(this).attr('data-num') == 1) ||
						($(this).attr('data-num') == 2) ||
						($(this).attr('data-num') == 3)
						) {
							desc += 'Bonus from meal of the day: x3\n';
					}
				} else {
					if (v.skills.dishOfTheDay >= 1) {						
						if ($(this).attr('data-num') == 1) {							
							desc += 'Bonus from dish of the day: x2\n';
						}
					}
				}
				desc += '<hr>';
				desc += 'Total income: ' + AbbreviateNumber(thisTotalIncome) + '\n';
				
				console.log(desc);								
				
			});			
	}