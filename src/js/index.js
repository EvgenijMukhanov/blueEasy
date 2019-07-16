import { PORTFOLIO } from './config.js';

window.onload = function() {
  const portfolio = PORTFOLIO;

  /* Next Frame Animation */
  let nextFrame = (fn) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        fn();
      });
    });
  };
  /* End - Next Frame Animation */


  /* Universal animation function */
    let emAnimate = (elem, className, show, removeElem, callback = () => {}) => {
    let animateEnterStart = className + '-enter-start';
    let animateEnterActive = className + '-enter-active';
    let animateEnterEnd = className + '-enter-end';
    let animateLeaveStart = className + '-leave-start';
    let animateLeaveActive = className + '-leave-active';
    let animateLeaveEnd = className + '-leave-end';
    if (show == true) {
      let handlerShow = () => {
        elem.classList.remove(animateEnterStart);
        elem.classList.remove(animateEnterActive);
        elem.removeEventListener('transitionend', handlerShow);
        callback();
      };
      if (removeElem == true) {elem.style.display = 'block'};
      elem.classList.remove(animateLeaveEnd);
      elem.classList.add(animateEnterStart);
      elem.classList.add(animateEnterActive);
      nextFrame(() => {elem.classList.add(animateEnterEnd)});
      elem.addEventListener('transitionend', handlerShow);
    } else {
      let handlerHide = () => {
        if (removeElem == true) {
          elem.style.display = 'none';
        };
        elem.classList.remove(animateLeaveStart);
        elem.classList.remove(animateLeaveActive);
        elem.removeEventListener('transitionend', handlerHide);
        callback();
      };
      elem.classList.remove(animateEnterEnd);
      elem.classList.add(animateLeaveStart);
      elem.classList.add(animateLeaveActive);
      nextFrame(() => {elem.classList.add(animateLeaveEnd)});
      elem.addEventListener('transitionend', handlerHide);
    };
  };
  /* End - Universal animation function */

/* Section animation mobile menu */

  /* Open mobile menu */
  let handlerMobileOpen = () => {
    emAnimate(headerNav, 'headerNav', true, false, () => {})
  };

  /* Close mobile menu */
  let handlerMobileClose = () => {
    emAnimate(headerNav, 'headerNav', false, false, () => {})
  };

  let headerNav = document.querySelector('.headerNav');
  let menuMobileOpen = document.querySelector('.menuMobileOpen');
  menuMobileOpen.addEventListener('click', handlerMobileOpen, true);
  let menuMobileClose = document.querySelector('.menuMobileClose');
  menuMobileClose.addEventListener('click', handlerMobileClose,true);

/* End section animation mobile menu */


/* Section Scroll */

  let currentYPosition = () => {
      if (self.pageYOffset) return self.pageYOffset;
      if (document.documentElement && document.documentElement.scrollTop)
          return document.documentElement.scrollTop;
      if (document.body.scrollTop) return document.body.scrollTop;
      return 0;
  };

  let elmYPosition = (eID) => {
      let elm = document.querySelector(eID);
      let y = elm.offsetTop;
      let node = elm;
      while (node.offsetParent && node.offsetParent != document.body) {
          node = node.offsetParent;
          y += node.offsetTop;
      } return y;
  };

  let anchors = [].slice.call(document.querySelectorAll('a[href*="#"]')),
    animationTime = 300,
    framesCount = 20;

  anchors.forEach(function(item) {

    item.addEventListener('click', function(e) {
      let eID = item.hash;
      // if mobile menu open
      if (headerNav.classList.contains = 'headerNav-enter-end') {
        handlerMobileClose();
      };
      let startY = currentYPosition();
      let stopY = elmYPosition(eID);
      let distance = stopY > startY ? stopY - startY : startY - stopY;
      if (distance < 100) {
          scrollTo(0, stopY); return;
      };
      let speed = Math.round(distance / 100);
      if (speed >= 20) speed = 20;
      let step = Math.round(distance / 25);
      let leapY = stopY > startY ? startY + step : startY - step;
      let timer = 0;
      if (stopY > startY) {
          for ( let i=startY; i<stopY; i+=step ) {
              setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
              leapY += step; if (leapY > stopY) leapY = stopY; timer++;
          } return;
      };
      for ( let i=startY; i>stopY; i-=step ) {
          setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
          leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
      };
    });
  });

