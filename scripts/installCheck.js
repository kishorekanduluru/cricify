var liveMatchStates = ["inprogress","rain","badweather","badlight","dinner","drink","innings break","unforeseen","wetoutfield","lunch","stump","tea"]
var completedMatchStates = ["complete","abandon"]
var nextMatchStates = ["start","preview","delay"]

var liveAccordionData="Loading please wait"
var liveScoreData=""
var matches_data = {}
var prevOversData = {}
var scoreCardData = {}
var fullScreenData=""
var news_data = {}
var activeTab="tab1";
var tabs={};
var matches=new Array();

var timerM;
var timerN;
var timerA;



var oldNews=new Array();
var oldAlert_time="0000000000";
var dontFollowMatches = new Array();
var scoreInterval = null;
var nowMatches=new Array();
var nowAlert;
var reloadTime = 1000 * 10;

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

//var genericBase = "http://www.cricbuzz.com/statsbuzz/getgeneric?url=";
//var matchesURL = "http://webclient.cricbuzz.com/includes/indiatoday/livecricketscore/web-client-match-details.json";
//var genericBase = "http://sample.anand.cricbuzz.dev/cricbuzz/crossdomain.php?url=";

var matchesURL = "https://synd.cricbuzz.com/cricbuzz/livecricketscore/chrome-details.json";
var newsURL = "https://mapps.cricbuzz.com/cricbuzz/rss/latest_news.json";
var alertsURL = "https://sms.cricbuzz.com/chrome/alert.json"; 
var optionsURL = "https://sms.cricbuzz.com/chrome/options.json";

$(window).load(function() {
	var activeTab="tab1";
	var type="tab1";
	chrome.storage.sync.get(null, function(items) {
    // var allKeys = Object.keys(items);
		if(items["activeTab"]=="League"){
			activeTab="tab2";
		}
		if(items["type"]=="Results"){
			type="tab2";
		}
		if(items["type"]=="Schedule"){
			type="tab3";
		}
		var insightlySidebar;
		addContainer();
		addMatchSlider();
		addTabs(activeTab,type);
		setInterval(liveAccordion,10000,"International", "live");
	});
	
});

function addContainer(){
	insightlySidebar = $("<div id='insightlySidebar' class='collapsed insightly-sidebar'></div>");
	
	insightlySidebar.css({
		'margin-top': '108px',
		'height': '125px',
		'bottom': 'auto',
		'position': 'absolute',
		'right': '0px',
		'top': '0px',
		'z-index': 9999,
		'width': '300px',
		'height': '100%',
		'overflow-y' :'auto',
		'color': 'rgb(51, 51, 51)',
		'background-color': 'rgb(241, 241, 241)'
	});
	$('body').append(insightlySidebar);
}

function addMatchSlider(){
	var theDiv = document.getElementById("insightlySidebar");
	var newNode = document.createElement('div');    
	newNode.id='slide-bar';
	theDiv.appendChild(newNode);
	fetchMatches();
	showMatches();
}

function addTabs(activeTab,type){
	var theDiv = document.getElementById("insightlySidebar");
	var newNode = document.createElement('div');    
	newNode.id='cric-container';
	theDiv.appendChild(newNode);
	document.getElementById("cric-container").innerHTML = insertTabs();
	addEventsListener();
	activateZozoPlugin(activeTab,type);
}

function activateZozoPlugin(activeTab,type){
	
	$("#tabbed-nav").zozoTabs({
		 rounded: false,
		 multiline: true,
		 theme: "white",                
		 size: "mini",
		 responsive: true,
		 animation: {
				 effects: "slideH",
				 easing: "easeInOutCirc",
				 type: "jquery"
		 },
		 defaultTab: activeTab
	});
		
/* jQuery activation and setting options for nested tabs with class selector*/
 $(".nested-tabs").zozoTabs({
			 position: "top-left",
			 theme: "red",
			 style: "underlined",
			 size: "mini",
			 rounded: false,
			 shadows: false,
			 orientations: "vertical",
			 animation: {
					 easing: "easeInOutCirc",
					 effects: "slideV"
			 },
			 defaultTab: type,
			 size: "medium"
	 });
		
 $("#demo-accordion").zozoAccordion({
				theme: "lightblue",
				rounded: true,
				active: 1,
				orientation: "vertical",
				showIcons: true,
				headerSize: 42,
				sectionSpacing: 0
		});
	
}

