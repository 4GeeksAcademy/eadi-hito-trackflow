document.addEventListener('DOMContentLoaded', () => {
	const form = document.querySelector('#lead-form');
	if (!form) return;

	const fields = ['companyName', 'contactPerson', 'email', 'phone', 'website', 'operatingCountry', 'productType', 'monthlyVolume', 'comments', 'privacy'];
	const messages = {
		companyName: 'El nombre de la empresa debe tener al menos 2 caracteres',
		contactPerson: 'Ingresa nombre y apellido del contacto',
		email: 'Ingresa un email corporativo válido (ejemplo: nombre@empresa.com)',
		phone: 'El teléfono debe incluir código de país (ejemplo: +1 213 555 0147)',
		website: 'Si incluyes sitio web, debe ser una URL válida',
		operatingCountry: 'Selecciona el país de operación principal',
		productType: 'Selecciona el tipo de producto que manejas',
		monthlyVolume: 'Selecciona el volumen mensual estimado',
		services: 'Selecciona al menos un servicio de interés',
		current3pl: 'Indica si actualmente trabajas con otro proveedor logístico',
		privacy: 'Debes aceptar la política de privacidad para continuar'
	};

	const showError = (name, message) => {
		const error = document.querySelector(`#${name}-error`);
		const field = document.querySelector(`#${name}`);
		if (error) error.textContent = message || '';
		if (field) {
			field.classList.toggle('is-invalid', Boolean(message));
			field.setAttribute('aria-invalid', String(Boolean(message)));
		}
		return !message;
	};

	const validate = (name) => {
		const field = form.elements[name];
		const value = typeof field?.value === 'string' ? field.value.trim() : '';
		let error = '';
		if (name === 'companyName' && value.length < 2) error = messages[name];
		if (name === 'contactPerson' && value.split(/\s+/).filter(Boolean).length < 2) error = messages[name];
		if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = messages[name];
		if (name === 'phone' && !/^\+\d[\d\s().-]{5,}$/.test(value)) error = messages[name];
		if (name === 'website' && value && !/^https?:\/\/[^\s]+$/i.test(value)) error = messages[name];
		if (['operatingCountry', 'productType', 'monthlyVolume'].includes(name) && !value) error = messages[name];
		if (name === 'comments' && value.length > 500) error = `Los comentarios no pueden exceder 500 caracteres (quedan ${500 - value.length})`;
		if (name === 'privacy' && !field.checked) error = messages[name];
		return showError(name, error);
	};

	const validateServices = () => {
		const valid = form.querySelectorAll('input[name="services"]:checked').length > 0;
		document.querySelector('#services-error').textContent = valid ? '' : messages.services;
		return valid;
	};
	const validateProvider = () => {
		const valid = Boolean(form.querySelector('input[name="current3pl"]:checked'));
		document.querySelector('#provider-error').textContent = valid ? '' : messages.current3pl;
		return valid;
	};
	const updateVolumeWarning = () => document.querySelector('#volume-warning').classList.toggle('hidden', form.elements.monthlyVolume.value !== '0-100 envíos/mes');
	const updateCounter = () => { document.querySelector('#comments-count').textContent = `${form.elements.comments.value.length} / 500`; validate('comments'); };

	fields.forEach((name) => {
		const field = form.elements[name];
		field.addEventListener('blur', () => validate(name));
		field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') validate(name); });
	});
	form.elements.comments.addEventListener('input', updateCounter);
	form.elements.monthlyVolume.addEventListener('change', updateVolumeWarning);
	form.querySelectorAll('input[name="services"]').forEach((input) => input.addEventListener('change', validateServices));
	form.querySelectorAll('input[name="current3pl"]').forEach((input) => input.addEventListener('change', validateProvider));
	form.addEventListener('reset', () => window.setTimeout(() => { document.querySelectorAll('.error').forEach((error) => { error.textContent = ''; }); document.querySelectorAll('.is-invalid').forEach((field) => field.classList.remove('is-invalid')); document.querySelector('#success-message').classList.add('hidden'); updateCounter(); updateVolumeWarning(); }, 0));
	form.addEventListener('submit', (event) => {
		event.preventDefault();
		const valid = fields.map(validate).every(Boolean) && validateServices() && validateProvider();
		if (!valid) { form.querySelector('[aria-invalid="true"]')?.focus(); return; }
		document.querySelector('#success-message').classList.remove('hidden');
		document.querySelector('#success-message').scrollIntoView({ behavior: 'smooth', block: 'center' });
	});
});
