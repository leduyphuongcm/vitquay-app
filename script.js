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

function formatMoney(number){

return number.toLocaleString(
"vi-VN"
) + "đ";

}

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
formatMoney(totalIncome);

document.getElementById(
"expenseText"
).innerText =
formatMoney(totalExpense);

document.getElementById(
"profitText"
).innerText =
formatMoney(
totalIncome-totalExpense
);

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
"Nhập số tiền 😄"
);

return;

}

let now =
new Date();

let date =
now.toLocaleDateString(
"vi-VN"
);

if(type == "thu"){

totalIncome += money;

history.push(
`💰 Thu +${formatMoney(money)} | ${category} | ${date}`
);

}

else{

totalExpense += money;

history.push(
`💸 Chi -${formatMoney(money)} | ${category} | ${date}`
);

}

saveData();

updateScreen();

closeBox();

}

function openBox(){

document.getElementById(
"popup"
).style.display =
"flex";

}

function closeBox(){

document.getElementById(
"popup"
).style.display =
"none";

}

function analyzeBusiness(){

let profit =
totalIncome-totalExpense;

let result = "";

result +=
"🧠 AI PHÂN TÍCH\n\n";

result +=
"💰 Tổng thu: "
+ formatMoney(totalIncome)
+ "\n";

result +=
"💸 Tổng chi: "
+ formatMoney(totalExpense)
+ "\n";

result +=
"📈 Lợi nhuận: "
+ formatMoney(profit)
+ "\n\n";

if(profit > 10000000){

result +=
"🔥 Kinh doanh rất tốt\n";

}

else if(profit > 0){

result +=
"🙂 Đang có lợi nhuận\n";

}

else{

result +=
"⚠️ Đang lỗ\n";

}

let days = {};

history.forEach(function(item){

let match =
item.match(
/\d{1,2}\/\d{1,2}\/\d{4}/
);

if(!match) return;

let date =
match[0];

if(!days[date]){

days[date] = 0;

}

let money =
item.match(
/([\d,.]+)đ/
);

if(!money) return;

money =
Number(
money[1]
.replace(/\./g,"")
.replace(/,/g,"")
);

if(item.includes("💰")){

days[date] += money;

}

else{

days[date] -= money;

}

});

let bestDay = "";
let bestMoney = -999999999;

let worstDay = "";
let worstMoney = 999999999;

for(let day in days){

if(days[day] > bestMoney){

bestMoney = days[day];
bestDay = day;

}

if(days[day] < worstMoney){

worstMoney = days[day];
worstDay = day;

}

}

result +=
"\n🔥 Bán tốt nhất:\n"
+ bestDay +
" → "
+ formatMoney(bestMoney);

result +=
"\n\n📉 Bán yếu nhất:\n"
+ worstDay +
" → "
+ formatMoney(worstMoney);

document.getElementById(
"analysisResult"
).innerText =
result;

}

function startVoice(){

const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

if(!SpeechRecognition){

alert(
"Thiết bị chưa hỗ trợ 😄"
);

return;

}

const recognition =
new SpeechRecognition();

recognition.lang =
"vi-VN";

recognition.start();

recognition.onresult =
function(event){

let text =
event.results[0][0]
.transcript
.toLowerCase();

let number = 0;

// đọc số thường

let found =
text.match(/\d+/g);

if(found){

number =
Number(
found.join("")
);

}

// hiểu "nghìn"

if(
text.includes("nghìn")
||
text.includes("ngàn")
){

number =
number * 1000;

}

// hiểu "triệu"

if(
text.includes("triệu")
){

number =
number * 1000000;

}


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
`🎤 Thu +${formatMoney(number)}`
);

}

else{

totalExpense += number;

history.push(
`🎤 Chi -${formatMoney(number)}`
);

}

saveData();

updateScreen();

alert(
"✅ Đã thêm bằng giọng nói"
);

};

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
