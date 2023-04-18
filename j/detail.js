const wrapperDetail = document.querySelector('.wrapper-detail');
// const inputContainer = document.createElement('div');
// inputContainer.classList.add('input__container');
// wrapperDetail.appendChild(inputContainer);
const detailBtn = document.querySelector('.detail__btn');
const detailButton = document.querySelector('.detail__button');

let baseUrl = window.location.origin + '/web-app-exercise';

let userData = [];
// let savedNotes = [];
///////////////////
// GET DATA
// const getUserData = async function () {
//   try {
//     const response = await fetch(`https://reqres.in/api/users`);
//     const data = await response.json();

//     if (!response.ok) throw new Error(`${data.message}: ${response.status}`);

//     userData = data.data;
//     createUserDetail();
//     let noteContainer = document.querySelector('.note__container');
//     getNotes(noteContainer);
//     noteContainer.addEventListener('click', deleteItem);
//   } catch (err) {
//     console.error(err);
//   }
// };

function addZero(i) {
  if (i < 10) {
    i = '0' + i;
  }
  return i;
}

const createUsers = function () {
  // Get Controlled Users from local Storage
  if (localStorage.getItem('usersControlled')) {
    usersControlled = JSON.parse(localStorage.getItem('usersControlled'));
  }
  if (localStorage.getItem('userData')) {
    userData = JSON.parse(localStorage.getItem('userData'));
  }
  createUserDetail('userData');
  createUserDetail('usersControlled');
  const detailBox = document.querySelector('.detail');

  let noteContainer = document.querySelector('.note__container');
  getNotes(noteContainer);
  const noteDeleteBtn = document.querySelector('.note__delete');
  if (noteContainer) {
    if (
      noteContainer.children === null ||
      noteContainer.children.length === 0
    ) {
      noteDeleteBtn.style.display = 'none';
    } else {
      noteDeleteBtn.style.display = 'block';
    }
    noteContainer.addEventListener('click', deleteItem);
  }
  const detailContainer = document.querySelector('.detail__container');

  // const detailBox = document.querySelector('.detail');
  if (detailBox == null) {
    removeDOMelements(detailContainer);
  }
};
///////////////////
// CREATE USER
function createUserDetail(element) {
  let currentArray = element === 'userData' ? userData : usersControlled;
  userDetail = JSON.parse(localStorage.getItem('userDetail'));
  userId = Number(userDetail);
  currentArray.forEach((user) => {
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
            <button class="note__delete" onclick="deleteAllNotes()">Cancella tutte le note<img src="/web-app-exercise/i/trash-outline.svg" class="note__icon note__icon--delete"></button>
          </div>
          <a href=${baseUrl}/index.html class="detail__btn">&#8592; Utenti</a>
          <button class="detail__button" onclick="removeUser('${element}')">
            Remove user
          </button>
        </div>
      `;
      wrapperDetail.insertAdjacentHTML('afterbegin', html);
    }
  });
}

/////////////////////////////////
// SHOW INPUT BOX
function showInputBox(userId) {
  id = Number(userDetail);
  if (userId == id) {
    let inputContainer = document.querySelector('.detail__block');
    let inputSave = document.querySelector('.detail__save');
    let noteContainer = document.querySelector('.note__container');
    let inputContent = document.querySelector('.detail__input');

    inputContainer.classList.remove('hidden');
    inputSave.addEventListener('click', function () {
      if (inputContent.innerHTML !== '') {
        createInputList(noteContainer, inputContent, userId);
        inputContainer.classList.add('hidden');
        inputContent.innerHTML = '';
      }
    });

    noteContainer.addEventListener('click', deleteItem);
  }
}

////////////////////////////////
// CREATE TO DO LIST
function createInputList(container, content, userId) {
  id = Number(userDetail);
  let day = String(new Date().getDate()).padStart(2, '0');
  let month = String(new Date().getMonth() + 1).padStart(2, '0');
  let year = new Date().getFullYear();
  let hour = addZero(new Date().getHours());
  let minutes = addZero(new Date().getMinutes());
  const date = [day, month, year].join('/');
  const hours = [hour, minutes].join(':');
  if (userId == id) {
    const noteBox = `
      <div class="note">
        <div class="note__date">${date}<span>${hours}</span></div>
        <div class="note__text">${content.innerText}<img src="/web-app-exercise/i/trash-outline.svg" class="note__icon"></div>
      </div>
    `;
    const note = {
      date: date,
      hours: hours,
      text: content.innerText.replace(/\n\n/gi, ''),
      // .replace(/\n\n/gi, '').replace(/\n/gi, ' ')
      // .replace(/\n/gi, '')
      id: userId,
    };
    container.insertAdjacentHTML('beforeend', noteBox);
    saveInLocalStorage(note);
    const deleteBtnDisplay = document.querySelector('.note__delete');
    const noteContainer = document.querySelector('.note__container');
    if (noteContainer.children.length === 0) {
      noteDeleteBtn.style.display = 'none';
    } else {
      deleteBtnDisplay.style.display = 'block';
    }
  }
}

///////////////////////////////
// DELETE NOTE FROM THE LIST
function deleteItem(e) {
  const item = e.target;
  id = Number(userDetail);
  if (item.classList[0] === 'note__icon') {
    const note = item.parentElement.parentElement;
    note.classList.add('delete');
    removeLocalNotes(note);
    setTimeout(() => {
      note.remove();
    }, 500);
  }
}

function saveInLocalStorage(note) {
  let savedNotes;
  if (localStorage.getItem('savedNotes') === null) {
    savedNotes = [];
  } else {
    savedNotes = JSON.parse(localStorage.getItem('savedNotes'));
  }
  savedNotes.push(note);
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
    if (note.id !== null && userDetail == note.id) {
      const noteBox = `
        <div class="note">
          <div class="note__date">${note.date}<span>${note.hours}</span></div>
          <div class="note__text">${note.text}<img src="/web-app-exercise/i/trash-outline.svg" class="note__icon"></div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', noteBox);
      container.addEventListener('click', deleteItem);
    } else {
      return;
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

  const noteIndex = note.children[1].innerText;
  savedNotes.forEach((savedNote) => {
    // console.log(typeof savedNote.text);
    // const savedStr = savedNote.text.replace(/\n/gi, '');
    // console.log(savedStr);
    if (userDetail == savedNote.id) {
      if (savedNote.text == noteIndex) {
        savedNotes.splice(savedNotes.indexOf(savedNote), 1);
        localStorage.setItem('savedNotes', JSON.stringify(savedNotes));
      }
    }
  });
}

function deleteAllNotes() {
  savedNotes = JSON.parse(localStorage.getItem('savedNotes'));
  savedNotes = [];
  localStorage.setItem('savedNotes', JSON.stringify(savedNotes));
  let notes = document.querySelectorAll('.note');
  notes.forEach((note) => {
    note.classList.add('delete');
    setTimeout(() => {
      note.remove();
    }, 500);
  });
  const deleteBtnDisplay = document.querySelector('.note__delete');
  deleteBtnDisplay.style.display = 'none';
}

function removeUser(element) {
  let currentArray = element === 'userData' ? userData : usersControlled;
  let userId = Number(userDetail);

  const detailBox = document.querySelector('.detail');
  const detailContainer = document.querySelector('.detail__container');
  currentArray.forEach((user) => {
    console.log(user.id, userId);
    if (user.id == userId) {
      let indexData = currentArray.indexOf(user);
      currentArray.splice(indexData, 1);
      if (currentArray == userData) {
        localStorage.setItem('userData', JSON.stringify(userData));
      } else {
        localStorage.setItem(
          'usersControlled',
          JSON.stringify(usersControlled)
        );
      }
    }
  });
  detailBox.remove();
  removeDOMelements(detailContainer);
}
console.log();
function removeDOMelements(detailContainer) {
  // const detailContainer = document.querySelector('.detail__container');
  let userRemovedMsg = document.createElement('div');
  let goBackButton = document.createElement('a');
  goBackButton.href = baseUrl + '/index.html';
  goBackButton.textContent = 'go back';
  userRemovedMsg.textContent = 'Utente rimosso correttamente';
  userRemovedMsg.classList.add('detail__remove');
  detailContainer.append(userRemovedMsg, goBackButton);
}

createUsers();
