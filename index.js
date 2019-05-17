const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(port, function () {

    console.log("Listening to Port " + port);
});

app.get('/news', (req, res) => {

    const url = "http://www.hirunews.lk/sinhala/local-news.php";
    axios.get(url)
        .then(response => {

            results = [];
            const $ = cheerio.load(response.data, {decodeEntities: false});


            $('div.rp-ltsbx div.rp-mian div.lts-cntp').find('a').each((i, elem) => {
                

                let news = {
                    url : elem.attribs.href,
                    text: elem.children[0].data
                }

                results.push(news)

            });
            res.send({data: results});
            
        })
        .catch(err => {
            console.log(err);
        })
});