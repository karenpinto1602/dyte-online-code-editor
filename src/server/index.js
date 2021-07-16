const express = require('express');
const bodyParser = require('body-parser');

const FileApi = require('./api/FileApi');
const RunnerManager = require('./compiler/RunnerManager');

const PORT = process.env.PORT || 8080;

const app = express();

/* Configuring expresss to use body-parser as middle-ware */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* server static files */
app.use(express.static('dist'));

/* Adding headers to enable CORs to support cross domain communication */
app.use((req, res, next) =>{
    /* Website to allow connect */
    res.setHeader('Access-Control-Allow-Origin', '*');

    /* Request method allowed */
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,PATCH,DELETE');

    /* Request headers allowed */
    res.setHeader('Access-Control-Allow-Header', 'X-Requested-With, connect-type');

    /* Set to true if website needs to include cookies in the requests sent to the API */
    res.setHeader('Access-Control-Allow-Credentials', true);

    /* Pass to next layer of middleware */
    next();
});

app.get('/api/file/:lang',(req,res)=>{
    const language = req.params.lang;
    console.log(langauge);
    FileApi.getFile(language,(content)=>{
        const file = {
            lang: language,
            code: content,
        };
        res.send(JSON.stringify(file));
    });
});

app.post('/api/run', (req,res) =>{
    const file = req.body;
    console.log(`file.lang: ${file.lang}`,`file.code: $file.code`);
    RunnerManager.run(file.lang, file.code, res);
});
app.listen(PORT, () => console.log(`Listen on port ${PORT}`));


