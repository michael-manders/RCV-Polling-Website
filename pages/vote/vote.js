const fs = require("fs");

module.exports = {execute};

function execute (data, res) {
    let text = fs.readFileSync("./pages/vote/vote.html", "utf-8"); // get the html
    //gets the options from the pin then replaces "options" in the html
    const json = JSON.parse(fs.readFileSync("./voting.json", 'utf-8'))
    if (json[data]) {
        const options = json[data]["options"];
        text = text.replace('"options"', JSON.stringify(options, null, 4)).replace(/{pin}/g, data);

        if (json[data]["multiple_votes"]) {
            text = text.replace(`if (document.cookie.includes`, '//if (document.cookie.includes');
        };
        res.writeHead(200, 'text/html') ;
        res.end(text); // return html
    }
    else {
        res.writeHead(200, 'text/html') 
        res.end(
            `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="refresh" content="3; URL=/pages/enter_pin" />
                <title>Invalid Pin</title>
            </head>
            <body>
                Invalid Pin
            </body>
            </html>
            `
        ); // return html
    }
}

