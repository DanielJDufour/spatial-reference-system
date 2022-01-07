# spatial-reference-system
> Modern Spatial Reference System Class.

# supports
- EPSG Codes
- PROJ4 Strings
- ESRI and OGC Well-Known Text
- PRJ File

# install
```bash
npm install spatial-reference-system
```

# usage
### basic initialization
```js
import { SRS } from "spatial-reference-system";

// technically SRS is a function that initializes
// a class called SRS, so the new keyword is unecessary
const srs = SRS(3857);

console.log(srs);
SRS {
  // numerical code of the projection
  // this is almost always the EPSG code
  code: 3857,

  // the id used by proj4js
  id: 'EPSG:3857',

  // the .prj file representation
  prj: 'PROJCS["WGS 84 / Pseudo-Mercator",GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]],PROJECTION["Mercator_1SP"],PARAMETER["central_meridian",0],PARAMETER["scale_factor",1],PARAMETER["false_easting",0],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["X",EAST],AXIS["Y",NORTH],EXTENSION["PROJ4","+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"],AUTHORITY["EPSG","3857"]]',

  // proj4 string
  proj4: '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs',

  // proj4js definition information
  proj4js: {
    // id used by proj4, usually the same as srs.id
    name: 'EPSG:3857',

    // the definition object used by proj4
    obj: {
      projName: 'merc',
      a: 6378137,
      b: 6378137,
      lat_ts: 0,
      long0: 0,
      x0: 0,
      y0: 0,
      k0: 1,
      units: 'm',
      datumCode: 'none',
      wktext: true,
      no_defs: true
    }
  },

  // Well-Known Text
  wkt: {
    // the Open Geospatial Consortium version
    ogc: 'PROJCS["WGS 84 / Pseudo-Mercator",GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]],PROJECTION["Mercator_1SP"],PARAMETER["central_meridian",0],PARAMETER["scale_factor",1],PARAMETER["false_easting",0],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["X",EAST],AXIS["Y",NORTH],EXTENSION["PROJ4","+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"],AUTHORITY["EPSG","3857"]]',

    // the ESRI version
    esri: 'PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.017453292519943295]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",0.0],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]'
  }
}
```


### check if two projections are equivalent
```js
import { equivalent } from "spatial-reference-system";

const web_mercator_esri_wkt = `PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.017453292519943295]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",0.0],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]`;
const web_mercator_ogc_wkt = `PROJCS["WGS 84 / Pseudo-Mercator",GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]],PROJECTION["Mercator_1SP"],PARAMETER["central_meridian",0],PARAMETER["scale_factor",1],PARAMETER["false_easting",0],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["X",EAST],AXIS["Y",NORTH],EXTENSION["PROJ4","+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"],AUTHORITY["EPSG","3857"]]`;
equivalent(web_mercator_esri_wkt, web_mercator_ogc_wkt);
// true
```

### get EPSG Code for ESRI Well-Known Text
```js
import { SRS } from "spatial-reference-system";

const srs = SRS(`PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",...`);
console.log(srs.code);
// 3857
```

### convert wkt to a proj4 string
```js
import { SRS } from "spatial-reference-system";

const srs = SRS(`PROJCS["NAD83 / UTM zone 16N",GEOGCS["NAD83",...`);
console.log(srs.proj4);
// "+proj=utm +zone=16 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
```

### get .prj file
```js
import { SRS } from "spatial-reference-system";

const srs = SRS(`PROJCS["NAD83 / UTM zone 16N",GEOGCS["NAD83",...`);
console.log(srs.prj);
// "PROJCS["NAD83 / UTM zone 16N",GEOGCS["NAD83",..."
```

# uses
- [proj-data](https://github.com/danieljdufour/proj-data)
- [proj4js](http://proj4js.org/)
- [get-epsg-code](https://github.com/danieljdufour/get-epsg-code)
- and [more](https://github.com/DanielJDufour/spatial-reference-system/blob/main/package.json)
