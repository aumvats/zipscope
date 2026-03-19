import type { ZipInfo } from '@/lib/types';

// Permanent cache — ZIP-to-city mappings never change
const cache = new Map<string, ZipInfo>();

export function emptyZipInfo(zip: string): ZipInfo {
  return { zip, city: null, state: null, stateFull: null, lat: null, lng: null };
}

export async function fetchZipInfo(zip: string): Promise<ZipInfo> {
  const cached = cache.get(zip);
  if (cached) return cached;

  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (!res.ok) return emptyZipInfo(zip);

    const json = await res.json();
    const place = json.places?.[0];
    const info: ZipInfo = {
      zip,
      city: place?.['place name'] ?? null,
      state: place?.['state abbreviation'] ?? null,
      stateFull: place?.state ?? null,
      lat: place?.latitude ? parseFloat(place.latitude) : null,
      lng: place?.longitude ? parseFloat(place.longitude) : null,
    };

    cache.set(zip, info);
    return info;
  } catch {
    return emptyZipInfo(zip);
  }
}
