/**
 * David Cohen - Site de Campagne
 * JavaScript principal
 */

// ========================================
// CSV Parser - Utilitaire pour lire les fichiers CSV
// ========================================

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length === 0) return [];
    
    const headers = parseCSVLine(lines[0]);
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length === headers.length) {
            const row = {};
            headers.forEach((header, index) => {
                row[header.trim()] = values[index].trim();
            });
            data.push(row);
        }
    }
    
    return data;
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    
    return result;
}

async function loadCSV(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const text = await response.text();
        return parseCSV(text);
    } catch (error) {
        console.error(`Erreur lors du chargement de ${filePath}:`, error);
        return [];
    }
}

// ========================================
// Navigation
// ========================================

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect on navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ========================================
// Hero Slider
// ========================================

function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    let currentSlide = 0;
    let autoplayInterval;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // Button events
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });

    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    startAutoplay();

    // Pause on hover
    const heroSection = document.querySelector('.hero-section');
    heroSection.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    heroSection.addEventListener('mouseleave', startAutoplay);
}

// ========================================
// Agenda / Événements
// ========================================

async function loadAgenda() {
    const container = document.getElementById('agendaGrid');
    const events = await loadCSV('data/agenda.csv');
    
    if (events.length === 0) {
        container.innerHTML = `
            <div class="loading">
                Aucun événement prévu pour le moment.<br>
                <small>Modifiez le fichier <code>data/agenda.csv</code> pour ajouter des événements.</small>
            </div>
        `;
        return;
    }

    // Sort events by date
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Filter future events (or keep all if you want)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const futureEvents = events.filter(event => new Date(event.date) >= today);
    const displayEvents = futureEvents.length > 0 ? futureEvents.slice(0, 6) : events.slice(-6);

    container.innerHTML = displayEvents.map(event => {
        const date = new Date(event.date);
        const day = date.getDate();
        const month = date.toLocaleDateString('fr-FR', { month: 'short' });
        
        return `
            <article class="agenda-card fade-in">
                <div class="agenda-date">
                    <div class="agenda-day">${day}</div>
                    <div class="agenda-month">${month}</div>
                </div>
                <div class="agenda-content">
                    <div class="agenda-time">🕐 ${event.heure || '00:00'}</div>
                    <h3 class="agenda-title">${event.titre || 'Événement'}</h3>
                    <div class="agenda-location">📍 ${event.lieu || 'Lieu à confirmer'}</div>
                    <p class="agenda-description">${event.description || ''}</p>
                    ${event.type ? `<span class="agenda-type ${event.type}">${event.type}</span>` : ''}
                </div>
            </article>
        `;
    }).join('');

    initFadeInAnimation();
}

// ========================================
// Équipe
// ========================================

async function loadEquipe() {
    const container = document.getElementById('equipeGrid');
    const membres = await loadCSV('data/equipe.csv');
    
    if (membres.length === 0) {
        container.innerHTML = `
            <div class="loading">
                Équipe en cours de constitution.<br>
                <small>Modifiez le fichier <code>data/equipe.csv</code> pour ajouter des membres.</small>
            </div>
        `;
        return;
    }

    container.innerHTML = membres.map(membre => {
        const initials = (membre.nom || 'NN').split(' ').map(n => n[0]).join('').substring(0, 2);
        const hasPhoto = membre.photo && membre.photo.trim() !== '';
        
        return `
            <article class="equipe-card fade-in">
                ${hasPhoto 
                    ? `<img src="images/equipe/${membre.photo}" alt="${membre.nom}" class="equipe-photo" onerror="this.outerHTML='<div class=\\'equipe-photo-placeholder\\'>${initials}</div>'">`
                    : `<div class="equipe-photo-placeholder">${initials}</div>`
                }
                <div class="equipe-info">
                    <h3 class="equipe-name">${membre.nom || 'Nom'}</h3>
                    <p class="equipe-role">${membre.role || 'Membre'}</p>
                    <p class="equipe-description">${membre.description || ''}</p>
                </div>
            </article>
        `;
    }).join('');

    initFadeInAnimation();
}

// ========================================
// Engagement
// ========================================

