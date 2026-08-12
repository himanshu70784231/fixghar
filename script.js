// ==========================================
// 1. MODAL & BOOKING FORM HANDLING
// ==========================================
const modal = document.getElementById('bookingModal');
const bookingForm = document.getElementById('bookingForm');

function openModal() {
    if(modal) modal.classList.remove('hidden');
}

function closeModal() {
    if(modal) {
        modal.classList.add('hidden');
        if(bookingForm) bookingForm.reset();
        
        // Reset phone styling if exists
        const phoneInput = bookingForm?.querySelector('input[type="tel"]');
        if(phoneInput) {
            phoneInput.classList.add('border-gray-200', 'focus:ring-brand-green/20', 'focus:border-brand-green');
            phoneInput.classList.remove('border-red-500', 'focus:ring-red-500/20', 'focus:border-red-500');
        }
    }
}

// Close modal when clicking outside of it
if (modal) {
    modal.addEventListener('click', (e) => {
        if(e.target === modal) closeModal();
    });
}

// Open Modal and Pre-select Service based on Card Click
function setupServiceCards() {
    const cards = document.querySelectorAll('.tilt-card');
    const select = bookingForm ? bookingForm.querySelector('select') : null;

    cards.forEach(card => {
        card.addEventListener('click', () => {
            if(!select) return;
            const serviceTitle = card.querySelector('h3').innerText.toLowerCase().replace(' ', '-');
            
            // Pre-select the service in the dropdown
            Array.from(select.options).forEach(option => {
                if(option.value === serviceTitle || option.value.includes(serviceTitle.split('-')[0])) {
                    option.selected = true;
                }
            });
            openModal();
        });
    });
}

// Form Submission & Validation
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const phoneInput = bookingForm.querySelector('input[type="tel"]');
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        
        // Basic Phone Validation (Strip spaces, check length)
        let isValid = true;
        if(phoneInput) {
            const numericValue = phoneInput.value.replace(/\D/g, '');
            isValid = numericValue.length === 10 || (numericValue.length === 12 && numericValue.startsWith('91'));
            
            if (!isValid) {
                phoneInput.classList.remove('border-gray-200', 'focus:ring-brand-green/20', 'focus:border-brand-green');
                phoneInput.classList.add('border-red-500', 'focus:ring-red-500/20', 'focus:border-red-500');
                phoneInput.focus();
                alert("Please enter a valid 10-digit phone number.");
                return;
            } else {
                phoneInput.classList.add('border-gray-200', 'focus:ring-brand-green/20', 'focus:border-brand-green');
                phoneInput.classList.remove('border-red-500', 'focus:ring-red-500/20', 'focus:border-red-500');
            }
        }

        if(isValid && submitBtn) {
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Confirming...';
            submitBtn.classList.add('opacity-80', 'cursor-not-allowed');
            
            // Simulate API Call
            setTimeout(() => {
                alert('Success! Your booking has been confirmed. An expert will contact you shortly.');
                closeModal();
                submitBtn.innerHTML = originalText;
                submitBtn.classList.remove('opacity-80', 'cursor-not-allowed');
            }, 1200);
        }
    });
}


// ==========================================
// 2. SEARCH BAR & AUTO-TYPING
// ==========================================
function handleSearch() {
    const searchInput = document.getElementById('serviceSearch');
    if (!searchInput) return;
    
    const query = searchInput.value.toLowerCase();
    if(query.trim() === '') return;
    
    // Scroll to services
    const servicesSection = document.getElementById('services');
    if (servicesSection) servicesSection.scrollIntoView({ behavior: 'smooth' });
    
    // Highlight effect
    setTimeout(() => {
        alert(`Looking for "${query}"? Browse our professional services below and click a card to book!`);
        searchInput.value = '';
    }, 500);
}

function setupTypewriterEffect() {
    const searchInput = document.getElementById('serviceSearch');
    if (!searchInput) return;

    const phrases = [
        "Search for AC repair...",
        "Search for Plumber...",
        "Search for Deep Cleaning...",
        "Search for Electrician...",
        "Search for Painting..."
    ];
    
    let phraseIndex = 0;
    let letterIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            searchInput.setAttribute('placeholder', currentPhrase.substring(0, letterIndex - 1));
            letterIndex--;
            typingSpeed = 50;
        } else {
            searchInput.setAttribute('placeholder', currentPhrase.substring(0, letterIndex + 1));
            letterIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && letterIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 1500;
        } else if (isDeleting && letterIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }
        setTimeout(type, typingSpeed);
    }
    setTimeout(type, 1000);
}


