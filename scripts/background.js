

function showBadge(str) {
	chrome.browserAction.setBadgeBackgroundColor({color:[204,51,51,255]});
	chrome.browserAction.setBadgeText({ text: str });
}

function showMatchesBadge(str) {
	chrome.browserAction.setBadgeBackgroundColor({color:[204,51,51,255]});
	chrome.browserAction.setBadgeText({ text: str });
}

function hideBadge() {
	chrome.browserAction.setBadgeText({ text: "" });
}

function arraySubs(x, y) {
	var z=new Array();	
	//x = x.sort();
//	y = y.sort();
	for(var i = 0; i < x.length; i++) {
		var k = false;
		for(var j = 0; j < y.length; j++) {
			if(x[i] == y[j]) {
				k = true;
				break;
			}
		}
		if(!k) {
			z.push(x[i]);
			
		}
	}	
			
	return z;
}

function getnewNews(b) {
     var newNewsV=new Array();
	 
        if(oldNews[0]) {
           newNewsV = arraySubs(b, oldNews);		   
        }
        else {
            newNewsV = b;			 
        }
		if(b.length > 0) {
			oldNews = b;
			localStorage["oldNews"] = JSON.stringify(b);			
		}
		
		if(timerN) { clearTimeout(timerN); }			
        timerN = setTimeout(fetch_news, 960000);    

		//alert("from popup:"+oldNews);
        return newNewsV;
}


function openLink(linkUrl) {
	chrome.tabs.create({"url": linkUrl});
}
function fetch_alerts() {

	$.getJSON(alertsURL, function(data) {
	
			if(timerA) { clearTimeout(timerA); }			
			timerA = setTimeout(fetch_alerts, reloadTime);
			
			var newAlert;			
			newAlert =  {
				"matchId"      				: data.matchId,  
				"sub"  							: data.sub,
				"option"  							: data.option,
				"header"						 : data.header, 
				"msg"  							: data.msg,
				"url"       						: data.url,
				"img"       						: data.img,
				"time"							: data.time
			};
			nowAlert=newAlert;

			dontFollowMatches = new Array();
			var strMatches = localStorage["dontFollowMatches"];
			if(strMatches != null && strMatches != ""){
				dontFollowMatches = JSON.parse(strMatches);
			}
			
			if (localStorage["oldAlert_time"]) {
				//alert(localStorage["oldAlert_time"]);
				var strAlerts = localStorage["oldAlert_time"];
				if(strAlerts != null && strAlerts != ""){
					oldAlert_time = JSON.parse(strAlerts);
				} else {
					oldAlert_time = "0000000000";
				}
				
				if (localStorage[data.option] == undefined || (localStorage[data.option] != "0" && localStorage[data.option] != "1")) {
					localStorage[data.option]="1";
				}
				if ( ( ( ($.inArray(nowAlert.matchId + "", dontFollowMatches) < 0) ||  nowAlert.matchId=="0" )&& localStorage[data.option]&&nowAlert.msg ) && (parseInt(nowAlert.time) > parseInt(oldAlert_time ))) {
						var alert_timer;
						var alert_notification = webkitNotifications.createHTMLNotification("notifications.html?match="+data.option);
						alert_notification.show();
						alert_timer = setTimeout(function() { alert_notification.cancel(); }, 16 * 1000);
				}
				
			} else {
				localStorage["oldAlert_time"]="0000000000";
			}
			
			
			oldAlert_time = nowAlert.time;
			localStorage["oldAlert_time"]  = JSON.stringify(oldAlert_time);
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
			
		if(setNewTitle!="") {                             
			chrome.browserAction.setTitle({"title": setNewTitle});
		}
		else {
			chrome.browserAction.setTitle({"title": "Cricbuzz"});
		}
		resetDontFollowMatches();			

	});

}

function resetDontFollowMatches(){
	if(localStorage["dontFollowMatches"]) {
		var strMatches = localStorage["dontFollowMatches"];
		dontFollowMatches = JSON.parse(strMatches);			
		var z=new Array();
		
		z=arraySubs(dontFollowMatches, nowMatches);
		dontFollowMatches=arraySubs(dontFollowMatches, z);

		localStorage['dontFollowMatches']  = JSON.stringify(dontFollowMatches);		
	}
	nowMatches.length = 0;
}
function getNotificatinData(matchId) {
	return '<div id="headline">'+nowAlert["sub"]+' Alert</div><div style="min-height:80px; margin-left:5px;margin-right:5px;"><div id="img_icon"><img src="'+nowAlert["img"]+'" height="64" width="64" /></div><div id="notify"><a href="' + nowAlert["url"] + '"><div id="match_header">' + nowAlert["header"] + '</div><div id="alert_msg">' + nowAlert["msg"] + '</div></a></div></div>';	
}
function fetch_news() {

	var newNews=new Array();
	$.getJSON(newsURL, function(data) {
	
		if(timerN) { clearTimeout(timerN); }			
         timerN = setTimeout(fetch_news, 960000);
		
		for (var i=0; i<5;i++) {
			newNews[i]=parseInt(data.stories[i].id);
		}
		var newNewsV;
		
		if(oldNews[0]) {
				newNewsV= arraySubs(newNews, oldNews);
				if(newNewsV.length > 0) {
				 var str = newNewsV.length + "";
				 showBadge(str);
				 }
				 else {
					 hideBadge();
				 }
		}
		else
			showBadge("5");
		//alert("in back ground:"+oldNews);
	});

}

$(window).load(function() {	

	if(timerN) { clearTimeout(timerN); }			
	
	if(localStorage["oldNews"]) {
		var strNews = localStorage["oldNews"];
		oldNews = JSON.parse(strNews);	
	}
	else {
		showBadge("5");						
	}
	timerN = setTimeout(fetch_news, 100);
	
	
	if(timerM) { clearTimeout(timerM); }			
	if(localStorage["dontFollowMatches"]) {
		var strMatches = localStorage["dontFollowMatches"];
		dontFollowMatches = JSON.parse(strMatches); 
		//alert("hi");
	}	
	timerM = setTimeout(fetch_matches, 100);
	
	if(timerA) { clearTimeout(timerA); }
	 timerA = setTimeout(fetch_alerts, 100);

 });