var style=document.createElement('style');
style.type='text/css';
style.textContent='@font-face{font-family:Sylexiad;src:url("'
+chrome.extension.getURL('scripts/SylexiadSerifMedium.otf')+'");}';
document.head.appendChild(style);
