/*
 * Blog cover generator via the xAI (Grok) image API.
 *
 * Usage:
 *   node scripts/generate-images.cjs test    -> generate ONE cheap preview (1k)
 *   node scripts/generate-images.cjs all     -> generate all covers (2k)
 *
 * The API key is read from the XAI_API_KEY env var, or from a local file
 * named "xai.key" in the project root (gitignored). It is never printed.
 *
 * Output files get an "-ai" suffix so the current covers are NOT overwritten
 * until you approve the new look.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const ENDPOINT = "https://api.x.ai/v1/images/generations";
const MODEL = process.env.XAI_IMAGE_MODEL || "grok-imagine-image-quality";

function readKey() {
  if (process.env.XAI_API_KEY) return process.env.XAI_API_KEY.trim();
  const keyFile = path.join(ROOT, "xai.key");
  if (fs.existsSync(keyFile)) return fs.readFileSync(keyFile, "utf8").trim();
  console.error(
    "No API key found. Put it in a file named 'xai.key' in the project root,\n" +
      "or set the XAI_API_KEY environment variable."
  );
  process.exit(1);
}

// Shared style keeps the three covers visually consistent.
// NOTE: brand lime stays in CSS (border / category tag), NOT baked into the image —
// that is what made the old covers look like stickers.
const STYLE =
  "Cinematic editorial gym photography, moody low-key lighting, dark charcoal tones, " +
  "shallow depth of field, soft natural film grain, muted color, no text, no logos, " +
  "no graphic overlays, no watermark, photorealistic, high detail.";

const COVERS = [
  {
    out: "blog-cover-soreness-recovery-ai.png",
    prompt:
      "Close-up of a muscular athlete's shoulder and upper arm resting between sets in a dark gym, " +
      "subtle sheen of effort, blurred dumbbell rack in the background.",
  },
  {
    out: "blog-cover-busy-professional-ai.png",
    prompt:
      "A single hand lifting one dumbbell off a rack in a dark moody commercial gym, " +
      "sense of a short focused session, blurred background, no face visible.",
  },
  {
    out: "blog-cover-returning-gym-ai.png",
    prompt:
      "A lone figure silhouetted walking into a bright gym doorway from darkness, backlit, " +
      "weight plates and a rack in the foreground, hopeful return-to-training mood.",
  },
];

async function generate(key, cover, resolution) {
  const body = {
    model: MODEL,
    prompt: `${cover.prompt} ${STYLE}`,
    n: 1,
    response_format: "b64_json",
    aspect_ratio: "16:9",
    resolution,
  };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok || !json) {
    console.error(`  FAILED (${res.status}):`, JSON.stringify(json));
    return false;
  }

  const item = json.data && json.data[0];
  let buf;
  if (item && item.b64_json) {
    buf = Buffer.from(item.b64_json, "base64");
  } else if (item && item.url) {
    const img = await fetch(item.url);
    buf = Buffer.from(await img.arrayBuffer());
  } else {
    console.error("  Unexpected response shape:", JSON.stringify(json).slice(0, 300));
    return false;
  }

  fs.writeFileSync(path.join(ROOT, cover.out), buf);
  console.log(`  saved -> ${cover.out} (${(buf.length / 1024).toFixed(0)} KB)`);
  return true;
}

(async () => {
  const mode = process.argv[2] || "test";
  const key = readKey();
  const list = mode === "all" ? COVERS : COVERS.slice(0, 1);
  const resolution = mode === "all" ? "2k" : "1k";

  console.log(`Model: ${MODEL} | mode: ${mode} | ${list.length} image(s) @ ${resolution}`);
  for (const cover of list) {
    console.log(`Generating: ${cover.out}`);
    await generate(key, cover, resolution);
  }
  console.log("Done.");
})();
