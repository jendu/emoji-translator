//this script controls what happens when popup is interacted with
//when popup loads...
window.onload=function(){
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

      $('#autoButton').on('change',toggleAuto);
      $('#manualButton').on('change',toggleManual);
  });

  //change bg colour
  $('.jscolor').on('change paste keyup',changeBGColour);
  chrome.storage.local.get('bgColour',function(value){
    if(typeof value.bgColour!='undefined'){
      $('.jscolor').css('background-color',value.bgColour);
      $('.jscolor').val((value.bgColour).substring(1));
    }
  });

  $('.resetBGColour').on('click',function(){
    chrome.storage.local.remove('bgColour',function(){});
    chrome.tabs.query({active:true,currentWindow:true},function(tabs){
      chrome.tabs.reload(tabs[0].id);
    });
    window.location.reload();
  });
}

function rgb2hex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
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

function changeBGColour(){
  var bgColour="#"+$('.jscolor').val();
  chrome.tabs.query({active:true,currentWindow:true},function(tabs){
    chrome.tabs.executeScript(
      tabs[0].id,{file:'/scripts/changebgcolour.js'}
    );
  });
  chrome.storage.local.set({'bgColour':bgColour},function(){});
  console.log('saved colour ',bgColour);
}
