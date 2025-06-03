const CHAPTERQTY = 20; // Number of chapters
let PROGRESS = [
	{
		prestigePoints: 0, 
		text: '<b>Chapter 1/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'You have washed some dishes and placed some food, and now suddenly you are a certified restaurant manager!<br>'+
		'Does it always happen like that?<br><br>' +
		'<i><b>Earn prestige points to finish chapters.</b></i><br>'
	},
	{
		prestigePoints: 2, 
		text: '<b>Chapter 2/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'A local newspaper asked your permission to add<br>'+
		'"FREE MEAL COUPON"<br>'+
		'next to the photo of your restaurant.<br>'+
		'Sure! What could go wrong?<br>'+		
		'<br>'+
		'<i>Unlockable skill: Coupons</i><br>'+
		'<br>'+
		'You can prestige now to unlock the new skill, but it is recommended to wait for 10+ Prestige points first.<br><br>'
	},
	{
		prestigePoints: 10, 
		text: '<b>Chapter 3/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'Your dishes are good, as good as in any other restaurant.<br>' +
		'But that\'s the problem - they are exactly the same as in any other restaurant.<br>' +
		'What if you start improving your standard recipes by adding new original flavors?<br>' +
		'Sweet, sour, fresh or spicy - every dish has something good to add.<br>'+
		'You can make anything tasty, even broccoli!<br>'+
		'<br>'+
		'Well, ok, maybe not broccoli.<br>'+
		'<br>'+
		'<i>Unlockable skill: Buffs</i><br>'+
		'<br>'+
		'Prestige to unlock new skills.<br><br>'
	},
	{
		prestigePoints: 25, 
		text: '<b>Chapter 4/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'You found a website called Foodinder where you can find infinite recipes and pictures of food<br>'+
		'and swipe right to add them to your list of favourites.<br>'+
		'<br>'+
		'Now you spend many hours on it every day, but hey, at least you\'ve got a lot of new dish ideas!<br>'+
		'<br>'+
		'<i>Unlockable skill: Tier 3 Dishes</i>'
	},
	{
		prestigePoints: 30, 
		text: '<b>Chapter 5/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'Chef\'s secret technique:<br>' +	
		'Using both hands while cooking makes it easier and faster.<br>'+	
		'<br>'+
		'<i>The game is balanced so that it is always possible to at least double your Prestige Points every day (and much faster in the beginning).<br>'+		
		'Keep in mind that Coupons earned during the day could greatly speed up your progress, so even if it looks slow now, it\'ll be faster later.<br>'+
		'If it\'s still slower than a day for you, you might need to readjust your strategy or seek advice on Reddit.</i>'+
		'<br>'+
		'<br>'+
		'<i>Unlockable skill: Double Cook</i>'
	},
	{
		prestigePoints: 70, 
		text: '<b>Chapter 6/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'Your chef complains that it gets hard for him to always eat<br>'+ 
		'all the stuff that was cooked and then not used.<br>'+
		'Well, looks like you\'ll have to find some other direction to send all that food to.<br>'+
		'What about charities? Food banks, soup kitchens?<br>'+
		'Definitely need to read some more about those.<br>'+
		'<br>'+
		'<i>Unlockable skill: Charity</i>'
	},	
	{
		prestigePoints: 100, 
		text: '<b>Chapter 7/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'Prestige can\'t be silent, so why won\'t you start<br>'+ 
		'mentioning your success here and there?<br>'+
		'A blog post, an interview for a local newspaper, honestly, anything would do.<br>'+
		'Probably shouldn\'t do it too often so that people don\'t get too tired of it.<br>'+
		'Once a day should be fine.<br>'+
		'Just don\'t forget to add a pic of your cat.<br>'+
		'Posts with cats always get more attention!<br>'+
		'<br>'+
		'<i>Unlockable skill: Prestige Boosters</i>'
	},
	{
		prestigePoints: 150, 
		text: '<b>Chapter 8/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'Other restaurant owners started to notice your professionalism.<br>'+
		'They come to you asking for advice,<br>'+
		'some of them even want to give you their restaurants<br>'+
		'just to see how you would manage them.<br>'+
		'This could be a great opportunity to get a head start<br>'+
		'when you want to move on to something new.<br>'+
		'Yay, no more dishwashing!<br>'+
		'<br>'+
		'<i>Unlockable skill: Starting Restaurants</i>'
	},
	{
		prestigePoints: 230, 
		text: '<b>Chapter 9/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'A table-sized plate will let you add more exotic flavors to your dishes.<br>'+
		'And that big umbrella in the center of the table could now double as a food decoration.<br>'+
		'That\'s genius!<br>'+
		'<br>'+
		'<i>Unlockable skill: Max Buff</i>'
	},
	{
		prestigePoints: 310, 
		text: '<b>Chapter 10/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'Reading random books, blog posts and articles about food could provide some good learning.<br>'+
		'Never know what you are going to learn next.<br>'+
		'Like that one post about a chinatown fish soup.<br>'+
		'In short: never trust a chinatown chef saying the dish is not too spicy.<br>'+
		'<br>'+
		'<i>Unlockable skill: 📚 Perks</i>'
	},
	{
		prestigePoints: 400, 
		text: '<b>Chapter 11/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'Chef\'s secret technique:<br>' +	
		'Write down your recipes and keep them around so you don\'t have to google them every time.<br>'+
		'<br>'+
		'<i>Unlockable skill: Triple Cook</i>'
	},
	{
		prestigePoints: 500, 
		text: '<b>Chapter 12/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'You feel confident enough in your abilities to try something new.<br>'+
		'Can you make a restaurant that fits specific criteria?<br>'+
		'Challenge accepted!<br>'+
		'<br>'+
		'<i>Unlockable skill: Challenges</i>'
	},
	{
		prestigePoints: 630, 
		text: '<b>Chapter 13/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'Your reputation grows so fast!<br>'+
		'Now even renowned restaurant owners offer you their restaurants to manage.<br>'+
		'They trust you so much they are giving you full control.<br>'+
		'It\'s time to show them what you are capable of!<br>'+
		'They will not regret it!<br>'+
		'... probably.<br>'+
		'<br>'+
		'<i>Unlockable skill: Tier 2&nbsp;and&nbsp;3 starters and ability to replace them in the menu</i>'		
	},
	{
		prestigePoints: 1000, 
		text: '<b>Chapter 14/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'You have noticed that some dishes perform better than others.<br>'+
		'Wouldn\'t it be nice to have a special way to highlight them <br>'+
		'and bring even more attention to the best ones?<br>'+
		'"Dish of the day" banner will do just that.<br>'+
		'Even if it\'s the same dish every day!<br>'+
		'<br>'+
		'<i>Unlockable skill: Dish of the Day</i>'
	},
	{
		prestigePoints: 1500, 
		text: '<b>Chapter 15/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'Chef\'s secret technique:<br>' +	
		'You can put labels on your sugar, salt, baking soda and flour cans so you don\'t have to identify them by taste every time.<br>'+
		'<br>'+
		'<i>Unlockable skill: Sextuple Cook</i>'
	},
	{
		prestigePoints: 2000, 
		text: '<b>Chapter 16/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'Now it\'s time for some experimenting!<br>'+
		'Those starter cafes will provide perfect test subjects<br>'+
		'for your new ideas in the culinary world.<br>'+
		'For science!<br>'+
		'<br>'+
		'<i>Unlockable skill: Science</i>'
	},
	{
		prestigePoints: 3000, 
		text: '<b>Chapter 17/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'You recently came up with a great idea:<br>'+
		'Since people are visiting restaurants to have a full meal<br>'+
		'why highlight only one dish of the day?<br>'+
		'Better make it meal of the day!<br>'+		
		'Food + dessert + drink. Perfect balance.<br>'+		
		'Also add a free toy in there.<br>'+		
		'Don\'t want people to call it "Sad Meal" after all!<br>'+		
		'<br>'+
		'<i>Unlockable skill: Meal of the Day</i>'
	},
	{
		prestigePoints: 6000, 
		text: '<b>Chapter 18/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'"Variety is the spice of life", as the old saying goes.<br>'+		
		'You feel inspired when you try new restaurant categories.<br>'+				
		'(This is totally not just a way for the dev to incentivise<br>'+				
		'you to try making other restaurant setups<br>'+				
		'and not just the same one you\'ve been doing all this time)<br>'+				
		'<br>'+
		'<i>Unlockable skill: Novelty Bonus</i>'
	},
	//tier4 perks at 8k
	{
	prestigePoints: 16000, 
	text: '<b>Chapter 19/' + CHAPTERQTY + '</b><br>' +
			'<br>' +
		'Your customers sometimes ask you for a dish that you don\'t have.<br>'+
		'You have decided to write them all down. <br>By now you already have a big list of potential new dishes.<br>'+
		'Let\'s try them!<br>'+
		'Except for that "Bantha milk" thing. No idea what that even is, <br>and the guy who asked for it looked kind of weird anyway.<br>'+
		'<br>'+
		'<i>Unlockable skill: Tier 4 Dishes</i>'
	},	
	{
		prestigePoints: 32000, 
		text: '<b>Chapter 20/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'Now that you are on top of all restaurant ratings, you suddenly discovered that you don\'t really care about money that much anymore.<br>'+
		'This is an excellent time to make even more coupons.<br>'+
		'Free meals for everyone in need!<br>'+
		'Just got to find a better printer.<br>'+
		'<br>'+
		'<i>Unlockable skill: Faster Coupons</i>'
	},
	{
		prestigePoints: 64000, 
		text: '<b>CONGRATULATIONS!</b><br>' +
				'<br>' +
		'You\'ve finished the main part of the game!<br>'+
		'Your restaurant became the best in town and fed a lot of people.<br>'+
		'<br>'+
		'Later you could go to the other regions! (After-endgame content)<br>'+		
		'Regions are slower to complete, but all the dishes are always unlocked.<br>'+
		'Every completed region will give you +1 starting slot in the restaurant menu<br> and x2 Prestige Point multiplier.<br>'+		
		'<br>'+
		'<i>When you reach the end, don\'t stop. This may be a beginning of something new!</i>'+
		'<br>'+		
		'<div id="go_to_first_region"></div>'
	},
	{
		prestigePoints: 64000,
		region: 1,
		text: '' +
				'<div class="regions_text" id="regions_text_1"></div>' +
				'<div class="dev_log" style="display: none;"><b>Dev ramblings 1</b><br>' +
				'The idea for food combination system came to me while playing Autochess mod for Dota2, but it wasn\'t like this originally. <br>\
At first, I thought about creating a game with just items and materials in it. Like, a hammer would be "wood, metal, tool", a screwdriver would be "plastic, metal, tool", etc. I wanted something that could be easily recognized at a glance and guessed by a player. <br>\
But there were many problems with that approach: like, what would bicycle be? Metal, rubber... maybe also plastic... Should it be categorized as a transport or a sports accessory? Proffessional bycicles are made from carbon... and a seat could be from leather or synthetic materials. Should that count? <br>\
There were just not very many interesting combinations there. <br>\
Furthermore, most electronics would be just plastic and metal (and glass for the screen), most furniture is wood, etc. <br>\
So that idea got scrapped pretty quickly.' +
'<br><button class="button_dev_log" onClick="ToggleDevLog();">Dev Log</button>' +
		'<br></div>' +
		'<br>'		
	},
	{
		prestigePoints: 256000,
		region: 2,
		text: '' +
				'<div class="regions_text" id="regions_text_2"></div>' +
				'<div class="dev_log" style="display: none;"><b>Dev ramblings 2</b><br>' +
				'So then I thought more about possible items/categories stuff that could be easily recognizable and has interesting combinations and ended up with food as the best candidate.<br>\
That also reminded me of a story from some time ago. I was traveling by train and had a long stop at a train station, so I went to eat in a station\'s small restaurant. Didn\'t take too much cash with me so when I told my order and recounted my cash at hand, I was a little bit short.<br>\
So then I said to the kind lady that worked there "What would you recommend me to change in my order to fit my budget?". And I still remember noticing the enthusiasm and joy she had swapping positions in it. And she did an awesome job at that, even managed to fit a dessert in the end!<br>\
That made me even more sure about my decision to make a game about food.' +
'<br><button class="button_dev_log" onClick="ToggleDevLog();">Dev Log</button>' +
		'<br>	</div>' +
		'<br>'		
	},
	{
		prestigePoints: 2000000, 
		region: 3,
		text: '' +
				'<div class="regions_text" id="regions_text_3"></div>' +
				'<div class="dev_log" style="display: none;"><b>Dev ramblings 3</b><br>' +
				'Originally, I thought it would be fun (and easy) to use Unicode emoji as all dishes. It turned out it\'s more complicated than I thought - emojis didn\'t have many dishes I wanted and they have _a lot_ of problems with displaying on different browsers and OSes. So instead I searched high and low for purchasable asset packs with food. It is surprising how hard it is to find assets for games that are not pixel art! But hopefully, you like the ones I have now.' +
				'<br><button class="button_dev_log" onClick="ToggleDevLog();">Dev Log</button>' +
		'<br></div>' +
		'<br>'		
	},
	{
		prestigePoints: 16000000, 
		region: 4,
		text: '' +
				'<div class="regions_text" id="regions_text_4"></div>' +
				'<div class="dev_log" style="display: none;"><b>Dev ramblings 4</b><br>' +
				'Originally, buffs were not given on supercooks, but just added to the pool of food. There was also no limit as to how much you can stack them. You can imagine the level of randomness it introduced. <br> The problem with randomness in a game like this is that players can just restart the run if they got unlucky and I didn\'t want the game to turn into just "restart multiple times until you get what you want" kind of game.' +
				'<br><button class="button_dev_log" onClick="ToggleDevLog();">Dev Log</button>' +
		'<br></div>' +
		'<br>'		
	},
	{
		prestigePoints: 128000000, 
		region: 5,
		text: '' +
				'<div class="regions_text" id="regions_text_5"></div>' +
				'<div class="dev_log" style="display: none;"><b>Dev ramblings 5</b><br>' +
				'Once the game got long enough, it became a challenge to test the progression. Every small change to the core mechanics meant a lot of replaying the levels to ensure nothing became imbalanced. It\'s actually a bit random too: on the first release I missed a big slowdown in the beginning just because a couple of runs I made just happened to be too lucky for me to see it.<br>My solution - making a bot that plays the game at lightning-fast speed and tries to emulate the player. It wasn\'t easy to program all the game\'s interactions into it, but still easier than doing them all manually every time.<br>The bot\'s favorite foods are Pasta Salad and Pureed Veggie Soup.<br>It\'s not 100% accurate, but it gives me a good idea of which parts of the game are too slow and need rebalancing.'+
				'<br><button class="button_dev_log" onClick="ToggleDevLog();">Dev Log</button>' +
		'<br></div>' +		
		'<br>'		
	},
	{
		prestigePoints: 1*1000000000, 
		region: 6,
		text: '' +
				'<div class="regions_text" id="regions_text_6"></div>' +
				'<div class="dev_log" style="display: none;"><b>Dev ramblings 6</b><br>' +
				'One of the most eye-opening experiences for me while developing this game was when I paid random freelancers to record a video of them playing the first hour of the game.<br>Playing the game by yourself, you tend to forget that different people have different expectations from a game and different ways to learn it.<br>A lot of those freelance testers basically got stuck in the opening, because they kept swapping big dishes for small ones and using Dishwashing as their main activity. Also, I heard them asking about what\'s the goal of the game and what are they supposed to do next.<br>It took a complete rewriting of the game\'s opening, but in the end, I managed to make it so that even people who never played any idle games before could start progressing in the right direction from the get-go.' +
				'<br><button class="button_dev_log" onClick="ToggleDevLog();">Dev Log</button>' +
		'<br></div>' +
		'<br>'		
	},
	{
		prestigePoints: 8*1000000000, 
		region: 7,
		text: '' +
				'<div class="regions_text" id="regions_text_7"></div>' +
				'<div class="dev_log" style="display: none;"><b>Dev ramblings 7</b><br>' +
				'It tends to be hard to explain the concept of an idle game to a player who has no experience of this kind of games.<br>And it makes sense - the "traditional" concept of games revolves around giving players an opportunity to always stay active, to reward actions, and sometimes, even punish inactivity.<br>It doesn\'t help that many other restaurant-themed games (like Pappa\'s Pizzeria or Overcooked) are focused on fast time management, so some people come to this game having similar expectations. The word "Idle" in the title doesn\'t help much.<br>That\'s why you\'d see a lot of that explanation in the beginning of the game. Some may say it is excessive, but in reality, it\'s probably just right.' +
				'<br><button class="button_dev_log" onClick="ToggleDevLog();">Dev Log</button>' +
		'<br></div>' +
		'<br>'		
	},
	{
		prestigePoints: 64*1000000000, 
		region: 8,
		text: '' +
				'<div class="regions_text" id="regions_text_8"></div>' +
				'<div class="dev_log" style="display: none;"><b>Dev ramblings 8</b><br>' +
				'It tends to also be hard to explain the concept of an incremental game to a newcomer.<br>Players are used to having a "lose condition" in a game, some sort of "skill-check" that is supposed to punish those who don\'t pass it.<br>Not seeing a clear way to lose in the game makes some players worry that it is hidden from them. They start asking "what\'s the goal of the game?" to see a clear way to not lose.<br>Not being able to lose also makes many people question "what\'s the challenge then?" and come to the conclusion that there is none. Even though it could be seen as a great perseverance challenge to play the game for weeks.<br>At the end of the day, what solved it for me, was adding a line to the tutorial that the game could take weeks of real-time to finish. <i>Every</i> freelance playtester who read that line was vocally surprised about it. And it seems to have made them rethink their opinion on the game. ' +
				'<br><button class="button_dev_log" onClick="ToggleDevLog();">Dev Log</button>' +
		'<br></div>' +
		'<br>'		
	},
	{
		prestigePoints: 512*1000000000, 
		region: 9,
		text: '' +
				'<div class="regions_text" id="regions_text_9"></div>' +
				'<div class="dev_log" style="display: none;"><b>Dev ramblings 9</b><br>' +
				'The main idea behind Regions was trying to experiment more with "challenges" since I received a lot of positive feedback about them (and they are actually very fun to make).<br>The thing is, while variety is important, it is also important to not change the game too much. If the player has made it that far, that\'s probably because the main gameplay suits them well and changing it will always risk making it much worse for them.<br>Originally, I thought it would be a great idea to use Regions as a way to switch the type of progression in the game - instead of having to earn a certain number of Prestige Points, you\'d have to finish the challenges, and that\'s how you\'d progress forward and get to next part of the content.<br>And while it was possible and made sense, it just wasn\'t fun and was more of a frustrating experience. Like, starting a challenge and putting a lot of effort into it only to realize that you are not able to finish it on your level, ending up with a useless restaurant and a lot of resources spent. Or having to play the game actively when all you want is an idle experience. And also there would always be some percentage of players who will get completely stuck on a harder puzzle challenge, and just quit and don\'t get to experience the rest of the game\'s content.<br>So in the end the solution was to make region challenges optional, while still having a familiar progression mechanic as a base.' +
				'<br><button class="button_dev_log" onClick="ToggleDevLog();">Dev Log</button>' +
		'<br></div>' +
		'<br>'		
	},
	{
		prestigePoints: 4000*1000000000, 
		region: 10,
		text: '' +
				'<div class="regions_text" id="regions_text_10"></div>' +
				'<div class="dev_log" style="display: none;"><b>Dev ramblings 10</b><br>' +
				'This will be the last dev log for now. I got a lot of feedback about people liking to read these, but I can only write them when I have something interesting to say.<br>At least one of the players told me they actually dug deep into the game code to read these all at once, which was surprising and, I guess, high praise for my humble writing skills. :)<br><br>So, from the beginning, this was considered a True Idle game. And what I mean by that is that the game should not demand too much attention from the player during the day. Which, in part, means no profitable active/clicking mechanics.<br>Having a clicking mechanic that makes your progress much faster, in my opinion, is just a bad game design. Players will either use autoclickers or wear down their fingers, or they just will not use it, and feel bad that they can not progress at the intended speed.<br>This was the reason Dishwashing was originally made to only be good at the very start of the run, quickly becoming obsolete (as you\'d get a lot more money just by idling).<br>But the effect was the opposite - instead of comparing the Dishwashing income to Idle income (and choosing to ignore the Dishwashing), many players were still washing dishes (and regularly complaining in the comments that it doesn\'t give enough, but still not stopping). Seems like by spreading clicks over multiple buttons (to prevent autoclickers and finger damage) I have inadvertently made a mechanic that was entertaining enough on its own for a noticeable percentage of players. <br>But one thing stood out for me. Once I was searching the web to see mentions of my game and found a website that, amongst other things, provided a video "walkthrough" of my game. I was watching this 40-minute video where the author, clearly not knowing what else to do, just kept clicking dishwashing buttons, earning $300 game money for every 20 clicks (while earning tens of thousands every second from just idling)... and for some reason I just got this mental image of a kid, being frustrated, like, after arguing with their parents, just finding a random game on the internet and trying to just do something, click random buttons and stuff, while trying to keep themselves busy and work out their frustration.<br>And I thought "Well, my game is clearly not suitable for such situations, it wasn\'t intended to be. But wouldn\'t it be cool if it was, at least partially?". So I just made dishwashing scale with idle income. It still goes away later (at the point when it should become boring even for avid clicker fans) and it\'s still not really necessary for the progression, but now it can do a little bit more for some players. All the while, I hope, not destroying the idle feeling of the game too much.' +
				'<br><button class="button_dev_log" onClick="ToggleDevLog();">Dev Log</button>' +
		'<br></div>' +
		'<br>'		
	}
	
];

