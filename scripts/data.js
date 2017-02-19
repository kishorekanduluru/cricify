var matches_data = {}
var news_data = {}
var timerM;
var timerN;
var timerA;
var oldNews=new Array();
var oldAlert_time="0000000000";
var dontFollowMatches = new Array();

var nowMatches=new Array();
var nowAlert;
var reloadTime = 1000 * 10;
			

//var genericBase = "http://www.cricbuzz.com/statsbuzz/getgeneric?url=";
//var matchesURL = "http://webclient.cricbuzz.com/includes/indiatoday/livecricketscore/web-client-match-details.json";
//var genericBase = "http://sample.anand.cricbuzz.dev/cricbuzz/crossdomain.php?url=";

var matchesURL = "http://synd.cricbuzz.com/cricbuzz/livecricketscore/chrome-details.json";
var newsURL = "http://mapps.cricbuzz.com/cricbuzz/rss/latest_news.json";
var alertsURL = "http://sms.cricbuzz.com/chrome/alert.json"; 
var optionsURL = "http://sms.cricbuzz.com/chrome/options.json";

// var matchesURL = "matches.json";
// var newsURL = "news.json";
// var alertsURL = "alerts.json";
// var optionsURL = "options.json"; 