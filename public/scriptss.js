function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "btn") {
    x.className += " slide";
  } else {
    x.className = "btn";
  }
}