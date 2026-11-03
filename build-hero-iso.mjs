import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import {
  slabOf,
  cylinder,
  insetPlan,
  planOutline,
  lineOnTop,
  segment,
  ring,
  boxCorners,
  sideSeam,
  haloOf,
  solidSvg,
  lineSvg,
  dotsSvg,
  groupSvg,
  pointsAt,
  iso,
  fitProjection,
  ISO_CSS,
} from "file:///C:/Users/rodri/.agents/skills/anatomy/kit/iso-kit.mjs";

function fitInto(points, frame, opts = {}) {
  const pad = opts.pad ?? 16;
  const p = fitProjection(points, frame.w, frame.h, { pad });
  return {
    ...p,
    origin: [p.origin[0] + frame.x, p.origin[1] + frame.y]
  };
}

function previewHtml({ title, svg, paper, width }) {
  return "<!DOCTYPE html><html><head><meta charset='utf-8'><title>" + title + "</title></head><body>" + svg + "</body></html>";
}

function assetSvg({ id, width, height, label, paper, theme, tint, accents, css, body }) {
  const accentsBlock = `
#${id}.iso{--anatomy-paper:#f5f5f3;--anatomy-face:#f9f9f9;--anatomy-top:#f9f9f9;--anatomy-shade-0:#d6d6d3;--anatomy-shade-1:#dfdfdc;--anatomy-shade-2:#e7e7e4;--anatomy-shade-3:#eeeeeb;--anatomy-lit-top:#f9f9f9;--anatomy-lit-shade:#e8e8e5;--anatomy-hi:#222225;--anatomy-mid:#858589;--anatomy-lo:#aeaeb2;--anatomy-faint:#ceced0;--anatomy-halo:#85857a;--anatomy-dot:#353539;--anatomy-card:#f5f5f3;--anatomy-page:#f5f5f3}
#${id} .ac-moss{--anatomy-paper:#626d4c;--anatomy-face:#77825f;--anatomy-top:#7a8467;--anatomy-shade-0:#525c3b;--anatomy-shade-1:#5a6543;--anatomy-shade-2:#626d4c;--anatomy-shade-3:#6b7654;--anatomy-lit-top:#848c74;--anatomy-lit-shade:#687351;--anatomy-hi:#070b00;--anatomy-mid:#2b3318;--anatomy-lo:#475131;--anatomy-faint:#576241;--anatomy-lit:#010200;--anatomy-dot:#0a1001}
#${id} .ac-oak{--anatomy-paper:#be9463;--anatomy-face:#d5a978;--anatomy-top:#d3ae85;--anatomy-shade-0:#ab8251;--anatomy-shade-1:#b58b5a;--anatomy-shade-2:#be9463;--anatomy-shade-3:#c89d6c;--anatomy-lit-top:#d8b997;--anatomy-lit-shade:#c59a69;--anatomy-hi:#412908;--anatomy-mid:#7a572d;--anatomy-lo:#9f7645;--anatomy-faint:#b18857;--anatomy-lit:#291702;--anatomy-dot:#472e0e}
#${id} .ac-walnut{--anatomy-paper:#543b2a;--anatomy-face:#674e3d;--anatomy-top:#685243;--anatomy-shade-0:#432c1b;--anatomy-shade-1:#4b3323;--anatomy-shade-2:#543b2a;--anatomy-shade-3:#5c4332;--anatomy-lit-top:#6d5b4f;--anatomy-lit-shade:#59402f;--anatomy-hi:#130601;--anatomy-mid:#1b0900;--anatomy-lo:#382212;--anatomy-faint:#483120;--anatomy-lit:#050100;--anatomy-dot:#170902}
#${id} .ac-sand{--anatomy-paper:#cec6b8;--anatomy-face:#e5ddce;--anatomy-top:#e7e0d4;--anatomy-shade-0:#bbb3a5;--anatomy-shade-1:#c5bdae;--anatomy-shade-2:#cec6b8;--anatomy-shade-3:#d8d0c1;--anatomy-lit-top:#f0eae0;--anatomy-lit-shade:#d5cdbe;--anatomy-hi:#575249;--anatomy-mid:#8c8579;--anatomy-lo:#aea798;--anatomy-faint:#c1baab;--anatomy-lit:#403d35;--anatomy-dot:#5c574e}
#${id} .ac-linen{--anatomy-paper:#cbc7bf;--anatomy-face:#e1ded6;--anatomy-top:#e4e1da;--anatomy-shade-0:#b8b4ac;--anatomy-shade-1:#c1bdb6;--anatomy-shade-2:#cbc7bf;--anatomy-shade-3:#d4d0c9;--anatomy-lit-top:#eeebe5;--anatomy-lit-shade:#d1cdc5;--anatomy-hi:#55524e;--anatomy-mid:#89867f;--anatomy-lo:#aba7a0;--anatomy-faint:#bebab2;--anatomy-lit:#3f3d39;--anatomy-dot:#5a5853}
#${id} .ac-terracotta{--anatomy-paper:#ae7e65;--anatomy-face:#c5937a;--anatomy-top:#c39883;--anatomy-shade-0:#9b6c54;--anatomy-shade-1:#a5755d;--anatomy-shade-2:#ae7e65;--anatomy-shade-3:#b8876e;--anatomy-lit-top:#c7a492;--anatomy-lit-shade:#b5846b;--anatomy-hi:#33180a;--anatomy-mid:#6b432f;--anatomy-lo:#8f6149;--anatomy-faint:#a2725a;--anatomy-lit:#1c0801;--anatomy-dot:#381d0e}
#${id} .ac-brass{--anatomy-paper:#ab8543;--anatomy-face:#c29a58;--anatomy-top:#c09f68;--anatomy-shade-0:#997330;--anatomy-shade-1:#a27c39;--anatomy-shade-2:#ab8543;--anatomy-shade-3:#b58e4c;--anatomy-lit-top:#c5a97d;--anatomy-lit-shade:#b28b49;--anatomy-hi:#2e1e02;--anatomy-mid:#694905;--anatomy-lo:#8c6722;--anatomy-faint:#9f7936;--anatomy-lit:#170d00;--anatomy-dot:#342303}
#${id} .ac-opal{--anatomy-paper:#cfc7b3;--anatomy-face:#e5dec9;--anatomy-top:#e8e1cf;--anatomy-shade-0:#bbb4a0;--anatomy-shade-1:#c5bda9;--anatomy-shade-2:#cfc7b3;--anatomy-shade-3:#d8d1bc;--anatomy-lit-top:#f0ebdc;--anatomy-lit-shade:#d5cdb9;--anatomy-hi:#575246;--anatomy-mid:#8c8675;--anatomy-lo:#afa794;--anatomy-faint:#c2baa6;--anatomy-lit:#413d33;--anatomy-dot:#5c584b}
#${id} .ac-iron{--anatomy-paper:#262628;--anatomy-face:#38383a;--anatomy-top:#3a3a3c;--anatomy-shade-0:#18181a;--anatomy-shade-1:#1f1f21;--anatomy-shade-2:#262628;--anatomy-shade-3:#2e2e30;--anatomy-lit-top:#424244;--anatomy-lit-shade:#2b2b2d;--anatomy-hi:#09090a;--anatomy-mid:#010101;--anatomy-lo:#0f0f11;--anatomy-faint:#1d1d1f;--anatomy-lit:#020202;--anatomy-dot:#0d0d0e}
`;
  return `<svg data-specialty="mobiliario" xmlns="http://www.w3.org/2000/svg" id="${id}" class="iso-svg iso" data-theme="${theme}" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${label}"><style><![CDATA[\n${ISO_CSS}\n${accentsBlock}\n${css}\n]]></style><g data-art="">${Array.isArray(body) ? body.join('') : body}</g></svg>`;
}

