// Language Toggle
let currentLang = 'zh';

const langToggle = document.getElementById('langToggle');
const langElements = document.querySelectorAll('[data-en][data-zh]');

function toggleLanguage() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    updateLanguage();
    // Update aria-pressed for accessibility
    if (langToggle) {
        langToggle.setAttribute('aria-pressed', currentLang === 'en' ? 'true' : 'false');
    }
}

function updateLanguage() {
    langElements.forEach(element => {
        const text = currentLang === 'zh' ? element.getAttribute('data-zh') : element.getAttribute('data-en');
        
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = text;
        } else if (element.classList.contains('lang-text')) {
            element.textContent = currentLang === 'zh' ? '中文' : 'EN';
        } else {
            element.textContent = text;
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
}

langToggle.addEventListener('click', toggleLanguage);
langToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleLanguage();
    }
});

// Navbar search with results dropdown
const navSearchForm = document.getElementById('navSearchForm');
const navSearchInput = document.getElementById('navSearchInput');
const searchResults = document.getElementById('searchResults');

function performSearch(term) {
    if (!term) {
        hideSearchResults();
        return;
    }

    const sections = Array.from(document.querySelectorAll('section'));
    const matches = sections.filter(section => {
        const heading = section.querySelector('.section-title, .hero-title, h1, h2, h3');
        const headingText = heading ? heading.textContent.toLowerCase() : '';
        const sectionId = section.id ? section.id.toLowerCase() : '';
        
        return headingText.includes(term) || sectionId.includes(term);
    }).map(section => {
        const heading = section.querySelector('.section-title, .hero-title, h1, h2, h3');
        return {
            element: section,
            title: heading ? heading.textContent.trim() : 'Section',
            id: section.id || 'unknown'
        };
    });

    displaySearchResults(matches);
}

function displaySearchResults(matches) {
    if (!searchResults) return;

    if (matches.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results" data-en="No results found" data-zh="未找到结果">未找到结果</div>';
        searchResults.classList.add('show');
        updateLanguage();
        return;
    }

    searchResults.innerHTML = matches.map(match => `
        <div class="search-result-item" data-section-id="${match.id}">
            <div class="search-result-title">${match.title}</div>
            <div class="search-result-section">${match.id}</div>
        </div>
    `).join('');

    searchResults.classList.add('show');

    // Add click handlers
    searchResults.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.getAttribute('data-section-id');
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                section.setAttribute('tabindex', '-1');
                section.focus({ preventScroll: true });
                
                // Visual feedback
                section.style.transition = 'background-color 0.5s ease';
                const originalBg = section.style.backgroundColor;
                section.style.backgroundColor = 'rgba(37, 99, 235, 0.05)';
                setTimeout(() => {
                    section.style.backgroundColor = originalBg;
                }, 1500);
            }
            hideSearchResults();
            navSearchInput.value = '';
            navSearchInput.blur();
        });
    });
}

function hideSearchResults() {
    if (searchResults) {
        searchResults.classList.remove('show');
    }
}

function handleNavSearch(event) {
    event.preventDefault();
    if (!navSearchInput) return;
    const term = navSearchInput.value.trim().toLowerCase();
    performSearch(term);
}

// Real-time search as user types
if (navSearchInput) {
    navSearchInput.addEventListener('input', (e) => {
        const term = e.target.value.trim().toLowerCase();
        performSearch(term);
    });
    
    // Hide results when input loses focus (with delay for click handling)
    navSearchInput.addEventListener('blur', () => {
        setTimeout(hideSearchResults, 200);
    });
}

if (navSearchForm) {
    navSearchForm.addEventListener('submit', handleNavSearch);
}

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    if (!navSearchInput?.contains(e.target) && !searchResults?.contains(e.target)) {
        hideSearchResults();
    }
});

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update scroll progress
    if (scrollProgress) {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (currentScroll / windowHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
    }
    
    // Update active navigation link
    updateActiveNavLink();
    
    lastScroll = currentScroll;
});

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Update focus for accessibility
            target.setAttribute('tabindex', '-1');
            target.focus();
        }
    });
    
    // Keyboard navigation support
    anchor.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            anchor.click();
        }
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// 3D Model Loading with Three.js
let scene, camera, renderer, model, controls;
// Base orientation to correct 'facing up' exports (adjust if needed)
// Pitch down 90° to align model upright; yaw/roll neutral.
const BASE_ORIENTATION = { x: -Math.PI / 2, y: 0, z: 0 };
const modelContainer = document.getElementById('modelContainer');
const modelCanvas = document.getElementById('modelCanvas');
const modelLoading = document.getElementById('modelLoading');

