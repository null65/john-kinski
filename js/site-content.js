function parseSimpleYaml(text) {
	const data = {};
	for (const line of text.split('\n')) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		const idx = trimmed.indexOf(':');
		if (idx === -1) continue;
		const key = trimmed.slice(0, idx).trim();
		let value = trimmed.slice(idx + 1).trim();
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}
		data[key] = value;
	}
	return data;
}

function isTrue(value) {
	return value === true || value === 'true';
}

async function fetchYaml(path) {
	const res = await fetch(path);
	if (!res.ok) return null;
	return parseSimpleYaml(await res.text());
}

async function fetchJson(path) {
	const res = await fetch(path);
	if (!res.ok) return null;
	return res.json();
}

function setText(id, value) {
	const el = document.getElementById(id);
	if (el && value) el.textContent = value;
}

function setHtml(id, value) {
	const el = document.getElementById(id);
	if (el && value) el.innerHTML = value;
}

function setLink(id, label, href) {
	const el = document.getElementById(id);
	if (!el || !label || !href) return;
	el.textContent = label;
	el.href = href;
	el.hidden = false;
}

async function loadAnnouncement() {
	const data = await fetchYaml('data/announcement.yml');
	if (!data || !isTrue(data.show) || !data.message) return;

	const bar = document.getElementById('site-announcement');
	const text = document.getElementById('site-announcement-text');
	const link = document.getElementById('site-announcement-link');
	if (!bar || !text) return;

	text.textContent = data.message;
	bar.hidden = false;

	if (data.link_url && link) {
		link.href = data.link_url;
		link.hidden = false;
		bar.classList.add('site-announcement--linked');
	}
}

async function loadHero() {
	const data = await fetchYaml('data/hero.yml');
	if (!data) return;

	setText('hero-title', data.title);
	setText('hero-lead-1', data.lead_1);
	setText('hero-lead-2', data.lead_2);
	setText('hero-stat-1-value', data.stat_1_value);
	setText('hero-stat-1-label', data.stat_1_label);
	setText('hero-stat-2-value', data.stat_2_value);
	setText('hero-stat-2-label', data.stat_2_label);
	setText('hero-stat-3-value', data.stat_3_value);
	setText('hero-stat-3-label', data.stat_3_label);
	setLink('hero-btn-primary', data.btn_primary_label, data.btn_primary_url);
	setLink('hero-btn-secondary', data.btn_secondary_label, data.btn_secondary_url);
}

async function loadIntro() {
	const data = await fetchYaml('data/intro.yml');
	if (!data) return;
	setText('intro-p1', data.paragraph_1);
	setText('intro-p2', data.paragraph_2);
}

async function loadFeatured() {
	const data = await fetchYaml('data/featured.yml');
	if (!data) return;

	setText('featured-badge', data.badge);
	setText('featured-title', data.title);
	setText('featured-description', data.description);
	setLink('featured-btn-primary', data.btn_primary_label, data.btn_primary_url);
	setLink('featured-btn-secondary', data.btn_secondary_label, data.btn_secondary_url);
}

async function loadBanner() {
	const data = await fetchYaml('data/homepage.yml');
	if (!data) return;
	setText('homepage-announcement', data.announcement_text);
	setLink('homepage-button', data.button_label, data.destination_url);
}

async function loadNews() {
	const data = await fetchJson('data/news.json');
	const section = document.getElementById('news-section');
	const list = document.getElementById('news-list');
	if (!data?.items?.length || !section || !list) return;

	list.innerHTML = data.items.map((item) => {
		const date = item.date
			? new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
			: '';
		const link = item.url
			? `<a href="${item.url}" class="news-card-link" target="_blank" rel="noopener noreferrer">Read more</a>`
			: '';
		return `
			<article class="news-card reveal">
				${date ? `<time class="news-card-date">${date}</time>` : ''}
				<h3 class="news-card-title">${item.title}</h3>
				<p class="news-card-summary">${item.summary}</p>
				${link}
			</article>
		`;
	}).join('');

	section.hidden = false;
	document.querySelectorAll('#news-list .reveal').forEach((el) => {
		if ('IntersectionObserver' in window) {
			const observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible');
						observer.unobserve(entry.target);
					}
				});
			}, { threshold: 0.12 });
			observer.observe(el);
		} else {
			el.classList.add('visible');
		}
	});
}

async function loadContact() {
	const data = await fetchYaml('data/contact.yml');
	if (!data) return;

	setText('contact-page-title', data.page_title);
	setText('contact-page-subtitle', data.page_subtitle);
	setText('contact-email-heading', data.email_heading);
	setText('contact-email-intro', data.email_intro);
	setText('contact-press-heading', data.press_heading);
	setText('contact-press-intro', data.press_intro);
}

async function initSiteContent() {
	const tasks = [loadAnnouncement()];

	if (document.getElementById('hero-title')) {
		tasks.push(loadHero(), loadIntro(), loadFeatured(), loadBanner(), loadNews());
	}

	if (document.getElementById('contact-page-title')) {
		tasks.push(loadContact());
	}

	await Promise.all(tasks);
}

initSiteContent();
