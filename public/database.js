async function run() {
  try {
    await fetch(`http://localhost:8000/database.html/ehe`)
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          const ul = document.createElement("ul");
          const li1 = document.createElement("li");
          li1.innerHTML = "Yayın id:" + data[i].publishId;
          const li2 = document.createElement("li");
          li2.innerHTML = "Yazarların isimleri:" + data[i].authors;
          const li3 = document.createElement("li");
          li3.innerHTML = "Yayın türü:" + data[i].publishType;
          const li4 = document.createElement("li");
          li4.innerHTML = "Yayımlanma tarihi:" + data[i].publishDate;
          const li5 = document.createElement("li");
          li5.innerHTML = "Yayıncı adı:" + data[i].publisherName;
          const li6 = document.createElement("li");
          li6.innerHTML = "Anahtar kelimeler:" + data[i].mainWords;
          const li7 = document.createElement("li");
          li7.innerHTML =
            "Anahtar kelimeler(Makaleye ait):" + data[i].mainWordsofArticle;
          const li8 = document.createElement("li");
          li8.innerHTML = "Özet:" + data[i].abstract;
          const li9 = document.createElement("li");
          li9.innerHTML = "Referanslar:" + data[i].references;
          const li10 = document.createElement("li");
          li10.innerHTML = "Alıntı sayısı:" + data[i].quotationCount;
          const li11 = document.createElement("li");
          li11.innerHTML = "Doi numarası:" + data[i].doiNum;
          const li12 = document.createElement("li");
          li12.innerHTML = "URL adresi:" + data[i].url;
          ul.appendChild(li1);
          ul.appendChild(li2);
          ul.appendChild(li3);
          ul.appendChild(li4);
          ul.appendChild(li5);
          ul.appendChild(li6);
          ul.appendChild(li7);
          ul.appendChild(li8);
          ul.appendChild(li9);
          ul.appendChild(li10);
          ul.appendChild(li11);
          ul.appendChild(li12);
          ul.style.backgroundColor = "rgb(245, 245, 245)";
          document.body.appendChild(ul);
        }
      });
  } catch (error) {
    console.error(error.message);
  }
}

run();
