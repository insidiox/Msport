document.addEventListener('DOMContentLoaded', () => {
    // --- 1. VALIDACIÓN DINÁMICA DE HORARIO ---
    const statusBadge = document.getElementById('storeStatusBadge');
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = Domingo, 6 = Sábado

    const openHour = 9;
    const closeHour = 19; // 7 PM

    // Cerrado domingos de forma regular, abierto Lun-Sab 9am a 7pm
    if (currentDay !== 0 && currentHour >= openHour && currentHour < closeHour) {
        statusBadge.textContent = '🟢 Abierto ahora · Cierra a las 7:00 p.m.';
        statusBadge.className = 'status-badge open';
    } else {
        statusBadge.textContent = '🔴 Cerrado ahora · Abre a las 9:00 a.m.';
        statusBadge.className = 'status-badge closed';
    }

    // --- 2. PREVISUALIZACIÓN Y LOGICA DEL COTIZADOR ---
    const sportSelect = document.getElementById('sport');
    const quantityInput = document.getElementById('quantity');
    const previewText = document.getElementById('livePreviewText');
    const sendWhatsappBtn = document.getElementById('sendWhatsappBtn');
    const nameInput = document.getElementById('name');
    const deliverySelect = document.getElementById('delivery');
    const notesTextarea = document.getElementById('notes');

    function updatePreview() {
        previewText.textContent = `Resumen: Solicitud de ${quantityInput.value || 0} uniformes de ${sportSelect.value}.`;
    }

    sportSelect.addEventListener('change', updatePreview);
    quantityInput.addEventListener('input', updatePreview);

    // --- 3. REDIRECCIÓN DINÁMICA A API WHATSAPP ---
    sendWhatsappBtn.addEventListener('click', () => {
        if(!nameInput.value) {
            alert('Por favor ingresa tu nombre para personalizar el mensaje.');
            nameInput.focus();
            return;
        }

        const message = `Hola Deportes MSport, mi nombre es ${nameInput.value}. Me gustaría cotizar:\n\n` +
                        `- Deporte: ${sportSelect.value}\n` +
                        `- Cantidad: ${quantityInput.value} unidades\n` +
                        `- Entrega: ${deliverySelect.value}\n` +
                        `- Notas adicionales: ${notesTextarea.value || 'Ninguna'}\n\n` +
                        `Visto en su Landing Page oficial.`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/529981167552?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    });
});

const track = document.querySelector('.gallery-track');
const slides = document.querySelectorAll('.gallery-slide');
const nextBtn = document.querySelector('.gallery-btn.next');
const prevBtn = document.querySelector('.gallery-btn.prev');

let currentIndex = 0;

function getVisibleSlides() {
    if(window.innerWidth <= 768) return 1;
    if(window.innerWidth <= 992) return 2;
    return 3;
}

function updateGallery() {
    const visible = getVisibleSlides();
    const slideWidth = slides[0].offsetWidth + 20;

    track.style.transform =
        `translateX(-${currentIndex * slideWidth}px)`;
}

nextBtn.addEventListener('click', () => {
    const maxIndex = slides.length - getVisibleSlides();

    if(currentIndex < maxIndex){
        currentIndex++;
    }else{
        currentIndex = 0;
    }

    updateGallery();
});

prevBtn.addEventListener('click', () => {
    const maxIndex = slides.length - getVisibleSlides();

    if(currentIndex > 0){
        currentIndex--;
    }else{
        currentIndex = maxIndex;
    }

    updateGallery();
});

window.addEventListener('resize', updateGallery);

setInterval(() => {
    nextBtn.click();
}, 5000);

const statsBar = document.querySelector('.stats-bar');
const counters = document.querySelectorAll('.counter');

let animationStarted = false;

const observer = new IntersectionObserver((entries) => {

    if (entries[0].isIntersecting && !animationStarted) {

        animationStarted = true;

        counters.forEach(counter => {

            const target = parseFloat(counter.dataset.target);
            const suffix = counter.dataset.suffix || '';
            const duration = 2000;
            const startTime = performance.now();

            function animate(currentTime) {

                const progress = Math.min(
                    (currentTime - startTime) / duration,
                    1
                );

                const currentValue = target * progress;

                if (target % 1 !== 0) {
                    counter.textContent = currentValue.toFixed(1);
                } else {
                    counter.textContent = Math.floor(currentValue);
                }

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    counter.textContent = target + suffix;
                }
            }

            requestAnimationFrame(animate);

        });

        observer.unobserve(statsBar);
    }

}, {
    threshold: 0.3
});

observer.observe(statsBar);

const menuBtn = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.mobile-sidebar');
const overlay = document.querySelector('.mobile-menu-overlay');
const closeBtn = document.querySelector('.close-menu');

function closeMenu(){
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
}

menuBtn.addEventListener('click', () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
});

closeBtn.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);

document.querySelectorAll('.mobile-sidebar a').forEach(link => {
    link.addEventListener('click', closeMenu);
});