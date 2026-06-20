let page = 1;
let clicks = 0;
let start = Date.now();
let selectedCar = "";
let selectedPrice = 0;
let totalPrice = 0;
let rentalDays = 0;

let pickupLocation = "";
let returnLocation = "";
let pickupDateValue = "";
let returnDateValue = "";

let selectedExtras = [false, false, false];

let fullName = "";
let dateOfBirth = "";
let licenseNumber = "";
let licensePhoto = null;

document.addEventListener("click", function() {
  clicks = clicks + 1;
});

let cars = [
  { name: "Fiat 500", price: 45, img: "fiat.jpg" },
  { name: "Tesla", price: 120, img: "tesla.jpg" },
  { name: "Toyota", price: 65, img: "toyota.jpg" },
  { name: "Mercedes", price: 100, img: "mercedes.jpg" }
];

let extras = [
  { name: "Insurance", price: 20 },
  { name: "GPS", price: 10 },
  { name: "Cleaning", price: 15 }
];

function topControls(step, stepName) {
  let progress = step * 20;

  let html = "";

  html = html + "<div class='top-controls'>";
  html = html + "<select>";
  html = html + "<option>English</option>";
  html = html + "<option>Dutch</option>";
  html = html + "<option>Greek</option>";
  html = html + "</select>";

  html = html + "<button class='small-btn emergency' onclick='alert(\"Emergency options:\\nCall Host\\nRoadside Assistance\\nLocal Emergency: 112\")'>Emergency</button>";
  html = html + "</div>";

  html = html + "<p class='step-text'>Step " + step + " of 5: " + stepName + "</p>";
  html = html + "<div class='progress-bar'>";
  html = html + "<div class='progress-fill' style='width:" + progress + "%'></div>";
  html = html + "</div>";

  return html;
}

function showPage1() {
  page = 1;
  let html = topControls(1, "Search Details");
  html = html + "<h1>Book Your Car</h1>";
  html = html + "<label>Pickup Location</label>";
  html = html + "<input type='text' id='pickup' placeholder='City'>";
  html = html + "<label>Pickup Date</label>";
  html = html + "<input type='date' id='pickDate'>";
  html = html + "<label>Return Location</label>";
  html = html + "<input type='text' id='return' placeholder='City'>";
  html = html + "<label>Return Date</label>";
  html = html + "<input type='date' id='retDate'>";
  html = html + "<p id='dateError' class='form-error' role='alert'></p>";
  html = html + "<button onclick='searchCars()'>Search</button>";
  document.getElementById("app").innerHTML = html;
  document.getElementById("pickup").value = pickupLocation;
  document.getElementById("return").value = returnLocation;
  document.getElementById("pickDate").value = pickupDateValue;
  document.getElementById("retDate").value = returnDateValue;
}

function searchCars() {
  let errorMessage = document.getElementById("dateError");

  pickupLocation = document.getElementById("pickup").value.trim();
  returnLocation = document.getElementById("return").value.trim();
  pickupDateValue = document.getElementById("pickDate").value;
  returnDateValue = document.getElementById("retDate").value;

  errorMessage.textContent = "";

  if (pickupDateValue === "" || returnDateValue === "") {
    errorMessage.textContent = "Please select both a pickup date and a return date.";
    return;
  }

  let pickupDate = new Date(pickupDateValue + "T00:00:00");
  let returnDate = new Date(returnDateValue + "T00:00:00");

  if (returnDate <= pickupDate) {
    errorMessage.textContent = "The return date must be after the pickup date.";
    return;
  }

  let difference = returnDate - pickupDate;

  rentalDays = Math.round(difference / (1000 * 60 * 60 * 24));

  showPage2();
}

function showPage2() {
  page = 2;
  let html = topControls(2, "Select a Car");
  html = html + "<h1>Select a Car</h1>";
  
  for (let i = 0; i < cars.length; i = i + 1) {
    let c = cars[i];
    html = html + "<div class='car'>";
    html = html + "<img src='" + c.img + "'>";
    html = html + "<h3>" + c.name + "</h3>";
    html = html + "<p class='price'>$" + c.price + "/day</p>";
    html = html + "<button onclick='selectCar(\"" + c.name + "\", " + c.price + ")'>Select</button>";
    html = html + "</div>";
  }
  
  html = html + "<button onclick='showPage1()'>Back</button>";
  document.getElementById("app").innerHTML = html;
}

function selectCar(name, price) {
  selectedCar = name;
  selectedPrice = price;
  totalPrice = price * rentalDays;
  showPage3();
}

