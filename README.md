configurine-picker
==================

Logic for picking config values based on a given app name, app version, and environment name from Configurine

[![Build Status](https://secure.travis-ci.org/mac-/configurine-picker.png)](http://travis-ci.org/mac-/configurine-picker)
[![Coverage Status](https://coveralls.io/repos/mac-/configurine-picker/badge.png)](https://coveralls.io/r/mac-/configurine-picker)
[![NPM version](https://badge.fury.io/js/configurine-picker.png)](http://badge.fury.io/js/configurine-picker)
[![Dependency Status](https://david-dm.org/mac-/configurine-picker.png)](https://david-dm.org/mac-/configurine-picker)

[![NPM](https://nodei.co/npm/configurine-picker.png?downloads=true&stars=true)](https://nodei.co/npm/configurine-picker/)

## Installation

You may depend on the module by putting an entry in the dependencies section of your package.json file with the appropriate version:

	"configurine-picker": "0.x.x"

You may also use npm to install the module and have it saved to your package.json using:

	npm install configurine-picker --save

## Usage

This module takes a set of config entries and filters them down to one of each name by picking the one whose associations best match the given application and environment using the following priority:

* has both the matching app and env association
* has one of a matching app or env association (app or env may have a higher priority based on app settings (associationPriority))
* has no matching app or env associations

The function exported by this module takes one `options` paramter and returns an object that contains the names provided and the corresponding values that were picked. The expected properties on the `options` object are:

* `appName` - the name of the application to match on (required)
* `appVersion` - the version of the application to match on (required)
* `environmentName` - the name of the environment to match on (required)
* `names` - an array of strings that represent the names of the config entries pick for
* `associationPriority` - tells the picker which association to give priority to: 'app' or 'env'. Defaults to 'app'
* `entries` - the collection of config entries from configurine to pick from (required)

Example:

```javascript
var picker = require('configurine-picker');

// example set of config entries from configurine for demo purposes
var entries = [
	{
		name: 'foo',
		value: 'bar',
		associations: {
			applications: [{
				name: 'my-app',
				versions: ['1.0.0']
			}],
			environments: []
		},
		isActive: true,
		isSensitive: false,
		owner: 'me'
	},
	{
		name: 'foo',
		value: 'baz',
		associations: {
			applications: [],
			environments: ['production']
		},
		isActive: true,
		isSensitive: false,
		owner: 'me'
	}
];

var config = picker({
	names: ['foo'],
	appName: 'my-app',
	appVersion: '1.0.0',
	environmentName: 'production',
	associationPriority: 'app',
	entries: entries
});

console.log(config.foo); // 'bar'


config = picker({
	names: ['foo', 'other'],
	appName: 'my-app',
	appVersion: '1.0.0',
	environmentName: 'production',
	associationPriority: 'env',
	entries: entries
});

console.log(config.foo); // 'baz'
console.log(config.other); // undefined
```

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/mac-/configurine-picker/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

