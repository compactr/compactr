/** Benchmarks */

'use strict';

/* Requires ------------------------------------------------------------------*/

const Benchmark = require('benchmark');
const Compactr = require('../');

/* Local variables -----------------------------------------------------------*/


let User = Compactr.schema({ 
	id: { type: 'int32', size: 4 }, 
	str: { type: 'char8', size: 6 }, 
	int: { type: 'double', size: 8 }
});

const mult = 32;

const floatSuite = new Benchmark.Suite();

/* Float suite ---------------------------------------------------------------*/

floatSuite.add('JSON', floatJSON)
.add('Compactr', floatCompactr)
.on('cycle', e => console.log(String(e.target)))
.on('complete', () => console.log('Fastest is ' + floatSuite.filter('fastest').map('name')))
.run({ 'async': true });

function floatJSON() {
	let packed, unpacked;

	for(let i = 0; i<mult*mult; i++) {
		packed = new Buffer(JSON.stringify({ id: i, int: Math.random() }));
		unpacked = JSON.parse(packed.toString());
	}
}

function floatCompactr() {
	let packed, unpacked;

	for(let i = 0; i<mult*mult; i++) {
		packed = User.load({ id: i, int: Math.random() }).array();
		unpacked = User.read(packed);
	}
}