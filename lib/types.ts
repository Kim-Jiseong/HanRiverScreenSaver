export interface HangangLocation {
  TEMP: number;
  LAST_UPDATE: string;
  PH: number;
}

export interface HangangData {
  STATUS: string;
  MSG: string;
  DATAs: {
    CACHE_META: {
      CREATED_AT: number;
      UPDATED_AT: number;
      DATA_KEY: string;
    };
    DATA: {
      HANGANG: {
        [key: string]: HangangLocation;
      };
    };
  };
}

export interface WaterTempResult {
  location: string;
  data: HangangLocation;
}
