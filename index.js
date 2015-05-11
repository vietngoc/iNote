var data = require('sdk/self').data;
var tabs = require("sdk/tabs");
var buttons = require('sdk/ui/button/action');
var button = buttons.ActionButton({
  id: "iNote",
  label: "iNote - Keep your thinkd",
  icon: {
    "16": "./img/icon-16.png",
    "32": "./img/icon-32.png",
    "64": "./img/icon-64.png"
  },
 onClick: function handleClick (){
    tabs.open("./dashboard.html");
  }
});

var tabs = require("sdk/tabs");
var notifications = require("sdk/notifications");
var store = require("sdk/simple-storage");
var contextmenus = require("sdk/context-menu");
var menu = contextmenus.Item({
  label: "Send to new note",
  image: data.url("./img/icon-16.png"),
  context: contextmenus.SelectionContext(),
  contentScript: 'self.on("click", function () {' +
                '  var text = window.getSelection().toString();' +
                '  self.postMessage(text);' +
                '});',
  onMessage: function (selectionText) {
   if (!store.storage.iCache) store.storage.iCache = [];
   store.storage.iCache.push(selectionText);
   notifications.notify({
     iconURL: data.url("./img/icon-64.png"),
     title: "iNote",
     text: "The text that you selected has been saved",
     onClick: function handleClick (){
        tabs.open("./dashboard.html");
      }
   })
  }
});

var pages = require("sdk/page-mod");
var page = pages.PageMod({
  include: "resource://*",
  contentScriptWhen: "start",
  contentScript:'self.port.on("iCache", function(cache) {' +
                'sessionStorage["iCache"] = JSON.stringify(cache);' +
                'self.port.emit("iNote", "sucess");' +
                '})',
  onAttach: function(worker) {
    worker.port.emit("iCache", store.storage.iCache);
    worker.port.on("iNote", function(result){
    if (result == "sucess") store.storage.iCache = [];
      });
    }
});
