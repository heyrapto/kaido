// Short English words that are virtually always registered on .com.
// Curated to match suggestions the LLM tends to return — keeps us from
// burning availability calls on names that will come back taken.
export const COMMON_WORDS: ReadonlySet<string> = new Set([
  "arc", "ark", "ash", "axe", "bay", "bit", "box", "buzz", "cap", "cog",
  "crux", "cub", "cue", "dew", "dim", "dip", "dot", "drift", "dusk", "ebb",
  "echo", "edge", "ember", "ether", "fawn", "fern", "fig", "fizz", "flame",
  "flax", "flex", "flint", "flow", "flux", "foam", "fog", "font", "forge",
  "fox", "fury", "fuse", "gale", "gem", "gist", "glen", "glint", "glow",
  "grain", "grid", "grit", "grove", "hail", "halo", "haven", "heap", "hive",
  "hub", "hue", "hum", "hunt", "hush", "ice", "ink", "iris", "ivy", "jade",
  "jolt", "joy", "kelp", "keen", "kiln", "lake", "lane", "lark", "leap",
  "lens", "lift", "link", "lobe", "loft", "loom", "loop", "lotus", "lumen",
  "luna", "lunar", "lush", "lyric", "mane", "map", "maze", "mesh", "mist",
  "moth", "muse", "myst", "neon", "nest", "node", "nook", "nova", "note",
  "oak", "oath", "ocean", "olive", "onyx", "opal", "orbit", "otter", "owl",
  "pale", "palm", "path", "peak", "pear", "pine", "pivot", "plume", "pond",
  "pool", "port", "prism", "pulse", "quartz", "quest", "quill", "quip",
  "raven", "ray", "reef", "relay", "rift", "river", "roam", "root", "rove",
  "sage", "sail", "scope", "seed", "serif", "shade", "shard", "shift",
  "shore", "silk", "silo", "skim", "sky", "slate", "slope", "smoke", "snow",
  "solace", "sonic", "spark", "spire", "spoke", "spore", "sprout", "stack",
  "stag", "star", "stem", "stone", "storm", "stream", "stride", "swift",
  "swirl", "tempo", "tend", "thorn", "thread", "tide", "tile", "torch",
  "trace", "track", "trail", "tribe", "tulip", "twig", "vault", "veer",
  "vein", "verge", "vex", "vine", "vista", "vivid", "void", "vow", "wade",
  "wake", "wave", "whim", "whirl", "whisk", "wick", "wild", "wind", "wisp",
  "wolf", "zen", "zest", "zone",
  // additional generic startup-y nouns
  "base", "beam", "bolt", "brick", "cloud", "core", "craft", "cube",
  "dash", "drop", "forge", "frame", "fuse", "gauge", "glide", "kite",
  "light", "lyra", "mint", "mode", "peak", "pivot", "pixel", "point",
  "range", "reach", "rise", "rove", "scale", "scout", "seek", "shape",
  "shore", "signal", "slice", "sonic", "sphere", "spin", "splash", "stack",
  "stage", "swift", "sync", "tap", "tempo", "tide", "tonic", "tower",
  "trust", "tune", "unit", "vibe", "voice", "wander", "warp", "watch",
  "wing", "wire", "zip",
]);

// Well-known brands / products the LLM regularly suggests.
export const KNOWN_BRANDS: ReadonlySet<string> = new Set([
  "adobe", "airbnb", "amazon", "anthropic", "apple", "asana", "astro",
  "atlassian", "aws", "azure", "bard", "bing", "brave", "canva", "chrome",
  "claude", "cloudflare", "cohere", "copilot", "costco", "cursor", "deno",
  "discord", "docker", "dropbox", "duckduckgo", "ebay", "etsy", "facebook",
  "figma", "firefox", "ford", "framer", "gemini", "github", "gitlab",
  "gleam", "google", "grok", "heroku", "honda", "ikea", "instagram",
  "jira", "kaido", "laravel", "linear", "linkedin", "loom", "lyft",
  "meta", "microsoft", "miro", "netflix", "netlify", "nextjs", "nike",
  "notion", "oculus", "openai", "opera", "pinterest", "pixelmator", "postman",
  "raycast", "react", "reddit", "remix", "ruby", "safari", "shopify",
  "slack", "snapchat", "spotify", "square", "stripe", "svelte", "target",
  "tesla", "tiktok", "toyota", "trello", "twitch", "twitter", "uber",
  "vercel", "vite", "vue", "walmart", "webflow", "whimsical", "yahoo",
  "youtube", "zed", "zoom",
]);

// Tight list surfaced to the Gemini prompt so it stops suggesting these.
// Kept short to avoid bloating every request.
export const PROMPT_AVOID: readonly string[] = [
  "notion", "linear", "vercel", "figma", "loom", "zed", "stripe", "shopify",
  "flow", "hub", "base", "spark", "beam", "wave", "pulse", "core", "loop",
  "grid", "bolt", "nova", "sync", "link", "drop", "zap", "note", "edge",
  "root", "node", "luna", "fern", "drift", "arc", "echo",
];
