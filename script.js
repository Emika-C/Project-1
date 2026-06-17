const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const currentKey = currentPage.replace('.html', '');

document.querySelectorAll('.tab-nav a').forEach((link) => {
    if (link.dataset.nav === currentKey) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
    }
});

const themeStorageKey = 'emika-theme';
const tourStorageKey = 'emika-tour-state';
const siteHeader = document.querySelector('.site-header');
let themeToggle = null;
let tourGuideToggle = null;

function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-mode', isDark);

    if (themeToggle) {
        themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
}

function getInitialTheme() {
    const savedTheme = window.localStorage.getItem(themeStorageKey);
    if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

if (siteHeader) {
    const headerControls = document.createElement('div');
    headerControls.className = 'header-controls';

    themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.type = 'button';
    headerControls.appendChild(themeToggle);

    tourGuideToggle = document.createElement('button');
    tourGuideToggle.className = 'tour-guide-toggle';
    tourGuideToggle.type = 'button';
    tourGuideToggle.textContent = 'Tour Guide';
    tourGuideToggle.setAttribute('aria-label', 'Open cat tour guide');
    headerControls.appendChild(tourGuideToggle);

    siteHeader.appendChild(headerControls);

    themeToggle.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        window.localStorage.setItem(themeStorageKey, nextTheme);
        applyTheme(nextTheme);
    });
}

applyTheme(getInitialTheme());

const tourSteps = [
    {
        title: 'Meow! Welcome to the website!',
        text: 'Hello! I am your cat tour guide. I will show you the features of this website, such as how to explore the tabs.',
        selector: '.site-header .brand',
        panelPlacement: 'bottom-right',
        arrowDirection: 'none'
    },
    {
        title: 'Navigation Tabs',
        text: 'Click on these tabs to switch between pages.',
        selector: '.tab-nav',
        panelPlacement: 'top-center',
        panelTop: '10.8rem',
        arrowDirection: 'up',
        arrowAlign: 'center'
    },
    {
        title: 'Dark/Light Mode',
        text: 'Tap the dark/light mode button to switch the site\'s theme.',
        selector: '.theme-toggle',
        panelPlacement: 'top-right',
        panelTop: '4.8rem',
        arrowDirection: 'up',
        arrowAlign: 'right',
        arrowTargetSelector: '.theme-toggle'
    },
    {
        title: 'Interests Cards',
        text: 'On the Interests page, hover over cards to flip them and reveal more details. Visit the Interests page anytime.',
        selector: '.interest-card',
        panelPlacement: 'top-left',
        panelTop: '10.4rem',
        arrowDirection: 'up',
        arrowAlign: 'center',
        panelTargetSelector: '.tab-nav a[data-nav="interests"]'
    },
    {
        title: 'Favorites Cards',
        text: 'On the Favorites page, hover over cards similarly to flip them and reveal details. Visit the Favorites page anytime.',
        selector: '.favorite-card',
        panelPlacement: 'top-left',
        panelTop: '10.4rem',
        arrowDirection: 'up',
        arrowAlign: 'center',
        panelTargetSelector: '.tab-nav a[data-nav="favorites"]'
    }
];

let tourPanel = null;
let tourTitle = null;
let tourText = null;
let tourCounter = null;
let tourPrevBtn = null;
let tourNextBtn = null;
let tourCloseBtn = null;
let tourCurrentStep = 0;

function saveTourState() {
    window.sessionStorage.setItem(tourStorageKey, JSON.stringify({
        open: true,
        step: tourCurrentStep
    }));
}

function clearTourState() {
    window.sessionStorage.removeItem(tourStorageKey);
}

function consumeTourState() {
    const rawState = window.sessionStorage.getItem(tourStorageKey);
    if (!rawState) {
        return null;
    }
    clearTourState();
    try {
        return JSON.parse(rawState);
    } catch {
        return null;
    }
}

