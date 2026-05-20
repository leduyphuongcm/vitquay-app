let total = 0;

function addMoney(){

let money =
Number(
document.getElementById(
"money"
).value
);

total += money;

document.getElementById(
"result"
).innerText =
total + "đ";

}
