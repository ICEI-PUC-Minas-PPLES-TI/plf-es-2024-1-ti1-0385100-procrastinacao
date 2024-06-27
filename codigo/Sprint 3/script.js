document.addEventListener('DOMContentLoaded', () => {
    // Função para obter dados do localStorage
    const getUserData = () => {
        const data = localStorage.getItem('userData');
        return data ? JSON.parse(data) : [];
    };

    // Função para salvar dados no localStorage
    const saveUserData = (data) => {
        localStorage.setItem('userData', JSON.stringify(data));
    };

    // Função para obter o modo escuro do localStorage
    const getDarkMode = () => {
        return localStorage.getItem('darkMode') === 'true';
    };

    // Função para salvar o modo escuro no localStorage
    const saveDarkMode = (isDarkMode) => {
        localStorage.setItem('darkMode', isDarkMode);
    };

    // Aplicar ou remover a classe dark-mode
    const applyDarkMode = (isDarkMode) => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    };

    let userData = getUserData();
    let isDarkMode = getDarkMode();
    applyDarkMode(isDarkMode);

    const ctx = document.getElementById('userProgressChart').getContext('2d');
    const userProgressChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: userData.map(user => user.nome),
            datasets: [{
                label: 'Progresso dos Usuários',
                data: userData.map(user => user.progresso),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false
        }
    });

    const updateUserList = () => {
        const userList = document.getElementById('userList');
        userList.innerHTML = '';
        userData.forEach((user, index) => {
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            userItem.innerHTML = `
                <span>${user.nome}: ${user.progresso}%</span>
                <button class="btn btn-danger btn-sm" data-index="${index}">Excluir</button>
            `;
            userList.appendChild(userItem);
        });
    };

    document.getElementById('addUserButton').addEventListener('click', () => {
        const userName = document.getElementById('userName').value;
        const userProgress = parseFloat(document.getElementById('userProgress').value);

        if (userName && !isNaN(userProgress)) {
            userData.push({ nome: userName, progresso: userProgress });
            userProgressChart.data.labels.push(userName);
            userProgressChart.data.datasets[0].data.push(userProgress);

            userProgressChart.update();
            updateUserList();
            saveUserData(userData);

            // Limpar os campos de entrada
            document.getElementById('userName').value = '';
            document.getElementById('userProgress').value = '';
        } else {
            alert('Por favor, insira um nome de usuário válido e um progresso numérico.');
        }
    });

    document.getElementById('userList').addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const index = e.target.getAttribute('data-index');
            userData.splice(index, 1);
            userProgressChart.data.labels.splice(index, 1);
            userProgressChart.data.datasets[0].data.splice(index, 1);

            userProgressChart.update();
            updateUserList();
            saveUserData(userData);
        }
    });

    document.querySelector('.btn-dark-mode').addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        applyDarkMode(isDarkMode);
        saveDarkMode(isDarkMode);
    });

    updateUserList();
});
