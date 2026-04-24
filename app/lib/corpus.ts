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
