const fs = require("fs");
const path = require("path");

const OUT = "/Users/xavi/student-news/src/images";
const W = 1200;
const H = 800;

const frame = (ink, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
  <rect width="${W}" height="${H}" fill="#0a2240"/>
  <g stroke="${ink}" fill="none" stroke-width="2" opacity="0.85">${body}</g>
</svg>
`;

const grid = (step = 100, opacity = 0.12) => {
  let out = `<g opacity="${opacity}" stroke-width="1">`;
  for (let x = step; x < W; x += step) out += `<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`;
  for (let y = step; y < H; y += step) out += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;
  return out + `</g>`;
};

// deterministic pseudo-random so output is stable between runs
let seed = 7;
const rand = () => {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
};

const visuals = {
  economics: () => {
    const points = [];
    for (let i = 0; i <= 11; i++) {
      const x = 80 + i * 96;
      const y = 660 - i * 40 - rand() * 90;
      points.push([x, y]);
    }
    const line = points.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y.toFixed(0)}`).join(" ");
    const dots = points.map(([x, y]) => `<circle cx="${x}" cy="${y.toFixed(0)}" r="6" fill="#0a2240"/>`).join("");
    return grid() + `<path d="${line}" stroke-width="3"/>` + dots;
  },

  finance: () => {
    let bars = "";
    for (let i = 0; i < 18; i++) {
      const x = 70 + i * 62;
      const mid = 400 + (rand() - 0.5) * 220;
      const half = 40 + rand() * 90;
      const body = 20 + rand() * 60;
      bars += `<line x1="${x}" y1="${(mid - half).toFixed(0)}" x2="${x}" y2="${(mid + half).toFixed(0)}" stroke-width="2"/>`;
      bars += `<rect x="${x - 12}" y="${(mid - body / 2).toFixed(0)}" width="24" height="${body.toFixed(0)}" stroke-width="2"/>`;
    }
    return grid(100, 0.1) + bars;
  },

  politics: () => {
    let cols = "";
    for (let i = 0; i < 7; i++) {
      const x = 180 + i * 145;
      cols += `<rect x="${x}" y="300" width="58" height="330" stroke-width="2"/>`;
      cols += `<line x1="${x + 29}" y1="300" x2="${x + 29}" y2="630" opacity="0.4" stroke-width="1"/>`;
    }
    return (
      grid(200, 0.08) +
      `<path d="M120 300 L600 140 L1080 300 Z" stroke-width="3"/>` +
      `<line x1="110" y1="300" x2="1090" y2="300" stroke-width="3"/>` +
      cols +
      `<line x1="90" y1="630" x2="1110" y2="630" stroke-width="3"/>` +
      `<line x1="60" y1="680" x2="1140" y2="680" stroke-width="2" opacity="0.5"/>`
    );
  },

  ideas: () => {
    let rings = "";
    for (let r = 70; r <= 330; r += 52) {
      rings += `<circle cx="600" cy="400" r="${r}" opacity="${(1 - r / 520).toFixed(2)}"/>`;
    }
    return (
      grid(200, 0.08) +
      rings +
      `<circle cx="430" cy="400" r="200" opacity="0.5"/>` +
      `<circle cx="770" cy="400" r="200" opacity="0.5"/>` +
      `<line x1="120" y1="400" x2="1080" y2="400" opacity="0.35" stroke-width="1"/>`
    );
  },

  technology: () => {
    const nodes = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 7; col++) {
        nodes.push([140 + col * 155, 180 + row * 155 + (rand() - 0.5) * 40]);
      }
    }
    let edges = "";
    nodes.forEach(([x, y], i) => {
      const next = nodes[i + 1];
      const below = nodes[i + 7];
      if (next && (i + 1) % 7 !== 0) edges += `<line x1="${x}" y1="${y.toFixed(0)}" x2="${next[0]}" y2="${next[1].toFixed(0)}" opacity="0.4" stroke-width="1"/>`;
      if (below) edges += `<line x1="${x}" y1="${y.toFixed(0)}" x2="${below[0]}" y2="${below[1].toFixed(0)}" opacity="0.4" stroke-width="1"/>`;
    });
    const dots = nodes.map(([x, y]) => `<circle cx="${x}" cy="${y.toFixed(0)}" r="7"/>`).join("");
    return edges + dots;
  },

  society: () => {
    let dots = "";
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 15; col++) {
        const x = 100 + col * 72;
        const y = 120 + row * 72;
        const filled = rand() > 0.62;
        dots += `<circle cx="${x}" cy="${y}" r="14" ${filled ? 'fill="' + "currentInk" + '"' : ""} opacity="${filled ? 0.9 : 0.45}"/>`;
      }
    }
    return dots;
  },

  research: () => {
    let strata = "";
    for (let i = 0; i < 6; i++) {
      const y = 180 + i * 90;
      let d = `M80 ${y}`;
      for (let x = 180; x <= 1120; x += 94) {
        d += ` Q ${x - 47} ${(y + (rand() - 0.5) * 70).toFixed(0)} ${x} ${y}`;
      }
      strata += `<path d="${d}" opacity="${(0.9 - i * 0.1).toFixed(2)}"/>`;
    }
    let scatter = "";
    for (let i = 0; i < 26; i++) {
      scatter += `<circle cx="${(100 + rand() * 1000).toFixed(0)}" cy="${(150 + rand() * 520).toFixed(0)}" r="5" opacity="0.6"/>`;
    }
    return grid(150, 0.08) + strata + scatter;
  },
};

const inks = {
  economics: "#8fb8ff",
  finance: "#6fd0e8",
  politics: "#a9c2e8",
  ideas: "#cfdcf0",
  technology: "#7fa8f5",
  society: "#9fc6dd",
  research: "#b8c8de",
};

fs.mkdirSync(OUT, { recursive: true });

Object.entries(visuals).forEach(([name, build]) => {
  seed = 7; // reset so each file is deterministic
  const ink = inks[name];
  const svg = frame(ink, build()).replaceAll("currentInk", ink);
  fs.writeFileSync(path.join(OUT, `abstract-${name}.svg`), svg);
  console.log("wrote", `abstract-${name}.svg`);
});
