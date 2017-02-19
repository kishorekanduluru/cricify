function replaceSaces(y) 
{
	y=y.replace(/ - /g,"-");
	y =y.replace(/ /g,"-");
	return  y;
}
function removeAllOut(y) 
{
	y=y.replace(/-all out/g,"/10");	
	return  y;
}
var match_layout = {
	//header
	header:function(data){
		if((data.team1.fullName+" vs "+data.team2.fullName+" - "+data.matchdesc.split(",")[0]).length<42) {
			header_data = data.team1.fullName+" vs "+data.team2.fullName+" - "+data.matchdesc.split(",")[0]+"</div>";
		} else if((data.team1.shortName+" vs "+data.team2.shortName+" - "+data.matchdesc.split(",")[0]).length<42) {
			header_data = data.team1.shortName+" vs "+data.team2.shortName+" - "+data.matchdesc.split(",")[0]+"</div>";
		} else if((data.team1.fullName+" vs "+data.team2.fullName).length<42) {
			header_data = data.team1.fullName+" vs "+data.team2.fullName+"</div>";
		} else {
			header_data = data.team1.shortName+" vs "+data.team2.shortName+"</div>";
		}
		return header_data;
	},
	//follow_matches
	follow_matches:function(data){
		var	isCheckedData = " checked='checked' ";			
		if($.inArray(data.matchId + "",dontFollowMatches) >= 0){
			isCheckedData = "";
		} 				
		follow_matches_data = "<div id='mdesc'><input class='follow_match' type='checkbox' title='Receive alerts for this match' name='"+data.matchId+"' " + isCheckedData + " value='"+data.matchId+"' />";
		return follow_matches_data;
	},
	//url_layout
	url_layout:function(data){
		url_data = "<a href='http://live.cricbuzz.com/live/scorecard/" + data.matchId + "/" +replaceSaces(data.team1.fullName)+"-vs-"+replaceSaces(data.team2.fullName)+"-"+replaceSaces(data.matchdesc)+"?utm_source=crmext' target='_blank'>";
		return url_data;
	},
	//completematch_preview_layout
	completematch_preview_layout:function(data){
		var charlength=(data.team1.shortName+" vs "+data.team2.shortName).length;
		var font_size="font-size:24px;";
		if(charlength>12) {
			font_size="font-size:20px;" ;
		}
		preview_layout_data = "<div class='matchwrapper' style='border:1px solid #004466;'><div class='match_main_div' style='background-color:#004466'><div class='match_preview_div' style='"+font_size+"'>"+data.team1.shortName+" vs "+data.team2.shortName+"</div>"
		return preview_layout_data;
	},
	//preview_layout
	preview_layout:function(data){
		var charlength=(data.team1.shortName+" vs "+data.team2.shortName).length;
		var font_size="font-size:24px;";
		if(charlength>12) {
			font_size="font-size:20px;" ;
		}
		preview_layout_data = "<div class='matchwrapper' style='border:1px solid #7698a9;'><div class='match_main_div' style='background-color:#7698a9'><div class='match_preview_div' style='"+font_size+"'>"+data.team1.shortName+" vs "+data.team2.shortName+"</div>"
		return preview_layout_data;
	},
	//livematch_layout
	livematch_layout:function(data){
		if((data.type=="TEST")&&((data.BatTeam1stinnScore.runsAndWicket!=""&&data.BatTeam1stinnScore.runsAndWicket!="0/0")||(data.BowlTeam1stinnScore.runsAndWicket!=""&&data.BowlTeam1stinnScore.runsAndWicket!="0/0"))) {
			livematch_layout_data ="<div class='matchwrapper' style='border:1px solid #0096CC;'><div class='match_main_div' style='background-color:#0096CC'><div class='match_preview_div1'><div class='left_half_block'><div class='team_names'>"+data.battingTeamName+"</div><div style='margin-top: 0px;font-size:16px;'>"+data.displayBattingTeamScore+"</div></div><div class='right_half_block'><div class='team_names'>"+data.bowlingTeamName+"</div><div style='margin-top: 0px;font-size:16px;'>"+data.displayBowlingTeamScore+"</div></div></div>";
		}else {
			livematch_layout_data ="<div class='matchwrapper' style='border:1px solid #0096CC;'><div class='match_main_div' style='background-color:#0096CC'><div class='match_preview_div1'><div class='left_half_block'><div class='team_names'>"+data.battingTeamName+"</div><div style='margin-top: 0px;'>"+data.currentBatTeamScore.runsAndWicket+" <span class='overs' style='font-size:12px;' >"+data.currentBatTeamScore.overs+" ov</span></div></div>";
			if(data.currentBowlTeamScore.runsAndWicket!="0/0"&&data.currentBowlTeamScore.overs!="0") {
				livematch_layout_data +="<div class='right_half_block'><div class='team_names'>"+data.bowlingTeamName+"</div><div style='margin-top: 0px;'>"+data.currentBowlTeamScore.runsAndWicket+" <span class='overs' style='font-size:12px;' >"+data.currentBowlTeamScore.overs+" ov</span></div></div></div>";
			} else {
				livematch_layout_data +="<div class='right_half_block'><div class='team_names'>"+data.bowlingTeamName+"</div><div style=' margin-top: 0px;'>Yet to bat</div></div></div>";
			}
		}
		return livematch_layout_data;
	},
	//completematch_layout
	completematch_layout:function(data){
	
		if((data.type=="TEST")&&((data.BatTeam1stinnScore.runsAndWicket!=""&&data.BatTeam1stinnScore.runsAndWicket!="0/0")||(data.BowlTeam1stinnScore.runsAndWicket!=""&&data.BowlTeam1stinnScore.runsAndWicket!="0/0"))) {
			completematch_layout_data ="<div class='matchwrapper' style='border:1px solid #004466;'><div class='match_main_div' style='background-color:#004466'><div class='match_preview_div1'><div class='left_half_block'><div class='team_names'>"+data.battingTeamName+"</div><div style='margin-top: 0px; font-size:16px;'>"+data.displayBattingTeamScore+"</div></div><div class='right_half_block_forCompleted'><div class='team_names'>"+data.bowlingTeamName+"</div><div style='margin-top: 0px; font-size:16px;'>"+data.displayBowlingTeamScore+"</div></div></div>";
		}else {
			completematch_layout_data ="<div class='matchwrapper' style='border:1px solid #004466;'><div class='match_main_div' style='background-color:#004466'><div class='match_preview_div1'><div class='left_half_block'><div class='team_names'>"+data.battingTeamName+"</div><div style='margin-top: 0px;'>"+data.currentBatTeamScore.runsAndWicket+" <span class='overs' style='font-size:12px;' >"+data.currentBatTeamScore.overs+" ov</span></div></div>";
			if(data.currentBowlTeamScore.runsAndWicket!="0/0"&&data.currentBowlTeamScore.overs!="0") {
				completematch_layout_data +="<div class='right_half_block_forCompleted'><div class='team_names'>"+data.bowlingTeamName+"</div><div style='margin-top: 0px;'>"+data.currentBowlTeamScore.runsAndWicket+" <span class='overs' style='font-size:12px;' >"+data.currentBowlTeamScore.overs+" ov</span></div></div></div>";
			}  else {
				completematch_layout_data +="<div class='right_half_block_forCompleted'><div class='team_names'>"+data.bowlingTeamName+"</div><div style='margin-top: 0px;font-size:14px;'>Didn't bat</div></div></div>";
			}
		}
		return completematch_layout_data;
	},
	//status_layout
	status_layout:function(data){
		var	statusData = "";
		
		if(data.status) {statusData = data.status;}
		else if(data.toss.tossWinner && ((data.toss.tossWinner).length>12)) {statusData = data.toss.tossWinnerShortName+" won the toss and elected to "+data.toss.tossDecision;}
		else if(data.toss.tossWinner && ((data.toss.tossWinner).length<13)) {statusData = data.toss.tossWinner+" won the toss and elected to "+data.toss.tossDecision;}
		else { var  start_date=data.startdate.split(",")[0]; statusData = "Scheduled to start at "+data.starttime+" GMT ("+data.starttimeist +" IST) on "+start_date;}
		
		var charlength=statusData.length;
		var font_size="font-size:14px;";
		if(charlength>37) {
			font_size="font-size:12px;" ;
		}
		
		status_data = "<div class='match_status_div' style='"+font_size+"'>"+statusData+"</div></div></div></a>";
		return status_data;
	}
}
function show_matches() {
	
	//showBadge("W");
	$.getJSON(matchesURL, function(data) {
		var matchdata ="";
		//matchdata=data[0].seriesFolder;
		var i=0;
		for (i=0; i<data.length ;i++) {
			switch (data[i].state)
			{
				//During the match for ODI, T20 and test matches.
				case "inprogress":
				case "rain":
				case "badweather":
				case "badlight":
				case "dinner":
				case "drink":
				case "innings break":
				case "unforeseen":
				case "wetoutfield":
				//for Test matches
				case "lunch":
				case "stump":
				case "tea":
						matchdata+="<li>"
						
							matchdata+="<table class='table table_live'>"
								matchdata+="<tr>"
									matchdata+="<td class='table_td1'>"
										matchdata+=match_layout.follow_matches(data[i])
										matchdata+= match_layout.header(data[i])
									matchdata+="</td>"
								matchdata+="</tr>"
							matchdata+="</table>"
							
							matchdata+=match_layout.url_layout(data[i])
							matchdata+=match_layout.livematch_layout(data[i])
							matchdata+=match_layout.status_layout(data[i])
							
						matchdata+="</li>"
						break;
				//After match Complete (for ODI, T20 and test matches).
				case "complete":
				case "abandon":						
						matchdata+="<li>"
						
							matchdata+="<table class='table table_complete'>"
								matchdata+="<tr>"
									matchdata+="<td class='table_td1'>"
										matchdata+="<div id='mdesc'>"+match_layout.header(data[i])
									matchdata+="</td>"
								matchdata+="</tr>"
							matchdata+="</table>"
							
							matchdata+=match_layout.url_layout(data[i])
							if(data[i].displayBattingTeamScore=="")
								matchdata+=match_layout.completematch_preview_layout(data[i])
							else
								matchdata+=match_layout.completematch_layout(data[i])
								
						matchdata+=match_layout.status_layout(data[i])	
						matchdata+="</li>"
						break;
				//Before Match Start (for ODI, T20 and test matches).
				case "start":
				case "preview":
				case "delay":
						matchdata+="<li>"
						
							matchdata+="<table class='table table_preview'>"
								matchdata+="<tr>"
									matchdata+="<td class='table_td1'>"
										matchdata+=match_layout.follow_matches(data[i])
										matchdata+= match_layout.header(data[i])
									matchdata+="</td>"
								matchdata+="</tr>"
							matchdata+="</table>"
							
							matchdata+=match_layout.url_layout(data[i])
							matchdata+=match_layout.preview_layout(data[i])
							matchdata+=match_layout.status_layout(data[i])
							
						matchdata+="</li>"
						break;
				default:
				  break;
			} 
		};
		if(i==0) { 
			document.getElementById("matches").innerHTML ="<div>No Live matches</div>"; 
		} 
		else { 
				document.getElementById("matches").innerHTML ="<div id='demo1' class='flexslider'><ul class='slides'>"+matchdata+"</ul><div style='clear: both'></div></div>"; 				
				
				  $('.flexslider').flexslider({
					animation: "slide"
				  });

				setEventForFollowMatches();
		}	
	});
}

