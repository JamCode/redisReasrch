var a = {
    a: 123,
    b: 234,
    c: 345
};


console.log(Object.keys(a).length);

a.forEach(function(e){
    console.log(e);
});

for (var variable in a) {
    console.log(variable+" "+ a[variable]);
}

function getBytesLength(str) {
    return str.replace(/[^\x00-\xff]/gi, "--").length;
}

var str = 'ssssddd我我我是';
console.log(getBytesLength(str));
