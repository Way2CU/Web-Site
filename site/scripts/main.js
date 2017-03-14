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
 * Handler for window scroll event
 */
Site.handle_scroll = function(event) {
	if (!Site.logo_color.classList.contains('floating'))
		return;

	if (window.scrollY > Site.max_size - 90) {
		Site.logo_color.style.opacity = 1;
		Site.logo_black.classList.remove('floating');
		Site.logo_color.classList.remove('floating');

	} else {
		Site.logo_color.style.opacity = window.scrollY / Site.max_size;
	}
}

/**
 * Function called when document and images have been completely loaded.
 */
Site.on_load = function() {
	// create slider for clients gallery
	Site.client_gallery = new Caracal.Gallery.Slider();
	Site.client_gallery
		.controls.attach_next('div.slider a.next')
		.controls.attach_previous('div.slider a.previous')
		.controls.set_auto(3000)
		.images.set_container(' div.slider')
		.images.add('div.slider a.image')
		.images.set_visible_count(5)
		.images.set_center(true)
		.images.set_spacing(20)
		.images.update();

	// create slider for portfolio gallery
	Site.portfolio_gallery = new Caracal.Gallery.Slider();
	Site.portfolio_gallery
		.controls.attach_next('div.controls a.next')
		.controls.attach_previous('div.controls a.previous')
		.images.set_container(' div.gallery')
		.images.add('div.gallery a.portfolio')
		.images.set_visible_count(3)
		.images.set_center(true)
		.images.set_spacing(20)
		.images.update();

	if (!Site.is_mobile()) {
		Site.logo_black = document.querySelector('img.logo');
		Site.logo_color = document.querySelector('section#services img.logo');

		Site.max_size = Site.logo_color.getBoundingClientRect().top;
		Site.logo_black.classList.add('floating');
		Site.logo_color.classList.add('floating');

		// create handler for scroll event
		$(window).on('scroll', Site.handle_scroll);
	}

	if (Site.is_mobile()) {
		Site.client_gallery.images.set_visible_count(1);
		Site.portfolio_gallery.images.set_visible_count(1);
	}

	// create gallery loader
	Site.gallery_loader = new Caracal.Gallery.Loader();
	Site.gallery_loader
			.add_gallery(Site.portfolio_gallery)
			.set_thumbnail_size(350 ,Caracal.Gallery.Constraint.HEIGHT);

	// create click event for loading gallery loader
	var gallery_list = $('section#portfolio ul li a');
	gallery_list.on('click',function(event) {
		event.preventDefault();

		// find gallery id
		var item = $(this);
		var gallery_id = item.data('gallery');

		// highlight current gallery
		gallery_list.not(item).removeClass('active')
		item.addClass('active');

		Site.gallery_loader.load_by_group_id(gallery_id);
	});
};


// connect document `load` event with handler function
$(Site.on_load);
