// Common
export * from './common/result.js'
export * from './common/pagination.js'

// Auth
export * from './auth/entity.js'
export type { IAuthRepository } from './auth/repository.js'

// Flight
export * from './flight/value-object.js'
export * from './flight/entity.js'
export type {
  IFlightSearchRepository,
  IFlightOrderRepository,
  IRefundRepository,
  IPassengerRepository,
  IUploadRepository,
} from './flight/repository.js'

// Train
export * from './train/entity.js'
export type { ITrainRepository } from './train/repository.js'

// Presale ("先囤后约")
export * from './presale/value-object.js'
export * from './presale/entity.js'
export type {
  IPresaleProductRepository,
  IPresaleHotelRepository,
  IPresaleOrderRepository,
  IPresaleAppointmentRepository,
  IPresaleInventoryRepository,
  IPresalePassengerRepository,
  IPresaleRefundRepository,
} from './presale/repository.js'
