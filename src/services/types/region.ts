export interface AdministrativeArea {
  country_id?: string;
  country?: string;
  province_id?: string;
  province?: string;
  regency_id?: string;
  regency?: string;
  district_id?: string;
  district?: string;
  village_id?: string;
  village?: string;
}

export interface Region {
  id?: string;
  parent_id?: string;
  code?: string;
  name?: string;
  type?: string;
  subtype?: string;
  administrative_area?: AdministrativeArea;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  location?: unknown;
  alias_name?: string;
}
