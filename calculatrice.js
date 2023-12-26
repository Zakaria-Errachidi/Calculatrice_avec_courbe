let history="";
const canvas = document.getElementById("canvas");
let historyDiv = document.getElementById("history");
let fctInput = document.getElementById("fctholder");
function press(num){
    if(window.getComputedStyle(canvas).display === "none"){
        switch(num){
            case "math.sqrt(":
                history += "√(";
                break;
            case "math.cos(":
                history += "cos(";
                break;
            case "math.pow(2)":
                history += "²";
                break;
            case "math.sin(":
                history += "sin(";
                break;
            case "math.log10(":
                history += "log(";
                break;
            case "math.log(":
                history += "ln(";
                break;
            case "math.abs(":
                history += "abs(";
                break;
            default:
                history += num;
        }
        nvpress();
    }
    else{
        let functionName = num.replace(/math\./, ""); // Retire le préfixe "math."
        fctInput.value += functionName;
    }
}

function nvpress(){
    let nvhistory = history
        .replace(/math\.sqrt\(/g, "√(")
        .replace(/Math\.pow\(2\)/g, "²")
        .replace(/math\.cos\(/g, "cos(")
        .replace(/math\.sin\(/g, "sin(")
        .replace(/math\.tan\(/g, "tan(")
        .replace(/math\.log10\(/g, "log(")
        .replace(/math\.abs\(/g, "abs(")
        .replace(/math\.log\(/g, "ln(");

        historyDiv.innerText = nvhistory;
}
function alterner(){
    if(window.getComputedStyle(canvas).display === "block"){
        draw();
    }
    else{
        calculate();
    }
}
function calculate() {
    let computation = history
        .replace(/√\(/g, "Math.sqrt(")
        .replace(/(\d+)²/g, "Math.pow($1, 2)")
        .replace(/cos\(/g, "Math.cos(")
        .replace(/sin\(/g, "Math.sin(")
        .replace(/tan\(/g, "Math.tan(")
        .replace(/log\(/g, "Math.log10(")
        .replace(/ln\(/g, "Math.log(")
        .replace(/abs\(/g, "Math.abs(");
    // Calculez le résultat
    // empilez l'opération et le résultat dans l'historique
    try {
        let result = eval(computation);
        let operation = history + " = " + result;
        let node = document.createElement("DIV");
        let textnode = document.createTextNode(operation);
        node.appendChild(textnode);
        historyDiv.appendChild(node);
        history = result.toString(); // prépare pour la prochaine opération
    } catch(e){
        document.getElementById("result").innerText = "Erreur";
    }
}

function evaluateExpression(expression, x) {
    try {
        expression = expression.replace(/x/g, x);
        expression = expression.replace(/√\(/g, "Math.sqrt(")
                               .replace(/cos\(/g, "Math.cos(")
                               .replace(/sin\(/g, "Math.sin(")
                               .replace(/tan\(/g, "Math.tan(")
                               .replace(/log\(/g, "Math.log10(")
                               .replace(/ln\(/g, "Math.log(")
                               .replace(/(\d+)²/g, "Math.pow($1, 2)")
                               .replace(/abs\(/g, "Math.abs(");
        return eval(expression);
    } catch (error) {
        console.error('Erreur d\'évaluation de l\'expression :', error);
        return NaN;
    }
}
function clearHistory() {
    if(window.getComputedStyle(canvas).display === "none"){
        history="";
        historyDiv.innerText="";
        document.getElementById("result").innerText ="0";
    }
    else{
        fctInput.value="";
    }
}

function del() {
    history=history.slice(0, -1);
    historyDiv.innerText= history;
}


//le listner pour le keyboard

function presskey(num) {
    let key = num.key;
    switch(key) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case "x":
            press(key);
            break;
        case "+":
            press("+");
            break;
        case "-":
            press("-");
            break;
        case "*":
            press("*");
            break;
        case "/":
            press("/");
            break;
        case "%":
            press("%");
            break;
        case "(":
            press("(");
            break;
        case ")":
            press(")");
            break;
        case "^":
            press("**");
            break;
        case "Enter":
            calculate();
            break;
        case "Backspace":
            del();
            break;
        case "Escape":
            clearHistory();
            break;
    }
}
window.addEventListener("keydown", presskey);

    //le graphique
function tracerFonction(ctx) {
    //tracer la fonction f(x)
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    let x;
    for (x= -canvas.width / 2; x <= canvas.width / 2; x += 1) {
        const y = evaluateExpression(document.getElementById("fctholder").value, x / 20) * 20;
        ctx.lineTo((canvas.width / 2) + x, (canvas.height / 2) - y);
    }

    ctx.stroke();
}
function draw() {
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");

        ctx.font = "8px arial";
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";

        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();

        let x;
        let y;
        for (x = -canvas.width / 2; x <= canvas.width / 2; x += 20) {
            ctx.beginPath();
            ctx.moveTo((canvas.width / 2) + x, (canvas.height / 2) - 5);
            ctx.lineTo((canvas.width / 2) + x, (canvas.height / 2) + 5);
            ctx.stroke();
            ctx.fillText((x / 20).toString(), (canvas.width / 2) + x - 5, canvas.height / 2 + 15);
        }
        for (y = -canvas.height / 2; y <= canvas.height / 2; y += 20) {
            ctx.beginPath();
            ctx.moveTo((canvas.width / 2) - 5, (canvas.height / 2) + y);
            ctx.lineTo((canvas.width / 2) + 5, (canvas.height / 2) + y);
            ctx.stroke();
            ctx.fillText((-y / 20).toString(), (canvas.width / 2) + 10, (canvas.height / 2) + y + 5);
        }
        // appeler la fonction pour tracer la fonction
        tracerFonction(ctx);
    }
}

draw();
///methode pour aller du calculatrice au graph
function myfunction() {
let calc=document.getElementById("calculator");
let spec = document.getElementById("spec");
if (window.getComputedStyle(canvas).display === "none") {
    // afficher le canvas et masquer l'historique
    canvas.style.display = "block";
    calc.style.height = "200%";
    historyDiv.style.display = "none";
    spec.style.display = "block";
    }
}
document.getElementById("mafct").addEventListener("click",myfunction);

///methode pour aller du graph au calcul
function mycalcul() {
    let calc=document.getElementById("calculator");
    let spec = document.getElementById("spec");
    if (window.getComputedStyle(canvas).display === "block") {
        // afficher l'historique et masquer le canvas
        canvas.style.display = "none";
        calc.style.height="200%";
        historyDiv.style.display = "block";
        spec.style.display = "none";
    }
}
document.getElementById("clc").addEventListener("click",mycalcul);
//definir zoom+ et zoom-
const zoomButton = document.getElementById("zoom");
const dezoomButton = document.getElementById("dezoom");
let zoomLevel = 1;

function zoomFunction() {
    zoomLevel *= 2;
    updateCanvasSize();
}

function dezoomFunction() {
    if (zoomLevel !== 0) {
        zoomLevel = zoomLevel / 2;
        updateCanvasSize();
    }
}

function updateCanvasSize() {
    canvas.width = 400 / zoomLevel;
    canvas.height = 400 / zoomLevel;
    draw();
}

zoomButton.addEventListener("click", zoomFunction);
dezoomButton.addEventListener("click", dezoomFunction);