function clearTourHighlights() {
    document.querySelectorAll('.tour-highlight').forEach((element) => {
        element.classList.remove('tour-highlight');
    });
}

function highlightTourTarget(step) {
    clearTourHighlights();
    if (!step.selector) {
        return;
    }

    const targets = document.querySelectorAll(step.selector);
    if (targets.length > 0) {
        targets.forEach((element) => element.classList.add('tour-highlight'));
        return;
    }

    if (step.fallbackText) {
        tourText.textContent = step.fallbackText;
    }
}

function updateTourPanelPlacement(step) {
    const placements = ['top-center', 'top-left', 'top-right', 'bottom-center', 'bottom-left', 'bottom-right'];
    const arrows = ['up', 'down', 'left', 'right'];
    const arrowAlignments = ['left', 'center', 'right'];

    placements.forEach((placement) => {
        tourPanel.classList.remove('tour-pos-' + placement);
    });
    arrows.forEach((arrow) => {
        tourPanel.classList.remove('tour-arrow-' + arrow);
    });
    arrowAlignments.forEach((alignment) => {
        tourPanel.classList.remove('tour-arrow-align-' + alignment);
    });

    const panelPlacement = step.panelPlacement || 'bottom-right';
    tourPanel.classList.add('tour-pos-' + panelPlacement);

    if (step.arrowDirection && step.arrowDirection !== 'none') {
        tourPanel.classList.add('tour-arrow-' + step.arrowDirection);
        tourPanel.classList.add('tour-arrow-align-' + (step.arrowAlign || 'center'));
    }
}

function updateTourArrowTarget(step) {
    tourPanel.style.removeProperty('--tour-arrow-x');

    if (!step.arrowTargetSelector) {
        return;
    }

    const target = document.querySelector(step.arrowTargetSelector);
    if (!target) {
        return;
    }

    const panelRect = tourPanel.getBoundingClientRect();
    if (panelRect.width === 0) {
        return;
    }

    const targetRect = target.getBoundingClientRect();
    const arrowX = targetRect.left + targetRect.width / 2 - panelRect.left;
    const clampedArrowX = Math.min(Math.max(arrowX, 24), panelRect.width - 24);
    tourPanel.style.setProperty('--tour-arrow-x', clampedArrowX + 'px');
}

function updateTourPanelTargetPosition(step) {
    tourPanel.style.removeProperty('left');
    tourPanel.style.removeProperty('right');
    tourPanel.style.removeProperty('top');

    if (step.panelTop) {
        tourPanel.style.top = step.panelTop;
    }

    if (!step.panelTargetSelector || window.matchMedia('(max-width: 680px)').matches) {
        return;
    }

    const target = document.querySelector(step.panelTargetSelector);
    if (!target) {
        return;
    }

    const panelRect = tourPanel.getBoundingClientRect();
    if (panelRect.width === 0) {
        return;
    }

    const targetRect = target.getBoundingClientRect();
    const viewportPadding = 12;
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const minLeft = viewportPadding;
    const maxLeft = window.innerWidth - panelRect.width - viewportPadding;
    const panelLeft = Math.min(Math.max(targetCenterX - panelRect.width / 2, minLeft), maxLeft);

    tourPanel.style.left = panelLeft + 'px';
    tourPanel.style.right = 'auto';
}

function renderTourStep() {
    const step = tourSteps[tourCurrentStep];
    tourTitle.textContent = step.title;
    tourText.textContent = step.text;
    tourCounter.textContent = 'Step ' + (tourCurrentStep + 1) + ' of ' + tourSteps.length;
    tourPrevBtn.disabled = tourCurrentStep === 0;
    tourNextBtn.textContent = tourCurrentStep === tourSteps.length - 1 ? 'Finish' : 'Next';

    updateTourPanelPlacement(step);
    updateTourPanelTargetPosition(step);
    updateTourArrowTarget(step);
    highlightTourTarget(step);
}

