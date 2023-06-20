var q = {
  k1:'v1',
  k2:'v2',
  f1:function(){
    console.log(this.k1);
  },
  f2:function() {
    console.log(this.k2);
  }
}

// q.f1();
// q.f2();

for(var n in q) {
  console.log(q[n]);
}

for(var n in q) {
  console.log(n);
}