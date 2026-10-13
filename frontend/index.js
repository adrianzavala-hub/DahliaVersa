document.addEventListener("DOMContentLoaded", () => {
    const logoTrigger = document.getElementById('logoTrigger');
    const modalOverlay = document.getElementById('modalOverlay');
    const btnClose = document.getElementById('btnClose');

    const seguimientoNavBtn = document.getElementById('seguimientoNavBtn');
    const modalSeguimiento = document.getElementById('modalSeguimiento');
    const btnCloseSeguimiento = document.getElementById('btnCloseSeguimiento');
    const btnConsultarSeguimiento = document.getElementById('btnConsultarSeguimiento');
    const body = document.body;

    // Elementos para el nuevo modal de Mis Reportes
    const misReportesNavBtn = document.getElementById('misReportesNavBtn');
    const modalMisReportes = document.getElementById('modalMisReportes');
    const mrNicoBtnClose = document.getElementById('mrNicoBtnClose');
    const mrNicoBtnSearch = document.getElementById('mrNicoBtnSearch');

    // Asegurar estado inicial oculto
    if (modalOverlay) modalOverlay.style.display = 'none';
    if (modalSeguimiento) modalSeguimiento.style.display = 'none';
    if (modalMisReportes) modalMisReportes.style.display = 'none';

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
            if (modalSeguimiento) {
                modalSeguimiento.classList.remove('active');
                modalSeguimiento.style.display = 'none';
            }
            if (modalMisReportes) {
                modalMisReportes.classList.remove('active');
                modalMisReportes.style.display = 'none';
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

            if (modalOverlay) {
                modalOverlay.classList.remove('active');
                modalOverlay.style.display = 'none';
            }
            if (modalMisReportes) {
                modalMisReportes.classList.remove('active');
                modalMisReportes.style.display = 'none';
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

    // 3. ABRIR / CERRAR MODAL MIS REPORTES
    if (misReportesNavBtn && modalMisReportes) {
        misReportesNavBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (modalOverlay) { modalOverlay.classList.remove('active'); modalOverlay.style.display = 'none'; }
            if (modalSeguimiento) { modalSeguimiento.classList.remove('active'); modalSeguimiento.style.display = 'none'; }

            modalMisReportes.style.display = 'flex';
            setTimeout(() => modalMisReportes.classList.add('active'), 10);
            body.classList.add('modal-active');
        });
    }

    if (mrNicoBtnClose && modalMisReportes) {
        mrNicoBtnClose.addEventListener('click', () => {
            modalMisReportes.classList.remove('active');
            body.classList.remove('modal-active');
            setTimeout(() => modalMisReportes.style.display = 'none', 400);
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
            trigger.addEventListener('click', function (e) {
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
            trigger.addEventListener('click', function (e) {
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
            trigger.addEventListener('click', function (e) {
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
            const selectedCheck = document.querySelector('input[name="segTipoCheck"]:checked');
            const tipo = selectedCheck ? selectedCheck.value : null;

            const id = document.getElementById('segId').value.trim();
            const nombreIngresado = document.getElementById('segNombre').value.trim();
            const resultadoDiv = document.getElementById('segResultado');

            resultadoDiv.style.display = 'none';

            if (!tipo || !id || !nombreIngresado) {
                alert("Por favor, selecciona una incidencia, ingresa el ID y tu nombre.");
                return;
            }

            try {
                const url = `https://dahliaversa1.onrender.com/api/seguimiento/${tipo}/${id}`;
                const response = await fetch(url);
                const data = await response.json();

                if (response.ok && data) {
                    const nombreBD = (data.nombre || "").trim().toLowerCase();
                    const nombreUser = nombreIngresado.toLowerCase();

                    if (nombreBD === nombreUser) {
                        document.getElementById('resEstado').textContent = (data.estado || "Desconocido").toUpperCase();
                        document.getElementById('resNombre').textContent = data.nombre;
                        document.getElementById('resFecha').textContent = data.fecha || "No especificada";
                        document.getElementById('resObs').textContent = data.observacion_ia || 'Sin observaciones registradas';

                        resultadoDiv.style.display = 'block';
                    } else {
                        alert("El nombre ingresado no coincide exactamente con el registro de este ID.");
                    }
                } else {
                    alert("No se encontró ningún reporte con ese ID y tipo de incidencia.");
                }
            } catch (err) {
                console.error("Error al consultar seguimiento:", err);
                alert("Error de conexión con el servidor de la API.");
            }
        });
    }

    // Lógica API para Buscar Mis Reportes por Nombre
    if (mrNicoBtnSearch) {
        mrNicoBtnSearch.addEventListener('click', async () => {
            const nombreIngresado = document.getElementById('mrNicoInputName').value.trim();
            const resultsBox = document.getElementById('mrNicoResultsBox');

            if (!nombreIngresado) {
                alert("Por favor, ingresa tu nombre registrado.");
                return;
            }

            try {
                const url = `https://dahliaversa1.onrender.com/api/reportes?nombre=${encodeURIComponent(nombreIngresado)}`;
                const response = await fetch(url);
                const data = await response.json();

                if (response.ok && data && data.length > 0) {
                    const subtitle = resultsBox.querySelector('.mr-nico-subtitle');
                    resultsBox.innerHTML = '';
                    resultsBox.appendChild(subtitle);

                    data.forEach(rep => {
                        const estadoClase = (rep.estado || "").toLowerCase().includes("resuelto") ? "mr-badge-done" : "mr-badge-process";

                        const itemCard = document.createElement('div');
                        itemCard.className = 'mr-nico-item';
                        itemCard.innerHTML = `
                            <div class="mr-nico-row">
                                <span class="mr-nico-type">${rep.tipo || 'Incidencia'}</span>
                                <span class="mr-nico-badge ${estadoClase}">${(rep.estado || "En Proceso").toUpperCase()}</span>
                            </div>
                            <span class="mr-nico-date">Fecha: ${rep.fecha || "No especificada"}</span>
                        `;
                        resultsBox.appendChild(itemCard);
                    });

                    resultsBox.style.display = 'flex';
                } else {
                    alert("No se encontraron reportes asociados a este nombre.");
                    resultsBox.style.display = 'none';
                }
            } catch (err) {
                console.error("Error al buscar reportes del usuario:", err);
                alert("Error de conexión al consultar los reportes.");
            }
        });
    }

    // Cierre global al hacer clic fuera de los modales
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
        if (e.target === modalMisReportes) {
            modalMisReportes.classList.remove('active');
            body.classList.remove('modal-active');
            setTimeout(() => modalMisReportes.style.display = 'none', 400);
        }
    });

    // ==========================================================
    // LÓGICA AVANZADA DEL BUSCADOR, MAPA EN TIEMPO REAL Y MODAL
    // ==========================================================
    const searchInput = document.querySelector(".hero-search-input");
    const searchBtn = document.querySelector(".hero-search-btn");
    const searchContainer = document.querySelector(".hero-search-container");
    const modalLocationReport = document.getElementById("modalLocationReport");
    const locationText = document.getElementById("mrSelectedLocationText");
    const btnCloseModal = document.getElementById("mrBtnCloseModal");
    const btnSubmitReport = document.getElementById("mrBtnSubmitReport");

    // Variables globales para el mapa de Leaflet
    let modalMap = null;
    let modalMarker = null;

    if (modalLocationReport) modalLocationReport.style.display = 'none';

    const baseUbicaciones = [
        "Centro, Zumpango",
        "Barrio de San Pedro",
        "Barrio de San Juan",
        "Paseos de San Juan",
        "Hacienda de Piedras Negras",
        "Fraccionamiento Los Encinos",
        "Avenida Hidalgo",
        "Boulevard Melchor Ocampo",
        "Calle Morelos",
        "San Bartolo Cuautlalpan"
    ];

    let suggestionsBox = document.querySelector(".mr-suggestions-box");
    if (!suggestionsBox && searchContainer) {
        suggestionsBox = document.createElement("div");
        suggestionsBox.className = "mr-suggestions-box";
        searchContainer.appendChild(suggestionsBox);
    }

    function initModalMap(lat = 19.7942, lon = -99.1024) {
        const mapContainer = document.getElementById('mapModal');
        if (!mapContainer || typeof L === 'undefined') return;

        // Definir el icono personalizado con el círculo parpadeante
        const pulsingIcon = L.divIcon({
            className: 'custom-div-icon',
            html: '<div class="dv-pulsing-marker"></div>',
            iconSize: [22, 22],
            iconAnchor: [11, 11]
        });

        if (modalMap) {
            modalMap.setView([lat, lon], 15);
            if (modalMarker) {
                modalMarker.setLatLng([lat, lon]);
            } else {
                modalMarker = L.marker([lat, lon], { draggable: true, icon: pulsingIcon }).addTo(modalMap);
            }
            setTimeout(() => modalMap.invalidateSize(), 250);
            return;
        }

        modalMap = L.map('mapModal', {
            zoomControl: false
        }).setView([lat, lon], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(modalMap);

        // Añadir el marcador con el icono intermitente
        modalMarker = L.marker([lat, lon], { draggable: true, icon: pulsingIcon }).addTo(modalMap);

        modalMarker.on('dragend', function (event) {
            const position = modalMarker.getLatLng();
            const latLongInput = document.getElementById('latLongInput');
            if (latLongInput) {
                latLongInput.value = `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`;
            }
        });

        setTimeout(() => modalMap.invalidateSize(), 250);
    }

    function abrirModalUbicacion(ubicacion) {
        if (ubicacion.trim() !== "") {
            if (locationText) locationText.textContent = `Ubicación: "${ubicacion}"`;

            if (modalLocationReport) {
                modalLocationReport.style.display = "flex";
                setTimeout(() => {
                    modalLocationReport.classList.add('active');
                    initModalMap();
                }, 100);
                body.classList.add('modal-active');
            }
            if (suggestionsBox) suggestionsBox.style.display = "none";
        }
    }

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!suggestionsBox) return;
            suggestionsBox.innerHTML = "";

            if (query.length === 0) {
                suggestionsBox.style.display = "none";
                return;
            }

            const coincidencias = baseUbicaciones.filter(ubi => ubi.toLowerCase().includes(query));

            if (coincidencias.length > 0) {
                coincidencias.forEach(item => {
                    const div = document.createElement("div");
                    div.className = "mr-suggestion-item";
                    div.textContent = item;

                    div.addEventListener("click", () => {
                        searchInput.value = item;
                        abrirModalUbicacion(item);
                    });

                    suggestionsBox.appendChild(div);
                });
                suggestionsBox.style.display = "block";
            } else {
                suggestionsBox.style.display = "none";
            }
        });

        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                if (suggestionsBox) suggestionsBox.style.display = "none";
                abrirModalUbicacion(searchInput.value);
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            if (suggestionsBox) suggestionsBox.style.display = "none";
            abrirModalUbicacion(searchInput.value);
        });
    }

    document.addEventListener("click", (e) => {
        if (searchContainer && !searchContainer.contains(e.target)) {
            if (suggestionsBox) suggestionsBox.style.display = "none";
        }
    });

    if (btnCloseModal && modalLocationReport) {
        btnCloseModal.addEventListener("click", () => {
            modalLocationReport.classList.remove('active');
            body.classList.remove('modal-active');
            setTimeout(() => modalLocationReport.style.display = 'none', 350);
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modalLocationReport) {
            modalLocationReport.classList.remove('active');
            body.classList.remove('modal-active');
            setTimeout(() => modalLocationReport.style.display = 'none', 350);
        }
    });

    if (btnSubmitReport) {
        btnSubmitReport.addEventListener("click", () => {
            const citizenName = document.getElementById("mrInputName").value.trim();
            const description = document.getElementById("regReferences").value.trim();
            const locationQuery = searchInput.value.trim();

            const selectedCheckboxes = document.querySelectorAll('input[name="tipo_reporte"]:checked');
            const filtersArray = Array.from(selectedCheckboxes).map(cb => cb.value);

            if (!citizenName) {
                alert("Por favor ingresa tu nombre completo.");
                return;
            }

            if (filtersArray.length === 0) {
                alert("Selecciona al menos un tipo de incidencia.");
                return;
            }

            const reportPayload = {
                ubicacion: locationQuery,
                nombre: citizenName,
                categorias_filtro: filtersArray,
                descripcion: description,
                fecha: new Date().toISOString()
            };

            console.log("Enviando reporte a la BD:", reportPayload);

            alert(`¡Reporte registrado con éxito!\n\nUbicación: ${locationQuery}\nTipos seleccionados: ${filtersArray.join(", ")}`);

            if (modalLocationReport) {
                modalLocationReport.classList.remove('active');
                body.classList.remove('modal-active');
                setTimeout(() => modalLocationReport.style.display = 'none', 350);
            }
            if (searchInput) searchInput.value = "";
            const formReport = document.getElementById("mrReportForm");
            if (formReport) formReport.reset();
        });
    }

    // ==========================================================
    // LÓGICA DE INICIO DE SESIÓN DE EMPRESA (VALIDACIÓN DE DB)
    // ==========================================================
    const dvCompModal = document.getElementById('dvCompRegisterModal');
    const dvCloseCompModalBtn = document.getElementById('dvCloseCompModal');
    const dvCompRegisterForm = document.getElementById('dvCompRegisterForm');

    function openCompanyRegisterModal() {
        if (dvCompModal) {
            dvCompModal.classList.add('active');
        }
    }

    function closeCompanyRegisterModal() {
        if (dvCompModal) {
            dvCompModal.classList.remove('active');
        }
    }

    if (dvCloseCompModalBtn) {
        dvCloseCompModalBtn.addEventListener('click', closeCompanyRegisterModal);
    }

    if (dvCompModal) {
        dvCompModal.addEventListener('click', (e) => {
            if (e.target === dvCompModal) {
                closeCompanyRegisterModal();
            }
        });
    }

    // Procesar Inicio de Sesión contra la Base de Datos
    if (dvCompRegisterForm) {
        dvCompRegisterForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const usuarioInput = document.getElementById('dvCompUsuario').value.trim();
            const passwordInput = document.getElementById('dvCompPassword').value.trim();

            const credentials = {
                usuario: usuarioInput,
                password: passwordInput
            };

            try {
                const response = await fetch('https://dahliaversa1.onrender.com/api/login-empresa', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(credentials)
                });

                const result = await response.json();

                if (response.ok) {
                    alert("🎉 ¡Inicio de sesión exitoso! Redirigiendo al panel de la empresa...");
                    dvCompRegisterForm.reset();
                    closeCompanyRegisterModal();
                    // Redirige a la página de la empresa
                    window.location.href = 'empresa-dashboard.html';
                } else {
                    alert(`⚠️ Error de acceso: ${result.message || 'Usuario o contraseña incorrectos.'}`);
                }
            } catch (error) {
                console.error("Error al conectar con el servidor:", error);
                alert("No se pudo conectar con el servidor de autenticación.");
            }
        });
    }

    const accessNavBtn = document.getElementById('accessNavBtn');
    if (accessNavBtn) {
        accessNavBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCompanyRegisterModal();
        });
    }
});