
var matches_data = {}
var live_score_data = {}
var score_card_data = {}
var news_data = {}

var timerM;
var timerN;
var timerA;

var first_live;
var tabs={};

var oldNews=new Array();
var oldAlert_time="0000000000";
var dontFollowMatches = new Array();

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
// $(document).ready(function(){ 
// 	$('ul.tabs li').click(function(){
// 	var tab_id = $(this).attr('data-tab');
// 
// 	$('ul.tabs li').removeClass('current');
// 	$('.tab-content').removeClass('current');
// 
// 	$(this).addClass('current');
// 	$("#"+tab_id).addClass('current');
// 	});
// });

// document.addEventListener('DOMContentLoaded', function() {
//     var link = document.getElementByClass('ul.tabs li');
//     // onClick's logic below:
//     link.addEventListener('click', function() {
//         alert("done");
//     });
// });
$(window).load(function() {
	// insertTabs();
  var insightlySidebar;
    // $('body').css({
    //   'padding-right': '100px'
    // });
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
		// var theDiv = document.getElementById("insightlySidebar");
    // var newNode = document.createElement('div');    
    // newNode.id='container';
    // theDiv.appendChild( newNode );
		// document.getElementById("container").innerHTML = Tabs();
		// var myLi=document.querySelectorAll('#container>ul>li');
		// for(i=0;i<myLi.length;i++){
		//  myLi[i].addEventListener('click', testing, false);
	  // }
		$('#tab-container').easytabs();
    var theDiv = document.getElementById("insightlySidebar");
    var newNode = document.createElement('div');    
    newNode.id='matches';
    theDiv.appendChild( newNode );
    fetch_matches();
    show_matches();
		score_card();
		show_live_score();
});

// function testing(){
// 	debugger;
// }

// function Tabs(){
// 	tabs = ""
// 	
// 	tabs+="<ul class='tabs1'>"
// 	tabs+="<li class='tab-link current' data-tab='tab-1'>Tab One</li>"
// 	tabs+="<li class='tab-link' data-tab='tab-2'>Tab Two</li>"
// 	tabs+="</ul>"
// 	tabs+="<div id='tab-1' class='tab-content current'>"
// 	tabs+="Lorem ipsum dolor"
// 	tabs+="</div>"
// 	tabs+="<div id='tab-2' class='tab-content'>"
// 	tabs+="Duis aute irure"
// 		tabs+="</div>"
	// tabs = ""
	// tabs+="<ul>"
	// tabs+="<li><a href='#tab-1-div'>Tab 1</a></li>"
	// tabs+="<li><a href='#that-other-tab'>The Second Tab</a></li>"
	// tabs+="<li><a href='#lastly'>Tab C</a></li>"
	// tabs+="<div id='tab-1-div'>"
	// tabs+="<h2>Heading 1</h2><p>This is the content of the first tab.</p></div>"
	// tabs+="<div id='that-other-tab'><h2>Heading 2</h2><p>Stuff from the second tab.</p></div>"
 // 	tabs+="<div id='lastly'><h2>Heading 3</h2><p>More stuff from the last tab.</p></div>"
 // return tabs;
 // }
 
 
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
        document.getElementById("matches").style="padding:0px 5px 5px 5px";
				  $('.flexslider').flexslider({
					animation: "slide"
				  });
        
				// setEventForFollowMatches();
		}	
	});
}
function fetch_matches() {

	$.getJSON(matchesURL, function(data) {
	
		if(timerM) { clearTimeout(timerM); }			
		timerM = setTimeout(fetch_matches, reloadTime);
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
function score_card(){	
	$.getJSON(matchesURL, function(data) {
	for (i=0; i<data.length ;i++) {
		if(data[i].state=="inprogress"){
			first_live= data[i];
			break;
		}
	}

	score_url = "https://www.cricbuzz.com/match-api/"+first_live.matchId+"/commentary.json"
	$.getJSON(score_url, function(data) {
		$( "<div id='score_card'>"+match_layout.scorecard(data)+"</div>" ).insertAfter( "#demo1" );
	});
	});
}

function show_live_score(){

	$.getJSON(matchesURL, function(data) {
		var liveScore ="";
		//matchdata=data[0].seriesFolder;
		for (i=0; i<data.length ;i++) {
			if(data[i].state=="inprogress"){
				first_live= data[i];
				break;
			}
		}
		score_url = "https://www.cricbuzz.com/match-api/"+first_live.matchId+"/commentary.json"
		$.getJSON(score_url, function(data) {
			$( "<div id='recent_overs'>"+match_layout.live_scorecard(data)+"</div>" ).insertAfter( "#score_card" );
		});
		
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
	
	scorecard:function(data){
		var batsman = []

			var striker = $(data.score.batsman).filter(function (i,n){
	       return n.strike==1;
	    });
			var non_striker = $(data.score.batsman).filter(function (i,n){
	       return n.strike==0;
	    });
			var player1 = $(data.players).filter(function (i,n){
				return striker.length>0 && n.id == striker[0].id 
			});
			var player2 = $(data.players).filter(function (i,n){
				return n.id == non_striker[0].id
			});
			
			score_card_data = ""
 		 	score_card_data+="<table class='table table_live score_card'>"
			score_card_data+="<tr>"
			score_card_data+="<th>Batsman</th>"
			score_card_data+="<th>R</th>"
   		score_card_data+="<th>B</th>"
			score_card_data+="<th>4s</th>"
			score_card_data+="<th>6s</th>"
			score_card_data+="<th>SR</th>"
 			score_card_data+="</tr>"
 		 	score_card_data+="<tr>"
			if(striker.length > 0){
				striker[0].name = player1[0].f_name
				striker[0].strike_rate = striker[0].b>0 ? ((striker[0].r/striker[0].b)*100).toFixed(2) : 0
				batsman.push(striker[0]);
				score_card_data+="<td>"+batsman[0].name+"</td>"
				score_card_data+="<td>"+batsman[0].r+"</td>"
	 			score_card_data+="<td>"+batsman[0].b+"</td>"
				score_card_data+="<td>"+batsman[0]["4s"]+"</td>"
				score_card_data+="<td>"+batsman[0]["6s"]+"</td>"
				score_card_data+="<td>"+batsman[0].strike_rate+"</td>"
	 			score_card_data+="</tr>"
				score_card_data+="<tr>"
			}
			
			non_striker[0].name = player2[0].f_name
			non_striker[0].strike_rate = non_striker[0].b>0 ? ((non_striker[0].r/non_striker[0].b)*100).toFixed(2) : 0
			batsman.push(non_striker[0]);
 			score_card_data+="<td>"+batsman[1].name+"</td>"
			score_card_data+="<td>"+batsman[1].r+"</td>"
 			score_card_data+="<td>"+batsman[1].b+"</td>"
			score_card_data+="<td>"+batsman[1]["4s"]+"</td>"
			score_card_data+="<td>"+batsman[1]["6s"]+"</td>"
			score_card_data+="<td>"+batsman[1].strike_rate+"</td>"
			
 			score_card_data+="</tr>"
 		  score_card_data+="</table>"
 		return score_card_data;
	},
	
	live_scorecard:function(data){
		 live_score_data = ""
		 live_score_data+="<table class='table table_live'>"
		 live_score_data+="<tr>"
			live_score_data+="<td class='table_td1'>"
				live_score_data+=data.score.prev_overs
				live_score_data+="</td>"
			live_score_data+="</tr>"
		live_score_data+="</table>"
		return live_score_data;
	},
	
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
