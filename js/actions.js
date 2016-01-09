'use strict';

let _lines = [];
let _path = '';

switch (require('process').platform) {
  case 'darwin':
    _path = '/Users/jiang.hongfei/Desktop/english.txt';
    break;
  case 'win32':
    _path = 'd:/backup/english/english.txt';
    document.querySelector('header h1.title').style.display = 'none';
    break;
}

reload();

function openFile() {
  const dialog = require('remote').require('dialog');
  let selection = dialog.showOpenDialog({
    filters: [
      { name: 'text', extensions: ['txt'] }
    ]});
  
  if (selection && selection[0]) {
    _path = selection[0];
    
    reload();
  }
}

function reload() {
  let element = document.getElementById('bottom_status');
  element.innerText = _path;
  
  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(_path)
  });

  let index = 0;
  _lines = [];
  
  lineReader.on('line', (line) => {
    if (line) {
      _lines.push({ index: index++, text: line });
    }
  }).on('close', () => {
    console.log('end: ' + _lines.length);
    
    sort();
  });
}

function sort() {
  let elements = document.getElementsByClassName('window-content');
  if (elements.length > 0) {
    let content = '<ul class="lines">';

    for (let line of _lines) {
      content += `<li><span>${pad(line.index)} </span>${line.text}</li>`
    }

    content += '</ul>';
    elements[0].innerHTML = content;
  }
}

function shuffle() {
  let elements = document.getElementsByClassName('window-content');
  if (elements.length > 0) {
    let content = '<ul class="lines">';

    let shuffled = fisherYates(_lines);
    for (var i = 0, len = shuffled.length; i < len; i++) {
      let line = shuffled[i];
      content += `<li><span>${pad(i)} / ${pad(line.index)} </span>${line.text}</li>`
    }

    content += '</ul>';
    elements[0].innerHTML = content;
  }
}

function fisherYates (myArray) {
  var copy = [...myArray];
  var i = copy.length;

  while (--i) {
     var j = Math.floor(Math.random() * (i + 1));
     var tempi = copy[i];
     var tempj = copy[j];
     copy[i] = tempj;
     copy[j] = tempi;
   }
   
   return copy;
}

function pad(num) {
  let size = 4;
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}