const userEmail = document.getElementById('email');
const userPassword = document.getElementById('password');
const form = document.getElementById("loginForm");
form.addEventListener('submit', saveUser);
function saveUser(e) {
e.preventDefault();
if (userEmail.value.trim() === "" || userPassword.value.trim() === "") {
    alert("Please fill in all fields.");
    return;
}


let obj = {
    email: userEmail.value.trim(),
    password: userPassword.value.trim()
};
axios.post("http://localhost:3000/user/login", obj)
    .then((result) => {
        console.log(result);
        if(result.status === 200){
            alert("login successfully");
            localStorage.setItem('token', result.data.token);
            window.location.href = './userexpense.htm'
            resetForm();
        }
    })
    .catch((err) => {
        console.log(err);
        if(err.status==400){
            alert("incorrect password");
            resetForm();
        }
        alert("email does not exist");
        // resetForm();
    });

}

function resetForm() {
    userEmail.value = "";
    userPassword.value = "";
}