async function loadEngagement() {
    const container = document.getElementById('engagementContainer');
    const points = await loadCSV('data/programme.csv');
    
    if (points.length === 0) {
        container.innerHTML = `
            <div class="loading">
                Engagement en cours d'élaboration.<br>
                <small>Modifiez le fichier <code>data/programme.csv</code> pour ajouter des points.</small>
            </div>
        `;
        return;
    }

    // Group by theme
    const themes = {};
    points.forEach(point => {
        const theme = point.theme || 'Divers';
        if (!themes[theme]) {
            themes[theme] = {
                icon: point.icone || '📌',
                points: []
            };
        }
        themes[theme].points.push(point.point || point.description || '');
    });

    container.innerHTML = Object.entries(themes).map(([themeName, themeData], index) => `
        <div class="engagement-theme fade-in ${index === 0 ? 'active' : ''}">
            <div class="engagement-header" onclick="toggleEngagement(this)">
                <div class="engagement-icon">${themeData.icon}</div>
                <h3 class="engagement-theme-title">${themeName}</h3>
                <div class="engagement-toggle">▼</div>
            </div>
            <div class="engagement-content">
                <div class="engagement-points">
                    ${themeData.points.map(point => `
                        <div class="engagement-point">
                            <span class="engagement-point-text">${point}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');

    initFadeInAnimation();
}

function toggleEngagement(header) {
    const theme = header.parentElement;
    theme.classList.toggle('active');
}

// ========================================
// Contact Form
// ========================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) {
        console.log('ℹ️ Formulaire de contact non trouvé sur cette page');
        return;
    }
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Create mailto link
        const subject = encodeURIComponent(`[Site Campagne] ${data.subject} - ${data.name}`);
        const body = encodeURIComponent(`
Nom: ${data.name}
Email: ${data.email}
Sujet: ${data.subject}

Message:
${data.message}
        `.trim());
        
        const mailtoLink = `mailto:contact@davidcohen-nanterre.fr?subject=${subject}&body=${body}`;
        
        // Open mail client
        window.location.href = mailtoLink;
        
        // Show confirmation
        alert('Votre client email va s\'ouvrir avec votre message pré-rempli.\n\nSi votre client email ne s\'ouvre pas, vous pouvez nous contacter directement à contact@davidcohen-nanterre.fr');
    });
}

// ========================================
// Animations
// ========================================

function initFadeInAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// Smooth Scroll
// ========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// Social Feed / Réseaux Sociaux
// ========================================

async function loadSocialFeed() {
    console.log('🌐 Chargement du flux social...');
    const container = document.getElementById('socialFeedGrid');
    
    if (!container) {
        console.error('❌ Container #socialFeedGrid introuvable !');
        return;
    }
    
    const posts = await loadCSV('data/social.csv');
    console.log('📊 Publications chargées:', posts.length);
    
    if (posts.length === 0) {
        console.warn('⚠️ Aucune publication trouvée dans social.csv');
        container.innerHTML = `
            <div class="loading">
                Aucune publication pour le moment.<br>
                <small>Modifiez le fichier <code>data/social.csv</code> pour ajouter des publications.</small>
            </div>
        `;
        return;
    }

    // Sort by date (most recent first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Render posts
    container.innerHTML = posts.map(post => {
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        const networkIcons = {
            facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
            twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
            instagram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
            youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
        };

        const hasImage = post.image && post.image.trim() !== '';
        const network = post.reseau.toLowerCase();

        return `
            <article class="social-post fade-in" data-network="${network}">
                <div class="social-post-header">
                    <div class="social-post-network-icon ${network}">
                        ${networkIcons[network] || '📱'}
                    </div>
                    <div class="social-post-author">
                        <div class="social-post-author-name">${post.auteur || 'David Cohen'}</div>
                        <div class="social-post-date">${formattedDate}</div>
                    </div>
                </div>
                ${hasImage ? `<img src="${post.image}" alt="Publication" class="social-post-image" onerror="this.style.display='none'">` : ''}
                <div class="social-post-content">
                    <p class="social-post-text">${post.texte || ''}</p>
                    ${post.url ? `
                        <a href="${post.url}" target="_blank" rel="noopener" class="social-post-link">
                            Voir la publication
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                            </svg>
                        </a>
                    ` : ''}
                </div>
                ${post.likes || post.commentaires ? `
                    <div class="social-post-stats">
                        ${post.likes ? `<div class="social-stat">❤️ ${post.likes}</div>` : ''}
                        ${post.commentaires ? `<div class="social-stat">💬 ${post.commentaires}</div>` : ''}
                        ${post.partages ? `<div class="social-stat">🔄 ${post.partages}</div>` : ''}
                    </div>
                ` : ''}
            </article>
        `;
    }).join('');

    initFadeInAnimation();
    initSocialFilter();
}

function initSocialFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const posts = document.querySelectorAll('.social-post');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter posts
            posts.forEach(post => {
                if (filter === 'all' || post.dataset.network === filter) {
                    post.classList.remove('hidden');
                } else {
                    post.classList.add('hidden');
                }
            });
        });
    });
}

// ========================================
// Initialization
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🗳️ Site de campagne David Cohen - Initialisation...');
    
    initNavigation();
    initSlider();
    initSmoothScroll();
    initContactForm();
    
    // Load dynamic content
    loadAgenda();
    loadEquipe();
    loadEngagement();
    loadSocialFeed();
    
    console.log('✅ Site initialisé avec succès!');
});

// Make toggleEngagement available globally
window.toggleEngagement = toggleEngagement;
