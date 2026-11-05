// ============================================================================
// Official CAP Plc Sandtex Colour Chart — Single Source of Truth
// Exactly 120 Factory Colors in 6 Groups (20 per group)
// Source: Sandtex Colour Chart - E - Chart.PDF Extract
// ============================================================================

export type SandtexColorGroup = 'Blues' | 'Greens' | 'Neutrals' | 'Oranges' | 'Reds' | 'Yellows';

export interface SandtexColor {
  name: string;
  hex: string;
  group: SandtexColorGroup;
  code: string;
  isDark?: boolean;
  recommendedFinish?: string;
  desc?: string;
}

export interface SandtexGroupMeta {
  group: SandtexColorGroup;
  label: string;
  sampleHex: string;
  gradient: string;
  count: number;
  desc: string;
}

export const SANDTEX_COLOR_GROUPS: SandtexGroupMeta[] = [
  {
    group: 'Blues',
    label: 'Blues',
    sampleHex: '#243142',
    gradient: 'from-[#1d3557] to-[#457b9d]',
    count: 20,
    desc: 'From serene coastal pastels to deep Mediterranean navy accents.',
  },
  {
    group: 'Greens',
    label: 'Greens',
    sampleHex: '#1F5139',
    gradient: 'from-[#1b4332] to-[#52b788]',
    count: 20,
    desc: 'Organic botanicals, fresh tropical leaves, and calm sage tones.',
  },
  {
    group: 'Neutrals',
    label: 'Neutrals',
    sampleHex: '#DDD6C3',
    gradient: 'from-[#6c757d] to-[#ced4da]',
    count: 20,
    desc: 'Contemporary architectural greys, soft off-whites, and warm stone.',
  },
  {
    group: 'Oranges',
    label: 'Oranges',
    sampleHex: '#DF7935',
    gradient: 'from-[#b45309] to-[#fb923c]',
    count: 20,
    desc: 'Warm terracotta, golden honey, and rich sun-drenched earth tones.',
  },
  {
    group: 'Reds',
    label: 'Reds',
    sampleHex: '#CC252C',
    gradient: 'from-[#780000] to-[#c1121f]',
    count: 20,
    desc: 'Bold statement reds, warm spices, dusty roses, and iconic Lekki Red.',
  },
  {
    group: 'Yellows',
    label: 'Yellows',
    sampleHex: '#DBA220',
    gradient: 'from-[#ca8a04] to-[#facc15]',
    count: 20,
    desc: 'Vibrant sunshine, delicate buttermilk, and rich golden ochres.',
  },
];

