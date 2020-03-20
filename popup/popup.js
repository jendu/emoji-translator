//this script controls what happens when popup is interacted with
//whenever popup loads up...
window.onload=function(){
    chrome.storage.local.get('fontSize',function(value){
      console.log('current size: ',value.fontSize);
    });




  //for novelty, displays random emoji and its corresponding description!
  $.getJSON(chrome.runtime.getURL('/scripts/emojiDict.json'),function(responseText) {
      var emojis=responseText;
      var randomIndex=Math.floor(Math.random()*(Object.keys(emojis).length));
      var randomEmoji=Object.keys(emojis)[randomIndex];
      $('.emoji').html(randomEmoji);
      $('.description').html(emojis[randomEmoji].name);
  });

  $('#autoButton').on('change',toggleAuto);
  $('#manualButton').on('change',toggleManual);

  //auto-translate: keep button on if already on, else off
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

  //bg colour:
  $('.jscolor').on('change paste keyup',changeBGColour);
  chrome.storage.local.get('bgColour',function(value){
    if(typeof value.bgColour!='undefined'){
      $('.jscolor').val((value.bgColour).substring(1));
      $('.jscolor').css('background-color',value.bgColour);
    }
  });
  $('.resetBGColour').on('click',function(){
    chrome.storage.local.remove('bgColour',function(){});
    chrome.tabs.reload();
    window.location.reload();
  });

  //font family:
  chrome.storage.local.get('fontStyle',function(value){
    if(typeof value.fontStyle!='undefined'){
      $('.fontStyle').val(value.fontStyle);
    }
  });
  $('.fontStyle').on('change',function(){
    var fontFamily=$('.fontStyle').children('option:selected').val();
    chrome.runtime.sendMessage({fontStyle:fontFamily},function(){});
  });
  $('.resetFontFamily').on('click',function(){
    chrome.storage.local.remove('fontStyle',function(){});
    chrome.tabs.reload();
    window.location.reload();
  });

  //font size:
  $('.decreaseFontSize').on('click',function(){
    chrome.runtime.sendMessage({fontAction:'decrease'},function(newSize){
      $('.fontSize').text(newSize+'px');
    });
  });
  chrome.storage.local.get('fontSize',function(value){
    if(!isNaN(value.fontSize)){
      $('.fontSize').text(value.fontSize+'px');
    }
  });
  $('.fontSize').on('mousedown',function(){return false;});
  $('.fontSize').on('selectstart',function(){return false;});;
  $('.increaseFontSize').on('click',function(){
    chrome.runtime.sendMessage({fontAction:'increase'},function(newSize){
      $('.fontSize').text(newSize+'px');
    });
  });
  $('.resetFontSize').on('click',function(){
    chrome.storage.local.remove('fontSize',function(){});
    chrome.tabs.reload();
    window.location.reload();
  });

  //reset/clear all:
  $('.clear').on('click',function(){
    chrome.storage.local.clear(function() {
      var error = chrome.runtime.lastError;
      if (error) {
        console.error(error);
      }
    });
    chrome.tabs.reload();
    window.location.reload();
  });
}

//toggles auto translate mode
function toggleAuto(){
  if(autoButton.checked){
    chrome.runtime.sendMessage({action:'translate'},function(){});
    $('#manualButton').attr('disabled',true);
    $('.switch.manual').css('opacity','0.2');
  }else{
    chrome.runtime.sendMessage({action:'revert'},function(){});
    $('#manualButton').attr('disabled',false);
    $('.switch.manual').css('opacity','1');
  }
}

//translates/reverts on click
function toggleManual(){
  if(manualButton.checked){
    chrome.tabs.executeScript({file:'/scripts/replace.js'});
  }else{chrome.tabs.executeScript({file:'/scripts/revert.js'});}
}

//changes background colour
function changeBGColour(){
  var bgColour="#"+$('.jscolor').val();
  chrome.runtime.sendMessage({colour:bgColour},function(){});
}
