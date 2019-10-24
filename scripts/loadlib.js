//parse json emojis into variable
//accessed via: emojis[char].name
var emojis;
var req=new XMLHttpRequest();
req.open('GET',chrome.extension.getURL('/scripts/emojiDict.json'),true);
req.onload=function(){
  if(req.readyState==4&&req.status==200){
    emojis=JSON.parse(req.response);
  }
}
req.send();
