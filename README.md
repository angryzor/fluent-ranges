# fluent-ranges

fluent-ranges is an extension library for [fluent.js](https://github.com/projectfluent/fluent.js).

While fluent.js is an amazing solution for localization, by default it does not support the `formatRange` features of JavaScript's `Intl` API. This library adds those missing features.

Note: Due to the fact that `Intl.NumberFormat.prototype.formatRange` is so experimental that it's only available in Firefox nightly, this part of the library
is currently completely untested. However, it _should_ work.

# Installation

Simply install via npm:

`npm install fluent-ranges`

# API

## Datatypes

fluent-ranges exports 2 new Fluent datatypes. When these types are localized they will be stringified with the appropriate `formatRange` method.

### FluentDateTimeRange

This type represents a range between 2 Date values. It is analogous to the `FluentDateTime` type and can be created using its constructor:

`new FluentDateTimeRange(start: number, end: number, opts: Intl.DateTimeFormatOptions)`

#### Parameters

* `start`: A milliseconds-to-epoch representation of the start date.
* `end`: A milliseconds-to-epoch representation of the end date.
* `opts`: Options to be supplied to the `Intl.DateTimeFormat` constructor.

### FluentNumberRange

This type represents a range between 2 number values. It is analogous to the `FluentNumber` type and can be created using its constructor:

`new FluentNumberRange(start: number, end: number, opts: Intl.NumberFormatOptions)`

#### Parameters

* `start`: The start value.
* `end`: The end value.
* `opts`: Options to be supplied to the `Intl.NumberFormat` constructor.

## Fluent functions

Additionally, this library exports 2 new functions that can be used in the Fluent DSL:

### DATETIME_RANGE

This function can generate a new `FluentDateTimeRange` with additional `Intl.DateTimeFormat` options, analogous to the builtin `DATETIME` function.

The `DATETIME_RANGE` function has 2 overloads. You can either supply a `FluentDateTimeRange` as 1 positional argument, or you can supply 2 separate arguments of the type `FluentDateTime`. This allows it to be used easily with discrete `Date` arguments in a message. It can also accept `FluentNumberRange` and `FluentNumber` values, interpreting them as milliseconds-to-epoch.

NOTE: If 2 `FluentDateTime` objects are provided, options will only be taken from the first one. 

```ts
function DATETIME_RANGE(args: [FluentDateTimeRange | FluentNumberRange], opts: Intl.DateTimeFormatOptions): FluentDateTimeRange {}

function DATETIME_RANGE(args: [FluentDateTime | FluentNumber, FluentDateTime | FluentNumber], opts: Intl.DateTimeFormatOptions): FluentDateTimeRange {}
```

### NUMBER_RANGE

This function can generate a new `FluentNumberRange` with additional `Intl.NumberFormat` options, analogous to the builtin `NUMBER` function.

The `NUMBER_RANGE` function has 2 overloads. You can either supply a `FluentNumberRange` as 1 positional argument, or you can supply 2 separate arguments of the type `FluentNumber`. This allows it to be used easily with discrete `number` arguments in a message. It can also accept `FluentDateTimeRange` and `FluentDateTime` values, converting them to milliseconds-to-epoch representations.

NOTE: If 2 `FluentNumber` objects are provided, options will only be taken from the first one. 

```ts
function NUMBER_RANGE(args: [FluentDateTimeRange | FluentNumberRange], opts: Intl.NumberFormatOptions): FluentNumberRange {}

function NUMBER_RANGE(args: [FluentDateTime | FluentNumber, FluentDateTime | FluentNumber], opts: Intl.NumberFormatOptions): FluentNumberRange {}
```

# Example usage

## DATETIME_RANGE

### Using `Date`s

Probably the most common use case

```js
import ftl from '@fluent/dedent'
import { FluentBundle, FluentResource } from '@fluent/bundle'
import { DATETIME_RANGE } from 'fluent-ranges'

const bundle = new FluentBundle(['en'], { functions: { DATETIME_RANGE } })

bundle.addResource(ftl`
test = Trip duration: {DATETIME_RANGE($start, $end, day: "numeric", month: "long")}
`)

bundle.formatPattern(bundle.getMessage('test').value, { start: new Date('2023-06-17'), end: new Date('2023-06-25') })
// > "Trip duration: August 17 - 25"
```

### Using `FluentDateTime`'s

```js
import ftl from '@fluent/dedent'
import { FluentBundle, FluentResource, FluentDateTime } from '@fluent/bundle'
import { DATETIME_RANGE } from 'fluent-ranges'

const bundle = new FluentBundle(['en'], { functions: { DATETIME_RANGE } })

bundle.addResource(ftl`
test = Trip duration: {DATETIME_RANGE($start, $end, month: "long")}
`)

bundle.formatPattern(bundle.getMessage('test').value, {
  start: new FluentDateTime(new Date('2023-06-17').getTime(), { day: 'numeric' }),
  end: new FluentDateTime(new Date('2023-06-25').getTime(), { day: 'numeric' }), // These options will be ignored.
})
// > "Trip duration: August 17 - 25"
```

### Using `FluentDateTimeRange`

```js
import ftl from '@fluent/dedent'
import { FluentBundle, FluentResource } from '@fluent/bundle'
import { DATETIME_RANGE, FluentDateTimeRange } from 'fluent-ranges'

const bundle = new FluentBundle(['en'], { functions: { DATETIME_RANGE } })

bundle.addResource(ftl`
test = Trip duration: {DATETIME_RANGE($range, month: "long")}
`)

bundle.formatPattern(bundle.getMessage('test').value, { range: new FluentDateTimeRange(new Date('2023-06-17').getTime(), new Date('2023-06-25').getTime(), { day: 'numeric' }) })
// > "Trip duration: August 17 - 25"
```

## Using bare FluentDateTimeRange

```js
import ftl from '@fluent/dedent'
import { FluentBundle, FluentResource } from '@fluent/bundle'
import { DATETIME_RANGE, FluentDateTimeRange } from 'fluent-ranges'

const bundle = new FluentBundle(['en'], { functions: { DATETIME_RANGE } })

bundle.addResource(ftl`
test = Trip duration: {$range}
`)

bundle.formatPattern(bundle.getMessage('test').value, { range: new FluentDateTimeRange(new Date('2023-06-17').getTime(), new Date('2023-06-25').getTime(), { month: 'long', day: 'numeric' }) })
// > "Trip duration: August 17 - 25"
```

## NUMBER_RANGE

### Using `number`s

Probably the most common use case

```js
import ftl from '@fluent/dedent'
import { FluentBundle, FluentResource } from '@fluent/bundle'
import { NUMBER_RANGE } from 'fluent-ranges'

const bundle = new FluentBundle(['en'], { functions: { NUMBER_RANGE } })

bundle.addResource(ftl`
test = Between {NUMBER_RANGE($start, $end, minimumFractionDigits: 0)}
`)

bundle.formatPattern(bundle.getMessage('test').value, { start: 50, end: 100 })
// > "Between 50 - 100"
```

### Using `FluentNumber`'s

```js
import ftl from '@fluent/dedent'
import { FluentBundle, FluentResource, FluentNumber } from '@fluent/bundle'
import { NUMBER_RANGE } from 'fluent-ranges'

const bundle = new FluentBundle(['en'], { functions: { NUMBER_RANGE } })

bundle.addResource(ftl`
test = Between {NUMBER_RANGE($start, $end, minimumFractionDigits: 0)}
`)

bundle.formatPattern(bundle.getMessage('test').value, {
  start: new FluentNumber(50, { style: 'currency', currency: 'EUR' }),
  end: new FluentNumber(100, { style: 'currency', currency: 'EUR' }), // These options will be ignored.
})
// > "Between 50 - 100"
```

### Using `FluentNumberRange`

```js
import ftl from '@fluent/dedent'
import { FluentBundle, FluentResource } from '@fluent/bundle'
import { NUMBER_RANGE, FluentNumberRange } from 'fluent-ranges'

const bundle = new FluentBundle(['en'], { functions: { NUMBER_RANGE } })

bundle.addResource(ftl`
test = Between {NUMBER_RANGE($range, minimumFractionDigits: 0)}
`)

bundle.formatPattern(bundle.getMessage('test').value, { range: new FluentNumberRange(50, 100, { style: 'currency', currency: 'EUR' }) })
// > "Between 50 - 100"
```

## Using bare `FluentNumberRange`

```js
import ftl from '@fluent/dedent'
import { FluentBundle, FluentResource } from '@fluent/bundle'
import { NUMBER_RANGE, FluentNumberRange } from 'fluent-ranges'

const bundle = new FluentBundle(['en'], { functions: { NUMBER_RANGE } })

bundle.addResource(ftl`
test = Between {$range}
`)

bundle.formatPattern(bundle.getMessage('test').value, { range: new FluentNumberRange(50, 100, { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }) })
// > "Between 50 - 100"
```
