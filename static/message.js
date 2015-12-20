'use strict';

function sendMessage() {
  let msg = document.getElementById('msg').value;
  console.log(msg);
  let xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:3000/message');
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onload = function() {
    if (xhr.status === 200) {
      let response = JSON.parse(xhr.responseText);
      var dv = document.createElement('div');
      dv.innerHTML = '<div class="bubbledRight">' + response.message + '</div>';
      document.getElementById('chat').appendChild(dv)
      setScrollDepth();
    }
  };
  console.log('sending:' + msg);
  var dv = document.createElement('div');
  dv.innerHTML = '<div class="bubbledLeft">' + msg + '</div>';
  document.getElementById('chat').appendChild(dv)

  xhr.send(JSON.stringify({ message: msg }));
}

function setScrollDepth() {
  let objDiv = document.getElementById('div_chat_window');
  objDiv.scrollTop = objDiv.scrollHeight;
}
