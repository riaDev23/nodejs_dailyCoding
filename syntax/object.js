var members = ['riadev', 'k8805', 'hoya'];
console.log(members[1]);
var i = 0;
while(i < members.length) {
  console.log(`arrya loop : ${members[i]}`);
  i += 1;
}

var roles = {
  // key : value
  'programmer' :'riadev',
  'designer' :'k8805',
  'manager' :'hoya'
}
console.log(roles.designer);
console.log('문자로 가져온 정보 : ', roles['designer']);

for(var name in roles) {
  console.log(`object : ${name} // value : ${roles[name]}`);
}