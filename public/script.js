//const { response } = require("express");

const searchBtn = document.querySelector(".searchBtn");
const input = document.querySelector(".form-control");
const searchUl = document.querySelector(".searchUl");
const dbBtn = document.querySelector(".dbBtn");

searchBtn.addEventListener("click", async function () {
  const inputValue = input.value.split(" ");
  let reqText = "";
  for (let i = 0; i < inputValue.length; i++) {
    reqText += inputValue[i];
    if (i != inputValue.length - 1) {
      reqText += "+";
    }
  }
  try {
    const body = {
      inputText: reqText,
    };
    const response = await fetch("http://localhost:8000/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    console.log("reqtext: " + reqText);

    if (response.ok) {
      const courses = await response.json();
      for (let i = 0; i < courses.length; i++) {
        const li = document.createElement("li");
        li.innerHTML = courses[i];
        searchUl.appendChild(li);
        console.log(courses[i]);
      }
    }
  } catch (error) {
    console.error(error.message);
  }
});

searchUl.addEventListener("click", function (e) {
  let indexLi = "";
  //console.log(e.target.innerHTML);
  console.log(searchUl);
  for (let i = 0; i < e.target.parentElement.childNodes.length; i++) {
    if (e.target.innerHTML === e.target.parentElement.childNodes[i].innerHTML) {
      indexLi = i;
    }
  }
  var dataToSend = { key: input.value, index: indexLi };
  var queryString = new URLSearchParams(dataToSend).toString();
  window.location.href = "article.html?" + queryString;
});

dbBtn.addEventListener("click", function () {
  window.location.href = "database.html?" + "ehe";
});
