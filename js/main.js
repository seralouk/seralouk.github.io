// Navbar scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Reveal Animation using Intersection Observer
const revealElements = document.querySelectorAll('.reveal');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Stop observing once revealed to keep the element visible
            observer.unobserve(entry.target);
        }
    });
};

const revealOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// Space Particles Generation & Parallax Effect
const particlesContainer = document.getElementById('particles-container');
const particleCount = 150; // Increased count for starry background
const particles = [];

for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    // 90% stars (small, white), 10% planets (larger, colored)
    const isPlanet = Math.random() > 0.9;
    // Increased planet size range to [3, 9] pixels for more variety
    const size = isPlanet ? Math.random() * 6 + 3 : Math.random() * 1.5 + 0.5;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    const x = Math.random() * 100;
    const y = Math.random() * 100;

    particle.dataset.origY = y;
    // Parallax depth: Planets (larger) move faster, distant stars (smaller) move slower
    particle.dataset.speed = isPlanet ? Math.random() * 0.6 + 0.3 : Math.random() * 0.15 + 0.05;

    particle.style.left = `${x}vw`;
    particle.style.top = `${y}vh`;

    if (isPlanet) {
        // Randomize planet colors between theme accents and subtle celestial colors
        const colors = ['var(--accent-1)', 'var(--accent-2)', '#fde047', '#fca5a5'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        particle.style.opacity = Math.random() * 0.5 + 0.3;
        // Even faster planet drift
        particle.style.animation = `drift ${Math.random() * 15 + 10}s infinite alternate ease-in-out`;
    } else {
        // Star properties
        particle.style.background = '#ffffff';
        particle.style.boxShadow = '0 0 3px rgba(255, 255, 255, 0.8)';
        // Even faster star twinkle and drift speeds
        particle.style.animation = `twinkle ${Math.random() * 1.5 + 1}s infinite alternate ease-in-out, drift ${Math.random() * 20 + 15}s infinite alternate ease-in-out`;
    }

    // offset animations so they don't pulse together
    particle.style.animationDelay = `-${Math.random() * 20}s, -${Math.random() * 40}s`;

    particlesContainer.appendChild(particle);
    particles.push(particle);
}

// Parallax scrolling for particles using requestAnimationFrame for performance
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            particles.forEach(particle => {
                const speed = parseFloat(particle.dataset.speed);
                const origY = parseFloat(particle.dataset.origY);

                // Original Y position in pixels
                const yPx = (origY / 100) * windowHeight;

                // Calculate new Y position (moving up as we scroll down)
                let newYPx = yPx - (scrollY * speed);

                // Wrap around strictly inside the screen height
                newYPx = ((newYPx % windowHeight) + windowHeight) % windowHeight;

                // Apply difference via transform
                const currentYOffset = newYPx - yPx;
                particle.style.transform = `translateY(${currentYOffset}px)`;
            });

            ticking = false;
        });

        ticking = true;
    }
});