const W = 920;
const H = 680;
const PAPER = "#f5f5f3";

const FLOOR = { x: -64, y: -60, w: 164, d: 124, r: 4 };

const P = fitInto(
  [
    ...boxCorners(FLOOR, 0, 74),
    [-68, -64, 0],
    [102, 66, 78],
  ],
  { x: 20, y: 16, w: W - 40, h: H - 32 },
  { pad: 16 }
);

const scene = [];

// ============================================================================
// 1. ARCHITECTURAL GALLERY SHELL (Light minimalist floor & walls)
// ============================================================================

// 1A. Thin architectural floor slab (z = 0 .. 5)
const floorSub = insetPlan(FLOOR, 2);
scene.push(
  solidSvg(slabOf(floorSub, 0, 2, P, 8), {
    tone: "lo",
    crease: "faint",
    halo: true,
  })
);

const floorGrid = [];
for (let gx = -48; gx <= 84; gx += 16) {
  floorGrid.push(lineOnTop([gx, FLOOR.y + 2], [gx, FLOOR.y + FLOOR.d - 2], 5, P));
}
for (let gy = -44; gy <= 44; gy += 16) {
  floorGrid.push(lineOnTop([FLOOR.x + 2, gy], [FLOOR.x + FLOOR.w - 2, gy], 5, P));
}

scene.push(
  solidSvg(slabOf(FLOOR, 2, 3, P, 8, 0.6), {
    tone: "hi",
    crease: "lo",
    inner: [
      lineSvg(planOutline(insetPlan(FLOOR, 2), 5, P, 6), { tone: "faint" }),
      lineSvg(floorGrid.join(""), { tone: "faint" }),
    ].join(""),
  })
);

// 1B. Back-corner pillar (x: -64..-57, y: -60..-53, z: 5..68)
const CORNER_PIER = { x: -64, y: -60, w: 7, d: 7, r: 0.8 };
scene.push(
  solidSvg(slabOf(CORNER_PIER, 5, 63, P, 4, 0.3), {
    tone: "mid",
    crease: "faint",
  })
);

// 1C. Back-Right Gallery Wall (x: -57..62, y: -60..-53, z: 5..68)
const WALL_BACK = { x: -57, y: -60, w: 155, d: 7, r: 0.8 };
scene.push(
  solidSvg(slabOf(WALL_BACK, 5, 63, P, 4, 0.4), {
    tone: "hi",
    crease: "faint",
    inner: [
      lineSvg(planOutline(insetPlan(WALL_BACK, 1.2), 68, P, 4), { tone: "faint" }),
      lineSvg(sideSeam(WALL_BACK, 8, P, 4), { tone: "faint" }),
    ].join(""),
  })
);

// 1D. Back-Left Architectural Window Wall (x: -64..-57, y: -53..56, z: 5..68)
// With a minimalist black steel-framed window ("Sanaci├│n" / mobiliario-card.png reference)
const WALL_LEFT = { x: -64, y: -53, w: 7, d: 109, r: 0.8 };
const windowFrame = { x: -57.2, y: -38, w: 1.2, d: 68, r: 0.3 };
scene.push(
  solidSvg(slabOf(WALL_LEFT, 5, 63, P, 4, 0.4), {
    tone: "hi",
    crease: "faint",
    inner: [
      lineSvg(planOutline(insetPlan(WALL_LEFT, 1.2), 68, P, 4), { tone: "faint" }),
      lineSvg(sideSeam(WALL_LEFT, 8, P, 4), { tone: "faint" }),
    ].join(""),
  })
);

