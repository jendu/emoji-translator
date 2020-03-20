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
  }else if(message.fontAction){
    console.log('fontAction');
    var resize=1;
    if(message.fontAction=='decrease'){
      resize=0.7;
    }else if(message.fontAction=='increase'){
      resize=1.3;
    }
    chrome.storage.local.get('fontSize',function(value){
      if(typeof value.fontSize=='undefined'){
        chrome.tabs.executeScript({code:
          'var fSize=window.getComputedStyle(document.body).fontSize;chrome.storage.local.set({\'fontSize\':fSize},function(){});chrome.storage.local.get(\'fontSize\',function(value){console.log(value.fontSize);});'
        },_=>chrome.runtime.lastError)
      }
    });
    chrome.storage.local.get('fontSize',function(v){
      var newSize=parseInt(v.fontSize)*resize;
      console.log(newSize);
      chrome.storage.local.set({'fontSize':newSize},function(){
      });
    });
    chrome.tabs.executeScript({code:
      'chrome.storage.local.get(\'fontSize\',function(value){$(\'*\').css(\'font-size\',value.fontSize);});'
    },_=>chrome.runtime.lastError)
  }
  return true;
});
