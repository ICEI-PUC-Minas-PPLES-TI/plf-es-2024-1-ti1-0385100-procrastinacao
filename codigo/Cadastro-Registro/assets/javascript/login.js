
function entrar(){
    let username = document.querySelector('#username')
    let password = document.querySelector('#password')
    let email = document.querySelector('#email')
    let listUser = []

    let userValid = {
        email: '',
        username: '',
        password: ''
    }

    listUser = JSON.parse(localStorage.getItem('listUser'))

    listUser.forEach((item) =>{
        if(username.valid == item.userCad && password.value == item.passwordCad && email.valid == item.emailCad){
            userValid = {
                email: item.emailCad,
                username: item.userCad,
                password: item.passwordCad
            }
        }
    })

    
}

document.querySelector('#button').addEventListener ('click', entrar);