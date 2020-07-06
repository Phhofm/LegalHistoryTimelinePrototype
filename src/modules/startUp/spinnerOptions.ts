export const spinnerOptions = {
    lines: 14,                              // The number of lines to draw
    length: 25,                             // The length of each line
    width: 1,                               // The line thickness
    radius: 0,                              // The radius of the inner circle
    scale: 1.85,                            // Scales overall size of the spinner
    corners: 1,                             // Corner roundness (0..1)
    color: '#00f3ff',                       // CSS color or array of colors
    fadeColor: 'transparent',               // CSS color or array of colors
    speed: 0.8,                             // Rounds per second
    rotate: 0,                              // The rotation offset
    animation: 'spinner-line-fade-more',    // The CSS animation name for the lines
    direction: 1,                           // 1: clockwise, -1: counterclockwise
    zIndex: 2e9,                            // The z-index (defaults to 2000000000)
    className: 'spinner',                   // The CSS class to assign to the spinner
    top: '51%',                             // Top position relative to parent
    left: '50%',                            // Left position relative to parent
    shadow: '0 0 1px transparent',          // Box-shadow for the lines
    position: 'absolute'                    // Element positioning
};