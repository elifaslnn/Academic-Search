let mail;
let index;
var urlParams = new URLSearchParams(window.location.search);
var receivedData = Object.fromEntries(urlParams.entries());
mail = receivedData.key;
index = receivedData.index;

const pdfbtn = document.querySelector(".pdfBtn");

console.log(mail);
console.log(receivedData.index);

let publishId = []; //
let authorsName = []; //
let publishName = []; //
let publishType = []; // makale
let publishDate = []; //
let publisherName = []; //
let mainWords = []; //
let mainWordsofArticle = [];
let abstract = [];
let references = [];
let quotationCount = []; //
let doiNum = [];
let url = [];
let pdfUrl = [];

async function runGet() {
  //GET
  try {
    await fetch(`http://localhost:8000/article.html/${mail + "+" + index}`)
      .then((data) => {
        return data.json();
      })
      .then(function (data) {
        var tempDiv = document.createElement("div");

        for (let i = 0; i < 10; i++) {
          authorsName.push(data.publishData[i].split("-")[0]);
          publisherName.push(data.publishData[i].split("-")[1].split(",")[0]);
          publishDate.push(data.publishData[i].split("-")[1].split(",")[1]);
          //mainWords.push(data.mainWords[i]);
          publishName.push(data.title[i]);
          publishId.push(data.title[i] + i);
          quotationCount.push(data.quotationCount[i]);
          url.push(data.url[i]);
          pdfUrl.push(data.pdfUrl[i]);
        }
      });
  } catch (error) {
    console.error(error.message);
  }
}

async function runPost(i) {
  try {
    console.log(i);
    const body = {
      publishId: 0,
      publishName: publishName[i],
      authorsName: authorsName[i],
      publishType: "makale",
      publishDate: publishDate[i],
      publisherName: publisherName[i],
      mainWords: mail,
      mainWordsofArticle: "none",
      abstract: "none",
      references: "none",
      quotationCount: quotationCount[i],
      doiNum: 0,
      url: url[i],
    };
    console.log("hi");
    const response = await fetch(
      `http://localhost:8000/article.html/${mail + "+" + index}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
  } catch (error) {
    console.log(error.message);
  }
}

runGet()
  .then(() => {
    for (let i = 0; i < 10; i++) {
      runPost(i);
    }
  })
  .then(() => {
    //FRONTENDE YAZDIRMA
    document.querySelector(".authors").innerHTML += "  " + authorsName[index];
    document.querySelector(".publisherName").innerHTML +=
      " " + publisherName[index];
    document.querySelector(".pulishDate").innerHTML += " " + publishDate[index];
    document.querySelector(".publishType").innerHTML += " Makale";
    //makaleye ait anahtar kelimeler burada
    /*document.querySelector(".mainWords").innerHTML =
      document.querySelector(".mainWords").innerHTML + mainWords[index];*/
    document.querySelector(".mainwordsTitle").innerHTML += " " + mail;
    document.querySelector(".title").innerHTML += publishName[index];
    document.querySelector(".quotationCount").innerHTML = quotationCount[index];
    document.querySelector(".url").innerHTML += url[index];

    //pdf buton click function
    pdfbtn.addEventListener("click", function () {
      var cvWindow = window.open();

      const pdfFrame = document.createElement("iframe");
      pdfFrame.src = pdfUrl[index];
      pdfFrame.style = "width: 100%; height: 100%";

      cvWindow.document.body.appendChild(pdfFrame);
    });
  });
