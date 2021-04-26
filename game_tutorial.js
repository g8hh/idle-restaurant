let t = {}; // tutorial texts
t.greetings0 = {	text: 
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text" style="width: 140px; left: 45px;">Oh, hello there!</div>' +					
						'<button onClick="' + "v.tutorialLevel = 'greetings1';UpdateTutorial();" + '">' +
							'Hello!' +
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
						'<div class="text">I am George the Tutorial Chef and I\'ll guide you through the basics.<div style="height:10px;"></div> To start your restaurant you\'ll need to get some money first.</div>' +					
						'<button onClick="' + "v.tutorialLevel = 'greetings2';UpdateTutorial();" + '">' +
							'Ok' +
						'</button>' +
					'</div>',
					val: 1	
				};
t.greetings2 = 	{	text: 
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">You can earn your first money by washing dishes.<div style="height:10px;"></div> Not the most exciting job ever,<br> but well,<br> gotta start somewhere.</div>' +
						'<button onClick="' + 
							"v.tutorialLevel = 'dishwashing';" +
							"$('#game').fadeIn(500);" +
							"$('#main_menu').css('visibility','visible').fadeIn(500);" +
							"$('#money').css('visibility','visible').fadeIn(500);" +
							"UpdateTutorial();" +
							"$('#tutorial_box').fadeOut(500);" +
						'">' +
							'Alright' +
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
						'<div class="text">Now you have enough money to cook something.<div style="height:10px;"></div> I\'ll give you access to this restaurant for the time of this tutorial.<div style="height:10px;"></div> <b>Cook</b> your first dishes using the money you have.</div>' +
					'</div>',
					val: 4	
				};
t.cooking1 = 	{	text:
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">Yes, these look nice!<div style="height:10px;"></div> <b>Drag and drop</b> them to the tutorial restaurant\'s menu.</div>' +						
					'</div>',					
					val: 5	
				};	
t.cooking2 = 	{	text:
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">Dishes in restaurant menu earn you money every second.<div style="height:10px;"></div>They can also be replaced any time.</div>' +
						'<button onClick="' + "v.tutorialLevel = 'cooking3'; UpdateTutorial();" + '">' +
							'Ok' +
						'</button>' +
					'</div>',					
					val: 6	
				};	
t.cooking3 = 	{	text:
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">Every dish in restaurant menu gives bonus to all dishes of the same category.<div style="height:10px;"></div>Seafood gives bonus to seafood, cheap gives bonus to cheap, etc.</div>' +
						'<button onClick="' + "v.tutorialLevel = 'cooking4'; UpdateTutorial();" + '">' +
							'Ok' +
						'</button>' +
					'</div>',					
					val: 7	
				};	
t.cooking4 = 	{	text:
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">We need to cook more.</div>' +
						'<button onClick="' + "$('#tutorial_box').fadeOut(500);" + '">' +
							'Ok' +
						'</button>'+		
					'</div>',					
					val: 8	
				};				
t.combining0 = 	{	text:
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">You can stack them too <br>(shift-click).<br><img src="img/other/combine.png"></div>' +
							
					'</div>',					
					val: 9	
				};					
t.combined0 = 	{	text:
					'',					
					val: 10	
				};			

t.drinks0 = 	{	text:
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">Drinks are very important.<div style="height:10px;"></div>Having <b> at least one drink</b> will double your income.</div>' +
					'</div>',					
					val: 11	
				};
t.hasdrinks0 = 	{	text:
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">Drinks are very important.<div style="height:10px;"></div>Having <b> at least one drink</b> will double your income.</div>' +
						'<button onClick="' + 
							"v.tutorialLevel = 'hasdrinks1';" +
							"UpdateTutorial();" +
						'">' +
							'Ok' +
						'</button>'+		
					'</div>',					
					val: 12	
				};				
t.hasdrinks1 = 	{	text:
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">That\'s pretty much it. You are now a certified restaurant manager.<div style="height:10px;"></div> Now you get standard 5-slot kitchen and $1000 for finishing the tutorial.<div style="height:10px;"></div> You should be good to go into the real game.</div>' +
						'<button onClick="' + 
							"v.tutorialLevel = 'hasdrinks2';" +	

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
							'Ok' +
						'</button>'+		
					'</div>',					
					val: 13	
				};	
t.hasdrinks2 = 	{	text:
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">Keep on improving your restaurant to unlock many more new tools and mechanics. <div style="height:10px;"></div>This will help you gradually make better and better restaurants.</div>' +
						'<button id="btnFinishTutorial" onClick="' + 
							"v.tutorialLevel = 'finished0';" +
							"$('#info_button').fadeIn(500);" +
							"$('button.supercook').fadeIn(500);" +
							"$('button.new').fadeIn(500);" +
							"UpdateTutorial();" +
						'">' +
							'Ok' +
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
						'<div class="text">Good job! You are on your way, keep it up! <div style="height:10px;"></div>Just keep in mind that your journey may take longer than a week to finish.<div style="height:10px;"></div> The game saves automatically, so don\'t worry about that.</div>' +
						'<button id="btnFinishTutorial" onClick="' + 
							"v.tutorialLevel = 'idle1';" +						
							"UpdateTutorial();" +
						'">' +
							'Ok' +
						'</button>'+		
					'</div>',				
					val: 17	
				};	
t.idle1 = 	{	text:
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">This game progresses at 100% speed at all times even when it\'s just an inactive tab of your browser. <div style="height:10px;"></div>No need to make it a separate window.</div>' +
						'<button id="btnFinishTutorial" onClick="' + 
							"v.tutorialLevel = 'idle2';" +						
							"UpdateTutorial();" +
						'">' +
							'Ok' +
						'</button>'+		
					'</div>',				
					val: 18	
				};		
t.idle2 = 	{	text:
					'<div class="tutorial">' +
						'<img class="cook" src="img/other/cook.png">' +
						'<div class="text">It even works offline, after you close it. There is no time limit for offline earnings. <br>You can come back any time to collect your money.<div style="height:10px;"></div> <b>This is an idle game after all.<br> It\'s not supposed to be played in one sitting.</b></div>' +
						'<button id="btnFinishTutorial" onClick="' + 
							"v.tutorialLevel = 'idle3';" +						
							"UpdateTutorial();" +
						'">' +
							'Ok' +
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