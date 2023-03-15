import tabs from "./moduls/tabs";
import modal from "./moduls/modal";
import timer from "./moduls/timer";
import calc from "./moduls/calc";
import carts from "./moduls/carts";
import forms from "./moduls/forms";
import slider from "./moduls/slider";


window.addEventListener("DOMContentLoaded", () => {
	
	tabs();
	modal("[data-modal]", ".modal");
	timer();
	calc();
	carts();
	forms();
	slider();
});