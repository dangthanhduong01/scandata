const fs = require('fs').promises;
const fsSync = require('fs')
const path = require('path');
const crypto = require('crypto');
const directory = 'C:\\Users\\ADMIN\\OneDrive\\Documents\\shell\\';
const request = require('request');
const dotenv = require('dotenv');
require('dotenv').config();

async function walk(dir) {
    // clean data after lastest run 
    // fs.writeFile('err_file.txt', '', function(){console.log('clear file')})
    // fs.writeFile('clean_file.txt', '', function(){console.log('clear file')})
    var list = await fs.readdir(dir);
    for (let file of list) {
        file = path.resolve(dir, file);
        //console.log(file);
        try {
            var stat = await fs.stat(file);
            if (stat && stat.isDirectory()) {
                await walk(file);
                continue
            }
            const sha256hasher = crypto.createHash('SHA256')
            await new Promise(resolve => {
                const stream = fsSync.createReadStream(file)
                stream.pipe(sha256hasher)
                stream.on('close', () => {
                    const sum = sha256hasher.digest('hex')
                    console.log(sum);
                    request({
                        url:`https://www.virustotal.com/api/v3/files/${sum}`,
                        method: 'GET',
                        headers: {'x-apikey': process.env.API_KEY},
                        json: true,
                    },async (e, r, b) => {
                        resolve()
                        if (e) return 
                        if (b.error){
                            console.log(1);
                            await fs.appendFile('err_file.txt',b.error.message+"\n");
                        }else{
                            // console.log(2, b);
                            await fs.appendFile('clean_file.txt',file.toString()+"\r\n");
                            //return process.exit(1)
                        } 
                        //return
                        //process.exit(1)
                    })
                })
            })
        } catch (e) {
            console.error('Error:', file)
        }
    }
}



walk(directory);