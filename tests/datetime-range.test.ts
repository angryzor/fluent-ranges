import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'
import { FluentDateTimeRange, DATETIME_RANGE } from '../src/datetime-range'
import { FluentNumberRange } from '../src/number-range';

describe("DATETIME_RANGE", () => {
  let bundle, errs, msg

  beforeAll(() => {
    bundle = new FluentBundle("en-US", { useIsolating: false, functions: { DATETIME_RANGE } });
    bundle.addResource(
      new FluentResource(ftl`
      empty = { DATETIME_RANGE() }
      range-bare = { DATETIME_RANGE($range) }
      range-month-valid = { DATETIME_RANGE($range, month: "long") }
      range-month-bad = { DATETIME_RANGE($range, month: "oops") }
      range-timezone = { DATETIME_RANGE($range, timezone: "America/New_York") }
      range-unknown = { DATETIME_RANGE($range, unknown: "unknown") }
      tuple-bare = { DATETIME_RANGE($start, $end) }
      tuple-month-valid = { DATETIME_RANGE($start, $end, month: "long") }
      tuple-month-bad = { DATETIME_RANGE($start, $end, month: "oops") }
      tuple-timezone = { DATETIME_RANGE($start, $end, timezone: "America/New_York") }
      tuple-unknown = { DATETIME_RANGE($start, $end, unknown: "unknown") }
      `)
    );
  });

  test.each`
    message                | args                                                                                                      | result                                                                                                                                 | errors
    ${'empty'}             | ${{}}                                                                                                     | ${'{DATETIME_RANGE()}'}                                                                                                                | ${[new TypeError('Invalid argument to DATETIME_RANGE')]}
    ${'range-bare'}        | ${{}}                                                                                                     | ${'{DATETIME_RANGE($range)}'}                                                                                                          | ${[new ReferenceError('Unknown variable: $range')]}
    ${'range-month-valid'} | ${{}}                                                                                                     | ${'{DATETIME_RANGE($range)}'}                                                                                                          | ${[new ReferenceError('Unknown variable: $range')]}
    ${'range-month-bad'}   | ${{}}                                                                                                     | ${'{DATETIME_RANGE($range)}'}                                                                                                          | ${[new ReferenceError('Unknown variable: $range')]}
    ${'range-timezone'}    | ${{}}                                                                                                     | ${'{DATETIME_RANGE($range)}'}                                                                                                          | ${[new ReferenceError('Unknown variable: $range')]}
    ${'range-unknown'}     | ${{}}                                                                                                     | ${'{DATETIME_RANGE($range)}'}                                                                                                          | ${[new ReferenceError('Unknown variable: $range')]}
    ${'tuple-bare'}        | ${{}}                                                                                                     | ${'{DATETIME_RANGE($start, $end)}'}                                                                                                    | ${[new ReferenceError('Unknown variable: $start'), new ReferenceError('Unknown variable: $end')]}
    ${'tuple-month-valid'} | ${{}}                                                                                                     | ${'{DATETIME_RANGE($start, $end)}'}                                                                                                    | ${[new ReferenceError('Unknown variable: $start'), new ReferenceError('Unknown variable: $end')]}
    ${'tuple-month-bad'}   | ${{}}                                                                                                     | ${'{DATETIME_RANGE($start, $end)}'}                                                                                                    | ${[new ReferenceError('Unknown variable: $start'), new ReferenceError('Unknown variable: $end')]}
    ${'tuple-timezone'}    | ${{}}                                                                                                     | ${'{DATETIME_RANGE($start, $end)}'}                                                                                                    | ${[new ReferenceError('Unknown variable: $start'), new ReferenceError('Unknown variable: $end')]}
    ${'tuple-unknown'}     | ${{}}                                                                                                     | ${'{DATETIME_RANGE($start, $end)}'}                                                                                                    | ${[new ReferenceError('Unknown variable: $start'), new ReferenceError('Unknown variable: $end')]}
    ${'range-bare'}        | ${{ range: 'foo' }}                                                                                       | ${'{DATETIME_RANGE()}'}                                                                                                                | ${[new TypeError('Invalid argument to DATETIME_RANGE')]}
    ${'range-month-valid'} | ${{ range: 'foo' }}                                                                                       | ${'{DATETIME_RANGE()}'}                                                                                                                | ${[new TypeError('Invalid argument to DATETIME_RANGE')]}
    ${'range-month-bad'}   | ${{ range: 'foo' }}                                                                                       | ${'{DATETIME_RANGE()}'}                                                                                                                | ${[new TypeError('Invalid argument to DATETIME_RANGE')]}
    ${'range-timezone'}    | ${{ range: 'foo' }}                                                                                       | ${'{DATETIME_RANGE()}'}                                                                                                                | ${[new TypeError('Invalid argument to DATETIME_RANGE')]}
    ${'range-unknown'}     | ${{ range: 'foo' }}                                                                                       | ${'{DATETIME_RANGE()}'}                                                                                                                | ${[new TypeError('Invalid argument to DATETIME_RANGE')]}
    ${'range-bare'}        | ${{ range: new FluentDateTimeRange(new Date('2023-06-14').valueOf(), new Date('2023-06-29').valueOf()) }} | ${`${new Intl.DateTimeFormat("en-US").formatRange(new Date('2023-06-14'), new Date('2023-06-29'))}`}                                   | ${[]}
    ${'range-month-valid'} | ${{ range: new FluentDateTimeRange(new Date('2023-06-14').valueOf(), new Date('2023-06-29').valueOf()) }} | ${`${new Intl.DateTimeFormat("en-US", { month: 'long' }).formatRange(new Date('2023-06-14'), new Date('2023-06-29'))}`}                | ${[]}
    ${'range-month-bad'}   | ${{ range: new FluentDateTimeRange(new Date('2023-06-14').valueOf(), new Date('2023-06-29').valueOf()) }} | ${'2023-06-14T00:00:00.000Z - 2023-06-29T00:00:00.000Z'}                                                                               | ${[new RangeError('Value oops out of range for Intl.DateTimeFormat options property month')]}
    ${'range-timezone'}    | ${{ range: new FluentDateTimeRange(new Date('2023-06-14').valueOf(), new Date('2023-06-29').valueOf()) }} | ${`${new Intl.DateTimeFormat("en-US").formatRange(new Date('2023-06-14'), new Date('2023-06-29'))}`} | ${[]}
    ${'range-unknown'}     | ${{ range: new FluentDateTimeRange(new Date('2023-06-14').valueOf(), new Date('2023-06-29').valueOf()) }} | ${`${new Intl.DateTimeFormat("en-US").formatRange(new Date('2023-06-14'), new Date('2023-06-29'))}`}                                   | ${[]}
    ${'range-bare'}        | ${{ range: new FluentNumberRange(new Date('2023-06-14').valueOf(), new Date('2023-06-29').valueOf()) }}   | ${`${new Intl.DateTimeFormat("en-US").formatRange(new Date('2023-06-14'), new Date('2023-06-29'))}`}                                   | ${[]}
    ${'range-month-valid'} | ${{ range: new FluentNumberRange(new Date('2023-06-14').valueOf(), new Date('2023-06-29').valueOf()) }}   | ${`${new Intl.DateTimeFormat("en-US", { month: 'long' }).formatRange(new Date('2023-06-14'), new Date('2023-06-29'))}`}                | ${[]}
    ${'range-month-bad'}   | ${{ range: new FluentNumberRange(new Date('2023-06-14').valueOf(), new Date('2023-06-29').valueOf()) }}   | ${'2023-06-14T00:00:00.000Z - 2023-06-29T00:00:00.000Z'}                                                                               | ${[new RangeError('Value oops out of range for Intl.DateTimeFormat options property month')]}
    ${'range-timezone'}    | ${{ range: new FluentNumberRange(new Date('2023-06-14').valueOf(), new Date('2023-06-29').valueOf()) }}   | ${`${new Intl.DateTimeFormat("en-US").formatRange(new Date('2023-06-14'), new Date('2023-06-29'))}`} | ${[]}
    ${'range-unknown'}     | ${{ range: new FluentNumberRange(new Date('2023-06-14').valueOf(), new Date('2023-06-29').valueOf()) }}   | ${`${new Intl.DateTimeFormat("en-US").formatRange(new Date('2023-06-14'), new Date('2023-06-29'))}`}                                   | ${[]}
    ${'tuple-bare'}        | ${{ start: 'foo', end: new Date('2023-06-29') }}                                                          | ${'{DATETIME_RANGE()}'}                                                                                                                | ${[new TypeError('Invalid argument to DATETIME_RANGE')]}
    ${'tuple-month-valid'} | ${{ start: 'foo', end: new Date('2023-06-29') }}                                                          | ${'{DATETIME_RANGE()}'}                                                                                                                | ${[new TypeError('Invalid argument to DATETIME_RANGE')]}
    ${'tuple-month-bad'}   | ${{ start: 'foo', end: new Date('2023-06-29') }}                                                          | ${'{DATETIME_RANGE()}'}                                                                                                                | ${[new TypeError('Invalid argument to DATETIME_RANGE')]}
    ${'tuple-timezone'}    | ${{ start: 'foo', end: new Date('2023-06-29') }}                                                          | ${'{DATETIME_RANGE()}'}                                                                                                                | ${[new TypeError('Invalid argument to DATETIME_RANGE')]}
    ${'tuple-unknown'}     | ${{ start: 'foo', end: new Date('2023-06-29') }}                                                          | ${'{DATETIME_RANGE()}'}                                                                                                                | ${[new TypeError('Invalid argument to DATETIME_RANGE')]}
    ${'tuple-bare'}        | ${{ start: new Date('2023-06-14'), end: 'bar' }}                                                          | ${'{DATETIME_RANGE()}'}                                                                                                                | ${[new TypeError('Invalid argument to DATETIME_RANGE')]}
    ${'tuple-month-valid'} | ${{ start: new Date('2023-06-14'), end: 'bar' }}                                                          | ${'{DATETIME_RANGE()}'}                                                                                                                | ${[new TypeError('Invalid argument to DATETIME_RANGE')]}
    ${'tuple-month-bad'}   | ${{ start: new Date('2023-06-14'), end: 'bar' }}                                                          | ${'{DATETIME_RANGE()}'}                                                                                                                | ${[new TypeError('Invalid argument to DATETIME_RANGE')]}
    ${'tuple-timezone'}    | ${{ start: new Date('2023-06-14'), end: 'bar' }}                                                          | ${'{DATETIME_RANGE()}'}                                                                                                                | ${[new TypeError('Invalid argument to DATETIME_RANGE')]}
    ${'tuple-unknown'}     | ${{ start: new Date('2023-06-14'), end: 'bar' }}                                                          | ${'{DATETIME_RANGE()}'}                                                                                                                | ${[new TypeError('Invalid argument to DATETIME_RANGE')]}
    ${'tuple-bare'}        | ${{ start: 'foo', end: 'bar' }}                                                                           | ${'{DATETIME_RANGE()}'}                                                                                                                | ${[new TypeError('Invalid argument to DATETIME_RANGE')]}
    ${'tuple-month-valid'} | ${{ start: 'foo', end: 'bar' }}                                                                           | ${'{DATETIME_RANGE()}'}                                                                                                                | ${[new TypeError('Invalid argument to DATETIME_RANGE')]}
    ${'tuple-month-bad'}   | ${{ start: 'foo', end: 'bar' }}                                                                           | ${'{DATETIME_RANGE()}'}                                                                                                                | ${[new TypeError('Invalid argument to DATETIME_RANGE')]}
    ${'tuple-timezone'}    | ${{ start: 'foo', end: 'bar' }}                                                                           | ${'{DATETIME_RANGE()}'}                                                                                                                | ${[new TypeError('Invalid argument to DATETIME_RANGE')]}
    ${'tuple-unknown'}     | ${{ start: 'foo', end: 'bar' }}                                                                           | ${'{DATETIME_RANGE()}'}                                                                                                                | ${[new TypeError('Invalid argument to DATETIME_RANGE')]}
    ${'tuple-bare'}        | ${{ start: new Date('2023-06-14'), end: new Date('2023-06-29') }}                                         | ${`${new Intl.DateTimeFormat("en-US").formatRange(new Date('2023-06-14'), new Date('2023-06-29'))}`}                                   | ${[]}
    ${'tuple-month-valid'} | ${{ start: new Date('2023-06-14'), end: new Date('2023-06-29') }}                                         | ${`${new Intl.DateTimeFormat("en-US", { month: 'long' }).formatRange(new Date('2023-06-14'), new Date('2023-06-29'))}`}                | ${[]}
    ${'tuple-month-bad'}   | ${{ start: new Date('2023-06-14'), end: new Date('2023-06-29') }}                                         | ${'2023-06-14T00:00:00.000Z - 2023-06-29T00:00:00.000Z'}                                                                               | ${[new RangeError('Value oops out of range for Intl.DateTimeFormat options property month')]}
    ${'tuple-timezone'}    | ${{ start: new Date('2023-06-14'), end: new Date('2023-06-29') }}                                         | ${`${new Intl.DateTimeFormat("en-US").formatRange(new Date('2023-06-14'), new Date('2023-06-29'))}`} | ${[]}
    ${'tuple-unknown'}     | ${{ start: new Date('2023-06-14'), end: new Date('2023-06-29') }}                                         | ${`${new Intl.DateTimeFormat("en-US").formatRange(new Date('2023-06-14'), new Date('2023-06-29'))}`}                                   | ${[]}
    ${'tuple-bare'}        | ${{ start: new Date('2023-06-14'), end: new Date('2023-06-29').valueOf() }}                               | ${`${new Intl.DateTimeFormat("en-US").formatRange(new Date('2023-06-14'), new Date('2023-06-29'))}`}                                   | ${[]}
    ${'tuple-month-valid'} | ${{ start: new Date('2023-06-14'), end: new Date('2023-06-29').valueOf() }}                               | ${`${new Intl.DateTimeFormat("en-US", { month: 'long' }).formatRange(new Date('2023-06-14'), new Date('2023-06-29'))}`}                | ${[]}
    ${'tuple-month-bad'}   | ${{ start: new Date('2023-06-14'), end: new Date('2023-06-29').valueOf() }}                               | ${'2023-06-14T00:00:00.000Z - 2023-06-29T00:00:00.000Z'}                                                                               | ${[new RangeError('Value oops out of range for Intl.DateTimeFormat options property month')]}
    ${'tuple-timezone'}    | ${{ start: new Date('2023-06-14'), end: new Date('2023-06-29').valueOf() }}                               | ${`${new Intl.DateTimeFormat("en-US").formatRange(new Date('2023-06-14'), new Date('2023-06-29'))}`} | ${[]}
    ${'tuple-unknown'}     | ${{ start: new Date('2023-06-14'), end: new Date('2023-06-29').valueOf() }}                               | ${`${new Intl.DateTimeFormat("en-US").formatRange(new Date('2023-06-14'), new Date('2023-06-29'))}`}                                   | ${[]}
    ${'tuple-bare'}        | ${{ start: new Date('2023-06-14').valueOf(), end: new Date('2023-06-29') }}                               | ${`${new Intl.DateTimeFormat("en-US").formatRange(new Date('2023-06-14'), new Date('2023-06-29'))}`}                                   | ${[]}
    ${'tuple-month-valid'} | ${{ start: new Date('2023-06-14').valueOf(), end: new Date('2023-06-29') }}                               | ${`${new Intl.DateTimeFormat("en-US", { month: 'long' }).formatRange(new Date('2023-06-14'), new Date('2023-06-29'))}`}                | ${[]}
    ${'tuple-month-bad'}   | ${{ start: new Date('2023-06-14').valueOf(), end: new Date('2023-06-29') }}                               | ${'2023-06-14T00:00:00.000Z - 2023-06-29T00:00:00.000Z'}                                                                               | ${[new RangeError('Value oops out of range for Intl.DateTimeFormat options property month')]}
    ${'tuple-timezone'}    | ${{ start: new Date('2023-06-14').valueOf(), end: new Date('2023-06-29') }}                               | ${`${new Intl.DateTimeFormat("en-US").formatRange(new Date('2023-06-14'), new Date('2023-06-29'))}`} | ${[]}
    ${'tuple-unknown'}     | ${{ start: new Date('2023-06-14').valueOf(), end: new Date('2023-06-29') }}                               | ${`${new Intl.DateTimeFormat("en-US").formatRange(new Date('2023-06-14'), new Date('2023-06-29'))}`}                                   | ${[]}
    ${'tuple-bare'}        | ${{ start: new Date('2023-06-14').valueOf(), end: new Date('2023-06-29').valueOf() }}                     | ${`${new Intl.DateTimeFormat("en-US").formatRange(new Date('2023-06-14'), new Date('2023-06-29'))}`}                                   | ${[]}
    ${'tuple-month-valid'} | ${{ start: new Date('2023-06-14').valueOf(), end: new Date('2023-06-29').valueOf() }}                     | ${`${new Intl.DateTimeFormat("en-US", { month: 'long' }).formatRange(new Date('2023-06-14'), new Date('2023-06-29'))}`}                | ${[]}
    ${'tuple-month-bad'}   | ${{ start: new Date('2023-06-14').valueOf(), end: new Date('2023-06-29').valueOf() }}                     | ${'2023-06-14T00:00:00.000Z - 2023-06-29T00:00:00.000Z'}                                                                               | ${[new RangeError('Value oops out of range for Intl.DateTimeFormat options property month')]}
    ${'tuple-timezone'}    | ${{ start: new Date('2023-06-14').valueOf(), end: new Date('2023-06-29').valueOf() }}                     | ${`${new Intl.DateTimeFormat("en-US").formatRange(new Date('2023-06-14'), new Date('2023-06-29'))}`} | ${[]}
    ${'tuple-unknown'}     | ${{ start: new Date('2023-06-14').valueOf(), end: new Date('2023-06-29').valueOf() }}                     | ${`${new Intl.DateTimeFormat("en-US").formatRange(new Date('2023-06-14'), new Date('2023-06-29'))}`}                                   | ${[]}
  `(
    'rendering message $message with arguments $args should return $result and generate errors $errors',
    ({ message, args, result, errors }) => {
      errs = [];
      msg = bundle.getMessage(message);
      
      const res = bundle.formatPattern(msg.value, args, errs)
      
      expect(errs).toIncludeSameMembers(errors)
      expect(res).toEqual(result)
    },
  )
});

