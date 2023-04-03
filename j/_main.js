'use strict';

const columnLeft = document.querySelector('.column__inner--left');
const columnContainer = document.querySelector('.column__inner--right');
const confirmationMsg = document.querySelector('.confirmation');
const sortBtnLeft = document.querySelector('.column__sort--left');
const sortBtnRight = document.querySelector('.column__sort--right');
const countContainer = document.querySelectorAll('.column__count');
const countLeft = document.querySelector('.column__count--left');
const countRight = document.querySelector('.column__count--right');
const allColumns = document.querySelectorAll('.column__inner');
const columnLeftContainer = document.querySelector('.column--left');

// REST API `https://reqres.in/api/users`

let userData = {};
let usersControlled = {};
let userDetail = {};
// let sort = false;

let draggedItem;
let currentColumn;
///////////////////
// CREATE DOM NODES
function createDOMNodes(element) {
  let currentArray =
    element === 'userData' ? userData : Object.values(usersControlled);

  // const curArr = sort ? currentArray.slice().sort(sortUsers) : currentArray;
  currentArray.forEach((data) => {
    // User Container
    const userContainer = document.createElement('div');
    userContainer.classList.add('column__item');
    userContainer.draggable = true;
    userContainer.setAttribute('ondragstart', 'drag(event)');

    // Link
    let linkImage = document.createElement('a');
    linkImage.classList.add('column__link');
    linkImage.title = 'View details';
    linkImage.setAttribute('onclick', `showDetail('${data.id}')`);
    linkImage.href = `detail.html`;
    linkImage.draggable = false;

    // Image
    const image = document.createElement('img');
    image.src = data.avatar;
    image.alt = 'Avatar';
    image.classList.add('column__img');

    // User Name
    const userName = document.createElement('div');
    userName.textContent = data.first_name + ' ' + data.last_name;
    userName.classList.add('column__text');

    // Button
    const addBtn = document.createElement('div');
    addBtn.classList.add('btn');

    if (element === 'userData') {
      addBtn.textContent = '+';
      addBtn.setAttribute('onclick', `addUser('${data.id}')`);
    } else {
      addBtn.textContent = '-';
      addBtn.setAttribute('onclick', `removeUser('${data.id}')`);
    }
    if (columnContainer || columnLeft) {
      // columnLeft.setAttribute('ondrop', `drop('e', '${data.id}')`);
      // Append
      if (currentArray == userData) {
        columnLeft.append(userContainer);
        userContainer.append(linkImage, userName, addBtn);
        linkImage.appendChild(image);
      } else {
        columnContainer.append(userContainer);
        userContainer.append(linkImage, userName, addBtn);
        linkImage.appendChild(image);
      }
    }
  });
}

////////////////
// CREATE USERS
const createUsers = function (element) {
  // Get Controlled Users from local Storage
  if (localStorage.getItem('utentiControllati')) {
    usersControlled = JSON.parse(localStorage.getItem('utentiControllati'));
  }
  if (localStorage.getItem('userData')) {
    userData = JSON.parse(localStorage.getItem('userData'));
  }

  if (columnContainer) {
    columnContainer.textContent = '';
  }

  countUsers();
  createDOMNodes(element);
};

