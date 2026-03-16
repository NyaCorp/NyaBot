const ActionIds = {
    NOT_STARTED: 'status_not_started',
    IN_PROGRESS: 'status_in_progress',
    DONE: 'status_done',
    HOLD_OFF: 'status_hold_off'
};

const StatusLabels = {
    NOT_STARTED: '<:checkwhite:1482800964179198176>',
    IN_PROGRESS: '<:checkyellow:1482800590521110659>',
    DONE: '<:checkmark:1482800932923113512>',
    HOLD_OFF: '<:cross:1482800878120603718>'
};

module.exports = {
    ActionIds,
    StatusLabels
};
