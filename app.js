const brandList = document.querySelector('#brand-list');
const actionBtn = document.querySelector('#action');
const formBox = document.querySelector('.form-box');
const formOffset = document.querySelector('.form-offset');

let menuOpen = false;

const closeMenu = () => {
  formBox.classList.add("animate__flipOutX");
  setTimeout(() => formOffset.removeAttribute("style"), 00);
}

actionBtn.addEventListener("click", () => {
  if (!menuOpen) {
    menuOpen = true;
    formBox.classList.remove("animate__flipOutX");
    formBox.style = "display: block";
    formOffset.style = "display: block";
  } else {
    menuOpen = false;
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

  headerP.textContent = `${doc.data().owner}, ${doc.data().foundingYear}`;
  bodyP.textContent = doc.data().name;

  headerP.classList.add("small-text", "smoke-text", "ln");
  divAction.classList.add("action");

  li.setAttribute('data-id', doc.id);
  li.appendChild(div);
  li.appendChild(divAction);

  div.appendChild(headerP);
  div.appendChild(bodyP);

  brandList.appendChild(li);
}

db.collection('brands').get().then((snapshot) => {
  snapshot.docs.forEach(doc => {
    renderBrand(doc);
  });
});
