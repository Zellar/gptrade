"use strict";
const modules_flsModules = {};
function isWebp() {
  function testWebP(callback) {
    let webP = new Image();
    webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
    };
    webP.src =
      "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }
  testWebP(function (support) {
    let className = support === true ? "webp" : "no-webp";
    document.documentElement.classList.add(className);
  });
}
let isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows()
    );
  },
};
function fullVHfix() {
  const fullScreens = document.querySelectorAll("[data-fullscreen]");
  if (fullScreens.length && isMobile.any()) {
    window.addEventListener("resize", fixHeight);
    function fixHeight() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
    fixHeight();
  }
}
let bodyLockStatus = true;
let bodyUnlock = (delay = 500) => {
  let body = document.querySelector("body");
  if (bodyLockStatus) {
    let lock_padding = document.querySelectorAll("[data-lp]");
    setTimeout(() => {
      for (let index = 0; index < lock_padding.length; index++) {
        const el = lock_padding[index];
        el.style.paddingRight = "0px";
      }
      body.style.paddingRight = "0px";
      document.documentElement.classList.remove("lock");
    }, delay);
    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
};
let bodyLock = (delay = 500) => {
  let body = document.querySelector("body");
  if (bodyLockStatus) {
    let lock_padding = document.querySelectorAll("[data-lp]");
    for (let index = 0; index < lock_padding.length; index++) {
      const el = lock_padding[index];
      el.style.paddingRight =
        window.innerWidth -
        document.querySelector(".wrapper").offsetWidth +
        "px";
    }
    body.style.paddingRight =
      window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
    document.documentElement.classList.add("lock");
    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
};
function functions_FLS(message) {
  setTimeout(() => {
    if (window.FLS) console.log(message);
  }, 0);
}
class Popup {
  constructor(options) {
    let config = {
      logging: false,
      init: true,
      attributeOpenButton: "data-popup",
      attributeCloseButton: "data-close",
      fixElementSelector: "[data-lp]",
      youtubeAttribute: "data-popup-youtube",
      youtubePlaceAttribute: "data-popup-youtube-place",
      setAutoplayYoutube: true,
      classes: {
        popup: "popup",
        popupContent: "popup__content",
        popupActive: "popup_show",
        bodyActive: "popup-show",
      },
      focusCatch: true,
      closeEsc: false,
      bodyLock: true,
      hashSettings: {
        location: false,
        goHash: false,
      },
      on: {
        beforeOpen: function () {},
        afterOpen: function () {},
        beforeClose: function () {},
        afterClose: function () {},
      },
    };
    this.youTubeCode;
    this.isOpen = false;
    this.targetOpen = {
      selector: false,
      element: false,
    };
    this.previousOpen = {
      selector: false,
      element: false,
    };
    this.lastClosed = {
      selector: false,
      element: false,
    };
    this._dataValue = false;
    this.hash = false;
    this._reopen = false;
    this._selectorOpen = false;
    this.lastFocusEl = false;
    this._focusEl = [
      "a[href]",
      'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
      "button:not([disabled]):not([aria-hidden])",
      "select:not([disabled]):not([aria-hidden])",
      "textarea:not([disabled]):not([aria-hidden])",
      "area[href]",
      "iframe",
      "object",
      "embed",
      "[contenteditable]",
      '[tabindex]:not([tabindex^="-"])',
    ];
    this.options = {
      ...config,
      ...options,
      classes: {
        ...config.classes,
        ...options?.classes,
      },
      hashSettings: {
        ...config.hashSettings,
        ...options?.hashSettings,
      },
      on: {
        ...config.on,
        ...options?.on,
      },
    };
    this.bodyLock = false;
    this.options.init ? this.initPopups() : null;
  }
  initPopups() {
    this.popupLogging(`Прокинувся`);
    this.eventsPopup();
  }
  eventsPopup() {
    document.addEventListener(
      "click",
      function (e) {
        const buttonOpen = e.target.closest(
          `[${this.options.attributeOpenButton}]`
        );
        if (buttonOpen) {
          e.preventDefault();
          this._dataValue = buttonOpen.getAttribute(
            this.options.attributeOpenButton
          )
            ? buttonOpen.getAttribute(this.options.attributeOpenButton)
            : "error";
          this.youTubeCode = buttonOpen.getAttribute(
            this.options.youtubeAttribute
          )
            ? buttonOpen.getAttribute(this.options.youtubeAttribute)
            : null;
          if (this._dataValue !== "error") {
            if (!this.isOpen) this.lastFocusEl = buttonOpen;
            this.targetOpen.selector = `${this._dataValue}`;
            this._selectorOpen = true;
            this.open();
            return;
          } else
            this.popupLogging(
              `Йой, не заповнено атрибут у ${buttonOpen.classList}`
            );
          return;
        }
      }.bind(this)
    );
    document.addEventListener(
      "keydown",
      function (e) {
        if (
          this.options.closeEsc &&
          e.which == 27 &&
          e.code === "Escape" &&
          this.isOpen
        ) {
          e.preventDefault();
          this.close();
          return;
        }
        if (this.options.focusCatch && e.which == 9 && this.isOpen) {
          this._focusCatch(e);
          return;
        }
      }.bind(this)
    );
    if (this.options.hashSettings.goHash) {
      window.addEventListener(
        "hashchange",
        function () {
          if (window.location.hash) this._openToHash();
          else this.close(this.targetOpen.selector);
        }.bind(this)
      );
      window.addEventListener(
        "load",
        function () {
          if (window.location.hash) this._openToHash();
        }.bind(this)
      );
    }
  }
  open(selectorValue) {
    if (bodyLockStatus) {
      this.bodyLock =
        document.documentElement.classList.contains("lock") && !this.isOpen
          ? true
          : false;
      if (
        selectorValue &&
        typeof selectorValue === "string" &&
        selectorValue.trim() !== ""
      ) {
        this.targetOpen.selector = selectorValue;
        this._selectorOpen = true;
      }
      if (this.isOpen) {
        this._reopen = true;
        this.close();
      }
      if (!this._selectorOpen)
        this.targetOpen.selector = this.lastClosed.selector;
      if (!this._reopen) this.previousActiveElement = document.activeElement;
      this.targetOpen.element = document.querySelector(
        this.targetOpen.selector
      );
      if (this.targetOpen.element) {
        if (this.youTubeCode) {
          const codeVideo = this.youTubeCode;
          const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
          const iframe = document.createElement("iframe");
          iframe.setAttribute("allowfullscreen", "");
          const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
          iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
          iframe.setAttribute("src", urlVideo);
          if (
            !this.targetOpen.element.querySelector(
              `[${this.options.youtubePlaceAttribute}]`
            )
          ) {
            this.targetOpen.element
              .querySelector(".popup__text")
              .setAttribute(`${this.options.youtubePlaceAttribute}`, "");
          }
          this.targetOpen.element
            .querySelector(`[${this.options.youtubePlaceAttribute}]`)
            .appendChild(iframe);
        }
        if (this.options.hashSettings.location) {
          this._getHash();
          this._setHash();
        }
        this.options.on.beforeOpen(this);
        document.dispatchEvent(
          new CustomEvent("beforePopupOpen", {
            detail: {
              popup: this,
            },
          })
        );
        this.targetOpen.element.classList.add(this.options.classes.popupActive);
        document.documentElement.classList.add(this.options.classes.bodyActive);
        if (!this._reopen) !this.bodyLock ? bodyLock() : null;
        else this._reopen = false;
        this.targetOpen.element.setAttribute("aria-hidden", "false");
        this.previousOpen.selector = this.targetOpen.selector;
        this.previousOpen.element = this.targetOpen.element;
        this._selectorOpen = false;
        this.isOpen = true;
        setTimeout(() => {
          this._focusTrap();
        }, 50);
        this.options.on.afterOpen(this);
        document.dispatchEvent(
          new CustomEvent("afterPopupOpen", {
            detail: {
              popup: this,
            },
          })
        );
        this.popupLogging(`Відкрив попап`);
      } else
        this.popupLogging(
          `Йой, такого попапу немає. Перевірте коректність введення. `
        );
    }
  }
  close(selectorValue) {
    if (
      selectorValue &&
      typeof selectorValue === "string" &&
      selectorValue.trim() !== ""
    )
      this.previousOpen.selector = selectorValue;
    if (!this.isOpen || !bodyLockStatus) return;
    this.options.on.beforeClose(this);
    document.dispatchEvent(
      new CustomEvent("beforePopupClose", {
        detail: {
          popup: this,
        },
      })
    );
    if (this.youTubeCode)
      if (
        this.targetOpen.element.querySelector(
          `[${this.options.youtubePlaceAttribute}]`
        )
      )
        this.targetOpen.element.querySelector(
          `[${this.options.youtubePlaceAttribute}]`
        ).innerHTML = "";
    this.previousOpen.element.classList.remove(
      this.options.classes.popupActive
    );
    this.previousOpen.element.setAttribute("aria-hidden", "true");
    if (!this._reopen) {
      document.documentElement.classList.remove(
        this.options.classes.bodyActive
      );
      !this.bodyLock ? bodyUnlock() : null;
      this.isOpen = false;
    }
    this._removeHash();
    if (this._selectorOpen) {
      this.lastClosed.selector = this.previousOpen.selector;
      this.lastClosed.element = this.previousOpen.element;
    }
    this.options.on.afterClose(this);
    document.dispatchEvent(
      new CustomEvent("afterPopupClose", {
        detail: {
          popup: this,
        },
      })
    );
    setTimeout(() => {
      this._focusTrap();
    }, 50);
    this.popupLogging(`Закрив попап`);
  }
  _getHash() {
    if (this.options.hashSettings.location)
      this.hash = this.targetOpen.selector.includes("#")
        ? this.targetOpen.selector
        : this.targetOpen.selector.replace(".", "#");
  }
  _openToHash() {
    let classInHash = document.querySelector(
      `.${window.location.hash.replace("#", "")}`
    )
      ? `.${window.location.hash.replace("#", "")}`
      : document.querySelector(`${window.location.hash}`)
      ? `${window.location.hash}`
      : null;
    const buttons = document.querySelector(
      `[${this.options.attributeOpenButton} = "${classInHash}"]`
    )
      ? document.querySelector(
          `[${this.options.attributeOpenButton} = "${classInHash}"]`
        )
      : document.querySelector(
          `[${this.options.attributeOpenButton} = "${classInHash.replace(
            ".",
            "#"
          )}"]`
        );
    this.youTubeCode = buttons.getAttribute(this.options.youtubeAttribute)
      ? buttons.getAttribute(this.options.youtubeAttribute)
      : null;
    if (buttons && classInHash) this.open(classInHash);
  }
  _setHash() {
    history.pushState("", "", this.hash);
  }
  _removeHash() {
    history.pushState("", "", window.location.href.split("#")[0]);
  }
  _focusCatch(e) {
    const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
    const focusArray = Array.prototype.slice.call(focusable);
    const focusedIndex = focusArray.indexOf(document.activeElement);
    if (e.shiftKey && focusedIndex === 0) {
      focusArray[focusArray.length - 1].focus();
      e.preventDefault();
    }
    if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
      focusArray[0].focus();
      e.preventDefault();
    }
  }
  _focusTrap() {
    const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
    if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus();
    else focusable[0].focus();
  }
  popupLogging(message) {
    this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
  }
}
modules_flsModules.popup = new Popup({});
let addWindowScrollEvent = false;
setTimeout(() => {
  if (addWindowScrollEvent) {
    let windowScroll = new Event("windowScroll");
    window.addEventListener("scroll", function (e) {
      document.dispatchEvent(windowScroll);
    });
  }
}, 0);
const mainFunc = () => {
  setTimeout(() => {
    modules_flsModules.popup.open("#myModal");
  }, 8e3);
  const messagesList = document.getElementById("messages");
  const userInput = document.getElementById("userInput");
  const hiddenForm = document.getElementById("hiddenForm");
  const submitForm = document.getElementById("submitForm");
  const nameField = document.getElementById("nameField");
  const phoneField = document.getElementById("phoneField");
  const emailField = document.getElementById("emailField");
  const buttonSend = document.querySelector("#send");
  let currentStep = 1;
  const isValidEmail = (email) => {
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return emailRegex.test(email);
  };
  const isValidPhone = (phone) => {
    const phoneRegex = /^\+?\d+$/;
    return phoneRegex.test(phone);
  };
  const smoothScroll = (start, end, duration) => {
    const startTime = new Date().getTime();
    const animateScroll = () => {
      const currentTime = new Date().getTime();
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const newPosition = start + progress * (end - start);
      window.scrollTo(0, newPosition);
      if (progress < 1) requestAnimationFrame(animateScroll);
    };
    requestAnimationFrame(animateScroll);
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const appendAssistantMessage = (message) => {
    const messageItem = document.createElement("li");
    const typing = document.createElement("p");
    const time = message.length * 30;
    const userInput = document.querySelector(".chat__input");
    const userPlaceholder = userInput.querySelector("textarea");
    userInput.classList.add("disable");
    userPlaceholder.setAttribute(
      "placeholder",
      "Wait for the manager's response"
    );
    typing.className = "typing-animation active";
    typing.innerHTML = `Typing message`;
    messagesList.appendChild(typing);
    sleep(time).then(() => {
      userPlaceholder.setAttribute("placeholder", "Type...");
      userInput.classList.remove("disable");
      typing.classList.remove("active");
      messageItem.className = "chat__message";
      messageItem.innerHTML = `\n                    </div>\n                    <div class="chat__message_bot">${message}</div>\n                `;
      messagesList.appendChild(messageItem);
    });
    return time;
  };

  const appendUserMessage = (message) => {
    const messageItem = document.createElement("li");
    messageItem.className = "chat__message chat__message_user";
    messageItem.innerHTML = `${message}`;
    messagesList.appendChild(messageItem);
  };

  const appendUserData = () => {
    const btnItem = document.createElement("button");
    const userInput = document.querySelector(".chat__input");
    const messageItem = document.createElement("li");
    messageItem.className = "chat__message chat__userdata";
    messageItem.innerHTML = `\n                    <div class="chat__message_bot">Name: <input class="data-value" value="${nameField.value}"></div>\n  <div class="chat__message_bot">Phone: <input class="data-value" value="${phoneField.value}"></div>\n <div class="chat__message_bot">Email: <input class="data-value" value="${emailField.value}"></div>\n      <button class="ok">Data correct</button>        `;
    messagesList.appendChild(messageItem);
    const ok = document.querySelector(".ok");
    ok.addEventListener('click', () => {
      askQuestion();
    });

    const dataInput = messageItem.querySelectorAll(".chat__message_bot");

    dataInput.forEach((item) => {
      const btnItem = document.createElement("button");
      btnItem.className = "change";
      // btnItem.innerHTML = `\n <img id="change-value" class="data-icon__change" src="img/pencil.svg"> \n <img id="confirm-value" class="data-icon__change data-icon__change-btn" src="img/ok.svg"> \n <img id="cancel-value" class="data-icon__change data-icon__change-btn" src="img/cancel.svg">`;
      btnItem.innerHTML = `\n <img id="change-value" class="data-icon__change" src="img/pencil.svg"> \n <img id="confirm-value" class="data-icon__change data-icon__change-btn" src="img/ok.svg">`;
      item.appendChild(btnItem);
      item.querySelector(".change").addEventListener('click', function(e) {
        const input = this.parentElement.querySelector(".data-value");
        let oldValue = [];
        oldValue.push(input.value);
        console.log(oldValue);
        this.classList.add("active");
        input.classList.add("active");
        const ok = this.querySelector("#confirm-value");
        const cancel = this.querySelector("#cancel-value");
        const { target } = e;
        if(target == ok) {
          input.innerHTML = input.value;
          oldValue = input.value;
          input.classList.remove("active");
          this.classList.remove("active");
          return oldValue;
        } else if (target == cancel) {
          input.classList.remove("active");
          input.innerHTML = `${oldValue}`;
          this.classList.remove("active");
        }
      })
    })
  };
  

  const askQuestion = () => {
    const userInputValue = userInput.value.trim();
    switch (currentStep) {
      case 1:
       sleep(1500).then(() => {
          appendAssistantMessage(
            "Hi! My name is Nancy, I will be your personal trading assistant. Before we start, please write your full name."
          );
        });

        break;

      case 2:
        nameField.value = userInputValue;
        appendUserMessage(nameField.value);

        async function delayedMessage() {
          await sleep(appendAssistantMessage(`Nice to meet you, ${nameField.value}! I’m here to guide you through our trading platform and help you make the most out of your investments.`));
          sleep(500).then(() => {
            appendAssistantMessage(`To get started, please provide your phone number.`);
            userInput.setAttribute("placeholder", "+xx xxx xxxx xxxx");
          });
        }        
        sleep(1500).then(() => {
          delayedMessage();
        });
        


        break;

      case 3:
        if (!isValidPhone(userInputValue)) {
          alert("Please enter a valid phone number.");
          return;
        }
        phoneField.value = userInputValue;
        appendUserMessage(phoneField.value);
        sleep(1500).then(() => {
          appendAssistantMessage(
            "Great! Now, could you provide your working email address?"
          );
        });

        break;

      case 4:

          if (!isValidEmail(userInputValue)) {
            alert("Please enter a valid email address.");
            return;
          }
          emailField.value = userInputValue;
          appendUserMessage(emailField.value);

          async function delayedMessage2() {
            await sleep(appendAssistantMessage(`Please confirm that the provided data is correct.`));
            sleep(500);
            await sleep(appendAssistantMessage(`If you have entered incorrect data, you can edit it by clicking on the "edit" icon.`));
            sleep(1500).then(() => {
              appendUserData();
            });
            
          }     
          sleep(1500).then(() => {
            delayedMessage2();
          });

        break;

      case 5:

        sleep(1500).then(() => {
          appendAssistantMessage(
            "Thank you for your application. Our managers will contact you shortly!"
          );
        });

        submitForm.click();
        userInput.disabled = true;
        break;

      default:
        submitForm.click();
        userInput.disabled = true;
        break;
    }
    currentStep++;
    userInput.value = "";
    const scrollHeight = document.body.scrollHeight;
    const currentPosition = window.scrollY;
    const targetPosition = scrollHeight - window.innerHeight;
    smoothScroll(currentPosition, targetPosition, 500);
    function lastMessageScroll(b) {
      var e = document.querySelector('.wrapper_Scrollbottom');
      if (!e) return ; 
      
      e.scrollIntoView({
          behavior: b || 'auto',
          block: 'end',
      });
  }
  lastMessageScroll('smooth');
  };
  if (hiddenForm) {
    document.addEventListener("click", function (e) {
      const { target } = e;
      if (target === buttonSend && userInput.value.trim().length !== 0)
        askQuestion();
    });
    userInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && userInput.value.trim().length !== 0)
        askQuestion();
    });
    hiddenForm.addEventListener("submit", function (e) {
      e.preventDefault();
    });
    askQuestion();
  }
};

// window.addEventListener("DOMContentLoaded", mainFunc);
window["FLS"] = true;
isWebp();
fullVHfix();
