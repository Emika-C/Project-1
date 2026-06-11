const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const currentKey = currentPage.replace('.html', '');

document.querySelectorAll('.tab-nav a').forEach((link) => {
    if (link.dataset.nav === currentKey) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
    }
});
