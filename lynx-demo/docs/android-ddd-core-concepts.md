# Android DDD (Domain-Driven Design) Core Concepts

## Overview

Domain-Driven Design (DDD) is a software design approach that focuses on modeling the business domain and encoding business rules into the code. In Android development, DDD provides a structured way to build maintainable, testable, and scalable applications by separating concerns into distinct layers with clear responsibilities and dependency rules.

This document outlines the core concepts, patterns, and practical application of DDD in Android projects.

---

## 1. Layered Architecture

The foundation of DDD in Android is a layered architecture that separates concerns into distinct layers. Each layer has a single responsibility and dependencies always point inward.

```
┌─────────────────────────────────────┐
│  Presentation Layer (UI)            │
│  Activities, Fragments, ViewModels  │
│  Composables, Adapters              │
└─────────────┬───────────────────────┘
              │ depends on
┌─────────────▼───────────────────────┐
│  Domain Layer                       │
│  Entities, Use Cases, Repository    │
│  Interfaces, Value Objects          │
└─────────────┬───────────────────────┘
              │ depends on
┌─────────────▼───────────────────────┐
│  Data Layer                         │
│  Repository Impl, Data Sources      │
│  DTOs, Mappers, API Clients         │
└─────────────┬───────────────────────┘
              │ depends on
┌─────────────▼───────────────────────┐
│  Framework Layer                    │
│  Room, Retrofit, SharedPreferences  │
│  Android SDK, Third-party libs      │
└─────────────────────────────────────┘
```

### Dependency Rule

**The golden rule**: Dependencies always point inward. The inner layers know nothing about the outer layers.

- **Domain layer** has **zero dependencies** on Android SDK, frameworks, or external libraries
- **Data layer** depends only on the **Domain layer**
- **Presentation layer** depends on **Domain** and **Data** layers
- **Framework layer** is the outermost, providing concrete implementations

---

## 2. Core Building Blocks

### 2.1 Entities

Entities are objects that have a distinct identity that runs through time and different states. They are defined by their identity, not their attributes.

**Characteristics:**
- Has a unique identifier (ID)
- Identity remains the same even when attributes change
- Mutable lifecycle (can change state over time)
- Equality is based on identity, not attributes

```kotlin
// Example: Flight entity
class Flight(
    val flightNo: String,  // Identity
    val airline: Airline,
    val departure: Airport,
    val arrival: Airport,
    var price: Money,      // Can change (mutable)
    var status: FlightStatus
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Flight) return false
        return flightNo == other.flightNo
    }

    override fun hashCode(): Int = flightNo.hashCode()
}
```

### 2.2 Value Objects

Value objects have no conceptual identity. They are immutable and defined entirely by their attributes.

**Characteristics:**
- No identity
- Immutable (cannot change after creation)
- Equality is based on all attributes
- Can be freely shared and reused
- Should be lightweight

```kotlin
// Example: Money value object
data class Money(
    val amount: BigDecimal,
    val currency: Currency
) {
    fun add(other: Money): Money {
        require(currency == other.currency) { "Cannot add different currencies" }
        return Money(amount + other.amount, currency)
    }

    fun format(): String = "$amount $currency"
}

// Example: Duration value object
data class Duration(val minutes: Int) {
    val hours: Int get() = minutes / 60
    val remainingMinutes: Int get() = minutes % 60

    fun format(): String = "${hours}h ${remainingMinutes}m"
}
```

### 2.3 Aggregates

An aggregate is a cluster of associated objects treated as a single unit. It has a root entity (aggregate root) that controls access to all objects in the aggregate.

**Rules:**
- External objects can only reference the aggregate root
- Objects inside the aggregate can hold references to each other
- Aggregate root ensures consistency of the entire aggregate
- Transactions should not span multiple aggregates

```kotlin
// Example: Order aggregate
class Order(val orderId: String) {
    private val _items = mutableListOf<OrderItem>()
    val items: List<OrderItem> get() = _items.toList()

    fun addItem(flight: Flight, passenger: Passenger, price: Money) {
        // Business invariant: cannot add items to paid orders
        require(status != OrderStatus.PAID) { "Cannot modify paid order" }
        _items.add(OrderItem(flight, passenger, price))
        recalculateTotal()
    }

    private fun recalculateTotal() {
        _totalAmount = _items.sumOf { it.price.amount }
    }
}
```