/* End Section Scroll */

/* Section Portfolio */
  
  let activePortfolioMenu = 'all';
  let prevPortfolioMenu = 'default';

  /* Portfolio menu handler */  
  let portfolioMenuHandler = function() {
    if (this.innerHTML != activePortfolioMenu) {
      portfolioMenuItems.map((item) => {
        if (item.innerHTML == activePortfolioMenu) {
          item.classList.remove('portfolioMenuItem-active');
        };
      });
      this.classList.add('portfolioMenuItem-active');
      prevPortfolioMenu = activePortfolioMenu;
      activePortfolioMenu = this.innerHTML;
      renderPortfolioImage();
    };
  };

  let portfolioMenuItems = [...document.querySelectorAll('.portfolioMenuItem')];
  portfolioMenuItems.forEach((item) => {
    item.addEventListener('click', portfolioMenuHandler)
  });

  /* End Portfolio menu handler */


  /* Animate Item Portfolio */

  let animatePortfolioItem = (showItems, hideItems) => {
    let itemShow = (showItems) => {
      showItems.map((item, i) => {
        emAnimate(item, 'portfolioItem', true, true);
      });
    };
    let itemHide = (hideItems) => {
      hideItems.map((item, i) => {
        let callbackToShow = () => {
          if (i == +(hideItems.length - 1)) {
            itemShow(showItems);
          };
        };
        emAnimate(item, 'portfolioItem', false, true, callbackToShow);
      });
    };
    if (hideItems.length != 0) {
      itemHide(hideItems);
    } else {
      itemShow(showItems);
    };    
  };

  /* End Animate Item Portfolio */

  /* Render Elements to Portfolio */

  let portfolioState = PORTFOLIO;
  let renderPortfolioImage = () => {
    let portfolioItems = document.querySelector('.portfolioItems');
    let portfolioElems = [...document.querySelectorAll('.portfolioItem')];

    let showItems = [];
    let hideItems = [];
    let pushImage = (item, i) => {
      let divPortfolioItem = document.createElement('div');
      divPortfolioItem.classList.add('portfolioItem');
      divPortfolioItem.setAttribute('data-key', item.id);
      divPortfolioItem.style.background = `url(./img/${i}.png)`;
      portfolioItems.appendChild(divPortfolioItem);
    };

    if (prevPortfolioMenu == 'default') {
      portfolioState.map((item, i) => {
        pushImage(item, i);
      });
      prevPortfolioMenu = 'all';
    } else if (activePortfolioMenu == 'all') {
      portfolioElems.map((item, i) => {
        if (portfolioState[item.getAttribute('data-key') - 1].class == prevPortfolioMenu) {
          showItems.push(item);
        };
      });
      animatePortfolioItem(showItems, hideItems);
    } else {
      portfolioElems.map((item, i) => {
        if (portfolioState[item.getAttribute('data-key') - 1].class == prevPortfolioMenu) {
          showItems.push(item);
        };
        if (portfolioState[item.getAttribute('data-key') - 1].class == activePortfolioMenu) {
          hideItems.push(item);
        };
      });
      animatePortfolioItem(showItems, hideItems);
    };
  };

  /* End Render Elements to Portfolio */

  renderPortfolioImage();

  /* Set full screen image portfolio item */

  let fullImagePortfolio = function(){

    /* get size image and push to modal window */
    let pushFullImage = (item) => {
      let indent = 30; // margin from the edges of the screen

      /* get width and height screen and image*/
      let screenWidth = document.documentElement.clientWidth;
      let screenHeight = window.innerHeight;            
      let imageStyle = window.getComputedStyle(item, null);
      imageStyle = imageStyle.backgroundImage.slice(5, -2);
      let img = new Image;
      img.src = imageStyle;
      let imgWidth = img.width;
      let imgHight = img.height;

      /* determination ratio screen and image */
      let imageRatio = imgHight / imgWidth;
      let screenRatio = screenHeight / screenWidth;
      if (imageRatio > screenRatio) {
        imgHight = screenHeight - (indent * 2);
        imgWidth = imgHight / imageRatio;
      } else {
        imgWidth = screenWidth - (indent * 2);
        imgHight = imgWidth * imageRatio;
      };
      let topImage = ((screenHeight - imgHight) / 2);
      let leftImage = ((screenWidth - imgWidth) / 2);

      /* set style modal window */
      let modalContent = document.querySelector('.modalBody');
      modalContent.style.width = imgWidth + 'px';
      modalContent.style.height = imgHight + 'px';
      modalContent.style.top = topImage + 'px';
      modalContent.style.left = leftImage + 'px';
      modalContent.style.backgroundImage = 'url('+imageStyle+')';
    };
    let closeModalHandler = (e) => {
      let closeElement = document.querySelector('.closeModal');
      /* close modal window on click close element or an empty area*/
      if (e.target == closeModal || e.target == closeElement) {
        emAnimate(getDiv, 'modalWrap', false, true);
      };      
    };

    pushFullImage(this);
    /* open modal window */
    let getDiv = document.querySelector('.modalWrap');
    emAnimate(getDiv, 'modalWrap', true, true);
    /* setting the event close modal window handler click and press Esc */
    let closeModal = document.querySelector('.modalWrap');
    closeModal.addEventListener('click', closeModalHandler);
    window.onkeydown = (e) => {
      if (e.keyCode == 27) {
        emAnimate(getDiv, 'modalWrap', false, true);
      };
    };
  };
  /* End - Set full screen image portfolio item */

  let portfolioElems = [...document.querySelectorAll('.portfolioItem')];
  portfolioElems.map((item, i) => {
    item.addEventListener('click', fullImagePortfolio);
  });
