window.onload = function loadOptions() {	
			
	$.getJSON(optionsURL, function(data) {

		var optionsData ="";
		var notificationType ="";
		var i=0;
		var newData = data
		$(data).each(function(){
			var notificationType = this.notification_type.toLowerCase();				 
			if (localStorage[notificationType] == undefined || (localStorage[notificationType] != "0" && localStorage[notificationType] != "1")) {
				localStorage[notificationType]="1";
			}
			cheakedValue = " "
			if ( localStorage[notificationType] != "0") {
				cheakedValue = "checked='checked'"
			}
			optionsData+="<div class='mainopt_block'>";
				optionsData+="<input class='cbz_notification_option' type='checkbox'" + cheakedValue + " id='"+notificationType+"' /> "+this.header+"<br />";
				optionsData+="<div class='descriptionopt_block'>"+this.description+"</div>";
			optionsData+="</div>";	
			
			notificationType = this.notification_type.toLowerCase();
		})
			
		$(".cbz_notification_option").live("change",function(){
			this_notification = this;
			notificationType = $(this_notification).attr('id');
			if( $(this_notification).attr('checked') ){
				localStorage[notificationType]="1";
				console.log("Enabling " + notificationType)
			} else {
				localStorage[notificationType]="0";
			}
		});				
		
		optionsData+="<button id='dbutton'>Close</button>";		
		document.getElementById("mainopt_body").innerHTML =optionsData;
		
		
		$("#dbutton").click(function(){
			window.close();
		});
	
	});
	
	$('#dimg').hover(function() {
		this.src = "images/close1.png";
	}).mouseout(function() {
		this.src = "images/close.png";
	}) 

	if(!localStorage["extVersion"] || localStorage["extVersion"] != "1.2.9") {
			localStorage["extVersion"] = "1.2.9";
	}

}