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

let bankMoney =
Number(
localStorage.getItem(
"bankMoney"
)
) || 0;

let history =
JSON.parse(
localStorage.getItem(
"history"
)
) || [];

let currentType = "thu";

// ======================
// GROQ API
// ======================

const GROQ_API_KEY =
"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";

// ======================
// FORMAT
// ======================

function formatMoney(number){

return number.toLocaleString(
"vi-VN"
) + "đ";

}

// ======================
// SAVE
// ======================

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
"bankMoney",
bankMoney
);

localStorage.setItem(
"history",
JSON.stringify(history)
);

}

// ======================
// UPDATE SCREEN
// ======================

function updateScreen(){

let cash =
totalIncome-totalExpense;

let total =
cash + bankMoney;

document.getElementById(
"cashText"
).innerText =
formatMoney(cash);

document.getElementById(
"bankText"
).innerText =
formatMoney(bankMoney);

document.getElementById(
"profitText"
).innerText =
formatMoney(total);

// HISTORY

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

// CHART

drawChart();

}

// ======================
// POPUP
// ======================

function openPopup(type){

currentType = type;

document.getElementById(
"popup"
).style.display =
"flex";

if(type == "thu"){

document.getElementById(
"popupTitle"
).innerText =
"💰 Thêm khoản thu";

}

else{

document.getElementById(
"popupTitle"
).innerText =
"💸 Thêm khoản chi";

}

}

function closePopup(){

document.getElementById(
"popup"
).style.display =
"none";

}

// ======================
// ADD TRANSACTION
// ======================

function addTransaction(){

let money =
Number(
document.getElementById(
"money"
).value
);

let note =
document.getElementById(
"note"
).value;

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

let time =
now.getHours()
+ ":" +
now.getMinutes();

if(currentType == "thu"){

totalIncome += money;

history.push(
`💰 +${formatMoney(money)}
📝 ${note}
🕒 ${date} ${time}`
);

}

else{

totalExpense += money;

history.push(
`💸 -${formatMoney(money)}
📝 ${note}
🕒 ${date} ${time}`
);

}

saveData();

updateScreen();

closePopup();

document.getElementById(
"money"
).value = "";

document.getElementById(
"note"
).value = "";

}

// ======================
// VOICE
// ======================

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

console.log(text);

// ======================
// NUMBER
// ======================

let number = 0;

let found =
text.match(/\d+/g);

if(found){

number =
Number(
found.join("")
);

}

// triệu

if(
text.includes("triệu")
){

if(number < 1000){

number =
number * 1000000;

}

}

// nghìn

else if(
text.includes("nghìn")
||
text.includes("ngàn")
){

if(number < 1000){

number =
number * 1000;

}

}

// vịt

if(
text.includes("con")
&&
text.includes("vịt")
){

number =
number * 320000;

}

if(!number){

alert(
"Không nghe rõ 😄"
);

return;

}

// ======================
// BIDV
// ======================

if(
text.includes("bidv")
){

if(
text.includes("thu")
){

bankMoney += number;

history.push(
`🏦 BIDV +${formatMoney(number)}`
);

}

else if(
text.includes("chi")
){

bankMoney -= number;

history.push(
`🏦 BIDV -${formatMoney(number)}`
);

}

else if(
text.includes("còn")
||
text.includes("số dư")
){

bankMoney = number;

history.push(
`🏦 BIDV = ${formatMoney(number)}`
);

}

saveData();

updateScreen();

alert(
"✅ Đã cập nhật BIDV"
);

return;

}

// ======================
// THU
// ======================

if(
text.includes("thu")
||
text.includes("bán")
){

totalIncome += number;

history.push(
`🎤 Thu +${formatMoney(number)}`
);

}

// ======================
// CHI
// ======================

else{

totalExpense += number;

history.push(
`🎤 Chi -${formatMoney(number)}`
);

}

saveData();

updateScreen();

alert(
"✅ Đã thêm giao dịch"
);

};

}

// ======================
// AI PHÂN TÍCH
// ======================

function analyzeBusiness(){

let cash =
totalIncome-totalExpense;

let total =
cash + bankMoney;

let result = "";

result +=
"🧠 AI PHÂN TÍCH\n\n";

result +=
"💵 Tiền mặt: "
+ formatMoney(cash)
+ "\n";

result +=
"🏦 BIDV: "
+ formatMoney(bankMoney)
+ "\n";

result +=
"📈 Tổng tài sản: "
+ formatMoney(total)
+ "\n\n";

if(total > 10000000){

result +=
"🔥 Tình hình tài chính tốt.\n";

}

else if(total > 0){

result +=
"🙂 Dòng tiền đang ổn.\n";

}

else{

result +=
"⚠️ Cần kiểm soát chi tiêu.\n";

}

result +=
"\n💡 Gợi ý:\n";

result +=
"• Theo dõi ngày bán mạnh\n";

result +=
"• Giảm chi phí không cần thiết\n";

result +=
"• Tăng livestream cuối tuần 😄";

document.getElementById(
"analysisResult"
).innerText =
result;

}

// ======================
// GROQ AI CHAT
// ======================

async function askAI(){

let question =
document.getElementById(
"aiInput"
).value;

if(!question){

alert(
"Nhập câu hỏi 😄"
);

return;

}

document.getElementById(
"aiChatResult"
).innerText =
"🤖 AI đang suy nghĩ...";

try{

const response =
await fetch(

"https://api.groq.com/openai/v1/chat/completions",

{

method:"POST",

headers:{

"Content-Type":
"application/json",

Authorization:
`Bearer ${GROQ_API_KEY}`

},

body:JSON.stringify({

model:
"llama-3.3-70b-versatile",

messages:[

{

role:"system",

content:
`
Bạn là trợ lý tài chính cá nhân.

Hãy:
- phân tích thu chi
- phân tích kinh doanh
- trả lời ngắn gọn
- trả lời tiếng Việt
`

},

{

role:"user",

content:
`
Tiền mặt:
${totalIncome-totalExpense}

BIDV:
${bankMoney}

Lịch sử:
${history.join("\n")}

Câu hỏi:
${question}
`

}

]

})

}

);

const data =
await response.json();

console.log(data);

// ERROR

if(data.error){

document.getElementById(
"aiChatResult"
).innerText =
"❌ " +
data.error.message;

return;

}

// SUCCESS

document.getElementById(
"aiChatResult"
).innerText =
data.choices[0]
.message.content;

}

catch(error){

console.log(error);

document.getElementById(
"aiChatResult"
).innerText =
"❌ AI lỗi";

}

}

// ======================
// CHART
// ======================

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
"Tiền mặt",
"BIDV"
],

datasets:[{

data:[

totalIncome-totalExpense,
bankMoney

]

}]

}

});

}

// ======================
// CLEAR DATA
// ======================

function clearData(){

let confirmDelete =
confirm(
"Xóa toàn bộ dữ liệu?"
);

if(!confirmDelete){

return;

}

localStorage.clear();

totalIncome = 0;
totalExpense = 0;
bankMoney = 0;
history = [];

updateScreen();

alert(
"✅ Đã xóa dữ liệu"
);

}

// ======================
// ADJUST MONEY
// ======================

function adjustMoney(){

let cash =
prompt(
"Nhập số dư tiền mặt"
);

if(cash !== null){

totalIncome =
Number(cash);

totalExpense = 0;

}

let bank =
prompt(
"Nhập số dư BIDV"
);

if(bank !== null){

bankMoney =
Number(bank);

}

saveData();

updateScreen();

alert(
"✅ Đã cập nhật số dư"
);

}

// ======================
// START
// ======================

updateScreen();
