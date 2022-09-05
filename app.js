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
const preloader = document.querySelector('.preloader');

feather.replace();
let menuOpen = false;

const closeMenu = () => {
  menuOpen = false;
  formBox.classList.add("animate__flipOutX");
  actionBtn.classList.remove("open");
  setTimeout(() => formOffset.removeAttribute("style"), 0);
}

const validateForm = () => {
  if (form.name.value === "" || form.location.value === "") {
    return false;
  } else { return true; }
}

function validateInput(input) {
  input.addEventListener("keyup", (e) => {
    let validated = validateForm();

    if (validated) {
      actionCon.style.display = "none";
      processCon.style.display = "flex";
    } else {
      actionCon.removeAttribute("style");
      processCon.removeAttribute("style");
    }
  });
}

document.querySelectorAll("input").forEach((input) => {
  validateInput(input);
});

processBtn.addEventListener("click", () => {
  submitBtn.click();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  processBtn.classList.add("focus");
  body.style.pointerEvents = 'none';

  db.collection('jobs').add({
    'name': form.name.value,
    'location': form.location.value,
  }).then((response) => {
    form.reset();
    processBtn.classList.remove("focus");
    body.removeAttribute("style");
    actionCon.removeAttribute("style");
    processCon.removeAttribute("style");
    closeMenu();
  });
});

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

  headerP.textContent = `${doc.data().location}`;
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

  divAction.addEventListener('click', (e) => {
    e.stopPropagation(); //optional
    let id = divAction.parentElement.getAttribute('data-id');
    db.collection('jobs').doc(id).delete();

    if (brandList.children.length == 1) {
      setTimeout(() => {
        document.querySelector('.no-content').style.display = "flex";
      }, 1000);
    }
  });
}

// db.collection('jobs').orderBy('location').get().then((snapshot) => {
//   snapshot.docs.forEach(doc => {
//     renderBrand(doc);
//   });
// });


db.collection('jobs').orderBy('location').onSnapshot((snapshot) => {
  let shots = snapshot.docChanges();
  preloader.remove();

  if (shots.length == 0) {
    document.querySelector('.no-content').style.display = "flex";
  } else {
    shots.forEach((shot) => {
      if (shot.type == "added") {
        renderBrand(shot.doc);
        document.querySelector('.no-content').removeAttribute('style');
      } else if (shot.type == "removed") {
        let li = document.querySelector(`[data-id="${shot.doc.id}"]`);
        li.classList.remove('animate__zoomInDown');
        li.classList.add('animate__zoomOutDown');
        setTimeout(() => brandList.removeChild(li), 800);
      }
    });
  }
})