function showPage3() {
  page = 3;
  let html = topControls(3, "Add Extras");
  html = html + "<h1>Add Extras</h1>";
  html = html + "<p>Car: " + selectedCar + "</p>";
  html += "<p>Rental period: " + rentalDays + " days</p>";
  html += "<p>Car price: $" + selectedPrice + " /day</p>";
  html += "<p>Total before extras: $" + totalPrice + "</p>";
  
  for (let i = 0; i < extras.length; i = i + 1) {
    let e = extras[i];
    let checked = "";
    if (selectedExtras[i] === true) {
      checked = " checked";
    }
    html = html + "<input type='checkbox' id='extra" + i + "' onchange='updatePrice()'" + checked + ">";
    html = html + "<label for='extra" + i + "'>" + e.name + " +$" + e.price + "</label><br>";
  }
  
  html = html + "<button onclick='showPage4()'>Continue</button>";
  html = html + "<button onclick='showPage2()'>Back</button>";
  document.getElementById("app").innerHTML = html;
}

function updatePrice() {
  totalPrice = selectedPrice * rentalDays;
  
  for (let i = 0; i < extras.length; i = i + 1) {
    let checkbox = document.getElementById("extra" + i);
    selectedExtras[i] = checkbox.checked;
    if (selectedExtras[i] === true) {
      totalPrice = totalPrice + (extras[i].price * rentalDays);
    }
  }
}

function showPage4() {
  page = 4;
  let html = topControls(4, "Verification");
  html = html + "<h1>Verify</h1>";
  html = html + "<label>Full Name</label>";
  html = html + "<input type='text' id='name'>";
  html = html + "<label>Date of Birth</label>";
  html = html + "<input type='date' id='dob'>";
  html = html + "<label>License Number</label>";
  html = html + "<input type='text' id='license'>";
  html = html + "<label>Upload License Photo</label>";
  html = html + "<input type='file' id='photo' onchange='saveLicensePhoto()'>";
  html = html + "<p id='photoStatus'></p>";
  html = html + "<p id='verificationError' class='form-error'></p>";
  html = html + "<button onclick='showPage5()'>Confirm</button>";
  html = html + "<button onclick='showPage3()'>Back</button>";
  document.getElementById("app").innerHTML = html;

  document.getElementById("name").value = fullName;
  document.getElementById("dob").value = dateOfBirth;
  document.getElementById("license").value = licenseNumber;

  if (licensePhoto !== null) {
    document.getElementById("photoStatus").textContent =
      "Selected file: " + licensePhoto.name;
  }
}

function saveVerificationDetails() {
  fullName = document.getElementById("name").value.trim();
  dateOfBirth = document.getElementById("dob").value;
  licenseNumber = document.getElementById("license").value.trim();

  let photoInput = document.getElementById("photo");

  if (photoInput.files.length > 0) {
    licensePhoto = photoInput.files[0];
  }
}

function saveLicensePhoto() {
  let photoInput = document.getElementById("photo");

  if (photoInput.files.length > 0) {
    licensePhoto = photoInput.files[0];

    document.getElementById("photoStatus").textContent = "Selected file: " + licensePhoto.name;
  }
}

function showPage5() {
  saveVerificationDetails();

  let errorMessage = document.getElementById("verificationError");

  errorMessage.textContent = "";

  if (fullName === "" ||dateOfBirth === "" ||licenseNumber === "" ||licensePhoto === null) {
    errorMessage.textContent = "Please complete all verification fields.";
    return;
  }

  let year = parseInt(dateOfBirth.substring(0, 4));
  let age = new Date().getFullYear() - year;

  if (age < 18) {
    errorMessage.textContent = "You must be at least 18 years old to make a booking!";
    return;
  }
  
  page = 5;
  let time = ((Date.now() - start) / 1000).toFixed(2);
  
  let html = topControls(5, "Confirmation");
  html = html + "<h1>Booking Confirmed!</h1>";
  html = html + "<p>Car: " + selectedCar + "</p>";
  html += "<p>Rental period: " + rentalDays + " days</p>";
  html += "<p>Total cost: $" + totalPrice + "</p>";
  html = html + "<hr>";
  html = html + "<h2>Host Information</h2>";
  html = html + "<p>Name: Marco Rossi</p>";
  html = html + "<p>Rating: 5 stars</p>";
  html = html + "<p>Phone: +39 555-1234</p>";
  html = html + "<p>Meeting: Parking Bay 5</p>";
  html = html + "<button onclick='alert(\"Host: Marco Rossi\\nMessage: Your booking is confirmed. I will meet you at Parking Bay 5 on the reservation start date.\")'>Open Host Chat</button>";
  html = html + "<hr>";
  html = html + "<h2>Fuel Stations Near Return</h2>";
  html = html + "<p>Shell - 2.3 km</p>";
  html = html + "<p>Esso - 3.1 km</p>";
  html = html + "<hr>";
  html = html + "<h2>Study Metrics</h2>";
  html = html + "<p><strong>Total Time:</strong> " + time + " seconds</p>";
  html = html + "<p><strong>Total Clicks:</strong> " + clicks + "</p>";
  html = html + "<hr>";
  html = html + "<button onclick='location.reload()'>New Booking</button>";
  
  document.getElementById("app").innerHTML = html;
}

showPage1();
