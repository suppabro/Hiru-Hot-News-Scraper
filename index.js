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

app.get('/derana/news', (req, res) => {

    const url = "http://sinhala.adaderana.lk/sinhala-hot-news.php";
    axios.get(url)
        .then(response => {

            results = [];
            const $ = cheerio.load(response.data, { decodeEntities: false });

            $('div.news-story div.story-text h2').find('a').each((i, elem) => {
                let news = {
                    url: "http://sinhala.adaderana.lk/" + elem.attribs.href,
                    text: elem.children[0].data
                }
                results.push(news)
            });

            $('div.news-story div.story-text div.thumb-image').find('img').each((i, elem) => {
                results[i].image = elem.attribs.src;
            });

            $('div.news-story div.story-text').find('p').each((i, elem) => {
                results[i].body = elem.children[0].data;
            });

            res.send({ data: results });

        })
        .catch(err => {
            console.log(err);
        })
});

app.get('/hirunews/news', (req, res) => {

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