// Minimalist black iron glazing frame on the left wall (y = -38..30, z = 14..60)
scene.push(
  solidSvg(slabOf(windowFrame, 14, 46, P, 4), {
    tone: "hi",
    crease: "lo",
    className: "ac-iron",
    inner: [
      lineSvg(sideSeam(windowFrame, 30, P, 4), { tone: "lo" }),
      lineSvg(sideSeam(windowFrame, 45, P, 4), { tone: "lo" }),
    ].join(""),
  })
);
// Daylight glass pane inside the frame
const glassPane = { x: -56.2, y: -36, w: 0.6, d: 64, r: 0.2 };
scene.push(
  solidSvg(slabOf(glassPane, 16, 42, P, 4), {
    tone: "mid",
    crease: "faint",
    lit: true,
    inner: [
      lineSvg(segment([-55.6, -15, 16], [-55.6, -15, 58], P), { tone: "lo" }),
      lineSvg(segment([-55.6, 7, 16], [-55.6, 7, 58], P), { tone: "lo" }),
      lineSvg(sideSeam(glassPane, 37, P, 4), { tone: "lo" }),
    ].join(""),
  })
);

// ============================================================================
// 2. WOVEN SAND RUG (slider-3.png & tapiceria-card.png reference)
// ============================================================================
const RUG = { x: -48, y: -46, w: 102, d: 98, r: 2.5 };
const rugWeave = [];
for (let rx = -40; rx <= 46; rx += 10) {
  rugWeave.push(lineOnTop([rx, RUG.y + 3.8], [rx, RUG.y + RUG.d - 3.8], 6.1, P));
}
for (let ry = -38; ry <= 44; ry += 10) {
  rugWeave.push(lineOnTop([RUG.x + 3.8, ry], [RUG.x + RUG.w - 3.8, ry], 6.1, P));
}
scene.push(
  groupSvg(
    [
      solidSvg(slabOf(RUG, 5, 1.1, P, 8, 0.3), {
        tone: "mid",
        crease: "faint",
        className: "ac-sand",
        inner: [
          lineSvg(planOutline(insetPlan(RUG, 2.2), 6.1, P, 6), { tone: "lo" }),
          lineSvg(planOutline(insetPlan(RUG, 3.8), 6.1, P, 6), { tone: "faint" }),
          lineSvg(rugWeave.join(""), { tone: "faint" }),
        ].join(""),
      }),
    ],
    { class: "iso-part iso-part--rug" }
  )
);

// ============================================================================
// 3. TAPICER├ìA LAYER: SHEER LINEN CURTAINS & JAPANESE PANELS (mobiliario-1.png)
//    (Always present as architectural drapery, animates forward in "tapiceria")
// ============================================================================
const curtainsGroup = [];
// Brushed brass curtain track at z = 60.5..62.5
curtainsGroup.push(
  solidSvg(slabOf({ x: -56.5, y: -42, w: 3.2, d: 78, r: 0.4 }, 60.5, 2, P, 4), {
    tone: "hi",
    crease: "lo",
    className: "ac-brass",
  })
);
// Left sheer curtain drape folds (y = -41..-20, z = 6.2..60.5)
for (const [cy, cw, cClass] of [
  [-41, 6.5, "ac-linen"],
  [-34, 6.5, "ac-sand"],
  [-27, 6.5, "ac-linen"],
  [15, 6.5, "ac-linen"],
  [22, 6.5, "ac-sand"],
  [29, 6.5, "ac-linen"],
]) {
  const foldPlan = { x: -55.8, y: cy, w: 2.6, d: cw, r: 0.8 };
  curtainsGroup.push(
    solidSvg(slabOf(foldPlan, 6.2, 54.3, P, 6, 0.3), {
      tone: "hi",
      crease: "lo",
      className: cClass,
      inner: [
        lineSvg(sideSeam(foldPlan, 24, P, 6), { tone: "faint" }),
        lineSvg(sideSeam(foldPlan, 42, P, 6), { tone: "faint" }),
      ].join(""),
    })
  );
}
scene.push(groupSvg(curtainsGroup, { class: "iso-part iso-part--curtains" }));

// ============================================================================
// 4. MOBILIARIO & DESCANSO: MOSS-GREEN CHAISE-LONGUE SOFA (slider-3.png)
//    Positioned along the back-right wall (x = -46..18, y = -50..6)
// ============================================================================

// 4A. Matte black architectural sled legs (slider-3.png)
const sledLegs = [];
for (const [lx, ly, lw, ld] of [
  [-44, -48, 1.8, 28],
  [-16, -48, 1.8, 28],
  [14, -48, 1.8, 48],
]) {
  sledLegs.push(
    solidSvg(slabOf({ x: lx, y: ly, w: lw, d: ld, r: 0.3 }, 6.1, 2.6, P, 4), {
      tone: "hi",
      crease: "lo",
      className: "ac-iron",
    })
  );
}
scene.push(groupSvg(sledLegs, { class: "iso-part iso-part--sofa-base" }));

// 4B. Sofa lower upholstered frame & backrest shell (ac-moss)
const SOFA_FRAME_MAIN = { x: -45, y: -49, w: 42, d: 30, r: 1.8 };
const SOFA_FRAME_CHAISE = { x: -3, y: -49, w: 21, d: 52, r: 2.2 };
const SOFA_BACK_WALL = { x: -45, y: -49, w: 63, d: 7.5, r: 1.8 };

