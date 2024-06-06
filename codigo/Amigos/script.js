document.getElementById('addFriendForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var friendId = document.getElementById('friendId').value;
    
    if (friendId) {
        // Editar amigo existente
        editFriend({ id: friendId, name: name, email: email });
    } else {
        // Adicionar novo amigo
        addFriend({ name: name, email: email });
    }
});

function addFriend(friend) {
    var friends = JSON.parse(localStorage.getItem('friends')) || [];
    friend.id = Date.now().toString(); // Atribui um ID único baseado no timestamp
    friends.push(friend);
    localStorage.setItem('friends', JSON.stringify(friends));
    addFriendToList(friend);
    clearForm();
}

function editFriend(friend) {
    var friends = JSON.parse(localStorage.getItem('friends')) || [];
    var index = friends.findIndex(function(item) {
        return item.id === friend.id;
    });
    if (index !== -1) {
        friends[index] = friend;
        localStorage.setItem('friends', JSON.stringify(friends));
        updateFriendInList(friend);
        clearForm();
    }
}

function deleteFriend(id) {
    var friends = JSON.parse(localStorage.getItem('friends')) || [];
    var index = friends.findIndex(function(item) {
        return item.id === id;
    });
    if (index !== -1) {
        friends.splice(index, 1);
        localStorage.setItem('friends', JSON.stringify(friends));
        removeFriendFromList(id);
    }
}

function addFriendToList(friend) {
    var friendItem = document.createElement('div');
    friendItem.classList.add('friend-item');
    friendItem.dataset.friendId = friend.id;
    friendItem.innerHTML = '<strong>' + friend.name + '</strong> (' + friend.email + ') <span class="edit">Editar</span> <span class="delete">Excluir</span>';
    friendItem.querySelector('.edit').addEventListener('click', function() {
        populateFormForEdit(friend);
    });
    friendItem.querySelector('.delete').addEventListener('click', function() {
        deleteFriend(friend.id);
    });
    document.getElementById('friendsList').appendChild(friendItem);
}

function updateFriendInList(friend) {
    var friendItem = document.querySelector('.friend-item[data-friend-id="' + friend.id + '"]');
    if (friendItem) {
        friendItem.innerHTML = '<strong>' + friend.name + '</strong> (' + friend.email + ') <span class="edit">Editar</span> <span class="delete">Excluir</span>';
        friendItem.querySelector('.edit').addEventListener('click', function() {
            populateFormForEdit(friend);
        });
        friendItem.querySelector('.delete').addEventListener('click', function() {
            deleteFriend(friend.id);
        });
    }
}

function removeFriendFromList(id) {
    var friendItem = document.querySelector('.friend-item[data-friend-id="' + id + '"]');
    if (friendItem) {
        friendItem.remove();
    }
}

function populateFormForEdit(friend) {
    document.getElementById('name').value = friend.name;
    document.getElementById('email').value = friend.email;
    document.getElementById('friendId').value = friend.id;
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('friendId').value = '';
}

// Carrega os amigos salvos localmente ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    var friends = JSON.parse(localStorage.getItem('friends')) || [];
    friends.forEach(function(friend) {
        addFriendToList(friend);
    });
});
