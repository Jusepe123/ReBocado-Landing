const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('#mobile-nav');
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Abrir menú' : 'Cerrar menú');
  mobileNav.hidden = expanded;
});
mobileNav.addEventListener('click', (event) => {
  if (event.target.closest('a,button')) {
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú');
  }
});

const examples = {
  panaderia: ['El pan de hoy merece un mañana.', 'Panes, croissants o piezas de bollería que quedaron al final del día. La selección la arma el negocio con lo que tiene disponible.'],
  cafeteria: ['Una pausa que sabe todavía mejor.', 'Porciones de torta, sándwiches o productos de cafetería que no se vendieron. El negocio reúne el excedente disponible en un pack sorpresa.'],
  restaurante: ['El último plato tiene mucho para dar.', 'Porciones de comida preparada que quedaron disponibles al cierre. El tipo de comida y el horario de recojo se informan antes de reservar.']
};
document.querySelectorAll('[data-category]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-category]').forEach((item) => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    const [title, description] = examples[button.dataset.category];
    document.querySelector('#example-title').textContent = title;
    document.querySelector('#example-description').textContent = description;
  });
});

const dialog = document.querySelector('#join-dialog');
document.querySelectorAll('[data-join]').forEach((button) => {
  button.addEventListener('click', () => {
    const business = button.dataset.join === 'negocio';
    document.querySelector('#join-title').textContent = business ? 'Tu negocio puede ser parte.' : 'Tu próximo bocado empieza aquí.';
    document.querySelector('#join-description').textContent = business
      ? 'Estamos formando la primera red de negocios para rescatar excedentes en Cochabamba. Queremos conocer tu local, el tipo de comida que preparas y tus horarios.'
      : 'Estamos probando el servicio por WhatsApp en Cochabamba. Los packs dependen del excedente disponible y se recogen directamente en cada negocio.';
    const contact = window.REBOCADO_CONTACT || {};
    const container = document.querySelector('#join-contact');
    container.replaceChildren();
    const message = business ? '¡Hola, ReBocado! Tengo un negocio en Cochabamba y quiero conocer cómo sumarme al piloto. Mi negocio es: ' : '¡Hola, ReBocado! Quiero participar en el piloto de rescate de comida en Cochabamba.';
    if (/^\d{8,15}$/.test(contact.whatsapp || '') || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email || '')) {
      const link = document.createElement('a');
      link.className = 'button contact-link';
      if (/^\d{8,15}$/.test(contact.whatsapp || '')) {
        link.href = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
        link.textContent = 'Conversar por WhatsApp';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      } else {
        link.href = `mailto:${contact.email}?subject=${encodeURIComponent(business ? 'Quiero sumar mi negocio a ReBocado' : 'Quiero participar en ReBocado')}&body=${encodeURIComponent(message)}`;
        link.textContent = 'Escribir a ReBocado';
      }
      container.append(link);
    } else {
      const box = document.createElement('div');
      box.className = 'contact-pending';
      const title = document.createElement('strong');
      title.textContent = 'Estamos preparando nuestro canal de contacto.';
      const copy = document.createElement('p');
      copy.textContent = 'Pronto compartiremos aquí cómo sumarte al piloto. Por ahora, puedes conocer cómo funciona ReBocado y qué esperar de tu pack.';
      box.append(title, copy);
      container.append(box);
    }
    dialog.showModal();
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
document.querySelector('#year').textContent = String(new Date().getFullYear());
