
/**
 */
(function () {
	"use strict";

		var init,_bindResizeObservers, _loadScript, _observeResizes;

		/**
		 *	Initialise listeners and setup
		 */
		init = function () {
			_bindResizeObservers();
		};

		/**
		 * Load a script relative to the root of the domain
		 */
		_loadScript = function(src, done) {
			var js = document.createElement('script');
			js.src = location.protocol + '//' + location.host + "/" + src;
			js.onload = done;
			document.head.appendChild(js);
		}

		/**
		 * Add ResizeObserver listener
		 */
		_observeResizes = function (scope){
			// Only run if ResizeObserver is supported and the users device is not mobile
			if ("ResizeObserver" in self) {
				// Create a single ResizeObserver instance to handle all
				// container elements. The instance is created with a callback,
				// which is invoked as soon as an element is observed as well
				// as any time that element's size changes.
				var ro = new ResizeObserver(function (entries) {
					// Default breakpoints that should apply to all observed
					// elements that don't define their own custom breakpoints.
					var defaultBreakpoints = { SM: 360, MD: 576, LG: 768, XL: 960 };

					entries.forEach(function (entry) {
						// If breakpoints are defined on the observed element,
						// use them. Otherwise use the defaults.
						var breakpoints = entry.target.dataset.breakpoints
							? JSON.parse(entry.target.dataset.breakpoints)
							: defaultBreakpoints;

						// Update the matching breakpoints on the observed element.
						Object.keys(breakpoints).forEach(function (breakpoint) {
							var minWidth = breakpoints[breakpoint];
							if (entry.contentRect.width >= minWidth) {
								entry.target.classList.add(breakpoint);
							} else {
								entry.target.classList.remove(breakpoint);
							}
						});
					});
				});

				// Find all elements with the `data-observe-resizes` attribute
				// and start observing them.
				var elements = scope.querySelectorAll("[data-observe-resizes]");
				for (var element, i = 0; (element = elements[i]); i++) {
					ro.observe(element);
				}
			} 
		}

		/**
		 * Add ResizeObserver listeners
		 */
		_bindResizeObservers = function (scope) {
			var scope = (scope && scope[0]) || document;

			// Check that the browser supports ResizeObserver
			if(window.ResizeObserver){
				_observeResizes(scope);
			} else {
				//If not load the polyfill
				_loadScript('polyfills/resize-observer-polyfill.min.js', function(){_observeResizes(scope)});
			}
		};
			
  init()
	
})();