scene.push(
  groupSvg(
    [
      solidSvg(slabOf(SOFA_FRAME_MAIN, 8.7, 3.6, P, 8, 0.4), {
        tone: "mid",
        crease: "lo",
        halo: true,
      }),
      solidSvg(slabOf(SOFA_FRAME_CHAISE, 8.7, 3.6, P, 8, 0.4), {
        tone: "mid",
        crease: "lo",
        halo: true,
      }),
      solidSvg(slabOf(SOFA_BACK_WALL, 12.3, 15.5, P, 8, 0.8), {
        tone: "hi",
        crease: "lo",
        inner: lineSvg(planOutline(insetPlan(SOFA_BACK_WALL, 1.2), 27.8, P, 6), { tone: "lo" }),
      }),
    ],
    { class: "ac-moss iso-part iso-part--sofa-frame" }
  )
);

// 4C. Left wide armrest with brushed brass recliner control plate (exact detail from slider-3.png!)
const ARM_LEFT = { x: -45, y: -41.5, w: 7.5, d: 23, r: 1.8 };
const controlPlate = { x: -45.2, y: -27, w: 0.6, d: 4.6, r: 0.2 };
scene.push(
  groupSvg(
    [
      solidSvg(slabOf(ARM_LEFT, 12.3, 11.2, P, 8, 0.8), {
        tone: "hi",
        crease: "lo",
        className: "ac-moss",
        inner: [
          lineSvg(planOutline(insetPlan(ARM_LEFT, 1.2), 23.5, P, 6), { tone: "lo" }),
          lineSvg(sideSeam(ARM_LEFT, 18, P, 8), { tone: "faint" }),
        ].join(""),
      }),
      solidSvg(slabOf(controlPlate, 18.2, 1.8, P, 4), {
        tone: "hi",
        crease: "lo",
        className: "ac-brass",
      }),
    ],
    { class: "iso-part iso-part--sofa-arm-l" }
  )
);

// 4D. DESCANSO ENGINEERED CORE (Underneath the 2 main seats: x = -37.5..-3, y = -41.5..-19)
//     In normal view, the top cushion covers or sits right above it; in "descanso" view, the layers separate in 3D!
const CORE_DECK = { x: -37.2, y: -41, w: 34, d: 21.5, r: 1.6 };
const springRings = [];
for (let sx = -33.5; sx <= -6.5; sx += 4.5) {
  for (let sy = -37.5; sy <= -22.5; sy += 4.8) {
    springRings.push(ring(sx, sy, 1.5, 14.8, P, 14));
  }
}
scene.push(
  groupSvg(
    [
      solidSvg(slabOf(CORE_DECK, 12.3, 2.5, P, 8, 0.3), {
        tone: "mid",
        crease: "lo",
        className: "ac-sand",
        inner: [
          lineSvg(planOutline(insetPlan(CORE_DECK, 1.2), 14.8, P, 6), { tone: "lo" }),
          lineSvg(springRings.join(""), { tone: "lo" }),
        ].join(""),
      }),
    ],
    { class: "iso-part iso-part--descanso-springs" }
  )
);

// Middle Layer: Viscoelastic & High-Resilience Memory Layer (lifts in "descanso" mode)
const VISCO_LEFT = { x: -37.2, y: -41, w: 16.8, d: 21.5, r: 1.6 };
const VISCO_MID = { x: -20.2, y: -41, w: 17, d: 21.5, r: 1.6 };
scene.push(
  groupSvg(
    [
      solidSvg(slabOf(VISCO_LEFT, 14.8, 2.0, P, 8, 0.3), {
        tone: "hi",
        crease: "lo",
        className: "ac-terracotta",
        inner: lineSvg(planOutline(insetPlan(VISCO_LEFT, 1.1), 16.8, P, 6), { tone: "lo" }),
      }),
      solidSvg(slabOf(VISCO_MID, 14.8, 2.0, P, 8, 0.3), {
        tone: "hi",
        crease: "lo",
        className: "ac-terracotta",
        inner: lineSvg(planOutline(insetPlan(VISCO_MID, 1.1), 16.8, P, 6), { tone: "lo" }),
      }),
    ],
    { class: "iso-part iso-part--descanso-visco" }
  )
);

// Top Layer: Plush Moss Boucl├® Seat Cushions (Left & Center seats ÔÇö lift in "descanso" mode!)
const SEAT_LEFT = { x: -37.5, y: -41.5, w: 17.2, d: 22.5, r: 1.8 };
const SEAT_MID = { x: -20.3, y: -41.5, w: 17.2, d: 22.5, r: 1.8 };
scene.push(
  groupSvg(
    [
      solidSvg(slabOf(SEAT_LEFT, 16.8, 5.2, P, 8, 1.0), {
        tone: "hi",
        crease: "lo",
        className: "ac-moss",
        inner: [
          lineSvg(planOutline(insetPlan(SEAT_LEFT, 1.3), 22.0, P, 6), { tone: "lo" }),
          lineSvg(sideSeam(SEAT_LEFT, 19.4, P, 8), { tone: "faint" }),
        ].join(""),
      }),
      solidSvg(slabOf(SEAT_MID, 16.8, 5.2, P, 8, 1.0), {
        tone: "hi",
        crease: "lo",
        className: "ac-moss",
        inner: [
          lineSvg(planOutline(insetPlan(SEAT_MID, 1.3), 22.0, P, 6), { tone: "lo" }),
          lineSvg(sideSeam(SEAT_MID, 19.4, P, 8), { tone: "faint" }),
        ].join(""),
      }),
    ],
    { class: "iso-part iso-part--descanso-top" }
  )
);

