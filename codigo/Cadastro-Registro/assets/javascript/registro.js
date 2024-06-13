let email = document.querySelector('#email')
let username = document.querySelector('#username')
let password = document.querySelector('#password')


function cadastrar(){
    let listUser = JSON.parse(localStorage.getItem('listUser') || '[]')

    listUser.push({
        emailCad: email.value,
        userCad: username.value,
        passwordCad: password.value
    })
    
    localStorage.setItem('listUser', JSON.stringify(listUser))
}

document.querySelector('button').addEventListener ('click', cadastrar);