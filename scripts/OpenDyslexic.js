var style=document.createElement('style');
style.type='text/css';
style.textContent='@font-face{font-family:OpenDyslexic;src:url("'
+chrome.extension.getURL('scripts/OpenDyslexic-Regular.otf')+'");}';
document.head.appendChild(style);
