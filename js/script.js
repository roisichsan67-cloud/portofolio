// =============================================
//  Portfolio – Rois Munawar Nur Ichsan
// =============================================

// ---- Animated Circuit Board Canvas Background ----
(function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, nodes = [], lines = [];
    const NODE_COUNT = 38;
    const ACCENT = '#00d4ff';
    const ACCENT2 = '#7b5ea7';

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function initNodes() {
        nodes = [];
        lines = [];
        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push({
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                r: Math.random() * 2 + 1,
                pulse: Math.random() * Math.PI * 2,
            });
        }
    }

    function drawCircuitLine(x1, y1, x2, y2, alpha) {
        const mx = x1 + (x2 - x1) * 0.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        // L-shaped circuit trace
        if (Math.random() > 0.5) {
            ctx.lineTo(mx, y1);
            ctx.lineTo(mx, y2);
        } else {
            ctx.lineTo(x1, (y1 + y2) / 2);
            ctx.lineTo(x2, (y1 + y2) / 2);
        }
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(0,212,255,${alpha * 0.45})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
    }

    let tick = 0;
    function draw() {
        ctx.clearRect(0, 0, W, H);
        tick++;

        nodes.forEach(n => {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0 || n.x > W) n.vx *= -1;
            if (n.y < 0 || n.y > H) n.vy *= -1;
            n.pulse += 0.02;

            // Draw node dot
            const pulse = 0.5 + 0.5 * Math.sin(n.pulse);
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r * (1 + pulse * 0.4), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,212,255,${0.3 + pulse * 0.3})`;
            ctx.fill();
        });

        // Draw connections between close nodes
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    const alpha = 1 - dist / 200;
                    drawCircuitLine(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y, alpha);
                }
            }
        }

        requestAnimationFrame(draw);
    }

    resize();
    initNodes();
    draw();
    window.addEventListener('resize', () => { resize(); initNodes(); });
})();

// ---- Load JSON Data ----
async function loadData() {
    try {
        const [profileData, educationData, experienceData, projectsData] = await Promise.all([
            fetch('data/profile.json').then(r => r.json()),
            fetch('data/education.json').then(r => r.json()),
            fetch('data/experience.json').then(r => r.json()),
            fetch('data/projects.json').then(r => r.json()),
        ]);

        renderProfile(profileData);
        renderEducation(educationData);
        renderExperience(experienceData);
        renderProjects(projectsData);

        document.getElementById('current-year').textContent = new Date().getFullYear();
        initScrollAnimations();
        initActiveNav();
    } catch (err) {
        console.error('Error loading data:', err);
    }
}

// ---- Profile ----
function renderProfile(data) {
    document.getElementById('profile-name').textContent = data.name;
    document.getElementById('profile-description').textContent = data.description;
    document.getElementById('profile-email').textContent = data.email;
    document.getElementById('profile-phone').textContent = data.phone;

    const pic = document.getElementById('profile-pic');
    pic.src = data.profileImage;
    pic.alt = `${data.name} foto profil`;

    const socialLinks = document.getElementById('social-links');
    data.socialMedia.forEach(s => {
        const a = document.createElement('a');
        a.href = s.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.title = s.platform;
        const icon = s.platform.toLowerCase() === 'instagram' ? 'instagram' : s.platform.toLowerCase();
        a.innerHTML = `<i class="fab fa-${icon}"></i>`;
        socialLinks.appendChild(a);
    });

    const cvBtn = document.getElementById('cv-download');
    cvBtn.href = data.cv.file;
    cvBtn.download = '';

    if (data.skills) {
        const grid = document.getElementById('skills-grid');
        data.skills.forEach(skill => {
            const el = document.createElement('div');
            el.className = 'skill-item';
            el.innerHTML = `<i class="${skill.icon}"></i><span>${skill.name}</span>`;
            grid.appendChild(el);
        });
    }
}

// ---- Education ----
function renderEducation(data) {
    const list = document.getElementById('education-list');
    data.forEach(item => {
        const el = document.createElement('div');
        el.className = 'education-item';
        el.innerHTML = `
            <div class="edu-header">
                <img src="${item.logo}" alt="${item.university} logo" class="edu-logo" onerror="this.style.display='none'">
                <div class="edu-header-text">
                    <h3>${item.university}</h3>
                    <div class="degree">${item.major}</div>
                    <div class="year"><i class="fas fa-calendar-alt"></i> ${item.year}</div>
                </div>
            </div>
            <p>${item.description}</p>
        `;
        list.appendChild(el);
    });
}

// ---- Experience ----
function renderExperience(data) {
    const list = document.getElementById('experience-list');
    data.forEach(item => {
        const el = document.createElement('div');
        el.className = 'experience-item';
        el.innerHTML = `
            <div class="exp-header">
                <img src="${item.logo}" alt="${item.company} logo" class="exp-logo" onerror="this.style.display='none'">
                <div class="exp-header-text">
                    <h3>${item.company}</h3>
                    <div class="position">${item.position}</div>
                    <div class="duration"><i class="fas fa-calendar-alt"></i> ${item.year}</div>
                </div>
            </div>
            <p>${item.description}</p>
        `;
        list.appendChild(el);
    });
}

// ---- Projects ----
function renderProjects(data) {
    const grid = document.getElementById('projects-grid');
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'project-card';

        const metaHtml = [
            item.year ? `<span><i class="fas fa-calendar"></i>${item.year}</span>` : '',
            item.role ? `<span><i class="fas fa-user-gear"></i>${item.role}</span>` : '',
            item.partner ? `<span><i class="fas fa-building"></i>${item.partner}</span>` : '',
        ].filter(Boolean).join('');

        card.innerHTML = `
            <div class="project-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.src='images/profile1.png'">
                <div class="project-image-overlay"></div>
            </div>
            <div class="project-info">
                <h3>${item.title}</h3>
                <div class="project-meta">${metaHtml}</div>
                <p>${item.description}</p>
                ${item.link && item.link !== '#' ? `<a href="${item.link}" target="_blank" rel="noopener" class="project-link">Lihat Detail <i class="fas fa-arrow-right"></i></a>` : ''}
            </div>
        `;
        grid.appendChild(card);
    });
}

// ---- Scroll Animations ----
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add('visible');
        });
    }, { threshold: 0.08 });
    sections.forEach(s => observer.observe(s));
}

// ---- Active Nav Highlight ----
function initActiveNav() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                navLinks.forEach(a => a.classList.remove('active'));
                const id = e.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-links a[data-section="${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => observer.observe(s));
}

// ---- Mobile Menu Toggle ----
document.getElementById('nav-toggle').addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu a').forEach(a => {
    a.addEventListener('click', () => {
        document.getElementById('mobile-menu').classList.remove('open');
    });
});

// ---- Smooth anchor scroll ----
document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ---- Init ----
loadData();
