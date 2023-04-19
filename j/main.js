'use strict';

const columnLeft = document.querySelector('.column__inner--left');
const columnContainer = document.querySelector('.column__inner--right');
const confirmationMsg = document.querySelector('.confirmation');
const sortBtns = document.querySelectorAll('.column__sort');
const sortBtnLeft = document.querySelector('.column__sort--left');
const sortBtnRight = document.querySelector('.column__sort--right');
const countContainer = document.querySelectorAll('.column__count');
const countLeft = document.querySelector('.column__count--left');
const countRight = document.querySelector('.column__count--right');
const allColumns = document.querySelectorAll('.column__inner');
const columnLeftContainer = document.querySelector('.column--left');
const addNewUserButton = document.querySelector('.box__button');
const btnSortLeft = document.querySelector('.column__sort--left');
const btnSortRight = document.querySelector('.column__sort--right');

// REST API `https://reqres.in/api/users`

let userData = {};
let usersControlled = [];
let userDetail = {};
// let sort = false;

let draggedItem;
let currentColumn;

///////////////////
// CREATE DOM NODES
function createDOMNodes(element) {
  let currentArray = element === 'userData' ? userData : usersControlled;

  currentArray.forEach((data) => {
    // User Container
    const userContainer = document.createElement('div');
    userContainer.classList.add('column__item');
    userContainer.draggable = true;
    userContainer.setAttribute('ondragstart', 'drag(event)');

    // Detail link
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

    // Buttons
    const addBtn = document.createElement('div');
    addBtn.classList.add('btn');

    if (element === 'userData') {
      addBtn.textContent = '+';
      addBtn.setAttribute('onclick', `addUser('${element}','${data.id}')`);
    } else {
      addBtn.textContent = '-';
      addBtn.setAttribute('onclick', `addUser('${element}','${data.id}')`);
    }
    // Append
    if (columnContainer || columnLeft) {
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
  if (localStorage.getItem('usersControlled')) {
    usersControlled = JSON.parse(localStorage.getItem('usersControlled'));
  }
  if (localStorage.getItem('userData')) {
    userData = JSON.parse(localStorage.getItem('userData'));
  }

  countUsers();
  btnSortLeft.style.display = 'block';
  btnSortRight.style.display = 'block';
  displayMsgInColumn(userData, 'Non ci sono utenti disponibili');
  displayMsgInColumn(usersControlled, 'Non ci sono utenti controllati');

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
  } catch (err) {
    console.error(err);
  }
};

/////////////////////////
//Confirmation message

function callConfirmationMsg(confirmationText) {
  confirmationMsg.textContent = confirmationText;
  confirmationMsg.hidden = false;
  setTimeout(() => {
    confirmationMsg.hidden = true;
  }, 1000);
}

///////////////
// Delete user

const deleteUser = function (currentArray, userId) {
  currentArray.forEach((user) => {
    let indexData = currentArray.indexOf(user);
    if (user.id == userId) {
      currentArray.splice(indexData, 1);
    }
  });
  if (currentArray === userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
  } else if (currentArray === usersControlled) {
    localStorage.setItem('usersControlled', JSON.stringify(usersControlled));
  }
};

//////////////
// Add user

function addUser(element, userId) {
  let currentArray = element === 'userData' ? userData : usersControlled;
  let oppositeArray = element === 'userData' ? usersControlled : userData;
  currentArray.forEach((user) => {
    if (user.id == userId) {
      oppositeArray.push(user);
      if (currentArray === userData) {
        localStorage.setItem(
          'usersControlled',
          JSON.stringify(usersControlled)
        );
      } else {
        localStorage.setItem('userData', JSON.stringify(userData));
      }
    }
  });
  let userContainer = document.querySelectorAll('.column__item');
  userContainer.forEach((container) => {
    container.style.opacity = '0';
    container.style.visibilty = 'hidden';
  });
  setTimeout(() => {
    callConfirmationMsg('Aggiunto!');
    deleteUser(currentArray, userId);
    columnLeft.textContent = '';
    columnContainer.textContent = '';
    createUsers('userData');
    createUsers('usersControlled');
  }, 200);
}

///////////////////
// COUNT USERS

function countUsers() {
  countLeft.textContent = userData.length;
  countRight.textContent = usersControlled.length;
}

getUserData();

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

////////////
// Update arrays on drop

function updateArrays(item, column) {
  let currUserSurname = item.children[1].innerText.split(' ').slice(1)[0];
  let currUserName = item.children[1].innerText.split(' ').slice(0)[0];
  console.log(currUserSurname);
  let currentArray = column === 1 ? userData : usersControlled;
  let oppositeArray = column === 1 ? usersControlled : userData;
  currentArray.forEach((user) => {
    for (const [key, value] of Object.entries(user)) {
      console.log(value);
      if (currUserSurname == value || currUserName == value) {
        oppositeArray.push(user);
        let indexData = currentArray.indexOf(user);
        currentArray.splice(indexData, 1);
        localStorage.setItem(
          'usersControlled',
          JSON.stringify(usersControlled)
        );
        localStorage.setItem('userData', JSON.stringify(userData));
        if (currentArray === userData) {
          columnContainer.textContent = '';
          createUsers('usersControlled');
        } else {
          columnLeft.textContent = '';
          createUsers('userData');
          // createUsers('usersControlled');
          //
        }
      }
    }
  });
  callConfirmationMsg('Aggiunto!');
  countUsers();
}

////////////////
// Drop user

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

/////////////////////////
// ADD NEW USER

addNewUserButton.addEventListener('click', () => {
  const inputBox = addNewUserButton.nextElementSibling;
  inputBox.classList.toggle('box__input--visible');
});

const imgFile = document.querySelector('#box__file');
let uploadedImage = '';

imgFile.addEventListener('change', function (input) {
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    uploadedImage = reader.result;
    document.querySelector('#box__display').src = uploadedImage;
    document
      .querySelector('#box__display')
      .classList.add('box__display--active');
  });
  reader.readAsDataURL(this.files[0]);
});

