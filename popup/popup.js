//this script controls what happens when popup is interacted with

//toggle mode
var modeToggle=document.querySelector('input[name=modeToggle]');
function toggleMode(){
  if(modeToggle.checked){
    chrome.tabs.query({active:true,currentWindow:true},function(tabs){
      chrome.tabs.executeScript(
        tabs[0].id,{file:'/scripts/replace.js'}
      );
    });
    chrome.storage.local.set({'manualTranslate':true},function(){});
  }else{//translate back
    chrome.tabs.query({active:true,currentWindow:true},function(tabs){
      chrome.tabs.executeScript(
        tabs[0].id,{file:'/scripts/revert.js'}
      );
    });
    chrome.storage.local.set({'manualTranslate':false},function(){});
  }
}
modeToggle.addEventListener('change',toggleMode);

$(document).ready(function(){
  //for some reason code just doesn't wanna run here :))))
  console.log('if u see dis in console it means it worky hehe');
});