//Outer regions

for (let i = 0; i < 89; i++) {
	PROGRESS.push(
		{
			prestigePoints: 4000*1000000000*Math.pow(8,i+1), 
			region: i+11,
			text: '' +
					'<div id="regions_text_'+(i+11)+'"></div>' +
			'<br>'		
		}
	);
}	

PROGRESS.push(
	{
		prestigePoints: 4000*1000000000*Math.pow(8,89+1), 
		region: 89+11,
		text: 'This is the finish line.<br><br>' +
				'<div id="PingTheDev">Here is a button that you can press (if you want) to anonimously notify the dev that someone has got this far:<br>' + 
				'<button id="BtnPingTheDev" onClick="PingDev();">Ping the dev</button><br>' + 
				'This may not make the new content come faster, but it\'ll sure make the dev smile.</div><br>' +
				'<b>Thank you for playing!</b>' +
				'<div id="regions_text_'+(89+11)+'"></div>' +
		'<br>'		
	}
);
PROGRESS.push(
	{
		prestigePoints: Number.POSITIVE_INFINITY, 
		region: 90+11,
		text: 'You\'ve reached the infinity. No calculations could be done after this (at least with standard JS numbers.' +
				'<div id="regions_text_'+(90+11)+'"></div>' +
		'<br>'		
	}
);

