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
	var scroll_position = window.scrollY;
	var size = 800;
	var opacity = null;

	if(scroll_position < Site.start_position) {
		opacity = 0;
		Site.trigger_element.css({
			'position': 'fixed',
			'top': '90px'
		});

	} else if(scroll_position > Site.end_position) {
		opacity = 1;
		Site.logo_elements.css({
			'position': 'absolute',
			'top': '0px'
		});

	} else {
		opacity = (scroll_position - Site.start_position) / size;
		Site.logo_elements.css({
			'position': 'fixed',
			'top': '90px'
		});
	}

	Site.trigger_element.css('opacity', opacity);
}

/**
 * Function called when document and images have been completely loaded.
 */
Site.on_load = function() {

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
		.images.set_spacing(20)
		.images.update();

	// create slider for portfolio gallery
	Site.portfolio_gallery = new Caracal.Gallery.Slider();
	Site.portfolio_gallery
		.controls.attach_next($('div.controls a.next'))
		.controls.attach_previous($('div.controls a.previous'))
		.images.set_container(' div.gallery')
		.images.add('div.gallery a.portfolio')
		.images.set_visible_count(3)
		.images.set_center(true)
		.images.set_spacing(20)
		.images.update();

	if(!Site.is_mobile()) {
		// create lightbox object for client logos images
		Site.logo_lightbox = new LightBox('a.image', false, false, true);

		// create lightbox object for portfolio gallery images
		Site.portfolio_lightbox = new LightBox('a.portfolio', false, false, true);

		Site.logo_elements = $('img.logo');
		Site.logo_elements.css({
			'position': 'fixed',
			'top': '90px'
		});

		Site.trigger_element = $('section#services img.logo');
		Site.trigger_element.css('opacity', 0);
		Site.start_position = Site.logo_elements.offset().top;
		Site.end_position = $('section#services').offset().top - 100;
		// create handler for scroll event
		$(window).on('scroll', Site.handle_scroll);
	}

	if(Site.is_mobile()) {
		Site.client_gallery.images.set_visible_count(1);
		Site.portfolio_gallery.images.set_visible_count(1);
	}

	/**
	 * Constructor function for gallery images 
	 */
	function make_image(data) {
		var link = $('<a>');
		link
			.attr('href', data.image)
			.addClass("portfolio")

		var thumbnail = $('<img>').appendTo(link);
		thumbnail
			.attr('src', data.thumbnail)
			.attr('alt', data.title)

		var information = $('<div class="information">').appendTo(link);
		var title = $('<h4>').appendTo(information);
		title
			.text(data.title);
		var para = $(data.description).appendTo(information);

		return link;
	}

	/**
	 * Callback function after images are loaded
	 */
	function image_loaded() {
		Site.portfolio_lightbox = new LightBox('a.portfolio', false, false, true);
		Site.portfolio_gallery.images.update();
	}

	/**
	 * create gallery loader
	 */
	Site.gallery_loader = new Caracal.Gallery.Loader();
	Site.gallery_loader
			.add_gallery(Site.portfolio_gallery)
			.set_constructor(make_image)
			.set_thumbnail_size(350 ,Caracal.Gallery.Constraint.HEIGHT)
			.add_callback(image_loaded)

	/**
	 * create click event for loading gallery loader
	 */
	var gallery_list = $('section#portfolio ul li a');
	gallery_list.on('click',function(event) {
		event.preventDefault();
		var item = $(this);
		gallery_list.not(item).removeClass('active')
		var gallery_id = item.data('gallery');
		Site.gallery_loader.load_by_group_id(gallery_id);
		item.addClass('active');
	});
};


// connect document `load` event with handler function
$(Site.on_load);