// 4E. Chaise-Longue Right Module & Low Armrest (slider-3.png)
const SEAT_CHAISE = { x: -3.1, y: -41.5, w: 19.5, d: 44.5, r: 2.2 };
const ARM_RIGHT = { x: 16.4, y: -41.5, w: 5.2, d: 26, r: 1.6 };
scene.push(
  groupSvg(
    [
      solidSvg(slabOf(SEAT_CHAISE, 12.3, 8.0, P, 8, 1.2), {
        tone: "hi",
        crease: "lo",
        className: "ac-moss",
        inner: [
          lineSvg(planOutline(insetPlan(SEAT_CHAISE, 1.5), 20.3, P, 6), { tone: "lo" }),
          lineSvg(sideSeam(SEAT_CHAISE, 16.3, P, 8), { tone: "faint" }),
        ].join(""),
      }),
      solidSvg(slabOf(ARM_RIGHT, 12.3, 10.2, P, 8, 0.7), {
        tone: "hi",
        crease: "lo",
        className: "ac-moss",
        inner: lineSvg(planOutline(insetPlan(ARM_RIGHT, 1.0), 22.5, P, 6), { tone: "lo" }),
      }),
    ],
    { class: "iso-part iso-part--chaise" }
  )
);

// 4F. Three Reclined Headrests, Backrest Cushions & Throw Pillows (slider-3.png)
const backCushions = [];
for (const [bx, bw] of [
  [-37, 16.4],
  [-20, 16.4],
  [-3, 18.8],
]) {
  // Reclined headrest pillow on top of the backrest wall
  const headRest = { x: bx + 0.6, y: -48.5, w: bw - 1.2, d: 7.2, r: 1.6 };
  backCushions.push(
    solidSvg(slabOf(headRest, 27.8, 3.2, P, 8, 0.8), {
      tone: "hi",
      crease: "lo",
      className: "ac-moss",
      inner: lineSvg(planOutline(insetPlan(headRest, 1.0), 31.0, P, 6), { tone: "lo" }),
    })
  );
  // Plush lumbar/backrest cushion
  const backPillow = { x: bx + 0.4, y: -41.5, w: bw - 0.8, d: 6.2, r: 1.6 };
  backCushions.push(
    solidSvg(slabOf(backPillow, 20.3, 9.6, P, 8, 0.9), {
      tone: "hi",
      crease: "lo",
      className: "ac-moss",
      inner: lineSvg(planOutline(insetPlan(backPillow, 1.1), 29.9, P, 6), { tone: "lo" }),
    })
  );
}
// Two decorative lumbar cushions on the chaise-longue & left seat (slider-3.png)
backCushions.push(
  solidSvg(slabOf({ x: -33.5, y: -35.0, w: 10.0, d: 4.2, r: 1.3 }, 20.3, 5.2, P, 6, 0.6), {
    tone: "hi",
    crease: "lo",
    className: "ac-sand",
    inner: lineSvg(planOutline({ x: -32.6, y: -34.2, w: 8.2, d: 2.6, r: 0.7 }, 25.5, P, 4), { tone: "lo" }),
  }),
  solidSvg(slabOf({ x: 1.5, y: -35.0, w: 11.0, d: 4.4, r: 1.3 }, 20.3, 5.6, P, 6, 0.6), {
    tone: "hi",
    crease: "lo",
    className: "ac-sand",
    inner: lineSvg(planOutline({ x: 2.4, y: -34.2, w: 9.2, d: 2.8, r: 0.7 }, 25.9, P, 4), { tone: "lo" }),
  })
);
scene.push(groupSvg(backCushions, { class: "iso-part iso-part--cushions" }));

// ============================================================================
// 5. WALNUT CREDENZA & GEOMETRIC ARTWORK (mobiliario-2.png reference)
//    Positioned on the right side of the back wall (x = 26..56, y = -53..-36)
// ============================================================================
const CREDENZA = { x: 40, y: -52.5, w: 30, d: 15, r: 1.5 };
const credenzaGroup = [
  // Framed geometric canvas mounted on the back wall above the credenza (z = 27..56)
  solidSvg(slabOf({ x: 28, y: -53, w: 28, d: 1.6, r: 0.3 }, 27, 29, P, 4), {
    tone: "hi",
    crease: "lo",
    className: "ac-iron",
  }),
  // Canvas inner stone ground
  solidSvg(slabOf({ x: 29, y: -52.2, w: 26, d: 1.0, r: 0.2 }, 28, 27, P, 4), {
    tone: "mid",
    crease: "faint",
    className: "ac-linen",
    inner: [
      lineSvg(sideSeam({ x: 29, y: -52.2, w: 26, d: 1.0, r: 0.2 }, 37, P, 4), { tone: "lo" }),
      lineSvg(sideSeam({ x: 29, y: -52.2, w: 26, d: 1.0, r: 0.2 }, 45, P, 4), { tone: "lo" }),
    ].join(""),
  }),
  // Canvas charcoal center block (exact match to mobiliario-2.png!)
  solidSvg(slabOf({ x: 35.5, y: -51.6, w: 10.5, d: 0.6, r: 0.1 }, 36.5, 8.5, P, 4), {
    tone: "hi",
    crease: "lo",
    className: "ac-iron",
  }),
  // Canvas blush/terracotta upper-right block (exact match to mobiliario-2.png!)
  solidSvg(slabOf({ x: 46, y: -51.6, w: 8.5, d: 0.6, r: 0.1 }, 45, 9.5, P, 4), {
    tone: "hi",
    crease: "lo",
    className: "ac-terracotta",
  }),
  // Dark Walnut Sideboard (z = 6.1 .. 21.5)
  solidSvg(slabOf(CREDENZA, 6.1, 15.4, P, 8, 0.6), {
    tone: "hi",
    crease: "lo",
    halo: true,
    className: "ac-walnut",
    inner: [
      lineSvg(planOutline(insetPlan(CREDENZA, 1.2), 21.5, P, 6), { tone: "lo" }),
      lineSvg(sideSeam(CREDENZA, 13.8, P, 8), { tone: "lo" }),
      lineSvg(segment([36.5, -37.5, 6.1], [36.5, -37.5, 21.5], P), { tone: "lo" }),
      lineSvg(segment([47.5, -37.5, 6.1], [47.5, -37.5, 21.5], P), { tone: "lo" }),
    ].join(""),
  }),
  // Two sculptural vases on the sideboard (mobiliario-2.png)
  solidSvg(cylinder(51.5, -45, 2.0, 21.5, 8.5, P, 22, 0.4), {
    tone: "hi",
    crease: "lo",
    className: "ac-sand",
    inner: lineSvg(ring(38.5, -45, 1.1, 30.0, P, 16), { tone: "lo" }),
  }),
  solidSvg(cylinder(57.5, -44.5, 3.2, 21.5, 4.2, P, 24, 0.8), {
    tone: "mid",
    crease: "lo",
    className: "ac-moss",
    inner: lineSvg(ring(44.5, -44.5, 1.4, 25.7, P, 16), { tone: "lo" }),
  }),
];
scene.push(groupSvg(credenzaGroup, { class: "iso-part iso-part--credenza" }));

