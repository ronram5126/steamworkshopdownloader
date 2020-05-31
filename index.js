const fs = require("fs");
const jsdom = require("jsdom");
const axios = require("axios").default;
const { DownloaderHelper }  = require("node-downloader-helper");

const { JSDOM } = jsdom;

const urls = fs.readFileSync("./urls.txt").toString().split("\n");

function last(arr) {
    if (Array.isArray(arr) && arr.length > 0) {
        return arr[arr.length - 1];
    } else {
        return undefined;
    }
}
function validName(name) {
    return name
        .split(/[\*\/\\\|\?\"\'\:\;]/).join(" ")
        .split(/[{[<]/).join("(")
        .split(/[}\]>]/).join(")");
}

async function download(count = 0) {
    const url = urls[count];
    if (count >= urls.length) {
        return;
    }
    const downloadDir = "./downloads";
    if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir);
    }
    if (url.includes("http"))
    await axios.get(url).then(async ({data}) => {
        
        const dom = new JSDOM(data);
        const window = dom.window;
        const document = window.document;
        const linkArray = [].slice.call(document.getElementsByClassName("collectionItemDetails")).map(a => a.children[0]);
        const namedUrlArray = linkArray.map(link => [link.href, link.children[0].textContent])
        
        const collectionName = document.getElementsByClassName("workshopItemTitle")[0].textContent;
        const collectionDir = `${downloadDir}/${validName(collectionName)}`;

        if (!fs.existsSync(collectionDir)) {
            fs.mkdirSync(collectionDir)
        }

        const appId = last(
            document.getElementsByClassName('breadcrumbs')[0]
            .getElementsByTagName('a')[0]
            .href.split('/')
        );
        
        console.log(`downloading ${collectionName}`);
        
        for (let idx = 0; idx < namedUrlArray.length; idx ++) {
            const [link, packageName] = namedUrlArray[idx];
            const workshopId = link.split("?id=")[1];
            const url = `http://steamworkshop.download/download/view/${workshopId}`;
            const fileName =  validName(`${packageName.split("/").join("")}${process.argv[2]||".zip"}`);
            
            if (fs.existsSync(collectionDir + '/' + fileName)){
                console.log(`Skipping ${packageName.split("/").join("")}, file already downloaded`)

            } else {
                await axios.get(url).then(async ({data}) => {
                    const dom = new JSDOM(data);
                    const { window } = dom;
                    const { document } = window;

                    const subDownloadButton = document.getElementById("steamdownload");

                    
                    // const filePath = `${collectionDir}/${fileName}`
                    
                    console.log(`    ${idx}. ${packageName}`);
                    if (subDownloadButton) {
                        let response = await axios.post("http://steamworkshop.download/online/steamonline.php", `item=${workshopId}&app=${appId}`);
                        const url = last(response.data.split("<a href='")).split("'>")[0];
                        await downloadAndSave(url, collectionDir, fileName);
                    } else {
                        const link = document.getElementsByTagName("table")[0].children[0].children[0].children[0].children[1].children[0];
                        const url = link.href;
                        await downloadAndSave(url, collectionDir, fileName);
                    }

                }).catch(err => {
                    console.log(packageName);
                    console.log(collectionName);
                    console.log(err);
                });
            }
        };
        

    }).catch(err => {
        console.log(url);
        console.log(err);
    });
    await download(count + 1);
};

async function downloadAndSave(url, dir, fileName) {
    await new Promise((res, rej) => {
        const helper = new DownloaderHelper(url, dir, { fileName });
        helper.on('end', (...args) =>  {
            res(args)
        });
        helper.on('error', (...args) => {
            console.error(args);
            rej(args);
        } );
        helper.start();
    });
}

// async function downloadAndSave(url, filePath) {
//     const response = await axios.get(url);
//     console.log(response.status);
//     Object.keys(response.headers).forEach(res => {
//         console.log(`${res}: ${JSON.stringify(response.headers[res])}`)
//     });
//     await savefile(response.data, filePath);
// }

// async function savefile(data, filePath) {
    
//     await new Promise((res, rej) => {
//         fs.writeFile(filePath, data, (err) => {
//             if(err) {
//                 rej(err);
//             }
//             res();
//         })
//     });
    
// }


download();


