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
    chrome.storage.local.get('manualTranslate',function(value){
      if(value.manualTranslate==true){
        chrome.tabs.query({active:true,currentWindow:true},function(tabs){
          chrome.tabs.executeScript(
            tabs[0].id,{file:'/scripts/replace.js'},_=>chrome.runtime.lastError
          );
        });
      }else{
        chrome.tabs.query({active:true,currentWindow:true},function(tabs){
          chrome.tabs.executeScript(
            tabs[0].id,{file:'/scripts/revert.js'},_=>chrome.runtime.lastError
          );
        });
      }
    });
  }
});
