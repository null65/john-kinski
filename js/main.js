document.querySelector('.menu-btn')?.addEventListener('click', function () {
	const nav = document.getElementById('nav');
	const open = nav.classList.toggle('open');
	this.setAttribute('aria-expanded', open);
});

document.querySelectorAll('#nav a').forEach((link) => {
	link.addEventListener('click', () => {
		const nav = document.getElementById('nav');
		const btn = document.querySelector('.menu-btn');
		if (nav?.classList.contains('open')) {
			nav.classList.remove('open');
			btn?.setAttribute('aria-expanded', 'false');
		}
	});
});

const portrait = document.getElementById('portrait');
const fallback = document.getElementById('portrait-fallback');
if (portrait && fallback) {
	portrait.addEventListener('load', () => {
		portrait.classList.add('loaded');
		fallback.hidden = true;
	});
	portrait.addEventListener('error', () => {
		fallback.hidden = false;
	});
	if (portrait.complete && portrait.naturalWidth > 0) {
		portrait.classList.add('loaded');
		fallback.hidden = true;
	}
}

const header = document.querySelector('header');
if (header) {
	window.addEventListener('scroll', () => {
		header.classList.toggle('scrolled', window.scrollY > 20);
	}, { passive: true });
}

const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length && 'IntersectionObserver' in window) {
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
	revealEls.forEach((el) => observer.observe(el));
}