// ==========================================
// 3. PRICE ESTIMATOR LOGIC
// ==========================================
function setupPriceEstimator() {
    const serviceSelect = document.getElementById('calc-service');
    const taskSelect = document.getElementById('calc-task');
    const resultDisplay = document.getElementById('calc-result');

    if (!serviceSelect || !taskSelect || !resultDisplay) return;

    const pricingData = {
        'plumbing': {
            'leak': { name: 'Fix Leaking Pipe', price: '₹299 - ₹499' },
            'tap': { name: 'New Tap Installation', price: '₹199 - ₹349' },
            'blockage': { name: 'Clear Drain Blockage', price: '₹399 - ₹699' }
        },
        'ac-repair': {
            'service': { name: 'General AC Servicing', price: '₹499 - ₹699' },
            'gas': { name: 'AC Gas Refilling', price: '₹1,499 - ₹1,999' },
            'pcb': { name: 'PCB Repair', price: '₹1,200 - ₹2,500' }
        },
        'cleaning': {
            'bathroom': { name: 'Bathroom Deep Clean', price: '₹399 - ₹599' },
            'sofa': { name: 'Sofa Dry Cleaning (3 Seater)', price: '₹699 - ₹899' },
            'fullhome': { name: 'Full Home Clean (2BHK)', price: '₹2,499 - ₹3,499' }
        },
        'electrical': {
            'fan': { name: 'Ceiling Fan Repair/Install', price: '₹149 - ₹299' },
            'switchboard': { name: 'Switchboard Fixing', price: '₹99 - ₹249' },
            'mcb': { name: 'MCB Replacement', price: '₹299 - ₹499' }
        }
    };

    serviceSelect.addEventListener('change', function() {
        const selectedService = this.value;
        const tasks = pricingData[selectedService];
        
        taskSelect.disabled = false;
        taskSelect.innerHTML = '<option value="" disabled selected>Select the specific task...</option>';
        resultDisplay.innerText = '₹0';

        for (const [taskKey, taskData] of Object.entries(tasks)) {
            const option = document.createElement('option');
            option.value = taskKey;
            option.innerText = taskData.name;
            taskSelect.appendChild(option);
        }
    });

    taskSelect.addEventListener('change', function() {
        const selectedService = serviceSelect.value;
        const selectedTask = this.value;
        
        if(pricingData[selectedService] && pricingData[selectedService][selectedTask]) {
            const price = pricingData[selectedService][selectedTask].price;
            
            resultDisplay.style.opacity = '0';
            setTimeout(() => {
                resultDisplay.innerText = price;
                resultDisplay.style.opacity = '1';
            }, 200);
        }
    });
}


// ==========================================
// 4. UI/UX ENHANCEMENTS
// ==========================================
function setupSmoothScrolling() {
    document.querySelectorAll('header nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function setupWhatsApp() {
    const waLink = document.querySelector('.fa-whatsapp')?.parentElement;
    if(waLink) {
        waLink.addEventListener('click', (e) => {
            e.preventDefault();
            const phoneNumber = "7078423155"; 
            const message = encodeURIComponent("Hi Fix A Ghar team! I need some help with home services.");
            window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
        });
    }
}

function setupTiltCards() {
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            card.style.transition = 'transform 0.5s ease';
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });
}


