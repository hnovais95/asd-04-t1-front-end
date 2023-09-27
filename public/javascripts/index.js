// Componentes

const pagina = document.getElementById("home-wrapper");
const formulario = document.getElementById("formulario");
const loginInput = document.getElementById("login");
const senhaInput = document.getElementById("senha");

// Funções

document.addEventListener("DOMContentLoaded", function (event) {
	event.preventDefault();

	const localStorageItem = localStorage.getItem(LOCALSTORAGE_KEY_LOGIN);
	const parsedData = JSON.parse(localStorageItem);

	if (parsedData) {
		const { token } = parsedData;
		if (!!token)
			window.location.href = "produtos.html";
	}
});

formulario.addEventListener("submit", function (event) {
	event.preventDefault();

	login();
});

function login() {
	fetch(`${URL_API_LINK}/api/seg/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			login: loginInput.value,
			senha: senhaInput.value,
		}),
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error(`Erro de rede - ${response.status}`);
			}
			return response.json();
		})
		.then((data) => {
			localStorage.setItem(LOCALSTORAGE_KEY_LOGIN, JSON.stringify(data));
			window.location.href = "produtos.html";
		})
		.catch((error) => {
			console.log(error);
			swal("Oops!", "Usuário ou senha inválidos.", "error");
		});
}
