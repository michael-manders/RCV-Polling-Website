const fs = require("fs");

module.exports = {execute};

function execute (data, res) {
    let text = fs.readFileSync("./pages/create_vote/create_vote.html", "utf-8"); // get the html
    res.writeHead(200, 'text/html') 
    res.end(text); // return html
}