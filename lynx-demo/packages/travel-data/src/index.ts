// Network
export { travelClient, setAuthToken } from './network/client.js'
export type { ApiResponse, ApiErrorDto } from './network/types.js'

// Auth
export { AuthRepository } from './auth/repository.js'
export { AuthRemoteDataSource } from './auth/datasource.js'
export * from './auth/dto.js'

// Flight
export {
  FlightSearchRepository,
  FlightOrderRepository,
  RefundRepository,
  PassengerRepository,
  UploadRepository,
} from './flight/repository.js'
export { FlightRemoteDataSource } from './flight/datasource.js'
export * from './flight/dto.js'

// Train
export { TrainRepository } from './train/repository.js'
export { TrainRemoteDataSource } from './train/datasource.js'
export * from './train/dto.js'

// Presale ("先囤后约")
export {
  PresaleProductRepository,
  PresaleHotelRepository,
  PresaleOrderRepository,
  PresaleAppointmentRepository,
  PresaleInventoryRepository,
  PresalePassengerRepository,
  PresaleRefundRepository,
} from './presale/repository.js'
export { PresaleRemoteDataSource } from './presale/datasource.js'
export * from './presale/dto.js'
