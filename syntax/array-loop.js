var number = [1,400,12,34,12,4,135,135,23,624,753,764,8,563,28,734,84,45,674,3567,356];
var i = 0;
var total = 0;
while(i < number.length) {
  total += number[i];
  i += 1;
}
console.log(`total: ${total}`);