### 2.4 Domain Services

Domain services encapsulate business logic that doesn't naturally fit within an entity or value object.

**When to use:**
- The logic involves multiple aggregates
- The logic is a significant business process
- The logic doesn't belong to any single entity

```kotlin
// Example: Pricing domain service
class PricingService {
    fun calculateTotalPrice(
        basePrice: Money,
        passengers: List<Passenger>,
        discounts: List<Discount>
    ): Money {
        var total = basePrice

        // Adult passengers pay full price
        val adults = passengers.filter { it.type == PassengerType.ADULT }
        total = total.multiply(adults.size)

        // Children pay 50%
        val children = passengers.filter { it.type == PassengerType.CHILD }
        total = total.add(basePrice.multiply(0.5).multiply(children.size))

        // Apply discounts
        return discounts.fold(total) { acc, discount -> discount.apply(acc) }
    }
}
```

---

## 3. Repository Pattern

The repository pattern abstracts data access, allowing the domain layer to remain persistence-ignorant.

### Interface in Domain Layer

```kotlin
// Domain layer - defines WHAT operations exist
interface IFlightRepository {
    suspend fun search(criteria: FlightSearchCriteria): Result<PageResult<Flight>>
    suspend fun getDetail(flightNo: String, date: LocalDate): Result<FlightDetail>
    suspend fun getPriceCalendar(route: Route, month: YearMonth): Result<List<PriceCalendar>>
}
```

### Implementation in Data Layer

```kotlin
// Data layer - provides HOW they are implemented
class FlightRepository(
    private val remoteDataSource: FlightRemoteDataSource,
    private val localDataSource: FlightLocalDataSource,
    private val mapper: FlightMapper
) : IFlightRepository {

    override suspend fun search(criteria: FlightSearchCriteria): Result<PageResult<Flight>> {
        return try {
            // Try remote first
            val dto = remoteDataSource.search(mapper.toDto(criteria))
            val flights = dto.list.map { mapper.toDomain(it) }

            // Cache locally
            localDataSource.saveFlights(dto.list)

            Result.success(PageResult(flights, dto.total, dto.page, dto.pageSize))
        } catch (e: NetworkException) {
            // Fallback to local cache
            val cached = localDataSource.search(criteria)
            Result.success(PageResult(cached, cached.size, 1, cached.size))
        } catch (e: Exception) {
            Result.failure(DomainError.NetworkError(e.message))
        }
    }
}
```

### Benefits

| Aspect | Without Repository | With Repository |
|--------|-------------------|-----------------|
| **Testability** | Must mock HTTP | Mock interface easily |
| **Swappability** | Change all call sites | Change implementation only |
| **Backend changes** | Breaks app types | Update mapper only |
| **Offline support** | Must add everywhere | Add to repository impl |

---

## 4. Use Cases / Interactors

Use cases encapsulate a single business operation. They orchestrate domain objects to accomplish a specific user goal.

```kotlin
// Example: Search Flights Use Case
class SearchFlightsUseCase(
    private val flightRepository: IFlightRepository,
    private val pricingService: PricingService
) {
    suspend operator fun invoke(
        from: City,
        to: City,
        date: LocalDate,
        passengers: List<Passenger>
    ): Result<SearchResult> {
        // 1. Validate input
        if (from == to) {
            return Result.failure(DomainError.ValidationError("Origin and destination cannot be the same"))
        }

        // 2. Search flights
        val criteria = FlightSearchCriteria(from.code, to.code, date, passengers)
        val flightsResult = flightRepository.search(criteria)

        if (flightsResult.isFailure) {
            return Result.failure(flightsResult.error)
        }

        // 3. Calculate prices
        val flights = flightsResult.data.list.map { flight ->
            val price = pricingService.calculateTotalPrice(
                flight.basePrice,
                passengers,
                emptyList() // TODO: apply applicable discounts
            )
            FlightWithPrice(flight, price)
        }

        // 4. Return enriched result
        return Result.success(SearchResult(flights, flightsResult.data.hasMore))
    }
}
```

---

## 5. Result Type for Error Handling

Instead of exceptions, DDD uses explicit `Result<T, E>` types for expected errors.

