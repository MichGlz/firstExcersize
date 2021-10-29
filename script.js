"user strict";

window.addEventListener("DOMContentLoaded", start);

import { endpoint, headers } from "./settings.js";
import { get, post } from "./crud.js";

const fantasyCreature = {
  name: "",
  color: "",
  age: "",
  mythology: "",
  horns: false,
};

const btnSubmit = document.querySelector("#btn-submit");
const btnEdit = document.querySelector("#btn-edit");

function start() {
  btnSubmit.addEventListener("click", () => {
    fillObject();
    post(displayInfo, fantasyCreature);
  });
  get(displayInfo);
}

function deleteIt(ID, evt) {
  fetch(endpoint + "/" + ID, {
    method: "delete",
    headers,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      evt.target.parentElement.parentElement.remove();
    });
}

function editIt(ID) {
  btnEdit.classList.remove("hidden");
  btnSubmit.classList.add("hidden");
  btnEdit.addEventListener("click", () => {
    put(ID);
  });
  fetch(endpoint + "/" + ID, {
    method: "GET",
    headers,
  })
    .then((res) => res.json())
    .then((response) => {
      console.log(response);
      document.querySelector("h2.action").textContent = "Edit your creature";
      fillForm(response);
    })
    .catch((err) => {
      console.error(err);
    });
}

function put(ID) {
  fillObject();
  let postData = JSON.stringify(fantasyCreature);

  fetch(endpoint + "/" + ID, {
    method: "put",
    headers,
    body: postData,
  })
    .then((d) => d.json())
    .then((t) => {
      console.log(t);
      get();
      cleanForm();
    });
}

function displayInfo(creature) {
  //grab the template
  const template = document.querySelector("#mytemplate").content;

  //clone
  const copy = template.cloneNode(true);
  //adjust stuff
  copy.querySelector(".name").textContent = creature.name;
  copy.querySelector(".color").textContent = creature.color;
  copy.querySelector(".age").textContent = creature.age;
  copy.querySelector(".mythology").textContent = creature.mythology;
  if (creature.horns) {
    copy.querySelector(".creature-container").style.background = "blue";
  }
  copy.querySelector(".btn-delete").addEventListener("click", (e) => deleteIt(creature._id, e));
  copy.querySelector(".btn-edit").addEventListener("click", () => editIt(creature._id));
  const parent = document.querySelector(".container");

  parent.insertBefore(copy, parent.childNodes[0]);
  // parent.appendChild(copy);
}

function fillObject() {
  fantasyCreature.name = document.querySelector("#name").value;
  fantasyCreature.color = document.querySelector("#color").value;
  fantasyCreature.age = document.querySelector("#age").value;
  fantasyCreature.mythology = document.querySelector("#mythology").value;
  fantasyCreature.horns = document.querySelector('input[name="horns"]:checked').value;
}

export function cleanForm() {
  btnEdit.classList.add("hidden");
  btnSubmit.classList.remove("hidden");
  document.querySelector("h2.action").textContent = "New fantasy creature";
  document.querySelector("#name").value = "";
  document.querySelector("#color").value = "";
  document.querySelector("#age").value = "";
  document.querySelector("#mythology").value = "";
  document.querySelector("input#no").checked = true;
}

function fillForm(creature) {
  document.querySelector("#name").value = creature.name;
  document.querySelector("#color").value = creature.color;
  document.querySelector("#age").value = creature.age;
  document.querySelector("#mythology").value = creature.mythology;
  if (creature.horns) {
    document.querySelector("input#yes").checked = true;
  } else {
    document.querySelector("input#no").checked = true;
  }
}
