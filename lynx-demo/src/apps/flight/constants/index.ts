export const TAB_TYPE = {
  Flight: 'flight',
  Train: 'train',
} as const
export type TabType = (typeof TAB_TYPE)[keyof typeof TAB_TYPE]

export const QUERY_CABIN_CLASS = {
  NoLimit: 'nolimit',
  Business: 'business',
} as const
export type QueryCabinClass = (typeof QUERY_CABIN_CLASS)[keyof typeof QUERY_CABIN_CLASS]

export const LOCATION_TYPE = {
  City: 2,
} as const
export type LocationType = (typeof LOCATION_TYPE)[keyof typeof LOCATION_TYPE]
