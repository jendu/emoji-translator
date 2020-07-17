# Emoji Translator + Accessibility
A Google Chrome extension to translate emoji unicode to their textual descriptions. Includes some accessibility features.

## Built with
* [Python](https://www.python.org/) - Used for web scraping Unicode Database into /scripts/emojiDict.json & textDict.json
```
import urllib.request
from bs4 import BeautifulSoup
import json

url='https://unicode.org/emoji/charts/full-emoji-list.html'
request=urllib.request.Request(url)
html=urllib.request.urlopen(request).read()
soup=BeautifulSoup(html,'html.parser')

table=soup.find('table',attrs={'border':'1'})
emojis=table.find_all('tr')

emojilib={}
for emoji in emojis:
	if emoji.find('th')==None:
		char=emoji.find('td',class_='chars').text
		code=emoji.find('td',class_='code').text
		name=emoji.find('td',class_='name').text
		emojidetail={'char':char,'code':code}
		emojilib[name]=emojidetail

with open('emojiDict.json','w',encoding='utf-8') as f:
    json.dump(emojilib,f,ensure_ascii=False,indent=2)
```
* [JavaScript](https://www.javascript.com/) - Used to write chrome extension
* [Atom](https://atom.io/) - Used as text editor

## Resources
* [Regex Tester](https://www.regextester.com/106421) - Emoji regex
* [Unicode](https://unicode.org/emoji/charts/full-emoji-list.html) - Unicode database
* [jQuery](https://jquery.com/) - Expanded JS library
* [jscolor](http://jscolor.com/) - Colour picker
* [OpenDyslexic](https://opendyslexic.org/) - OpenDyslexic typeface
* [Sylexiad](https://www.sylexiad.com/) - Sylexiad font

## Authors
* [JenDu](https://github.com/jendu)