function insertTabs(){
	liveAccordion("International", "live");
	tabs = ""
	tabs+="<div id='tabbed-nav'>"
	tabs+="<ul>"
	tabs+="<li><a>International</a></li>"
	tabs+="<li><a>League</a></li>"
	tabs+="</ul>"
	tabs+="<div><div class='z-content-pad'>"
	tabs+="<div class='nested-tabs'>"
	tabs+="<ul>"
	tabs+="<li><a>Live</a></li>"
	tabs+="<li><a>Results</a></li>"
	tabs+="<li><a>Schedule</a></li>"
  tabs+="</ul>"
	tabs+="<div>"
	tabs+="<div>"
	tabs+=liveAccordionData;
	tabs+="</div>"
	tabs+="<div><h4>Results</h4><p><a href=''>Results coming up</a></p>"
	tabs+="</div>"
	tabs+="</div></div></div>"
	tabs+="<div><h4>10 Preset themes</h4><ul class='icons'><li>White</li>"
	tabs+="<li>Crystal</li><li>Silver</li><li>Gray</li></ul></div></div></div>"
 return tabs;
 }

function liveAccordion(type, state) {
	var matches_ = [];
	var states_ = [];
	$.ajax({
		url: matchesURL,
		async: false
	}).done(function(data) {
		states_ = findStates(state);
		for (var i=0; i<data.length ;i++) {
			if($.inArray(data[i].state, states_)!=-1 && data[i].matchType==type){
		  	matches_.push(data[i]);
			}
	  }
		liveAccordionData = liveDetails(matches_);
	});
	
}
 
function showMatches() {
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
										matchdata+=match_layout.followMatches(data[i])
										matchdata+= match_layout.header(data[i])
									matchdata+="</td>"
								matchdata+="</tr>"
							matchdata+="</table>"
							
							matchdata+=match_layout.urlLayout(data[i])
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
							
							matchdata+=match_layout.urlLayout(data[i])
							if(data[i].displayBattingTeamScore=="")
								matchdata+=match_layout.completematchPreviewLayout(data[i])
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
										matchdata+=match_layout.followMatches(data[i])
										matchdata+= match_layout.header(data[i])
									matchdata+="</td>"
								matchdata+="</tr>"
							matchdata+="</table>"
							
							matchdata+=match_layout.urlLayout(data[i])
							matchdata+=match_layout.preview_layout(data[i])
							matchdata+=match_layout.status_layout(data[i])
							
						matchdata+="</li>"
						break;
				default:
				  break;
			} 
		};
		if(i==0) {
			document.getElementById("slide-bar").innerHTML ="<div>No Live matches</div>"; 
		} 
		else { 
				document.getElementById("slide-bar").innerHTML ="<div id='demo1' class='flexslider'><ul class='slides'>"+matchdata+"</ul><div style='clear: both'></div></div>";
        document.getElementById("slide-bar").style="padding:0px 5px 5px 5px";
				  $('.flexslider').flexslider({
					animation: "slide"
				  });
  
		}	
	});
}

