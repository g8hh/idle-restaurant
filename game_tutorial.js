let t = {}; // tutorial texts
t.greetings0 = {	text: 
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text" style="width: 140px; left: 45px;">哦,你好啊!</div>' +					
						'<button onClick="' + "v.tutorialLevel = 'greetings1';UpdateTutorial();" + '">' +
							'你好!' +
						'</button>' +
						
						'<button style="bottom: 65px; display: none;" onClick="' + "BypassTurorial();" + '">' +
							'Bypass' +
						'</button>' +
						
					'</div>',
					val: 0	
				};
t.greetings1 = 	{	text: 
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">我是厨师指导乔治,我会教导你基础的知识.<div style="height:10px;"></div>要开始运营你的餐馆,你得先弄些钱.</div>' +					
						'<button onClick="' + "v.tutorialLevel = 'greetings2';UpdateTutorial();" + '">' +
							'好' +
						'</button>' +
					'</div>',
					val: 1	
				};
t.greetings2 = 	{	text: 
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">你可以通过洗碗来挣到第一笔钱.<div style="height:10px;"></div>这工作可能很乏味,<br>但事实上,<br>你总得做点什么作为起步.</div>' +
						'<button onClick="' + 
							"v.tutorialLevel = 'dishwashing';" +
							"$('#game').fadeIn(500);" +
							"$('#main_menu').css('visibility','visible').fadeIn(500);" +
							"$('#money').css('visibility','visible').fadeIn(500);" +
							"UpdateTutorial();" +
							"$('#tutorial_box').fadeOut(500);" +
						'">' +
							'好吧' +
						'</button>'+
					'</div>',
					val: 2	
				};		
t.dishwashing = 	{	text: 
					'',
					val: 3	
				};
t.cooking0 = 	{	text: 
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">现在你有足够的钱烹饪点东西了.<div style="height:10px;"></div>在本教程中,我会让你进入这家餐厅.<div style="height:10px;"></div>用你所有的钱 <b>烹饪</b>你的第一道菜.</div>' +
					'</div>',
					val: 4	
				};
t.cooking1 = 	{	text:
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">是的,这些看起来不错!<div style="height:10px;"></div> <b>拖拽</b>他们到教程餐馆的菜单里.</div>' +						
					'</div>',					
					val: 5	
				};	
t.cooking2 = 	{	text:
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">餐馆菜单上的菜每秒钟都能让你赚到钱.<div style="height:10px;"></div>它们也可以随时更换.</div>' +
						'<button onClick="' + "v.tutorialLevel = 'cooking3'; UpdateTutorial();" + '">' +
							'好' +
						'</button>' +
					'</div>',					
					val: 6	
				};	
t.cooking3 = 	{	text:
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">餐厅菜单上的每一道菜都对同一类别的所有菜肴有加成.<div style="height:10px;"></div>海鲜加成海鲜,便宜加成便宜,等等.</div>' +
						'<button onClick="' + "v.tutorialLevel = 'cooking4'; UpdateTutorial();" + '">' +
							'好' +
						'</button>' +
					'</div>',					
					val: 7	
				};	
t.cooking4 = 	{	text:
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">我们需要多做点.</div>' +
						'<button onClick="' + "$('#tutorial_box').fadeOut(500);" + '">' +
							'好' +
						'</button>'+		
					'</div>',					
					val: 8	
				};				
t.combining0 = 	{	text:
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">你也可以把它们叠起来<br>(shift-点击).<br><img src="img/other/combine.png"></div>' +
							
					'</div>',					
					val: 9	
				};					
t.combined0 = 	{	text:
					'',					
					val: 10	
				};			

t.饮料s0 = 	{	text:
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">饮料非常重要.<div style="height:10px;"></div>拥有<b>至少一种饮料</b>会加倍你的收益.</div>' +
					'</div>',					
					val: 11	
				};