/* End Section Portfolio*/

/* Section Contacts */
  let emValidateForm = (itemForm, saveForm = false) => {
    // Flags
    let emEmpty = null;
    let emGuard = null;
    let emName = null;
    let emNameLength = null;
    let emTextAreaLength = null;
    let emEmail = null;
    let emSucces = null;
    let emFormResult = {emSucces, 
              emEmpty, 
              emGuard, 
              emName,
              emNameLength,
              emTextAreaLength,
              emEmail};

    // Settings
    let minNameLength = 2;
    let maxNameLength = 50;
    let minTextAreaLength = 15;
    let maxTextAreaLength = 300;


    // Special Symbols to replace
    let specialSymdolsMap = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": '&#39;',
      '"': '&quot;',
      '`': '&lsquo;',
      "/": '&#47;',
      "\\": '&#92;'
    };

    // Replace special characters with safe characters
    let emHtmlSpecialChars = (string) => {
      return String(string).replace(patternGuard, (s) => {
        return specialSymdolsMap[s];
      });
    };

    //  Verification templates
    let patternGuard = /[<>&'"`\\\/\]\[]/g;
    let patternName = /^[a-zA-Zа-яА-Я][a-zA-Zа-яА-Я0-9\s-_\.]*/;
    let patternEmail = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/;
    let patternClearGap = /(^\s+|\s+$)/g;

    // The use of common templates (remove the spaces and check special characters)
    emFormResult.emGuard = !patternGuard.test(itemForm.value);
    if (saveForm == true) {
      itemForm.value = emHtmlSpecialChars(itemForm.value);
    };
    itemForm.value = itemForm.value.replace(patternClearGap, '');
    emFormResult.emEmpty = itemForm.value.length > 0 ? true : false;

    let attrs = itemForm.getAttribute('data-form');
    switch(attrs){
      case "name":
        (itemForm.value.length >= minNameLength) 
          && (itemForm.value.length <= maxNameLength) 
          ? emFormResult.emNameLength = true 
          : emFormResult.emNameLength = false;
        emFormResult.emName = patternName.test(itemForm.value);
        emFormResult.emSucces = (emFormResult.emEmpty 
                    && emFormResult.emNameLength 
                    && emFormResult.emName) 
                    ? true : false;
        break;
      case "email":
        emFormResult.emEmail = patternEmail.test(itemForm.value);
        emFormResult.emSucces = (emFormResult.emEmpty 
                    && emFormResult.emEmail) 
                    ? true : false;
        break;
      case "textarea":
        (itemForm.value.length >= minTextAreaLength) 
          && (itemForm.value.length <= maxTextAreaLength) 
          ? emFormResult.emTextAreaLength = true 
          : emFormResult.emTextAreaLength = false;
        emFormResult.emSucces = (emFormResult.emEmpty 
                    && emFormResult.emTextAreaLength) 
                    ? true : false;
        break;
      default:
    };
    return emFormResult;
  };

  // Flag submit form
  let onSubmit = false;

  // Form field validation handler
  let formFieldHandler = (item) => {    
    // Get flags Form Validation
    let { emSucces, 
      emEmpty, 
      emGuard, 
      emName, 
      emNameLength, 
      emTextAreaLength, 
      emEmail } = emValidateForm(item, false);

    // Creating a message on error to the user by flags
    let errorMessage = '';
    if (!emEmpty) {errorMessage += 'required field'};
    if (emEmpty && !emName && emName != null) {
      if (errorMessage.length > 0) {errorMessage += ', '}
      errorMessage += 'enter a valid name';
    };
    if (emEmpty && !emNameLength && emNameLength != null) {
      if (errorMessage.length > 0) {errorMessage += ', '}
      errorMessage += 'length from 2 to 50 characters';
    };
    if (emEmpty && !emEmail && emEmail != null) {
      if (errorMessage.length > 0) {errorMessage += ', '}
      errorMessage += 'enter a valid e-mail';
    };
    if (emEmpty && !emTextAreaLength && emTextAreaLength != null) {
      if (errorMessage.length > 0) {errorMessage += ', '}
      errorMessage += 'length from 15 to 300 characters';
    };
    // Otput message on Error
    item.nextSibling.nextSibling.innerHTML = errorMessage;
    (errorMessage.length > 0) ? item.classList.add('contactsInputError')
                 : item.classList.remove('contactsInputError');
  };
  // End Form field validation handler

  // Handler Submit Form
  let formHandler = (e) => {
    let formBlurHandler = function () {
      formFieldHandler(this);
    };
    let handlerSendForm = () => {
      let closeElement = document.querySelector('.contactsFormWrap');
      let openElement = document.querySelector('.contactsThanks');
      let handlerCloseForm = () => {
        emAnimate(openElement, 'contactsThanks', true, true)
      };
      emAnimate(closeElement, 'contactsFormWrap', false, true, handlerCloseForm);
    };
    e.preventDefault();
    let contactsInput = [...document.querySelectorAll('.contactForm')];
    contactsInput.map((item) => {
      formFieldHandler(item);
    });
    if (!onSubmit) {
      contactsInput.map((item) => {
        item.addEventListener('blur', formBlurHandler);
      });
    };
    onSubmit = true;
    // 
    let formErrors = [...document.querySelectorAll('.contactsFormError')];
    let onFormError = 0;
    formErrors.map((item) => {
      onFormError += item.innerHTML.length;
    });
    if (onFormError == 0) {
      handlerSendForm();
    };
  };
  // End Handler Submit Form

  // Set handlet submit form
  let contactsSubmit = document.querySelector('.contactsSubmit');
  contactsSubmit.addEventListener('click', formHandler);

/* End Section Contacts */
};