function fetchMatches() {

	$.getJSON(matchesURL, function(data) {
		if(timerM) { clearTimeout(timerM); }			
		timerM = setTimeout(fetchMatches, reloadTime);
		var  setNewTitle="";			
			
		$(data).each(function(){
			nowMatches.push(this.matchId);
			var currentBatTeamScore_value = "";				
			var total_wickets = 0;
			if (this.currentBatTeamScore != null) {
				currentBatTeamScore_value = this.battingTeamName+": "+this.currentBatTeamScore.runsAndWicket+" <span id='ovs'>("+this.currentBatTeamScore.overs+" Ovs)<span>";
				var wktsl = this.currentBatTeamScore.runsAndWicket.split("/")[1]; 
				if ( wktsl)
					total_wickets = wktsl[1];
				if(this.displayBattingTeamScore != ""){
						setNewTitle+=this.team1.shortName+" vs ";
						setNewTitle+=this.team2.shortName+": ";
						
						if(this.status) setNewTitle+=this.status;
						else if(this.toss) setNewTitle+=this.toss.tossWinner+" won the toss and elected to "+this.toss.tossDecision;
						else setNewTitle+=this.state;							
						
						setNewTitle+="\n";
						setNewTitle+=this.battingTeamName+": ";
						setNewTitle+=displayBattingTeamScore=this.displayBattingTeamScore;
						if(this.displayBowlingTeamScore != ""){
							setNewTitle+=" & "+this.bowlingTeamName+": ";
							setNewTitle+=this.displayBowlingTeamScore;
						}
						setNewTitle+="\n";
						setNewTitle+="\n";
				}				
			}
		})
			
			

	});

}

function scoreCard(matchId){
	var result = "";
	var sc, $sc, rc, $rc, fullScreen, recentOvers, scoreCard, values;
	score_url = "https://www.cricbuzz.com/match-api/"+matchId+"/commentary.json"
	$.ajax({
		url: score_url,
		async: false
	}).done(function(data) {
		sc 	= "score_card"+data.id;
		$sc = $('#'+sc);
		rc 	= "recent_overs"+data.id
		$rc = $('#'+rc);
		fullScreen = "full_screen"+data.id;
		debugger;
		recentOvers = match_layout.recent_overs(data);
		scoreCard = match_layout.scorecard(data);
		
		values = typeof recentOvers !== 'undefined' ? recentOvers : '';
		
		if($sc.length){
			fullScreenData = scoreCard;
			$sc.html(scoreCard);
			if($rc.length){
				fullScreenData+="<div id="+rc+">"+recentOvers+"</div>"
				$rc.html(recentOvers);
			}	
		}
		else{
		  liveScoreData=""
			liveScoreData="<div id="+sc+">"+scoreCard+"</div>";
			if(values.length>0){
				liveScoreData+="<div id="+rc+">"+recentOvers+"</div>"
				fullScreenData = liveScoreData;
				liveScoreData+="<div><button type='button' id="+fullScreen+">"
				liveScoreData+="FullScreen</button><div>"
			}
			$("div[id_="+data.id+"]").html(liveScoreData);
		}
	});
}

function addEventsListener(){
	var myLi=document.querySelectorAll('#tabbed-nav>ul>li>a');
	for(i=0;i<myLi.length;i++){
	 myLi[i].addEventListener('click', eventListner,false);
	}
	var nestedEle=document.querySelectorAll(".nested-tabs>ul.z-tabs-nav.z-tabs-desktop>li>a");
	for(i=0;i<nestedEle.length;i++){
	 nestedEle[i].addEventListener('click', nestedEventListner,false);
	}
	var accordion=document.querySelectorAll("ul#demo-accordion>li");
	for(i=0;i<accordion.length;i++){
	 accordion[i].addEventListener('click', accordionEventListner,false);
	}
}

function eventListner(){
	chrome.storage.sync.set({'activeTab': $(this).text()}, function() {
	  });
}

function nestedEventListner(){
	chrome.storage.sync.set({'type': $(this).text()}, function() {});
}

function accordionEventListner(){
	clearInterval(scoreInterval);
	scoreCard($(this).attr("id_"));
	document.getElementById("full_screen"+$(this).attr("id_")+"").addEventListener('click', fullScreenEventListner,false);
	scoreInterval = setInterval(scoreCard,10000,$(this).attr("id_"));
	chrome.storage.sync.set({'accordion': $(this).text()}, function() {});
}

function fullScreenEventListner(){
	$("<div id='fullscreen'>"+fullScreenData+"<div><span id='close_fullscreen'>x</span></div></div>").css({
	    position: "absolute",
	    width: "100%",
	    height: "100%",
	    top: 0,
	    left: 0,
			zIndex: 9999,
			backgroundColor: 'red'
	}).appendTo($("#tabbed-nav").css("position", "relative"));
	document.getElementById("close_fullscreen").addEventListener('click', fullScreenCloseEventListner,false);
}

