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

let backNavigations = 0;
let validationErrors = 0;

let stepStartTime = Date.now();
let stepTimes = [0, 0, 0, 0];   // cumulative ms per step 1–4
let stepClicks = [0, 0, 0, 0];  // cumulative clicks per step 1–4

let fullName = "";
let dateOfBirth = "";
let licenseNumber = "";
let licensePhoto = null;

document.addEventListener("click", function() {
  clicks = clicks + 1;
  if (page >= 1 && page <= 4) {
    stepClicks[page - 1]++;
  }
});

let cars = [
  { name: "Fiat 500", price: 45, img: "fiat.jpg", category: "Economy" },
  { name: "Tesla", price: 120, img: "tesla.jpg", category: "Electric" },
  { name: "Toyota", price: 65, img: "toyota.jpg", category: "Family" },
  { name: "Mercedes", price: 100, img: "mercedes.jpg", category: "Premium" }
];

let extras = [
  { name: "Insurance", price: 20 },
  { name: "GPS", price: 10 },
  { name: "Cleaning", price: 15 }
];

function carBanner() {
  if (!selectedCar) return "";
  return "<div class='car-banner'>🚗 <strong>" + selectedCar + "</strong> &nbsp;·&nbsp; $" + selectedPrice + "/day &nbsp;·&nbsp; " + rentalDays + " day" + (rentalDays !== 1 ? "s" : "") + "</div>";
}

function showModal(title, content) {
  let modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.id = "modal";
  modal.innerHTML =
    "<div class='modal-box' onclick='event.stopPropagation()'>" +
    "<button class='modal-close' onclick='closeModal()'>✕</button>" +
    "<h2>" + title + "</h2>" + content + "</div>";
  modal.addEventListener("click", closeModal);
  document.body.appendChild(modal);
}

function closeModal() {
  let modal = document.getElementById("modal");
  if (modal) { modal.remove(); }
}

function showEmergency() {
  let content =
    "<p><strong>📞 Call Host</strong><br>+39 555-1234</p>" +
    "<p><strong>🚗 Roadside Assistance</strong><br>+39 800-277-748</p>" +
    "<p><strong>🚨 Local Emergency</strong><br>112</p>";
  showModal("Emergency Options", content);
}

function showHostChat() {
  let content =
    "<p><strong>Host:</strong> Marco Rossi &nbsp;⭐ 5.0</p>" +
    "<p>Your booking is confirmed. I will meet you at Parking Bay 5 on the reservation start date.</p>";
  showModal("Host Chat", content);
}

function softReset() {
  selectedCar = "";
  selectedPrice = 0;
  totalPrice = 0;
  rentalDays = 0;
  pickupLocation = "";
  returnLocation = "";
  pickupDateValue = "";
  returnDateValue = "";
  selectedExtras = [false, false, false];
  fullName = "";
  dateOfBirth = "";
  licenseNumber = "";
  licensePhoto = null;
  clicks = 0;
  backNavigations = 0;
  validationErrors = 0;
  stepTimes = [0, 0, 0, 0];
  stepClicks = [0, 0, 0, 0];
  start = Date.now();
  stepStartTime = Date.now();
  showPage1();
}

function updateReturnMin() {
  let pickDate = document.getElementById("pickDate").value;
  if (pickDate) {
    document.getElementById("retDate").min = pickDate;
  }
}

function goBackToPage1() { backNavigations++; showPage1(); }
function goBackToPage2() { backNavigations++; showPage2(); }
function goBackToPage3() { backNavigations++; showPage3(); }

function recordStepTime() {
  if (page >= 1 && page <= 4) {
    stepTimes[page - 1] += Date.now() - stepStartTime;
  }
  stepStartTime = Date.now();
}

function topControls(step, stepName) {
  let progress = step * 20;

  let html = "";

  html = html + "<div class='top-controls'>";
  html = html + "<select>";
  html = html + "<option>English</option>";
  html = html + "<option>Dutch</option>";
  html = html + "<option>Greek</option>";
  html = html + "</select>";

  html = html + "<button class='small-btn emergency' onclick='showEmergency()'>Emergency</button>";
  html = html + "</div>";

  html = html + "<p class='step-text'>Step " + step + " of 5: " + stepName + "</p>";
  html = html + "<div class='progress-bar'>";
  html = html + "<div class='progress-fill' style='width:" + progress + "%'></div>";
  html = html + "</div>";

  return html;
}

