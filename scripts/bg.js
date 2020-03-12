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
    chrome.tabs.executeScript({code:
      'chrome.storage.local.get(\'bgColour\',function(value){$(\'body\').css(\'background-color\',value.bgColour);});'
    },_=>chrome.runtime.lastError);
  }else if(message.fontStyle){
    chrome.storage.local.set({'fontStyle':message.fontStyle},function(){});
    chrome.tabs.executeScript({code:
      'chrome.storage.local.get(\'fontStyle\',function(value){if(value.fontStyle){$(\'*\').css(\'font-family\',value.fontStyle);}});'
    },_=>chrome.runtime.lastError);
  }else if(message.fontSize){
    chrome.storage.local.set({'fontSize':message.fontSize},function(){});

  }
  return true;
});
