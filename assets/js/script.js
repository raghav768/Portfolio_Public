'use strict';


// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}
var settingsButton = document.getElementById('settingsButton');
var settingsMenu = document.getElementById('settingsMenu');
var colorPickers = document.getElementsByClassName('colorPicker');
var bgChange = document.getElementsByClassName('bgChange');

function toggleSettingsMenu(event) {
  settingsMenu.style.display = (settingsMenu.style.display === 'block') ? 'none' : 'block';
  if (settingsMenu.style.display === 'block') {
      adjustMenuPosition();
  }
}

function adjustMenuPosition() {
  var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  var left = settingsButton.offsetLeft + settingsButton.offsetWidth;
  var top = settingsButton.offsetTop;

  if (left + settingsMenu.offsetWidth > viewportWidth) {
      left = settingsButton.offsetLeft - settingsMenu.offsetWidth;
  }
  if (top + settingsMenu.offsetHeight > viewportHeight) {
      top = viewportHeight - settingsMenu.offsetHeight;
  }
  top = Math.max(top, 0);

  settingsMenu.style.left = left + 'px';
  settingsMenu.style.top = top + 'px';
}

function handleDragStart(event) {
  event.dataTransfer.setData('text/plain', 'settingsButton');
  settingsMenu.style.display = 'none';
}

function handleDrop(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData('text');
  var element = document.getElementById(data);
  element.style.left = event.clientX + 'px';
  element.style.top = event.clientY + 'px';
}

settingsButton.addEventListener('click', toggleSettingsMenu);
settingsButton.addEventListener('dragstart', handleDragStart);
document.body.addEventListener('dragover', function(event) { event.preventDefault(); });
document.body.addEventListener('drop', handleDrop);
// font color change dynamic way 
function updateFontColor(bgColor) {
  var r = parseInt(bgColor.slice(1, 3), 16);
  var g = parseInt(bgColor.slice(3, 5), 16);
  var b = parseInt(bgColor.slice(5, 7), 16);
  var brightness = Math.round(((r * 299) + (g * 587) + (b * 114)) / 1000);
  var fontColor = (brightness > 125) ? 'black' : 'white';
  document.documentElement.style.setProperty('--light-gray', fontColor);
  document.documentElement.style.setProperty('--white-2', fontColor);
}
function getBrightness(color) {
  var r = parseInt(color.slice(1, 3), 16);
  var g = parseInt(color.slice(3, 5), 16);
  var b = parseInt(color.slice(5, 7), 16);
  return Math.round(((r * 299) + (g * 587) + (b * 114)) / 1000);
}
// Change the font color or background color when a color is picked
for (var i = 0; i < colorPickers.length; i++) {
  colorPickers[i].addEventListener('input', function() {
      if (this.id === 'fontColorPicker' || this.id === 'fontColorPickerl') {
        var bgColorPicker1 = document.getElementById('bgColorPicker');
        var bgColorPicker2 = document.getElementById('bgColorPickerl');
        var bgBrightness1 = getBrightness(bgColorPicker1.value);
        var bgBrightness2 = getBrightness(bgColorPicker2.value);
        var fontBrightness = getBrightness(this.value);
        // if (Math.abs(fontBrightness - bgBrightness1) <= 80 || Math.abs(fontBrightness - bgBrightness2) <= 80) {
        //   alert('The font color is too similar to the background color. Please choose a different color.');
        // } else {
          for (var j = 0; j < bgChange.length; j++) {
            document.documentElement.style.setProperty('--light-gray', this.value);
            document.documentElement.style.setProperty('--white-2', this.value);
          }
        // }
      } else if (this.id === 'bgColorPicker' || this.id === 'bgColorPickerl') {
        for (var j = 0; j < bgChange.length; j++) {
          bgChange[j].style.backgroundColor = this.value;
            document.documentElement.style.setProperty('--bg-gradient-jet', this.value);
            document.documentElement.style.setProperty('--eerie-black-1', this.value);
        }
        updateFontColor(this.value);
      }else if(this.id === 'bdColorPicker' || this.id === 'bdColorPickerl'){
        document.documentElement.style.setProperty('--jet', this.value);
        document.documentElement.style.setProperty('--border-gradient-onyx', this.value);
      }else if(this.id === 'buttonColor' || this.id === 'buttonColorl'){
        document.getElementById('settingsButton').style.backgroundColor = this.value;
      }
  });
}
window.onload = function() {
  var elem = document.querySelector('.h2')
  document.getElementById('fontColorPicker').value = rgbToHex(window.getComputedStyle(elem).getPropertyValue('color'));
  document.getElementById('bgColorPicker').value = rgbToHex(window.getComputedStyle(document.documentElement).getPropertyValue('--bg-gradient-jet'));
  document.getElementById('bdColorPicker').value = rgbToHex(window.getComputedStyle(document.documentElement).getPropertyValue('--jet'));
  document.getElementById('buttonColor').value = rgbToHex(window.getComputedStyle(document.getElementById('settingsButton')).getPropertyValue('background-color'));
}

