//parse json emojis into variable
//accessed via: emojis[char].name or textEmojis[name].char

function loadLib(path,done){
  var req=new XMLHttpRequest();
  req.onload=function(){return done(this.responseText)}
  req.open('GET',path,true);
  req.send();
}

var emojis;
loadLib(chrome.extension.getURL('/scripts/emojiDict.json'),function(responseText){
  emojis=JSON.parse(responseText);
})
console.log('Loaded emojis');

var textEmojis;
loadLib(chrome.extension.getURL('/scripts/textDict.json'),function(responseText){
  textEmojis=JSON.parse(responseText);
})
console.log('Loaded textEmojis');

$(document).ready(function(){
  console.log('HELP');
  chrome.storage.local.get('manualTranslate',function(value){
    if(value.manualTranslate==true){
      console.log('it true');
      $('#manualTranslate').attr('checked',true);
    }else{
      $('#manualTranslate').attr('checked', false);
      console.log('it false');
    }
  });

  $('#manualTranslate').click(function(){
    toggleMode();
  });
});
