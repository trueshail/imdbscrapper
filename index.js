const request = require("request-promise")
const cheerio = require("cheerio")
const fs = require("fs")
const json2csv = require("json2csv").Parser;


const movies = ["https://www.imdb.com/title/tt6468322/",
    "https://www.imdb.com/title/tt3393786/",
    "https://www.imdb.com/title/tt2178470/",
    "https://www.imdb.com/title/tt12004706/?ref_=rvi_tt",
    "https://www.imdb.com/title/tt1024855/?ref_=rvi_tt",
    "https://www.imdb.com/title/tt2819446/?ref_=rvi_tt",
    "https://www.imdb.com/title/tt4558376/?ref_=rvi_tt",
    "https://www.imdb.com/title/tt5774060/?ref_=rvi_tt",
    "https://www.imdb.com/title/tt1502397/?ref_=rvi_tt",
    "https://www.imdb.com/title/tt2474024/?ref_=rvi_tt",
    "https://www.imdb.com/title/tt6751668/?ref_=rvi_tt",
    "https://www.imdb.com/title/tt8583694/?ref_=rvi_tt"
];


(async () => {
    let imdbData = []

    for (let movie of movies) {
        const response = await request({
            uri: movie,
            Headers: {
                accept: "text / html, application/ xhtml + xml, application/ xml; q = 0.9, image / webp, image / apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en-US,en;q=0.9"
            },
            gzip: true
        });

        let $ = cheerio.load(response)
        let title = $('div[class="title_wrapper"] > h1').text().trim()
        let rating = $('div[class="ratingValue"] > strong > span').text().trim()
        let summary = $('div[class="summary_text"]').text().trim()
        let releasedate = $('a[title="See more release dates"]').text().trim()


        imdbData.push({
            title, rating, summary, releasedate
        })

    }


    const j2cp = new json2csv()
    const csv = j2cp.parse(imdbData)

    fs.writeFileSync("./imdb.csv", csv, "utf-8");
}
)();
