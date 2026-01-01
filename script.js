// ============================================
// DOM ELEMENTS
// ============================================
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.getElementById('contactForm');

// ============================================
// ENHANCED SMOOTH SCROLL
// ============================================
// Polyfill for older browsers
if (!window.CSS || !window.CSS.supports('scroll-behavior', 'smooth')) {
    document.documentElement.style.scrollBehavior = 'auto';
}

// Smooth scroll with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1000; // 1 second
            let start = null;

            // Request animation frame for smooth scrolling
            window.requestAnimationFrame(function step(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const percent = Math.min(progress / duration, 1);
                
                // Easing function for smooth motion
                const easeInOutQuad = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                
                window.scrollTo(0, startPosition + distance * easeInOutQuad(percent));
                
                if (progress < duration) {
                    window.requestAnimationFrame(step);
                }
            });
        }
    });
});
// ============================================
// MOBILE MENU TOGGLE
// ============================================
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ============================================
// PROJECT FILTERING
// ============================================
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter projects
        const filterValue = button.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeIn 0.6s ease-out';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.borderBottomColor = 'rgba(0, 217, 255, 0.2)';
    } else {
        navbar.style.borderBottomColor = 'rgba(26, 31, 58, 1)';
    }
});

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ============================================
// CONTACT FORM SUBMISSION
// ============================================
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name') || contactForm.querySelector('input[type="text"]').value,
        email: formData.get('email') || contactForm.querySelector('input[type="email"]').value,
        message: formData.get('message') || contactForm.querySelector('textarea').value
    };

    // Using Formspree alternative (replace with your preferred service)
    try {
        // Prepare email content
        const subject = `New Contact from ${data.name}`;
        const body = `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`;
        
        // Open mailto link (fallback solution)
        window.location.href = `mailto:sohailms873@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Show success message
        showNotification('Message prepared! Your email client will open.', 'success');
        contactForm.reset();
    } catch (error) {
        showNotification('Error sending message. Please try again.', 'error');
    }
});

// ============================================
// NOTIFICATION HELPER
// ============================================
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#00ff00' : '#ff0055'};
        color: ${type === 'success' ? '#0a0e27' : '#f5f5f5'};
        border-radius: 4px;
        font-weight: 600;
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe skill cards and cert cards
document.querySelectorAll('.skill-category, .cert-card, .timeline-content').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ============================================
// ADD CSS ANIMATIONS TO DOM
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// ============================================
// ACTIVE NAV LINK ON SCROLL
// ============================================
window.addEventListener('scroll', () => {
    const navHeight = document.querySelector('.navbar').offsetHeight;
    
    navLinks.forEach(link => {
        const targetId = link.getAttribute('href');
        if (targetId.startsWith('#')) {
            const targetElement = document.getElementById(targetId.substring(1));
            
            if (targetElement) {
                const targetPosition = targetElement.offsetTop;
                const targetEnd = targetPosition + targetElement.offsetHeight;
                
                if (window.scrollY + navHeight >= targetPosition && window.scrollY < targetEnd) {
                    navLinks.forEach(l => l.style.color = 'var(--text-light)');
                    link.style.color = 'var(--accent)';
                    if (link.classList.contains('resume-btn')) {
                        link.style.borderColor = 'var(--accent)';
                    }
                }
            }
        }
    });
});

// ============================================
// PARALLAX EFFECT ON HERO
// ============================================
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrollY = window.scrollY;
    
    if (scrollY < window.innerHeight) {
        hero.style.backgroundPosition = `center ${scrollY * 0.5}px`;
    }
});

// ============================================
// CONSOLE GREETING
// ============================================
console.log('%c Welcome to Shaik Mahammad Sohel\'s Portfolio!', 'color: #00d9ff; font-size: 16px; font-weight: bold;');
console.log('%c DevOps Engineer | Full-Stack Developer | Cloud Enthusiast', 'color: #0099ff; font-size: 14px;');
console.log('%c 📧 sohailms873@gmail.com | 📱 +91 8523058397', 'color: #e0e0e0; font-size: 12px;');


// ============================================
// RESUME GENERATION (opens printable resume in new tab)
// ============================================
const resumeBtn = document.getElementById('resumeBtn');

const resumeData = {
  name: "Shaik Mahammad Sohel",
  title: "DevOps Engineer | Full-Stack Developer | Cloud Enthusiast",
  email: "sohailms873@gmail.com",
  phone: "+91 8523058397",
  location: "Kurnool, Andhra Pradesh",
  about: `Passionate B.Tech student specializing in DevOps, Cloud Infrastructure, and Full-Stack Development. Hands-on with Docker, Kubernetes, Terraform, Jenkins and building scalable systems.`,
  education: [
    { date: "2023 - 2027", degree: "B.Tech in Data Science & CSE", school: "G Pulla Reddy Engineering College" },
    { date: "2023", degree: "Senior Secondary (XII) - Science", school: "Sri Chaitanya Raman Bhavan, Vijayawada — 98.00%" },
    { date: "2021", degree: "Secondary (X)", school: "A P R School, Anantapur — CGPA: 10.00/10" }
  ],
  skills: ["Docker", "Kubernetes", "Terraform", "Jenkins", "Python", "FastAPI", "PostgreSQL", "Linux", "Git", "Machine Learning"],
  projects: [
    { name: "Voting App", desc: "Microservices voting app (Flask, Node, Redis).", link: "https://github.com/sohel87399/voting-app" },
    { name: "Terraform K8s Deployment", desc: "IaC deployment for K8s with Terraform.", link: "https://github.com/sohel87399/terraform_k8s_deployment" },
    { name: "Coupon API Engine", desc: "FastAPI-based coupon/discount engine.", link: "https://coupon-api-project-3.onrender.com/docs" },
    { name: "Titanic Survival Prediction", desc: "ML classification project.", link: "https://github.com/sohel87399/titanic-survival-prediction" }
  ],
  certifications: [
    { title: "Docker Training Course", issuer: "KodeKloud", link: "https://learn.kodekloud.com/certificate/7e8d8b60-a3b6-4010-b268-23abd3b26ff9" },
    { title: "Linux for Beginners", issuer: "KodeKloud", link: "https://learn.kodekloud.com/user/certificate/7c27f9af-ec20-49c3-b74d-62dfbf7ddcc9" }
  ],
  profileImage: "profile.jpg" // ensure this file exists next to index.html
};

function buildResumeHTML(d) {
  return `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Resume - ${d.name}</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <style>
      :root{--bg:#0f1419;--card:#0b0f1a;--accent:#00d9ff;--text:#e6eef6}
      body{font-family:Inter,Segoe UI,Arial,sans-serif;margin:0;background:#fff;color:#111}
      .page{max-width:900px;margin:20px auto;padding:28px;background:#fff;border:1px solid #ddd}
      header{display:flex;gap:24px;align-items:center}
      .avatar{width:120px;height:120px;border-radius:8px;object-fit:cover;border:3px solid var(--accent)}
      .head-info h1{margin:0;font-size:24px}
      .head-info p{margin:4px 0;color:#333}
      .section{margin-top:18px}
      h2{font-size:16px;margin:0 0 8px 0;color:#222;border-bottom:1px solid #eee;padding-bottom:6px}
      ul{margin:8px 0 0 18px;padding:0}
      li{margin-bottom:6px;color:#333}
      .meta{color:#555;font-size:14px}
      .two-col{display:flex;gap:20px}
      .left{flex:2}
      .right{flex:1}
      .skills{display:flex;flex-wrap:wrap;gap:6px}
      .skill{background:#f3f7fb;padding:6px 8px;border-radius:6px;font-size:13px}
      .print-actions{position:fixed;top:12px;right:12px}
      .btn{background:var(--accent);color:#03202a;padding:8px 12px;border-radius:6px;border:none;cursor:pointer}
      @media print {
        .print-actions{display:none}
        body{margin:0}
        .page{border:none;box-shadow:none;margin:0}
      }
    </style>
  </head>
  <body>
    <div class="print-actions">
      <button class="btn" onclick="window.print()">Print / Save PDF</button>
      <button class="btn" onclick="window.close()" style="margin-left:8px">Close</button>
    </div>

    <div class="page" id="resumePage">
      <header>
        <img src="${d.profileImage}" alt="${d.name}" class="avatar" onerror="this.style.display='none'">
        <div class="head-info">
          <h1>${d.name}</h1>
          <p class="meta">${d.title} • ${d.location}</p>
          <p class="meta">📧 ${d.email} • 📱 ${d.phone}</p>
        </div>
      </header>

      <div class="section two-col">
        <div class="left">
          <h2>About</h2>
          <p class="meta">${d.about}</p>

          <h2 style="margin-top:16px">Experience & Projects</h2>
          <ul>
            ${d.projects.map(p => `<li><strong>${p.name}:</strong> ${p.desc} ${p.link ? `<a href="${p.link}" target="_blank">${p.link}</a>` : ''}</li>`).join('')}
          </ul>

          <h2 style="margin-top:16px">Certifications</h2>
          <ul>
            ${d.certifications.map(c => `<li><strong>${c.title}</strong> — ${c.issuer} ${c.link ? `<a href="${c.link}" target="_blank">${c.link}</a>` : ''}</li>`).join('')}
          </ul>
        </div>

        <aside class="right">
          <h2>Education</h2>
          <ul>
            ${d.education.map(e => `<li><strong>${e.degree}</strong><br><span class="meta">${e.school} • ${e.date}</span></li>`).join('')}
          </ul>

          <h2 style="margin-top:12px">Skills</h2>
          <div class="skills">
            ${d.skills.map(s => `<span class="skill">${s}</span>`).join('')}
          </div>
        </aside>
      </div>
    </div>

    <script>
      // Auto-print after short delay; user can cancel if desired
      setTimeout(() => {
        try { window.print(); } catch(e) {}
      }, 700);
    </script>
  </body>
  </html>
  `;
}

if (resumeBtn) {
  resumeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const newWin = window.open('', '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,width=900,height=800');
    if (!newWin) {
      alert('Popup blocked. Please allow popups for this site to open the resume.');
      return;
    }
    newWin.document.write(buildResumeHTML(resumeData));
    newWin.document.close();
    newWin.focus();
  });
}

