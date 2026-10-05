import heroChocolateAtelierImg from '../assets/images/hero_chocolate_atelier_1791182082565.jpg';
import craftTemperingMarbleImg from '../assets/images/craft_tempering_marble_1791182143093.jpg';
import productMadagascarBarImg from '../assets/images/product_madagascar_bar_1791182104345.jpg';
import productPralineBonbonsImg from '../assets/images/product_praline_bonbons_1791182118690.jpg';
import productPistachioBarkImg from '../assets/images/product_pistachio_bark_1791182131132.jpg';

export interface ProductVariant {
  id: string;
  label: string;
  weightGrams: number;
  price: number;
}

export interface TastingMetrics {
  bitterness: number; // 1-5
  fruitAcidity: number; // 1-5
  roastDepth: number; // 1-5
  sweetness: number; // 1-5
}

export interface ChocolateProduct {
  id: string;
  name: string;
  category: 'Single-Origin Bars' | 'Ganache Bonbons' | 'Artisanal Bark';
  origin: string;
  harvestYear: string;
  cacaoPercentage: number;
  kickerTag?: string; // Max 1 subtle text tag per card, unboxed
  shortNotes: string; // e.g., "Red currant · Roasted cacao · Blood orange"
  description: string;
  fermentationDays: number;
  conchingHours: number;
  estateElevation: string;
  pairings: string[];
  ingredients: string;
  allergens: string;
  image: string;
  imagePosition?: string;
  accentHue: string;
  tastingMetrics: TastingMetrics;
  variants: ProductVariant[];
  inStock: boolean;
}

export interface BonbonPiece {
  id: string;
  name: string;
  originCacao: string;
  cacaoPercentage: number;
  notes: string;
  shellType: 'Dark 74%' | 'Dark 68%' | 'Oat Milk 54%' | 'Caramelized White 38%';
  colorSwatch: string;
  accentRing: string;
}

export const HERO_IMAGE = heroChocolateAtelierImg;
export const CRAFT_IMAGE = craftTemperingMarbleImg;