function initThreeJS() {
    // Check if container exists and has valid dimensions
    if (!modelContainer || !modelCanvas) {
        console.error('Model container or canvas not found');
        if (modelLoading) {
            modelLoading.style.display = 'none';
        }
        return;
    }
    
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f9ff);
    
    // Camera setup - protect against division by zero
    const width = modelContainer.clientWidth || 800;
    const height = modelContainer.clientHeight || 600;
    const aspect = height > 0 ? width / height : 1;
    
    camera = new THREE.PerspectiveCamera(
        75,
        aspect,
        0.1,
        1000
    );
    camera.position.set(0, 0, 5);
    
    // Renderer setup
    try {
        renderer = new THREE.WebGLRenderer({
            canvas: modelCanvas,
            antialias: true,
            alpha: true
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
        console.log('Renderer initialized with size:', { width, height });
    } catch (error) {
        console.error('Failed to initialize WebGL renderer:', error);
        if (modelLoading) {
            const loadingText = modelLoading.querySelector('span');
            if (loadingText) {
                loadingText.textContent = currentLang === 'zh' 
                    ? '浏览器不支持WebGL' 
                    : 'WebGL not supported';
            }
        }
        return;
    }
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);
    
    // Controls (interactive orbit/pan/zoom)
    setupOrbitControls();

    // Load 3D Model
    loadModel();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation loop
    animate();
}

function loadModel() {
    // Wait for GLTFLoader to be available
    const checkLoader = () => {
        const GLTFLoader = THREE?.GLTFLoader || window?.GLTFLoader;
        
        if (GLTFLoader) {
            console.log('Loading GLB model...');
            const gltfLoader = new GLTFLoader();
            loadGLBFile(gltfLoader);
        } else {
            setTimeout(checkLoader, 100);
        }
    };
    
    checkLoader();
}

function loadGLBFile(gltfLoader) {
    // Encode spaces and special chars in URL path
    const glbPath = encodeURI('assets/3d model/model.glb');
    console.log('Resolved GLB path:', glbPath);
    
    // Warn if running from file:// which blocks XHR requests used by GLTFLoader
    if (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:') {
        console.warn('Serving over file:// detected. GLB loading requires an HTTP server.');
        if (modelLoading) {
            const loadingText = modelLoading.querySelector('span');
            if (loadingText) {
                loadingText.textContent = currentLang === 'zh'
                    ? '需要通过本地服务器打开页面以加载模型'
                    : 'Please use a local server to load the model';
            }
        }
    }
    
    // Set a timeout for large files (30 seconds for GLB files)
    const loadTimeout = setTimeout(() => {
        console.error('Model loading timeout after 30s, using fallback');
        createFallbackModel();
        if (modelLoading) {
            modelLoading.style.display = 'none';
        }
    }, 30000);
    
    // Load GLB model
    gltfLoader.load(
            glbPath,
            (gltf) => {
                clearTimeout(loadTimeout);
                
                const loadedModel = gltf.scene;
                console.log('GLB loaded. Children count:', loadedModel.children?.length || 0);
                // Compute bounding box and center the model at origin
                const box = new THREE.Box3().setFromObject(loadedModel);
                const center = box.getCenter(new THREE.Vector3());
                loadedModel.position.sub(center); // center at origin
                // Recompute size after centering
                box.setFromObject(loadedModel);
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 4.5 / maxDim; // fit within ~4.5 units for better presence
                loadedModel.scale.setScalar(scale);

                // Apply base orientation to bring front forward
                loadedModel.rotation.set(
                    BASE_ORIENTATION.x,
                    BASE_ORIENTATION.y,
                    BASE_ORIENTATION.z
                );
                
                scene.add(loadedModel);
                model = loadedModel;

                // Aim controls at model center
                if (controls) {
                    controls.target.set(0, 0, 0);
                    controls.update();
                }

                // Frame the model in view with current camera
                frameModel(model);
                
                // Hide loading indicator
                if (modelLoading) {
                    modelLoading.style.display = 'none';
                }
                
                console.log('3D GLB model loaded successfully');
            },
            (progress) => {
                // Loading progress
                if (progress.lengthComputable && progress.total > 0) {
                    const percent = (progress.loaded / progress.total * 100).toFixed(0);
                    if (modelLoading) {
                        const loadingText = modelLoading.querySelector('span');
                        if (loadingText) {
                            loadingText.textContent = currentLang === 'zh' 
                                ? `加载3D模型中... ${percent}%` 
                                : `Loading 3D Model... ${percent}%`;
                        }
                    }
                } else {
                    // Show indeterminate progress
                    if (modelLoading) {
                        const loadingText = modelLoading.querySelector('span');
                        if (loadingText) {
                            loadingText.textContent = currentLang === 'zh' 
                                ? '加载3D模型中...' 
                                : 'Loading 3D Model...';
                        }
                    }
                }
            },
            (error) => {
                clearTimeout(loadTimeout);
                console.error('Error loading 3D GLB model:', error);
                console.error('Error details:', {
                    message: error.message,
                    path: glbPath,
                    loader: typeof GLTFLoader
                });
                // Show user-friendly error message
                if (modelLoading) {
                    const loadingText = modelLoading.querySelector('span');
                    if (loadingText) {
                        loadingText.textContent = currentLang === 'zh' 
                            ? '模型加载失败，使用备用模型' 
                            : 'Model failed to load, using fallback';
                    }
                    setTimeout(() => {
                        modelLoading.style.display = 'none';
                    }, 2000);
                }
                // Create a fallback geometric shape
                createFallbackModel();
            }
        );
}

