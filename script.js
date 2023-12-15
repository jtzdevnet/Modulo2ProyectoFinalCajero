// Como regla de negocio, una cuenta no debe de tener más de $990 y menos de $10. Es necesario hacer las validaciones pertinentes para que no se rompa esta regla de negocio.

var hayTarjetaAdentro = false;

var currentCuenta = [];

var cuentas1 = {
	"cuenta1": {
		id: 'cuenta1',
		nombre: 'Mali',
		apellido: 'Martinez Torres',
		numero_tarjeta: '5226 8966 6652 2587',
		pin: '5197',
		saldo: 200
	},
	"cuenta2": {
		id: 'cuenta2',
		nombre: 'Gera',
		apellido: 'Sanchez Ortega',
		numero_tarjeta: '4558 8823 3469 9752',
		pin: '3156',
		saldo: 290
	},
	"cuenta3": {
		id: 'cuenta3',
		nombre: 'Maui',
		apellido: 'Jimenez Perez',
		numero_tarjeta: '1954 3456 7136 3649',
		pin: '2590',
		saldo: 67
	}
};


// Crear botones graficos para las tarjetas de cada usuario
for (let id in cuentas1) {
	let nuevaTarjeta = document.createElement("div");
	nuevaTarjeta.innerHTML = '<div class="credit-card" title="PIN: '+cuentas1[id].pin+'" id="'+cuentas1[id].id+'"><span class="credit-card-number">'+cuentas1[id].numero_tarjeta+'</span><span class="credit-card-name">'+cuentas1[id].nombre+" "+cuentas1[id].apellido+'</span></div>';
	document.getElementById("credit-card-container").innerHTML += nuevaTarjeta.innerHTML;
}


// Crear listeners para cada tarjeta y mostrar pantalla de password al elegir una
document.querySelectorAll(".credit-card").forEach(creditcard => {
	creditcard.addEventListener("click", function(e){
		console.log(this);
		e.currentTarget.classList.add("active");
		hayTarjetaAdentro = true;
		currentCuenta = cuentas1[document.querySelector(".credit-card.active").id];
		document.querySelectorAll(".credit-card").forEach(element => {
			if ( !((element).className.indexOf("active") != -1 )){
				element.classList.add("inactive");
			}
		});
		setTimeout(() => {
			clearScreens();
			showScreen("screen-password");
		}, "800");
	});
});


// Listener para los botones de numeros del cajero
document.querySelectorAll(".numbers li").forEach(numberButton => {
	numberButton.addEventListener("click", function(e){
		if (document.querySelector(".screen.active input") != null){
			// Checar si el usuario esta presinando botones en el password
			if (document.querySelector(".screen.active input").id == "password-input"){
				if(document.querySelector(".screen.active input").value.length < 4){
					document.querySelector(".screen.active input").value = document.querySelector(".screen.active input").value + this.innerText;
					document.querySelector(".screen.active input").dispatchEvent(new Event('change'));
				}
			}
			else{
				document.querySelector(".screen.active input").value = document.querySelector(".screen.active input").value + this.innerText;
				document.querySelector(".screen.active input").dispatchEvent(new Event('change'));
			}
		}
	});
});

// Listener para el boton de borrar caracteres
document.getElementById("button-erase").addEventListener("click", function(e){
	if (document.querySelector(".screen.active input") != null){
		document.querySelector(".screen.active input").value = document.querySelector(".screen.active input").value.slice(0,-1);
		document.querySelector(".screen.active input").dispatchEvent(new Event('change'));
	}
});

// Listener para el boton de confirmar
document.getElementById("button-confirm").addEventListener("click", function(e){
	if (document.querySelector(".screen.active input") != null){
		// Checar la pantalla en la que esta el usuario
		switch (document.querySelector(".screen.active").id) {
			case "screen-deposit":
				var userMoneyInput = parseInt(document.querySelector(".screen.active input").value);
				if( currentCuenta.saldo + userMoneyInput <= 990 ){
					document.querySelectorAll(".balance-warning")[0].classList.add("inactive");
					currentCuenta.saldo = currentCuenta.saldo + userMoneyInput;
					cuentas1[currentCuenta.id] = currentCuenta;
					document.querySelectorAll(".new-balance")[0].classList.remove("inactive");
					document.querySelectorAll(".new-balance--output")[0].innerHTML = "$"+cuentas1[currentCuenta.id].saldo;
					document.querySelector(".screen.active input").value = "";
				}
				else{
					document.querySelectorAll(".balance-warning")[0].classList.remove("inactive");
					document.querySelectorAll(".new-balance")[0].classList.add("inactive");
				}
				break;
			case "screen-withdraw":
				var userMoneyInput = parseInt(document.querySelector(".screen.active input").value);
				if( currentCuenta.saldo - userMoneyInput >= 10 ){
					document.querySelectorAll(".balance-warning")[1].classList.add("inactive");
					currentCuenta.saldo = currentCuenta.saldo - userMoneyInput;
					cuentas1[currentCuenta.id] = currentCuenta;
					document.querySelectorAll(".new-balance")[1].classList.remove("inactive");
					document.querySelectorAll(".new-balance--output")[1].innerHTML = "$"+cuentas1[currentCuenta.id].saldo;
					document.querySelector(".screen.active input").value = "";
				}
				else{
					document.querySelectorAll(".balance-warning")[1].classList.remove("inactive");
					document.querySelectorAll(".new-balance")[1].classList.add("inactive");
				}
				break;
			default:
				break;
		}
	}
});


