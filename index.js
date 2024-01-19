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

app.get('/adaderana/news', async (req, res) => {
    try {
        const url = "http://sinhala.adaderana.lk/sinhala-hot-news.php";
        const response = await axios.get(url);

        const $ = cheerio.load(response.data, { decodeEntities: false });
        const firstNews = $('div.news-story div.story-text').first();

        const news = {
            url: "http://sinhala.adaderana.lk/" + firstNews.find('h2 a').attr('href'),
            text: firstNews.find('h2 a').text(),
            image: firstNews.find('div.thumb-image img').attr('src'),
            body: firstNews.find('p').text()
        };

        res.send({ data: [news] });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log("Listening to Port " + port);
});
