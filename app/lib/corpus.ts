import { isPronounceable } from "@/app/lib/mutate";

// Curated pool of niche-but-pretty names from sources less likely to be
// squatted on .com: obscure Pokémon (Gen 5+), minor mythological figures,
// less-mainstream anime/J-RPG character names, Japanese natural-world
// words, lesser-known stars, uncommon gems and botanicals.
//
// Reality check: domain squatters do scrape these dictionaries, so the
// corpus contributes maybe 10–15% hits. The bigger lever is `pickInvented`
// below, which builds fresh syllable combinations at runtime.

export const COOL_WORDS: readonly string[] = [
  // === Obscure Pokémon (mostly Gen 5+) ===
  "mareanie", "ribombee", "comfey", "dewpider", "salandit", "salazzle",
  "mimikyu", "pyukumuku", "drampa", "oranguru", "golisopod", "palossand",
  "wimpod", "fomantis", "lurantis", "bounsweet", "steenee", "tsareena",
  "mudbray", "mudsdale", "dartrix", "popplio", "brionne", "trumbeak",
  "yungoos", "grubbin", "charjabug", "vikavolt", "cutiefly", "minior",
  "rockruff", "bewear", "stufful", "mareep", "flaaffy", "sentret",
  "ledyba", "ledian", "spinarak", "ariados", "chinchou", "hoppip",
  "skiploom", "sunkern", "wooper", "remoraid", "skarmory", "mantine",
  "delibird", "houndour", "smeargle",

  // === Greek / Norse / Egyptian mythology (lesser figures) ===
  "selene", "asteria", "calais", "nereus", "proteus", "glaucus",
  "phorcys", "oceanus", "erebus", "hemera", "ananke", "hestia",
  "moros", "geras", "hypnos", "iapetus", "menoetius",
  "idunn", "bragi", "vidar", "skadi", "mimir", "freyr",
  "thrud", "vanir", "surtr", "fenrir",
  "sekhmet", "bastet", "thoth", "neith", "sobek", "hathor",
  "montu", "khepri", "khonsu",

  // === Anime / J-RPG character names (less-mainstream) ===
  "kohaku", "yuzuki", "mikage", "hatori", "ayame", "shinobu",
  "shinoa", "tatsumi", "akame", "oboro", "yumeko", "hisui",
  "kanami", "hiyori", "nadeko", "tomoyo", "reisen", "yukari",
  "chiharu", "kotori", "kotone", "mikoto", "momiji",

  // === Japanese natural-world words (romaji) ===
  "kasumi", "tsubaki", "botan", "akari", "hikari", "mitsuki",
  "shion", "azuki", "yugen", "irodori", "miyabi", "tsuyu",
  "akatsuki", "yoake", "shizuka", "kogane", "harusame",
  "yumeji", "yukige", "tsuzumi",

  // === Stars / celestial (lesser-known) ===
  "albireo", "izar", "mirach", "alphecca", "mizar", "alcor",
  "tureis", "cursa", "zaurak", "gienah", "denebola", "gomeisa",
  "alphard", "rasalas", "subra", "porrima", "shaula", "lesath",
  "alnasl", "vindemia", "etamin", "rastaban",

  // === Gems / minerals (uncommon) ===
  "larimar", "sugilite", "kunzite", "charoite", "tanzanite",
  "jadeite", "ametrine", "andesine", "morganite", "moldavite",
  "phenakite", "sphene", "iolite",

  // === Botanical / nature (less-common) ===
  "lupine", "saffron", "myrrh", "balsam", "tarragon", "rosehip",
  "yarrow", "sorrel", "comfrey", "mugwort", "borage",
];

export function pickFromCorpus(count: number, exclude: string[] = []): string[] {
  const tried = new Set(exclude.map((x) => x.toLowerCase()));
  const pool = COOL_WORDS.filter((w) => !tried.has(w));
  // Fisher–Yates shuffle on a copy
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

// === Invented names — prefix + suffix syllable bank ===========================
//
// Domain squatters can't pre-register what doesn't exist yet. By combining a
// prefix syllable with a suffix syllable at runtime we generate names that
// have never been suggested before: kryona, lumara, vorelle, taloria, zenari.
// Hit rate against RDAP is dramatically higher than dictionary words.

const PREFIXES: readonly string[] = [
  // Vowel-led (rare, exotic feel)
  "ar", "ay", "ai", "al", "am", "an", "as", "ax", "az",
  "ec", "el", "em", "en", "er", "ev",
  "ic", "iv", "ix", "ir",
  "ob", "ol", "om", "on", "or",
  // Latinate / Greek consonant-led
  "bra", "bre", "bri",
  "cal", "cam", "car",
  "dal", "dar", "del", "dor",
  "eli", "era",
  "fae", "fal", "fer",
  "gae", "gal", "gor",
  "har", "hel", "hyl",
  "kel", "ker", "kor", "kry", "kyr",
  "lan", "lar", "lem", "lis", "lor", "lum", "lyr",
  "mal", "mar", "mel", "mir", "mor", "myr",
  "nel", "ner", "nia", "nor", "nyx",
  "ola", "ora",
  "pae", "pen", "per", "pra", "pyr",
  "rai", "ran", "rem", "ria", "ros",
  "sael", "sar", "sel", "ser", "sha", "sho", "sym",
  "tal", "tel", "ter", "tha", "tho", "tor", "tyr",
  "vai", "val", "vel", "ver", "vir", "vor", "vyr",
  "xan", "xel", "xyr",
  "yel", "yor", "yth",
  "zal", "zen", "zep", "zer",
];

const SUFFIXES: readonly string[] = [
  // Single vowel — short, soft endings
  "a", "o", "i", "e",
  // Two-char crisp endings
  "as", "is", "ix", "us", "on", "an", "in", "yn",
  // Three-char rolling endings
  "ana", "ari", "aro", "ela", "ena", "eri", "ero",
  "ina", "iro", "iva",
  "ola", "ona", "ora", "osa", "ota", "ova",
  "una", "ura",
  // Four-char ornate endings
  "elle", "alle", "etta", "ovi",
  "ynth", "ynx",
  // Greco-Latin
  "ius", "eus", "atta", "aris",
];

export function pickInvented(count: number, exclude: string[] = []): string[] {
  const tried = new Set(exclude.map((x) => x.toLowerCase()));
  const out: string[] = [];
  const seen = new Set<string>();
  const cap = count * 30;
  let attempts = 0;
  while (out.length < count && attempts < cap) {
    attempts++;
    const p = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    const s = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
    const name = (p + s).toLowerCase();
    // 6–10 char window: shorter combos are saturated; longer ones survive.
    if (name.length < 6 || name.length > 10) continue;
    if (seen.has(name) || tried.has(name)) continue;
    if (!isPronounceable(name)) continue;
    // Avoid awkward 3+ consonant clusters from a consonant-ending prefix
    // meeting a consonant-leading suffix (e.g. "kor" + "ynth" = "korynth" — fine,
    // but "kry" + "ynth" = "kryynth" — reject).
    if (/[^aeiouy]{3,}/.test(name)) continue;
    if (/[aeiouy]{3,}/.test(name)) continue;
    seen.add(name);
    out.push(name);
  }
  return out;
}
