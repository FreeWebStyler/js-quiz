function cl(m){ console.log(m);}
function ge(id){return document.getElementById(id);} function qs(id){return document.querySelector(id);}
function op(obj){var str=''; for(p in obj) str+='Property name:'+p+' value:'+obj[p]+'\n';return str;}
function ol(obj){var size = 0, key; for(key in obj) if(obj.hasOwnProperty(key)) size++; return size;}

var storage = window['localStorage'];

function toFixed(n,f){
 if(typeof n == 'string') n=parseFloat(n); if(typeof f=='undefined') f=1;
 n=n+''; var ppos = n.indexOf('.'); n=n.split('.'); if(n.length==1 || f==0) return parseInt(n[0]); nd=[];
 for(var i=0;i<n[1].length;i++) if(i<=f-1){if(n[1][i]=='0' && i==f-1) nd[i]=''; else nd[i]=n[1][i];} else nd[i]='';
 nd=nd.join(''); return parseFloat(n[0]+'.'+nd);
}
