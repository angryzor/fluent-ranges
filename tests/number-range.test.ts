import { FluentBundle, FluentResource, FluentDateTime, FluentNumber } from '@fluent/bundle'
import ftl from '@fluent/dedent'
import { FluentNumberRange, NUMBER_RANGE } from '../src/number-range'

describe("NUMBER", () => {
  let bundle, errs, msg

  beforeAll(() => {
    bundle = new FluentBundle("en-US", { useIsolating: false, functions: { NUMBER_RANGE } });
    bundle.addResource(
      new FluentResource(ftl`
      empty = { NUMBER_RANGE() }
      range-bare = { NUMBER_RANGE($range) }
      range-fraction-valid = { NUMBER_RANGE($range, minimumFractionDigits: 1) }
      range-fraction-bad = { NUMBER_RANGE($range, minimumFractionDigits: "oops") }
      range-style = { NUMBER_RANGE($range, style: "percent") }
      range-currency = { NUMBER_RANGE($range, currency: "EUR") }
      range-unknown = { NUMBER_RANGE($range, unknown: "unknown") }
      tuple-bare = { NUMBER_RANGE($start, $end) }
      tuple-fraction-valid = { NUMBER_RANGE($start, $end, minimumFractionDigits: 1) }
      tuple-fraction-bad = { NUMBER_RANGE($start, $end, minimumFractionDigits: "oops") }
      tuple-style = { NUMBER_RANGE($start, $end, style: "percent") }
      tuple-currency = { NUMBER_RANGE($start, $end, currency: "EUR") }
      tuple-unknown = { NUMBER_RANGE($start, $end, unknown: "unknown") }
      `)
    );
  });

  test.each`
    message                   | args                                      | result                            | errors
    ${'empty'}                | ${{}}                                     | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
    ${'range-bare'}           | ${{}}                                     | ${'{NUMBER_RANGE($range)}'}       | ${[new ReferenceError('Unknown variable: $range')]}
    ${'range-fraction-valid'} | ${{}}                                     | ${'{NUMBER_RANGE($range)}'}       | ${[new ReferenceError('Unknown variable: $range')]}
    ${'range-fraction-bad'}   | ${{}}                                     | ${'{NUMBER_RANGE($range)}'}       | ${[new ReferenceError('Unknown variable: $range')]}
    ${'range-style'}          | ${{}}                                     | ${'{NUMBER_RANGE($range)}'}       | ${[new ReferenceError('Unknown variable: $range')]}
    ${'range-currency'}       | ${{}}                                     | ${'{NUMBER_RANGE($range)}'}       | ${[new ReferenceError('Unknown variable: $range')]}
    ${'range-unknown'}        | ${{}}                                     | ${'{NUMBER_RANGE($range)}'}       | ${[new ReferenceError('Unknown variable: $range')]}
    ${'tuple-bare'}           | ${{}}                                     | ${'{NUMBER_RANGE($start, $end)}'} | ${[new ReferenceError('Unknown variable: $start'), new ReferenceError('Unknown variable: $end')]}
    ${'tuple-fraction-valid'} | ${{}}                                     | ${'{NUMBER_RANGE($start, $end)}'} | ${[new ReferenceError('Unknown variable: $start'), new ReferenceError('Unknown variable: $end')]}
    ${'tuple-fraction-bad'}   | ${{}}                                     | ${'{NUMBER_RANGE($start, $end)}'} | ${[new ReferenceError('Unknown variable: $start'), new ReferenceError('Unknown variable: $end')]}
    ${'tuple-style'}          | ${{}}                                     | ${'{NUMBER_RANGE($start, $end)}'} | ${[new ReferenceError('Unknown variable: $start'), new ReferenceError('Unknown variable: $end')]}
    ${'tuple-currency'}       | ${{}}                                     | ${'{NUMBER_RANGE($start, $end)}'} | ${[new ReferenceError('Unknown variable: $start'), new ReferenceError('Unknown variable: $end')]}
    ${'tuple-unknown'}        | ${{}}                                     | ${'{NUMBER_RANGE($start, $end)}'} | ${[new ReferenceError('Unknown variable: $start'), new ReferenceError('Unknown variable: $end')]}
    ${'range-bare'}           | ${{ range: 'foo' }}                       | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
    ${'range-fraction-valid'} | ${{ range: 'foo' }}                       | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
    ${'range-fraction-bad'}   | ${{ range: 'foo' }}                       | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
    ${'range-style'}          | ${{ range: 'foo' }}                       | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
    ${'range-currency'}       | ${{ range: 'foo' }}                       | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
    ${'range-unknown'}        | ${{ range: 'foo' }}                       | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
    ${'tuple-bare'}           | ${{ start: 'foo', end: 5 }}               | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
    ${'tuple-fraction-valid'} | ${{ start: 'foo', end: 5 }}               | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
    ${'tuple-fraction-bad'}   | ${{ start: 'foo', end: 5 }}               | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
    ${'tuple-style'}          | ${{ start: 'foo', end: 5 }}               | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
    ${'tuple-currency'}       | ${{ start: 'foo', end: 5 }}               | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
    ${'tuple-unknown'}        | ${{ start: 'foo', end: 5 }}               | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
    ${'tuple-bare'}           | ${{ start: 6, end: 'bar' }}               | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
    ${'tuple-fraction-valid'} | ${{ start: 6, end: 'bar' }}               | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
    ${'tuple-fraction-bad'}   | ${{ start: 6, end: 'bar' }}               | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
    ${'tuple-style'}          | ${{ start: 6, end: 'bar' }}               | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
    ${'tuple-currency'}       | ${{ start: 6, end: 'bar' }}               | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
    ${'tuple-unknown'}        | ${{ start: 6, end: 'bar' }}               | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
    ${'tuple-bare'}           | ${{ start: 'foo', end: 'bar' }}           | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
    ${'tuple-fraction-valid'} | ${{ start: 'foo', end: 'bar' }}           | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
    ${'tuple-fraction-bad'}   | ${{ start: 'foo', end: 'bar' }}           | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
    ${'tuple-style'}          | ${{ start: 'foo', end: 'bar' }}           | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
    ${'tuple-currency'}       | ${{ start: 'foo', end: 'bar' }}           | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
    ${'tuple-unknown'}        | ${{ start: 'foo', end: 'bar' }}           | ${'{NUMBER_RANGE()}'}             | ${[new TypeError('Invalid argument to NUMBER_RANGE')]}
  `(
    'rendering message $message with arguments $args should return $result and generate errors $errors',
    ({ message, args, result, errors }) => {
      errs = [];
      msg = bundle.getMessage(message);
      expect(bundle.formatPattern(msg.value, args, errs)).toEqual(result)
      expect(errs).toIncludeSameMembers(errors)
    },
  )
});
