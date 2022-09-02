const brandList = document.querySelector('#brand-list');
const actionBtn = document.querySelector('#action');
const actionCon = document.querySelector("#action-con");
const processCon = document.querySelector("#process-con");
const processBtn = document.querySelector('#process');
const formBox = document.querySelector('.form-box');
const formOffset = document.querySelector('.form-offset');
const form = document.querySelector('form');
const submitBtn = document.querySelector('#submit');
const body = document.querySelector('body');

feather.replace();
let menuOpen = false;

const closeMenu = () => {
  menuOpen = false;
  formBox.classList.add("animate__flipOutX");
  actionBtn.classList.remove("open");
  setTimeout(() => formOffset.removeAttribute("style"), 0);
}

const validateForm = () => {
  if (form.name.value === "" || form.owner.value === "" || form.foundingYear.value === "") {
    return false;
  } else {
    return true;
  }
}

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("keyup", (e) => {
    let validated = validateForm();

    if (validated) {
      actionCon.style.display = "none";
      processCon.style.display = "flex";
    } else {
      actionCon.removeAttribute("style");
      processCon.removeAttribute("style");
    }
  })
});

processBtn.addEventListener("click", () => {
  submitBtn.click();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  processBtn.classList.add("focus");
  body.style.pointerEvents = 'none';
})

actionBtn.addEventListener("click", () => {
  if (!menuOpen) {
    menuOpen = true;
    formBox.classList.remove("animate__flipOutX");
    formBox.style = "display: block";
    formOffset.style = "display: block";
    actionBtn.classList.add("open");
  } else {
    closeMenu();
  }
});

formOffset.addEventListener("click", () => closeMenu());

function renderBrand(doc) {
  let li = document.createElement('li');
  let div = document.createElement('div');
  let headerP = document.createElement('p');
  let bodyP = document.createElement('p');
  let divAction = document.createElement('div');
  let img = document.createElement('img');

  headerP.textContent = `${doc.data().owner}, ${doc.data().foundingYear}`;
  bodyP.textContent = doc.data().name;

  headerP.classList.add("small-text", "smoke-text", "ln");
  divAction.classList.add("action");

  img.setAttribute("src", "../assets/minus.svg");

  li.setAttribute('data-id', doc.id);
  li.appendChild(div);
  li.appendChild(divAction);

  divAction.appendChild(img);

  div.appendChild(headerP);
  div.appendChild(bodyP);


  brandList.appendChild(li);
}

db.collection('brands').get().then((snapshot) => {
  snapshot.docs.forEach(doc => {
    renderBrand(doc);
  });
});
