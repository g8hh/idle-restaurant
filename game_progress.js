const CHAPTERQTY = 18; // Number of chapters
const PROGRESS = [
	{
		prestigePoints: 0, 
		text: '<b>Chapter 1/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
				'You have finished your express training and ready to start.<br>\
It is going to be great!<br>'
	},
	{
		prestigePoints: 2, 
		text: '<b>Chapter 2/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'What a great start, some people actually came to your restaurant!<br>'+
		'They are buying, eating and drinking.<br>'+
		'And most importantly, enjoying it!<br>'+
		'Maybe there is a way to attract more customers?<br>'+
		'What about giving out coupons for a free meal from time to time?<br>'+
		'Should definitely try that.<br>'+
		'<br>'+
		'<i>Unlocks skill: Coupons</i>'
	},
	{
		prestigePoints: 10, 
		text: '<b>Chapter 3/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'Your dishes are good, as good as in any other restaurant.<br>' +
		'But that\'s the problem - they are exactly the same as in any other restaurant.<br>' +
		'What if you start improving your standard recipes by adding new original flavors?<br>' +
		'Sweet, sour, fresh or spicy - every dish has something good to add!<br>'+
		'<br>'+
		'<i>Unlocks skill: Buffs</i>'
	},
	{
		prestigePoints: 25, 
		text: '<b>Chapter 4/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'"Reading blogs and scrolling endless feeds of photos is not just slacking off.<br>'	+
		'Look, they have so many different dishes and drinks,<br>' +
		'we should totally try making some of them sometimes!<br>' +
		'And, yeah, working on this... err... project of taking notes of those<br>' +
		'will take me the rest of the day. And probably tomorrow too!"<br>'+
		'<br>'+
		'<i>Unlocks skill: Tier 3 Dishes</i>'
	},
	{
		prestigePoints: 30, 
		text: '<b>Chapter 5/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'Chef\'s secret technique:<br>' +	
		'Using both hands while cooking makes it easier and faster.<br>'+	
		'<br>'+
		'<i>Unlocks skill: Double Cook</i>'
	},
	{
		prestigePoints: 50, 
		text: '<b>Chapter 6/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'Prestige can\'t be silent, so why won\'t you start mentioning your success here and there?<br>'+
		'A blog post, an interview for a local newspaper, honestly, anything would do.<br>'+
		'Probably shouldn\'t do it too often so that people don\'t get too tired of it.<br>'+
		'Once a day should be fine.<br>'+
		'<br>'+
		'<i>Unlocks skill: Prestige Boosters</i>'
	},
	{
		prestigePoints: 70, 
		text: '<b>Chapter 7/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'Other restaurant owners started to notice your professionalism.<br>'+
		'They come to you asking for advice,<br>'+
		'some of them even offering you their restaurants to manage.<br>'+
		'This could be a great opportunity to get a head start<br>'+
		'when you want to move on to something new.<br>'+
		'Yay, no more dishwashing!<br>'+
		'<br>'+
		'<i>Unlocks skill: Starting Restaurants</i>'
	},
	{
		prestigePoints: 100, 
		text: '<b>Chapter 8/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'Hmm...<br>'+
		'How could you put even more flavors and decorations onto these dishes?<br>'+
		'Oh hey, what about having a bigger plates to support all that?<br>'+
		'That\'s genius!<br>'+
		'<br>'+
		'<i>Unlocks skill: Max Buff</i>'
	},
	{
		prestigePoints: 150, 
		text: '<b>Chapter 9/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'Reading random blog posts and articles about food could provide some good learning.<br>'+
		'Never know what you are going to learn next.<br>'+
		'Like that one post about a chinatown fish soup.<br>'+
		'In short: never trust a chinatown chef saying the dish is not too spicy.<br>'+
		'<br>'+
		'<i>Unlocks skill: Perks</i>'
	},
	{
		prestigePoints: 225, 
		text: '<b>Chapter 10/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'Chef\'s secret technique:<br>' +	
		'Write down your recipes and keep them around so you don\'t have to google them every time.<br>'+
		'<br>'+
		'<i>Unlocks skill: Triple Cook</i>'
	},
	{
		prestigePoints: 280, 
		text: '<b>Chapter 11/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'You feel confident enough in your abilities to try something new.<br>'+
		'Can you make a restaurant that fits specific criteria?<br>'+
		'Challenge accepted!<br>'+
		'<br>'+
		'<i>Unlocks skill: Challenges</i>'
	},
	{
		prestigePoints: 310, 
		text: '<b>Chapter 12/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'Your reputation grows so fast!<br>'+
		'Now even renown restaurant owners offer you their restaurants to manage.<br>'+
		'They trust you so much they are giving you full control now.<br>'+
		'It\'s time to show them what you are capable of!<br>'+
		'<br>'+
		'<i>Unlocks skill: Tier 2&nbsp;and&nbsp;3 starters</i>'		
	},
	{
		prestigePoints: 630, 
		text: '<b>Chapter 13/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'You have noticed that some dishes perform better than others.<br>'+
		'Wouldn\'t it be nice to have a special way to highlight them <br>'+
		'and bring even more attention to the best ones?<br>'+
		'"Dish of the day" banner will do just that.<br>'+
		'Even if it\'s the same dish every day!<br>'+
		'<br>'+
		'<i>Unlocks skill: Dish of the Day</i>'
	},
	{
		prestigePoints: 950, 
		text: '<b>Chapter 14/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'Chef\'s secret technique:<br>' +	
		'You can put labels on your sugar, salt, baking soda and flour cans so you don\'t have to identify them by taste every time.<br>'+
		'<br>'+
		'<i>Unlocks skill: Sextuple Cook</i>'
	},
	{
		prestigePoints: 1270, 
		text: '<b>Chapter 15/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'Now it\'s time for some experimenting!<br>'+
		'Those starter cafes will provide perfect test subjects<br>'+
		'for your new ideas in the culinary world.<br>'+
		'For science!<br>'+
		'<br>'+
		'<i>Unlocks skill: Science</i>'
	},
	{
		prestigePoints: 2000, 
		text: '<b>Chapter 16/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'You recently came up with a great idea:<br>'+
		'Since people are visiting restaurants to have a full meal<br>'+
		'why highlight only one dish of the day?<br>'+
		'Better make it meal of the day!<br>'+		
		'Food + dessert + drink = perfect balance.<br>'+		
		'<br>'+
		'<i>Unlocks skill: Meal of the Day</i>'
	},
	{
		prestigePoints: 3500, 
		text: '<b>Chapter 17/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'"Variety is the spice of life", as the common saying goes.<br>'+		
		'You feel inspired when you try new restaurant categories.<br>'+				
		'All the possibilities there are, all the combinations there could be!<br>'+				
		'Even your visitors notice that!<br>'+				
		'Better learn to keep track of it and employ it to make even better restaurants!<br>'+				
		'<br>'+
		'<i>Unlocks skill: Novelty Bonus</i>'
	},
	{
		prestigePoints: 7000, 
		text: '<b>Chapter 18/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'Now that you are on top of all charts, you don\'t really care about money anymore.<br>'+
		'This is an excellent time to make even more coupons.<br>'+
		'Free meals for everyone in need!<br>'+
		'Just got to find a better printer.<br>'+
		'<br>'+
		'<i>Unlocks skill: Faster Coupons</i>'
	},
	{
		prestigePoints: 9000, 
		text: '<b>CONGRATULATIONS!</b><br>' +
				'<br>' +
		'You\'ve finished the main part of the game!<br>'+
		'Your restaurant became the best in town and fed a lot of people.<br>'+
		'Now all is left is more upgrades and bigger numbers.<br>'+
		'If the game becomes popular enough, there sure will be more mechanics updates.<br>'+
		'For now, there will be just some dev ramblings you can unlock here.<br>'+
		'<br>'
	},
	{
		prestigePoints: 20000, 
		text: '<b>Dev ramblings 1</b><br>' +
				'The idea for food combination system came to me while playing Autochess mod for Dota2, but it wasn\'t like this originally. <br>\
At first I thought about creating a game with just items and materials in it. Like, a hammer would be "wood, metal, tool",  screwdriver would be "plastic, metal, tool", etc. I wanted something that could be easily recognized at a glance and guessed by a player. <br>\
But there were many problems with that approach: like, what would bycicle be? Metal, rubber... maybe also plastic... Should it be categorized as transport or a sport accessory? Proffessional bycicles are made from carbon... and a seat could be from leather or synthetic materials. Should that count? <br>\
There were just not very many interesting combinatios there. <br>\
Furthermore, most electronics would be just plastic and metal (and glass for the screen), most furniture is wood, etc. <br>\
So that idea got scrapped pretty quickly.' +
		'<br>'		
	},
	{
		prestigePoints: 200000, 
		text: '<b>Dev ramblings 2</b><br>' +
				'So then I though more about possible items/categories stuff that could be easily recognizeable and has interesting combinations and ended up with food as the best candidate.<br>\
That also reminded me of a story from some time ago. I was travelling by train and had a long stop at a train station, so I went to eat in a station\'s small restaurant. Didn\'t take too much cash with me so when I told my order and recounted my cash at hand, I was a little bit short.<br>\
So then I said to the kind lady that worked there "What would you recommend me to change in my order to fit my budget?". And I still remember noticing the enthusiasm and joy she had swapping positions in it. And she did an awesome job at that, even managed to fit a dessert in the end!<br>\
That made me even more sure about my decision to make a game about food.' +
		'<br>'		
	},
	{
		prestigePoints: 2000000, 
		text: '<b>Dev ramblings 3</b><br>' +
				'Originally, I though it would be fun (and easy) to use unicode emoji as all dishes. It turned out it\'s more complicated than I thought - emojis didn\'t have many dishes I wanted and they have _a lot_ of problems with displaying on different browsers and OSes. So instead I searched high and low for purchasable asset packs with food. You won\'t believe how hard it is to find assets for games that are not pixel art!' +
		'<br>'		
	},
	{
		prestigePoints: 20000000, 
		text: '<b>Dev ramblings 4</b><br>' +
				'Originally, buffs were not given on supercooks, but just added to the pool of food. There was also no limit as to how much you can stack them. You can imagine the level of randomness it introduced. <br> The problem with randomness in a game like this is that players can just restart the run if they got unlucky and I didn\'t want the game to turn into just "restart multiple times until you get what you want" kind of game. Same with starter restaurants. I probably should make a choice for science too when I have the time.' +
		'<br>'		
	},
	{
		prestigePoints: 200000000, 
		text: '<b>Dev ramblings 5</b><br>' +
				'The after-end game is kind of broken right now. If there will be some more content added, all the accounts will probably be reset back to 7k prestige points with some compensation. Still undecided.' +
		'<br>'		
	},
	{
		prestigePoints: 2000000000, 
		text: '<b>Dev ramblings 6</b><br>' +
				'This is the last one. I am really glad that even with all the problems I can tell now that this was a successfull game launch. Thank you for playing!' +
		'<br>'		
	}
];