function showPage1() {
  recordStepTime();
  page = 1;
  let html = topControls(1, "Search Details");
  html = html + "<h1>Book Your Car</h1>";
  html = html + "<label>Pickup Location</label>";
  html = html + "<input type='text' id='pickup' placeholder='City'>";
  html = html + "<label>Pickup Date</label>";
  html = html + "<input type='date' id='pickDate' onchange='updateReturnMin()'>";
  html = html + "<label>Return Location</label>";
  html = html + "<input type='text' id='return' placeholder='City'>";
  html = html + "<div class='same-location-row'>";
  html = html + "<input type='checkbox' id='sameLocation' onchange='toggleSameLocation()'>";
  html = html + "<label for='sameLocation' class='checkbox-label'>Same as pickup location</label>";
  html = html + "</div>";
  html = html + "<label>Return Date</label>";
  html = html + "<input type='date' id='retDate'>";
  html = html + "<p id='dateError' class='form-error' role='alert'></p>";
  html = html + "<button onclick='searchCars()'>Search</button>";
  document.getElementById("app").innerHTML = html;
  let today = new Date().toISOString().split("T")[0];
  document.getElementById("pickDate").min = today;
  document.getElementById("retDate").min = pickupDateValue || today;
  document.getElementById("pickup").value = pickupLocation;
  document.getElementById("return").value = returnLocation;
  document.getElementById("pickDate").value = pickupDateValue;
  document.getElementById("retDate").value = returnDateValue;
}

function toggleSameLocation() {
  let checkbox = document.getElementById("sameLocation");
  let returnInput = document.getElementById("return");
  if (checkbox.checked) {
    returnInput.value = document.getElementById("pickup").value;
    returnInput.disabled = true;
  } else {
    returnInput.disabled = false;
    returnInput.value = "";
  }
}

function searchCars() {
  let errorMessage = document.getElementById("dateError");

  pickupLocation = document.getElementById("pickup").value.trim();
  returnLocation = document.getElementById("return").value.trim();
  pickupDateValue = document.getElementById("pickDate").value;
  returnDateValue = document.getElementById("retDate").value;

  errorMessage.textContent = "";

  if (pickupLocation === "" || returnLocation === "") {
    errorMessage.textContent = "Please enter both a pickup and return location.";
    validationErrors++;
    return;
  }

  if (pickupDateValue === "" || returnDateValue === "") {
    errorMessage.textContent = "Please select both a pickup date and a return date.";
    validationErrors++;
    return;
  }

  let pickupDate = new Date(pickupDateValue + "T00:00:00");
  let returnDate = new Date(returnDateValue + "T00:00:00");

  if (returnDate <= pickupDate) {
    errorMessage.textContent = "The return date must be after the pickup date.";
    validationErrors++;
    return;
  }

  let difference = returnDate - pickupDate;

  rentalDays = Math.round(difference / (1000 * 60 * 60 * 24));

  showPage2();
}

function showPage2() {
  recordStepTime();
  page = 2;
  let html = topControls(2, "Select a Car");
  html = html + "<h1>Select a Car</h1>";
  
  for (let i = 0; i < cars.length; i = i + 1) {
    let c = cars[i];
    html = html + "<div class='car'>";
    html = html + "<img src='" + c.img + "'>";
    html = html + "<span class='car-tag'>" + c.category + "</span>";
    html = html + "<h3>" + c.name + "</h3>";
    html = html + "<p class='price'>$" + c.price + "/day</p>";
    html = html + "<button onclick='selectCar(\"" + c.name + "\", " + c.price + ")'>Select</button>";
    html = html + "</div>";
  }
  
  html = html + "<button onclick='goBackToPage1()' class='secondary'>← Back</button>";
  document.getElementById("app").innerHTML = html;
}

function selectCar(name, price) {
  selectedCar = name;
  selectedPrice = price;
  totalPrice = price * rentalDays;
  showPage3();
}

function showPage3() {
  recordStepTime();
  page = 3;
  let html = topControls(3, "Add Extras");
  html = html + carBanner();
  html = html + "<h1>Add Extras</h1>";
  html = html + "<div class='summary-box'>";
  html += "<p><strong>Rental period:</strong> " + rentalDays + " day" + (rentalDays !== 1 ? "s" : "") + "</p>";
  html += "<p><strong>Car price:</strong> $" + selectedPrice + "/day</p>";
  html += "<p><strong>Current Total:</strong> <span id='liveTotal'>$" + totalPrice + "</span></p>";
  html = html + "</div>";
  
  for (let i = 0; i < extras.length; i = i + 1) {
    let e = extras[i];
    let checked = "";
    if (selectedExtras[i] === true) {
      checked = " checked";
    }
    html = html + "<div class='extra-item'>";
    html = html + "<input type='checkbox' id='extra" + i + "' onchange='updatePrice()'" + checked + ">";
    html = html + "<label for='extra" + i + "'>" + e.name + " <span class='extra-price'>+$" + e.price + "/day</span></label>";
    html = html + "</div>";
  }
  
  html = html + "<button onclick='showPage4()'>Next →</button>";
  html = html + "<button onclick='goBackToPage2()' class='secondary'>← Back</button>";
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

  let liveTotal = document.getElementById("liveTotal");
  if (liveTotal) {
    liveTotal.textContent = "$" + totalPrice;
  }
}