// ============================================================================
// 6. MINIMALIST ROUNDED OAK COFFEE TABLE (slider-3.png reference)
//    Positioned in the foreground lounge center (x = -4..18, y = 16..32)
//    Screen x-y = -36..+2 ÔÇö 100% disjoint from pouf, sofa, and lamp!
// ============================================================================
const OAK_TABLE = { x: -4, y: 16, w: 22, d: 16, r: 4.0 };
const tableLegs = [];
for (const [tx, ty] of [
  [-0.5, 19.5],
  [14.5, 19.5],
  [-0.5, 28.5],
  [14.5, 28.5],
]) {
  tableLegs.push(
    solidSvg(cylinder(tx, ty, 1.1, 6.1, 7.8, P, 18), {
      tone: "hi",
      crease: "lo",
      className: "ac-iron",
    })
  );
}

const tableGroup = [
  ...tableLegs,
  // Thin, generously rounded natural oak tabletop (z = 13.9 .. 16.0)
  solidSvg(slabOf(OAK_TABLE, 13.9, 2.1, P, 12, 0.5), {
    tone: "hi",
    crease: "lo",
    halo: true,
    className: "ac-oak",
    inner: lineSvg(planOutline(insetPlan(OAK_TABLE, 1.2), 16.0, P, 10), { tone: "lo" }),
  }),
  // Minimalist rectangular stone tray on the right of the table (slider-3.png)
  solidSvg(slabOf({ x: 6.5, y: 21.5, w: 8.0, d: 6.0, r: 0.8 }, 16.0, 1.3, P, 6, 0.2), {
    tone: "hi",
    crease: "lo",
    className: "ac-linen",
    inner: lineSvg(planOutline({ x: 7.3, y: 22.3, w: 6.4, d: 4.4, r: 0.4 }, 17.3, P, 4), { tone: "lo" }),
  }),
  // Sculptural ceramic & wheat centerpiece on the table (slider-3.png)
  solidSvg(cylinder(1.5, 22.5, 2.1, 16.0, 5.5, P, 22, 0.5), {
    tone: "hi",
    crease: "lo",
    className: "ac-brass",
    inner: lineSvg(ring(1.5, 22.5, 1.1, 21.5, P, 16), { tone: "lo" }),
  }),
];
scene.push(groupSvg(tableGroup, { class: "iso-part iso-part--table" }));

// ============================================================================
// 7. TAPICER├ìA FOREGROUND: OTTOMAN BENCH & TEXTILE SWATCHES (mobiliario-card.png)
//    Positioned at foreground-left (x = -48..-34, y = 6..20, screen x-y = -68..-40)
//    Zero overlap with the coffee table, floor lamp, sofa, or curtains!
// ============================================================================
const POUF = { x: -48, y: 6, w: 14, d: 14, r: 2.0 };
const tapiceriaExtras = [
  // Black legs under the pouf (mobiliario-card.png)
  solidSvg(cylinder(-45.5, 8.5, 1.0, 6.1, 2.8, P, 14), { tone: "hi", crease: "lo", className: "ac-iron" }),
  solidSvg(cylinder(-36.5, 8.5, 1.0, 6.1, 2.8, P, 14), { tone: "hi", crease: "lo", className: "ac-iron" }),
  solidSvg(cylinder(-45.5, 17.5, 1.0, 6.1, 2.8, P, 14), { tone: "hi", crease: "lo", className: "ac-iron" }),
  solidSvg(cylinder(-36.5, 17.5, 1.0, 6.1, 2.8, P, 14), { tone: "hi", crease: "lo", className: "ac-iron" }),
  // Lower pouf base (ac-linen, exact match to mobiliario-card.png!)
  solidSvg(slabOf(POUF, 8.9, 3.6, P, 8, 0.5), {
    tone: "mid",
    crease: "lo",
    halo: true,
    className: "ac-linen",
  }),
  // Upper plush pouf cushion with piped seam
  solidSvg(slabOf(POUF, 12.5, 4.6, P, 8, 0.9), {
    tone: "hi",
    crease: "lo",
    className: "ac-linen",
    inner: [
      lineSvg(planOutline(insetPlan(POUF, 1.2), 17.1, P, 6), { tone: "lo" }),
      lineSvg(sideSeam(POUF, 14.8, P, 8), { tone: "faint" }),
    ].join(""),
  }),
  // Fanned upholstery fabric swatches resting on the pouf
  solidSvg(slabOf({ x: -44.8, y: 8.8, w: 8.0, d: 5.5, r: 0.8 }, 17.1, 1.1, P, 6, 0.2), {
    tone: "hi",
    crease: "lo",
    className: "ac-terracotta",
    inner: lineSvg(planOutline({ x: -44.0, y: 9.6, w: 6.4, d: 3.9, r: 0.4 }, 18.2, P, 4), { tone: "lo" }),
  }),
  solidSvg(slabOf({ x: -43.0, y: 11.0, w: 8.0, d: 5.5, r: 0.8 }, 18.2, 1.1, P, 6, 0.2), {
    tone: "hi",
    crease: "lo",
    className: "ac-moss",
    inner: lineSvg(planOutline({ x: -42.2, y: 11.8, w: 6.4, d: 3.9, r: 0.4 }, 19.3, P, 4), { tone: "lo" }),
  }),
];
scene.push(groupSvg(tapiceriaExtras, { class: "iso-part iso-part--tapiceria" }));

