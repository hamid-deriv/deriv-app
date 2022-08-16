const path = require('path');

const resources = [
    'constants.scss',
    'mixins.scss',
    'fonts.scss',
    'inline-icons.scss',
    'devices.scss',
    'responsive.scss',
];

module.exports = resources.map(file => path.resolve(__dirname, file));
