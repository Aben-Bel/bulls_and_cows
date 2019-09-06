const nav = document.querySelector(".nav");
const sideNav = document.querySelector(".side-nav");
const panel = document.querySelector(".panel");


const adjustDisplay = ()=>{
    const mq = window.matchMedia( "(max-width: 1030px)" );

    if (mq.matches) {
        // window width is at less than 1030px
        sideNav.classList.add('hide');
        nav.classList.remove('hide');
        panel.classList.add('hide');
    }
    else {
        // window width is greater than 1030px
        nav.classList.add('hide');
        sideNav.classList.remove('hide');
        panel.classList.remove('hide');
    }
}


adjustDisplay();
window.addEventListener("resize", adjustDisplay);
