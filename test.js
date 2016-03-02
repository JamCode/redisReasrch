var a = {
    a: 123,
    b: 234,
    c: 345
};


console.log(Object.keys(a).length);

for (var variable in a) {
    console.log(variable+" "+ a[variable]);
}