```kotlin
// Kotlin implementation
sealed class Result<out T, out E> {
    data class Success<T>(val data: T) : Result<T, Nothing>()
    data class Failure<E>(val error: E) : Result<Nothing, E>()

    val isSuccess: Boolean get() = this is Success
    val isFailure: Boolean get() = this is Failure

    fun getOrNull(): T? = (this as? Success)?.data
    fun errorOrNull(): E? = (this as? Failure)?.error
}

// Usage in ViewModel
viewModelScope.launch {
    val result = searchFlightsUseCase(from, to, date, passengers)

    when (result) {
        is Result.Success -> {
            _uiState.value = UiState.Success(result.data.flights)
        }
        is Result.Failure -> {
            _uiState.value = when (result.error) {
                is DomainError.NetworkError -> UiState.Error("网络连接失败")
                is DomainError.ValidationError -> UiState.Error(result.error.message)
                else -> UiState.Error("未知错误")
            }
        }
    }
}
```

---

## 6. DTO-Entity Mapping

The data layer uses Data Transfer Objects (DTOs) to represent raw API responses, which are then mapped to domain entities.

```kotlin
// Data layer - raw API shape
data class FlightResponseDto(
    @SerializedName("flightNo") val flightNo: String,
    @SerializedName("airline") val airlineCode: String,
    @SerializedName("price") val priceAmount: Double,
    @SerializedName("currency") val priceCurrency: String,
    @SerializedName("duration") val durationMinutes: Int
)

// Mapper - bridges DTO and Domain
class FlightMapper {
    fun toDomain(dto: FlightResponseDto): Flight {
        return Flight(
            flightNo = dto.flightNo,
            airline = Airline(code = dto.airlineCode),
            price = Money(
                amount = dto.priceAmount.toBigDecimal(),
                currency = Currency.valueOf(dto.priceCurrency)
            ),
            duration = Duration(dto.durationMinutes)
        )
    }

    fun toDto(criteria: FlightSearchCriteria): FlightSearchRequestDto {
        return FlightSearchRequestDto(
            departure = criteria.departure.code,
            arrival = criteria.arrival.code,
            date = criteria.date.toString()
        )
    }
}
```

### Why Map?

| Concern | DTO | Entity |
|---------|-----|--------|
| **Purpose** | Match API JSON shape | Represent business concept |
| **Mutability** | Mutable for deserialization | Often immutable |
| **Types** | Primitives only | Rich types (Money, Duration) |
| **Validation** | None | Enforces invariants |
| **Changes** | Breaks with API changes | Stable |

---

## 7. Dependency Injection in DDD

Dependency injection is essential for DDD to work. It enables:
- Swapping implementations (mock vs real)
- Keeping layers independent
- Testing in isolation

```kotlin
// Using Hilt for DI
@Module
@InstallIn(SingletonComponent::class)
object RepositoryModule {

    @Provides
    @Singleton
    fun provideFlightRepository(
        remoteDataSource: FlightRemoteDataSource,
        localDataSource: FlightLocalDataSource,
        mapper: FlightMapper
    ): IFlightRepository {
        return FlightRepository(remoteDataSource, localDataSource, mapper)
    }
}

// ViewModel gets domain dependencies only
@HiltViewModel
class FlightSearchViewModel @Inject constructor(
    private val searchFlights: SearchFlightsUseCase
) : ViewModel() {
    // Only knows about use case, not repository or API details
}
```

---

## 8. Testing Strategy

### Domain Layer Tests (No Android, No Mocking)

```kotlin
@Test
fun `money addition with same currency succeeds`() {
    val tenDollars = Money(BigDecimal(10), Currency.USD)
    val fiveDollars = Money(BigDecimal(5), Currency.USD)

    val result = tenDollars.add(fiveDollars)

    assertEquals(Money(BigDecimal(15), Currency.USD), result)
}

@Test
fun `money addition with different currencies throws`() {
    val dollars = Money(BigDecimal(10), Currency.USD)
    val euros = Money(BigDecimal(5), Currency.EUR)

    assertThrows<IllegalArgumentException> {
        dollars.add(euros)
    }
}
```

### Data Layer Tests (Mock Data Source)

