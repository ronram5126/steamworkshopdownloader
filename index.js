const fs = require("fs");
const jsdom = require("jsdom");
const axios = require("axios").default;
var Download = require('download-file')
const { JSDOM } = jsdom;

const urls = fs.readFileSync("./urls.txt").toString().split("\n");

async function download(count = 0) {
    const url = urls[count];
    if (count >= urls.length) {
        return;
    }
    await axios.get(url).then(async ({data}) => {
        
        const dom = new JSDOM(data);
        const window = dom.window;
        const document = window.document;
        const linkArray = [].slice.call(document.getElementsByClassName("collectionItem")).map(a => a.children[2].children[0]);
        const namedUrlArray = linkArray.map(link => [link.href, link.children[0].textContent])
        const collectionName = document.getElementsByClassName("workshopItemTitle")[0].textContent;
        console.log(`downloading ${collectionName}`);
        for (let idx = 0; idx < namedUrlArray.length; idx ++) {
            const [link, packageName] = namedUrlArray[idx];
            const steamId = link.split("?id=")[1];
            
            await axios.get(`http://steamworkshop.download/download/view/${steamId}`).then(async ({data}) => {
                const dom = new JSDOM(data);
                const { window } = dom;
                const { document } = window;
                const link = document.getElementsByTagName("table")[0].children[0].children[0].children[0].children[1].children[0];
                
                const url = link.href;
                                
                const options = {
                    directory: `./downloads/${collectionName}`,
                    filename: `${packageName.split("/").join("")}.civmod`
                }
                
                console.log(`    ${idx}. ${packageName}`);
                await new Promise(res => Download(url, options, function(err){
                    if (err) {
                        console.log(collectionName);
                        console.log(packageName);
                        console.log(err);
                    }
                    
                    res();
                }));
            }).catch(err => {
                console.log(packageName);
                console.log(collectionName);
                console.log(err);
            });

            
        };
        

    }).catch(err => {
        console.log(url);
        console.log(err);
    });
    await download(count + 1);
};

download();

