function closeModal(modalSelector) {
  modal = document.querySelector(modalSelector);
  modal.classList.add("hide");
  modal.classList.remove("show");
  document.body.style.overflow = "";
}

function openModal(modalSelector) {
  modal = document.querySelector(modalSelector);
  modal.classList.add("show");
  modal.classList.remove("hide");
  document.body.style.overflow = "hidden";
}

function modal(triggerSelector, modalSelector) {
  // Modal

  const modalBtn = document.querySelectorAll(triggerSelector),
    modal = document.querySelector(modalSelector);

  modalBtn.forEach((item) => {
    item.addEventListener("click", () => openModal(modalSelector));
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.getAttribute("data-close") == "") {
      closeModal(modalSelector);
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape" && modal.classList.contains("show")) {
      closeModal(modalSelector);
    }
  });
}

export default modal;
export {openModal};
export {closeModal};
