const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejs = require("ejs");
const methodOverride = require("method-override");
const Quote = require("./models/quote");
require('dotenv').config();

const app = express();

app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(methodOverride("_method"));

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.er1mt.mongodb.net/booksDB`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    pages: Number,
    audioLengthHours: Number,
    audioLengthMinutes: Number,
    dueOrOwn: String,
    progress: Number,
    isFavorited: Boolean,
    isArchived: Boolean,
    yearFinished: Number,
    notes: [String]
});

const Book = mongoose.model("Book", bookSchema);

let newBook = new Book({
    title: "Sample",
    author: "Anonymous",
    pages: 1300,
    audioLengthHours: 10,
    audioLengthMinutes: 0,
    dueOrOwn: "Own ebook, audio due on 5/1",
    progress: 5
});

//newBook.save();

let otherBook = new Book({
    title: "Ceremony",
    author: "Leslie Marmon Silko",
    pages: 262,
    audioLengthHours: 9,
    audioLengthMinutes: 6,
    dueOrOwn: "Ebook due on 5/7",
    progress: 11
});

//otherBook.save();

app.get("/", function(req, res) {
    Book.find({}, function(err, foundBooks) {
        if (err) {
            console.log(err);
        } else {
            if (foundBooks) {
                res.render("home", { books: foundBooks });
            } else {
                res.render("home", { books: newBook });
            }
        }
    });
});

app.get("/favorites", function(req, res) {
    Book.find({ isFavorited: true }, function(err, foundBooks) {
        if (err) {
            console.log(err);
        } else {
            if (foundBooks) {
                res.render("favorites", { books: foundBooks });
            } else {
                res.render("home", { books: newBook });
            }
        }
    });
});


app.get("/archived", function(req, res) {
    Book.find({ isArchived: true }, function(err, foundBooks) {
        if (err) {
            console.log(err);
        } else {
            if (foundBooks) {
                res.render("archived", { books: foundBooks });
            } else {
                res.render("home", { books: newBook });
            }
        }
    });
});

app.get("/yearInBooks", function(req, res) {
    Book.find({ yearFinished: 2021 }, function(err, foundFinishedBooks) {
        if (err) {
            console.log(err);
        } else {
            if (foundFinishedBooks) {
                res.render("yearInBooks", { books: foundFinishedBooks });
            } else {
                res.render("home", { books: newBook });
            }
        }
    });
});


app.post("/", function(req, res) {
    let submittedBook = new Book({
        title: req.body.title,
        author: req.body.author,
        pages: req.body.pages,
        audioLengthHours: req.body.audioLengthHours,
        audioLengthMinutes: req.body.audioLengthMinutes,
        dueOrOwn: req.body.dueOrOwn,
        progress: req.body.progressPercent,
        isFavorited: false,
        isArchived: false,
        notes: []
    });

    submittedBook.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            //     console.log("Saved new book.");
            res.redirect("/");
        }
    });

});

app.get("/books/:id", function(req, res) {
    let id = req.params.id;
    Book.findById(id, function(err, foundBook) {
        if (err) {
            console.log(err);
        } else {
            if (foundBook) {
                res.render("edit", { book: foundBook });
            } else {
                res.redirect("/");
            }
        }
    });
});

/* Updates from the Edit View

TODO: Fix the isFavorited and isArchived from being marked false every time updated
TODO: Notes are erased each time updated as well instead of preserved
*/
app.put("/books/:id", async (req, res) => {
    const { id } = req.params;
    const newbook = await Book.findOneAndUpdate({ _id: id }, {
        title: req.body.title,
        author: req.body.author,
        pages: req.body.pages,
        audioLengthHours: req.body.audioLengthHours,
        audioLengthMinutes: req.body.audioLengthMinutes,
        dueOrOwn: req.body.dueOrOwn,
        progress: req.body.progressPercent,
        yearFinished: req.body.yearFinished,
        isFavorited: false,
        isArchived: false,
        notes: []
    });
    res.redirect("/");
});

app.get("/books/:id/view", function(req, res) {
    let id = req.params.id;
    Book.findById(id, function(err, foundBook) {
        if (err) {
            console.log(err);
        } else {
            if (foundBook) {
                res.render("viewBook", { book: foundBook });
            } else {
                res.redirect("/");
            }
        }
    });
});

app.post("/books/:id/note", async function(req, res) {
    let { id } = req.params;
    let { text } = req.body;
    console.log("Form contents: " + text);
    let book = await Book.findById(id);
    if (book) {
        book.notes.push(text);
        book.save();
        //        console.log(book.notes);
        res.redirect(`/ books / ${id} / view`);
    } else {
        res.redirect("/");
    }
});

app.patch("/books/:id/favorite", async (req, res) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    book.isFavorited = book.isFavorited ? false : true;
    await book.save();
    book.isFavorited ? res.redirect("/favorites") : res.redirect("/");
});


app.patch("/books/:id/archive", async (req, res) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    book.isArchived = book.isArchived ? false : true;
    await book.save();
    book.isArchived ? res.redirect("/archived") : res.redirect("/");
});

app.delete("/books/:id", function(req, res) {
    let id = req.params.id;
    Book.findByIdAndRemove(id, function(err) {
        if (err) {
            res.send("Problem detected when deleting. <a href='/'>Return to main page</a>");
        } else {
            res.redirect("/");
        }
    });
});

///////////////////////////// QUOTE ROUTES ///////////////////
app.get("/quotes", async (req, res) => {
    const quotes = await Quote.find({});
    res.render("quoteHome", { quotes });
});

app.post("/quotes", (req, res) => {
    const { quoteContent, author, book, userNotes, tags } = req.body;
    const quote = new Quote({
        quoteContent: quoteContent,
        author: author,
        book: book,
        userNotes: userNotes,
        tags: tags
    });
    quote.save().then(() => console.log("Saved new quote"));
    res.redirect("/quotes");
});

app.get("/quotes/random", async (req, res) => {
    const quotes = await Quote.find({});
    //    console.log(quotes);
    let randomNum = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomNum];
    // console.log(randomQuote);
    res.render("quoteRandom", { quote: randomQuote });
});

app.get("/quotes/random/:number", async (req, res) => {
    const { number } = req.params;
    //console.log(number);
    const allQuotes = await Quote.find({});
    //    console.log(quotes);
    let randomQuotes = [];
    for (i = 0; i < number; i++) {
        let randomNum = Math.floor(Math.random() * allQuotes.length);
        const randomQuote = allQuotes[randomNum];
        randomQuotes.push(randomQuote);
    }
    // console.log(randomQuote);

    res.render("quoteHome", { quotes: randomQuotes });
});

app.patch("/quotes/:id/favorite", async (req, res) => {
    const { id } = req.params;
    const quote = await Quote.findById(id);
    quote.isFavorite = quote.isFavorite ? false : true;
    await quote.save();
    quote.isFavorite ? res.redirect("/quotes/favorites") : res.redirect("/quotes");
});

app.patch("/quotes/:id/writingList", async (req, res) => {
    const { id } = req.params;
    const quote = await Quote.findById(id);
    quote.isWritingList = quote.isWritingList ? false : true;
    await quote.save();
    quote.isWritingList ? res.redirect("/quotes/writingList") : res.redirect("/quotes");
});

app.get("/quotes/new", (req, res) => {
    res.render("quoteNew");
});

app.get("/quotes/favorites", async (req, res) => {
    const favorites = await Quote.find({ isFavorite: true });
    res.render("quoteHome", { quotes: favorites });
});

app.get("/quotes/writingList", async (req, res) => {
    const writingListQuotes = await Quote.find({ isWritingList: true });
    res.render("quoteHome", { quotes: writingListQuotes });
});


app.get("/quotes/:id", async (req, res) => {
    const { id } = req.params;
    const quote = await Quote.findById(id);
    res.render("quoteShow", { quote });
});

app.get("/quotes/:id/edit", async (req, res) => {
    const { id } = req.params;
    const quote = await Quote.findById(id);
    res.render("quoteEdit", { quote });
});

app.put("/quotes/:id", async (req, res) => {
    const { id } = req.params;
    const quote = await Quote.findByIdAndUpdate(id, req.body, { new: true });
    res.redirect(`/ quotes / ${quote._id}`);
});

app.delete("/quotes/:id", async (req, res) => {
    const { id } = req.params;
    await Quote.findByIdAndDelete(id);
    res.redirect("/quotes");
});


app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000.");
});;
