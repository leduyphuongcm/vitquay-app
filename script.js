const GEMINI_API_KEY =
"AIzaSyCjr5tsQIR2miLkCC6C0Ise4I8YDzry424";

let totalIncome =
Number(
localStorage.getItem(
"income"
)
) || 0;

let totalExpense =
Number(
localStorage.getItem(
"expense"
)
) || 0;

let history =
JSON.parse(
localStorage.getItem(
"history"
)
) || [];

function saveData(){

localStorage.setItem(
"income",
totalIncome
);

localStorage.setItem(
"expense",
totalExpense
);

localStorage.setItem(
"history",
JSON.stringify(history)
);

}

function updateScreen(){

document.getElementById(
"incomeText"
).innerText =
totalIncome + "đ";

document.getElementById(
"expenseText"
).innerText =
totalExpense + "đ";

document.getElementById(
"profitText"
).innerText =
(totalIncome-totalExpense)
+ "đ";

let list =
document.getElementById(
"historyList"
);

list.innerHTML = "";

history
.slice()
.reverse()
.forEach(function(item){

let li =
document.createElement("li");

li.innerText =
item;

list.appendChild(li);

});

drawChart();

}

function addTransaction(){

let type =
document.getElementById(
"type"
).value;

let category =
document.getElementById(
"category"
).value;

let money =
Number(
document.getElementById(
"money"
).value
);

if(!money){

alert(
"Nhập số tiền"
);

return;

}

let now =
new Date();

let time =
now.getHours()
+ ":" +
now.getMinutes();

if(type == "thu"){

totalIncome += money;

history.push(
"💰 Thu +" +
money +
"đ (" +
category +
") " +
time
);

}

else{

totalExpense += money;

history.push(
"💸 Chi -" +
money +
"đ (" +
category +
") " +
time
);

}

saveData();

updateScreen();

document.getElementById(
"money"
).value = "";

}

function resetData(){

if(
confirm(
"Xóa dữ liệu?"
)
){

totalIncome = 0;
totalExpense = 0;
history = [];

saveData();

updateScreen();

}

}

function startVoice(){

const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

if(!SpeechRecognition){

alert(
"Không hỗ trợ voice"
);

return;

}

const recognition =
new SpeechRecognition();

recognition.lang =
"vi-VN";

recognition.start();

document.getElementById(
"aiResult"
).innerText =
"🎤 Đang nghe...";

recognition.onresult =
function(event){

let text =
event.results[0][0]
.transcript
.toLowerCase();

document.getElementById(
"aiResult"
).innerText =
"🎤 " + text;

let number =
text.match(/\d+/);

if(!number){

document.getElementById(
"aiResult"
).innerText +=
"\n❌ Không thấy số";

return;

}

number =
Number(number[0]);

if(
text.includes("con")
&&
text.includes("vịt")
){

number =
number * 320000;

}

if(
text.includes("bán")
||
text.includes("thu")
){

totalIncome += number;

history.push(
"🎤 Thu +" +
number +
"đ"
);

}

else{

totalExpense += number;

history.push(
"🎤 Chi -" +
number +
"đ"
);

}

saveData();

updateScreen();

document.getElementById(
"aiResult"
).innerText +=
"\n✅ Đã thêm";

};

}

async function askGemini(){

let userText =
document.getElementById(
"aiInput"
).value;

if(!userText){

alert(
"Nhập câu hỏi"
);

return;

}

document.getElementById(
"aiResult"
).innerText =
"🤖 Gemini đang suy nghĩ...";

try{

const response =
await fetch(

"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key="
+ GEMINI_API_KEY,

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},

body:JSON.stringify({

contents:[{

parts:[{

text:userText

}]

}]

})

}

);

const data =
await response.json();

console.log(data);

let aiText =
data?.candidates?.[0]
?.content?.parts?.[0]
?.text;

if(aiText){

document.getElementById(
"aiResult"
).innerText =
aiText;

}

else{

document.getElementById(
"aiResult"
).innerText =
"❌ Gemini không phản hồi";

}

}

catch(error){

console.log(error);

document.getElementById(
"aiResult"
).innerText =
"❌ Gemini lỗi";

}

}

let chart;

function drawChart(){

let ctx =
document.getElementById(
"myChart"
);

if(chart){

chart.destroy();

}

chart =
new Chart(ctx,{

type:"doughnut",

data:{

labels:[
"Thu",
"Chi"
],

datasets:[{

data:[
totalIncome,
totalExpense
]

}]

}

});

}

updateScreen();