// suite("Built-in functions", function () {
//   let bundle, errors, msg;

//   suite("DATETIME", function () {
//     suiteSetup(function () {
//       bundle = new FluentBundle("en-US", { useIsolating: false });
//       bundle.addResource(
//         new FluentResource(ftl`
//         dt-bare = { DATETIME($arg) }
//         dt-month-valid = { DATETIME($arg, month: "long") }
//         dt-month-bad = { DATETIME($arg, month: "oops") }
//         dt-timezone = { DATETIME($arg, timezone: "America/New_York") }
//         dt-unknown = { DATETIME($arg, unknown: "unknown") }
//         `)
//       );
//     });

//     test("missing argument", function () {
//       errors = [];
//       msg = bundle.getMessage("dt-bare");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, {}, errors),
//         "{DATETIME($arg)}"
//       );
//       assert.strictEqual(errors.length, 1);
//       assert.ok(errors[0] instanceof ReferenceError);
//       assert.strictEqual(errors[0].message, "Unknown variable: $arg");

//       errors = [];
//       msg = bundle.getMessage("dt-month-valid");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, {}, errors),
//         "{DATETIME($arg)}"
//       );
//       assert.strictEqual(errors.length, 1);
//       assert.ok(errors[0] instanceof ReferenceError);
//       assert.strictEqual(errors[0].message, "Unknown variable: $arg");

