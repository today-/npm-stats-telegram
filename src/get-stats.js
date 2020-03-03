const axios = require('axios');

module.exports = async (text) => {
    const { data: bundlephobia } = await axios.get(`https://bundlephobia.com/api/size?package=${text}`);
    const { data: npms } = await axios.get(`https://api.npms.io/v2/package/${text}`);
    const { metadata } = npms.collected;


    console.log(bundlephobia);
    console.log(npms);

    // size + gzip
    // downloads
    // stars
    // issues
    // forks ?
    // quality ?
    // popularity ?
    // releases ? / updated

    return {
        name: bundlephobia.name || metadata.name,
        description: bundlephobia.description || metadata.description,
        version: bundlephobia.version || metadata.version,
        dependencyCount: bundlephobia.dependencyCount || npms.collected.npm.dependentsCount,
    };
};