function saveUserInput() {
  let userName = document.getElementById('box__text').value;
  let userEmail = document.getElementById('box__email').value;
  let userNameArr = userName.split(' ');
  let userImage = document.getElementById('box__display').src;

  let userDataIds = [];
  usersControlled.forEach((user) => {
    userDataIds.push(user.id);
  });
  userData.forEach((user) => {
    userDataIds.push(user.id);
  });
  let highestId = Math.max.apply(0, userDataIds);
  let userId = highestId + 1;

  // Create new user
  let newUser = {
    id: userId,
    email: userEmail,
    first_name: userNameArr[0],
    last_name:
      (userNameArr[1] !== undefined ? userNameArr[1] : '') +
      ' ' +
      (userNameArr[2] !== undefined ? userNameArr[2] : ''),
    avatar:
      userImage !== '' ? userImage : '/web-app-exercise/i/user-default.png',
  };

  // validate email
  let validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  // Push new user to userData array
  if (userName !== '' && userEmail !== '' && userEmail.match(validRegex)) {
    userData.push(newUser);
    localStorage.setItem('userData', JSON.stringify(userData));
    columnLeft.textContent = '';
    createUsers('userData');
    let displayInputBox = document.querySelector('.box__input');
    if (displayInputBox.classList.contains('box__input--visible')) {
      displayInputBox.classList.remove('box__input--visible');
    }

    document.getElementById('box__text').value = '';
    document.getElementById('box__email').value = '';
    document
      .getElementById('box__display')
      .classList.remove('box__display--active');
    document.getElementById('box__file').value = '';
    callConfirmationMsg('Aggiunto nuovo utente!');
  } else if (userName == '' && userEmail == '') {
    let errorBtn = document.querySelector('.box__error--all');
    errorBtn.classList.add('box__error--visible');
    document.getElementById('box__text').addEventListener('click', () => {
      errorBtn.classList.remove('box__error--visible');
    });
    document.getElementById('box__email').addEventListener('click', () => {
      errorBtn.classList.remove('box__error--visible');
    });
  } else if (userName == '') {
    let errorBtn = document.querySelector('.box__error--name');
    errorBtn.classList.add('box__error--visible');
    document.getElementById('box__text').addEventListener('click', () => {
      errorBtn.classList.remove('box__error--visible');
    });
  } else if (userEmail == '' || !userEmail.match(validRegex)) {
    let errorBtn = document.querySelector('.box__error--email');
    errorBtn.classList.add('box__error--visible');
    document.getElementById('box__email').addEventListener('click', () => {
      errorBtn.classList.remove('box__error--visible');
    });
  }
}

/////////////////////////
// SORT USERS BY FIRST NAME

function sortUsers(data) {
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
  } else {
    userData.reverse();
    localStorage.setItem('userData', JSON.stringify(userData));
    columnLeft.textContent = '';
    createUsers('userData');
  }
});

