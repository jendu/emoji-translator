//this script controls what happens when popup is interacted with

//load database
var body=document.body;
body.onload=function(element){
  chrome.tabs.query({active:true,currentWindow:true},function(tabs){
    chrome.tabs.executeScript(
      tabs[0].id,{file:'/scripts/loadlib.js'}
    );
  });
};

//button
function translate(){
  chrome.tabs.query({active:true,currentWindow:true},function(tabs){
    chrome.tabs.executeScript(
      tabs[0].id,{file:'/scripts/replace.js'}
    );
  });
}
document.getElementById('button').addEventListener('click',translate);

//toggle mode
var modeToggle=document.querySelector('input[name=modeToggle]');
function toggleMode(){
  if(modeToggle.checked){
    chrome.tabs.query({active:true,currentWindow:true},function(tabs){
      chrome.tabs.executeScript(
        tabs[0].id,{file:'/scripts/replace.js'}
      );
    });
  }else{//translate back
    chrome.tabs.query({active:true,currentWindow:true},function(tabs){
      chrome.tabs.executeScript(
        tabs[0].id,{file:'/scripts/revert.js'}
      );
    });
  }
}
modeToggle.addEventListener('change',toggleMode);