// ==========================================
// 5. ADVANCED 3D PREVIEW (Three.js)
// ==========================================
function initThreeJS() {
    const container = document.getElementById('three-container');
    const overlay = document.getElementById('three-overlay'); // Make sure you added this in HTML
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 400;
    
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 2, 12);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Materials
    const matBroken = new THREE.MeshBasicMaterial({ color: 0xff4444, wireframe: true });
    const matFixed = new THREE.MeshPhongMaterial({ color: 0x2563EB, flatShading: true });
    const matWater = new THREE.MeshPhongMaterial({ color: 0x0ea5e9, flatShading: true, transparent: true, opacity: 0.8 });
    const matElectric = new THREE.MeshPhongMaterial({ color: 0xf59e0b, flatShading: true });
    const matClean = new THREE.MeshPhongMaterial({ color: 0x10b981, flatShading: true });
    const matAC = new THREE.MeshPhongMaterial({ color: 0x06b6d4, flatShading: true });

    // Models
    const models = {};

    // 1. Broken House
    const brokenHouse = new THREE.Group();
    brokenHouse.add(new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), matBroken));
    const roof1 = new THREE.Mesh(new THREE.ConeGeometry(2.5, 2, 4), matBroken);
    roof1.position.y = 2.5; roof1.rotation.y = Math.PI / 4; roof1.rotation.z = 0.2;
    brokenHouse.add(roof1);
    models['broken'] = brokenHouse;

    // 2. Fixed House
    const fixedHouse = new THREE.Group();
    const box2 = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), matFixed);
    box2.position.y = -0.5;
    fixedHouse.add(box2);
    const roof2 = new THREE.Mesh(new THREE.ConeGeometry(2.5, 2, 4), matFixed);
    roof2.position.y = 2; roof2.rotation.y = Math.PI / 4;
    fixedHouse.add(roof2);
    models['fixed'] = fixedHouse;

    // 3. Plumbing (Water Drop)
    const plumbing = new THREE.Group();
    const drop = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 16), matWater);
    const dropTop = new THREE.Mesh(new THREE.ConeGeometry(1.5, 2.5, 16), matWater);
    dropTop.position.y = 1.2;
    plumbing.add(drop); plumbing.add(dropTop);
    models['plumbing'] = plumbing;

    // 4. Electrical
    const electrical = new THREE.Mesh(new THREE.OctahedronGeometry(2, 0), matElectric);
    models['electrical'] = electrical;

    // 5. Cleaning
    const cleaning = new THREE.Group();
    const b1 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), matClean); b1.position.set(-1, -1, 0);
    const b2 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 16), matClean); b2.position.set(1, -0.5, 0.5);
    const b3 = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), matClean); b3.position.set(0, 1.2, -0.5);
    cleaning.add(b1); cleaning.add(b2); cleaning.add(b3);
    models['cleaning'] = cleaning;

    // 6. AC Repair
    const ac = new THREE.Mesh(new THREE.TorusKnotGeometry(1.2, 0.4, 64, 8), matAC);
    models['ac repair'] = ac;

    // Fallback
    const generic = new THREE.Mesh(new THREE.DodecahedronGeometry(2), matFixed);
    models['generic'] = generic;

    // Logic States
    let currentMesh = models['broken'];
    let targetMesh = null;
    let isFixed = false;
    
    mainGroup.add(currentMesh);

    function animate() {
        requestAnimationFrame(animate);
        
        mainGroup.rotation.y += 0.005;
        if(currentMesh === ac) mainGroup.rotation.z += 0.01;

        if (targetMesh) {
            mainGroup.scale.lerp(new THREE.Vector3(0.01, 0.01, 0.01), 0.15);
            if (mainGroup.scale.x < 0.05) {
                mainGroup.remove(currentMesh);
                currentMesh = targetMesh;
                mainGroup.add(currentMesh);
                targetMesh = null;
            }
        } else {
            mainGroup.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        }

        renderer.render(scene, camera);
    }
    animate();

    // Click to Fix
    container.addEventListener('click', () => {
        if (!isFixed) {
            isFixed = true;
            targetMesh = models['fixed'];
            if(overlay) overlay.style.opacity = '0';
            mainGroup.rotation.y += Math.PI * 2; 
        }
    });

    // Hover Sync
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!isFixed) return; 
            const serviceName = card.querySelector('h3').innerText.toLowerCase();
            targetMesh = models[serviceName] || models['generic'];
        });
        
        card.addEventListener('mouseleave', () => {
            if (isFixed) targetMesh = models['fixed'];
        });
    });

    window.addEventListener('resize', () => {
        if(container.clientWidth > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });
}

