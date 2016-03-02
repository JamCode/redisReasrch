var a = {
    a: 123,
    b: 234,
    c: 345
};

for (var variable in a) {
    console.log(variable+" "+ a[variable]);
}
