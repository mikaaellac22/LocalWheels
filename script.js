let page = 1;
let clicks = 0;
let inputs = 0;
let start = Date.now();
let selectedCar = "";
let selectedPrice = 0;
let totalPrice = 0;

document.addEventListener("click", function() {
  clicks = clicks + 1;
});

document.addEventListener("input", function() {
  inputs = inputs + 1;
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

function showPage1() {
  page = 1;
  let html = "<h1>Book Your Car</h1>";
  html = html + "<label>Pickup Location</label>";
  html = html + "<input type='text' id='pickup' placeholder='City'>";
  html = html + "<label>Pickup Date</label>";
  html = html + "<input type='date' id='pickDate'>";
  html = html + "<label>Return Location</label>";
  html = html + "<input type='text' id='return' placeholder='City'>";
  html = html + "<label>Return Date</label>";
  html = html + "<input type='date' id='retDate'>";
  html = html + "<button onclick='showPage2()'>Search</button>";
  document.getElementById("app").innerHTML = html;
}

function showPage2() {
  page = 2;
  let html = "<h1>Select a Car</h1>";
  
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
  totalPrice = price;
  showPage3();
}

function showPage3() {
  page = 3;
  let html = "<h1>Add Extras</h1>";
  html = html + "<p>Car: " + selectedCar + "</p>";
  html = html + "<p>Price: $" + totalPrice + "/day</p>";
  
  for (let i = 0; i < extras.length; i = i + 1) {
    let e = extras[i];
    html = html + "<input type='checkbox' id='extra" + i + "' onchange='updatePrice()'>";
    html = html + "<label for='extra" + i + "'>" + e.name + " +$" + e.price + "</label><br>";
  }
  
  html = html + "<button onclick='showPage4()'>Continue</button>";
  html = html + "<button onclick='showPage2()'>Back</button>";
  document.getElementById("app").innerHTML = html;
}

function updatePrice() {
  totalPrice = selectedPrice;
  
  for (let i = 0; i < extras.length; i = i + 1) {
    let checked = document.getElementById("extra" + i).checked;
    if (checked === true) {
      totalPrice = totalPrice + extras[i].price;
    }
  }
}

function showPage4() {
  page = 4;
  let html = "<h1>Verify</h1>";
  html = html + "<label>Full Name</label>";
  html = html + "<input type='text' id='name'>";
  html = html + "<label>Date of Birth</label>";
  html = html + "<input type='date' id='dob'>";
  html = html + "<label>License Number</label>";
  html = html + "<input type='text' id='license'>";
  html = html + "<label>Upload License Photo</label>";
  html = html + "<input type='file' id='photo'>";
  html = html + "<button onclick='showPage5()'>Confirm</button>";
  html = html + "<button onclick='showPage3()'>Back</button>";
  document.getElementById("app").innerHTML = html;
}

function showPage5() {
  let name = document.getElementById("name").value;
  let dob = document.getElementById("dob").value;
  let license = document.getElementById("license").value;
  let photo = document.getElementById("photo").value;
  
  if (name === "" || dob === "" || license === "" || photo === "") {
    alert("Fill all fields!");
    return;
  }
  
  let year = parseInt(dob.substring(0, 4));
  let age = 2025 - year;
  
  if (age < 21) {
    alert("Must be 21 or older!");
    return;
  }
  
  page = 5;
  let time = ((Date.now() - start) / 1000).toFixed(2);
  
  let html = "<h1>Booking Confirmed!</h1>";
  html = html + "<p>Car: " + selectedCar + "</p>";
  html = html + "<p>Daily Cost: $" + totalPrice + "</p>";
  html = html + "<hr>";
  html = html + "<h2>Host Information</h2>";
  html = html + "<p>Name: Marco Rossi</p>";
  html = html + "<p>Rating: 5 stars</p>";
  html = html + "<p>Phone: +39 555-1234</p>";
  html = html + "<p>Meeting: Parking Bay 5</p>";
  html = html + "<hr>";
  html = html + "<h2>Fuel Stations Near Return</h2>";
  html = html + "<p>Shell - 2.3 km</p>";
  html = html + "<p>Esso - 3.1 km</p>";
  html = html + "<hr>";
  html = html + "<h2>Metrics</h2>";
  html = html + "<p>Time: " + time + " seconds</p>";
  html = html + "<p>Clicks: " + clicks + "</p>";
  html = html + "<p>Inputs: " + inputs + "</p>";
  html = html + "<button onclick='location.reload()'>New Booking</button>";
  
  document.getElementById("app").innerHTML = html;
}

showPage1();