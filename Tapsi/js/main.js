const toggler = document.querySelector(".nav__toggler");
const navbar = document.querySelector(".nav");
toggler.addEventListener("click" , e =>{
    navbar.classList.toggle("nav__expanded");
});

// SERVICES
const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");

tabs.forEach(tab => {
    tab.addEventListener("click" , e => {
        const targetTabContent = document.querySelector(`#${tab.dataset.tabTarget}`);

        // remove all active class
        tabs.forEach(tab => {tab.classList.remove("active")});
        tabContents.forEach(tabContent => {tabContent.classList.remove("active")});
        
        // add new active class
        tab.classList.add("active");
        targetTabContent.classList.add("active"); 
    });      
});

// drop dwon
const accordionHeaders = document.querySelectorAll(".accordion__header");
const accordion = document.querySelector(".accordion");
accordionHeaders.forEach (item => {
    item.addEventListener("click" , e =>{
       e.target.parentElement.classList.toggle("accordion__expended");
    });
});
