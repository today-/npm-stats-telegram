const axios = require('axios');
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime')
const formatSize = require('./format-size');

dayjs.extend(relativeTime);

function formatNumber(number = '') {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = async (name) => {
    const [{ data: bundlephobia }, { data: npms }] = await Promise.all([
        axios.get(`https://bundlephobia.com/api/size?package=${name}`),
        axios.get(`https://api.npms.io/v2/package/${encodeURIComponent(name)}`)
    ])
    const { metadata, npm, github } = npms.collected;

    return {
        name: bundlephobia.name || metadata.name,
        description: bundlephobia.description || metadata.description,
        version: bundlephobia.version || metadata.version,
        dependencyCount: formatNumber(bundlephobia.dependencyCount || npm.dependentsCount) || 'no',

        size: formatSize(bundlephobia.size).split(' '),
        gzip: formatSize(bundlephobia.gzip).split(' '),

        downloads: npm.downloads && formatNumber(npm.downloads[1].count), // last week
        stars: formatNumber(github.starsCount),
        forks: formatNumber(github.forksCount),
        issues: formatNumber(github.issues.openCount),
        subscribers: formatNumber(github.subscribersCount),

        updated: dayjs(metadata.date).fromNow(), // Last publish
    };
};
