const CHAPTERQTY = 18; // Number of chapters
const PROGRESS = [
	{
		prestigePoints: 0, 
		text: '<b>章节 1/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
				'你已经完成了快速训练,准备好开始了.<br>\
一切都很不错!<br>'
	},
	{
		prestigePoints: 2, 
		text: '<b>章节 2/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'这是一个很好的开始,真的有不少人来你的餐厅吃饭!<br>'+
		'他们购物,用餐和豪饮.<br>'+
		'最重要的是,享受它!<br>'+
		'也许有一种方法可以吸引更多的顾客?<br>'+
		'时不时地发放免费用餐优惠券怎么样?<br>'+
		'你一定要试试.<br>'+
		'<br>'+
		'<i>解锁技能: 优惠券</i>'
	},
	{
		prestigePoints: 10, 
		text: '<b>章节 3/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'你的菜做得很好,和其他餐馆一样好.<br>' +
		'但这就是问题所在 - 它们和其他任何餐馆的做法一模一样.<br>' +
		'如果你开始通过添加新的原味来改进你的标准食谱呢?<br>' +
		'甜,酸,鲜或辣 - 每一道菜有很好的补充!<br>'+
		'<br>'+
		'<i>解锁技能: 增益</i>'
	},
	{
		prestigePoints: 25, 
		text: '<b>章节 4/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'"阅读博客和无休止地滚动图片不仅仅是放松.<br>'	+
		'看,他们有很多不同的菜肴和饮料,<br>' +
		'有时候我们应该试着做一些!<br>' +
		'是的,正在努力...呃...做笔记的对象<br>' +
		'会占用我一整天的时间.也许明天也一样!"<br>'+
		'<br>'+
		'<i>解锁技能: 3阶菜肴</i>'
	},
	{
		prestigePoints: 30, 
		text: '<b>章节 5/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'厨师的秘密技巧:<br>' +	
		'用双手做饭会使它更容易更快.<br>'+	
		'<br>'+
		'<i>解锁技能: 双倍烹饪</i>'
	},
	{
		prestigePoints: 50, 
		text: '<b>章节 6/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'名望不能沉默,那你为什么不开始到处谈论你的成功呢?<br>'+
		'一篇博客文章,一份当地报纸的采访,老实说,什么都可以.<br>'+
		'也许不应该经常这样做,这样人们才不会厌倦.<br>'+
		'一天一次就可以了.<br>'+
		'<br>'+
		'<i>解锁技能: 重生助益</i>'
	},
	{
		prestigePoints: 70, 
		text: '<b>章节 7/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'其他餐馆老板开始注意到你的专业精神.<br>'+
		'他们来向你寻求建议,<br>'+
		'有些人甚至把他们的餐厅交给你管理.<br>'+
		'这可能是一个很好的机会,让你有一个好的开始<br>'+
		'你想做一些新的事情.<br>'+
		'耶,不用再洗碗了!<br>'+
		'<br>'+
		'<i>解锁技能: 初始餐馆</i>'
	},
	{
		prestigePoints: 100, 
		text: '<b>章节 8/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'呃...<br>'+
		'你怎么才能给这些菜增加更多的口味和装饰呢?<br>'+
		'哦,嘿,用一个更大的盘子来支撑这些怎么样?<br>'+
		'真是天才!<br>'+
		'<br>'+
		'<i>解锁技能: 增益上限</i>'
	},
	{
		prestigePoints: 150, 
		text: '<b>章节 9/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'随意阅读一些关于食物的博客和文章可以提供一些有益的学习.<br>'+
		'永远不知道你接下来要学什么.<br>'+
		'就像那个关于唐人街鱼汤的帖子.<br>'+
		'简而言之:永远不要相信唐人街的厨师会说这道菜不太辣.<br>'+
		'<br>'+
		'<i>解锁技能: 特权</i>'
	},
	{
		prestigePoints: 225, 
		text: '<b>章节 10/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'厨师的秘密技巧:<br>' +	
		'记下你的食谱,并把它们放在身边,这样你就不必每次都用谷歌.<br>'+
		'<br>'+
		'<i>解锁技能: 三倍烹饪</i>'
	},
	{
		prestigePoints: 280, 
		text: '<b>章节 11/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'你对自己的能力有足够的信心去尝试新事物.<br>'+
		'你能做出一个符合特定标准的餐厅吗?<br>'+
		'挑战已接受!<br>'+
		'<br>'+
		'<i>解锁技能: 挑战</i>'
	},
	{
		prestigePoints: 310, 
		text: '<b>章节 12/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'你的名声增长得这么快!<br>'+
		'现在,即使是有名的餐馆老板也会让你管理他们的餐馆.<br>'+
		'他们非常信任你,现在他们给你完全的控制权.<br>'+
		'是时候向他们展示你的能力了!<br>'+
		'<br>'+
		'<i>解锁技能: 2阶和3阶初始</i>'		
	},
	{
		prestigePoints: 630, 
		text: '<b>章节 13/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'你已经注意到有些菜比其他菜表现得更好.<br>'+
		'用一种特殊的方式来突出它们不是很好吗<br>'+
		'并把更多的注意力吸引到最好的那些?<br>'+
		'"当日菜"横幅就很不错.<br>'+
		'即使每天都是同一道菜!<br>'+
		'<br>'+
		'<i>解锁技能: 当日菜</i>'
	},
	{
		prestigePoints: 950, 
		text: '<b>章节 14/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'厨师的秘密技巧:<br>' +	
		'你可以在你的糖,盐,小苏打和面粉罐上贴上标签,这样你就不必每次都根据味道来识别它们了.<br>'+
		'<br>'+
		'<i>解锁技能: 六倍烹饪</i>'
	},
	{
		prestigePoints: 1270, 
		text: '<b>章节 15/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'现在是时候进行一些试验了!<br>'+
		'那些初级咖啡馆将提供完美的测试对象<br>'+
		'试验你在烹饪界的新想法.<br>'+
		'为了科学!<br>'+
		'<br>'+
		'<i>解锁技能: 科学</i>'
	},
	{
		prestigePoints: 2000, 
		text: '<b>章节 16/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'你最近想出了一个好主意:<br>'+
		'因为人们去餐馆吃一顿饱饭<br>'+
		'为什么只突出显示一个当日菜?<br>'+
		'为什么不能是一日之餐!<br>'+		
		'食物 + 甜品 + 饮料 = 完美的平衡.<br>'+		
		'<br>'+
		'<i>解锁技能: 一日之餐</i>'
	},
	{
		prestigePoints: 3500, 
		text: '<b>章节 17/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'俗话说得好,"变化是生活的调味品".<br>'+		
		'当你尝试新的餐厅类别时,你会感到灵感迸发.<br>'+				
		'所有的可能性,所有的组合!<br>'+				
		'甚至你的访客也注意到了这一点!<br>'+				
		'最好学会记录它,用它来打造更好的餐厅!<br>'+				
		'<br>'+
		'<i>解锁技能: 新奇奖励</i>'
	},
	{
		prestigePoints: 7000, 
		text: '<b>章节 18/' + CHAPTERQTY + '</b><br>' +
				'<br>' +
		'现在你在所有榜单上都名列前茅,你不再真正在乎钱了.<br>'+
		'现在是制作更多优惠券的好时机.<br>'+
		'每个有需要的人都可以免费吃饭!<br>'+
		'我要找个更好的打印机.<br>'+
		'<br>'+
		'<i>解锁技能: 电子优惠券</i>'
	},
	{
		prestigePoints: 9000, 
		text: '<b>祝贺你!</b><br>' +
				'<br>' +
		'你已经完成了游戏的主要部分!<br>'+
		'你的餐馆成了镇上最好的,招待了很多人.<br>'+
		'现在剩下的就是更多的升级和更大的数字.<br>'+
		'如果游戏足够受欢迎,肯定会有更多的机制更新.<br>'+
		'现在,只有一些开发上的问题你可以在这里解开.<br>'+
		'<br>'
	},
	{
		prestigePoints: 200000, 
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
		prestigePoints: 2000000, 
		text: '<b>Dev ramblings 2</b><br>' +
				'So then I though more about possible items/categories stuff that could be easily recognizeable and has interesting combinations and ended up with food as the best candidate.<br>\
That also reminded me of a story from some time ago. I was travelling by train and had a long stop at a train station, so I went to eat in a station\'s small restaurant. Didn\'t take too much cash with me so when I told my order and recounted my cash at hand, I was a little bit short.<br>\
So then I said to the kind lady that worked there "What would you recommend me to change in my order to fit my budget?". And I still remember noticing the enthusiasm and joy she had swapping positions in it. And she did an awesome job at that, even managed to fit a 甜品 in the end!<br>\
That made me even more sure about my decision to make a game about food.' +
		'<br>'		
	},
	{
		prestigePoints: 20000000, 
		text: '<b>Dev ramblings 3</b><br>' +
				'Originally, I though it would be fun (and easy) to use unicode emoji as all dishes. It turned out it\'s more complicated than I thought - emojis didn\'t have many dishes I wanted and they have _a lot_ of problems with displaying on different browsers and OSes. So instead I searched high and low for purchasable asset packs with food. You won\'t believe how hard it is to find assets for games that are not pixel art!' +
		'<br>'		
	},
	{
		prestigePoints: 200000000, 
		text: '<b>Dev ramblings 4</b><br>' +
				'Originally, buffs were not given on supercooks, but just added to the pool of food. There was also no limit as to how much you can stack them. You can imagine the level of randomness it introduced. <br> The problem with randomness in a game like this is that players can just restart the run if they got unlucky and I didn\'t want the game to turn into just "restart multiple times until you get what you want" kind of game. Same with starter cafes. I probably should make a choice for science too when I have the time.' +
		'<br>'		
	},
	{
		prestigePoints: 2000000000, 
		text: '<b>Dev ramblings 5</b><br>' +
				'The after-end game is kind of broken right now. If there will be some more content added, all the accounts will probably be reset back to 7k prestige points with some compensation. Still undecided.' +
		'<br>'		
	},
	{
		prestigePoints: 20000000000, 
		text: '<b>Dev ramblings 6</b><br>' +
				'This is the last one. I am really glad that even with all the problems I can tell now that this was a successfull game launch. Thank you for playing!' +
		'<br>'		
	}
];
