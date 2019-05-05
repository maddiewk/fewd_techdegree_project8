// set up variables
const $gallery = $('.gallery');
const $userInput = $('#search');
const $closeBtn = $('.close');
const $emplModal = $('.modal');

// class constructor to create random employee
class Employee {

  constructor (name, location, email, picture, cell, dob) {
    this.name = name;
    this.location = location;
    this.email = email;
    this.picture = picture;
    this.cell = cell;
    this.dob = dob;
  }

  // create new div for each employee
  createDiv() {
    let div = `
      <div class='box'>
      <img class='gall-photo' src='${this.picture.medium}'>
        <div class='info'>
          <h3 class='name'>${this.name.first} ${this.name.last}</h3>
          <p class='email'>${this.email}</p>
          <p class='location'>${this.location.city}</p>
        </div>
      </div>`;
    return div;
  }

//create modal window for each employee
 createModalWindow(profile) {

  const birthdayFormat = (bday) => {
    // get date
    let emplBday = bday.slice(0,10).split("-");
    return `${emplBday[1]}/${emplBday[2]}/${emplBday[0].slice(0,4)}`; // 4-digit year
  };

  let window = `
    <div class='modal'>
    <span class='close'>X</span>
      <div class='pic_wrap'>
        <img class='modal_img' src='${this.picture.large}'>
      </div>
      <div class='modal_details'>
          <h3 class='modal_name'>${this.name.first} ${this.name.last}</h3>
          <p class='modal_email'>${this.email}</p>
          <p class='modal_location'>${this.location.city}</p>
          <hr>
          <p>${this.cell}</p>
          <p class='modal_location'>${this.location.street} ${this.location.city}, ${this.location.state} ${this.location.postcode}</p>
          <p class='modal_birthday'>Birthday: ${birthdayFormat(this.dob.date)}</p>
      </div>
      <div class='arrow_buttons'>
        <a href='#' class='prev'>&#x21e6;</a>
        <a href='#' class='next'>&#x21e8;</a>
      </div>
    </div>
  `;
  return window;
  }
}

// empty array to hold data received using Fetch API
let employeeArray = [];

// use Fetch to retrieve data for 12 random employees and parse to JSON
const getRandomEmployee = () => {
  return fetch('https://randomuser.me/api/?results=12&inc=name,location,email,picture,cell,dob&nat=NZ,US')
  .then(response => response.json())
  .then(data => {return data.results;});
};

// take the retrieved data and append one employee per box div
function appendEmployee() {
  getRandomEmployee()
    .then(results => {
      const employees = results;
      employees.map(employee => {
        const empl = new Employee(employee.name, employee.location, employee.email, employee.picture, employee.cell, employee.dob);
        employeeArray.push(empl);
      });
      employeeArray.map(employee => {
        const square = employee.createDiv();
        $gallery.append(square);

        const modalWindow = employee.createModalWindow();
        $gallery.append(modalWindow);

        $('.modal').hide();
      });

  //click function to bring up modal window
    $('.box').on('click', function() {
      $(this).next().show();
      $('.box').addClass('disabled');
      $('body').addClass('overlay');
      $('#search').hide();
    });

  // click function to close modal window
    $('.close').on('click', function() {
      $(this).parent().hide();
      $('.box').removeClass('disabled');
      $('body').removeClass('overlay');
      $('#search').show();
    });

  // disable the "next" button on the last modal window
    $('.arrow_buttons:eq(11) > .next').addClass('hide');

  // click function for each next button on the modal window
    $('.next').on('click', function() {
      let parent = $(this).parent().parent(); // gets the modal window div currently displaying
        parent.hide();
        parent.next().next().show();
    });

  // disable the "prev" button on the first modal window
    $('.arrow_buttons:eq(0) > .prev').addClass('hide');

  // click function for each previous button on the modal window
    $('.prev').on('click', function() {
      let parent = $(this).parent().parent();
        parent.hide();
        parent.prev().prev().show();
    });

    // search bar function that filters employees by name
    $userInput.on('keyup', function(){
      let userSearch = $userInput.val().toLowerCase();
      let names = $('.name');

      for (let i = 0; i < names.length; i ++) {
        if ( names[i].innerHTML.indexOf(userSearch) > -1 ) {
          names[i].parentElement.parentElement.style.display = '';
        } else {
          names[i].parentElement.parentElement.style.display = 'none';
        }
      }
    });
  });
}
appendEmployee();
