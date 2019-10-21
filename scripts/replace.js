//this script replaces a string with another
//currently does "a" to "b", will modify later to replace emojis with text

//parse json emojis into variable
var emojis;
var req=new XMLHttpRequest();
req.open('GET',chrome.extension.getURL('/scripts/emojiDict.json'),true);
req.onload=function(){
  if(req.readyState==4&&req.status==200){
    emojis=JSON.parse(req.response);

    var emoj='U+1F600';//example unicode point
    console.log(emojis[emoj].name);//retrieves corresponding emoji description

  }
}
req.send();
//console.log(emojis);

//get all elements in webpage
var elements=document.getElementsByTagName('*');

//loop through all elements in webpage
for(var i=0;i<elements.length;i++){
  for(var j=0;j<elements[i].childNodes.length;j++){
    var node=elements[i].childNodes[j];
    //if nodeType is text
    if(node.nodeType===3){
      var text=node.nodeValue;
      //g=global, i=case-insensitive. Unicode emojis are case-insensitive
      //therefore \uD83D\uDE00 is same as \ud83d\ude00
      var replacedText=text.replace(/a/gi,'b');
      elements[i].replaceChild(document.createTextNode(replacedText),node);
    }
  }
}
