//script runs in background
chrome.runtime.onInstalled.addListener(function(){
  //check that the page it is being used on is an actual web page (http/https)
  var checkPageValid={
    conditions:[
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl:{schemes:['http','https']}
      })
    ],
    actions:[new chrome.declarativeContent.ShowPageAction()]
  };

  chrome.declarativeContent.onPageChanged.removeRules(undefined,function(){
    chrome.declarativeContent.onPageChanged.addRules([checkPageValid]);
  });

});

//check if button is on, if so, auto-translate on tab/page load
chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
  if(changeInfo.status=='complete'&&tab.active){
    chrome.storage.local.get('autoTranslate',function(value){
      if(typeof value.autoTranslate!='undefined'){
        if(value.autoTranslate==true){
          chrome.tabs.query({active:true,currentWindow:true},function(tabs){
            chrome.tabs.executeScript(
              tabs[0].id,{file:'/scripts/replace.js'},_=>chrome.runtime.lastError
            );
          });
        }
      }
    });

    chrome.storage.local.get('bgColour',function(value){
      if(typeof value.bgColour!='undefined'){
        var bgColour=value.bgColour;
        console.log(bgColour);
        chrome.tabs.query({active:true,currentWindow:true},function(tabs){
          chrome.tabs.executeScript(
            tabs[0].id,{file:'/scripts/changebgcolour.js'},_=>chrome.runtime.lastError
          );
        });
      }
    });

  }
});
