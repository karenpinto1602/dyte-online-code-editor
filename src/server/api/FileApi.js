const mkdirp = require('mkdirp');
const fs = require('fs');
const getDirName = require('path').dirname;
const path = require('path');

module.exports = {
    getFile(lang, callback){
        let file = '';
        const language = lang.toLowerCase();
        if(language === 'javascript'){
            file = path.join(__dirname, '../templates','Hello.js');
        }
        else if (language === 'python') {
            file = path.join(__dirname, '../templates', 'Hello.py');
        }
        else {
            callback('');
            return;
        }
        console.log(`getTemplate: ${file}`);
        fs.readFile(file,(err,data)=>{
            if(err){
                throw err;
            }
            console.log(data.toString());
            callback(data.toString());
        });
    },

    saveFile(file, code, callback){
        /* creating parent directories if they don't exist */
        mkdirp(getDirName(file), (err) => {
            if(err) return callback(err);

            return fs.writeFile(file, code, (err2) =>{
                if(err2){
                    throw err2;
                }

                callback();
            });
        });
    },
};