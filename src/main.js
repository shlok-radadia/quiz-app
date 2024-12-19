setInterval(function() {
    console.log(`Website width: ${window.innerWidth}px`);
}, 1000);

function login() {
    window.open("../login/index.html", "_self");
}

function signup() {
    window.open("../signup/index.html", "_self");
}

// Expose functions to global scope
window.login = login;
window.signup = signup;