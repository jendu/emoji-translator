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