function show_news() {
	
	var backpage = chrome.extension.getBackgroundPage();
	$.getJSON(newsURL, function(data) {
		var newIds=new Array();
		var newones;						
		var i=0;
		for (i=0; i<5;i++) {	
			newIds[i]=parseInt(data.stories[i].id);
		}
		
		//newIds = newIds.sort();
		
		newones=backpage.getnewNews(newIds);
		backpage.hideBadge();

		var newsdata ="";
		
		for (i=0; i<5;i++) {
				newsdata += "<a href='" +data.stories[i].datapath+"' target='_blank'><div class='story_w_img'><img src='"+data.stories[i].img.ipath+"' width='"+Math.floor(data.stories[i].img.iwth*0.8)+"' height='"+Math.floor(data.stories[i].img.iht*0.8)+"' /><div class='description' id='"+data.stories[i].id+"'>"+data.stories[i].hline+" </div> </div></a> ";  							
			}
			
		document.getElementById("news").innerHTML =newsdata;
		if(newones[0]) {						
			for (var j=0; j<5;j++) {	
			document.getElementById(newones[j]).style.color="#000000";
			}
		}
		
		$('img').each(function() {
			var img = this;
			if (img.complete) {
				if (typeof img.naturalWidth != "undefined" && img.naturalWidth == 0) {
					$(img).attr('src', 'images/news_default.png');
				}
			} else {
				$(img).error(function() { 
					$(img).attr('src', 'images/news_default.png');
				});
			}
		});
		
	});
	
}

