const fs = require("fs");

module.exports = {execute};

function execute (data, res) {
    let text = fs.readFileSync("./pages/view/view.html", "utf-8"); // get the html
    text = text.replace(/{pin}/g, data)
    res.writeHead(200, 'text/html') 
    res.end(text); // return html
}