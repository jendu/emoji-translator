//this script controls what happens when popup is interacted with
//when popup loads...
window.onload=function(){
  //get button
  var modeToggle=document.querySelector('input[name=modeToggle]');
  modeToggle.addEventListener('change',toggleMode);

  //keep button on if already on, else off
  chrome.storage.local.get('manualTranslate',function(value){
    if(value.manualTranslate==true){
      $('#modeToggle').attr('checked',true);
    }else{
      $('#modeToggle').attr('checked', false);
    }
  });
}

//translates/reverts when button is clicked
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

}
