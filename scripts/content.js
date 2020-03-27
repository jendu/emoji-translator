//Runs on page load/tab update.
//Parse json emojis into variable, accessed via: emojis[char].name or textEmojis[name].char
//Checks current variable values and executes if set.
var emojis;
var textEmojis;
$.getJSON(chrome.runtime.getURL('/scripts/emojiDict.json'),function(responseText) {
    emojis=responseText;
    console.log('Loaded emojis');
    $.getJSON(chrome.runtime.getURL('/scripts/textDict.json'),function(responseText) {
        textEmojis=responseText;
        console.log('Loaded textEmojis');

        //auto-translate: basically replace.js
        chrome.storage.local.get('autoTranslate',function(value){
          if(value.autoTranslate==true){
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
          }
        });
        //end

        //background colour:
        chrome.storage.local.get('bgColour',function(value){
          $('body').css('background-color',value.bgColour);
        });

        //font colour:
        chrome.storage.local.get('fontColour',function(value){
          $('*').css('color',value.fontColour);
        });

        //font style/family:
        chrome.storage.local.get('fontStyle',function(value){
          if(value.fontStyle=='OpenDyslexic'){
            var style=document.createElement('style');
            style.type='text/css';
            style.textContent='@font-face{font-family:OpenDyslexic;src:url("'
            +chrome.extension.getURL('scripts/OpenDyslexic-Regular.otf')+'");}';
            document.head.appendChild(style);
            $('*').css('font-family','OpenDyslexic');
          }else if(value.fontStyle=='Sylexiad'){
            var style=document.createElement('style');
            style.type='text/css';
            style.textContent='@font-face{font-family:Sylexiad;src:url("'
            +chrome.extension.getURL('scripts/SylexiadSerifMedium.otf')+'");}';
            document.head.appendChild(style);
            $('*').css('font-family','Sylexiad');
          }
          $('*').css('font-family',value.fontStyle);
        });

        //font size:
        chrome.storage.local.get('fontSize',function(value){
          $('*').each(function(){
            var k=parseInt($(this).css('font-size'));
            var resize = k+value.fontSize;
            $(this).css('font-size',resize);
          });
        });

    });
});
