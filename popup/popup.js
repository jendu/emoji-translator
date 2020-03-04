//this script controls what happens when popup is interacted with
window.onload=function(){
  var modeToggle=document.querySelector('input[name=modeToggle]');
  modeToggle.addEventListener('change',toggleMode);

  //debug
  chrome.storage.local.get('manualTranslate',function(value){
    console.log('currently: ',value.manualTranslate);
  });

  chrome.storage.local.get('manualTranslate',function(value){
    val=value.manualTranslate;
    if(value.manualTranslate==true){
      console.log('it true');  //debug
      $('#modeToggle').attr('checked',true);
    }else{
      console.log('it false');  //debug
      $('#modeToggle').attr('checked', false);
    }
  });

}

function toggleMode(){
  if(modeToggle.checked){
    chrome.tabs.query({active:true,currentWindow:true},function(tabs){
      chrome.tabs.executeScript(
        tabs[0].id,{file:'/scripts/replace.js'}
      );
    });
    chrome.storage.local.set({'manualTranslate':true},function(){});
  }else{
    chrome.tabs.query({active:true,currentWindow:true},function(tabs){
      chrome.tabs.executeScript(
        tabs[0].id,{file:'/scripts/revert.js'}
      );
    });
    chrome.storage.local.set({'manualTranslate':false},function(){});
  }

  //debug
  chrome.storage.local.get('manualTranslate',function(value){
    console.log('now: ',value.manualTranslate);
  });
}
