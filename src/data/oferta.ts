// Oferta salonu: cztery obszary, każdy ma swoją podstronę. Nazwy usług i czasy trwania pochodzą z Booksy,
// opisy są napisane od nowa (bez cen i bez obietnic efektów). Ceny i wolne terminy są tylko w Booksy.

export interface Variant {
  name: string;
  duration: string;
}

export interface TreatmentGroup {
  name: string;
  text: string[];
  variants: Variant[];
  note?: string;
}

export interface Category {
  slug: string;
  name: string;
  /** krótki opis w menu i w odnośnikach do innych podstron */
  menuLine: string;
  /** opis na stronie głównej */
  teaser: string;
  tags: string[];
  /** grafika z src/assets/grafiki i miejsce na zdjęcie z src/assets/zdjecia (nazwy plików bez rozszerzenia) */
  art: string;
  photo: string;
  seo: { title: string; description: string };
  eyebrow: string;
  /** nagłówek podstrony: druga część jest wyróżniona kursywą */
  title: [string, string];
  intro: string;
  groups: TreatmentGroup[];
  forWhom: string[];
  preparation: { title: string; items: string[] };
}

export const categories: Category[] = [
  {
    slug: 'head-spa-i-trychologia',
    name: 'Head Spa i trychologia',
    menuLine: 'Rytuały Head Spa i konsultacje z trichoskopią',
    teaser:
      'Rytuał pielęgnacji skóry głowy połączony z masażem i chwilą wyciszenia oraz konsultacja trychologiczna z badaniem skóry głowy kamerą.',
    tags: ['Head Spa Classic', 'Head and Face Spa', 'Head Spa Kids', 'Konsultacja trychologiczna'],
    art: 'satyna-mokka',
    photo: 'head-spa',
    seo: {
      title: 'Head Spa Lubin i trycholog w Lubinie · Azyl Piękna',
      description:
        'Head Spa w Lubinie: Head Spa Classic, Head and Face Spa i Head Spa Kids. Konsultacja trychologiczna z trichoskopią u Julii Wróbel, trychologa. Rezerwacja w Booksy.',
    },
    eyebrow: 'Head Spa Lubin · Trycholog Lubin',
    title: ['Head Spa', 'i trychologia'],
    intro:
      'Skóra głowy potrzebuje uwagi tak samo jak skóra twarzy, a rzadko ją dostaje. Zajmuję się nią na dwa sposoby: podczas rytuału Head Spa, który łączy pielęgnację z głębokim odprężeniem, i podczas konsultacji trychologicznej, na której oglądam skórę głowy i włosy w dużym powiększeniu.',
    groups: [
      {
        name: 'Head Spa Classic',
        text: [
          'Rytuał pielęgnacyjno-relaksacyjny dla skóry głowy. Zaczynam od rozmowy i trichoskopii, czyli obejrzenia skóry głowy kamerą trychologiczną. Potem peeling, mycie i odżywka, kilka minut sauny i hydromasaż: włosy polewam naparem ziołowym lub olejkami, a skórę głowy masuję strumieniem wody, dłońmi i masażerami.',
          'Na koniec nakładam odżywkę termoochronną, suszę włosy i jeszcze raz oglądam skórę głowy kamerą, żeby porównać obraz sprzed rytuału i po nim. Jeśli chcesz wracać regularnie, polecam Head Spa raz lub dwa razy w miesiącu.',
        ],
        variants: [{ name: 'Head Spa Classic', duration: '90 min' }],
      },
      {
        name: 'Head and Face Spa',
        text: [
          'Rozszerzona wersja rytuału. Do wszystkich etapów Head Spa Classic dochodzi relaksacyjny masaż twarzy, ramion, dekoltu i karku.',
          'W wersji Premium wybierasz jeszcze jeden z trzech rytuałów: ciepłą kąpiel stóp w soli magnezowej, rytuał dłoni z maską parafinową i masażem albo oksybrazję skóry głowy z ampułką dobraną do jej potrzeb.',
        ],
        variants: [
          { name: 'Pełen relaks', duration: '120 min' },
          { name: 'Premium', duration: '150 min' },
        ],
      },
      {
        name: 'Head Spa Kids',
        text: [
          'Łagodny rytuał dla dzieci od 5 do 13 lat: obejrzenie skóry głowy kamerą, peeling i masaż głowy, mycie, odżywka, krótka, około dwuminutowa sauna i masaż dłońmi. Spokojna chwila w przyjaznej atmosferze, na przykład po szkole.',
        ],
        variants: [{ name: 'Head Spa Kids', duration: '60 min' }],
      },
      {
        name: 'Konsultacja trychologiczna z trichoskopią',
        text: [
          'Dla osób, które niepokoi stan skóry głowy lub włosów: nadmierne wypadanie, łupież, swędzenie albo przetłuszczanie. Zaczynam od szczegółowego wywiadu o zdrowiu i codziennej pielęgnacji, a potem badam skórę głowy, mieszki włosowe i włosy kamerą trychologiczną.',
          'Wyniki omawiam z Tobą od razu. Dostajesz zalecenia pielęgnacyjne i dietetyczne oraz wskazówki dotyczące ewentualnych badań laboratoryjnych i suplementacji.',
        ],
        variants: [{ name: 'Konsultacja z badaniem trichoskopem', duration: '60 min' }],
        note: 'Konsultacja trychologiczna nie zastępuje wizyty u lekarza.',
      },
    ],
    forWhom: [
      'Gdy chcesz zadbać o skórę głowy i przy okazji naprawdę odpocząć.',
      'Gdy dokucza Ci przetłuszczanie, łupież, swędzenie albo nadmierne wypadanie włosów i chcesz lepiej zrozumieć, co dzieje się ze skórą głowy.',
      'Dla dzieci od 5 do 13 lat: Head Spa Kids to krótszy, łagodny rytuał.',
    ],
    preparation: {
      title: 'Przed konsultacją trychologiczną',
      items: [
        'Nie myj głowy przez 24–48 godzin przed wizytą.',
        'W dniu badania nie używaj produktów do stylizacji.',
        'Nie farbuj włosów co najmniej przez 7 dni przed wizytą.',
        'Zabierz listę przyjmowanych leków, suplementów i kosmetyków.',
        'Jeśli masz wyniki badań krwi z ostatnich 6 miesięcy, weź je ze sobą.',
      ],
    },
  },
  {
    slug: 'zabiegi-na-twarz',
    name: 'Zabiegi na twarz',
    menuLine: 'PCA Skin, oczyszczanie wodorowe, peeling kawitacyjny',
    teaser:
      'Peelingi PCA Skin, oczyszczanie wodorowe, peeling kawitacyjny i zabiegi Hydro. Zabieg dobieram po obejrzeniu skóry i rozmowie o Twojej pielęgnacji.',
    tags: ['Peelingi PCA Skin', 'Oczyszczanie wodorowe', 'Peeling kawitacyjny', 'Zabiegi Hydro'],
    art: 'satyna-kosc-sloniowa',
    photo: 'twarz',
    seo: {
      title: 'Zabiegi na twarz Lubin: PCA Skin, oczyszczanie wodorowe · Azyl Piękna',
      description:
        'Salon kosmetologiczny w Lubinie: peelingi PCA Skin, oczyszczanie wodorowe, peeling kawitacyjny, HydroClean PRO, HydroGlow i HydroLift. Zabieg dobrany do skóry. Rezerwacja w Booksy.',
    },
    eyebrow: 'Salon kosmetologiczny Lubin',
    title: ['Zabiegi', 'na twarz'],
    intro:
      'Nie ma jednego zabiegu, który pasuje do każdej skóry. Zanim cokolwiek zaproponuję, oglądam skórę i pytam o Twoją codzienną pielęgnację, leki i oczekiwania. Jeśli nie wiesz, od czego zacząć, wybierz zabieg dobrany do potrzeb skóry, a resztę ustalimy na miejscu.',
    groups: [
      {
        name: 'Na początek',
        text: [
          'Dwa zabiegi z myślą o pierwszej wizycie. Każdy zaczyna się od krótkiej konsultacji, po której dobieram etapy pielęgnacji i kosmetyki. Dłuższa wersja obejmuje dokładniejszą diagnostykę skóry i wywiad kosmetologiczny.',
        ],
        variants: [
          { name: 'Zabieg „Na dzień dobry”', duration: '90 min' },
          { name: 'Zabieg dobrany do potrzeb skóry', duration: '120 min' },
        ],
      },
      {
        name: 'Peelingi PCA Skin',
        text: [
          'Profesjonalne peelingi chemiczne marki PCA Skin na trzech poziomach. Poziom I to zabieg na start: maska, kwas złuszczający i serum dobrane do skóry. Poziom II łączy zabieg Oxy Trio z maskami lub serum. Poziom III zaczyna się od oczyszczania wodorowego albo peelingu kawitacyjnego, po którym nakładam produkty PCA Skin.',
          'Osobno wykonuję PCA Skin Trio, zabieg w trzech etapach: detoksykacja, dotlenienie i stymulacja serum z niacynamidem i kwasem salicylowym. Każdy poziom jest w wersji na twarz albo na twarz, szyję i dekolt.',
        ],
        variants: [
          { name: 'Poziom I', duration: '60 lub 90 min' },
          { name: 'Poziom II', duration: '60 lub 90 min' },
          { name: 'Poziom III', duration: '90 lub 120 min' },
          { name: 'PCA Skin Trio', duration: '60 lub 90 min' },
        ],
      },
      {
        name: 'Oczyszczanie wodorowe',
        text: [
          'Wieloetapowe oczyszczanie skóry z wykorzystaniem aktywnego wodoru: usuwa zanieczyszczenia z porów i jednocześnie nawilża skórę. Wykonuję je jako osobny zabieg albo jako przygotowanie skóry do dalszej pielęgnacji.',
        ],
        variants: [{ name: 'Oczyszczanie wodorowe', duration: '90 min' }],
      },
      {
        name: 'Peeling kawitacyjny',
        text: [
          'Oczyszczanie skóry ultradźwiękami, które usuwa martwy naskórek i nadmiar sebum. Potem, zależnie od potrzeb skóry, sonoforeza, czyli wprowadzenie składników aktywnych ultradźwiękami, albo oksybrazja strumieniem soli fizjologicznej i tlenu. Na koniec maska.',
        ],
        variants: [{ name: 'Z sonoforezą lub oksybrazją i maską', duration: '60 min' }],
      },
      {
        name: 'Zabiegi Hydro',
        text: [
          'Zabiegi oparte na infuzji wodnej. HydroClean PRO to głębokie oczyszczanie z myślą o cerze tłustej, mieszanej i zanieczyszczonej. HydroGlow Soft Touch łączy łagodne oczyszczanie z nawilżeniem. HydroLift Age+ to pielęgnacja liftingująco-nawilżająca dla skóry dojrzałej.',
        ],
        variants: [
          { name: 'HydroClean PRO', duration: '120 min' },
          { name: 'HydroGlow Soft Touch', duration: '120 min' },
          { name: 'HydroLift Age+', duration: '120 min' },
        ],
      },
      {
        name: 'Na wyjście i dla relaksu',
        text: [
          'Zabieg bankietowy przygotowuje skórę przed ważnym wydarzeniem, sesją zdjęciową albo ślubem. Masaż twarzy rozluźnia napięcie mięśni twarzy i dobrze uzupełnia inne zabiegi.',
        ],
        variants: [
          { name: 'Zabieg bankietowy', duration: '90 min' },
          { name: 'Masaż twarzy', duration: '45 min' },
          { name: 'Masaż twarzy, szyi i dekoltu', duration: '60 min' },
        ],
      },
    ],
    forWhom: [
      'Gdy chcesz regularnie i świadomie dbać o skórę twarzy.',
      'Gdy nie wiesz, od czego zacząć, i potrzebujesz pomocy w doborze zabiegu.',
      'Przy skórze wrażliwej: łagodniejsze zabiegi dobieram po rozmowie.',
      'Przed ważnym wydarzeniem, gdy zależy Ci na świeżym wyglądzie skóry.',
    ],
    preparation: {
      title: 'Przed zabiegiem i po nim',
      items: [
        'Powiedz mi o lekach, alergiach i kosmetykach, których używasz, zwłaszcza z retinoidami lub kwasami.',
        'Po peelingach PCA Skin przez kilka dni codziennie stosuj krem z filtrem SPF 50 i unikaj sauny, gorących kąpieli oraz przegrzewania skóry.',
        'Nie zdzieraj złuszczającego się naskórka. Pełne zalecenia dostaniesz ode mnie po zabiegu.',
      ],
    },
  },
  {
    slug: 'manicure-i-pedicure',
    name: 'Manicure i pedicure',
    menuLine: 'Hybryda, manicure japoński, pedicure SPA',
    teaser:
      'Manicure hybrydowy, japoński i klasyczny, przedłużanie żelem oraz pedicure SPA z pełną pielęgnacją stóp. Także w wersjach dla panów.',
    tags: ['Manicure hybrydowy', 'Manicure japoński', 'Pedicure SPA', 'Przedłużanie żelem'],
    art: 'satyna-pudrowa',
    photo: 'dlonie',
    seo: {
      title: 'Manicure i pedicure Lubin: hybryda, pedicure SPA · Azyl Piękna',
      description:
        'Manicure hybrydowy, japoński i klasyczny, przedłużanie żelem, pedicure hybrydowy, pedicure SPA i japoński w Lubinie. Także dla mężczyzn. Salon Azyl Piękna, ul. Odrodzenia 25A/1A.',
    },
    eyebrow: 'Manicure i pedicure Lubin',
    title: ['Manicure', 'i pedicure'],
    intro:
      'Zadbane dłonie i stopy to drobiazg, który czuć na co dzień. Każda wizyta zaczyna się od starannego opracowania skórek i płytki, a przy pedicure SPA liczy się pielęgnacja stóp, nie tylko kolor.',
    groups: [
      {
        name: 'Manicure',
        text: [
          'Manicure hybrydowy daje kolor, który utrzymuje się dłużej niż zwykły lakier. Klasyczny manicure kończy się lakierem albo odżywką wzmacniającą.',
          'Manicure japoński to propozycja dla cienkich, łamliwych paznokci i na przerwę od hybrydy. Po opracowaniu skórek i kształtu w płytkę wmasowuje się pastę z witaminami A i E oraz keratyną, a puder zabezpieczający nadaje paznokciom naturalny połysk bez lakieru.',
        ],
        variants: [
          { name: 'Manicure hybrydowy', duration: '90 min' },
          { name: 'Manicure japoński', duration: '60 min' },
          { name: 'Manicure klasyczny z lakierem lub odżywką', duration: '60 min' },
          { name: 'Manicure męski', duration: '60 min' },
        ],
      },
      {
        name: 'Przedłużanie żelem',
        text: ['Przedłużanie paznokci metodą żelową i ich uzupełnianie przy kolejnych wizytach.'],
        variants: [
          { name: 'Przedłużanie metodą żelową', duration: '150 min' },
          { name: 'Uzupełnianie żelem', duration: '120 min' },
        ],
      },
      {
        name: 'Pedicure SPA',
        text: [
          'Pełna pielęgnacja stóp: opracowanie paznokci i skórek, usunięcie zrogowaceń, wygładzenie pięt i relaksujący masaż. W wersji hybrydowej pedicure kończy się trwałym kolorem, w klasycznej odżywką lub lakierem, a w japońskiej naturalnym połyskiem paznokci.',
        ],
        variants: [
          { name: 'Pedicure SPA hybrydowy', duration: '90 min' },
          { name: 'Pedicure klasyczny SPA', duration: '90 min' },
          { name: 'Pedicure japoński SPA', duration: '70 min' },
          { name: 'Pedicure klasyczny SPA męski', duration: '60 min' },
          { name: 'Pedicure japoński SPA męski', duration: '70 min' },
        ],
      },
      {
        name: 'Pedicure hybrydowy',
        text: [
          'Krótsza wizyta, gdy zależy Ci przede wszystkim na zadbanych paznokciach i trwałym kolorze: przygotowanie stóp, opracowanie skórek i płytki, nadanie kształtu i lakier hybrydowy.',
        ],
        variants: [{ name: 'Pedicure hybrydowy', duration: '55–60 min' }],
      },
      {
        name: 'Pakiet i usługi dodatkowe',
        text: [
          'Manicure i pedicure możesz połączyć w jedną, dłuższą wizytę. W salonie zdejmiesz też hybrydę lub żel, również wykonane gdzie indziej.',
        ],
        variants: [
          { name: 'Manicure hybrydowy i pedicure hybrydowy SPA', duration: '180 min' },
          { name: 'Ściągnięcie hybrydy', duration: '30 min' },
          { name: 'Ściągnięcie żelu', duration: '30 min' },
        ],
      },
    ],
    forWhom: [
      'Gdy chcesz mieć zadbane dłonie i stopy bez codziennego myślenia o nich.',
      'Gdy wolisz naturalny wygląd paznokci bez koloru: manicure i pedicure japoński.',
      'Dla panów: osobne wersje manicure i pedicure.',
      'Gdy pedicure ma być także chwilą odpoczynku.',
    ],
    preparation: {
      title: 'Przed wizytą',
      items: [
        'Jeśli masz na paznokciach hybrydę lub żel z innego salonu, dodaj przy rezerwacji ich ściągnięcie.',
        'Na pedicure weź wygodne, otwarte buty na drogę do domu.',
      ],
    },
  },
  {
    slug: 'brwi-i-rzesy',
    name: 'Brwi i rzęsy',
    menuLine: 'Architektura, laminacja brwi, lifting rzęs',
    teaser:
      'Architektura i koloryzacja brwi, laminacja, lifting i henna rzęs. Kształt brwi wyznaczam pomiarowo i dopasowuję do proporcji twarzy.',
    tags: ['Architektura brwi', 'Laminacja brwi', 'Lifting rzęs', 'Henna'],
    art: 'satyna-szampan',
    photo: 'brwi',
    seo: {
      title: 'Brwi i rzęsy Lubin: laminacja brwi, lifting rzęs · Azyl Piękna',
      description:
        'Stylizacja brwi i rzęs w Lubinie: henna i farbka brwi z architekturą, laminacja brwi, lifting rzęs, koreański lifting, henna rzęs. Salon Azyl Piękna. Rezerwacja w Booksy.',
    },
    eyebrow: 'Stylizacja brwi i rzęs Lubin',
    title: ['Brwi', 'i rzęsy'],
    intro:
      'Dobrze dobrany kształt brwi porządkuje rysy twarzy i zmienia wyraz spojrzenia. Zaczynam od pomiaru i rozrysowania kształtu, a brwi reguluję z wyczuciem, bez przesadnego przerzedzania.',
    groups: [
      {
        name: 'Architektura i koloryzacja brwi',
        text: [
          'Architektura to wyznaczenie symetrycznego kształtu brwi metodą pomiarową, dopasowanego do proporcji twarzy. Na tej podstawie reguluję brwi, a jeśli chcesz, podkreślam je farbką lub henną. Dobry wybór na początek albo gdy chcesz poprawić wcześniejszy kształt.',
        ],
        variants: [
          { name: 'Regulacja brwi z architekturą', duration: '30 min' },
          { name: 'Farbka lub henna brwi z architekturą i regulacją', duration: '45 min' },
          { name: 'Henna brwi', duration: '30 min' },
          { name: 'Regulacja brwi', duration: '30 min' },
        ],
      },
      {
        name: 'Laminacja brwi',
        text: [
          'Laminacja układa włoski w jednym kierunku, dzięki czemu brwi wyglądają na pełniejsze i uporządkowane. Łączę ją z regulacją, a w wersji rozszerzonej także z koloryzacją.',
        ],
        variants: [
          { name: 'Laminacja brwi z botoksem i regulacją', duration: '45 min' },
          { name: 'Laminacja brwi z farbką, botoksem i regulacją', duration: '60 min' },
        ],
      },
      {
        name: 'Lifting i henna rzęs',
        text: [
          'Lifting unosi i podkręca naturalne rzęsy, bez przedłużania i bez zalotki. Koreański lifting to wersja z wieloetapowymi, delikatniejszymi preparatami. W wariancie z przedłużeniem kącików dodaję kilka rzęs w zewnętrznych kącikach oka, co optycznie wydłuża spojrzenie.',
        ],
        variants: [
          { name: 'Lifting rzęs z farbką i botoksem', duration: '60 min' },
          { name: 'Koreański lifting rzęs', duration: '60 min' },
          { name: 'Lifting rzęs z przedłużeniem kącików', duration: '90 min' },
          { name: 'Henna rzęs', duration: '30 min' },
        ],
      },
      {
        name: 'Pakiety i usługi dodatkowe',
        text: [
          'Brwi i rzęsy zrobisz podczas jednej wizyty. Wykonuję też depilację twarzy woskiem i zdejmuję przedłużane rzęsy.',
        ],
        variants: [
          { name: 'Lifting rzęs i laminacja brwi', duration: '90 min' },
          { name: 'Lifting rzęs i farbka brwi z regulacją', duration: '90 min' },
          { name: 'Depilacja woskiem: wąsik, broda, nos lub boki twarzy', duration: '15 min' },
          { name: 'Ściągnięcie przedłużanych rzęs', duration: '25 min' },
        ],
      },
    ],
    forWhom: [
      'Gdy chcesz uporządkować kształt brwi i dopasować go do rysów twarzy.',
      'Gdy chcesz skrócić poranny makijaż.',
      'Gdy masz jasne lub proste rzęsy i chcesz je naturalnie podkreślić.',
    ],
    preparation: {
      title: 'Przed wizytą',
      items: [
        'Jeśli masz skłonność do alergii, powiedz mi o tym przed zabiegiem.',
        'Kilka dni przed wizytą nie reguluj brwi samodzielnie: łatwiej wtedy wyznaczyć kształt.',
        'Na lifting rzęs przyjdź bez makijażu oczu.',
      ],
    },
  },
];

export const categoryBySlug = (slug: string): Category => {
  const category = categories.find((c) => c.slug === slug);
  if (!category) throw new Error(`Nie ma kategorii „${slug}” w src/data/oferta.ts`);
  return category;
};

/** etapy rytuału Head Spa (sekcja na stronie głównej i podstrona Head Spa) */
export const headSpaRitual = [
  { name: 'Rozmowa i trichoskopia', text: 'Pytam o Twoje potrzeby i oglądam skórę głowy kamerą trychologiczną.' },
  { name: 'Peeling', text: 'Oczyszczam skórę głowy i przygotowuję ją do pielęgnacji.' },
  { name: 'Mycie i odżywka', text: 'Myję włosy i nakładam odżywkę.' },
  { name: 'Sauna i hydromasaż', text: 'Napar ziołowy lub olejki, a potem masaż wodą, dłońmi i masażerami.' },
  { name: 'Wykończenie', text: 'Odżywka termoochronna i suszenie włosów.' },
  { name: 'Badanie końcowe', text: 'Drugie spojrzenie przez kamerę, żeby porównać obraz przed i po.' },
];