//       errors = [];
//       msg = bundle.getMessage("dt-month-bad");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, {}, errors),
//         "{DATETIME($arg)}"
//       );
//       assert.strictEqual(errors.length, 1);
//       assert.ok(errors[0] instanceof ReferenceError);
//       assert.strictEqual(errors[0].message, "Unknown variable: $arg");

//       errors = [];
//       msg = bundle.getMessage("dt-timezone");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, {}, errors),
//         "{DATETIME($arg)}"
//       );
//       assert.strictEqual(errors.length, 1);
//       assert.ok(errors[0] instanceof ReferenceError);
//       assert.strictEqual(errors[0].message, "Unknown variable: $arg");

//       errors = [];
//       msg = bundle.getMessage("dt-unknown");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, {}, errors),
//         "{DATETIME($arg)}"
//       );
//       assert.strictEqual(errors.length, 1);
//       assert.ok(errors[0] instanceof ReferenceError);
//       assert.strictEqual(errors[0].message, "Unknown variable: $arg");
//     });

//     test("Date argument", function () {
//       let arg = new Date("2016-09-29");

//       // Format the date argument to account for the testrunner's timezone.
//       let expectedDate = new Intl.DateTimeFormat("en-US").format({ arg }.arg);
//       let expectedMonthLong = new Intl.DateTimeFormat("en-US", {
//         month: "long",
//       }).format({ arg }.arg);

