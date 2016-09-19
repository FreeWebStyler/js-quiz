var storage = window['localStorage'];
function cl(m){console.log(m);}

function fadeIn(el) {
quizApp.op+=0.1;
if(quizApp.op>=1) clearInterval(quizApp.inval);
el.style.opacity=quizApp.op;
}

var page = {
    prevpage: 'div_main',
    open: function(page,id){
		var page='div_'+page;
        document.getElementById(this.prevpage).style.display = 'none';
		document.getElementById(page).style.display = 'block';
			this.prevpage = page;
		switch(page){
            case 'div_play':
				quizApp.play(0);
			break;
			case 'div_add':
				document.getElementById('img_add').setAttribute('ontouchend','quizApp.add()');
			if(typeof(id) != 'undefined') quizApp.edit(id); else quizApp.add(0);
            break;
			case 'div_show':		
                 quizApp.show();
            break;
			case 'div_del':		
                 quizApp.del();
            break;
        }
		
	}
}

var quizApp = {
qs:'',
curqs:0,
rightansid:'',
rightanscount:0,
inval:'',
curqsu:0,
op:0,
all:0,
checked:0,

getqs: function(){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('POST','qs.txt', true);
	xmlhttp.onreadystatechange = function () {
	if (xmlhttp.readyState == 4) {
	quizApp.qs=xmlhttp.responseText.split('\n');
	quizApp.all=(quizApp.qs.length+1)/6;
	if(typeof(quizApp.getqsu()) != 'undefined')	quizApp.all+=quizApp.getqsu().split(',').length;
	quizApp.play(1);
   }
}
xmlhttp.send();
},

getqsu: function(){
	var key ='';
	for (var i = 0; i < storage.length; i++){
		key = storage.key(i); 
		if(key.indexOf('quizArr') !== -1) {
		return storage.getItem(key);
		}
	}
},

ansReact: function(id,curp){
	if(id==this.rightans) {
        cl('+');
        this.rightanscount++;
        if(curp==0) this.play(); else this.playu();
	} else {
        if(curp==0) this.play(); else this.playu();
	}
},

play: function(spoint) {
	if(typeof(this.qs) == 'undefined' || this.qs=='' || spoint==0) {this.getqs(); this.rightanscount=0; return;}
	if(spoint==1) this.curqs=0;
	if(this.curqs>=this.qs.length) {
	if(typeof(this.getqsu()) != 'undefined') {this.curqsu=(this.curqs/6)+1; this.curqs=0; this.playu(); return;}
	page.open('main');this.res();this.curqs=0;return;
	}
	document.getElementById('div_anss').innerHTML='';
	if(this.curqs==0) var count=1; else count=(this.curqs/6)+1;
	document.getElementById('div_qs').innerHTML=this.qs[this.curqs];
	document.getElementById('cq').innerHTML=count+'/'+this.all;

	for(i=this.curqs+1;i<this.curqs+5;i++) {
		if(this.qs[i].indexOf('+') !== -1) {this.qs[i] = this.qs[i].replace(/\+/g,'');this.rightans=i;}
		document.getElementById('div_anss').innerHTML+='<div ontouchend=quizApp.ansReact('+i+',0) class=div_ans id='+i+'>'+this.qs[i]+'</div><p>';
	}
	this.curqs+=6;
	document.getElementById('ra').innerHTML=this.rightanscount;
},

playu: function(spoint) {
	var qs=this.getqsu().split(',');
	if(this.curqs==qs.length) {page.open('main');this.res();quizApp.curqs=0;cl('cur'+this.curqs); return;}

	var curi = qs[this.curqs];
	qs=[];
	qs.push(storage.getItem('q|'+curi));
	qs.push(storage.getItem('a1|'+curi));
	qs.push(storage.getItem('a2|'+curi));
	qs.push(storage.getItem('a3|'+curi));
	qs.push(storage.getItem('a4|'+curi));
	cl(qs);
	document.getElementById('div_qs').innerHTML=qs[0];
	document.getElementById('cq').innerHTML=this.curqsu+'/'+this.all;

	document.getElementById('div_anss').innerHTML='';
	for (var i=1; i<qs.length; i++){
		if(qs[i].indexOf('+') !== -1) {qs[i] = qs[i].replace(/\+/g,'');this.rightans=i;}
		document.getElementById('div_anss').innerHTML+='<div ontouchend=quizApp.ansReact('+i+') class=div_ans id='+i+'>'+qs[i]+'</div><p>';
	}
	document.getElementById('ra').innerHTML=this.rightanscount;
	this.curqsu++;
	this.curqs++;
},

res: function(){
	document.getElementById('div_res').style.opacity=0;
	document.getElementById('div_res').style.display='block';
	this.op=0;
	this.inval = setInterval(fadeIn,50,document.getElementById('div_res'));
	if(this.qs=='') return;
	document.getElementById('res').style.color='black';
	if(this.rightanscount==1) var ph=' правильный ответ';  else var ph=' правильных ответов';
	document.getElementById('res').innerHTML = '<p><b style=font-size:32>Ваш результат</b><p>'+this.rightanscount+ph+'<br><br><div class=button>OK</div>';	
},

closeres: function(){
	document.getElementById('div_res').style.display='none';
	document.getElementById('div_res').style.opacity=0;
},

add:function(spoint) {
	if(spoint==0) return;
	var q = document.getElementById('q').value;
	var a1 = document.getElementById('a1').value;
	var a2 = document.getElementById('a2').value;
	var a3 = document.getElementById('a3').value;
	var a4 = document.getElementById('a4').value;
	if(q =='' || a1=='' || a2=='' || a3=='' || a4=='') {alert('Не все поля заполнены!'); return;}

	var key ='';
	for (var i = 0; i < storage.length; i++){
		key = storage.key(i); 
		if(key.indexOf('quizArr') !== -1) {
		var quizArr = storage.getItem(key);
		storage.removeItem(key);}
	}
	
	if (typeof(quizArr) == 'undefined') var quizArr = new Array(); else quizArr = quizArr.split(',');
	var rand=Math.random();
	quizArr.push(rand);
	storage.setItem('quizArr|'+rand, quizArr);
	storage.setItem('q|'+rand, q);
	storage.setItem('a1|'+rand, a1);
	storage.setItem('a2|'+rand, a2);
	storage.setItem('a3|'+rand, a3);
	storage.setItem('a4|'+rand, a4);
	page.open('main');
},

show: function(){
	var key ='';
	for (var i=0;i<storage.length; i++){
		key = storage.key(i); 
		if(key.indexOf('quizArr') !== -1) {
		var quizArr = storage.getItem(key);
		}
	}
	
	if (typeof(quizArr) != 'undefined') quizArr = quizArr.split(','); else {
	document.getElementById('div_questions').innerHTML='<div style="margin-top:125px;font:bold 32px Lato">Вопросов нет</div>';
	return;}	
	document.getElementById('div_questions').innerHTML='';
	for (var i=0; i<quizArr.length; i++){
	var q = storage.getItem('q|'+quizArr[i]);
	document.getElementById('div_questions').innerHTML+=('<div class=div_ques align=left ontouchend=page.open("add","'+quizArr[i]+'")>'+q+'<span class=span_arr><img src=img/rarr.png class=img_rarr></span></div>');
	}
},

edit:function(id){
	document.getElementById('img_add').innerHTML='Сохранить';
	document.getElementById('img_addb').setAttribute('ontouchend','page.open("show")');
	document.getElementById('img_add').setAttribute('ontouchend','quizApp.save('+id+')');
	document.getElementById('q').value=storage.getItem('q|'+id);
	document.getElementById('a1').value=storage.getItem('a1|'+id);
	document.getElementById('a2').value=storage.getItem('a2|'+id);
	document.getElementById('a3').value=storage.getItem('a3|'+id);
	document.getElementById('a4').value=storage.getItem('a4|'+id);
},

save:function(id){
	var q = document.getElementById('q').value;
	var a1 = document.getElementById('a1').value;
	var a2 = document.getElementById('a2').value;
	var a3 = document.getElementById('a3').value;
	var a4 = document.getElementById('a4').value;
	if(q =='' || a1=='' || a2=='' || a3=='' || a4=='') {alert('Не все поля заполнены!'); return;}
	storage.setItem('q|'+id, q);
	storage.setItem('a1|'+id, a1);
	storage.setItem('a2|'+id, a2);
	storage.setItem('a3|'+id, a3);
	storage.setItem('a4|'+id, a4);
	page.open('show');
},

check:function(id){
	id+='';
	var into=0;
	if(this.checked==0) this.checked=[];

	for (var key in this.checked) {
	if(this.checked[key]==id) {into=1;
	cl('key='+this.checked[key]);
	this.checked.splice(this.checked.indexOf(id),1);
	document.getElementById('img_'+id).src='img/checkce.png';
	break;
	}
}
if(into==0) {this.checked.push(id);document.getElementById('img_'+id).src='img/checkc.png';}
},

del:function(id){
	this.checked=0;
	var key ='';
	for (var i=0;i<storage.length; i++){
		key = storage.key(i); 
		if(key.indexOf('quizArr') !== -1) {
		var quizArr = storage.getItem(key);
		}
	}
	
	if (typeof(quizArr) != 'undefined') quizArr = quizArr.split(','); else {
	document.getElementById('div_questions').innerHTML='<div style="margin-top:100px;font:bold 32px Lato">1Вопросов нет</div>';
	return;}	
	document.getElementById('div_delquestions').innerHTML='';
	for (var i=0; i<quizArr.length; i++){
	var q = storage.getItem('q|'+quizArr[i]);
	document.getElementById('div_delquestions').innerHTML+=('<div id='+quizArr[i]+' class=div_ques align=left ontouchend=quizApp.check("'+quizArr[i]+'")><img id=img_'+quizArr[i]+' src=img/checkce.png class=img_checkc>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '+q+'<span class=span_arr><img src=img/rarr.png class=img_rarr></span></div>');
	}
},

delAction:function() {
	var key ='';
	for (var i=0;i<storage.length; i++){
		key = storage.key(i); 
		if(key.indexOf('quizArr') !== -1) {
		var quizArr = storage.getItem(key);
		storage.removeItem(key);
		}
}
	quizArr = quizArr.split(',');

	for (i=0;i<this.checked.length;i++) {
	quizArr.splice(quizArr.indexOf(this.checked[i]),1);
	storage.removeItem('q|'+this.checked[i]);
	storage.removeItem('a1|'+this.checked[i]);
	storage.removeItem('a2|'+this.checked[i]);
	storage.removeItem('a3|'+this.checked[i]);
	storage.removeItem('a4|'+this.checked[i]);
	}
	var rand=Math.random();
	if(quizArr.length>0) storage.setItem('quizArr|'+rand,quizArr);
	page.open('show');
},

getquizArr: function(){
	var key ='';
	for (var i=0; i<storage.length;i++){
		key = storage.key(i); 
		if(key.indexOf('quizArr') !== -1) {
		storage.removeItem(key);
		return storage.getItem(key);
		}
	}
},

view: function(id){
	this.noteid=id;
	var title=storage.getItem('title|'+id);
	var date = storage.getItem('date|'+id);
	var note=storage.getItem('note|'+id);
	var check=storage.getItem('check|'+id);  if(check=='true') document.getElementById('div_view').style.background=this.markStyle; else document.getElementById('div_view').style.background='#000';
	document.getElementById('div_view').innerHTML=('<span style=font-size:25px>'+title+'</span><br><span style=font-size:15px>'+date+'</span><p><div align=left>'+note+'</div>');
}

}
//page.open('del');
//document.addEventListener('DOMContentLoaded', quizApp.getqs(), false);