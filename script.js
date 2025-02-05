document.addEventListener("DOMContentLoaded", () => {
    const addLoginButton = document.getElementById("addLoginButton");
    const addLoginForm = document.getElementById("addLoginForm");
    const saveLoginButton = document.getElementById("saveLoginButton");
    const siteInput = document.getElementById("siteInput");
    const userInput = document.getElementById("userInput");
    const passwordInput = document.getElementById("passwordInput");
    const loginsTableBody = document.getElementById("loginsTableBody");
    const loginCount = document.getElementById("loginCount");
    const passwordGeneratorTab = document.getElementById("passwordGeneratorTab");
    const loginsSection = document.getElementById("loginsSection");
    const passwordGeneratorSection = document.getElementById("passwordGeneratorSection");
    const generatePasswordForLogin = document.getElementById("generatePasswordForLogin");

    passwordGeneratorTab.addEventListener("click", () => {
        loginsSection.classList.add("hidden");
        passwordGeneratorSection.classList.remove("hidden");
    });

    addLoginButton.addEventListener("click", () => {
        addLoginForm.classList.toggle("hidden");
    });

    const updateLoginsTable = () => {
        loginsTableBody.innerHTML = "";
        const logins = JSON.parse(localStorage.getItem("logins")) || [];

        logins.forEach((login, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${login.site}</td>
                <td>${login.user}</td>
                <td><span class="password">${login.password}</span></td>
                <td>
                    <button onclick="copyPassword('${login.password}')">Copiar</button>
                    <button onclick="deleteLogin(${index})">Excluir</button>
                </td>
            `;
            loginsTableBody.appendChild(row);
        });

        loginCount.textContent = logins.length;
    };

    saveLoginButton.addEventListener("click", () => {
        const site = siteInput.value;
        const user = userInput.value;
        const password = passwordInput.value;

        if (site && user && password) {
            const logins = JSON.parse(localStorage.getItem("logins")) || [];
            logins.push({ site, user, password });
            localStorage.setItem("logins", JSON.stringify(logins));

            siteInput.value = "";
            userInput.value = "";
            passwordInput.value = "";
            addLoginForm.classList.add("hidden");

            updateLoginsTable();
        } else {
            alert("preencha todos os campos.");
        }
    });

    window.copyPassword = (password) => {
        navigator.clipboard.writeText(password).then(() => {
            alert("Senha copiada");
        });
    };

    window.deleteLogin = (index) => {
        const logins = JSON.parse(localStorage.getItem("logins")) || [];
        logins.splice(index, 1);
        localStorage.setItem("logins", JSON.stringify(logins));
        updateLoginsTable();
    };

    const getCharTypes = () => {
        const uppercase = document.querySelector('#include_uppercase').checked;
        const lowercase = document.querySelector('#include_lowercase').checked;
        const number = document.querySelector('#include_number').checked;
        const specialCharacter = document.querySelector('#include_special_character').checked;

        const charTypes = [];

        if (uppercase) {
            charTypes.push('ABCDEFGHIJKLMNOPQRSTUVWXYZÇ');
        }

        if (lowercase) {
            charTypes.push('abcdefghijklmnopqrstuvwxyzç');
        }

        if (number) {
            charTypes.push('0123456789');
        }

        if (specialCharacter) {
            charTypes.push('*!@#$%&*^()_-^~<>:;,/|');
        }

        return charTypes;
    };

    const getPasswordSize = () => {
        const size = parseInt(document.querySelector('#size').value, 10);
        if (isNaN(size) || size < 4 || size > 128) {
            alert('Tamanho inválido. Escolha um valor entre 4 e 128.');
            return null; 
        }

        return size;
    };

    const randomCharType = (charTypes) => {
        const randomIndex = Math.floor(Math.random() * charTypes.length);
        const selectedType = charTypes[randomIndex];
        return selectedType[Math.floor(Math.random() * selectedType.length)];
    };

    const generatePassword = (size, charTypes) => {
        let password = '';

        while (password.length < size) {
            password += randomCharType(charTypes);
        }

        return password;
    };

    document.querySelector('#generate').addEventListener('click', function () {
        const size = getPasswordSize();
        if (size === null) return; 

        const charTypes = getCharTypes();
        if (charTypes.length === 0) {
            alert('Selecione ao menos um tipo de caractere.');
            return;
        }

        const passwordGenerated = generatePassword(size, charTypes);
        document.querySelector('#password').textContent = passwordGenerated;
    });

    generatePasswordForLogin.addEventListener("click", () => {
        const size = 12; 
        const charTypes = getCharTypes();

        if (charTypes.length === 0) {
            alert("selecione um tipo de caractere no Gerador de Senhas.");
            return;
        }

        const passwordGenerated = generatePassword(size, charTypes);
        passwordInput.value = passwordGenerated;
    });

    updateLoginsTable();
});