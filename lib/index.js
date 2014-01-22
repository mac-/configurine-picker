var _ = require('underscore'),
	containsAppAssociation = function(arr, appName, appVersion) {
		return !!_.find(arr, function(item) { return (item.name === appName && item.versions.indexOf(appVersion) >= 0); });
	},
	pickOne = function(entries, appName, appVersion, environmentName, associationPriority) {
		var sortedEntries = _.sortBy(entries, function(entry) {
			var priority = 0;
			for (var prop in associationPriority) {
				if (entry.hasOwnProperty('associations') && entry.associations.hasOwnProperty(prop) &&
					(_.contains(entry.associations[prop], environmentName) || containsAppAssociation(entry.associations[prop], appName, appVersion))) {
					priority += associationPriority[prop];
				}
			}
			return priority;
		});
		return sortedEntries.pop();
	},
	filterEntries = function(options) {
		options = options || {};
		options.pickField = options.pickField || 'value';
		options.associationPriority = options.associationPriority || 'app';
		if (!options.names || options.names.length < 1) {
			return {};
		}
		if (!options.appName || !options.appVersion || !options.environmentName || !options.entries) {
			throw new Error('Invalid or missing parameters!');
		}
		var prop, associationPriority,
			config = _.object(options.names, []),
			groups = _.groupBy(options.entries, function(entry) { return entry.name; });

		associationPriority = {
			applications: (options.associationPriority === 'app') ? 2 : 1,
			environments: (options.associationPriority === 'env') ? 2 : 1
		};
		for (prop in groups) {
			if (groups.hasOwnProperty(prop)) {
				if (groups[prop].length === 1) {
					config[prop] = groups[prop][0][options.pickField];
				}
				else {
					config[prop] = pickOne(groups[prop], options.appName, options.appVersion, options.environmentName, associationPriority)[options.pickField];
				}
			}
		}
		return config;
	};

module.exports = filterEntries;