```kotlin
class FlightRepositoryTest {
    private val remoteDataSource = mockk<FlightRemoteDataSource>()
    private val localDataSource = mockk<FlightLocalDataSource>()
    private val mapper = FlightMapper()
    private val repository = FlightRepository(remoteDataSource, localDataSource, mapper)

    @Test
    fun `search returns flights on success`() = runTest {
        // Given
        coEvery { remoteDataSource.search(any()) } returns mockFlightDto()

        // When
        val result = repository.search(searchCriteria)

        // Then
        assertTrue(result.isSuccess)
        assertEquals(1, result.data.list.size)
    }
}
```

### Presentation Layer Tests (Mock Use Case)

```kotlin
class FlightSearchViewModelTest {
    private val searchFlights = mockk<SearchFlightsUseCase>()
    private val viewModel = FlightSearchViewModel(searchFlights)

    @Test
    fun `search updates UI state`() = runTest {
        // Given
        coEvery { searchFlights(any(), any(), any(), any()) } returns Result.Success(mockSearchResult())

        // When
        viewModel.search("PEK", "SHA", LocalDate.now(), emptyList())

        // Then
        assertTrue(viewModel.uiState.value is UiState.Success)
    }
}
```

---

## 9. Comparison with Common Android Patterns

| Aspect | MVC/MVP | MVVM | DDD (Clean Architecture) |
|--------|---------|------|--------------------------|
| **Separation** | Presenter/Controller handles logic | ViewModel holds state | Domain layer owns business logic |
| **Testability** | Limited | Better | Excellent (domain has no deps) |
| **Business Logic** | Scattered | In ViewModel | Centralized in domain |
| **API Changes** | Breaks many layers | Breaks ViewModel | Only affects mapper |
| **Team Scaling** | Hard | Medium | Easy (domain is shared language) |
| **Learning Curve** | Low | Low | Medium |

---

## 10. Practical Tips for Android DDD

### Do's

1. **Start with domain**: Model your business concepts first, before any framework code
2. **Use ubiquitous language**: Domain terms should match business terminology
3. **Keep domain pure**: No Android imports in domain layer
4. **Prefer value objects**: Immutability prevents bugs
5. **Make illegal states unrepresentable**: Use types to enforce constraints
6. **Use repositories**: Never call APIs directly from ViewModels
7. **Map at boundaries**: DTOs don't leak into domain

### Don'ts

1. **Don't use Android types in domain**: No `Context`, `View`, `LiveData` in domain
2. **Don't expose DTOs to UI**: Always map to domain entities first
3. **Don't put business logic in ViewModels**: Use cases or domain services
4. **Don't use exceptions for expected errors**: Use `Result<T, E>`
5. **Don't create anemic domain models**: Entities should encapsulate behavior
6. **Don't skip tests for domain**: Domain is the easiest and most valuable to test

---

## 11. Example Project Structure

```
app/
├── presentation/              # UI Layer
│   ├── flight/
│   │   ├── FlightSearchScreen.kt
│   │   ├── FlightSearchViewModel.kt
│   │   └── FlightListAdapter.kt
│   └── common/
│       └── UiState.kt
│
├── domain/                    # Domain Layer (pure Kotlin)
│   ├── model/
│   │   ├── Flight.kt          # Entity
│   │   ├── Money.kt           # Value Object
│   │   └── Duration.kt        # Value Object
│   ├── repository/
│   │   └── IFlightRepository.kt
│   ├── usecase/
│   │   └── SearchFlightsUseCase.kt
│   └── Result.kt              # Result<T,E> type
│
├── data/                      # Data Layer
│   ├── remote/
│   │   ├── api/
│   │   │   └── FlightApi.kt
│   │   ├── dto/
│   │   │   └── FlightResponseDto.kt
│   │   └── datasource/
│   │       └── FlightRemoteDataSource.kt
│   ├── local/
│   │   ├── dao/
│   │   │   └── FlightDao.kt
│   │   └── datasource/
│   │       └── FlightLocalDataSource.kt
│   ├── mapper/
│   │   └── FlightMapper.kt
│   └── repository/
│       └── FlightRepository.kt
│
└── di/                        # Dependency Injection
    └── AppModule.kt
```

---

## References

- Eric Evans, *Domain-Driven Design: Tackling Complexity in the Heart of Software*
- Vaughn Vernon, *Implementing Domain-Driven Design*
- Fernando Cejas, [Architecting Android with Clean Architecture](https://fernandocejas.com/blog/engineering/2014-09-03-architecting-android-the-clean-way/)
- Google's [Guide to App Architecture](https://developer.android.com/topic/architecture)
