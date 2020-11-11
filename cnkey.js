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
	'Banana sandwich': '香蕉三明治',
	'Chicken nuggets': '鸡块',
	'Coffee': '咖啡',
	'Cupcake': '纸托蛋糕',
	'Eggs and bacon': '鸡蛋培根',
	'French fries': '炸薯条',
	'Hamburger': '汉堡包',
	'Local soda': '本地苏打',
	'Rice ball': '饭团',
	'Shrimp tartlet': '虾小果馅饼',
	'Sushi rolls': '寿司卷',
	'Yoghurt': '酸奶',
	'Exotic flavors': '异国风味',
	'Beer': '啤酒',
	'Cake roll': '蛋糕卷',
	'Crab': '螃蟹',
	'Croissant': '牛角包',
	'Fish soup': '鱼汤',
	'Fried fish': '炸鱼',
	'Hotdog': '热狗',
	'Icecream': '冰淇淋',
	'Lime cocktail': '酸橙鸡尾酒',
	'Mixed nuts': '混合坚果',
	'Mojito': '莫吉托',
	'Poultry legs': '家禽腿',
	'Popcorn': '爆米花',
	'Sandwich': '三明治',
	'Steak': '牛排',
	'Seasoned fish': '调味鱼',
	'Taco': '塔可',
	'Tea': '茶',
	'Vegan cupcake': '纯素纸杯蛋糕',
	'Wine': '葡萄酒',
	'Food decoration': '食品装饰',
	'Caramel apples': '焦糖苹果',
	'Cotton candy': '棉花糖',
	'Doughnut': '炸圈饼',
	'Fish bagel': '鱼百吉饼',
	'Egg sandwich': '鸡蛋三明治',
	'Juice': '果汁',
	'Martini': '马提尼',
	'Meat skewer': '肉串',
	'Milkshake': '奶昔',
	'Onion rings': '洋葱圈',
	'Oysters': '牡蛎',
	'Pizza': '披萨',
	'Roasted chicken': '烤鸡',
	'Shortcake': '薄饼',
	'Salad': '蔬菜色拉',
	'Shrimps n chips': '虾仁薯片',
	'Sparkling water': '起泡水',
	'Taiyaki': '鲷鱼烧',
	'Vegan pizza': '纯素披萨',
	'Original idea': '原始创意',
	'Fortune paper': '幸运纸',



    //原样
    '': '',
    '': '',

}


//需处理的前缀
var cnPrefix = {
    "": "",
}

//需处理的后缀
var cnPostfix = {
    "": "",
}

//需排除的，正则匹配
var cnExcludeWhole = [
    /^x?\d+(\.\d+)?[A-Za-z%]{0,2}(\s.C)?\s*$/, //12.34K,23.4 °C
    /^x?\d+(\.\d+)?(e[+\-]?\d+)?\s*$/, //12.34e+4
    /^\s*$/, //纯空格
    /^\d+(\.\d+)?[A-Za-z]{0,2}.?\(?([+\-]?(\d+(\.\d+)?[A-Za-z]{0,2})?)?$/, //12.34M (+34.34K
    /^(\d+(\.\d+)?[A-Za-z]{0,2}\/s)?.?\(?([+\-]?\d+(\.\d+)?[A-Za-z]{0,2})?\/s\stot$/, //2.74M/s (112.4K/s tot
    /^\d+(\.\d+)?(e[+\-]?\d+)?.?\(?([+\-]?(\d+(\.\d+)?(e[+\-]?\d+)?)?)?$/, //2.177e+6 (+4.01+4
    /^(\d+(\.\d+)?(e[+\-]?\d+)?\/s)?.?\(?([+\-]?(\d+(\.\d+)?(e[+\-]?\d+)?)?)?\/s\stot$/, //2.177e+6/s (+4.01+4/s tot
];
var cnExcludePostfix = [
    /:?\s*x?\d+(\.\d+)?(e[+\-]?\d+)?\s*$/, //12.34e+4
    /:?\s*x?\d+(\.\d+)?[A-Za-z]{0,2}$/, //: 12.34K, x1.5
]

//正则替换，带数字的固定格式句子
//纯数字：(\d+)
//逗号：([\d\.,]+)
//小数点：([\d\.]+)
//原样输出的字段：(.+)
var cnRegReplace = new Map([
    [/^Increases letters per click by (.+). Also gives the ability to manually generate letters.$/, '每次点击可将信件增加$1。还提供了手动生成信件的功能。'],
    [/^Increases letters per click by (.+). Also gives the ability to manually generate letters.$/, '每次点击可将信件增加$1。还提供了手动生成信件的功能。'],
    [/^Increases deliveries per click by 1 every (.+) seconds.$/, '每 $1 秒将每次点击的投放量提高1。'],
    [/^Generates 3 Pigeons every (.+) seconds at no cost.$/, '每 $1 秒免费产生3鸽子。'],
    [/^Delivers 1 letter every (.+) seconds.$/, '每 $1 秒发送1个信件。'],
    [/^Generates 1 letter every (.+) seconds.$/, '每 $1 秒产生1个信件。'],
    [/^Generates 1 Mailbox every (.+) seconds at no cost.$/, '每 $1 秒免费生成1个信箱。'],
    [/^Generates 1 Mailman and Factory every (.+) seconds at no cost.$/, '每 $1 秒免费产生1个邮递员和工厂。'],
    [/^Deliver 1 letter every (.+) seconds. Pigeons do not get more expensive.$/, '每 $1 秒发送1个信件。 鸽子不会变得更昂贵。'],
    [/^Deliveries per click multiplied by 2. If Bootstrap was selected in Phase 1 then the Boostrap increment will be multiplied by 2.$/, '每次点击的投放数乘以2。如果在阶段1中选择了引导程序，则引导程序的增量将乘以2。'],
    [/^workers: (\d+)\/$/, '工人：$1\/'],

]);