export class SRS {
  code: null | number;
  id?: string;
  prj: null | string;
  proj4: null | string;
  proj4js: null | {
    name?: string;
    obj?: any;
  };
  wkt: null | {
    ogc?: string;
    esri?: string;
  };

  constructor(it: any, options?: { code?: number; prj?: string; proj4?: string; proj4js?: string; wkt?: string });

  eq(other: number | string | any, options?: { debug?: boolean }): boolean;
}

export function SRS(
  it: any,
  options?: { code?: number; prj?: string; proj4?: string; proj4js?: string; wkt?: string }
): InstanceType<SRS>;

export function equivalent(
  a: string | number | SRS | any,
  b: string | number | SRS | any,
  options?: { debug?: boolean }
): boolean;
