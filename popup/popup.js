//this script controls what happens when popup is interacted with
//whenever popup loads up...
window.onload=function(){
  //for novelty, displays random emoji and its corresponding description!
  $.getJSON(chrome.runtime.getURL('/scripts/emojiDict.json'),function(responseText) {
      var emojis=responseText;
      var randomIndex=Math.floor(Math.random()*(Object.keys(emojis).length));
      var randomEmoji=Object.keys(emojis)[randomIndex];
      $('.emoji').html(randomEmoji);
      $('.description').html(emojis[randomEmoji].name);

      $('#autoButton').on('change',toggleAuto);
      $('#manualButton').on('change',toggleManual);
  });

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
      $('.jscolor').css('background-color',value.bgColour);
      $('.jscolor').val((value.bgColour).substring(1));
    }else{
      var bgColour;
      var code='bgColour=$(\'body\').css(\'background-color\');';
      chrome.tabs.executeScript({code: code},
        function(colour){
          bgColour=colour;console.log(bgColour);
        }
      );
    }
  });

  $('.resetBGColour').on('click',function(){
    chrome.storage.local.remove('bgColour',function(){});
    chrome.tabs.reload();
    window.location.reload();
  });
}

//from: https://jsfiddle.net/Mottie/xcqpF/1/light/
function rgb2hex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

//toggles auto translate mode
function toggleAuto(){
  chrome.tabs.query({active:true,currentWindow:true},function(tabs){
    if(autoButton.checked){
      chrome.runtime.sendMessage({action:'translate'},function(){});
      $('#manualButton').attr('disabled',true);
      $('.switch.manual').css('opacity','0.2');
    }else{
      chrome.runtime.sendMessage({action:'revert'},function(){});
      $('#manualButton').attr('disabled',false);
      $('.switch.manual').css('opacity','1');
    }
  });
}

//translates/reverts on click
function toggleManual(){
  if(manualButton.checked){
      chrome.tabs.executeScript({file:'/scripts/replace.js'});
  }else{chrome.tabs.executeScript({file:'/scripts/revert.js'});}
}

function changeBGColour(){
  var bgColour="#"+$('.jscolor').val();
  chrome.tabs.executeScript({file:'/scripts/changebgcolour.js'});
  chrome.storage.local.set({'bgColour':bgColour},function(){});
  console.log('saved colour ',bgColour);
}
