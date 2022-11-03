import { FluentDateTime, FluentFunction, FluentNone, FluentNumber, FluentType } from '@fluent/bundle';
import type { Scope } from '@fluent/bundle/esm/scope';
import { FluentDateTimeRange } from './datetime-range.js';
import { values } from './util.js';

export class FluentNumberRange extends FluentType<{ start: number, end: number }> {
	public opts: Intl.NumberFormatOptions;

	constructor(start: number, end: number, opts: Intl.NumberFormatOptions = {}) {
		super({ start, end });
		this.opts = opts;
	}

	toString(scope: Scope): string {
		try {
			const nf = scope.memoizeIntlObject(Intl.NumberFormat, this.opts);
			return nf.formatRange(this.value.start, this.value.end);
		} catch (err) {
			scope.reportError(err);
			return `${this.value.start.toString(10)} - ${this.value.end.toString(10)}`;
		}
	}
}

const NUMBER_ALLOWED = [
	"unitDisplay",
	"currencyDisplay",
	"useGrouping",
	"minimumIntegerDigits",
	"minimumFractionDigits",
	"maximumFractionDigits",
	"minimumSignificantDigits",
	"maximumSignificantDigits",
];

export const NUMBER_RANGE: FluentFunction = ([start, end], opts) => {
	if (start instanceof FluentNone || end instanceof FluentNone) {
		return new FluentNone(`NUMBER_RANGE(${start.valueOf()}${end !== undefined ? `, ${end.valueOf()}` : ''})`);
	}

	if (start instanceof FluentNumberRange || start instanceof FluentDateTimeRange) {
		return new FluentNumberRange(start.valueOf().start, start.valueOf().end, {
			...start instanceof FluentNumberRange ? start.opts : {},
			...values(opts, NUMBER_ALLOWED),
		});
	}
	
	if ((start instanceof FluentNumber || start instanceof FluentDateTime) && (end instanceof FluentNumber || end instanceof FluentDateTime)) {
		return new FluentNumberRange(start.valueOf(), end.valueOf(), {
			...start instanceof FluentNumber ? start.opts : end instanceof FluentNumber ? end.opts : {},
			...values(opts, NUMBER_ALLOWED),
		});
	}

	throw new TypeError("Invalid argument to NUMBER_RANGE");
};