export const PRODUCTS: ChocolateProduct[] = [
  {
    id: 'sambirano-74',
    name: 'Sambirano Valley 74% Grand Cru',
    category: 'Single-Origin Bars',
    origin: 'Ambanja, Madagascar',
    harvestYear: '2026 Harvest',
    cacaoPercentage: 74,
    kickerTag: 'Single Estate',
    shortNotes: 'Wild raspberry · Blood orange · Warm cedar',
    description:
      'Grown in the alluvial soils of the Sambirano River basin, these Criollo-Trinitario beans undergo a six-day tiered box fermentation before slow granite stone conching in our Lyon workshop. Expect a bright, wine-like berry acidity that melts into roasted almond finish.',
    fermentationDays: 6,
    conchingHours: 72,
    estateElevation: '420m ASL',
    pairings: ['Pinot Noir', 'Washed Ethiopian Pour-Over', 'Aged Comté'],
    ingredients: 'Organic Madagascar cacao beans, organic unrefined cane sugar, pure estate cocoa butter.',
    allergens: 'Crafted in an atelier that handles tree nuts and dairy.',
    image: productMadagascarBarImg,
    imagePosition: 'center center',
    accentHue: '#7A2E21',
    tastingMetrics: {
      bitterness: 3,
      fruitAcidity: 5,
      roastDepth: 3,
      sweetness: 2,
    },
    variants: [
      { id: 'sambirano-80g', label: '80g Tasting Tablet', weightGrams: 80, price: 16 },
      { id: 'sambirano-240g', label: '240g Library Trio (3 × 80g)', weightGrams: 240, price: 44 },
      { id: 'sambirano-500g', label: '500g Chef Reserve Block', weightGrams: 500, price: 78 },
    ],
    inStock: true,
  },
  {
    id: 'piedmont-praline-coffret',
    name: 'Les Neuf Pralinés & Espresso Coffret',
    category: 'Ganache Bonbons',
    origin: 'Piedmont & Chuao Blend',
    harvestYear: 'Small Batch',
    cacaoPercentage: 68,
    kickerTag: 'Signature Coffret',
    shortNotes: 'Roasted IGP hazelnut · Ethiopia espresso · Fleur de sel',
    description:
      'Nine hand-tempered bonbons presented in a custom raw-linen keepsake box. Features stone-milled Piedmont IGP hazelnut gianduja, cold-infused single-origin espresso ganache, and smoked Breton sea salt caramel enrobed in thin 68% Venezuelan dark chocolate.',
    fermentationDays: 5,
    conchingHours: 64,
    estateElevation: '650m ASL',
    pairings: ['Ristretto', '10-Year Tawny Port', 'Pedro Ximénez Sherry'],
    ingredients: 'Venezuelan cacao mass, Piedmont IGP hazelnuts, cane sugar, Normandy cultured butter, heavy cream, espresso bean infusion, Guérande sea salt.',
    allergens: 'Contains hazelnuts (tree nuts) and dairy.',
    image: productPralineBonbonsImg,
    imagePosition: 'center center',
    accentHue: '#5C3A21',
    tastingMetrics: {
      bitterness: 2,
      fruitAcidity: 2,
      roastDepth: 4,
      sweetness: 4,
    },
    variants: [
      { id: 'praline-9pc', label: '9-Piece Linen Coffret (115g)', weightGrams: 115, price: 34 },
      { id: 'praline-18pc', label: '18-Piece Double Tier (230g)', weightGrams: 230, price: 62 },
      { id: 'praline-36pc', label: '36-Piece Grand Salon Box (460g)', weightGrams: 460, price: 115 },
    ],
    inStock: true,
  },
  {
    id: 'bronte-pistachio-bark',
    name: 'Écorce de Bronte & Candied Bergamot',
    category: 'Artisanal Bark',
    origin: 'Sicily & Alto Beni',
    harvestYear: '2026 Harvest',
    cacaoPercentage: 70,
    kickerTag: 'Limited Run',
    shortNotes: 'Green Bronte pistachio · Confit bergamot · Flaky sea salt',
    description:
      'Hand-poured slabs of 70% Bolivian wild-harvested dark chocolate generously studded with whole emerald DOP pistachios from the volcanic slopes of Mount Etna, house-candied Calabrian bergamot zest, and crystalline Maldon sea salt.',
    fermentationDays: 6,
    conchingHours: 68,
    estateElevation: '890m ASL',
    pairings: ['Franciacorta Satèn', 'Jasmine Silver Needle Tea', 'Amaro Montenegro'],
    ingredients: 'Bolivian wild cacao beans, Bronte DOP green pistachios, candied bergamot peel, organic cane sugar, cocoa butter, flaky sea salt.',
    allergens: 'Contains pistachios (tree nuts). Dairy-free.',
    image: productPistachioBarkImg,
    imagePosition: 'center center',
    accentHue: '#4F5D38',
    tastingMetrics: {
      bitterness: 3,
      fruitAcidity: 4,
      roastDepth: 3,
      sweetness: 3,
    },
    variants: [
      { id: 'bark-150g', label: '150g Cellar Pouch', weightGrams: 150, price: 26 },
      { id: 'bark-300g', label: '300g Tin Coffret', weightGrams: 300, price: 48 },
    ],
    inStock: true,
  },
  {
    id: 'chuao-82-reserve',
    name: 'Chuao Peninsula 82% Noir Intense',
    category: 'Single-Origin Bars',
    origin: 'Aragua, Venezuela',
    harvestYear: '2026 Harvest',
    cacaoPercentage: 82,
    kickerTag: 'Rare Lot #14',
    shortNotes: 'Black fig · Dark molasses · Roasted cacao nib',
    description:
      'Accessible only by boat along Venezuela’s northern coast, the historic Chuao village yields prized Criollo genetics with extraordinary natural creaminess even at 82% cacao solids. Zero astringency with deep notes of dried fig, pipe tobacco, and crème fraîche.',
    fermentationDays: 7,
    conchingHours: 80,
    estateElevation: '250m ASL',
    pairings: ['Islay Single Malt', 'Double Espresso', 'Stilton'],
    ingredients: 'Chuao Criollo cacao beans, organic raw cane sugar, pure cocoa butter.',
    allergens: 'Dairy-free & soy-free. Crafted in an atelier that handles tree nuts.',
    image: productMadagascarBarImg,
    imagePosition: 'left bottom',
    accentHue: '#382218',
    tastingMetrics: {
      bitterness: 5,
      fruitAcidity: 2,
      roastDepth: 5,
      sweetness: 1,
    },
    variants: [
      { id: 'chuao-80g', label: '80g Numbered Tablet', weightGrams: 80, price: 22 },
      { id: 'chuao-240g', label: '240g Collector Flight (3 × 80g)', weightGrams: 240, price: 60 },
    ],
    inStock: true,
  },
  {
    id: 'solstice-gold-bonbons',
    name: 'Collection Solstice — Or & Grand Cru',
    category: 'Ganache Bonbons',
    origin: 'Single-Origin Tasting Flight',
    harvestYear: 'Small Batch',
    cacaoPercentage: 72,
    kickerTag: 'Atelier Exclusive',
    shortNotes: '24k gold leaf · Tonka bean · Smoked vanilla ganache',
    description:
      'Our flagship tasting assortment combining single-estate pure water ganaches and toasted nut pralinés adorned with 24-karat edible gold leaf. Designed to be tasted from mildest floral Ecuadorean Arriba to boldest smoked Madagascar Criollo.',
    fermentationDays: 6,
    conchingHours: 72,
    estateElevation: '550m ASL',
    pairings: ['Vintage Champagne', 'Oolong Tea', 'Armagnac XO'],
    ingredients: 'Single-origin cacao mass, Normandy cream, Venezuelan tonka bean, Tahitian vanilla pod, organic cane sugar, 24k edible gold leaf.',
    allergens: 'Contains dairy and tree nuts.',
    image: heroChocolateAtelierImg,
    imagePosition: 'center center',
    accentHue: '#8C4A27',
    tastingMetrics: {
      bitterness: 3,
      fruitAcidity: 3,
      roastDepth: 4,
      sweetness: 3,
    },
    variants: [
      { id: 'solstice-12pc', label: '12-Piece Tasting Flight (150g)', weightGrams: 150, price: 46 },
      { id: 'solstice-24pc', label: '24-Piece Sommelier Box (300g)', weightGrams: 300, price: 86 },
    ],
    inStock: true,
  },
  {
    id: 'camargue-nib-slab',
    name: 'Tablette Brute — Roasted Nibs & Camargue Salt',
    category: 'Artisanal Bark',
    origin: 'Piura Valley, Peru',
    harvestYear: '2026 Harvest',
    cacaoPercentage: 76,
    kickerTag: 'Stone Ground',
    shortNotes: 'Caramelized Piura nibs · White peach · Fleur de sel',
    description:
      'Made from rare ultra-pale Porcelana and Blanco de Piura beans from northern Peru. We fold lightly caramelized cacao nibs and harvested fleur de sel from the marshes of Camargue directly into the tempered slab for a resonant, crunchy snap.',
    fermentationDays: 6,
    conchingHours: 60,
    estateElevation: '480m ASL',
    pairings: ['Sauternes', 'Cold Brew Coffee', 'Manchego Curado'],
    ingredients: 'Piura Valley cacao beans, caramelized cacao nibs, organic cane sugar, Camargue fleur de sel.',
    allergens: 'Dairy-free. Crafted in an atelier that handles tree nuts.',
    image: productPistachioBarkImg,
    imagePosition: 'right top',
    accentHue: '#6B4226',
    tastingMetrics: {
      bitterness: 4,
      fruitAcidity: 4,
      roastDepth: 4,
      sweetness: 2,
    },
    variants: [
      { id: 'camargue-150g', label: '150g Slate Pouch', weightGrams: 150, price: 24 },
      { id: 'camargue-300g', label: '300g Sharing Tin', weightGrams: 300, price: 45 },
    ],
    inStock: true,
  },
];