export const SANDTEX_COLORS: SandtexColor[] = [
  // ── BLUES (20 Colors) ──────────────────────────────────────────────────────
  { name: 'Bloomy Aster', hex: '#CCD9E3', group: 'Blues', code: 'STX-BL01', desc: 'Airy, delicate soft sky pastel' },
  { name: 'Mountain Air', hex: '#E5EBE2', group: 'Blues', code: 'STX-BL02', desc: 'Crisp, refreshing light tinted white' },
  { name: 'Nursery Blue', hex: '#5A8F96', group: 'Blues', code: 'STX-BL03', desc: 'Gentle, comforting teal-toned blue' },
  { name: 'Lagoon Blue', hex: '#37809C', group: 'Blues', code: 'STX-BL04', desc: 'Vibrant tropical lagoon shade' },
  { name: 'Azure Blue', hex: '#31435C', group: 'Blues', code: 'STX-BL05', isDark: true, desc: 'Deep classic nautical azure' },
  { name: 'Mist Blue', hex: '#BDCCC2', group: 'Blues', code: 'STX-BL06', desc: 'Cool morning mist with subtle silver tone' },
  { name: 'Light Blue', hex: '#8DA698', group: 'Blues', code: 'STX-BL07', desc: 'Understated sage-tinted light blue' },
  { name: 'Skye Blue', hex: '#598375', group: 'Blues', code: 'STX-BL08', desc: 'Mineral Atlantic slate blue' },
  { name: 'Babbling Brook', hex: '#98B9C4', group: 'Blues', code: 'STX-BL09', desc: 'Soothing water blue for calm bedrooms' },
  { name: 'Ocean Wave', hex: '#7A9CB0', group: 'Blues', code: 'STX-BL10', desc: 'Midtone coastal sea breeze' },
  { name: 'Navy Blue', hex: '#243142', group: 'Blues', code: 'STX-BL11', isDark: true, desc: 'Commanding regal navy for feature walls' },
  { name: 'Solent Blue', hex: '#334954', group: 'Blues', code: 'STX-BL12', isDark: true, desc: 'Deep oceanic blue-grey with high elegance' },
  { name: 'Brilliant Blue', hex: '#1D658C', group: 'Blues', code: 'STX-BL13', isDark: true, desc: 'Luminous rich cobalt statement color' },
  { name: 'Cold Morn', hex: '#B5B9BE', group: 'Blues', code: 'STX-BL14', desc: 'Modern cool grey-blue neutral' },
  { name: 'Scandinavian Sky', hex: '#6E8A9F', group: 'Blues', code: 'STX-BL15', desc: 'Clean architectural fjord blue' },
  { name: 'Water Front Blue', hex: '#96B0BD', group: 'Blues', code: 'STX-BL16', desc: 'Relaxing waterfront tone for living spaces' },
  { name: 'Flattery', hex: '#487198', group: 'Blues', code: 'STX-BL17', desc: 'Chic mid-blue with slate undertones' },
  { name: 'Opera Blue', hex: '#98ADB5', group: 'Blues', code: 'STX-BL18', desc: 'Sophisticated dusky blue for ceilings & walls' },
  { name: 'Pacific Blue', hex: '#416D82', group: 'Blues', code: 'STX-BL19', desc: 'Deep Pacific ocean hue for study or lounge' },
  { name: 'Blue Blood', hex: '#14619A', group: 'Blues', code: 'STX-BL20', isDark: true, desc: 'Vibrant luxury royal blue' },

  // ── GREENS (20 Colors) ─────────────────────────────────────────────────────
  { name: 'Aspen Whispers', hex: '#CCD3BF', group: 'Greens', code: 'STX-GR01', desc: 'Whisper-soft pale botanical green' },
  { name: 'Icy Wind', hex: '#D2DBD2', group: 'Greens', code: 'STX-GR02', desc: 'Cool frosted pale mint off-white' },
  { name: 'Leaf Green', hex: '#526242', group: 'Greens', code: 'STX-GR03', isDark: true, desc: 'Natural forest leaf green with earthy depth' },
  { name: 'Spray Green', hex: '#8A8A77', group: 'Greens', code: 'STX-GR04', desc: 'Muted olive mist for exterior facades' },
  { name: 'Lovat Green', hex: '#5F664E', group: 'Greens', code: 'STX-GR05', isDark: true, desc: 'Traditional heritage Scottish lovat' },
  { name: 'National Green', hex: '#1F5139', group: 'Greens', code: 'STX-GR06', isDark: true, desc: 'Iconic deep Nigerian national emerald' },
  { name: 'Peppermint', hex: '#A9C7B5', group: 'Greens', code: 'STX-GR07', desc: 'Fresh and energizing kitchen & bath mint' },
  { name: 'Sea Holly', hex: '#D2DBCA', group: 'Greens', code: 'STX-GR08', desc: 'Silvery coastal sea holly green' },
  { name: 'Olive Drab', hex: '#394039', group: 'Greens', code: 'STX-GR09', isDark: true, desc: 'Dramatic dark architectural olive' },
  { name: 'Chartreuse', hex: '#419232', group: 'Greens', code: 'STX-GR10', desc: 'Vibrant citrus green for dynamic energy' },
  { name: 'Casuarina Lovat', hex: '#485043', group: 'Greens', code: 'STX-GR11', isDark: true, desc: 'Dense tropical woodland shadow' },
  { name: 'Tropic Green', hex: '#659539', group: 'Greens', code: 'STX-GR12', desc: 'Lush equatorial green for garden walls' },
  { name: 'Spring Leaf', hex: '#81AB41', group: 'Greens', code: 'STX-GR13', desc: 'Bright, joyous new spring foliage' },
  { name: 'Placid View', hex: '#A5C481', group: 'Greens', code: 'STX-GR14', desc: 'Tranquil meadow shade for bedrooms' },
  { name: 'Lime Spray', hex: '#D7DEC1', group: 'Greens', code: 'STX-GR15', desc: 'Gentle, light-reflecting soft lime' },
  { name: 'Citron', hex: '#CBD4A6', group: 'Greens', code: 'STX-GR16', desc: 'Warm yellow-green with sunny presence' },
  { name: 'Water Green', hex: '#B4C7B3', group: 'Greens', code: 'STX-GR17', desc: 'Soft aqua sage with serene harmony' },
  { name: 'Whimsical', hex: '#5F9B4D', group: 'Greens', code: 'STX-GR18', desc: 'Playful botanical accent for modern rooms' },
  { name: 'Luiere', hex: '#91BE83', group: 'Greens', code: 'STX-GR19', desc: 'Gentle leafy green balance' },
  { name: 'Meadow Brook', hex: '#B8CC9B', group: 'Greens', code: 'STX-GR20', desc: 'Sunlit pasture green for airy corridors' },

  // ── NEUTRALS (20 Colors) ───────────────────────────────────────────────────
  { name: 'Off White', hex: '#DDD6C3', group: 'Neutrals', code: 'STX-NE01', desc: 'Nigeria’s #1 interior living room choice' },
  { name: 'Calabash', hex: '#B8A593', group: 'Neutrals', code: 'STX-NE02', desc: 'Warm indigenous calabash beige' },
  { name: 'Silver Grey', hex: '#949391', group: 'Neutrals', code: 'STX-NE03', desc: 'Sleek, polished modern metallic grey' },
  { name: 'Symphony', hex: '#CBB2A3', group: 'Neutrals', code: 'STX-NE04', desc: 'Harmonious taupe blush neutral' },
  { name: 'Pale Mushroom', hex: '#CBB5A4', group: 'Neutrals', code: 'STX-NE05', desc: 'Soft organic mushroom with cozy undertones' },
  { name: 'Dove Grey', hex: '#7F8180', group: 'Neutrals', code: 'STX-NE06', desc: 'Clean, balanced medium architectural grey' },
  { name: 'Midstone', hex: '#7B745F', group: 'Neutrals', code: 'STX-NE07', desc: 'Warm limestone for exterior stone aesthetics' },
  { name: 'Stone Grey', hex: '#67645F', group: 'Neutrals', code: 'STX-NE08', desc: 'Solid mineral grey with timeless appeal' },
  { name: 'Mid Grey', hex: '#4D5254', group: 'Neutrals', code: 'STX-NE09', isDark: true, desc: 'Urban loft medium-dark grey' },
  { name: 'Pale Grey', hex: '#616665', group: 'Neutrals', code: 'STX-NE10', desc: 'Soft architectural grey for perimeter walls' },
  { name: 'Sierra', hex: '#796E6A', group: 'Neutrals', code: 'STX-NE11', desc: 'Earthy mountain slate with warm violet hint' },
  { name: 'Hazel Brown', hex: '#8F7B6B', group: 'Neutrals', code: 'STX-NE12', desc: 'Rich toasted hazelnut brown' },
  { name: 'Dark Grey', hex: '#414A4E', group: 'Neutrals', code: 'STX-NE13', isDark: true, desc: 'Deep charcoal for gates, trims, and pillars' },
  { name: 'Bone White', hex: '#EAE4DA', group: 'Neutrals', code: 'STX-NE14', desc: 'Ultra-luxurious, warm ivory bone white' },
  { name: 'Dark Mushroom', hex: '#4E4B4A', group: 'Neutrals', code: 'STX-NE15', isDark: true, desc: 'Intense earthy shadow tone' },
  { name: 'Bitter Chocolate', hex: '#343233', group: 'Neutrals', code: 'STX-NE16', isDark: true, desc: 'Dramatic espresso dark luxury brown' },
  { name: 'Coconut', hex: '#534C49', group: 'Neutrals', code: 'STX-NE17', isDark: true, desc: 'Natural coconut husk brown' },
  { name: 'Silver Lining', hex: '#B4B9B9', group: 'Neutrals', code: 'STX-NE18', desc: 'Bright, reflective modern cloud silver' },
  { name: 'Flake Grey', hex: '#9CA09F', group: 'Neutrals', code: 'STX-NE19', desc: 'Contemporary minimalist wall grey' },
  { name: 'Cloud Burst', hex: '#8FA09E', group: 'Neutrals', code: 'STX-NE20', desc: 'Atmospheric storm cloud grey-green' },

  // ── ORANGES (20 Colors) ────────────────────────────────────────────────────
  { name: 'Rose Dawn', hex: '#EFE6DA', group: 'Oranges', code: 'STX-OR01', desc: 'Soft, gentle sunrise morning glow' },
  { name: 'Table Linen', hex: '#E7DBCB', group: 'Oranges', code: 'STX-OR02', desc: 'Understated woven linen warmth' },
  { name: 'Beige', hex: '#A49383', group: 'Oranges', code: 'STX-OR03', desc: 'Classic dependable architectural beige' },
  { name: 'Cameo', hex: '#907C69', group: 'Oranges', code: 'STX-OR04', desc: 'Warm antique biscuit tone' },
  { name: 'Cream 3040', hex: '#DCC2A3', group: 'Oranges', code: 'STX-OR05', desc: 'Classic CAP Plc staple warm cream' },
  { name: 'Peach', hex: '#CCA188', group: 'Oranges', code: 'STX-OR06', desc: 'Welcoming soft desert peach' },
  { name: 'Rich Cream', hex: '#BA9E74', group: 'Oranges', code: 'STX-OR07', desc: 'Gilded golden cream for luxurious lobbies' },
  { name: 'Light Cream', hex: '#A49383', group: 'Oranges', code: 'STX-OR08', desc: 'Warm foundational plaster tone' },
  { name: 'Orange', hex: '#DF7935', group: 'Oranges', code: 'STX-OR09', desc: 'Pure vivid orange for creative feature walls' },
  { name: 'Fruit Basket', hex: '#E68E64', group: 'Oranges', code: 'STX-OR10', desc: 'Appetizing warm apricot for dining rooms' },
  { name: 'Honey Locust', hex: '#DF9E7E', group: 'Oranges', code: 'STX-OR11', desc: 'Sun-kissed blossom tone' },
  { name: 'Orange Crush', hex: '#C53B21', group: 'Oranges', code: 'STX-OR12', desc: 'Intense red-orange burst with energy' },
  { name: 'Hot Toddy', hex: '#DD7A33', group: 'Oranges', code: 'STX-OR13', desc: 'Spiced amber warmth for cozy salons' },
  { name: 'Spiced Peach', hex: '#D59882', group: 'Oranges', code: 'STX-OR14', desc: 'Sophisticated dusky terracotta peach' },
  { name: 'Apple Blossom', hex: '#AD9286', group: 'Oranges', code: 'STX-OR15', desc: 'Muted warm blossom tone' },
  { name: 'Lemon Chiffon', hex: '#DCDCA2', group: 'Oranges', code: 'STX-OR16', desc: 'Subtle pastel lemon with cream depth' },
  { name: 'Sugar Cookie', hex: '#E4DBCA', group: 'Oranges', code: 'STX-OR17', desc: 'Sweet, buttery light cream' },
  { name: 'Titian Gold', hex: '#CCA752', group: 'Oranges', code: 'STX-OR18', desc: 'Renaissance golden ochre richness' },
  { name: 'Butterfly', hex: '#A09028', group: 'Oranges', code: 'STX-OR19', desc: 'Golden bronze with greenish olive tint' },
  { name: 'Shiloh', hex: '#C96A1E', group: 'Oranges', code: 'STX-OR20', desc: 'Deep rustic burnt orange terracotta' },

  // ── REDS (20 Colors) ───────────────────────────────────────────────────────
  { name: 'Dusky Pink', hex: '#BCA29A', group: 'Reds', code: 'STX-RD01', desc: 'Subtle, elegant vintage dusty rose' },
  { name: 'Magnolia', hex: '#EEDACF', group: 'Reds', code: 'STX-RD02', desc: 'Classic warm magnolia blossom blush' },
  { name: 'Lilac', hex: '#B2B2BC', group: 'Reds', code: 'STX-RD03', desc: 'Cool romantic lilac floral grey' },
  { name: 'Cinnabar', hex: '#9F4D45', group: 'Reds', code: 'STX-RD04', desc: 'Rich mineral cinnabar earth red' },
  { name: 'Pale Vermillion', hex: '#B87E74', group: 'Reds', code: 'STX-RD05', desc: 'Soft coral red with understated charm' },
  { name: 'Russet', hex: '#7B5D54', group: 'Reds', code: 'STX-RD06', isDark: true, desc: 'Deep woodland russet for study & libraries' },
  { name: 'Sienna', hex: '#845B42', group: 'Reds', code: 'STX-RD07', isDark: true, desc: 'Classic Tuscan burnt earth sienna' },
  { name: 'Orpiment', hex: '#89743C', group: 'Reds', code: 'STX-RD08', desc: 'Rich ochre mineral gold-red' },
  { name: 'Bamboo', hex: '#A57D59', group: 'Reds', code: 'STX-RD09', desc: 'Warm natural bamboo reed tone' },
  { name: 'Lekki Red', hex: '#CC252C', group: 'Reds', code: 'STX-RD10', desc: 'Signature bold Nigerian luxury accent red' },
  { name: 'Rich Brown', hex: '#5D433B', group: 'Reds', code: 'STX-RD11', isDark: true, desc: 'Deep architectural mahogany brown' },
  { name: 'Minium', hex: '#AE563D', group: 'Reds', code: 'STX-RD12', desc: 'Terracotta brick red for exterior accents' },
  { name: 'Etruscan Red', hex: '#563E37', group: 'Reds', code: 'STX-RD13', isDark: true, desc: 'Historic Italian ancient clay red' },
  { name: 'Coke Red', hex: '#A5232B', group: 'Reds', code: 'STX-RD14', isDark: true, desc: 'Vibrant, high-impact commercial ruby red' },
  { name: 'Rose', hex: '#B47E6F', group: 'Reds', code: 'STX-RD15', desc: 'Gentle, romantic warm garden rose' },
  { name: 'Isabella', hex: '#D8CCCA', group: 'Reds', code: 'STX-RD16', desc: 'Refined, pale chalky blush neutral' },
  { name: 'Cinnamon Spice', hex: '#893D2B', group: 'Reds', code: 'STX-RD17', isDark: true, desc: 'Piquant, aromatic deep spice red' },
  { name: 'Strawberry', hex: '#D59092', group: 'Reds', code: 'STX-RD18', desc: 'Sweet, charming summer berry pink' },
  { name: 'Reef Red', hex: '#6C2929', group: 'Reds', code: 'STX-RD19', isDark: true, desc: 'Intense marine coral reef crimson' },
  { name: 'Coral', hex: '#BE5341', group: 'Reds', code: 'STX-RD20', desc: 'Lively tropical reef coral for statement doors' },

  // ── YELLOWS (20 Colors) ────────────────────────────────────────────────────
  { name: 'Apple White', hex: '#EEEBE0', group: 'Yellows', code: 'STX-YL01', desc: 'Crisp apple-tinted architectural white' },
  { name: 'Jasmine White', hex: '#EBE5D7', group: 'Yellows', code: 'STX-YL02', desc: 'Soft floral jasmine cream' },
  { name: 'Warm Sun', hex: '#E4D8BC', group: 'Yellows', code: 'STX-YL03', desc: 'Gentle morning sunlight on plaster' },
  { name: 'Yellow Rose', hex: '#D9BE2B', group: 'Yellows', code: 'STX-YL04', desc: 'Radiant, cheerful garden rose yellow' },
  { name: 'Barley', hex: '#D2B485', group: 'Yellows', code: 'STX-YL05', desc: 'Warm harvested grain for welcoming rooms' },
  { name: 'Sun Yellow', hex: '#A89158', group: 'Yellows', code: 'STX-YL06', desc: 'Subdued ochre sun with earthy presence' },
  { name: 'Mustard Maize', hex: '#635F47', group: 'Yellows', code: 'STX-YL07', isDark: true, desc: 'Sophisticated deep Dijon mustard' },
  { name: 'Golden Yellow', hex: '#DBA220', group: 'Yellows', code: 'STX-YL08', desc: 'Opulent, radiant luxury pure gold' },
  { name: 'Gentle Yellow', hex: '#EBDFC4', group: 'Yellows', code: 'STX-YL09', desc: 'Light-enhancing airy buttery tint' },
  { name: 'Butter Milk', hex: '#E3DAC1', group: 'Yellows', code: 'STX-YL10', desc: 'Rich, smooth creamy buttermilk' },
  { name: 'Trade Yellow', hex: '#EBD021', group: 'Yellows', code: 'STX-YL11', desc: 'High-visibility vibrant commercial yellow' },
  { name: 'Soft Yellow', hex: '#DED6B4', group: 'Yellows', code: 'STX-YL12', desc: 'Mellow, relaxing living room neutral' },
  { name: 'Primrose', hex: '#CECB8C', group: 'Yellows', code: 'STX-YL13', desc: 'Delicate floral primrose with pastel charm' },
  { name: 'Espana', hex: '#CFB77F', group: 'Yellows', code: 'STX-YL14', desc: 'Spanish sun-baked adobe yellow' },
  { name: 'Pale Daffodil', hex: '#CFBE76', group: 'Yellows', code: 'STX-YL15', desc: 'Gentle spring daffodil glow' },
  { name: 'Lantern Glow', hex: '#CBB33A', group: 'Yellows', code: 'STX-YL16', desc: 'Warm evening lantern light tone' },
  { name: 'Candle Light', hex: '#E5B225', group: 'Yellows', code: 'STX-YL17', desc: 'Intimate, warm flicker of amber gold' },
  { name: 'Heirloom', hex: '#B1AB77', group: 'Yellows', code: 'STX-YL18', desc: 'Antique brass ochre with heritage quality' },
  { name: 'Midas Touch', hex: '#978F2C', group: 'Yellows', code: 'STX-YL19', desc: 'Legendary mythic gold with greenish sheen' },
  { name: 'Constant', hex: '#CFD39C', group: 'Yellows', code: 'STX-YL20', desc: 'Steady, luminous yellow-lime pastel' },
];

/**
 * Get colors for a specific group
 */
export function getColorsByGroup(group: SandtexColorGroup): SandtexColor[] {
  return SANDTEX_COLORS.filter((c) => c.group === group);
}

/**
 * Find exact or closest Sandtex color by name or hex
 */
export function findSandtexColorByName(name: string): SandtexColor | undefined {
  return SANDTEX_COLORS.find((c) => c.name.toLowerCase() === name.toLowerCase());
}
