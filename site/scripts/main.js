/**
 * Main JavaScript
 * Site Name
 *
 * Copyright (c) 2015. by Way2CU, http://way2cu.com
 * Authors:
 */

// create or use existing site scope
var Site = Site || {};

// make sure variable cache exists
Site.variable_cache = Site.variable_cache || {};


/**
 * Check if site is being displayed on mobile.
 * @return boolean
 */
Site.is_mobile = function() {
	var result = false;

	// check for cached value
	if ('mobile_version' in Site.variable_cache) {
		result = Site.variable_cache['mobile_version'];

	} else {
		// detect if site is mobile
		var elements = document.getElementsByName('viewport');

		// check all tags and find `meta`
		for (var i=0, count=elements.length; i<count; i++) {
			var tag = elements[i];

			if (tag.tagName == 'META') {
				result = true;
				break;
			}
		}

		// cache value so next time we are faster
		Site.variable_cache['mobile_version'] = result;
	}

	return result;
};

/**
 * Function called when document and images have been completely loaded.
 */
Site.on_load = function() {
	if (Site.is_mobile())
		Site.mobile_menu = new Caracal.MobileMenu();

	// create slider for clients gallery
		Site.client_gallery = new Caracal.Gallery.Slider();
		Site.client_gallery
			.controls.attach_next($('div.slider a.next'))
			.controls.attach_previous($('div.slider a.previous'))
			.controls.set_auto(3000)
			.images.set_container(' div.slider')
			.images.add('div.slider a.image')
			.images.set_visible_count(5)
			.images.set_center(true)
			.images.set_spacing(20);
		
		Site.client_gallery.images.update();
};


// connect document `load` event with handler function
$(Site.on_load);
