import { endpoint, headers } from "./settings.js";
import { cleanForm } from "./script.js";

export function get(callback) {
  fetch(endpoint /*+ '?q={}&h={"$orderby": {"_created": -1}}'*/, {
    method: "GET",
    headers,
  })
    .then((res) => res.json())
    .then((data) => {
      // console.log(response);
      const parent = document.querySelector(".container");
      parent.innerHTML = "";
      data.forEach(callback);
    })
    .catch((err) => {
      console.error(err);
    });
}

export function post(callback, payout) {
  const postData = JSON.stringify(payout);
  fetch(endpoint, {
    method: "post",
    headers,
    body: postData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.status) {
        console.log(data.status);
        alert("that name all ready exist");
      } else {
        callback(data);
        cleanForm();
      }
    });
}
