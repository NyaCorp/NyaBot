const ActionIds = {
    NOT_STARTED: 'status_not_started',
    IN_PROGRESS: 'status_in_progress',
    DONE: 'status_done',
    HOLD_OFF: 'status_hold_off',
    NEW_TASK: 'new_task'
};

const StatusLabels = {
    NOT_STARTED: '<:checkwhite:1482800964179198176>',
    IN_PROGRESS: '<:checkyellow:1482800590521110659>',
    DONE: '<:checkmark:1482800932923113512>',
    HOLD_OFF: '<:cross:1482800878120603718>'
};

function getCurrentDateHeader() {
    const formatter = new Intl.DateTimeFormat('es-MX', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric', 
        timeZone: 'America/Mexico_City' 
    });
    
    const parts = formatter.formatToParts(new Date());
    const day = parts.find(p => p.type === 'day').value;
    let month = parts.find(p => p.type === 'month').value;
    const year = parts.find(p => p.type === 'year').value;
    
    month = month.charAt(0).toUpperCase() + month.slice(1);
    
    return `> ${day} de ${month} del ${year}`;
}

const KeysFooter = 
    'Keys:\n' +
    `${StatusLabels.NOT_STARTED} Not Started\n` +
    `${StatusLabels.IN_PROGRESS} In Progress\n` +
    `${StatusLabels.DONE} Done\n` +
    `${StatusLabels.HOLD_OFF} Hold Off`;

module.exports = {
    ActionIds,
    StatusLabels,
    getCurrentDateHeader,
    KeysFooter
};
