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

async function loadHomepageContent() {
	const announcement = document.getElementById('homepage-announcement');
	const button = document.getElementById('homepage-button');
	if (!announcement || !button) return;

	try {
		const res = await fetch('data/homepage.yml');
		if (!res.ok) return;
		const data = parseSimpleYaml(await res.text());
		if (data.announcement_text) {
			announcement.textContent = data.announcement_text;
		}
		if (data.button_label && data.destination_url) {
			button.textContent = data.button_label;
			button.href = data.destination_url;
			button.hidden = false;
		}
	} catch {
		// Keep static fallbacks in HTML if fetch fails
	}
}

loadHomepageContent();