const OUTER_REGIONS_DISHES = [
	'coconut_sweet_soup',
	'shrimp_pizza',
	'eggs_and_bacon',
	'takeaway_coffee',
	'udon',
	'french_fries',
	'cake_roll',
	'pizza',
	'caramel_apples',
	'meat_skewer',
	'mate_tea',
	'salmon_soup',
	'hamburger',
	'lobster',
	'lemonade',
	'poultry_legs',
	'icecream',
	'milkshake',
	'pureed_veggie_soup',
	'yoghurt',
	'egg_sandwich',
	'rice_ball',
	'local_soda',
	'waffles',
	'mojito',
	'skewer_set',
	'orange_juice',
	'khachapuri',
	'coffee',
	'banana_sandwich',
	'hotdog',
	'seasoned_fish',
	'steak',
	'tea',
	'crab',
	'onion_rings',
	'hot_chocolate',
	'fish_sticks',
	'assorted_macarons',
	'cured_salmon',
	'chicken_nuggets',
	'coconut_cocktail',
	'veggie_wrap',
	'roasted_chicken',
	'fish_bagel',
	'corndogs',
	'juice',
	'sushi_rolls',
	'blueberry_yoghurt',
	'hot_pot',
	'croissant',
	'beer',
	'vegan_pizza',
	'cotton_candy',
	'fusion_soup',
	'cherry_milkshake',
	'leg_ham',
	'sparkling_water',
	'pork_chops',
	'fruit_salad',
	'fried_fish',
	'popcorn',
	'wine',
	'sausages',
	'shrimps_n_chips',
	'salad',
	'doughnut',
	'oysters',
	'sausage_and_potatoes',
	'fish_soup',
	'sandwich',
	'pasta_salad',
	'pancakes',
	'lime_cocktail',
	'taiyaki',
	'grits',
	'tropical_cocktail',
	'taco',
	'cupcake',
	'noodles',
	'martini',
	'dumplings',
	'mixed_nuts',
	'cookies',
	'shrimp_tartlet',
	'vegan_cupcake',
	'pyttipanna',
	'shortcake',
	'cucumber_sandwich'
];

