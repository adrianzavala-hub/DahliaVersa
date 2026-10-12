document.addEventListener("DOMContentLoaded", () => {
    const logoTrigger = document.getElementById('logoTrigger');
    const modalOverlay = document.getElementById('modalOverlay');
    const btnClose = document.getElementById('btnClose');

    const seguimientoNavBtn = document.getElementById('seguimientoNavBtn');
    const modalSeguimiento = document.getElementById('modalSeguimiento');
    const btnCloseSeguimiento = document.getElementById('btnCloseSeguimiento');
    const btnConsultarSeguimiento = document.getElementById('btnConsultarSeguimiento');
    const body = document.body;

    // Asegurar estado inicial oculto
    if (modalOverlay) modalOverlay.style.display = 'none';
    if (modalSeguimiento) modalSeguimiento.style.display = 'none';

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

    // 1. ABRIR GUÍA RÁPIDA (Logo)
    if (logoTrigger && modalOverlay) {
        logoTrigger.addEventListener('click', () => {
            // Forzar cierre total del modal de seguimiento
            if (modalSeguimiento) {
                modalSeguimiento.classList.remove('active');
                modalSeguimiento.style.display = 'none';
            }

            body.classList.add('modal-active');
            createGlitchLamp();
            modalOverlay.style.display = 'flex';
            setTimeout(() => modalOverlay.classList.add('active'), 10);
        });
    }

    // CERRAR GUÍA RÁPIDA
    if (btnClose && modalOverlay) {
        btnClose.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
            body.classList.remove('modal-active');
            setTimeout(() => modalOverlay.style.display = 'none', 400);
        });
    }

    // 2. ABRIR SEGUIMIENTO (Navbar)
    if (seguimientoNavBtn && modalSeguimiento) {
        seguimientoNavBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Forzar cierre total del modal de guía rápida
            if (modalOverlay) {
                modalOverlay.classList.remove('active');
                modalOverlay.style.display = 'none';
            }

            modalSeguimiento.style.display = 'flex';
            setTimeout(() => modalSeguimiento.classList.add('active'), 10);
            body.classList.add('modal-active');
        });
    }

    // CERRAR SEGUIMIENTO
    if (btnCloseSeguimiento && modalSeguimiento) {
        btnCloseSeguimiento.addEventListener('click', () => {
            modalSeguimiento.classList.remove('active');
            body.classList.remove('modal-active');
            setTimeout(() => modalSeguimiento.style.display = 'none', 400);
        });
    }

    // Animación de aparición de estadísticas
    const statCards = document.querySelectorAll(".stat-card");
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add("visible");
        }, 300 + (index * 250));
    });

    // Contadores estadísticos
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

    // Loaders de navegación
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

    // Consulta API de Seguimiento
    if (btnConsultarSeguimiento) {
        btnConsultarSeguimiento.addEventListener('click', async () => {
            const tipo = document.getElementById('segTipo').value;
            const id = document.getElementById('segId').value.trim();
            const nombreIngresado = document.getElementById('segNombre').value.trim();
            const resultadoDiv = document.getElementById('segResultado');

            if (!id || !nombreIngresado) {
                alert("Por favor, ingresa el ID del reporte y tu nombre.");
                return;
            }

            try {
                const response = await fetch(`https://dahliaversa1.onrender.com/api/seguimiento/${tipo}/${id}`);
                const data = await response.json();

                if (response.ok) {
                    if (data.nombre.toLowerCase() === nombreIngresado.toLowerCase()) {
                        document.getElementById('resEstado').textContent = data.estado.toUpperCase();
                        document.getElementById('resNombre').textContent = data.nombre;
                        document.getElementById('resFecha').textContent = data.fecha;
                        document.getElementById('resObs').textContent = data.observacion_ia || 'Sin observaciones';
                        resultadoDiv.style.display = 'block';
                    } else {
                        alert("El nombre ingresado no coincide con el registro de este ID.");
                        resultadoDiv.style.display = 'none';
                    }
                } else {
                    alert("No se encontró ningún reporte con ese ID y tipo.");
                    resultadoDiv.style.display = 'none';
                }
            } catch (err) {
                console.error("Error al consultar seguimiento:", err);
                alert("Error de conexión con el servidor de la API.");
            }
        });
    }

    // Cierre al hacer clic fuera de los modales
    window.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
            body.classList.remove('modal-active');
            setTimeout(() => modalOverlay.style.display = 'none', 400);
        }
        if (e.target === modalSeguimiento) {
            modalSeguimiento.classList.remove('active');
            body.classList.remove('modal-active');
            setTimeout(() => modalSeguimiento.style.display = 'none', 400);
        }
    });
});