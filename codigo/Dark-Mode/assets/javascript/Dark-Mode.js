const btnDarkMode = document.querySelector(".btn-darkmode");
const darkMode = document.querySelector(".darkmode");

btnDarkMode.onclick = function(){
    this.classList.toggle("active");
    darkMode.classList.toggle("active");
};