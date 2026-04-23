const PRICE_LIST = {
  "HIGH RIDGE": {
    "Embedded White": { rate: 380, weightPerSft: 0.594 },
    "Coated": { rate: 400, weightPerSft: 0.594 },
    "Sky Light": { rate: 540, weightPerSft: 0.500 },
  },
  "LOW RIDGE": {
    "Embedded White": { rate: 330, weightPerSft: 0.511 },
    "Coated": { rate: 350, weightPerSft: 0.511 },
    "Sky Light": { rate: 490, weightPerSft: 0.450 },
  },
  "S-TYPE": {
    "Embedded White": { rate: 280, weightPerSft: 0.483 },
    "Coated White": { rate: 300, weightPerSft: 0.483 },
    "Sky Light": { rate: 460, weightPerSft: 0.418 },
  },
  "PLAIN SHEET": {
    "Plain Sheet": { rate: 220, weightPerSft: 0.320 },
  },
};

const ACCESSORIES = {
  acc_screwCapSet: { label: "UPVC Screw Cap Set & SDS", rateEach: 80 },
  acc_sds: { label: "SDS", rateEach: 100 },
  acc_topRidge: { label: "UPVC Top Ridge", rateEach: 3000 },
  acc_foamClosure: { label: "Foam Closure", rateEach: 300 },
};

const $ = (id) => document.getElementById(id);

const designEl = $("design");
const typeEl = $("type");
const areaEl = $("area");

const rateEl = $("rate");
const wPerSftEl = $("wPerSft");
const sheetSubtotalEl = $("sheetSubtotal");
const sheetWeightEl = $("sheetWeight");

const accSubtotalEl = $("accSubtotal");
const grandTotalEl = $("grandTotal");
const grandWeightEl = $("grandWeight");

function formatMoney(n) {
  const v = Number.isFinite(n) ? n : 0;
  return v.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function formatNum(n) {
  const v = Number.isFinite(n) ? n : 0;
  return v.toLocaleString(undefined, { maximumFractionDigits: 3 });
}

function getArea() {
  const v = parseFloat(areaEl.value);
  return Number.isFinite(v) && v > 0 ? v : 0;
}

function getSelected() {
  const design = designEl.value;
  const type = typeEl.value;
  return { design, type };
}

function fillDesigns() {
  designEl.innerHTML = "";
  Object.keys(PRICE_LIST).forEach((design) => {
    const opt = document.createElement("option");
    opt.value = design;
    opt.textContent = design;
    designEl.appendChild(opt);
  });
}

function fillTypesForDesign(design) {
  typeEl.innerHTML = "";
  const types = PRICE_LIST[design] ? Object.keys(PRICE_LIST[design]) : [];
  types.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    typeEl.appendChild(opt);
  });
}

function calcAccessoriesSubtotal() {
  let sum = 0;
  for (const [id, info] of Object.entries(ACCESSORIES)) {
    const el = $(id);
    const qtyRaw = parseInt(el.value || "0", 10);
    const qty = Number.isFinite(qtyRaw) && qtyRaw > 0 ? qtyRaw : 0;
    sum += qty * info.rateEach;
  }
  return sum;
}

function recalc() {
  const { design, type } = getSelected();
  const item = PRICE_LIST?.[design]?.[type];

  const area = getArea();
  const rate = item?.rate ?? 0;
  const wPerSft = item?.weightPerSft ?? 0;

  const sheetSubtotal = area * rate;
  const sheetWeight = area * wPerSft;

  rateEl.textContent = rate ? formatMoney(rate) : "—";
  wPerSftEl.textContent = wPerSft ? formatNum(wPerSft) : "—";

  sheetSubtotalEl.textContent = formatMoney(sheetSubtotal);
  sheetWeightEl.textContent = formatNum(sheetWeight);

  const accSubtotal = calcAccessoriesSubtotal();
  accSubtotalEl.textContent = formatMoney(accSubtotal);

  const grandTotal = sheetSubtotal + accSubtotal;
  grandTotalEl.textContent = formatMoney(grandTotal);

  // Accessories weight not included (not provided in the price list)
  grandWeightEl.textContent = formatNum(sheetWeight);
}

function attachEvents() {
  designEl.addEventListener("change", () => {
    fillTypesForDesign(designEl.value);
    recalc();
  });

  ["input", "change"].forEach((evt) => {
    typeEl.addEventListener(evt, recalc);
    areaEl.addEventListener(evt, recalc);
  });

  for (const id of Object.keys(ACCESSORIES)) {
    const el = $(id);
    ["input", "change"].forEach((evt) => el.addEventListener(evt, recalc));
  }

  $("resetBtn").addEventListener("click", () => {
    areaEl.value = "";
    for (const id of Object.keys(ACCESSORIES)) $(id).value = "0";
    designEl.selectedIndex = 0;
    fillTypesForDesign(designEl.value);
    typeEl.selectedIndex = 0;
    recalc();
  });
}

function init() {
  fillDesigns();
  fillTypesForDesign(designEl.value || Object.keys(PRICE_LIST)[0]);
  attachEvents();
  recalc();
}

init();
