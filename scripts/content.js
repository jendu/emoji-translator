//runs every page load
//parse json emojis into variable
//accessed via: emojis[char].name or textEmojis[name].char
var emojis;
var textEmojis;
$.getJSON(chrome.runtime.getURL('/scripts/emojiDict.json'),function(responseText) {
    emojis=responseText;
    console.log('Loaded emojis');
});
$.getJSON(chrome.runtime.getURL('/scripts/textDict.json'),function(responseText) {
    textEmojis=responseText;
    console.log('Loaded textEmojis');
});
