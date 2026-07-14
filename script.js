// ============================================
// EGYSÉGES HONLAP SCRIPT (Aurelia Luxury Boutique Hotel)
// ============================================

document.addEventListener("DOMContentLoaded", function () {

  // 1. NAVBAR SCROLL EFFECT
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // 2. BURGER MENU (Mobil navigáció)
  const burger = document.getElementById('burger');
  const navMenu = document.getElementById('navMenu');
  if (burger && navMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // 3. FOGLALÁSI ŰRLAP ÉS MODAL KEZELÉSE (NETLIFY FIX)
  const bookingForm = document.getElementById("bookingForm");
  const bookingSuccess = document.getElementById("bookingSuccess");
  const bookingModal = document.getElementById("bookingModal");
  const openModalBtn = document.getElementById("openModalBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");

  // Popup megnyitása (Csak ha a fő mezők ki vannak töltve)
  if (openModalBtn && bookingForm) {
    openModalBtn.addEventListener("click", function () {
      const checkIn = document.getElementById("check-in").value;
      const checkOut = document.getElementById("check-out").value;
      const roomType = document.getElementById("room-type").value;

      if (!checkIn || !checkOut || !roomType) {
        bookingForm.reportValidity();
      } else {
        if (bookingModal) bookingModal.classList.add("open");
      }
    });
  }

  // Popup bezárása (X gombra kattintva vagy a sötét háttérre)
  if (closeModalBtn && bookingModal) {
    closeModalBtn.addEventListener("click", function () {
      bookingModal.classList.remove("open");
    });
  }

  if (bookingModal) {
    window.addEventListener("click", function (e) {
      if (e.target === bookingModal) {
        bookingModal.classList.remove("open");
      }
    });
  }

  // Valódi adatküldés a Netlify-nak
  if (bookingForm && bookingSuccess && bookingModal) {
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();

      bookingModal.classList.remove("open");
      const formData = new FormData(bookingForm);

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      })
        .then(() => {
          bookingForm.style.display = "none";
          bookingSuccess.classList.add("active");
          bookingSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
        })
        .catch((error) => console.error("Netlify submission error:", error));
    });
  }

  // ============================================
  // UNIVERSAL: SZÓBA KÁRTYÁK ÖSSZEKÖTÉSE A FOGLALÁSI BÁRRAL
  // ============================================
  const roomSelect = document.getElementById("room-type");
  const bookRoomButtons = document.querySelectorAll('.room-detail-text .btn-primary');

  if (roomSelect && bookRoomButtons.length > 0) {
    bookRoomButtons.forEach(button => {
      button.addEventListener('click', function() {
        const roomSection = this.closest('.room-detail-section');
        if (!roomSection) return;

        // Nem kell if-else! Mivel a szekció ID-ja (pl. "room-3")
        // karakterre pontosan megegyezik a select option value-jával,
        // ez az egyetlen sor elvégzi a teljes párosítást!
        roomSelect.value = roomSection.id;
      });
    });
  }
  // 4. LIGHTBOX INTERAKTÍV DIASHOW MODUL (Nagyítható galéria)
  const gallery = document.getElementById("lightgallery");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");

  // Csak akkor fut le a galéria kódja, ha az elemek léteznek az oldalon
  if (gallery && lightbox && lightboxImg && lightboxCaption && closeBtn && prevBtn && nextBtn) {
    const images = Array.from(gallery.querySelectorAll(".gallery-grid-item img"));
    let currentIndex = 0;

    function showImage(index) {
      if (index < 0) {
        currentIndex = images.length - 1;
      } else if (index >= images.length) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }

      const activeImg = images[currentIndex];
      lightboxImg.classList.remove("loaded");

      setTimeout(() => {
        lightboxImg.src = activeImg.src;
        
        const parent = activeImg.closest(".gallery-grid-item");
        const title = parent.querySelector(".gallery-item-title").textContent;
        const category = parent.querySelector(".gallery-item-category").textContent;
        
        lightboxCaption.innerHTML = `<span style="color:var(--primary-color); font-size:0.8rem; text-transform:uppercase; display:block; margin-bottom:0.3rem;">${category}</span> ${title}`;

        lightboxImg.onload = () => {
          lightboxImg.classList.add("loaded");
        };
      }, 150);
    }

    gallery.querySelectorAll(".gallery-grid-item").forEach((item) => {
      item.addEventListener("click", () => {
        const img = item.querySelector("img");
        const index = parseInt(img.getAttribute("data-index"), 10);
        lightbox.classList.add("open");
        showImage(index);
      });
    });

    function closeLightbox() {
      lightbox.classList.remove("open");
      lightboxImg.classList.remove("loaded");
    }

    closeBtn.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.classList.contains("lightbox-content")) {
        closeLightbox();
      }
    });

    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showImage(currentIndex + 1);
    });

    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showImage(currentIndex - 1);
    });

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;

      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        showImage(currentIndex + 1);
      } else if (e.key === "ArrowLeft") {
        showImage(currentIndex - 1);
      }
    });
  }

});

// ============================================
// GLOBÁLIS FUNKCIÓK (Csúszka / Slider lapozó)
// ============================================
function moveSlider(sliderId, direction) {
  const slider = document.getElementById(sliderId);
  if (slider) {
    const slideWidth = slider.clientWidth;
    const currentScroll = slider.scrollLeft;
    const maxScroll = slider.scrollWidth - slideWidth;

    const isAtEnd = currentScroll >= maxScroll - 5;
    const isAtStart = currentScroll <= 5;

    if (direction === 1 && isAtEnd) {
      slider.scrollTo({ left: 0, behavior: 'smooth' });
    }
    else if (direction === -1 && isAtStart) {
      slider.scrollTo({ left: maxScroll, behavior: 'smooth' });
    }
    else {
      slider.scrollBy({
        left: direction * slideWidth,
        behavior: 'smooth'
      });
    }
  }
}