// Listener para checar si la contraseña es valida
document.getElementById("password-input").addEventListener("change",function(e){
	if(this.value.length == 4){
		console.log("checar contraseña");
		if (this.value == currentCuenta.pin){
			hideScreen("screen-password");
			showScreen("screen-operation");
		}
		else{
			document.querySelector(".password-error").classList.add("active");
		}
	}
});


// Listener para el boton de checar saldo
document.querySelector(".operation-check").addEventListener("click", function(e){
	e.preventDefault();
	console.log("check balance");
	clearScreens();
	showScreen("screen-balance");
	document.querySelector("#screen-balance h5").innerHTML = "$"+currentCuenta.saldo+".00";
});



// Listener para el boton de depositar dinero en la cuenta
document.querySelector(".operation-deposit").addEventListener("click", function(e){
	e.preventDefault();
	clearScreens();
	showScreen("screen-deposit");
	console.log("deposit in account");
});

document.querySelector(".operation-withdraw").addEventListener("click", function(e){
	e.preventDefault();
	clearScreens();
	showScreen("screen-withdraw");
	console.log("withdraw money");
});

document.querySelectorAll(".operation-return").forEach(button => {
	button.addEventListener("click", function(e){
		console.log("back");
		e.preventDefault();
		if (document.querySelector(".screen.active").id == "screen-balance" ||document.querySelector(".screen.active").id == "screen-deposit" || document.querySelector(".screen.active").id == "screen-withdraw" ){
			clearScreens();
			showScreen("screen-operation");
			document.querySelectorAll(".new-balance").forEach(element => {
				element.classList.add("inactive");
			});
			document.querySelector("#screen-deposit .new-balance--output").innerHTML = "";
			document.querySelector("#screen-deposit .balance-warning").classList.add("inactive");
			document.querySelector("#screen-withdraw .new-balance--output").innerHTML = "";
			document.querySelector("#screen-withdraw .balance-warning").classList.add("inactive");
		}
	});
});


// Listener para boton de Salir en pantalla, restaura todos los valores como al inicio
document.querySelector(".operation-exit").addEventListener("click", function(e){
	e.preventDefault();
	if(hayTarjetaAdentro){
		ExitAndClear();
	}
});

// Listener para boton de Salir en keypad, restaura todos los valores como al inicio
document.querySelector("#button-cancel").addEventListener("click", function(e){
	e.preventDefault();
	if(hayTarjetaAdentro){
		ExitAndClear();
	}
});

document.querySelector("#button-back").addEventListener("click", function(e){
	console.log("back");
	e.preventDefault();
	if (document.querySelector(".screen.active").id == "screen-balance" ||document.querySelector(".screen.active").id == "screen-deposit" || document.querySelector(".screen.active").id == "screen-withdraw" ){
		clearScreens();
		showScreen("screen-operation");
		document.querySelectorAll(".new-balance").forEach(element => {
			element.classList.add("inactive");
		});
		document.querySelector("#screen-deposit .new-balance--output").innerHTML = "";
		document.querySelector("#screen-deposit .balance-warning").classList.add("inactive");
		document.querySelector("#screen-withdraw .new-balance--output").innerHTML = "";
		document.querySelector("#screen-withdraw .balance-warning").classList.add("inactive");
	}
});

// document.getElementById("password-input").addEventListener("keypress",function(e){
//     //console.log(e.key)
//     console.log(/[0-9]/i.test(e.key));
//     return /[0-9]/i.test(e.key);
// });

function clearScreens(){
	document.querySelectorAll(".screen").forEach(screen => {
		if ( (screen).className.indexOf(" active") != -1 ){
			screen.classList.add("inactive");
			screen.classList.remove("active");
		}
	});
}

function showScreen(id_screen) {
	document.getElementById(id_screen).classList.remove("inactive");
	document.getElementById(id_screen).classList.add("active");
}

function hideScreen(id_screen){
	document.getElementById(id_screen).classList.add("inactive");
	document.getElementById(id_screen).classList.remove("active");
}

function isNumber(event) {
	return /[0-9]/i.test(event.key);
}

function ExitAndClear() {
	console.log("exit");
	hayTarjetaAdentro = false;
	currentCuenta = [];
	document.querySelector(".credit-card.active").classList.remove("active");
	document.querySelectorAll(".credit-card.inactive").forEach(credit_card => {
		credit_card.classList.remove("inactive");
	});
	document.querySelectorAll(".new-balance").forEach(element => {
		element.classList.add("inactive");
	});
	clearScreens();
	document.querySelector("#screen-balance h5").innerHTML = "";
	document.querySelector("#screen-deposit .new-balance--output").innerHTML = "";
	document.querySelector("#screen-deposit .balance-warning").classList.add("inactive");
	document.querySelector("#screen-withdraw .new-balance--output").innerHTML = "";
	document.querySelector("#screen-withdraw .balance-warning").classList.add("inactive");
	document.querySelector(".password-error").classList.remove("active");
	document.getElementById("password-input").value = "";
	document.getElementById("money-input").value = "";
	document.getElementById("money-withdraw").value = "";
	showScreen("screen-welcome");
}

