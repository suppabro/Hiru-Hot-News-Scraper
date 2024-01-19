const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello, this is the root path!');
});

app.get('/derana/news', async (req, res) => {
    try {
        const url = "http://sinhala.adaderana.lk/sinhala-hot-news.php";
        const response = await axios.get(url);

        const $ = cheerio.load(response.data, { decodeEntities: false });
        const results = [];

        $('div.news-story div.story-text h2 a').each((i, elem) => {
            const news = {
                url: "http://sinhala.adaderana.lk/" + elem.attribs.href,
                text: $(elem).text()
            };
            results.push(news);
        });

        $('div.news-story div.story-text div.thumb-image img').each((i, elem) => {
            results[i].image = elem.attribs.src;
        });

        $('div.news-story div.story-text p').each((i, elem) => {
            results[i].body = $(elem).text();
        });

        res.send({ data: results });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.get('/esana/news', async (req, res) => {
    try {
        const url = "https://www.helakuru.lk/esana";
        const response = await axios.get(url);

        const $ = cheerio.load(response.data, { decodeEntities: false });
        const results = [];

        $('.story-text').each((i, elem) => {
            const news = {
                title: $(elem).find('h2 a').text(),
                url: "https://www.helakuru.lk/esana" + $(elem).find('h2 a').attr('href'),
                image: $(elem).find('div.thumb-image img').attr('src'),
                body: $(elem).find('p').text()
            };
            results.push(news);
        });

        res.send({ data: results });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log("Listening to Port " + port);
});