function showPage4() {
  recordStepTime();
  page = 4;
  let html = topControls(4, "Verification");
  html = html + carBanner();
  html = html + "<h1>Verification</h1>";
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
  html = html + "<button onclick='showPage5()'>Confirm Booking</button>";
  html = html + "<button onclick='goBackToPage3()' class='secondary'>← Back</button>";
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
    validationErrors++;
    return;
  }

  let dob = new Date(dateOfBirth);
  let today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  let monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  if (age < 18) {
    errorMessage.textContent = "You must be at least 18 years old to make a booking!";
    validationErrors++;
    return;
  }
  
  page = 5;
  recordStepTime();
  let time = ((Date.now() - start) / 1000).toFixed(2);
  
  let html = topControls(5, "Confirmation");
  html = html + "<h1>Booking Confirmed! 🎉</h1>";
  html = html + "<div class='summary-box'>";
  html = html + "<p><strong>Car:</strong> " + selectedCar + "</p>";
  html += "<p><strong>Rental period:</strong> " + rentalDays + " day" + (rentalDays !== 1 ? "s" : "") + "</p>";
  html += "<p><strong>Total cost:</strong> $" + totalPrice + "</p>";
  html = html + "</div>";
  html = html + "<hr>";
  html = html + "<h2>Host Information</h2>";
  html = html + "<p>Name: Marco Rossi</p>";
  html = html + "<p>Rating: 5 stars</p>";
  html = html + "<p>Phone: +39 555-1234</p>";
  html = html + "<p>Meeting: Parking Bay 5</p>";
  html = html + "<button onclick='showHostChat()'>Open Host Chat</button>";
  html = html + "<hr>";
  html = html + "<h2>Fuel Stations Near Return</h2>";
  html = html + "<p>Shell - 2.3 km</p>";
  html = html + "<p>Esso - 3.1 km</p>";
  html = html + "<hr>";
  let extrasChosen = extras.filter(function(e, i) { return selectedExtras[i]; }).map(function(e) { return e.name; });
  let stepNames = ["Search Details", "Select a Car", "Add Extras", "Verification"];
  let timePerClick = clicks > 0 ? (time / clicks).toFixed(2) : "—";

  html = html + "<h2>Study Metrics</h2>";
  html = html + "<div class='summary-box'>";
  html = html + "<p><strong>Total Time:</strong> " + time + " s &nbsp;|&nbsp; <strong>Total Clicks:</strong> " + clicks + " &nbsp;|&nbsp; <strong>Avg Time/Click:</strong> " + timePerClick + " s</p>";
  html = html + "</div>";

  html = html + "<table class='metrics-table'>";
  html = html + "<thead><tr><th>Step</th><th>Time (s)</th><th>Clicks</th><th>Time / Click</th></tr></thead><tbody>";
  for (let i = 0; i < 4; i++) {
    let sTime = (stepTimes[i] / 1000).toFixed(2);
    let sClicks = stepClicks[i];
    let sPerClick = sClicks > 0 ? (stepTimes[i] / 1000 / sClicks).toFixed(2) + " s" : "—";
    html = html + "<tr><td>" + stepNames[i] + "</td><td>" + sTime + "</td><td>" + sClicks + "</td><td>" + sPerClick + "</td></tr>";
  }
  html = html + "</tbody></table>";

  html = html + "<div class='summary-box' style='margin-top:14px'>";
  html = html + "<p><strong>Back Navigations:</strong> " + backNavigations + "</p>";
  html = html + "<p><strong>Validation Errors Hit:</strong> " + validationErrors + "</p>";
  html = html + "<p><strong>Extras Selected:</strong> " + (extrasChosen.length > 0 ? extrasChosen.join(", ") : "None") + "</p>";
  html = html + "</div>";
  html = html + "<hr>";
  html = html + "<button onclick='softReset()'>New Booking</button>";
  
  document.getElementById("app").innerHTML = html;
}

showPage1();
