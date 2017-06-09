require.config({
	baseUrl: './',
	paths: {
		jquery: 'lib/js/jquery.min',
		lodash: 'lib/js/lodash.min',
		backbone: 'lib/js/backbone-min',
		joint: 'lib/js/joint.min'
		// SE CI SONO ALTRE LIBRERIE, AGGIUNGERLE
	},
	map: {
		'*': {
			'underscore': 'lodash'
		}
	}
});

/*
console.log('Hey! I am main.js');
require(['js/views/AppView'], function(AppView) {
	var app_view=new AppView;
});
*/