module.exports = (input = '') => {
    input = input.toLowerCase();

	if (input.includes('npmstats') || input.includes('bundlephobia') || input.includes('vs')) {
        input = input.replace(/npmstats/g, '').replace(/bundlephobia/g, '').replace(/\bvs\b/g, '');

        return input.split(' ')
            .map(n => n.trim())
            .filter(n => /^[@\w\-\/\d]+/g.test(n))
            .slice(0, 5);
    }

	return [];
};
