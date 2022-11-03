import { FluentDateTime, FluentFunction, FluentNone, FluentNumber, FluentType } from '@fluent/bundle';
import type { Scope } from '@fluent/bundle/esm/scope';
import { FluentNumberRange } from './number-range.js';
import { values } from './util.js';

export class FluentDateTimeRange extends FluentType<{ start: number, end: number }> {
	public opts: Intl.DateTimeFormatOptions;

	constructor(start: number, end: number, opts: Intl.DateTimeFormatOptions = {}) {
		super({ start, end })
		this.opts = opts
	}

	toString(scope: Scope): string {
		try {
			const dtf = scope.memoizeIntlObject(Intl.DateTimeFormat, this.opts)
			return dtf.formatRange(this.value.start, this.value.end);
		} catch (err) {
			scope.reportError(err);
			return `${new Date(this.value.start).toISOString()} - ${new Date(this.value.end).toISOString()}`;
		}
	}
}

const DATETIME_ALLOWED = [
	"dateStyle",
	"timeStyle",
	"fractionalSecondDigits",
	"dayPeriod",
	"hour12",
	"weekday",
	"era",
	"year",
	"month",
	"day",
	"hour",
	"minute",
	"second",
	"timeZoneName",
];

export const DATETIME_RANGE: FluentFunction = ([start, end], opts) => {
	if (start instanceof FluentNone || end instanceof FluentNone) {
		return new FluentNone(`DATETIME_RANGE(${start.valueOf()}${end !== undefined ? `, ${end.valueOf()}` : ''})`);
	}

	if (start instanceof FluentDateTimeRange || start instanceof FluentNumberRange) {
		return new FluentDateTimeRange(start.valueOf().start, start.valueOf().end, {
			...start instanceof FluentDateTimeRange ? start.opts : {},
			...values(opts, DATETIME_ALLOWED),
		});
	}

	if ((start instanceof FluentDateTime || start instanceof FluentNumber) && (end instanceof FluentDateTime || end instanceof FluentNumber)) {
		return new FluentDateTimeRange(start.valueOf(), end.valueOf(), {
			...start instanceof FluentDateTime ? start.opts : end instanceof FluentDateTime ? end.opts : {},
			...values(opts, DATETIME_ALLOWED),
		});
	}

	throw new TypeError(`Invalid argument to DATETIME_RANGE`);
};
