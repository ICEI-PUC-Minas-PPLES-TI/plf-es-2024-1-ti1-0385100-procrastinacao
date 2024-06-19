document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const progressBar = document.querySelector('.progress_bar');
    const progressInner = document.querySelector('.progress_inner');
    
    checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', function() {
            updateProgressBar();
        });
    });

    function updateProgressBar() {
        const checkedCount = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
        let progress = 100 - (checkedCount * 20);
        let color, message;

        switch (checkedCount) {
            case 1:
                color = 'grey';
                message = "20% - Isso é só o começo!";
                break;
            case 2:
                color = 'lightgrey';
                message = "40% - Siga em frente!";
                break;
            case 3:
                color = 'yellow';
                message = "60% - Continue assim!";
                break;
            case 4:
                color = 'lightgreen';
                message = "80% - Você está quase lá! Só falta mais um pouco.";
                break;
            case 5:
                color = 'lightblue';
                message = "100% - Parabéns! Você conseguiu completar todas as tarefas!";
                break;
            default:
                progress = 100;
                color = 'transparent';
                message = '';
        }

        progressBar.style.paddingRight = progress + '%';
        progressInner.style.backgroundColor = color;
        progressInner.textContent = message;
    }
});
