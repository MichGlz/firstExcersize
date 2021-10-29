"user strict";

window.addEventListener("DOMContentLoaded", start);

const settings = {
  urlFetch: "",
  corssKey: "",
  btnSubmit: undefined,
};

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
  settings.urlFetch = "https://reicpe-9cc2.restdb.io/rest/fantasy-creature";
  settings.corssKey = "606d5dcef5535004310074f4";
  btnSubmit.addEventListener("click", post);
  get();
}

function get() {
  fetch(settings.urlFetch + '?q={}&h={"$orderby": {"_created": -1}}', {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": settings.corssKey,
      "cache-control": "no-cache",
    },
  })
    .then((res) => res.json())
    .then((response) => {
      // console.log(response);

      displayInfo(response);
    })
    .catch((err) => {
      console.error(err);
    });
}

function post() {
  fillObject();

  const postData = JSON.stringify(fantasyCreature);
  fetch(settings.urlFetch, {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": settings.corssKey,
      "cache-control": "no-cache",
    },
    body: postData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.status) {
        console.log(data.status);
        alert("that name all ready exist");
      } else {
        get();
        cleanForm();
      }
    });
}

function deleteIt(ID) {
  fetch(settings.urlFetch + "/" + ID, {
    method: "delete",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": settings.corssKey,
      "cache-control": "no-cache",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      get();
    });
}

function editIt(ID) {
  btnEdit.classList.remove("hidden");
  btnSubmit.classList.add("hidden");
  btnEdit.addEventListener("click", () => {
    put(ID);
  });
  fetch(settings.urlFetch + "/" + ID, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": settings.corssKey,
      "cache-control": "no-cache",
    },
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

  fetch(settings.urlFetch + "/" + ID, {
    method: "put",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": settings.corssKey,
      "cache-control": "no-cache",
    },
    body: postData,
  })
    .then((d) => d.json())
    .then((t) => {
      console.log(t);
      get();
      cleanForm();
    });
}

function displayInfo(creatures) {
  const parent = document.querySelector(".container");
  parent.innerHTML = "";
  //grab the template
  const template = document.querySelector("#mytemplate").content;
  creatures.forEach((creature) => {
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
    copy.querySelector(".btn-delete").addEventListener("click", () => deleteIt(creature._id));
    copy.querySelector(".btn-edit").addEventListener("click", () => editIt(creature._id));
    parent.appendChild(copy);
  });
}

function fillObject() {
  fantasyCreature.name = document.querySelector("#name").value;
  fantasyCreature.color = document.querySelector("#color").value;
  fantasyCreature.age = document.querySelector("#age").value;
  fantasyCreature.mythology = document.querySelector("#mythology").value;
  fantasyCreature.horns = document.querySelector('input[name="horns"]:checked').value;
}

function cleanForm() {
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