//       errors = [];
//       msg = bundle.getMessage("dt-bare");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         expectedDate
//       );
//       assert.strictEqual(errors.length, 0);

//       errors = [];
//       msg = bundle.getMessage("dt-month-valid");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         expectedMonthLong
//       );
//       assert.strictEqual(errors.length, 0);

//       errors = [];
//       msg = bundle.getMessage("dt-month-bad");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         "2016-09-29T00:00:00.000Z"
//       );
//       assert.strictEqual(errors.length, 1);
//       assert.ok(errors[0] instanceof RangeError); // Invalid option value

//       errors = [];
//       msg = bundle.getMessage("dt-timezone");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         expectedDate
//       );
//       assert.strictEqual(errors.length, 0);

//       errors = [];
//       msg = bundle.getMessage("dt-unknown");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         expectedDate
//       );
//       assert.strictEqual(errors.length, 0);
//     });

//     test("FluentDateTime argument", function () {
//       let date = new Date("2016-09-29");
//       let arg = new FluentDateTime(date, {
//         month: "short",
//         day: "numeric",
//       });

//       // Format the date argument to account for the testrunner's timezone.
//       let expectedMonthShort = new Intl.DateTimeFormat("en-US", {
//         month: "short",
//         day: "numeric",
//       }).format(date);
//       let expectedMonthLong = new Intl.DateTimeFormat("en-US", {
//         month: "long",
//         day: "numeric",
//       }).format(date);

