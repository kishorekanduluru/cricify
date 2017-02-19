// var messages = [];
// var ids = [];
// var latestId;
// 
// $(function(){
//   engine();
//   setInterval(engine, 10000);
// });
// 
// function engine(){
//   var newTweets = [];
//   $.get('https://twitter.com/i/notifications', function(data){
//     var htmlData = data;
//     $data = $(htmlData).find('#stream-items-id').eq(0);
//     $data.find('.activity-truncated-tweet').remove();
//     $data.find('.activity-supplement').remove();
//     $('body').append($data);
//     for(i=0;i<$data.find('li.stream-item').length;i++){
//       ids[i] = $data.find('li.stream-item').eq(i).attr('data-item-id');
//       messages[i] =($($data)).find('li.stream-item').eq(i).find('div.stream-item-activity-line').text().replace(/\n/g,'').trim(); 
//     }
//     var unique = ids.filter(function(elem, index, self) {
//     return index == self.indexOf(elem);
//     })
//     console.log(messages);
//     if(latestId == ids[0]){
//       
//     }
//     else if(latestId == undefined){
//       var firstRun = {
//         type: "basic",
//         title: "Twitter Notifier",
//         message: "excellent awesome speech",
//         iconUrl: "icon.png" 
//       };
//       chrome.notifications.create(firstRun);
//       latestId = ids[0];
//     }
//     else if(latestId != ids[0]){
//       for(j=0;j< ids.length;j++){
//         if(latestId == ids[j]){
//           break;
//         }else{
//           if(messages[j]!=''){
//             newTweets[j]=messages[j];
//           }
//         }
//       }
//       latestId=ids[0];
//     }
//     if(newTweets.length == 0){
//       
//     }else{
//       for(i=0;i<newTweets.length;i++){
//         var myTweet={
//           type: "basic",
//           title: "new notificaitons",
//           message: newTweets[i],
//           iconUrl: "icon.png"
//         };
//         chrome.notifications.create(myTweet);
//       }
//     }
//     console.log(latestId);
//     console.log(newTweets);
//   })
// }
window.fbAsyncInit = function() {
  FB.init({
      appId: 1836353846581753,
      status: true,
      cookie: true,
      xfbml: true,
      oauth  : true
  });

  FB.getLoginStatus(function(response) {
      if (response.authResponse) {
            alert("logged in");} 
      else {
          alert("failure");
      }
  });
};
(function() {
  var e = document.createElement('script'); e.async = true;
  e.src = 'https:' +
    '//connect.facebook.net/en_US/all.js';
  document.getElementById('fb-root').appendChild(e);
}());
