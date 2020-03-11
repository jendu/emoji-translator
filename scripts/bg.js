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

//when tab is updated:
chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
  if(changeInfo.status=='complete'&&tab.active){
    chrome.storage.local.get('autoTranslate',function(value){
      console.log('value is ',value.autoTranslate);
      if(typeof value.autoTranslate!='undefined'){
        if(value.autoTranslate==true){
          chrome.tabs.executeScript(tabId,{file:'/scripts/replace.js'},_=>chrome.runtime.lastError);
        }
      }
    });
    chrome.storage.local.get('bgColour',function(value){
      if(typeof value.bgColour!='undefined'){
        var bgColour=value.bgColour;
        chrome.tabs.executeScript(tabId,{file:'/scripts/changebgcolour.js'},_=>chrome.runtime.lastError);
      }
    });
  }
});

//when bg script receives action message:
chrome.runtime.onMessage.addListener(function(message){
  if(message.action=='translate'){
    chrome.tabs.executeScript({file:'/scripts/replace.js'},_=>chrome.runtime.lastError);
    chrome.storage.local.set({'autoTranslate':true},function(){});
  }else if(message.action=='revert'){
    chrome.tabs.executeScript({file:'/scripts/revert.js'},_=>chrome.runtime.lastError);
    chrome.storage.local.set({'autoTranslate':false},function(){});
  }else if(message.colour){
    chrome.storage.local.set({'bgColour':message.colour},function(){});
    chrome.tabs.executeScript({file:'/scripts/changebgcolour.js'},_=>chrome.runtime.lastError);
  }
  return true;
});
