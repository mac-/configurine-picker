var assert = require('assert'),
	_ = require('underscore'),
	picker = require('../../lib/index.js');
	

describe('Picker Unit Tests', function() {

	it('should pick entry that has matching env and app association regardless of priority', function(done) {
		var appName = 'app1',
			appVersion = '1.0.0',
			envName = 'dev',
			names = ['name1', 'name2'],
			mockConfigurineResults = [
				{
					name: 'name1',
					value: 'fnord1',
					associations: {
						applications: [
							{
								name: 'app1',
								versions: ['1.0.0']
							}
						],
						environments: ['dev']
					}
				},
				{
					name: 'name1',
					value: 'fnord2',
					associations: {
						applications: [],
						environments: ['dev']
					}
				},
				{
					name: 'name1',
					value: 'fnord3',
					associations: {
						applications: [
							{
								name: 'app1',
								versions: ['1.0.0', '2.0.0']
							}
						],
						environments: ['stg']
					}
				},
				{
					name: 'name1',
					value: 'fnord4',
					associations: {
						applications: [
							{
								name: 'app1',
								versions: ['1.0.0']
							}
						],
						environments: []
					}
				},
				{
					name: 'name1',
					value: 'fnord5',
					associations: {
						applications: [],
						environments: []
					}
				}
			];

		var config = picker({
			names: names,
			appName: appName,
			appVersion: appVersion,
			environmentName: envName,
			associationPriority: 'app',
			entries: mockConfigurineResults
		});

		assert.strictEqual(config.name1, 'fnord1');
		assert.strictEqual(config.name2, undefined);

		config = picker({
			names: names,
			appName: appName,
			appVersion: appVersion,
			environmentName: envName,
			associationPriority: 'env',
			entries: mockConfigurineResults
		});
		
		assert.strictEqual(config.name1, 'fnord1');
		assert.strictEqual(config.name2, undefined);

		done();
	});

	it('should pick entry that has matching app over matching env when app is priority', function(done) {
		var appName = 'app1',
			appVersion = '1.0.0',
			envName = 'dev',
			names = ['name1', 'name2'],
			mockConfigurineResults = [
				{
					name: 'name1',
					value: 'fnord2',
					associations: {
						applications: [],
						environments: ['dev']
					}
				},
				{
					name: 'name1',
					value: 'fnord3',
					associations: {
						applications: [
							{
								name: 'app1',
								versions: ['1.0.0', '2.0.0']
							}
						],
						environments: ['stg']
					}
				},
				{
					name: 'name1',
					value: 'fnord4',
					associations: {
						applications: [
							{
								name: 'app1',
								versions: ['1.0.0']
							}
						],
						environments: []
					}
				},
				{
					name: 'name1',
					value: 'fnord5',
					associations: {
						applications: [],
						environments: []
					}
				}
			];

		var config = picker({
			names: names,
			appName: appName,
			appVersion: appVersion,
			environmentName: envName,
			associationPriority: 'app',
			entries: mockConfigurineResults
		});
		
		assert.strictEqual(config.name1, 'fnord4');
		assert.strictEqual(config.name2, undefined);
		done();
	});

	it('should pick entry that has matching env over matching app when env is priority', function(done) {
		var appName = 'app1',
			appVersion = '1.0.0',
			envName = 'dev',
			names = ['name1', 'name2'],
			mockConfigurineResults = [
				{
					name: 'name1',
					value: 'fnord2',
					associations: {
						applications: [],
						environments: ['dev']
					}
				},
				{
					name: 'name1',
					value: 'fnord3',
					associations: {
						applications: [
							{
								name: 'app1',
								versions: ['1.0.0', '2.0.0']
							}
						],
						environments: ['stg']
					}
				},
				{
					name: 'name1',
					value: 'fnord4',
					associations: {
						applications: [
							{
								name: 'app1',
								versions: ['1.0.0']
							}
						],
						environments: []
					}
				},
				{
					name: 'name1',
					value: 'fnord5',
					associations: {
						applications: [],
						environments: []
					}
				}
			];

		var config = picker({
			names: names,
			appName: appName,
			appVersion: appVersion,
			environmentName: envName,
			associationPriority: 'env',
			entries: mockConfigurineResults
		});
		
		assert.strictEqual(config.name1, 'fnord2');
		assert.strictEqual(config.name2, undefined);
		done();
	});

	it('should pick the only entry when there is only one', function(done) {
		var appName = 'app1',
			appVersion = '1.0.0',
			envName = 'dev',
			names = ['name1', 'name2'],
			mockConfigurineResults = [
				{
					name: 'name1',
					value: 'fnord2',
					associations: {
						applications: [],
						environments: ['dev']
					}
				},
				{
					name: 'name2',
					value: 'fnord3',
					associations: {
						applications: [
							{
								name: 'app1',
								versions: ['1.0.0', '2.0.0']
							}
						],
						environments: []
					}
				}
			];

		var config = picker({
			names: names,
			appName: appName,
			appVersion: appVersion,
			environmentName: envName,
			associationPriority: 'app',
			entries: mockConfigurineResults
		});
		
		assert.strictEqual(config.name1, 'fnord2');
		assert.strictEqual(config.name2, 'fnord3');
		done();
	});

	it('should pick the the id field of wach entry', function(done) {
		var appName = 'app1',
			appVersion = '1.0.0',
			envName = 'dev',
			names = ['name1', 'name2'],
			mockConfigurineResults = [
				{
					id: '519bc51c9b9c05f772000001',
					name: 'name1',
					value: 'fnord2',
					associations: {
						applications: [],
						environments: ['dev']
					}
				},
				{
					id: '519bc51c9b9c05f772000002',
					name: 'name2',
					value: 'fnord3',
					associations: {
						applications: [
							{
								name: 'app1',
								versions: ['1.0.0', '2.0.0']
							}
						],
						environments: []
					}
				}
			];

		var config = picker({
			names: names,
			appName: appName,
			appVersion: appVersion,
			environmentName: envName,
			associationPriority: 'app',
			entries: mockConfigurineResults,
			pickField: 'id'
		});
		
		assert.strictEqual(config.name1, '519bc51c9b9c05f772000001');
		assert.strictEqual(config.name2, '519bc51c9b9c05f772000002');
		done();
	});

	it('should return an empty object when no names are provided', function(done) {
		var appName = 'app1',
			appVersion = '1.0.0',
			envName = 'dev',
			names = [],
			mockConfigurineResults = [
				{
					name: 'name1',
					value: 'fnord2',
					associations: {
						applications: [],
						environments: ['dev']
					}
				},
				{
					name: 'name2',
					value: 'fnord3',
					associations: {
						applications: [
							{
								name: 'app1',
								versions: ['1.0.0', '2.0.0']
							}
						],
						environments: []
					}
				}
			];

		var config = picker({
			names: names,
			appName: appName,
			appVersion: appVersion,
			environmentName: envName,
			associationPriority: 'app',
			entries: mockConfigurineResults
		});
		
		assert.strictEqual(_.keys(config).length, 0);
		assert.strictEqual(config.name1, undefined);
		done();
	});

	it('should throw an error when provided missing or invalid params', function(done) {
		var names = ['name1', 'name2'],
			mockConfigurineResults = [
				{
					name: 'name1',
					value: 'fnord2',
					associations: {
						applications: [],
						environments: ['dev']
					}
				},
				{
					name: 'name2',
					value: 'fnord3',
					associations: {
						applications: [
							{
								name: 'app1',
								versions: ['1.0.0', '2.0.0']
							}
						],
						environments: []
					}
				}
			];

		assert.throws(function() {
			picker({
				names: names,
				associationPriority: 'app',
				entries: mockConfigurineResults
			});
		}, /missing/);
		done();
	});
});