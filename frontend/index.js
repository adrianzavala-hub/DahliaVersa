document.addEventListener("DOMContentLoaded", () => {
    // 1. Lógica del modal de Guía Rápida (Activado al hacer clic en el logo)
    const logoTrigger = document.getElementById('logoTrigger');
    const modalOverlay = document.getElementById('modalOverlay');
    const btnClose = document.getElementById('btnClose');

    if (logoTrigger) {
        logoTrigger.addEventListener('click', () => {
            document.body.classList.add('modal-active');
            if (modalOverlay) modalOverlay.classList.add('active');
        });
    }

    if (btnClose) {
        btnClose.addEventListener('click', () => {
            document.body.classList.remove('modal-active');
            if (modalOverlay) modalOverlay.classList.remove('active');
        });
    }

    window.showLoader = function() {};
    window.hideLoader = function() {};

    // 2. Animación de aparición de tarjetas estadísticas
    const statCards = document.querySelectorAll(".stat-card");
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add("visible");
        }, 300 + (index * 250));
    });

    // 3. Contadores dinámicos de las estadísticas
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

    // 4. Loaders de navegación (Baches, Fugas de Agua, Postes de Luz)
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

    // 5. Lógica del NUEVO Modal Independiente de Seguimiento con Flask API
    const seguimientoNavBtn = document.getElementById('seguimientoNavBtn');
    const modalSeguimiento = document.getElementById('modalSeguimiento');
    const btnCloseSeguimiento = document.getElementById('btnCloseSeguimiento');
    const btnConsultarSeguimiento = document.getElementById('btnConsultarSeguimiento');
    const body = document.body;

    if (seguimientoNavBtn && modalSeguimiento) {
        seguimientoNavBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modalSeguimiento.classList.add('active');
            body.classList.add('modal-active');
        });
    }

    if (btnCloseSeguimiento && modalSeguimiento) {
        btnCloseSeguimiento.addEventListener('click', () => {
            modalSeguimiento.classList.remove('active');
            body.classList.remove('modal-active');
        });
    }

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

    // Cierre general de modales al hacer clic fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('active');
            body.classList.remove('modal-active');
        }
        if (e.target.classList.contains('modal-overlay-seguimiento')) {
            e.target.classList.remove('active');
            body.classList.remove('modal-active');
        }
    });
});