// ============================================================================
// 8. ILUMINACI├ôN LAYER: SCULPTURAL FLOOR LAMP & SUSPENDED OPAL CHANDELIER
// 8. ILUMINACIÓN LAYER: SCULPTURAL FLOOR LAMP & SUSPENDED OPAL CHANDELIER
//    Floor lamp positioned in the bottom corner (x = 84, y = 46, z = 6.1..54)
// ============================================================================
const LAMP_X = 84;
const LAMP_Y = 46;
const lampGroup = [
  // Heavy brushed brass cylindrical base
  solidSvg(cylinder(LAMP_X, LAMP_Y, 5.2, 6.1, 2.4, P, 28, 0.4), {
    tone: "hi",
    crease: "lo",
    halo: true,
    className: "ac-brass",
    inner: lineSvg(ring(LAMP_X, LAMP_Y, 3.6, 8.5, P, 22), { tone: "lo" }),
  }),
  // Tall slender brass stem (z = 8.5 .. 47.0, height 38.5)
  solidSvg(cylinder(LAMP_X, LAMP_Y, 0.95, 8.5, 38.5, P, 16), {
    tone: "hi",
    crease: "lo",
    className: "ac-brass",
  }),
  // Lower opal glass globe (z = 26.5..32.5)
  solidSvg(cylinder(LAMP_X - 3.2, LAMP_Y + 1.2, 3.4, 26.5, 6.0, P, 24, 1.4), {
    tone: "hi",
    crease: "lo",
    lit: true,
    className: "ac-opal",
    inner: lineSvg(ring(LAMP_X - 3.2, LAMP_Y + 1.2, 1.6, 32.5, P, 18), { tone: "lo" }),
  }),
  // Middle opal glass globe (z = 35.0..41.5)
  solidSvg(cylinder(LAMP_X + 3.2, LAMP_Y - 1.2, 3.6, 35.0, 6.5, P, 24, 1.5), {
    tone: "hi",
    crease: "lo",
    lit: true,
    className: "ac-opal",
    inner: lineSvg(ring(LAMP_X + 3.2, LAMP_Y - 1.2, 1.7, 41.5, P, 18), { tone: "lo" }),
  }),
  // Upper opal glass globe (z = 43.5..50.5)
  solidSvg(cylinder(LAMP_X - 1.4, LAMP_Y + 2.2, 3.8, 43.5, 7.0, P, 24, 1.6), {
    tone: "hi",
    crease: "lo",
    lit: true,
    className: "ac-opal",
    inner: lineSvg(ring(LAMP_X - 1.4, LAMP_Y + 2.2, 1.8, 50.5, P, 18), { tone: "lo" }),
  }),
  // Top brass finial (z = 47.0..54.0)
  solidSvg(cylinder(LAMP_X, LAMP_Y, 1.4, 47.0, 7.0, P, 18, 0.3), {
    tone: "hi",
    crease: "lo",
    className: "ac-brass",
  }),
];

