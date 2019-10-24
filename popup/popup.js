//this script controls what happens when popup is interacted with
//calls replace.js

var button=document.getElementById('button');

//when click button, run replace.js
button.onclick=function(element){
  chrome.tabs.query({active:true,currentWindow:true},function(tabs){
    chrome.tabs.executeScript(
      tabs[0].id,{file:'/scripts/replace.js'}
    );
  });
};

var body=document.body;
body.onload=function(element){
  chrome.tabs.query({active:true,currentWindow:true},function(tabs){
    chrome.tabs.executeScript(
      tabs[0].id,{file:'/scripts/loadlib.js'}
    );
  });
};
