document.addEventListener("DOMContentLoaded", () => {
	// Tabs

	const tabs = document.querySelectorAll(".tabheader__item"),
		tabsContent = document.querySelectorAll(".tabcontent"),
		tabsParent = document.querySelector(".tabheader__items");

	
	function hideTabContent() {
		tabsContent.forEach(item => {
			item.style.display = "none";
		});

		tabs.forEach(item => {
			item.classList.remove("tabheader__item_active");
		});
	}

	function showTabContent(i = 0) {
		tabsContent[i].style.display = "block";
		tabs[i].classList.add("tabheader__item_active");
	}


	hideTabContent();
	showTabContent();

	tabsParent.addEventListener("click", (event) => {
		const target = event.target;

		if (target && target.classList.contains("tabheader__item")) {
			tabs.forEach((item, i) => {
				if (target == item) {
					hideTabContent();
					showTabContent(i);
				}
			});
		}
	});


	// Timer

	const deadline = "2023-12-26";

	
	function getTimeRemaining(endtime) {
		const 
			t = Date.parse(endtime) - Date.parse(new Date()),
			days = Math.floor(t / (1000 * 60 * 60 * 24)),
			hours = Math.floor((t / 1000 *60 * 60) % 24),
			minutes = Math.floor((t / 1000 /60) % 60),
			seconds = Math.floor((t / 1000) % 60);

		return {
			"total": t,
			"days": days,
			"hours": hours,
			"minutes": minutes,
			"seconds": seconds
		};
	}

	function getZero (num) {
		if (num >= 0 && num < 10) {
			return `0${num}`;
		} else {
			return num;
		}
	}

	function setClock(selector, endtime) {
		const timer = document.querySelector(selector),
			days = timer.querySelector("#days"),
			hours = timer.querySelector("#hours"),
			minutes = timer.querySelector("#minutes"),
			seconds = timer.querySelector("#seconds"),
			timeInterval = setInterval(updateClock, 1000);

		updateClock();

		function updateClock() {
			const t = getTimeRemaining(endtime);

			days.innerHTML = getZero(t.days);
			hours.innerHTML = getZero(t.hours); 
			minutes.innerHTML = getZero(t.minutes);
			seconds.innerHTML = getZero(t.seconds);

			if (t.total <= 0) {
				clearInterval(timeInterval);
			}
		}

	}
	setClock(".timer", deadline);

	// Modal

	const 
		modalBtn = document.querySelectorAll("[data-modal]"),
		modal = document.querySelector(".modal");


	function openModal() {
		modal.classList.add("show");
		modal.classList.remove("hide");
		document.body.style.overflow = "hidden";
	}

	modalBtn.forEach((item) => {
		item.addEventListener("click", openModal);
	});

	function closeModal() {
		modal.classList.add("hide");
		modal.classList.remove("show");
		document.body.style.overflow = "";
	}

	modal.addEventListener("click", (e) => {
		if (e.target === modal || e.target.getAttribute("data-close") == "") {
			closeModal();
		}
	});
	document.addEventListener("keydown", (e) => {
		if (e.code === "Escape" && modal.classList.contains("show")) {
			closeModal();
		}
	});



	// Используем классы для карточек

	class MenuCard {
		constructor(src, alt, title, descr, price, parentSelector) {
			this.src = src;
			this.alt = alt;
			this.title = title;
			this.descr = descr;
			this.price = price;
			this.parent = document.querySelector(parentSelector);
			this.transfer = 40;
			this.changeToUAH();
		}

		changeToUAH() {
			this.price = this.price * this.transfer;
		}

		render() {
			const element = document.createElement("div");
			element.innerHTML = `
				<div class="menu__item">
					<img src=${this.src} alt=${this.alt}>
					<h3 class="menu__item-subtitle">${this.title}</h3>
					<div class="menu__item-descr">${this.descr}</div>
					<div class="menu__item-divider"></div>
					<div class="menu__item-price">
						<div class="menu__item-cost">Цена:</div>
						<div class="menu__item-total"><span>${this.price}</span> грн/день</div>
					</div>
				</div>
		`;
			this.parent.append(element);
		}
	}

	const getResource = async (url) => {
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Не возжможно обратится к ${url}, status: ${res.status}`);
		}

		return await  res.json();
	};
	getResource("http://localhost:3000/menu")
		.then(data => {
			data.forEach(({img, altimg, title, descr, price}) => {
				new MenuCard(img, altimg, title, descr, price, ".menu .container").render();
			});
		});
	
	// Forms


	const forms = document.querySelectorAll("form");

	const message = {
		loading: "img/spinner.svg",
		success: "Спасибо! Скоро мы с вами свяжемся",
		failure: "Что-то пошло не так..."
	};

	forms.forEach(item => {
		bindpostData(item);
	});

	const postData = async (url, data) => {
		const res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: data
		});

		return await  res.json();
	};

	function bindpostData(form) {
		form.addEventListener("submit", (e) => {
			e.preventDefault();

			const statusMessage = document.createElement("img");
			statusMessage.src = message.loading;
			statusMessage.style.cssText = `
			display: block;
			margin: 0 auto;
			`;
			form.insertAdjacentElement("afterend", statusMessage);

			const formData = new FormData(form);

			const json = JSON.stringify(Object.fromEntries(formData.entries()));

			

			
			postData("http://localhost:3000/requests", json)
				.then(data => {
					console.log(data);
					showThanksModal(message.success);
					statusMessage.remove();
				}).catch(() => {
					showThanksModal(message.failure);
				}).finally(() => {
					form.reset();
				});
		});
	}




	function showThanksModal(message) {
		const prevModalDialog = document.querySelector(".modal__dialog");

		prevModalDialog.classList.add("hide");
		openModal();

		const thanksModal = document.createElement("div");
		thanksModal.classList.add("modal__dialog");
		thanksModal.innerHTML = `
			<div class="modal__content">
				<div data-close class="modal__close">×</div>
				<div class="modal__title">${message}</div>
			</div>
		`;

		document.querySelector(".modal").append(thanksModal);
		setTimeout(() => {
			thanksModal.remove();
			prevModalDialog.classList.add("show");
			prevModalDialog.classList.remove("hide");
			closeModal();
		}, 4000);
	}

	fetch("http://localhost:3000/menu")
		.then(data => data.json())
		.then(res => console.log(res));



	// SLIDER


	const slides = document.querySelectorAll(".offer__slide"),
		prev = document.querySelector(".offer__slider-prev"),
		next = document.querySelector(".offer__slider-next"),
		total = document.querySelector("#total"),
		current = document.querySelector("#current");
	let slideIndex = 1;

	showSlides(slideIndex);

	if (slides.length < 10) {
		total.textContent = `0${slides.length}`;
	} else {
		total.textContent = slides.length;
	}

	function showSlides(n) {
		if (n > slides.length) {
			slideIndex = 1;
		}

		if (n < 1) {
			slideIndex = slides.length;
		}

		slides.forEach(item => item.style.display = "none");

		slides[slideIndex - 1].style.display = "block";

		if (slides.length < 10) {
			current.textContent = `0${slideIndex}`;
		} else {
			current.textContent = slideIndex;
		}
	}

	function plusSlides(n) {
		showSlides(slideIndex += n);
	}

	prev.addEventListener("click", () => {
		plusSlides(-1);
	});

	next.addEventListener("click", () => {
		plusSlides(1);
	});



	//Calc

	const result = document.querySelector(".calculating__result span");
	let sex = "woomen", height, weight, age, ratio;

	if (localStorage.getItem("sex")) {
		sex = localStorage.getItem("sex");
	} else {
		sex = "woomen";
		localStorage.getItem("sex", "woomen");
	}
	if (localStorage.getItem("ratio")) {
		ratio = localStorage.getItem("ratio");
	} else {
		ratio = 1.375;
		localStorage.getItem("ratio", 1.375);
	}

	function initLocalSeting(selector, activeClass) {
		const elements = document.querySelectorAll(selector);

		elements.forEach(elem => {
			elem.classList.remove(activeClass);
			if (elem.getAttribute("id") === localStorage.getItem("sex")) {
				elem.classList.add(activeClass);
			}
			if (elem.getAttribute("data-ratio") === localStorage.getItem("ratio")) {
				elem.classList.add(activeClass);
			}
		});
	}

	initLocalSeting("#gender div", "calculating__choose-item_active");
	initLocalSeting(".calculating__choose_big div", "calculating__choose-item_active");

	function calcTotal() {
		if (!sex || !height || !weight || !age || !ratio) {
			result.textContent = "NaN";
			return;
		}
		if (sex === "woomen") {
			result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
		} else {
			result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
		}
	}
	calcTotal();

	function getStaticInformation(selector, acticeClass) {
		const elements = document.querySelectorAll(selector);

		elements.forEach(elem => {
			elem.addEventListener("click", (e) => {
				if (e.target.getAttribute("data-ratio")) {
					ratio = +e.target.getAttribute("data-ratio");
					localStorage.setItem("ratio", +e.target.getAttribute("data-ratio"));
				} else {
					sex = e.target.getAttribute("id");
					localStorage.setItem("sex", e.target.getAttribute("id"))
				}
	
				elements.forEach(elem => {
					elem.classList.remove(acticeClass);
				});
	
				e.target.classList.add(acticeClass);
	
				calcTotal();
			});
		});

	}

	getStaticInformation("#gender div", "calculating__choose-item_active");
	getStaticInformation(".calculating__choose_big div", "calculating__choose-item_active");

	function getDinamicInformation(selector) {
		const input = document.querySelector(selector);

		input.addEventListener("input", () => {

			if (input.value.match(/\D/g)) {
				input.style.border = "1px solid red";
			} else {
				input.style.border = "none";
			}

			switch(input.getAttribute("id")) {
				case "height":
					height = +input.value;
					break;
				case "weight":
					weight = +input.value;
					break;
				case "age":
					age = +input.value;
					break;
			}
			calcTotal();
		});
	}

	getDinamicInformation("#height");
	getDinamicInformation("#weight");
	getDinamicInformation("#age");

});