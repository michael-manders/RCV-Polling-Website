const http = require('http');
const fs = require('fs');
const hostname = '127.0.0.1'
const port = process.env.PORT || 5000; // define port 

const server = http.createServer(async (req, res) => {
    res.statusCode = 200;
    url = req.url.split("?")[0]; // devide the data
    data = req.url.split("?")[1];
    folders = [];
    for (folder of url.replace(/\s/g, "").split('/')) {
        if (folder !== "") folders.push(folder);
    };

    console.log(folders);
    /*
    if the first of the page url is /assets then it will try to read the requested
    file, if it is not there it will return 404.
    if the first part is /page, it will run the corrisponding function that returns 
    the page html. 
    if none of these, return 404
    */
    if (folders[0] === "assets") {
        try {
            res.end(fs.readFileSync(`./assets/${folders[1]}/${folders[2]}`, "utf-8"));
        }
        catch {
            res.statusCode = 404;
            res.end()
        }
    }
    else if (folders[0] === 'pages') {
        try {
            fetchPage(folders[1], data, res);
        }
        catch {
            res.statusCode = 404;
            res.end("404 Page Not Found")
        }
    }
    else if (folders[0] === 'results') {
        votes = getVotes(data);
        
        res.end(JSON.stringify(votes));
    }
    else if (folders[0] == undefined) {
        fetchPage("start", data, res);
    }
    else {
        res.statusCode = 404;
    }
    

});

server.listen(port, () => {
    clearOldVotes();
    setInterval(clearOldVotes, 3600000); //every hour clear the old votes
    console.log(`Server running at http://${hostname}:${port}/`);
})

function getVotes(pin) {
    const json = JSON.parse(fs.readFileSync("./voting.json", 'utf-8'));
    try {
        votes = json[pin]["votes"]
        return votes;
    }
    catch {return 404}
}

function fetchPage(name, data, res) {
    fn = require(`./pages/${name}/${name}`);
    fn.execute(data, res);
}

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

function clearOldVotes() {
    let cutoff = new Date().getTime() - 86400000; // 24 hours ago
    let json = JSON.parse(fs.readFileSync("./voting.json", 'utf-8'));
    for (id in json) {
        let created = new Date(json[id]["created_timestamp"]);
        created = created.getTime(); // get the time it was created
        if (created < cutoff) delete json[id]; // if more than 24 hours ago then delete
    };
    fs.writeFileSync("./voting.json", JSON.stringify(json, null, 4)); //write out json
}   