//       errors = [];
//       msg = bundle.getMessage("dt-bare");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         expectedMonthShort
//       );
//       assert.strictEqual(errors.length, 0);

//       errors = [];
//       msg = bundle.getMessage("dt-month-valid");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         expectedMonthLong
//       );
//       assert.strictEqual(errors.length, 0);

//       errors = [];
//       msg = bundle.getMessage("dt-month-bad");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         "2016-09-29T00:00:00.000Z"
//       );
//       assert.strictEqual(errors.length, 1);
//       assert.ok(errors[0] instanceof RangeError); // Invalid option value

//       errors = [];
//       msg = bundle.getMessage("dt-timezone");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         expectedMonthShort
//       );
//       assert.strictEqual(errors.length, 0);

//       errors = [];
//       msg = bundle.getMessage("dt-unknown");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         expectedMonthShort
//       );
//       assert.strictEqual(errors.length, 0);
//     });

//     test("FluentNumber argument, minimumFractionDigits=3", function () {
//       // DATETIME must ignore number options
//       let date = new Date("2016-09-29");
//       let arg = new FluentNumber(Number(date), {
//         minimumFractionDigits: 3,
//       });

//       // Format the date argument to account for the testrunner's timezone.
//       let expectedDate = new Intl.DateTimeFormat("en-US").format(date);
//       let expectedMonthLong = new Intl.DateTimeFormat("en-US", {
//         month: "long",
//       }).format(date);