function fullScreenCloseEventListner(){
	$("#fullscreen").remove();
}

function liveDetails(matches_){
	var accr = " "
	if(matches_.length > 0){
		accr+="<ul id='demo-accordion'>"
		for(var i=0;i<matches_.length;i++) {
			accr+="<li id_="+matches_[i].matchId
			accr+=">"
			accr+="<h3>"
			accr+=matches_[i].battingTeamName
			accr+= " "
			accr+=matches_[i].displayBattingTeamScore
			accr+= " VS "
			accr+=matches_[i].bowlingTeamName
			accr+= " "
			accr+=matches_[i].displayBowlingTeamScore
			accr+="</h3>"
			accr+="<div id_="+matches_[i].matchId
			accr+=">"
			accr+=liveScoreData
			accr+="</div></li>"
		}
		accr+="</ul>"
	}else{
		accr+="<div>"
		accr+="No Live matches"
		accr+="</div>"
	}
	return accr;
}

function findStates(state){
	var result = [];
	if(state == "live"){
	  result = liveMatchStates;
	}
	else if(state == "complete"){
	  result = completedMatchStates;
	}
	else if(state == "next"){
	  result = nextMatchStates;
	}
	return result;
}

function showBallByCoverage(data){
	// score_url = "https://www.cricbuzz.com/match-api/"+matchId+"/commentary.json"
	// $.getJSON(score_url, function(data) {
	// $("<div id='recent_overs'>"+match_layout.live_scorecard(data)+"</div>" ).insertAfter( "#score_card" );
	// });
	var str= "recent_overs"+data.id
  var $bbc = $('#'+str);
	if($bbc.length){
		$bbc.html(match_layout.recent_overs(data));
	}
	else{
		var div_ = "<div id="+str+">"+match_layout.recent_overs(data)+"</div>"
		$(div_).insertAfter( "#"+"score_card"+data.id);
	}
	
}

