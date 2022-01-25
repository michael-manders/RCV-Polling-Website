const fs = require("fs");

module.exports = {execute};

function execute (data, res) {
    let text = fs.readFileSync("./pages/voted/voted.html", "utf-8"); // get the html
    const json = JSON.parse(fs.readFileSync("./voting.json", 'utf-8'))
    input = JSON.parse(decodeURI(data));

    //write the votes to the json file
    json[input["pin"]]["votes"].push(input["options"]);

    //write out the file
    fs.writeFileSync("./voting.json", JSON.stringify(json, null, 4));

    text = text.replace(/{pin}/g, input["pin"])
    res.writeHead(200, 'text/html') 
    res.end(text); // return html
}

