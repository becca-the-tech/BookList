const fs = require('fs');
const mongoose = require("mongoose");
const Quote = require("../models/quote");

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.er1mt.mongodb.net/booksDB`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });


// Reading data in utf-8 format
// which is a type of character set.
// Instead of 'utf-8' it can be
// other character set also like 'ascii'

fs.readFile('MyClippings.txt', 'utf-8', (err, data) => {
    if (err) throw err;
    highlightList = data.split("==========");
    const quotesList = [];
    //highlight is each individual quote part of the array.. array[0] =>
    let justQuotesList = highlightList.map(highlight => {
        let quoteInParts = highlight.split("\r\n");
        // console.log("Book: " + quoteInParts[1]);
        // console.log("Quote: " + quoteInParts[4]);
        // console.log("----\n");
        const newQuote = new Quote({
            quoteContent: quoteInParts[4],
            author: "",
            book: quoteInParts[1],
            tags: [],
            userNotes: "",
            likes: 0
        });
        newQuote.save().then(() => console.log(`${newQuote} saved to DB`)).catch(err => console.log(err));
    });
});
