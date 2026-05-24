# Travel API DDD Architecture

## Overview

This document describes the domain-driven design (DDD) layered architecture for travel business APIs (flight, train, etc.) in the lynx-demo project.

The architecture separates concerns into three distinct layers:

1. **Domain Layer** (`travel-domain`) — Pure business concepts, zero dependencies
2. **Data Layer** (`travel-data`) — HTTP clients, DTOs, mappers, repository implementations
3. **App Layer** (`src/apps/*`) — UI components, stores, and business orchestration

This design enables:
- **Testability**: Domain logic can be unit-tested without HTTP mocking
- **Swappability**: Replacing a data source (mock → real API) requires no app changes
- **Type safety**: App code works with domain entities, not raw JSON
- **Clean dependencies**: Inner layers know nothing about outer layers

---

## Package Structure

```
packages/
├── lynx-shared/              # Existing — low-level fetch, hooks, utilities
│   └── src/utils/fetch.ts    # createFetch() with interceptors
│
├── travel-domain/            # NEW — Domain layer (zero external deps)
│   ├── src/common/
│   │   ├── result.ts         # Result<T,E> functional type
│   │   └── pagination.ts     # PageResult<T>, PageRequest
│   ├── src/flight/
│   │   ├── entity.ts         # Flight, FlightDetail, FlightSearchCriteria
│   │   ├── repository.ts     # IFlightRepository interface
│   │   └── value-object.ts   # Airport, Money, CabinClass, Duration
│   └── src/train/
│       ├── entity.ts         # Train, TrainSearchCriteria
│       └── repository.ts     # ITrainRepository interface
│
└── travel-data/              # NEW — Data layer
    ├── src/network/
    │   ├── client.ts         # TravelHttpClient (configured fetch instance)
    │   └── types.ts          # ApiResponse<T>, ApiErrorDto
    ├── src/flight/
    │   ├── dto.ts            # Raw JSON request/response shapes
    │   ├── mapper.ts         # toDomain() / toDto() conversions
    │   ├── datasource.ts     # FlightRemoteDataSource (HTTP calls)
    │   └── repository.ts     # FlightRepository (implements IFlightRepository)
    └── src/train/
        ├── dto.ts
        ├── mapper.ts
        ├── datasource.ts
        └── repository.ts
```

---

## Dependency Rules

```
┌─────────────────────────────────────┐
│  App Layer (src/apps/flight)        │
│  import { FlightRepository }        │
│  from 'travel-data'                 │
│  import type { Flight }             │
│  from 'travel-domain'               │
└─────────────┬───────────────────────┘
              │ depends on
┌─────────────▼───────────────────────┐
│  Data Layer (travel-data)           │
│  import { IFlightRepository }       │
│  from 'travel-domain'               │
│  import { createFetch }             │
│  from 'lynx-shared'                 │
└─────────────┬───────────────────────┘
              │ depends on
┌─────────────▼───────────────────────┐
│  Domain Layer (travel-domain)       │
│  ZERO external dependencies         │
│  Pure TypeScript interfaces/types   │
└─────────────────────────────────────┘
```

**Golden rule**: Dependencies always point inward. Domain knows nothing about HTTP, React, or Lynx.

---

## Layer Details

### 1. Domain Layer (`travel-domain`)

**Responsibility**: Define what the business *is* and what operations it supports.

**Key concepts**:

| File | Purpose |
|------|---------|
| `entity.ts` | Business entities with identity (Flight, Train, FlightDetail) |
| `value-object.ts` | Immutable objects defined by their values (Money, Airport, Duration) |
| `repository.ts` | Interfaces that declare *what* operations exist, not *how* |
| `result.ts` | `Result<T,E>` type for explicit error handling without exceptions |
| `pagination.ts` | `PageResult<T>` for paginated list operations |

**Example — Flight entity**:

```typescript
export interface Flight {
  readonly flightNo: string
  readonly airline: Airline
  readonly departure: Airport
  readonly arrival: Airport
  readonly price: Money
  readonly cabinClass: CabinClass
  // ...
}
```

**Example — Repository interface**:

