//Replaces emojis with their offical text descriptions.

//get all elements in webpage
var elements=document.getElementsByTagName('*');

//loop through all elements in webpage
for(var i=0;i<elements.length;i++){
  for(var j=0;j<elements[i].childNodes.length;j++){
    var node=elements[i].childNodes[j];

    //if nodeType is text
    if(node.nodeType===3){
      var text=node.nodeValue;
      var replacedText=text;
      //g=global, i=case-insensitive. Unicode emojis are case-insensitive
      //using regex from https://www.regextester.com/106421
      var emojisInText=text.match(/\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]/gi);

      //if there are emojis in text
      if(emojisInText!=null){
        //loop through emojis
        for(var k=0;k<emojisInText.length;k++){
          if(emojis.hasOwnProperty(emojisInText[k])){
            replacedText=replacedText.replace(emojisInText[k],'[emoji: '+emojis[emojisInText[k]].name+']');
            }
        }
        elements[i].replaceChild(document.createTextNode(replacedText),node);
      }

    }

  }
}
console.log('Translated emojis to plain text description');
