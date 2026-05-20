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

let orders =
history.filter(
x => x.includes("💰")
).length;

document.getElementById(
"ordersText"
).innerText =
orders;

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

function formatMoney(number){

return number.toLocaleString(
"vi-VN"
) + "đ";

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
"Nhập tiền 😄"
);

return;

}

let now =
new Date();

let date =
now.toLocaleDateString(
"vi-VN"
);

let time =
now.getHours()
+ ":" +
now.getMinutes();

if(type == "thu"){

totalIncome += money;

history.push(
`💰 Thu +${formatMoney(money)} | ${category} | ${date} ${time}`
);

}

else{

totalExpense += money;

history.push(
`💸 Chi -${formatMoney(money)} | ${category} | ${date} ${time}`
);

}

saveData();

updateScreen();

document.getElementById(
"money"
).value = "";

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

let number =
text.match(/\d+/);

if(!number){

alert(
"Không nghe rõ 😄"
);

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

};

}

function analyzeBusiness(){

let profit =
totalIncome-totalExpense;

let orders =
history.filter(
x => x.includes("💰")
).length;

let avg =
orders > 0
? Math.round(totalIncome/orders)
: 0;

let result = "";

result +=
"🧠 AI PHÂN TÍCH KINH DOANH\n\n";

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
+ "\n";

result +=
"🦆 Tổng đơn: "
+ orders +
"\n";

result +=
"📊 Trung bình / đơn: "
+ formatMoney(avg)
+ "\n\n";

// =======================
// PHÂN TÍCH THEO NGÀY
// =======================

let dailyData = {};

history.forEach(function(item){

let match =
item.match(
/(\d{1,2}\/\d{1,2}\/\d{4})/
);

if(!match) return;

let date =
match[1];

if(!dailyData[date]){

dailyData[date] = {

thu:0,
chi:0

};

}

let moneyMatch =
item.match(
/([\d,.]+)đ/
);

if(!moneyMatch) return;

let money =
Number(
moneyMatch[1]
.replace(/\./g,"")
.replace(/,/g,"")
);

if(item.includes("💰")){

dailyData[date].thu += money;

}

if(item.includes("💸")){

dailyData[date].chi += money;

}

});

// tìm ngày mạnh nhất

let bestDay = "";
let bestProfit = -999999999;

let worstDay = "";
let worstProfit = 999999999;

for(let day in dailyData){

let p =
dailyData[day].thu
-
dailyData[day].chi;

if(p > bestProfit){

bestProfit = p;
bestDay = day;

}

if(p < worstProfit){

worstProfit = p;
worstDay = day;

}

}

result +=
"📅 PHÂN TÍCH THEO NGÀY\n\n";

if(bestDay){

result +=
"🔥 Bán tốt nhất:\n";

result +=
bestDay +
" → "
+ formatMoney(bestProfit)
+ "\n\n";

}

if(worstDay){

result +=
"📉 Bán yếu nhất:\n";

result +=
worstDay +
" → "
+ formatMoney(worstProfit)
+ "\n\n";

}

// AI nhận xét

if(profit > 10000000){

result +=
"🔥 Tháng này kinh doanh rất mạnh.\n";

result +=
"👉 Có thể mở rộng bán thêm.\n\n";

}

else if(profit > 0){

result +=
"🙂 Tháng này có lợi nhuận.\n";

result +=
"👉 Nên tăng quảng cáo Facebook.\n\n";

}

else{

result +=
"⚠️ Đang lỗ.\n";

result +=
"👉 Nên giảm chi phí.\n\n";

}

if(avg > 300000){

result +=
"🦆 Giá trị đơn hàng tốt.\n";

}

else{

result +=
"📉 Đơn hàng hơi thấp.\n";

}

if(totalExpense > totalIncome*0.7){

result +=
"⚠️ Chi phí đang quá cao.\n";

}

if(orders < 5){

result +=
"📉 Lượng khách thấp.\n";

}

if(orders > 20){

result +=
"🔥 Khách rất đông.\n";

}

result +=
"\n🤖 GỢI Ý AI:\n";

result +=
"• Livestream giờ tối\n";

result +=
"• Đăng Facebook chiều\n";

result +=
"• Combo vịt + nước sẽ tăng doanh thu\n";

result +=
"• Khuyến mãi ship giúp tăng đơn\n";

document.getElementById(
"analysisResult"
).innerText =
result;

}