```typescript
export interface IFlightRepository {
  search(criteria: FlightSearchCriteria): Promise<Result<PageResult<Flight>>>
  getDetail(flightNo: string, date: string): Promise<Result<FlightDetail>>
  getPriceCalendar(route: Route, month: string): Promise<Result<readonly PriceCalendar[]>>
  checkOrder(params: { flightNo: string; date: string; passengers: number }): Promise<Result<OrderCheckResult>>
}
```

**Result type** (no exceptions for business errors):

```typescript
const result = await repo.search(criteria)

if (result.isSuccess) {
  result.data.list      // Flight[]
  result.data.hasMore   // boolean
} else {
  result.error.code     // 'NETWORK_ERROR' | 'UNKNOWN_ERROR'
  result.error.message  // string
}
```

### 2. Data Layer (`travel-data`)

**Responsibility**: Implement domain interfaces using HTTP and external services.

**Key concepts**:

| File | Purpose |
|------|---------|
| `dto.ts` | Exact shapes of backend JSON — may be ugly, that's okay |
| `mapper.ts` | Convert DTO → Domain entity and back |
| `datasource.ts` | Direct HTTP calls, returns raw DTOs |
| `repository.ts` | Implements domain interface using datasource + mapper |
| `network/client.ts` | Configured `createFetch` instance with interceptors |

**DTO example** (raw backend shape):

```typescript
export interface FlightDto {
  flightNo: string
  airline: string
  priceAmount: number
  priceCurrency: string
  durationMinutes: number
  // ...backend-specific fields
}
```

**Mapper example** (DTO → Entity):

```typescript
export function toFlight(dto: FlightDto): Flight {
  return {
    flightNo: dto.flightNo,
    airline: { code: dto.airline, name: dto.airline },
    price: { amount: dto.priceAmount, currency: dto.priceCurrency },
    duration: { minutes: dto.durationMinutes },
    // ...
  }
}
```

**Repository implementation**:

```typescript
export class FlightRepository implements IFlightRepository {
  private ds = new FlightRemoteDataSource()

  async search(criteria: FlightSearchCriteria) {
    try {
      const dtoReq = toSearchRequestDto(criteria)
      const res = await this.ds.search(dtoReq)
      return ok(createPageResult(
        res.data.list.map(toFlight),
        res.data.total,
        res.data.page,
        res.data.pageSize
      ))
    } catch (e) {
      return err(toDomainError(e))
    }
  }
}
```

**HTTP Client with interceptors** (`network/client.ts`):

```typescript
export const travelClient = createFetch({
  baseURL: 'https://api.example-travel.com/v1',
  timeout: 15000,
})

// 1. Request: inject auth token
travelClient.useRequestInterceptor((config) => {
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`
  return config
})

// 2. Response: unwrap {code, message, data} wrapper
travelClient.useResponseInterceptor((response) => {
  const body = response.data as ApiResponse<unknown>
  if (body.code !== 0) throw new Error(body.message)
  return { ...response, data: body.data }
})

// 3. Error: normalize to structured error
travelClient.useErrorInterceptor((error) => {
  throw new Error(error.message)
})
```

### 3. App Layer (`src/apps/flight`, `src/apps/train`)

**Responsibility**: UI, state management, and orchestration.

**Usage pattern**:

```typescript
// src/apps/flight/store/flightStore.ts
import { FlightRepository } from 'travel-data'
import type { FlightSearchCriteria } from 'travel-domain'

const flightRepo = new FlightRepository()

export async function searchFlights(criteria: FlightSearchCriteria) {
  const result = await flightRepo.search(criteria)

  if (result.isSuccess) {
    useFlightStore.getState().setFlightList(result.data.list)
  } else {
    useFlightStore.getState().setError(result.error.message)
  }
}
```

**App code never**:
- Constructs raw URLs
- Parses JSON directly
- Handles HTTP status codes
- Imports from `lynx-shared` fetch utilities

---

## Adding a New Domain

To add a new business domain (e.g., `hotel`):

### Step 1: Domain layer (`travel-domain`)

```typescript
// src/hotel/entity.ts
export interface Hotel {
  readonly hotelId: string
  readonly name: string
  readonly price: Money
  // ...
}

