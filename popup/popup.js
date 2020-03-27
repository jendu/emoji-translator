//popup.html
window.onload=function(){
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
  $('#bgColour').on('change paste keyup',changeBGColour);
  chrome.storage.local.get('bgColour',function(value){
    if(typeof value.bgColour!='undefined'){
      $('#bgColour').val((value.bgColour).substring(1));
      $('#bgColour').css('background-color',value.bgColour);
    }
  });
  $('.resetBGColour').on('click',function(){
    chrome.storage.local.remove('bgColour',function(){});
    chrome.tabs.reload();
    window.location.reload();
  });

  //font colour:
  $('#fontColour').on('change paste keyup',changeFontColour);
  chrome.storage.local.get('fontColour',function(value){
    if(typeof value.fontColour!='undefined'){
      $('#fontColour').val((value.fontColour).substring(1));
      $('#fontColour').css('background-color',value.fontColour);
    }
  });
  $('.resetFontColour').on('click',function(){
    chrome.storage.local.remove('fontColour',function(){});
    chrome.tabs.reload();
    window.location.reload();
  });

  //theme:
  $('#themeA').on('click',function(){
    chrome.runtime.sendMessage({theme:'themeA'},function(){});
    $('#bgColour').css('background-color','#FFFFFF');
    $('#fontColour').css('background-color','#000000');
  });
  $('#themeB').on('click',function(){
    chrome.runtime.sendMessage({theme:'themeB'},function(){});
    $('#bgColour').css('background-color','#000000');
    $('#fontColour').css('background-color','#FFFFFF');
  });
  $('#themeC').on('click',function(){
    chrome.runtime.sendMessage({theme:'themeC'},function(){});
    $('#bgColour').css('background-color','#F3E4C9');
    $('#fontColour').css('background-color','#3A539B');
  });
  $('#themeD').on('click',function(){
    chrome.runtime.sendMessage({theme:'themeD'},function(){});
    $('#bgColour').css('background-color','#829356');
    $('#fontColour').css('background-color','#F2F3F4');
  });
  $('#themeE').on('click',function(){
    chrome.runtime.sendMessage({theme:'themeE'},function(){});
    $('#bgColour').css('background-color','#093145');
    $('#fontColour').css('background-color','#EFD469');
  });
  $('.resetTheme').on('click',function(){
    chrome.storage.local.remove('bgColour',function(){});
    chrome.storage.local.remove('fontColour',function(){});
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
  updateFontSizeVal();
  $('.fontSize').on('mousedown',function(){return false;});
  $('.fontSize').on('selectstart',function(){return false;});;
  $('.decreaseFontSize').on('click',function(){
    chrome.runtime.sendMessage({fontAction:-1},function(){});
    setTimeout(()=>{updateFontSizeVal();},100);
  });
  $('.increaseFontSize').on('click',function(){
    chrome.runtime.sendMessage({fontAction:1},function(){});
    setTimeout(()=>{updateFontSizeVal();},100);
  });
  $('.resetFontSize').on('click',function(){
    chrome.storage.local.remove('fontSize',function(){});
    chrome.tabs.reload();
    window.location.reload();
  });

  //reset/clear all:
  $('.resetAll').on('click',function(){
    chrome.storage.local.clear(function(){
      var error = chrome.runtime.lastError;
      if(error){console.error(error);}
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
  var bgColour="#"+$('#bgColour').val();
  chrome.runtime.sendMessage({bgColour:bgColour},function(){});
}

//changes font colour
function changeFontColour(){
  var fontColour="#"+$('#fontColour').val();
  chrome.runtime.sendMessage({fontColour:fontColour},function(){});
}

//changes theme

//updates font size shown
function updateFontSizeVal(){
  chrome.storage.local.get('fontSize',function(value){
    if(isNaN(value.fontSize)){
      $('.fontSize').text('Default');
      chrome.storage.local.set({'fontSize':0},function(){});
    }
    else{
      $('.fontSize').text('Modified');
    }
  });
}
