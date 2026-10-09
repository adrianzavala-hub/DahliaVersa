document.addEventListener("DOMContentLoaded", () => {
    const logoTrigger = document.getElementById('logoTrigger');
    const modalOverlay = document.getElementById('modalOverlay');
    const btnClose = document.getElementById('btnClose');

    function createGlitchLamp() {
        if (!modalOverlay) return;
        const modalCard = modalOverlay.querySelector('.modal-card');
        if (modalCard) {
            modalCard.style.position = 'relative';
            
            let lamp = modalCard.querySelector('.glitch-lamp');
            if (!lamp) {
                lamp = document.createElement('div');
                lamp.classList.add('glitch-lamp');
                lamp.innerHTML = `
                    <div class="street-bracket"></div>
                    <div class="street-head">
                        <div class="lamp-bulb"></div>
                    </div>
                `;
                modalCard.appendChild(lamp);
            }

            let pipeLeak = modalCard.querySelector('.pipe-leak-container');
            if (!pipeLeak) {
                pipeLeak = document.createElement('div');
                pipeLeak.classList.add('pipe-leak-container');
                pipeLeak.innerHTML = `
                    <div class="pipe-structure">
                        <div class="pipe-crack"></div>
                    </div>
                    <div class="water-cascade-container">
                        <span class="water-stream"></span>
                        <span class="water-stream"></span>
                        <span class="water-drop-down"></span>
                        <span class="water-drop-down"></span>
                    </div>
                `;
                modalCard.appendChild(pipeLeak);
            }

            let carArea = modalCard.querySelector('.car-container');
            if (!carArea) {
                carArea = document.createElement('div');
                carArea.classList.add('car-container');
                carArea.innerHTML = `
                    <div class="street-pothole"></div>
                    <div class="mini-car">
                        <div class="car-wheel rear"></div>
                        <div class="car-wheel front"></div>
                    </div>
                    <div class="mini-car pink-truck">
                        <div class="car-wheel rear"></div>
                        <div class="car-wheel front"></div>
                    </div>
                `;
                modalCard.appendChild(carArea);
            }
        }
    }

    if (logoTrigger) {
        logoTrigger.addEventListener('click', () => {
            document.body.classList.add('modal-active');
            createGlitchLamp();
        });
    }

    if (btnClose) {
        btnClose.addEventListener('click', () => {
            document.body.classList.remove('modal-active');
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                document.body.classList.remove('modal-active');
            }
        });
    }

    window.showLoader = function() {};
    window.hideLoader = function() {};

    const statCards = document.querySelectorAll(".stat-card");
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add("visible");
        }, 300 + (index * 250)); 
    });

    const statNumbers = document.querySelectorAll(".stat-card h3");
    statNumbers.forEach(h3 => {
        const text = h3.textContent;
        
        if (text.includes("40%")) {
            let currentVal = 0;
            h3.textContent = "0%";
            const interval = setInterval(() => {
                currentVal += 2;
                h3.textContent = currentVal + "%";
                if (currentVal >= 40) clearInterval(interval);
            }, 30);
        }
        
        if (text.includes("3 DÍAS")) {
            let currentVal = 0;
            h3.textContent = "0 DÍAS";
            const interval = setInterval(() => {
                currentVal += 1;
                h3.textContent = currentVal + " DÍAS";
                if (currentVal >= 3) clearInterval(interval);
            }, 250); 
        }
    });

    // 1. Loader general para baches y otras secciones
    const loadTriggers = document.querySelectorAll('.load-trigger');
    const pageLoader = document.getElementById('pageLoader');

    if (pageLoader && loadTriggers.length > 0) {
        loadTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault(); 
                const targetUrl = this.getAttribute('href');

                pageLoader.classList.add('active');

                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 2000);
            });
        });
    }

    // 2. Loader para fugas de agua
    const waterTriggers = document.querySelectorAll('.water-loader-trigger, a[href="fuga-agua.html"]');
    const waterLeakLoader = document.getElementById('waterLeakLoader');

    if (waterLeakLoader && waterTriggers.length > 0) {
        waterTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault(); 
                const targetUrl = this.getAttribute('href');

                waterLeakLoader.classList.add('active');

                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 2000);
            });
        });
    }
    
    const lightPostTriggers = document.querySelectorAll('.light-post-loader-trigger, a[href="poste-luz.html"]');
    const lightPostLoader = document.getElementById('lightPostLoader');

    if (lightPostLoader && lightPostTriggers.length > 0) {
        lightPostTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                const targetUrl = this.getAttribute('href');

                lightPostLoader.classList.add('active');

                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 2000);
            });
        });
    }
});