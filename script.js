const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const currentKey = currentPage.replace('.html', '');

document.querySelectorAll('.tab-nav a').forEach((link) => {
    if (link.dataset.nav === currentKey) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
    }
});

const brand = document.querySelector('.site-header .brand');
const catLayer = document.createElement('div');
catLayer.className = 'cat-rain-layer';
document.body.appendChild(catLayer);

const catImageNames = [
    'cat_-__1_apple-removebg-preview.png',
    'cat_-__2_orange-removebg-preview.png',
    'cat_-__3_pineapple-removebg-preview.png',
    'cat_-__4_green_apple-removebg-preview.png',
    'cat_-__5_blueberry-removebg-preview.png',
    'cat_-__6_eggplant-removebg-preview.png',
    'cat_-__7_strawberry-removebg-preview.png',
    'cat - #8 construction.png',
    'cat - #10 drawing.png',
    'cat - #12 intro.png'
];

const catImages = catImageNames.map((fileName) => `assets/fonts/${encodeURIComponent(fileName)}`);

let catCooldown = false;
let brandActiveTimeout = null;
let hoverRevealTimeout = null;

function createShowerDrop(isStar) {
    const x = Math.random() * 100;
    const duration = 1800 + Math.random() * 2200;
    const delay = Math.random() * 650;

    if (isStar) {
        const starDrop = document.createElement('span');
        starDrop.className = 'cat-drop star-drop';
        starDrop.textContent = Math.random() < 0.5 ? '⭐' : '✨';
        const starSize = 0.9 + Math.random() * 1.1;
        starDrop.style.left = x + 'vw';
        starDrop.style.fontSize = starSize + 'rem';
        starDrop.style.animationDuration = duration + 'ms';
        starDrop.style.animationDelay = delay + 'ms';
        catLayer.appendChild(starDrop);
        starDrop.addEventListener('animationend', () => starDrop.remove());
    } else {
        const catDrop = document.createElement('img');
        catDrop.className = 'cat-drop';
        catDrop.src = catImages[Math.floor(Math.random() * catImages.length)];
        catDrop.alt = 'falling cat';
        const catSize = 50 + Math.random() * 80;
        catDrop.style.left = x + 'vw';
        catDrop.style.width = catSize + 'px';
        catDrop.style.height = 'auto';
        catDrop.style.animationDuration = duration + 'ms';
        catDrop.style.animationDelay = delay + 'ms';
        catLayer.appendChild(catDrop);
        catDrop.addEventListener('animationend', () => catDrop.remove());
    }
}

function triggerCatShower() {
    if (catCooldown || !brand) {
        return;
    }

    catCooldown = true;
    brand.classList.add('cat-active');

    for (let i = 0; i < 46; i += 1) {
        const isStar = Math.random() < 0.35;
        createShowerDrop(isStar);
    }

    if (brandActiveTimeout) {
        window.clearTimeout(brandActiveTimeout);
    }

    brandActiveTimeout = window.setTimeout(() => {
        brand.classList.remove('cat-active');
    }, 900);

    window.setTimeout(() => {
        catCooldown = false;
    }, 1800);
}

if (brand) {
    const catTrigger = document.createElement('span');
    catTrigger.className = 'brand-cat-trigger';
    catTrigger.textContent = '🐱';
    catTrigger.setAttribute('role', 'button');
    catTrigger.setAttribute('aria-label', 'Start cat shower');
    brand.appendChild(catTrigger);

    brand.setAttribute('title', 'Hover for 3 seconds to reveal cat, then click cat for shower');

    brand.addEventListener('mouseenter', () => {
        if (hoverRevealTimeout) {
            window.clearTimeout(hoverRevealTimeout);
        }
        hoverRevealTimeout = window.setTimeout(() => {
            brand.classList.add('cat-visible');
        }, 3000);
    });

    brand.addEventListener('mouseleave', () => {
        if (brandActiveTimeout) {
            window.clearTimeout(brandActiveTimeout);
        }
        if (hoverRevealTimeout) {
            window.clearTimeout(hoverRevealTimeout);
        }
        brand.classList.remove('cat-visible');
        brand.classList.remove('cat-active');
    });

    catTrigger.addEventListener('click', (event) => {
        event.stopPropagation();
        if (brand.classList.contains('cat-visible')) {
            triggerCatShower();
        }
    });
}

// Support click/tap flip on interest cards for touch devices.
const interestCards = document.querySelectorAll('.interest-card');

interestCards.forEach((card) => {
    card.addEventListener('click', () => {
        card.classList.toggle('is-flipped');
    });

    card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            card.classList.toggle('is-flipped');
        }
    });
});

document.addEventListener('click', (event) => {
    interestCards.forEach((card) => {
        if (!card.contains(event.target)) {
            card.classList.remove('is-flipped');
        }
    });
});
