const fs = require("fs");

module.exports = {execute};

function execute (data, res) {

    const input = JSON.parse(decodeURI(data));
    let running = JSON.parse(fs.readFileSync("./voting.json", 'utf-8'));

    usedPINS = [];
    for (i in running) usedPINS.push(i);

    let pin = Math.round(Math.random() * (999999 - 100000) + 100000);

    while (usedPINS.includes(`${pin}`)) {        
        pin = Math.round(Math.random() * (999999 - 100000) + 100000);
    };

    running[pin] = {
        "options": input["options"],
        "votes": [],
        "created_timestamp": new Date(),
        "multiple_votes": input["multiple_votes"]
    };

    fs.writeFileSync("./voting.json", JSON.stringify(running, null, 4))

    let text = fs.readFileSync("./pages/created/created.html", "utf-8"); // get the html
    text = text.replace(/{pin}/g, pin)
    res.writeHead(200, 'text/html') 
    res.end(text); // return html
}