//       errors = [];
//       msg = bundle.getMessage("dt-bare");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         expectedDate
//       );
//       assert.strictEqual(errors.length, 0);

//       errors = [];
//       msg = bundle.getMessage("dt-month-valid");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         expectedMonthLong
//       );
//       assert.strictEqual(errors.length, 0);
//     });

//     test("number argument", function () {
//       let arg = -1;

//       // Format the date argument to account for the testrunner's timezone.
//       let expectedDate = new Intl.DateTimeFormat("en-US").format({ arg }.arg);
//       let expectedMonthLong = new Intl.DateTimeFormat("en-US", {
//         month: "long",
//       }).format({ arg }.arg);

//       errors = [];
//       msg = bundle.getMessage("dt-bare");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         expectedDate
//       );
//       assert.strictEqual(errors.length, 0);

//       errors = [];
//       msg = bundle.getMessage("dt-month-valid");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         expectedMonthLong
//       );
//       assert.strictEqual(errors.length, 0);

//       errors = [];
//       msg = bundle.getMessage("dt-month-bad");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         "1969-12-31T23:59:59.999Z"
//       );
//       assert.strictEqual(errors.length, 1);
//       assert.ok(errors[0] instanceof RangeError); // Invalid option value

//       errors = [];
//       msg = bundle.getMessage("dt-timezone");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         expectedDate
//       );
//       assert.strictEqual(errors.length, 0);