// ==========================================
// 6. INITIALIZE EVERYTHING ON LOAD
// ==========================================
window.addEventListener('load', () => {
    initThreeJS();
    setupTypewriterEffect();
    setupPriceEstimator();
    setupServiceCards();
    setupSmoothScrolling();
    setupWhatsApp();
    setupTiltCards();
    setupBreakAndFix();
    // ==========================================
// 7. CRAZY FEATURE: BREAK & FIX GRAVITY EFFECT
// ==========================================
function setupBreakAndFix() {
    // 1. CSS Animations ko JS se inject karna
    const style = document.createElement('style');
    style.innerHTML = `
        .gravity-fall {
            transition: transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
        }
        .shake-screen {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
            10%, 90% { transform: translate3d(-4px, 4px, 0); }
            20%, 80% { transform: translate3d(6px, -4px, 0); }
            30%, 50%, 70% { transform: translate3d(-8px, 6px, 0); }
            40%, 60% { transform: translate3d(8px, -6px, 0); }
        }
        #emergency-fix-btn {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            z-index: 99999;
            transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        #emergency-fix-btn.show {
            transform: translate(-50%, -50%) scale(1);
        }
        #mechanic-hammer {
            position: fixed;
            bottom: -150px;
            right: -150px;
            font-size: 6rem;
            z-index: 100000;
            transition: all 0.5s ease-in-out;
            transform-origin: bottom right;
            transform: rotate(0deg);
            filter: drop-shadow(5px 5px 10px rgba(0,0,0,0.5));
        }
    `;
    document.head.appendChild(style);

    // 2. Emergency "Fix" Button banana
    const fixBtn = document.createElement('button');
    fixBtn.id = 'emergency-fix-btn';
    fixBtn.className = 'bg-red-600 text-white font-black text-2xl md:text-4xl px-8 py-6 rounded-3xl shadow-[0_0_40px_rgba(220,38,38,0.8)] border-4 border-white flex flex-col items-center space-y-2 hover:bg-red-700 hover:scale-110 transition-all cursor-pointer';
    fixBtn.innerHTML = `
        <i class="fa-solid fa-triangle-exclamation text-5xl animate-bounce"></i> 
        <span>PROBLEM HUI</span>
        <span class="text-sm font-normal bg-white text-red-600 px-3 py-1 rounded-full mt-2">Fix ghar hai na</span>
    `;
    document.body.appendChild(fixBtn);

    // 3. Mechanic ka Hathoda (Hammer) banana
    const hammer = document.createElement('div');
    hammer.id = 'mechanic-hammer';
    hammer.innerHTML = '🔨';
    document.body.appendChild(hammer);

    let isBroken = false;

    // 4. Website ko 5 Second baad "Todna" (Break)
    setTimeout(() => {
        isBroken = true;
        
        // Website ke main elements ko select karna
        const elementsToBreak = document.querySelectorAll('.tilt-card, h1, h2, header, #three-container, #solution');
        
        elementsToBreak.forEach(el => {
            el.classList.add('gravity-fall');
            // Random degrees aur neeche girne ka effect
            const randomRot = (Math.random() * 20) - 10; // -10 to +10 degrees
            const randomY = (Math.random() * 40) + 20;   // 20px to 60px drop
            el.style.transform = `rotate(${randomRot}deg) translateY(${randomY}px)`;
        });

        // 1 second baad bada sa Emergency button dikhana
        setTimeout(() => {
            fixBtn.classList.add('show');
        }, 1000);

    }, 2000); // Load hone ke exactly 5 seconds baad

    // 5. Jab user button par click kare toh "Fix" karna
    fixBtn.addEventListener('click', () => {
        if(!isBroken) return;
        
        // Button ko wapas gayab karo
        fixBtn.classList.remove('show');
        
        // Hathoda (Hammer) screen ke beech me aayega
        hammer.style.bottom = '40%';
        hammer.style.right = '45%';
        hammer.style.transform = 'rotate(-60deg)'; // Peeche ki taraf swing
        
        setTimeout(() => {
            // BAM! Hathoda marta hai
            hammer.style.transform = 'rotate(30deg)'; 
            
            setTimeout(() => {
                // Screen shake effect
                document.body.classList.add('shake-screen');
                
                // Saare elements ko wapas apni jagah par lana
                const elementsToFix = document.querySelectorAll('.gravity-fall');
                elementsToFix.forEach(el => {
                    el.style.transform = ''; // Reset CSS
                    setTimeout(() => {
                        el.classList.remove('gravity-fall'); 
                    }, 800);
                });

                isBroken = false;
                
                // 1 second baad hammer wapas chala jayega aur ek message aayega
                setTimeout(() => {
                    hammer.style.bottom = '-150px';
                    hammer.style.right = '-150px';
                    document.body.classList.remove('shake-screen');
                    
                    // Ek cool success alert
                    setTimeout(() => {
                        alert("Phew! Fix A Ghar fixes EVERYTHING! 🛠️😉 Thanks for calling us!");
                    }, 500);

                }, 800);

            }, 150); // Swing speed
        }, 500); // Hammer travel time
    });
}
});