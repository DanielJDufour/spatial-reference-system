const getConstructorName = require("get-constructor-name");
const defs = require("proj4js-definitions");
const getEPSGCode = require("get-epsg-code");
const isWKT = require("is-wkt");
const proj4 = require("proj4-fully-loaded");
const wktParser = require("wkt-parser");

const isDef = o => o !== undefined && o !== null && o !== "";

const parseWKT = wkt => {
  try {
    return wktParser(wkt);
  } catch (error) {
    return undefined;
  }
};

class SRS {
  code = null;
  proj4 = null;
  proj4js = null;
  wkt = null;
  constructor(it, { code, proj4: _proj4, proj4js, wkt } = {}) {
    // pre-process
    if (typeof it === "string") it.trim();

    if (code) this.code = code;
    if (_proj4) this.proj4 = _proj4;
    if (proj4js) this.proj4js = proj4js;
    if (wkt) this.wkt = wkt;

    if (typeof it === "number") {
      this.code = it;
      // lookup an see if can grab definition from proj4js instance
      const name = `EPSG:${it}`;
      this.proj4js = { name, obj: proj4?.defs?.[name] };
      this.proj4 = defs.find(entry => entry[0] === name)?.[1];
      return this;
    }

    if (typeof it === "string") {
      if (it.match(/^EPSG:\d+$/)) {
        this.code = Number(it.slice(it.indexOf(":") + 1));
        this.proj4js = { name: it, obj: proj4?.defs?.[it] };
        this.proj4 = defs.find(entry => entry[0] === it)?.[1];
        return this;
      } else if (it.match(/^\d+$/)) {
        this.code = Number(it);
        const name = `EPSG:${it}`;
        this.proj4js = { name, obj: proj4?.defs?.[name] };
        this.proj4 = defs.find(entry => entry[0] === name)?.[1];
        return this;
      } else if (isWKT(it)) {
        this.wkt = {
          [it.includes("AUTHORITY") ? "ogc" : "esri"]: it
        };

        const code = getEPSGCode(it);
        if (code) {
          this.code = code;
          const name = `EPSG:${code}`;
          const obj = proj4?.defs?.[name] || parseWKT(it);
          this.proj4js = { name, obj };
          this.proj4 = defs.find(entry => entry[0] === name)?.[1];
        } else {
          const obj = parseWKT(it);
          if (obj) this.proj4js = { obj };
        }
      } else if (it.startsWith("+")) {
        // probably a proj4js definition
        const code = getEPSGCode(it);
        if (code) {
          this.code = code;
          const name = `EPSG:${code}`;
          if (!(name in proj4.defs)) {
            throw new Error("NOT IN PROJ$");
          }
          this.proj4js = { name, obj: proj4?.defs?.[name] };
          this.proj4 = defs.find(entry => entry[0] === name)?.[1] ?? it;
        }
      }
    } else if (typeof it === "object") {
      const constructorName = getConstructorName(it);
      if (constructorName === "SRS") {
        return it;
      }
    }
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

module.exports = { equivalent, SRS };
