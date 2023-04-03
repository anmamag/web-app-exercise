const wrapperDetail = document.querySelector('.wrapper-detail');
// const inputContainer = document.createElement('div');
// inputContainer.classList.add('input__container');
// wrapperDetail.appendChild(inputContainer);
let userData = [];
// let savedNotes = [];
///////////////////
// GET DATA
const getUserData = async function () {
  try {
    const response = await fetch(`https://reqres.in/api/users`);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message}: ${response.status}`);

    userData = data.data;
    createUserDetail();
    let noteContainer = document.querySelector('.note__container');
    getNotes(noteContainer);
    noteContainer.addEventListener('click', deleteItem);
  } catch (err) {
    console.error(err);
  }
};

///////////////////
// CREATE USER
function createUserDetail() {
  userDetail = JSON.parse(localStorage.getItem('userDetail'));
  // savedNotes = JSON.parse(localStorage.getItem('savedNotes'));
  userId = Number(userDetail);

  userData.forEach((user) => {
    if (user.id == userId) {
      const html = `
      <div class="detail">
        <div class="detail__box">
          <img src="${user.avatar}" alt="" class="detail__avatar" />
          <div class="detail__name">${user.first_name} ${user.last_name}</div>
          <div class="detail__id">ID: ${user.id}</div>
          <a href="mailto:${user.email}" class="detail__email">${user.email}</a>
          <div class="input__btn" onclick="showInputBox('${user.id}')">Aggiungi nota</div>
          <div class="detail__block hidden">
            <div class="detail__input" contenteditable="true"></div>
            <div class="detail__save">Salva nota</div>
          </div>
          <div class="note__container"></div>
        </div>
      </div>
      `;
      wrapperDetail.insertAdjacentHTML('afterbegin', html);
    }
  });
}
getUserData();

/////////////////////////////////
// SHOW INPUT BOX
function showInputBox(userId) {
  id = Number(userDetail);
  // console.log(userId, id);
  if (userId == id) {
    let inputContainer = document.querySelector('.detail__block');
    let inputSave = document.querySelector('.detail__save');
    let noteContainer = document.querySelector('.note__container');
    let inputContent = document.querySelector('.detail__input');
    // document.addEventListener('DOMContentLoaded', getNotes);

    inputContainer.classList.remove('hidden');
    inputSave.addEventListener('click', function () {
      // noteContainer.textContent = '';
      if (inputContent.innerHTML !== '') {
        createInputList(noteContainer, inputContent, userId);
        inputContainer.classList.add('hidden');
        inputContent.innerHTML = '';
      }
    });

    // noteContainer.addEventListener('click', deleteItem);
    noteContainer.addEventListener('click', deleteItem);
  }
}

////////////////////////////////
// CREATE TO DO LIST
function createInputList(container, content, userId) {
  id = Number(userDetail);

  // console.log(userId, id);
  if (userId == id) {
    const noteBox = `
      <div class="note">
        <div class="note__text">${content.innerText}<img src="/i/trash-outline.svg" class="note__icon"></div>
      </div>
    `;
    const note = {
      text: content.innerText.replace(/\n\n/gi, ''),
      // .replace(/\n\n/gi, '').replace(/\n/gi, ' ')
      // .replace(/\n/gi, '')
      id: userId,
    };
    console.log(note.text);
    // deleteItem(container);
    container.insertAdjacentHTML('beforeend', noteBox);
    saveInLocalStorage(note);
  }
}

///////////////////////////////
// DELETE NOTE FROM THE LIST
function deleteItem(e) {
  const item = e.target;
  id = Number(userDetail);
  // if (userId == id) {
  if (item.classList[0] === 'note__icon') {
    // let note = document.querySelector('.note');
    const note = item.parentElement.parentElement;
    note.classList.add('delete');
    removeLocalNotes(note);
    setTimeout(() => {
      note.remove();
    }, 500);
    // note.addEventListener('transitionend', function () {
    //   note.remove();
    // });
  }
  // }

  // // CHECK
  // if (item.classList[0] === 'note__check') {
  //   const note = item.parentElement.parentElement;
  //   note.classList.toggle('checked');
  // }
}

function saveInLocalStorage(note) {
  let savedNotes;
  if (localStorage.getItem('savedNotes') === null) {
    savedNotes = [];
  } else {
    savedNotes = JSON.parse(localStorage.getItem('savedNotes'));
  }
  savedNotes.push(note);
  console.log(note);
  localStorage.setItem('savedNotes', JSON.stringify(savedNotes));
}

function getNotes(container) {
  let savedNotes;
  if (localStorage.getItem('savedNotes') === null) {
    savedNotes = [];
  } else {
    savedNotes = JSON.parse(localStorage.getItem('savedNotes'));
  }
  savedNotes.forEach(function (note) {
    if (userDetail == note.id) {
      const noteBox = `
        <div class="note">
          <div class="note__text">${note.text}<img src="/i/trash-outline.svg" class="note__icon"></div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', noteBox);
      container.addEventListener('click', deleteItem);
    }
  });
}

function removeLocalNotes(note) {
  let savedNotes;

  if (localStorage.getItem('savedNotes') === null) {
    savedNotes = [];
  } else {
    savedNotes = JSON.parse(localStorage.getItem('savedNotes'));
  }

  const noteIndex = note.children[0].innerText;
  savedNotes.forEach((savedNote) => {
    // console.log(typeof savedNote.text);
    // const savedStr = savedNote.text.replace(/\n/gi, '');
    // console.log(savedStr);
    if (userDetail == savedNote.id) {
      if (savedNote.text == noteIndex) {
        console.log(savedNotes.indexOf(savedNote));
        savedNotes.splice(savedNotes.indexOf(savedNote), 1);
        localStorage.setItem('savedNotes', JSON.stringify(savedNotes));
      }
    }
  });
}