t.has饮料s0 = 	{	text:
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">饮料非常重要.<div style="height:10px;"></div>拥有<b>至少一种饮料</b>会加倍你的收益.</div>' +
						'<button onClick="' + 
							"v.tutorialLevel = 'has饮料s1';" +
							"UpdateTutorial();" +
						'">' +
							'好' +
						'</button>'+		
					'</div>',					
					val: 12	
				};				
t.has饮料s1 = 	{	text:
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">差不多就是这样了.你现在是一名合格的餐厅经理了.<div style="height:10px;"></div>现在你得到了标准的5插槽厨房和1000美元作为完成教程的奖励.<div style="height:10px;"></div>你应该能很好地投入到真正的游戏中去.</div>' +
						'<button onClick="' + 
							"v.tutorialLevel = 'has饮料s2';" +	

							"$('#kitchen .fooditem-wrapper, #storefront .fooditem-wrapper').each(" +
								"function() {" +
									"$(this).remove();" +									
								"}"+
							");"+
							
							"AddKitchenSlots(5);" +
							
							"AddStoreSlots(5);" +
							
							"v.refreshPrice = 300;" +
							
							"v.money = v.money + 1000;" +
							
							"$cookButton.prop('disabled', false);" +
							
							"setTimeout(function() {$('#btnFinishTutorial').click();},25000);" +
							
							"UpdateTutorial();" +
							"UpdateButtonsOnChange();" +
							"UpdateIncome();" +
						'">' +
							'好' +
						'</button>'+		
					'</div>',					
					val: 13	
				};	
t.has饮料s2 = 	{	text:
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">继续改进你的餐厅,以解锁更多新的工具和机器. <div style="height:10px;"></div>这将有助于你逐步把餐馆做得越来越好.</div>' +
						'<button id="btnFinishTutorial" onClick="' + 
							"v.tutorialLevel = 'finished0';" +
							"$('#info_button').fadeIn(500);" +
							"$('button.supercook').fadeIn(500);" +
							"$('button.new').fadeIn(500);" +
							"UpdateTutorial();" +
						'">' +
							'好' +
						'</button>'+		
					'</div>',					
					val: 14	
				};	
t.finished0 = 	{	text:
					'',					
					val: 15	
				};					
t.tierup0 = 	{	text:
					'',					
					val: 16	
				};	
t.idle0 = 	{	text:
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">干得好!你已经走上正轨了,坚持下去! <div style="height:10px;"></div>只要记住,你的旅程可能需要一个多星期才能完成.<div style="height:10px;"></div>游戏会自动保存,所以不用担心.</div>' +
						'<button id="btnFinishTutorial" onClick="' + 
							"v.tutorialLevel = 'idle1';" +						
							"UpdateTutorial();" +
						'">' +
							'好' +
						'</button>'+		
					'</div>',				
					val: 17	
				};	
t.idle1 = 	{	text:
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">这个游戏在任何时候都以100%的速度进行,即使它只是一个不活跃的浏览器标签. <div style="height:10px;"></div>不需要使它成为一个单独的窗口.</div>' +
						'<button id="btnFinishTutorial" onClick="' + 
							"v.tutorialLevel = 'idle2';" +						
							"UpdateTutorial();" +
						'">' +
							'好' +
						'</button>'+		
					'</div>',				
					val: 18	
				};		
t.idle2 = 	{	text:
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">甚至在你关闭它之后,它还可以离线运行.离线收益没有时间限制. <br>你可以随时回来取钱.<div style="height:10px;"></div> <b>这毕竟是一个放置游戏.<br>不需要你一直在游戏里.</b></div>' +
						'<button id="btnFinishTutorial" onClick="' + 
							"v.tutorialLevel = 'idle3';" +						
							"UpdateTutorial();" +
						'">' +
							'好' +
						'</button>'+		
					'</div>',				
					val: 19	
				};	
t.idle3 = 	{	text:
					'',					
					val: 20	
				};				
t.prestiged0 = 	{	text:
					'',					
					val: 21
				};				