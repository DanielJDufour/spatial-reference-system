const projData = require("proj-data");
const proj4 = require("proj4");
const getConstructorName = require("get-constructor-name");
const getEPSGCode = require("get-epsg-code");
const isWKT = require("is-wkt");
const wktParser = require("wkt-parser");

const isDef = o => o !== undefined && o !== null && o !== "";

const parseWKT = wkt => {
  try {
    return wktParser(wkt);
  } catch (error) {
    return undefined;
  }
};

const clone = data => JSON.parse(JSON.stringify(data));

const lookup = name => {
  let result = {};
  if (name in projData) {
    Object.assign(result, projData[name]);
  }
  if (proj4.defs[name]) {
    result.proj4js = { name, obj: proj4.defs[name] };
  }
  return result;
};

// load proj4 up with projData
// for some reason, don't have proj4 for all the projections
// in which case prefer wkt
proj4.defs(Object.entries(projData).map(([k, { proj4, wkt }]) => [k, proj4 || wkt]));

class SRS {
  code = null;
  prj = null;
  proj4 = null;
  proj4js = null;
  wkt = null;
  constructor(it, { code, prj: _prj, proj4: _proj4, proj4js, wkt } = {}) {
    // pre-process
    if (typeof it === "string") it.trim();

    if (code) this.code = code;
    if (_prj) this.prj = _prj;
    if (_proj4) this.proj4 = _proj4;
    if (proj4js) this.proj4js = proj4js;
    if (wkt) this.wkt = wkt;

    if (typeof it === "number") {
      this.code = it;
    }

    if (typeof it === "string") {
      if (it.match(/^EPSG:\d+$/)) {
        this.code = Number(it.slice(it.indexOf(":") + 1));
      } else if (it.match(/^\d+$/)) {
        this.code = Number(it);
      } else if (isWKT(it)) {
        this.wkt = {
          [it.includes("AUTHORITY") ? "ogc" : "esri"]: it
        };
        const code = getEPSGCode(it);
        if (code) {
          this.code = code;
        } else {
          const obj = parseWKT(it);
          if (obj) this.proj4js = { obj };
        }
      } else if (it.startsWith("+")) {
        // probably a proj4js definition
        const code = getEPSGCode(it);
        if (code) {
          this.code = code;
        }
      }
    } else if (typeof it === "object") {
      const constructorName = getConstructorName(it);
      if (constructorName === "SRS") {
        return it;
      } else {
        const entries = Object.entries(it);

        // find wkt values
        const wkt_values = Object.values(it).filter(it => typeof it === "string" && isWKT(it));

        // find proj4 string
        const proj4_string = Object.values(it => it.startsWith("+"));

        // try using wkt values
        for (let i = 0; i < wkt_values.length; i++) {
          const code = getEPSGCode(wkt_values[i]);
          if (code) this.code = code;
        }
      }
    }

    if (this.code) {
      this.id = `EPSG:${this.code}`;
      const found = lookup(this.id);
      if (found) {
        const { proj4, proj4js, wkt, esriwkt } = found;
        this.proj4js ??= proj4js;
        this.proj4 ??= proj4;
        if (wkt || esriwkt) {
          this.wkt ??= {};
          this.wkt.ogc ??= wkt;
          this.wkt.esri ??= esriwkt;
        }
      }
    }

    // prefer OGC WKT over ESRI WKT
    this.prj ??= this.wkt?.ogc ?? this.wkt?.esri;
  }

  // check if an input srs is equivalent to the given one
  eq(other, { debug = false } = { debug: false }) {
    other = new SRS(other);

    if (debug) console.log([this.code, other.code]);
    if (isDef(this.code) && this.code === other.code) return true;

    if (debug) console.log([this, other]);
    if (isDef(this.proj4) && this.proj4 === other.proj4) return true;

    if (isDef(this.wkt) && this.wkt === other.wkt) return true;

    // check if practically the same, ignoring stuff that doesn't matter
    // like title and no_defs
    const keys = ["projName", "a", "b", "lat_ts", "long0", "x0", "y0", "k0", "units", "datumCode"];
    const this_data = keys.map(k => this.proj4js.obj[k]);
    const other_data = keys.map(k => other.proj4js.obj[k]);
    if (JSON.stringify(this_data) === JSON.stringify(other_data)) return true;

    return false;
  }
}

function equivalent(a, b, { debug = false } = { debug: false }) {
  a = new SRS(a);
  b = new SRS(b);
  return a.eq(b, { debug });
}

module.exports = {
  equivalent,
  SRS
};
