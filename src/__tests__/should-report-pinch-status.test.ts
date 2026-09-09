import {
    PINCH_STATUS_THROTTLE_MS,
    shouldReportPinchStatus,
} from '../utils/should-report-pinch-status';

describe('shouldReportPinchStatus', () => {
    describe('a frame away from rest', () => {
        it.each([PINCH_STATUS_THROTTLE_MS, PINCH_STATUS_THROTTLE_MS + 16])(
            'is reported %ims after the last report',
            (msSinceLastReport) => {
                expect(shouldReportPinchStatus(false, false, msSinceLastReport)).toBe(true);
            }
        );

        it('is dropped inside the throttle window', () => {
            expect(shouldReportPinchStatus(false, false, 16)).toBe(false);
        });
    });

    describe('the frame that settles back on rest', () => {
        it('is reported inside the throttle window', () => {
            expect(shouldReportPinchStatus(true, false, 16)).toBe(true);
        });
    });

    describe('a frame that was already at rest', () => {
        it('is dropped inside the throttle window', () => {
            expect(shouldReportPinchStatus(true, true, 16)).toBe(false);
        });
    });
});