//       errors = [];
//       msg = bundle.getMessage("dt-unknown");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         expectedDate
//       );
//       assert.strictEqual(errors.length, 0);
//     });

//     test("string argument", function () {
//       let arg = "Foo";

//       errors = [];
//       msg = bundle.getMessage("dt-bare");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         "{DATETIME()}"
//       );
//       assert.strictEqual(errors.length, 1);
//       assert.ok(errors[0] instanceof TypeError);
//       assert.strictEqual(errors[0].message, "Invalid argument to DATETIME");

//       errors = [];
//       msg = bundle.getMessage("dt-month-valid");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         "{DATETIME()}"
//       );
//       assert.strictEqual(errors.length, 1);
//       assert.ok(errors[0] instanceof TypeError);
//       assert.strictEqual(errors[0].message, "Invalid argument to DATETIME");

//       errors = [];
//       msg = bundle.getMessage("dt-month-bad");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         "{DATETIME()}"
//       );
//       assert.strictEqual(errors.length, 1);
//       assert.ok(errors[0] instanceof TypeError);
//       assert.strictEqual(errors[0].message, "Invalid argument to DATETIME");

//       errors = [];
//       msg = bundle.getMessage("dt-timezone");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         "{DATETIME()}"
//       );
//       assert.strictEqual(errors.length, 1);
//       assert.ok(errors[0] instanceof TypeError);
//       assert.strictEqual(errors[0].message, "Invalid argument to DATETIME");

//       errors = [];
//       msg = bundle.getMessage("dt-unknown");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         "{DATETIME()}"
//       );
//       assert.strictEqual(errors.length, 1);
//       assert.ok(errors[0] instanceof TypeError);
//       assert.strictEqual(errors[0].message, "Invalid argument to DATETIME");
//     });

//     test("invalid argument", function () {
//       let arg = [];

//       errors = [];
//       msg = bundle.getMessage("dt-bare");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         "{DATETIME($arg)}"
//       );
//       assert.strictEqual(errors.length, 1);
//       assert.ok(errors[0] instanceof TypeError);
//       assert.strictEqual(
//         errors[0].message,
//         "Variable type not supported: $arg, object"
//       );

//       errors = [];
//       msg = bundle.getMessage("dt-month-valid");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         "{DATETIME($arg)}"
//       );
//       assert.strictEqual(errors.length, 1);
//       assert.ok(errors[0] instanceof TypeError);
//       assert.strictEqual(
//         errors[0].message,
//         "Variable type not supported: $arg, object"
//       );

//       errors = [];
//       msg = bundle.getMessage("dt-month-bad");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         "{DATETIME($arg)}"
//       );
//       assert.strictEqual(errors.length, 1);
//       assert.ok(errors[0] instanceof TypeError);
//       assert.strictEqual(
//         errors[0].message,
//         "Variable type not supported: $arg, object"
//       );

//       errors = [];
//       msg = bundle.getMessage("dt-timezone");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         "{DATETIME($arg)}"
//       );
//       assert.strictEqual(errors.length, 1);
//       assert.ok(errors[0] instanceof TypeError);
//       assert.strictEqual(
//         errors[0].message,
//         "Variable type not supported: $arg, object"
//       );

//       errors = [];
//       msg = bundle.getMessage("dt-unknown");
//       assert.strictEqual(
//         bundle.formatPattern(msg.value, { arg }, errors),
//         "{DATETIME($arg)}"
//       );
//       assert.strictEqual(errors.length, 1);
//       assert.ok(errors[0] instanceof TypeError);
//       assert.strictEqual(
//         errors[0].message,
//         "Variable type not supported: $arg, object"
//       );
//     });
//   });
// });
