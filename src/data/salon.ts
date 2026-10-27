// Dane salonu w jednym miejscu. Źródła: wpis w CEIDG (nazwa, NIP, REGON, adres działalności) i materiały salonu
// (telefon, Instagram, profil w Booksy). Adresu do doręczeń z CEIDG celowo tu nie ma.

const address = {
  street: 'ul. Odrodzenia 25A/1A',
  postalCode: '59-300',
  city: 'Lubin',
};

export const salon = {
  name: 'Azyl Piękna',
  owner: 'Julia Wróbel',
  role: 'Magister kosmetologii i trycholog',
  url: 'https://azylpieknajw.pl/',
  booksy: 'https://azylpieknajw.booksy.com/',
  // twarde spacje: numer nie łamie się na końcu wiersza
  phone: { label: '+48\u00a0660\u00a0249\u00a0109', href: 'tel:+48660249109' },
  instagram: { label: '@azylpieknajw', href: 'https://www.instagram.com/azylpieknajw/' },
  address,
  directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${address.street}, ${address.postalCode} ${address.city}`,
  )}`,
  nip: '9131641483',
  regon: '541454943',
  // ocena z profilu w Booksy; przy zmianie zaktualizuj też datę
  reviews: { average: '4,98', count: 195, asOf: 'wrzesień 2026' },
} as const;

export const NEW_TAB = '(otwiera się w nowej karcie)';
