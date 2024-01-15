let openModalButtons = document.querySelectorAll(".openModal");

openModalButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    let delayTextElement = document.createElement("div");
    delayTextElement.textContent = "Search for an assistant";
    delayTextElement.classList.add("text__time");
    document.body.appendChild(delayTextElement);

    setTimeout(function () {
      delayTextElement.style.display = "none";

      let modal = document.getElementById("myModal");
      let closeButton = modal.getElementsByClassName("close")[0];

      modal.style.display = "block";
      document.body.classList.add("modal-open");
      mainFunc();

      closeButton.addEventListener("click", function () {
        modal.style.display = "none";
        document.body.classList.remove("modal-open");
      });
    }, 6000);
  });
});

// closeButton.addEventListener("click", function () {
//   modal.style.display = "none";
//   document.body.classList.remove("modal-open");
// });
