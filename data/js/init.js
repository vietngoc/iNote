var iNote = {Style:{}, Notes:[]};
if(!localStorage["iNote"]) {localStorage["iNote"] = JSON.stringify(iNote);}
var iCache = [];
if(!sessionStorage["iCache"]) {sessionStorage["iCache"] = JSON.stringify(iCache);}
