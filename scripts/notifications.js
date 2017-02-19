window.onload = function fillContent () {

	var backpage = chrome.extension.getBackgroundPage();
	var str = window.location.href;
	var data_option =str .split("?match=")[1];
	
	document.getElementById("main_notification_body").innerHTML =backpage.getNotificatinData(data_option);

	var links = document.getElementsByTagName("a");
	var count = links.length;
	
	function openLink() {
		backpage.openLink(this.href);
	}
	
	for(i = 0; i < count; i++) {
		links[i].addEventListener('click', openLink, true);
	}	
	
/* 	$('img').each(function() {
		if((typeof this.naturalWidth != "undefined" && this.naturalWidth == 0 ) || this.readyState == 'uninitialized') {
			$(this).attr('src', 'images/default_icon_64.png');
		}
	}); */
	
$('img').each(function() {
    var img = this;
    if (img.complete) {
        if (typeof img.naturalWidth != "undefined" && img.naturalWidth == 0) {
			$(img).attr('src', 'images/default_icon_64.png');
        }
    } else {
        $(img).error(function() { 
			$(img).attr('src', 'images/default_icon_64.png');
		});
    }
});



}