function setEventForFollowMatches(){
	$(".follow_match").live('change',function(){
		value = $(this).val();
		//alert(value);
		//document.getElementById('id_'+value).innerHTML ="un-follow"; 
		if($(this).attr('checked')){							
			//alert("checked");
			//dontFollowMatches = jQuery.grep(dontFollowMatches, function(value1) {  return value1 != value;});
			for(var i = dontFollowMatches.length; i>=0; i--){
				  if(dontFollowMatches[i]==value){
				   dontFollowMatches.splice(i,1);
				  }
			}
			localStorage['dontFollowMatches']  = JSON.stringify(dontFollowMatches);
			//alert(localStorage['dontFollowMatches']);
		} else {
			//alert("unchecked");				
			//document.getElementById('id_'+value).innerHTML ="follow"; 
			dontFollowMatches.push(value);
			localStorage['dontFollowMatches']  = JSON.stringify(dontFollowMatches);
			//alert(localStorage['dontFollowMatches']);
		}
	});
}

window.onload = function startFetching() {


		$('#options').hover(function() {
			this.src = "images/options1.png";
		}).mouseout(function() {
			this.src = "images/options.png";
		}) 

		if(localStorage["dontFollowMatches"]) {
			var strMatches = localStorage["dontFollowMatches"];
			dontFollowMatches = JSON.parse(strMatches);		
		}
		setTimeout(show_matches, 10);
		setTimeout(show_news, 10);
	  
}

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-312277-47']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();