const OUTER_REGIONS_WORDS = [
	'coconut_sweet_soup',
	'7-6-3-2-6-5-5-6',
	'big_start_for_a_big_day',
	'6-4-1-6-8-7-5-3',
	'udon_even_know_how_good_it_is',
	'8-8-3-3-2-3-6-7',
	'also_known_as_swiss_roll_or_roulade',
	'6-5-5-5-7-4-3-5',
	'covered_thick_and_put_on_a_stick',
	'4-6-3-4-4-7-6-6',
	'also_known_as_chimarrao_or_cimarron',
	'6-6-6-4-3-6-5-4',
	'although_there_is_no_ham_in_it',
	'5-4-2-5-6-8-8-2',
	'when_life_gives_you_lemons',
	'8-6-8-4-2-6-5-1',
	'you_are_the_sweetest_and_the_coolest',
	'12-4-5-1-5-2-7-4',
	'when_you_want_a_fast_hearty_meal',
	'6-3-5-6-5-4-6-5',
	'good_for_breakfast_and_night_cravings',
	'6-7-5-8-5-8-6-5',
	'aka_pop_and_carbonated_drinks',
	'9-3-9-7-6-6-4-6',
	'rum_sugar_mint_lime_juice_and_soda_water',
	'7-4-5-3-6-10-8-7',
	'contains_a_lot_of_vitamin_c',
	'6-5-9-7-6-7-5-5',
	'words_cannot_espresso_what_you_bean_to_me',
	'5-7-5-7-7-9-4-6',
	'got_its_name_from_dachshunds_jokes',
	'10-5-7-4-5-7-8-4',
	'a_medium_where_anything_well_done_is_rare',
	'11-6-7-6-4-4-8-4',
	'you_cannot_teach_a_crab_to_walk_straight',
	'7-8-7-5-6-10-3-4',
	'cocoa_or_chocolate_milk_or_water_and_sugar',
	'7-7-4-5-9-9-5-4',
	'actually_very_different_from_macaroons',
	'8-8-5-6-5-7-6-5',
	'were_invented_in_the_nineteen_fifties_by_robert_c_baker',
	'7-10-7-8-9-7-6-6',
	'avg_person_eats_up_to_ten_tons_of_vegetables_in_a_lifetime',
	'8-6-7-8-7-10-7-7',
	'it_has_to_be_round_to_be_considered_a_bagel',
	'6-6-6-10-9-11-5-7',
	'with_some_cookies_to_sweeten_the_deal',
	'15-5-6-5-8-8-5-8',
	'maine_is_the_largest_producer_of_blueberries_in_the_world',
	'9-6-7-8-10-7-7-6',
	'straight_ones_are_made_with_butter_others_with_margarine',
	'8-8-6-11-6-6-7-8',
	'vegan_cheese_is_made_from_nuts_soy_or_other_products',
	'6-11-7-6-4-10-8-8',
	'fusion_cuisine_combines_traditions_from_different_countries',
	'10-5-8-6-7-10-8-6',
	'dry_curing_ham_could_take_up_to_one_or_two_years',
	'5-9-10-7-4-10-8-7',
	'could_be_cooked_by_roasting_grilling_or_frying',
	'11-7-8-10-8-4-4-8',
	'do_crabs_think_fish_are_flying',
	'13-9-10-6-6-11-8-7',
	'the_color_of_red_wine_comes_from_the_grape_skins',
	'13-5-5-13-14-7-9-4',
	'shrimp_has_ten_walking_legs_and_ten_swimming_legs',
	'8-9-7-12-9-11-9-5',
	'over_ten_billion_doughnuts_are_eaten_in_usa_yearly',
	'13-11-7-9-8-8-8-6',
	'sausages_are_mentioned_in_the_odyssey_almost_three_thousand_years_ago',
	'9-5-7-7-8-15-12-7',
	'over_twelve_billion_sandwiches_are_eaten_in_uk_yearly',
	'12-8-8-8-9-10-7-8',
	'the_worlds_biggest_pancake_was_forty_nine_feet_in_diameter',
	'7-5-6-12-8-13-11-8',
	'taiyaki_was_invented_in_tokyo_by_seijiro_kanbei',
	'11-9-6-7-9-11-13-4',
	'if_you_cant_get_to_paradise_bring_it_to_yourself',
	'8-5-6-15-12-8-9-7',
	'the_first_cupcake_was_mentioned_in_seventeen_nineties',
	'12-9-10-7-7-10-10-5',
	'gin_and_vermouth_with_an_olive_or_a_lemon_twist',
	'12-9-9-12-12-11-9-6',
	'peanut_almond_walnut_cashew_pistachio_pecan',
	'8-9-11-11-12-13-8-8',
	'tartlet_means_miniature_tart_perfect_for_a_shrimp',
	'15-8-11-7-10-12-9-8',
	'potatoes_onions_fried_egg_chopped_or_minced_meat',
	'12-7-10-10-13-12-7-9',
	'cucumber_sandwiches_were_served_in_victorian_era_england_with_tea'
];