export interface HotelSearchCriteria {
  readonly city: string
  readonly checkIn: string
  readonly checkOut: string
}

// src/hotel/repository.ts
export interface IHotelRepository {
  search(criteria: HotelSearchCriteria): Promise<Result<PageResult<Hotel>>>
}
```

### Step 2: Data layer (`travel-data`)

```typescript
// src/hotel/dto.ts
export interface HotelSearchResponseDto {
  list: HotelDto[]
  total: number
}

// src/hotel/mapper.ts
export function toHotel(dto: HotelDto): Hotel {
  return { hotelId: dto.id, name: dto.name, price: toMoney(dto.price) }
}

// src/hotel/datasource.ts
export class HotelRemoteDataSource {
  async search(params: HotelSearchRequestDto) {
    return travelClient.get<HotelSearchResponseDto>('/hotel/search', { params })
  }
}

// src/hotel/repository.ts
export class HotelRepository implements IHotelRepository {
  private ds = new HotelRemoteDataSource()
  async search(criteria) {
    // ...map, call ds, handle errors, return Result
  }
}
```

### Step 3: App layer

```typescript
import { HotelRepository } from 'travel-data'
const hotelRepo = new HotelRepository()
```

---

## Comparison with Old Approach

| Aspect | Old (`src/api/`) | New (DDD layers) |
|--------|-----------------|------------------|
| **Location** | `src/api/flight.ts` | `packages/travel-data/src/flight/` |
| **Entity definition** | Mixed with DTO | Clean in `travel-domain` |
| **HTTP coupling** | App imports fetch types directly | App only sees `IFlightRepository` |
| **Testability** | Must mock HTTP | Test domain logic without HTTP |
| **Data source swap** | Modify all call sites | Change `FlightRepository` internals only |
| **Backend changes** | Breaks app types | Update `dto.ts` + `mapper.ts`, app untouched |

---

## Testing Strategy

### Domain layer tests (no mocking needed)

```typescript
import { createPageResult } from 'travel-domain'

test('pagination hasMore', () => {
  const page = createPageResult([1, 2], 10, 1, 2)
  expect(page.hasMore).toBe(true)
})
```

### Data layer tests (mock data source)

```typescript
import { FlightRepository } from 'travel-data'

// Inject a mock data source
class MockFlightDataSource {
  async search() {
    return { data: { list: [{ flightNo: 'CA123' }], total: 1, page: 1, pageSize: 10 } }
  }
}

const repo = new FlightRepository(new MockFlightDataSource())
const result = await repo.search({...})
expect(result.isSuccess).toBe(true)
```

### App layer tests (mock repository)

```typescript
// Provide a mock IFlightRepository to the app
// No HTTP, no JSON parsing, pure business logic
```

---

## Migration Guide

### From `src/api/` to new packages

1. **Delete** `src/api/` (already done)
2. **Install** workspace dependencies:
   ```bash
   pnpm install
   ```
3. **Update imports** in app code:
   ```typescript
   // Before
   import { searchFlights } from '@/api'

   // After
   import { FlightRepository } from 'travel-data'
   import type { FlightSearchCriteria } from 'travel-domain'

   const repo = new FlightRepository()
   const result = await repo.search({...})
   ```
4. **Handle Result<T,E>** — replace try/catch with `isSuccess` / `isFailure` checks

---

## Configuration

### Root `package.json`

```json
{
  "dependencies": {
    "lynx-shared": "workspace:*",
    "travel-domain": "workspace:*",
    "travel-data": "workspace:*"
  }
}
```

### Root `tsconfig.json`

```json
{
  "references": [
    { "path": "./packages/lynx-shared" },
    { "path": "./packages/travel-domain" },
    { "path": "./packages/travel-data" }
  ]
}
```

---

## Best Practices

1. **Never import `lynx-shared` from app code** — go through `travel-data`
2. **Never use `any` in domain layer** — keep it pure TypeScript
3. **Always return `Result<T,E>` from repositories** — no exceptions for expected errors
4. **Keep DTOs ugly** — don't polish backend JSON shapes, map them
5. **One data source per external service** — if you have multiple backends, create multiple datasources
6. **Auth token lives in `network/client.ts`** — single source of truth for HTTP configuration
