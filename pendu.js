"use strict";

const motEl = document.querySelector(".mot");
const mauvaiseLettresEl = document.querySelector(".lettresFausses");
const rejouerBtn = document.querySelector(".play-button");
const popup = document.querySelector(".conteneur-popUp");
const notif = document.querySelector(".notif");
const messageFinal = document.querySelector(".messageFinal");
const penduParts = document.querySelectorAll(".pendu-parts");
const difficulty = document.querySelector(".difficulty");
const displayTheme = document.querySelector(".displayTheme");

let motChoisi = "";
let theme = " ";
const trys = 6;
choisirMot();
// Fonction pour choisir un mot aléatoire
function choisirMot() {
	fetch("theme.json")
		.then((response) => response.json())
		.then((data) => {
			const themes = data;
			if (themes.length === 0) return console.error("Aucun thème trouvé !");

			const randomTheme = themes[Math.floor(Math.random() * themes.length)];
			const randomLetters =
				randomTheme.Listes[
					Math.floor(Math.random() * randomTheme.Listes.length)
				];

			if (randomLetters.Lettre == " ") {
				choisirMot(); // Si le mot est vide, on recommence
				return;
			}

			const words =
				randomLetters.Mots[
					Math.floor(Math.random() * randomLetters.Mots.length)
				];

			if (!words || words.length === 0)
				return console.error(`Aucun mot dans le tirage`);
			if (/^[a-zA-Z]+$/.test(words)) {
				motChoisi = words.toLowerCase();
				theme = randomTheme;
				afficherMot();
				console.log(
					`Thème: ${randomTheme.Thème_}, Lettre: ${randomLetters.Lettre}, Mot: ${motChoisi}`
				);
			} else {
				console.error("Le mot n'est pas valide");
				choisirMot();
				return;
			}
		})
		.catch((error) => console.error("Erreur chargement JSON :", error));
}

const bonnesLettresArr = [``];
const mauvaiseLettresArr = [];

// Afficher le mot caché et le thème si ls difficulté est bonne
function afficherMot() {
	motEl.innerHTML = `
	${motChoisi
		.split("")
		.map((lettre) => {
			// if (/^[a-z]$/.test(key))
			return `
				<span class="lettres">${bonnesLettresArr.includes(lettre) ? lettre : ""}</span>
			`;
		})
		.join("")}`;

	if (difficulty.value === "easy") {
		displayTheme.innerHTML = `${theme.Thème_}`;
	} else {
		displayTheme.innerHTML = `Indisponible en difficile`;
	}

	const motInterne = motEl.innerText.replace(/\n/g, "");
	if (motInterne === motChoisi) {
		messageFinal.innerHTML = `Bravo, c'est trouvé! Le mot était bien <a href="https://www.google.com/search?q=${motChoisi}" target="_blank">${motChoisi}</a>`;
		popup.style.display = "flex";
	}
}

// Mauvaises lettres

function updateMauvaiseLettresEl() {
	// afficher les mauvaises lettres a l'écran
	mauvaiseLettresEl.innerHTML = `
	${mauvaiseLettresArr.map((lettre) => `<span>${lettre}</span>`)}`;

	// afficher un élément du bonhomme pendu
	penduParts.forEach((parts, index) => {
		const erreurs = mauvaiseLettresArr.length;
		if (index < erreurs) {
			parts.style.display = "block";
		} else {
			parts.style.display = "none";
		}
	});
	// vérifier si on a perdu
	if (mauvaiseLettresArr.length === penduParts.length) {
		messageFinal.innerHTML = `Malheureusement, c'est perdu. Le mot était <a href="https://www.google.com/search?q=${motChoisi}" target="_blank">${motChoisi}</a>`;
		popup.style.display = "flex";
	}
}
// afficher la notification

function afficherNotif() {
	notif.classList.add("afficher");
	setTimeout(() => {
		notif.classList.remove("afficher");
	}, 2000);
}

//Events listeners
window.addEventListener("keydown", (e) => {
	let key = e.key;
	if (/^[a-z]$/.test(key)) {
		const lettre = e.key;
		if (motChoisi.includes(lettre)) {
			if (!bonnesLettresArr.includes(lettre)) {
				bonnesLettresArr.push(lettre);
				afficherMot();
			} else {
				afficherNotif();
			}
		} else {
			if (!mauvaiseLettresArr.includes(lettre)) {
				mauvaiseLettresArr.push(lettre);
				updateMauvaiseLettresEl();
			} else {
				afficherNotif();
			}
		}
	}
});

// rejouer et redémarrer

rejouerBtn.addEventListener("click", () => {
	// vider les arrays
	bonnesLettresArr.splice(0);
	mauvaiseLettresArr.splice(0);
	choisirMot();
	updateMauvaiseLettresEl();
	popup.style.display = "none";
});