sortBtnRight.addEventListener('click', () => {
  sortBtnRight.classList.toggle('column__sort--active');
  if (sortBtnRight.classList.contains('column__sort--active')) {
    sortUsers(usersControlled);
    localStorage.setItem('usersControlled', JSON.stringify(usersControlled));
    columnContainer.textContent = '';
    createUsers('usersControlled');
  } else {
    usersControlled.reverse();
    localStorage.setItem('usersControlled', JSON.stringify(usersControlled));
    columnContainer.textContent = '';
    createUsers('usersControlled');
  }
});

///////////
// Display messages for each column

function displayMsgInColumn(currentArray, message) {
  if (currentArray.length < 1) {
    if (currentArray == userData && columnLeft) {
      columnLeft.textContent = '';
      btnSortLeft.style.display = 'none';
    } else if (currentArray == usersControlled && columnContainer) {
      columnContainer.textContent = '';
      btnSortRight.style.display = 'none';
    }
    const noUserMsg = document.createElement('div');
    noUserMsg.textContent = message;
    noUserMsg.classList.add('column__message');
    (currentArray == userData ? columnLeft : columnContainer).append(noUserMsg);
  }
}

////////////////
// SEARCH USER
function findSearchResults(results) {
  console.log(results);
  results.forEach((result) => {
    let userContainer = document.querySelectorAll('.column__item');
    for (let i = 0; i < userContainer.length; i++) {
      let userName = userContainer[i].children[1].innerText;
      console.log(userName);
      console.log(userName.toLowerCase().indexOf(result));
      if (userName.toLowerCase().indexOf(result) > -1) {
        console.log(userContainer[i]);
        userContainer[i].style.display = 'none';
      } else {
        userContainer[i].style.display = 'flex';
      }
    }
    // let userName = container.children[1].innerText.split(' ').slice(0)[0];
    // userContainer.forEach((container) => {
    //   if (user.first_name == userName) {
    //     console.log(result);
    //   } else {
    //   }

    //   // .getAttribute('ondragenter').charAt(10);
    //   //let currUserName = item.children[1].innerText.split(' ').slice(0)[0];
    // });
  });
  // let searchResults;

  // if (localStorage.getItem('searchResults') === null) {
  //   searchResults = [];
  // } else {
  //   searchResults = JSON.parse(localStorage.getItem('searchResults'));
  // }
  // searchResults.push(result);
  // localStorage.setItem('searchResults', JSON.stringify(searchResults));
}
const searchInput = document.querySelector('[data-search]');
searchInput.addEventListener('input', (e) => {
  const value = e.target.value.toLowerCase();
  userData.forEach((user) => {
    const isAvailable =
      user.first_name.toLowerCase().includes(value) ||
      user.last_name.toLowerCase().includes(value) ||
      (
        user.first_name.toLowerCase() +
        ' ' +
        user.last_name.toLowerCase()
      ).includes(value);
    const columnLeftChildren = columnLeft.children;
    for (let i = 0; i < columnLeftChildren.length; i++) {
      let child = columnLeftChildren[i];
      let childValue = child.children[1].innerText.toLowerCase();
      let userFullName =
        user.first_name.toLowerCase() + ' ' + user.last_name.toLowerCase();
      console.log(childValue, userFullName, value);
      if (childValue == userFullName) {
        // console.log(userFullName, childValue, value);
        // child.classList.toggle('hidden', !isAvailable);
        child.classList.toggle('hidden', !isAvailable);
      }
    }
    // user.element.classList.toggle('hidden', !isAvailable);
  });
});

// const searchInput = document.querySelector('.form__input');
// searchInput.addEventListener('input', (e) => {
//   let inputValue = e.target.value;
//   if (inputValue && inputValue.trim().length > 0) {
//     inputValue = inputValue.trim().toLowerCase();
//     findSearchResults(
//       userData.filter((user) => {
//         let userNameLowerCase = user.first_name.toLowerCase();
//         return userNameLowerCase.includes(inputValue);
//       })
//     );
//   } else {
//     //invalid input
//   }
// });

// ////////////////////////
// DETAIL

function showDetail(dataId) {
  localStorage.setItem('userDetail', JSON.stringify(dataId));
  localStorage.setItem('userData', JSON.stringify(userData));
  localStorage.setItem('usersControlled', JSON.stringify(usersControlled));
}