export const BONBON_PALETTE: BonbonPiece[] = [
  {
    id: 'bonbon-hazelnut',
    name: 'Gianduja Piémont',
    originCacao: 'Venezuela 68%',
    cacaoPercentage: 68,
    notes: 'Stone-ground IGP hazelnut & wafer feuilletine',
    shellType: 'Dark 68%',
    colorSwatch: '#4A2C1D',
    accentRing: '#C28B53',
  },
  {
    id: 'bonbon-madagascar',
    name: 'Palet d’Or Sambirano',
    originCacao: 'Madagascar 74%',
    cacaoPercentage: 74,
    notes: 'Bright red berry water ganache & 24k gold leaf',
    shellType: 'Dark 74%',
    colorSwatch: '#2D1A12',
    accentRing: '#D4AF37',
  },
  {
    id: 'bonbon-pistachio',
    name: 'Praliné Vert de Bronte',
    originCacao: 'Bolivia 70%',
    cacaoPercentage: 70,
    notes: 'Roasted Sicilian green pistachio & orange blossom',
    shellType: 'Dark 68%',
    colorSwatch: '#3B281E',
    accentRing: '#7A8B56',
  },
  {
    id: 'bonbon-espresso',
    name: 'Noir Ristretto Yirgacheffe',
    originCacao: 'Peru 76%',
    cacaoPercentage: 76,
    notes: 'Cold-steeped Ethiopian espresso & cardamom',
    shellType: 'Dark 74%',
    colorSwatch: '#23140E',
    accentRing: '#8C4A27',
  },
  {
    id: 'bonbon-caramel',
    name: 'Caramel Beurre Salé Fumée',
    originCacao: 'Ecuador 66%',
    cacaoPercentage: 66,
    notes: 'Oak-smoked Guérande sea salt & cultured butter',
    shellType: 'Oat Milk 54%',
    colorSwatch: '#5C3824',
    accentRing: '#D99B66',
  },
  {
    id: 'bonbon-yuzu',
    name: 'Ganache Yuzu & Sésame Noir',
    originCacao: 'Madagascar 70%',
    cacaoPercentage: 70,
    notes: 'Kochi yuzu juice & toasted black sesame praliné',
    shellType: 'Dark 74%',
    colorSwatch: '#31211B',
    accentRing: '#C9A23F',
  },
];