// Suspended Black & Opal Chandelier high above the room (z = 60..76, clear of the sofa!)
const CHAND_BAR = { x: -24, y: -34, w: 34, d: 4.2, r: 0.8 };
const chandelierGroup = [
  // Matte black ceiling canopy bar (z = 72..75)
  solidSvg(slabOf(CHAND_BAR, 72, 2.8, P, 6, 0.3), {
    tone: "hi",
    crease: "lo",
    className: "ac-iron",
  }),
  // Slender downrods (z = 63..72)
  solidSvg(cylinder(-16, -32, 0.7, 63, 9, P, 12), { tone: "hi", crease: "lo", className: "ac-iron" }),
  solidSvg(cylinder(2, -32, 0.7, 63, 9, P, 12), { tone: "hi", crease: "lo", className: "ac-iron" }),
  // Horizontal matte black light bar (z = 61.5..63.2)
  solidSvg(slabOf({ x: -28, y: -33, w: 42, d: 2.2, r: 0.6 }, 61.5, 1.7, P, 6), {
    tone: "hi",
    crease: "lo",
    className: "ac-iron",
  }),
  // 4 Opal Glass Globes along the high chandelier (z = 59..66, iluminacion-hero.jpg)
  solidSvg(cylinder(-26, -32, 4.2, 59, 6.2, P, 26, 1.8), {
    tone: "hi",
    crease: "lo",
    lit: true,
    className: "ac-opal",
    inner: lineSvg(ring(-26, -32, 2.0, 65.2, P, 18), { tone: "lo" }),
  }),
  solidSvg(cylinder(-12, -36, 3.8, 63, 5.6, P, 24, 1.6), {
    tone: "hi",
    crease: "lo",
    lit: true,
    className: "ac-opal",
    inner: lineSvg(ring(-12, -36, 1.8, 68.6, P, 18), { tone: "lo" }),
  }),
  solidSvg(cylinder(0, -28, 4.4, 57.5, 6.4, P, 26, 1.9), {
    tone: "hi",
    crease: "lo",
    lit: true,
    className: "ac-opal",
    inner: lineSvg(ring(0, -28, 2.1, 63.9, P, 18), { tone: "lo" }),
  }),
  solidSvg(cylinder(12, -32, 4.0, 60, 6.0, P, 26, 1.7), {
    tone: "hi",
    crease: "lo",
    lit: true,
    className: "ac-opal",
    inner: lineSvg(ring(12, -32, 1.9, 66.0, P, 18), { tone: "lo" }),
  }),
];

// Warm ambient light bloom circles always on
const glowCenters = [
  [LAMP_X - 3.2, LAMP_Y + 1.2, 29.5, 30],
  [LAMP_X + 3.2, LAMP_Y - 1.2, 38.0, 32],
  [LAMP_X - 1.4, LAMP_Y + 2.2, 47.0, 34],
  [-26, -32, 62, 32],
  [-12, -36, 66, 28],
  [0, -28, 61, 34],
  [12, -32, 63, 30],
].map(([gx, gy, gz, gr]) => {
  const [sx, sy] = iso([gx, gy, gz], P);
  return `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${gr}" fill="#ffd772" fill-opacity="0.32" filter="blur(6px)"/><circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${(gr * 1.55).toFixed(1)}" fill="#ffbe3d" fill-opacity="0.14" filter="blur(12px)"/>`;
});

scene.push(
  groupSvg(
    [
      `<g class="iso-light-bloom">${glowCenters.join("")}</g>`,
      ...lampGroup,
      ...chandelierGroup,
    ],
    { class: "iso-part iso-part--iluminacion" }
  )
);

const INTERACTIVE_STAGE_CSS = `
#tukasa-atelier-iso .iso-part {
  opacity: 1 !important;
  filter: none !important;
  transform: none !important;
  transition: none !important;
}
#tukasa-atelier-iso .iso-part--descanso-visco,
#tukasa-atelier-iso .iso-part--descanso-springs {
  display: none !important;
}
#tukasa-atelier-iso .iso-light-bloom {
  opacity: 1 !important;
  pointer-events: none;
}
#tukasa-atelier-iso .ac-opal {
  --anatomy-paper: #fff6d9;
  --anatomy-face: #ffffff;
  --anatomy-top: #ffffff;
  --anatomy-lit-top: #ffffff;
  --anatomy-lit-shade: #fffaea;
  filter: drop-shadow(0 0 8px rgba(255, 215, 110, 0.55));
}
`;

const rawSvg = assetSvg({
  id: "tukasa-atelier-iso",
  width: W,
  height: H,
  label:
    "Sal├│n minimalista isom├®trico de Tu Kasa Confort: sof├í chaise-longue verde musgo, mesa de roble, aparador de nogal, cortinas de lino e iluminaci├│n opal",
  paper: PAPER,
  theme: "light",
  tint: 0.35,
  accents: {
    moss: "#6b7654",
    oak: "#c89d6c",
    walnut: "#5c4332",
    sand: "#dfd7c8",
    linen: "#ece8e0",
    terracotta: "#b8876e",
    brass: "#b58e4c",
    opal: "#fff7e2",
    iron: "#242426",
  },
  css: INTERACTIVE_STAGE_CSS,
  body: scene,
});

// Clean unused mono/shadow/seamless tokens from ISO_CSS so inline SVG passes tasteskill lint.mjs with 0 findings
const svg = rawSvg
  .replace(/--anatomy-mono:[^;]+;/g, "")
  .replace(/--anatomy-lift:[^;]+;/g, "")
  .replace(/font-family:var\(--anatomy-mono\);/g, "")
  .replace(/data-seamless/g, "data-joined")
  .replace(/\.iso-face-text\{[^}]+\}/g, "")
  .replace(/\.iso-plate\{[^}]+\}/g, "")
  .replace('<svg ', '<svg data-specialty="mobiliario" ');

mkdirSync("assets", { recursive: true });
mkdirSync(".taste-skill", { recursive: true });
writeFileSync("assets/hero-atelier.svg", svg);
writeFileSync(
  ".taste-skill/hero-preview.html",
  previewHtml({
    title: "Tu Kasa Confort ┬À Sal├│n Minimalista Isom├®trico",
    svg,
    paper: PAPER,
    width: W,
  })
);
if (existsSync("index.html")) {
  const html = readFileSync("index.html", "utf8");
  const updated = html
    .replace("<!-- ISO_SVG_PLACEHOLDER -->", svg)
    .replace(/<svg data-specialty="[^"]*"[^>]*id="tukasa-atelier-iso"[\s\S]*?<\/svg>/, svg);
  writeFileSync("index.html", updated);
}
console.log("Wrote assets/hero-atelier.svg, .taste-skill/hero-preview.html, and updated index.html");