////////////////
// GET USER DATA
const getUserData = async function () {
  try {
    const response = await fetch(`https://reqres.in/api/users`);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message}: ${response.status}`);

    userData = data.data;

    createUsers('userData');
    createUsers('usersControlled');
    // displayMsgNoUser();
  } catch (err) {
    console.error(err);
  }
};

////////////////////////
// ADD USER

const addUser = function (userId, element) {
  userData.forEach((item) => {
    if (item.id == userId && !usersControlled[userId]) {
      console.log(usersControlled);
      usersControlled[userId] = item;
      // Object.values(usersControlled).push(item);
      //Confirmation message
      confirmationMsg.hidden = false;
      setTimeout(() => {
        confirmationMsg.hidden = true;
      }, 1000);
      // Set Controlled users in local storage
      localStorage.setItem(
        'utentiControllati',
        JSON.stringify(usersControlled)
      );
    }
  });
  deleteUser(userId);
  if (columnContainer) {
    columnContainer.textContent = '';
  }
  createDOMNodes(element);
};

const deleteUser = function (userId) {
  userData.forEach((item) => {
    let indexData = userData.indexOf(usersControlled[userId]);
    if (item.id == userId && usersControlled[userId]) {
      userData.splice(indexData, 1);
    }
  });
  localStorage.setItem('userData', JSON.stringify(userData));
  columnLeft.textContent = '';
  createUsers('userData');
};

const moveUser = function (userId) {
  for (const [key, value] of Object.entries(usersControlled)) {
    if (userId == key) {
      userData.push(value);
    }
  }
  localStorage.setItem('userData', JSON.stringify(userData));
  columnLeft.textContent = '';
  createUsers('userData');
};

/////////////////////
// Remove user

function removeUser(userId) {
  if (usersControlled[userId]) {
    console.log(userId);
    moveUser(userId);
    delete usersControlled[userId];
    localStorage.setItem('utentiControllati', JSON.stringify(usersControlled));
    createUsers('utentiControllati');
  }
}

function updateArrays(item, column) {
  let currUser = item.children[1].innerText.split(' ').slice(1)[0];

  if (column === 1) {
    userData.forEach((user) => {
      for (const [key, value] of Object.entries(user)) {
        if (currUser == value) {
          usersControlled[user.id] = user;
          localStorage.setItem(
            'utentiControllati',
            JSON.stringify(usersControlled)
          );
          // console.log(userData.indexOf(user));
          let indexData = userData.indexOf(user);
          userData.splice(indexData, 1);
          localStorage.setItem('userData', JSON.stringify(userData));
          createUsers('utentiControllati');
        }
      }
    });
  } else if (column === 0) {
    Object.entries(usersControlled).forEach((user) => {
      const userLastName = user[1].last_name;
      if (currUser == userLastName) {
        userData.push(user[1]);
        localStorage.setItem('userData', JSON.stringify(userData));
        console.log(typeof usersControlled);
        delete usersControlled[user[1].id];
        console.log(usersControlled);
        localStorage.setItem(
          'utentiControllati',
          JSON.stringify(usersControlled)
        );
        columnLeft.textContent = '';
        createUsers('userData');
        createUsers('utentiControllati');
      }
    });
  } else {
    return;
  }
  confirmationMsg.hidden = false;
  setTimeout(() => {
    confirmationMsg.hidden = true;
  }, 1000);
  countUsers();
}

///////////////////
// COUNT USERS

function countUsers() {
  countLeft.textContent = userData.length;
  countRight.textContent = Object.values(usersControlled).length;
  displayMsgNoUser();
}

getUserData();

// sortBtn.addEventListener('click', () => {
//   userData.forEach((user) => {
//     let userNames = user.first_name;
//     userNamesArr.push(user.first_name);
//   });

//   // console.log(userNames);
//   // let usersArr = [];
//   // for (let i = 0; i <= userData.length; i++) {
//   //   usersArr.push(i[user.first_name]);
//   // }
//   // console.log(usersArr);
// });
////////////////////////
// DRAG & DROP

function drag(e) {
  draggedItem = e.target;
}

function allowDrop(e) {
  e.preventDefault();
}

function dragEnter(column) {
  allColumns[column].classList.add('over');
  currentColumn = column;
}

function drop(e) {
  e.preventDefault();
  allColumns.forEach((column) => {
    column.classList.remove('over');
  });
  const parent = allColumns[currentColumn];
  const parentNumber = draggedItem.parentElement
    .getAttribute('ondragenter')
    .charAt(10);
  if (parentNumber != currentColumn) {
    parent.appendChild(draggedItem);
    updateArrays(draggedItem, currentColumn);
  } else {
    return;
  }
}

const addUserButtons = document.querySelectorAll('.box__button');
addUserButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const inputBox = btn.nextElementSibling;
    inputBox.classList.toggle('box__input--visible');
  });
});

/////////////////////////
// ADD USER
const imgFile = document.querySelector('#box__file');
let uploadedImage = '';

imgFile.addEventListener('change', function (input) {
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    // localStorage.setItem('uploadedImage', JSON.stringify(reader.result));
    uploadedImage = reader.result;
    // console.log(reader.readAsDataURL(imgFile));
    document.querySelector('#box__display').src = uploadedImage;
    document
      .querySelector('#box__display')
      .classList.add('box__display--active');
  });
  reader.readAsDataURL(this.files[0]);
});

function saveUserInput() {
  let userIndex = userData.length + 1 + Object.keys(usersControlled).length;
  let userInput = document.getElementById('box__text').value;
  let userInputArr = userInput.split(' ');
  let userImage = document.getElementById('box__display').src;
  let newUser = {
    id: userIndex,
    email: '',
    first_name: userInputArr[0],
    last_name:
      (userInputArr[1] !== undefined ? userInputArr[1] : '') +
      ' ' +
      (userInputArr[2] !== undefined ? userInputArr[2] : ''),
    avatar: userImage !== '' ? userImage : '/i/user-default.png',
  };
  if (userInput !== '') {
    userData.push(newUser);
    // console.log(userData.indexOf(newUser));
    localStorage.setItem('userData', JSON.stringify(userData));
    columnLeft.textContent = '';
    createUsers('userData');
    createUsers('utentiControllati');
    let displayBox = document.querySelector('.box__input');
    console.log(displayBox);
    if (displayBox.classList.contains('box__input--visible')) {
      displayBox.classList.remove('box__input--visible');
    }
    document.getElementById('box__text').value = '';
    document
      .getElementById('box__display')
      .classList.remove('box__display--active');
    document.getElementById('box__file').value = '';
  } else {
    let errorBtn = document.querySelector('.box__error');
    errorBtn.classList.add('box__error--visible');
  }

  // localStorage.setItem('userInput', JSON.stringify(userInput));
  // showNewUser(userInput);
}

function displayMsgNoUser() {
  if (userData.length < 1) {
    if (columnLeft) {
      columnLeft.textContent = '';
    }
    const noUserMsg = document.createElement('div');
    noUserMsg.textContent = 'Non ci sono utenti disponibili';
    noUserMsg.classList.add('column__message');
    columnLeft.append(noUserMsg);
    console.log(userData);
  } else if (Object.values(usersControlled).length < 1) {
    const noUserMsg = document.createElement('div');
    noUserMsg.textContent = 'Non ci sono utenti controllati';
    noUserMsg.classList.add('column__message');
    columnContainer.append(noUserMsg);
  }
}

/////////////////////////
// SORT USERS BY FIRST NAME

function sortUsers(data) {
  console.log(data);
  data.sort(function (a, b) {
    if (a.first_name < b.first_name) {
      return -1;
    }
    if (a.first_name > b.first_name) {
      return 1;
    }
    return 0;
  });
}

sortBtnLeft.addEventListener('click', () => {
  sortBtnLeft.classList.toggle('column__sort--active');
  if (sortBtnLeft.classList.contains('column__sort--active')) {
    sortUsers(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
    columnLeft.textContent = '';
    createUsers('userData');
    createUsers('utentiControllati');
  } else {
    userData.reverse();
    localStorage.setItem('userData', JSON.stringify(userData));
    columnLeft.textContent = '';
    createUsers('userData');
    createUsers('utentiControllati');
  }
});
sortBtnRight.addEventListener('click', () => {
  sortBtnRight.classList.toggle('column__sort--active');
  if (sortBtnRight.classList.contains('column__sort--active')) {
    let usersControlledArr = Object.values(usersControlled);
    sortUsers(usersControlledArr);
    console.log(usersControlledArr);
    localStorage.setItem(
      'utentiControllati',
      JSON.stringify(Object.values(usersControlledArr))
    );
    createUsers('utentiControllati');
  } else {
    let usersControlledArr = Object.values(usersControlled);
    usersControlledArr.reverse();
    console.log(usersControlledArr);
    localStorage.setItem(
      'utentiControllati',
      JSON.stringify(usersControlledArr)
    );
    createUsers('utentiControllati');
  }
});

// ////////////////////////
// DETAIL

function showDetail(dataId) {
  localStorage.setItem('userDetail', JSON.stringify(dataId));
  localStorage.setItem('userData', JSON.stringify(userData));
  localStorage.setItem('utentiControllati', JSON.stringify(usersControlled));
}
