const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const mongoose = require("mongoose");
var path = require("path");
const Typo = require("typo-js");

// Statik dosyaları sunmak için middleware
app.use(express.static("public"));
app.use(express.json());
const puppeteer = require("puppeteer");

const dictionary = new Typo("en_US");

mongoose.connect("mongodb://localhost:27017/AcademicSearch");

// Kitaplar şeması oluştur
const articleSchema = new mongoose.Schema({
  publishId: Number,
  publishName: String,
  authors: String,
  publishType: String,
  publishDate: Date,
  publisherName: String,
  mainWords: String,
  mainWordsofArticle: String,
  abstract: String,
  references: String,
  quotationCount: String,
  doiNum: Number,
  url: String,
});

// Kitaplar modelini oluştur
const article = mongoose.model("article", articleSchema);

// Veritabanı bağlantısında bir hata olduğunda
mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

// Ana sayfayı sunmak
app.get("/", (req, res) => {});

const scrap = async function (url, text, command) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const courses = await page.evaluate(
      (text, command) =>
        Array.from(document.querySelectorAll(text), (e) => e[command]),
      text,
      command
    );
    return courses;
  } catch (error) {
    console.log(error);
  }
};
let inputText1;
app.post("/", async (req, res) => {
  try {
    //class isimleri dosya yolu
    inputText1 = req.body.inputText;
    console.log(inputText1);

    const resultes = scrap(
      `https://scholar.google.com/scholar?hl=tr&as_sdt=0%2C5&q=${req.body.inputText}&oq=`,
      ".gs_rt a",
      "innerText"
    ).then((data) => {
      console.log("here");
      console.log(data);
      res.send(data);
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/article.html/:article", async (req, res) => {
  let data1;
  let data2;
  let data3;
  let data4;
  let data5;
  let data6;
  console.log("req:" + req.params.article);
  const articleIndex = req.params.article.split("+");
  console.log(articleIndex[1]);
  scrap(
    `https://scholar.google.com/scholar?hl=tr&as_sdt=0%2C5&q=${inputText1}&oq=`,
    ".gs_a",
    "innerText"
  )
    .then((data) => {
      data1 = data;

      return scrap(
        `https://scholar.google.com/scholar?hl=tr&as_sdt=0%2C5&q=${inputText1}&oq=`,
        ".gs_rs",
        "innerHTML"
      );
    })
    .then((data) => {
      data2 = data; //makaleye ait ana kelimeler

      return scrap(
        `https://scholar.google.com/scholar?hl=tr&as_sdt=0%2C5&q=${inputText1}&oq=`,
        `.gs_rt a `,
        "innerHTML"
      );
    })
    .then((data) => {
      data3 = data; //bu başlık

      return scrap(
        `https://scholar.google.com/scholar?hl=tr&as_sdt=0%2C5&q=${inputText1}&oq=`,
        ".gs_fl a",
        "innerText"
      );
    })
    .then((data) => {
      var quotation = "Alıntılanma sayısı";
      var quatationArr = [];
      console.log("data2.length:" + data.length);
      for (let i = 0; i < data.length; i++) {
        console.log("data[i]:" + data[i]);
        if (data[i].includes(quotation)) {
          console.log("alıntı" + data[i]);
          quatationArr.push(data[i]);
        }
      }

      data4 = quatationArr; //alıntılama sayısı

      return scrap(
        `https://scholar.google.com/scholar?hl=tr&as_sdt=0%2C5&q=${inputText1}&oq=`,
        ".gs_rt a",
        "href"
      );
    })
    .then((data) => {
      data5 = data; //url

      return scrap(
        `https://scholar.google.com/scholar?hl=tr&as_sdt=0%2C5&q=${inputText1}&oq=`,
        ".gs_or_ggsm a",
        "href"
      );
    })
    .then((data) => {
      data6 = data;

      const sendData = {
        publishData: data1, //[0]=> yazarlar [1]=>[0]=>yayımcı adı [1]=> tarih
        word: data2, //makaleye ait kelimeler "array olmalı"
        mainwords: inputText1, //arama motoruna ait kelimeler "tek+string"=>"görüntü+işleme"
        title: data3,
        quotationCount: data4,
        url: data5,
        pdfUrl: data6,
      };
      console.log("data4:" + data4);
      res.send(sendData);
    });
});

app.post("/article.html/:article", async (req, res) => {
  try {
    const newArticle = new article({
      publishId: req.body.publishId,
      publishName: req.body.publishName,
      authors: req.body.authorsName,
      publishType: req.body.publishType,
      publishDate: req.body.publishDate,
      publisherName: req.body.publisherName,
      mainWords: req.body.mainWords,
      mainWordsofArticle: req.body.mainWordsofArticle,
      abstract: req.body.abstract,
      references: req.body.references,
      quotationCount: req.body.quotationCount,
      doiNum: req.body.doiNum,
      url: req.body.url,
    });
    // Veritabanına kitabı kaydet
    await newArticle.save();
  } catch (error) {
    console.error(error);
  }
});

app.get("/database.html/:ehe", async (req, res) => {
  console.log("here");

  console.log("ehe");
  try {
    // "articles" koleksiyonundaki tüm verileri çekin
    const allArticles = await article.find({});

    // Elde edilen tüm makaleleri görüntüleyin
    console.log("Tüm makaleler:", allArticles);
    res.send(allArticles);
  } catch (error) {
    console.error("Hata:", error);
  } finally {
    // Mongoose bağlantısını kapatın
    //mongoose.connection.close();
  }
});

app.get("/correct_text_ajax", (req, res) => {
  const inputText = req.query.input_text || "";
  const words = inputText.split(" ");
  const correctedWords = words.map(
    (word) => dictionary.suggest(word)[0] || word
  );
  const correctedText = correctedWords.join(" ");
  res.json({ corrected_text: correctedText });
});
app.listen(8000);