function closeTourGuide() {
    if (!tourPanel) {
        return;
    }
    tourPanel.classList.remove('is-open');
    clearTourHighlights();
    clearTourState();
}

function openTourGuide() {
    if (!tourPanel) {
        return;
    }
    clearTourState();
    tourCurrentStep = 0;
    tourPanel.classList.add('is-open');
    renderTourStep();
}

function buildTourPanel() {
    tourPanel = document.createElement('section');
    tourPanel.className = 'tour-guide-panel';
    tourPanel.setAttribute('aria-live', 'polite');

    tourCloseBtn = document.createElement('button');
    tourCloseBtn.className = 'tour-close-btn';
    tourCloseBtn.type = 'button';
    tourCloseBtn.textContent = 'Close';
    tourCloseBtn.setAttribute('aria-label', 'Close tour guide');

    const tourCat = document.createElement('div');
    tourCat.className = 'tour-cat-avatar';
    tourCat.textContent = '🐾🐱';

    tourTitle = document.createElement('h3');
    tourTitle.className = 'tour-title';

    tourText = document.createElement('p');
    tourText.className = 'tour-text';

    tourCounter = document.createElement('p');
    tourCounter.className = 'tour-counter';

    const controls = document.createElement('div');
    controls.className = 'tour-controls';

    tourPrevBtn = document.createElement('button');
    tourPrevBtn.className = 'tour-nav-btn';
    tourPrevBtn.type = 'button';
    tourPrevBtn.textContent = 'Back';

    tourNextBtn = document.createElement('button');
    tourNextBtn.className = 'tour-nav-btn tour-nav-btn-primary';
    tourNextBtn.type = 'button';
    tourNextBtn.textContent = 'Next';

    controls.appendChild(tourPrevBtn);
    controls.appendChild(tourNextBtn);

    tourPanel.appendChild(tourCloseBtn);
    tourPanel.appendChild(tourCat);
    tourPanel.appendChild(tourTitle);
    tourPanel.appendChild(tourText);
    tourPanel.appendChild(tourCounter);
    tourPanel.appendChild(controls);

    document.body.appendChild(tourPanel);

    tourCloseBtn.addEventListener('click', closeTourGuide);

    tourPrevBtn.addEventListener('click', () => {
        if (tourCurrentStep > 0) {
            tourCurrentStep -= 1;
            renderTourStep();
        }
    });

    tourNextBtn.addEventListener('click', () => {
        if (tourCurrentStep >= tourSteps.length - 1) {
            closeTourGuide();
            return;
        }
        tourCurrentStep += 1;
        renderTourStep();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && tourPanel.classList.contains('is-open')) {
            closeTourGuide();
        }
    });
}

buildTourPanel();

const savedTourState = consumeTourState();
if (savedTourState && savedTourState.open) {
    const maxStep = tourSteps.length - 1;
    tourCurrentStep = Math.min(Math.max(savedTourState.step || 0, 0), maxStep);
    tourPanel.classList.add('is-open');
    renderTourStep();
}

if (tourGuideToggle) {
    tourGuideToggle.addEventListener('click', () => {
        if (tourPanel.classList.contains('is-open')) {
            closeTourGuide();
            return;
        }
        openTourGuide();
    });
}

document.querySelectorAll('.tab-nav a').forEach((link) => {
    link.addEventListener('click', () => {
        if (tourPanel && tourPanel.classList.contains('is-open')) {
            saveTourState();
        }
    });
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

    brand.addEventListener('click', () => {
        if (brand.classList.contains('cat-visible')) {
            triggerCatShower();
        }
    });
}

// Support click/tap flip on card components for touch devices.
const flippableCards = document.querySelectorAll('.interest-card, .favorite-card');

flippableCards.forEach((card) => {
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
    flippableCards.forEach((card) => {
        if (!card.contains(event.target)) {
            card.classList.remove('is-flipped');
        }
    });
});
