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

let catCooldown = false;
let brandActiveTimeout = null;
let hoverRevealTimeout = null;

function createShowerDrop(character, isStar) {
    const drop = document.createElement('span');
    drop.className = isStar ? 'cat-drop star-drop' : 'cat-drop';
    drop.textContent = character;

    const x = Math.random() * 100;
    const duration = 1800 + Math.random() * 2200;
    const delay = Math.random() * 650;
    const size = isStar ? 0.9 + Math.random() * 1.1 : 1.1 + Math.random() * 1.2;

    drop.style.left = x + 'vw';
    drop.style.fontSize = size + 'rem';
    drop.style.animationDuration = duration + 'ms';
    drop.style.animationDelay = delay + 'ms';

    catLayer.appendChild(drop);
    drop.addEventListener('animationend', () => drop.remove());
}

function triggerCatShower() {
    if (catCooldown || !brand) {
        return;
    }

    catCooldown = true;
    brand.classList.add('cat-active');

    for (let i = 0; i < 46; i += 1) {
        const isStar = Math.random() < 0.35;
        const char = isStar ? (Math.random() < 0.5 ? '⭐' : '✨') : '🐱';
        createShowerDrop(char, isStar);
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
