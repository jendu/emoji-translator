chrome.storage.local.get('bgColour',function(value){
  $('body,html').css('background-color',value.bgColour);
});
