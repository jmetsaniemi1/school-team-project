let slideIndex = 0;
const slides = document.getElementsByClassName("mySlide");
const tabs = document.getElementsByClassName("tab");

// Näytetään seuraava slaidi 5 sekunnin välein

function showSlides() {
  // Piilotetaan kaikki slaidit
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }

  // Näytetään nykyinen slaidi ja asetetaan siihen aktiivinen tila
  slides[slideIndex - 1].style.display = "block";
  updateTabs(slideIndex - 1);

  // Asetetaan 5 sekunnin aikaviive
  setTimeout(showSlides, 5000);
}

// Funktio tabien päivittämiseksi
function updateTabs(activeIndex) {
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].className = tabs[i].className.replace(" active", "");
  }
  tabs[activeIndex].className += " active";
}

// Lisätään tapahtumankuuntelijat tab-painikkeille
for (let i = 0; i < tabs.length; i++) {
  tabs[i].addEventListener("click", function () {
    // Kun käyttäjä klikkaa tab-painiketta, näytetään siihen liittyvä slaidi
    for (let j = 0; j < slides.length; j++) {
      slides[j].style.display = "none";
    }
    slides[i].style.display = "block";
    slideIndex = i + 1; // Päivitetään slideIndex klikatun tabin mukaan
    updateTabs(i); // Päivitetään tabien ulkoasu
  });
}

// Aloitetaan ensimmäisellä slaidilla
showSlides();

document.addEventListener("DOMContentLoaded", function () {
  const elems = document.querySelectorAll(".parallax");
  M.Parallax.init(elems);
});

//parallaxheader

const parallax_el = document.querySelectorAll(".parallaxhead");

let xValue = 0,
  yValue = 0,
  rotateDegree = 0,
  rotateSpeed = 1;

function updateParallaxEffect(e) {
  xValue = (e.clientX - window.innerWidth / 2) * 0.7;
  yValue = (e.clientY - window.innerHeight / 2) * 0.7;
  rotateDegree = (xValue / (window.innerWidth / 2)) * 20;

  parallax_el.forEach((el) => {
    let speedx = parseFloat(el.dataset.speedx) || 0.1;
    let speedy = parseFloat(el.dataset.speedy) || 0.1;

    el.style.transform = `
            translateX(calc(-50% + ${-xValue * speedx}px)) 
            translateY(calc(-50% + ${yValue * speedy}px)) 
            rotateY(${rotateDegree * rotateSpeed}deg)
        `;
  });
}

window.addEventListener("mousemove", updateParallaxEffect);
