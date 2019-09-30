//this script controls what happens when popup is interacted with

var button=document.getElementById('button');

//when click button, run replace.js
button.onclick=function(element){
  chrome.tabs.query({active:true,currentWindow:true},function(tabs){
    chrome.tabs.executeScript(
      tabs[0].id,{file:'replace.js'}
    );
  });
};