function createFallbackModel() {
    // Create a stylized tooth-like shape as fallback
    // Using a combination of geometries to create a more tooth-like appearance
    const group = new THREE.Group();
    
    // Main body (cone shape)
    const bodyGeometry = new THREE.ConeGeometry(0.8, 1.8, 16);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.2,
        roughness: 0.8
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.x = Math.PI;
    group.add(body);
    
    // Root (cylinder)
    const rootGeometry = new THREE.CylinderGeometry(0.3, 0.5, 1, 12);
    const rootMaterial = new THREE.MeshStandardMaterial({
        color: 0xe8f4f8,
        metalness: 0.1,
        roughness: 0.9
    });
    const root = new THREE.Mesh(rootGeometry, rootMaterial);
    root.position.y = -1.4;
    group.add(root);
    
    // Crown highlight
    const crownGeometry = new THREE.SphereGeometry(0.6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const crownMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.3,
        roughness: 0.6,
        transparent: true,
        opacity: 0.7
    });
    const crown = new THREE.Mesh(crownGeometry, crownMaterial);
    crown.position.y = 0.9;
    crown.rotation.x = -Math.PI / 2;
    group.add(crown);
    
    scene.add(group);
    model = group;
    if (controls) {
        controls.target.set(0, 0, 0);
        controls.update();
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    if (!renderer || !scene || !camera) {
        return;
    }
    
    // Keep model static; update controls for damping and ensure no autorotate
    if (controls) {
        if (controls.autoRotate) controls.autoRotate = false;
        controls.update();
    }
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    if (!modelContainer || !camera || !renderer) return;
    
    // Protect against division by zero
    const width = modelContainer.clientWidth || 800;
    const height = modelContainer.clientHeight || 600;
    
    if (height > 0) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
    renderer.setSize(width, height);
}

// Initialize Three.js when DOM is ready
function initializeApp() {
    if (typeof THREE === 'undefined') {
        setTimeout(initializeApp, 100);
        return;
    }
    console.log('Initializing Three.js scene...');
    initThreeJS();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        applyForceMobilePreview();
        initializeApp();
    });
} else {
    applyForceMobilePreview();
    initializeApp();
}

// Setup OrbitControls helper
function setupOrbitControls() {
    const OrbitControls = THREE?.OrbitControls || window?.OrbitControls;
    if (!OrbitControls || !camera || !renderer) {
        // Retry if not yet available
        setTimeout(setupOrbitControls, 100);
        return;
    }
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false; // disable damping to avoid any drift/spin
    controls.dampingFactor = 0.08;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.autoRotate = false; // ensure no autorotation
    controls.minDistance = 1.5;
    controls.maxDistance = 15;
    controls.target.set(0, 0, 0);
    controls.update();
}

// Allow forcing mobile preview via URL param ?mobile=1 or ?forceMobile=1
function applyForceMobilePreview() {
    try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('mobile') === '1' || params.get('forceMobile') === '1') {
            document.body.classList.add('force-mobile');
            console.log('Force mobile preview enabled');
        }
    } catch (e) {
        console.warn('Failed to apply force mobile preview:', e);
    }
}

