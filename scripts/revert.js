//this script replaces emoji text descriptions with original char
//basically reverts replace.js

//get all elements in webpage
var elements=document.getElementsByTagName('*'); //htmlcollection

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
          var emojisInText=text.match(/\[emoji.*?\]/gi);

          //if there are emojis in text
          if(emojisInText!=null){
            emojisInText=emojisInText.toString().replace(/\[emoji: /gi,'');
            emojisInText=emojisInText.replace(/\]/gi,'');
            emojisInText=emojisInText.toString();

            if(textEmojis.hasOwnProperty(emojisInText)){
              replacedText=replacedText.toString().replace(/\[emoji: /gi,'');
              replacedText=replacedText.replace(/\]/gi,'');
              replacedText=replacedText.toString();
              replacedText=replacedText.replace(emojisInText,textEmojis[emojisInText].char);
              elements[i].replaceChild(document.createTextNode(replacedText),node);
            }
          }

        }

  }
}

console.log('Translated plain text emojis to utf unicode characters');
