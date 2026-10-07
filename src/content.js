export const contacts = [
  { id: 'jose', name: 'José Andrés Cisternas Zurita', shortName: 'José Andrés', photo: '/assets/jose-cisternas.jpeg', role: 'Producto y comunidad', phone: '63923958', internationalPhone: '59163923958', email: 'joseandrescisternaszurita@gmail.com' },
  { id: 'matt', name: 'Matt Gonzalo Lazarte', shortName: 'Matt', photo: '/assets/matt-lazarte.jpeg', role: 'Negocios y alianzas', phone: '75499689', internationalPhone: '59175499689', email: 'mattlazarte10@gmail.com' },
];

export function whatsappUrl(contact, audience = 'consumidor') {
  const message = audience === 'negocio'
    ? '¡Hola, ReBocado! Tengo un negocio en Cochabamba y me gustaría sumarlo al piloto de rescate de alimentos.'
    : '¡Hola, ReBocado! Quiero participar en el piloto de packs sorpresa en Cochabamba. ¿Cómo puedo sumarme?';
  return `https://wa.me/${contact.internationalPhone}?text=${encodeURIComponent(message)}`;
}

export const packs = [
  { id: 'panaderias', label: 'Panaderías', title: 'El pan de hoy tiene mucho para dar.', description: 'Panes, croissants y piezas de bollería que quedaron al final del día. La selección cambia con el excedente del negocio.', image: '/assets/food-hero.webp', alt: 'Bolsa de papel con panes dorados, croissants y fruta fresca', badge: 'Un bocado recién descubierto', tags: ['Panes y bollería', 'Recojo al cierre'] },
  { id: 'cafeterias', label: 'Cafeterías', title: 'Una pausa que sabe todavía mejor.', description: 'Una porción de torta, un sándwich o una pieza de pastelería. Pequeñas delicias que todavía merecen una buena mesa.', image: '/assets/cafe.webp', alt: 'Porciones de torta, un sándwich y pastelería en una caja de papel', badge: 'Dale otra oportunidad a tu antojo', tags: ['Pastelería y bocados', 'Contenido sorpresa'] },
  { id: 'restaurantes', label: 'Restaurantes', title: 'El último plato también se disfruta.', description: 'Porciones de comida preparada que siguen en buen estado. El negocio informa el tipo de comida y el horario antes de reservar.', image: '/assets/meal.webp', alt: 'Comida preparada con arroz, pollo y verduras en un recipiente de papel', badge: 'Buena comida, hasta el final', tags: ['Comida preparada', 'Recojo en el local'] },
];

export const questions = [
  ['¿Es comida en buen estado?', 'Sí. Rescatamos alimentos aptos para consumo que los negocios no lograron vender. El precio menor responde al excedente y al tiempo disponible para venderlo. No regalamos desechos: conectamos buena comida con alguien que la disfruta.'],
  ['¿Qué incluye un pack sorpresa?', 'Depende del excedente real del negocio ese día. Antes de reservar conocerás el tipo de comida, el precio y la ventana de recojo. Las piezas exactas son sorpresa. Las imágenes de esta página son ilustrativas, no ofertas disponibles.'],
  ['¿Cómo se reserva, se paga y se recoge?', 'Durante el piloto compartimos los packs por WhatsApp. Reservas, te acercas al negocio dentro del horario acordado y pagas allí. El recojo es en el local; no ofrecemos delivery.'],
  ['¿Qué pasa si tengo alergias o restricciones?', 'Consulta al negocio antes de reservar. Como el contenido cambia, no podemos garantizar que todos los packs se adapten a una alergia o dieta. Si no puedes confirmar los ingredientes y posibles alérgenos, no reserves ese pack.'],
  ['¿Ya hay una aplicación disponible?', 'Estamos preparando una primera prueba local con un restaurante de Cochabamba. Las reservas del piloto se coordinarán por WhatsApp. La aplicación está en desarrollo y anunciaremos su disponibilidad cuando esté lista.'],
];
