chrome.storage.local.get('fontSize',function(value){
  $('*').each(function(){
    var k=parseInt($(this).css('font-size'));
    var resize=k+value.fontSize;
    $(this).css('font-size',resize);
  });
});
