//this script controls what happens when popup is interacted with
//when popup loads...
window.onload=function(){
  //get button
  var autoButton=document.querySelector('input[name=autoButton]');
  var manualButton=document.querySelector('input[name=manualButton]');
  autoButton.addEventListener('change',toggleAuto);
  manualButton.addEventListener('change',toggleManual);

  //keep button on if already on, else off
  chrome.storage.local.get('autoTranslate',function(value){
    if(value.autoTranslate==true){
      $('#autoButton').attr('checked',true);
      $('#manualButton').attr('disabled',true);
      $('.switch.manual').css('opacity','0.2');
    }else{
      $('#autoButton').attr('checked', false);
      $('#manualButton').attr('disabled',false);
    }
  });

  //for novelty, displays random emoji and its corresponding description!
  $.getJSON(chrome.runtime.getURL('/scripts/emojiDict.json'),function(responseText) {
      var emojis=responseText;
      var randomIndex=Math.floor(Math.random()*(Object.keys(emojis).length));
      var randomEmoji=Object.keys(emojis)[randomIndex];
      $('.emoji').html(randomEmoji);
      $('.description').html(emojis[randomEmoji].name);
  });
}

//translates/reverts when button is clicked
function toggleAuto(){
  if(autoButton.checked){
    chrome.tabs.query({active:true,currentWindow:true},function(tabs){
      chrome.tabs.executeScript(
        tabs[0].id,{file:'/scripts/replace.js'}
      );
    });
    chrome.storage.local.set({'autoTranslate':true},function(){});
    $('#manualButton').attr('disabled',true);
    $('.switch.manual').css('opacity','0.2');
  }else{
    chrome.tabs.query({active:true,currentWindow:true},function(tabs){
      chrome.tabs.executeScript(
        tabs[0].id,{file:'/scripts/revert.js'}
      );
    });
    chrome.storage.local.set({'autoTranslate':false},function(){});
    $('#manualButton').attr('disabled',false);
    $('.switch.manual').css('opacity','1');
  }
}

function toggleManual(){
  if(manualButton.checked){
    chrome.tabs.query({active:true,currentWindow:true},function(tabs){
      chrome.tabs.executeScript(
        tabs[0].id,{file:'/scripts/replace.js'}
      );
    });
  }else{
    chrome.tabs.query({active:true,currentWindow:true},function(tabs){
      chrome.tabs.executeScript(
        tabs[0].id,{file:'/scripts/revert.js'}
      );
    });
  }
}