function rgbToHex(rgb) {
  var a = rgb.split("(")[1].split(")")[0];
  a = a.split(",");
  var b = a.map(function(x){
      x = parseInt(x).toString(16);
      return (x.length==1) ? "0"+x : x;
  })
  return "#"+b.join("");
}


// removing radius from navbar
// window.onscroll = function() {
//   var navbar = document.querySelector('.navbar');
//   if (window.scrollY > 55) {
//     navbar.classList.add('sticky');
//   } else {
//     navbar.classList.remove('sticky');
//   }
// };
window.onscroll = function() {
  var navbar = document.querySelector('.navbar');
  if (window.scrollY > 55 && window.innerWidth > 1249) { // change 768 to your desired screen width
    navbar.classList.add('sticky');
  } else  if (window.scrollY > 269 && window.innerWidth > 1023)  {
    navbar.classList.add('sticky');
  } else  {
    navbar.classList.remove('sticky');
  }
};
// fetch('/sendEmail', {
//   method: 'POST',
//   headers: {
//       'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(formData),
// })
// .then(response => response.json())
// .then(data => {
//   const flashMessageElement = document.getElementById('flash-message');
//   flashMessageElement.textContent = data.message;
//   flashMessageElement.className = data.type;
// })
// .catch((error) => {
//   console.error('Error:', error);
// });
// Client-side JavaScript
// fetch('/sendEmail', {
//   method: 'POST',
//   headers: {
//       'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(formData),
// })
// .then(response => response.json())
// .then(data => {
//   // Show notification on main page
//   alert(data.message);
// })
// .catch((error) => {
//   console.error('Error:', error);
// });
document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault();
  var formData = {};
  new FormData(event.target).forEach(function(value, key) {
      formData[key] = value;
  });
  // Show the overlay
document.getElementById('overlay').style.display = 'block';

fetch('/sendEmail', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
})
.then(response => {
    // Hide the overlay when the response is received
    document.getElementById('overlay').style.display = 'none';
    return response.json();
})
.then(data => {
   document.getElementById('overlay').style.display = 'none';
    alert(data.message);
    window.location.href = '/';
    event.target.reset();
})
.catch((error) => {
    // Hide the overlay in case of error
    document.getElementById('overlay').style.display = 'none';
    console.error('Error:', error);
});

});
// Custom MODAL Section
function openModal(imageSrc) {
  document.getElementById('myModal').style.display = "block";
  document.getElementById('modalImage').src = imageSrc;
}

function closeModal() {
  document.getElementById('myModal').style.display = "none";
  document.getElementById("onLoadModal").style.display = "none";
}
var modal = document.getElementById("onLoadModal");
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
// When the page loads, open the modal
window.onload = function() {
  var elem = document.querySelector('.h2')
  document.getElementById('fontColorPicker').value = rgbToHex(window.getComputedStyle(elem).getPropertyValue('color'));
  document.getElementById('bgColorPicker').value = rgbToHex(window.getComputedStyle(document.documentElement).getPropertyValue('--bg-gradient-jet'));
  document.getElementById('bdColorPicker').value = rgbToHex(window.getComputedStyle(document.documentElement).getPropertyValue('--jet'));
  document.getElementById('buttonColor').value = rgbToHex(window.getComputedStyle(document.getElementById('settingsButton')).getPropertyValue('background-color'));
  document.getElementById('fontColorPickerl').value = rgbToHex(window.getComputedStyle(elem).getPropertyValue('color'));
  document.getElementById('bgColorPickerl').value = rgbToHex(window.getComputedStyle(document.documentElement).getPropertyValue('--bg-gradient-jet'));
  document.getElementById('bdColorPickerl').value = rgbToHex(window.getComputedStyle(document.documentElement).getPropertyValue('--jet'));
  document.getElementById('buttonColorl').value = rgbToHex(window.getComputedStyle(document.getElementById('settingsButton')).getPropertyValue('background-color'));
  modal.style.display = "block";
}


fetch('/api/visit')
    .then(res => res.json())
    .then(data => {
      document.getElementById('visit-count').innerText = 'Visitors Count: ' + data.total;
    })
    .catch(err => {
      console.error('Error fetching visits:', err);
      document.getElementById('visit-count').innerText = 'Visitors Count: N/A';
    });