const PINCH_STATUS_THROTTLE_MS = 50; // ~3 frames at 60fps

/**
 * Whether a pinch frame is handed to `onStatusChange`.
 *
 * Reports are throttled, except the frame that settles back on rest: nothing follows it, so
 * dropping it leaves a consumer believing the photo is still in hand.
 */
const shouldReportPinchStatus = (
    atRest: boolean,
    wasAtRest: boolean,
    msSinceLastReport: number
) => {
    'worklet';
    return (atRest && !wasAtRest) || msSinceLastReport >= PINCH_STATUS_THROTTLE_MS;
};

export { PINCH_STATUS_THROTTLE_MS, shouldReportPinchStatus };
