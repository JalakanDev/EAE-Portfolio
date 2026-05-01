let res;

function dur() { // Calculating code here
    var num1 = document.getElementById("Num1").value;
    var op = document.getElementById("ops").value;
    var num2 = document.getElementById("Num2").value;
    document.getElementById("text").style.display = "inline-block";
    if (isNaN(num1) || isNaN(num2)) {
        document.getElementById('text').innerHTML = "Inputs must be a number!";
    } else {
        if (op == "+") {
            res = parseFloat(num1) + parseFloat(num2);
        } else if (op == "-") {
            res = parseFloat(num1) - parseFloat(num2);
        } else if (op == "×") {
            res = parseFloat(num1) * parseFloat(num2);
        } else if (op == "÷") {
            res = parseFloat(num1) / parseFloat(num2);
        } // is there any other way to simplify this??
        var result = num1 + op + num2 + " = " + res; // result
        result = result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        document.getElementById('text').innerHTML = result; // display it
    }
    return res;
}

function resett() {
    document.getElementById("form").reset();
    document.getElementById("ops").selectedIndex = 0;
    return 0;
}