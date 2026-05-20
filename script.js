let total = 0;

let history = [];

function addMoney(){

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

total += money;

document.getElementById(
"incomeText"
).innerText =
total + "đ";

history.push(
"+ " +
money +
"đ"
);

updateHistory();

document.getElementById(
"money"
).value = "";

}

function updateHistory(){

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

}
