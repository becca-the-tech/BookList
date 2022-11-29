const mongoose = require("mongoose");
const Quote = require("../models/quote");

mongoose.connect("mongodb://localhost:27017/quotesDB", { useNewUrlParser: true, useUnifiedTopology: true });

let newQuote = new Quote({
    quoteContent: "She would not fail. And she would not let fear choose her path.",
    author: "Leigh Bardugo",
    book: "Wonder Woman",
    tags: ["fear", "persistence"],
    userNotes: "Will I let fear choose my own path?"
});

const anotherQuote = new Quote({
    quoteContent: "Everything grand is made from a series of ugly little moments. \nEverything worthwhile by hours of self-doubt and days of drudgery. \nAll the works by people you and I admire sit atop a foundation of failures. \nSo whatever your project, whatever your struggle, whatever your dream, \nkeep toiling because the world needs your skyscraper.",
    author: "Pierce Brown",
    book: "Morning Star (Red Rising #3)",
    tags: ["persistence", "hard work", "self-doubt"],
    userNotes: "Let me never forget the beginnings look nothing like the finished product, and that's ok. Just keep working and pursuing your goal."
});

newQuote.save().then(() => {
    console.log("Saved new quote to the DB");
}).catch(err => {
    console.log(err);
});

anotherQuote.save().then(() => {
    console.log("Saved new quote to the DB");
}).catch(err => {
    console.log(err);
});