// Fit the camera to frame the model nicely
function frameModel(object) {
    if (!object || !camera || !controls) return;
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    const fitHeightDistance = maxDim / (2 * Math.tan(fov / 2));
    const fitWidthDistance = fitHeightDistance / camera.aspect;
    const distance = Math.max(fitHeightDistance, fitWidthDistance) * 1.4; // padding factor

    // Position camera on Z axis away from center
    camera.position.set(center.x, center.y, center.z + distance);
    camera.near = distance / 100;
    camera.far = distance * 100;
    camera.updateProjectionMatrix();

    controls.target.copy(center);
    controls.update();

    console.log('Framed model:', { center, size, distance, aspect: camera.aspect });
}

// Rotate the model so its front faces the camera (run once after framing)
function orientModelToCamera() {
    if (!model || !camera) return;
    // Point model's -Z toward the camera
    model.lookAt(camera.position);
    // After orienting, keep controls aimed at the model center
    if (controls) {
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        controls.target.copy(center);
        controls.update();
    }
}

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
        }
    }
});

// Add hover effects to cards
document.querySelectorAll('.challenge-card, .tech-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
    
    // Add keyboard navigation support for cards
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'article');
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const link = card.querySelector('a');
            if (link) {
                link.click();
            }
        }
    });
});

// Initialize language on load
updateLanguage();

// Animate numbers on scroll
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                const target = parseInt(entry.target.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateNumber = () => {
                    current += increment;
                    if (current < target) {
                        if (target >= 1000000) {
                            entry.target.textContent = Math.floor(current / 1000000) + 'M+';
                        } else if (target >= 1000) {
                            entry.target.textContent = Math.floor(current / 1000) + 'K+';
                        } else {
                            entry.target.textContent = Math.floor(current) + '%';
                        }
                        requestAnimationFrame(updateNumber);
                    } else {
                        if (target >= 1000000) {
                            entry.target.textContent = (target / 1000000) + 'M+';
                        } else if (target >= 1000) {
                            entry.target.textContent = (target / 1000) + 'K+';
                        } else {
                            entry.target.textContent = target + '%';
                        }
                    }
                };
                
                updateNumber();
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Initialize number animation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateNumbers);
} else {
    animateNumbers();
}

// Add focus visible styles for keyboard navigation
document.addEventListener('DOMContentLoaded', () => {
    // Add focus-visible class support for better keyboard navigation
    const style = document.createElement('style');
    style.textContent = `
        *:focus-visible {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
            border-radius: 4px;
        }
        
        button:focus-visible,
        a:focus-visible {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
});

// Interactive Timeline Animation
let timelineAnimationInitialized = false;

function initTimelineAnimation() {
    if (timelineAnimationInitialized) return;
    
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineLine = document.getElementById('timelineLine');
    const timelineSection = document.querySelector('.process');
    
    if (!timelineItems.length || !timelineLine || !timelineSection) {
        setTimeout(initTimelineAnimation, 100);
        return;
    }
    
    timelineAnimationInitialized = true;
    
    function updateTimeline() {
        const rect = timelineSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const total = windowHeight + rect.height;

        // Faster fill: scale progress more aggressively so the line reaches 100% by late-section scroll
        let scrollProgress = (windowHeight - rect.top) / total;
        scrollProgress = Math.min(1, Math.max(0, scrollProgress * 1.6));
        
        // Activate timeline items
        timelineItems.forEach((item, index) => {
            const itemProgress = (index + 1) / timelineItems.length;
            const threshold = 0.12; // loosen threshold so steps 5/6 light sooner
            if (scrollProgress >= itemProgress - threshold) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Update line fill based on scroll progress (smooth fill as you scroll)
        if (timelineLine) {
            const lineHeight = timelineLine.offsetHeight || timelineLine.scrollHeight;
            // Use scroll progress directly for smooth fill animation
            const fillHeight = scrollProgress * lineHeight;
            timelineLine.style.setProperty('--fill-height', `${fillHeight}px`);
        }
    }
    
    // Add CSS variable support for line fill
    if (!document.getElementById('timeline-line-style')) {
        const style = document.createElement('style');
        style.id = 'timeline-line-style';
        style.textContent = `
            .timeline-line::after {
                height: var(--fill-height, 0) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(() => {
            updateTimeline();
            scrollTimeout = null;
        }, 16);
    }, { passive: true });
    
    updateTimeline();
}

// Initialize timeline animation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimelineAnimation);
} else {
    initTimelineAnimation();
}