function getMatches(type,state){
	var matches_ = [];
	var states_ = [];
  states_ = findStates(state);
	$.ajax({
		url: matchesURL,
		async: false
	}).done(function(data) {
		for (var i=0; i<data.length ;i++) {
			if($.inArray(data[i].state, states_)!=-1){
		  	matches_.push(data[i]);
			}
	  }
		var accr = " "
		if(matches_.length > 0){
			accr+="<ul id='demo-accordion'>"
			for(var i=0;i<matches_.length;i++) {
				scoreCard(matches_[i].matchId);
				accr+="<li><h3>"
				accr+=matches_[i].battingTeamName
				accr+= " "
				accr+=matches_[i].displayBattingTeamScore
				accr+= " VS "
				accr+=matches_[i].bowlingTeamName
				accr+= " "
				accr+=matches_[i].displayBowlingTeamScore
				accr+="</h3>"
				accr+="<div>"
				accr+=liveScoreData
				accr+="</div></li>"
			}
			accr+="</ul>"
		}else{
			accr+="<div>"
			accr+="No Live matches"
			accr+="</div>"
		}
		liveAccordionData=accr;
	});
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
	followMatches:function(data){
		var	isCheckedData = " checked='checked' ";			
		if($.inArray(data.matchId + "",dontFollowMatches) >= 0){
			isCheckedData = "";
		} 				
		follow_matches_data = "<div id='mdesc'><input class='follow_match' type='checkbox' title='Receive alerts for this match' name='"+data.matchId+"' " + isCheckedData + " value='"+data.matchId+"' />";
		return follow_matches_data;
	},
	//url_layout
	urlLayout:function(data){
		url_data = "<a href='http://live.cricbuzz.com/live/scorecard/" + data.matchId + "/" +replaceSaces(data.team1.fullName)+"-vs-"+replaceSaces(data.team2.fullName)+"-"+replaceSaces(data.matchdesc)+"?utm_source=crmext' target='_blank'>";
		return url_data;
	},
	//completematchPreviewLayout
	completematchPreviewLayout:function(data){
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
	
	scorecard:function(data){
		var batsman = [];
		var striker, non_striker;
		striker = $(data.score.batsman).filter(function (i,n){
       return n.strike==1;
    });
		non_striker = $(data.score.batsman).filter(function (i,n){
       return n.strike==0;
    });
			scoreCardData = ""
 		 	scoreCardData+="<table class='table table_live score_card'>"
			scoreCardData+="<tr>"
			scoreCardData+="<th>Batsman</th>"
			scoreCardData+="<th>R</th>"
   		scoreCardData+="<th>B</th>"
			scoreCardData+="<th>4s</th>"
			scoreCardData+="<th>6s</th>"
			scoreCardData+="<th>SR</th>"
 			scoreCardData+="</tr>"
 		 	scoreCardData+="<tr>"
			if(striker.length > 0){
				var player1 = $(data.players).filter(function (i,n){
					return striker.length>0 && n.id == striker[0].id 
				});
				striker[0].name = player1[0].name
				striker[0].strike_rate = striker[0].b>0 ? ((striker[0].r/striker[0].b)*100).toFixed(2) : 0
				batsman.push(striker[0]);
				scoreCardData+="<td>"+batsman[0].name+"</td>"
				scoreCardData+="<td>"+batsman[0].r+"</td>"
	 			scoreCardData+="<td>"+batsman[0].b+"</td>"
				scoreCardData+="<td>"+batsman[0]["4s"]+"</td>"
				scoreCardData+="<td>"+batsman[0]["6s"]+"</td>"
				scoreCardData+="<td>"+batsman[0].strike_rate+"</td>"
	 			scoreCardData+="</tr>"
				scoreCardData+="<tr>"
			}
			if(non_striker.length > 0){
				var player2 = $(data.players).filter(function (i,n){
					return n.id == non_striker[0].id
				});
				non_striker[0].name = player2[0].name
				non_striker[0].strike_rate = non_striker[0].b>0 ? ((non_striker[0].r/non_striker[0].b)*100).toFixed(2) : 0
				batsman.push(non_striker[0]);
	 			scoreCardData+="<td>"+non_striker[0].name+"</td>"
				scoreCardData+="<td>"+non_striker[0].r+"</td>"
	 			scoreCardData+="<td>"+non_striker[0].b+"</td>"
				scoreCardData+="<td>"+non_striker[0]["4s"]+"</td>"
				scoreCardData+="<td>"+non_striker[0]["6s"]+"</td>"
				scoreCardData+="<td>"+non_striker[0].strike_rate+"</td>"
				
	 			scoreCardData+="</tr>"
	 		  scoreCardData+="</table>"
			}	
 		return scoreCardData;
	},
	
	recent_overs:function(data){
		prevOversData = ""
		var prevOvers, values;
		prevOvers = data.score.prev_overs
		values = typeof prevOvers !== 'undefined' ? prevOvers : '';
		if(values.length>0){
			 prevOversData+="<table class='table table_live'>"
			 prevOversData+="<tr>"
				prevOversData+="<td class='table_td1'>"
					prevOversData+=data.score.prev_overs
					prevOversData+="</td>"
				prevOversData+="</tr>"
				prevOversData+="</table>"
				return prevOversData;
			}
		return "";
		
	},
	
	addBatsmanDetails(batsman){
		
	}

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
	},
	
	int_matches:function(type){
	 	if(type == "live"){
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
												matchdata+=match_layout.followMatches(data[i])
												matchdata+= match_layout.header(data[i])
											matchdata+="</td>"
										matchdata+="</tr>"
									matchdata+="</table>"
									
									matchdata+=match_layout.urlLayout(data[i])
									matchdata+=match_layout.livematch_layout(data[i])
									matchdata+=match_layout.status_layout(data[i])
									
								matchdata+="</li>"
								break;
						default:
						  break;
					} 
				};
				if(i==0) {
					document.getElementById("tab-1").innerHTML ="<div>No Live matches</div>"; 
				} 
				else { 
						document.getElementById("tab-1").innerHTML= matchdata
				}	
			});
		}
		else{
			
		}
	}
}
