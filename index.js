!function() {
	if (typeof module === "object" && module.exports) { 
		var Raphael = require("raphael");
    } else {
    	// assume Raphael is already include in DOM
    	var Raphael = window.Raphael;
   	}

	Raphael.fn.star = function(x, y, r) {
	    // start at the top point
	    var path = "M" + x + "," + (y - r);
	    
	    // let's draw this the way we might by hand, by connecting each point the one two-fifths of the way around the clock
	    for (var c = 0; c < 6; c += 1) {
	        var angle = 270 + c * 144,
	            rx = x + r * Math.cos(angle * Math.PI / 180),
	            ry = y + r * Math.sin(angle * Math.PI / 180);

	        path += "L" + rx  + "," + ry;
	    }    
	   
	    return this.path(path).attr("fill", "white").attr("stroke-width", 0);
	}

	var makeFlag = function(container_id) {
		var width = document.getElementById(container_id).offsetWidth;

		var FLY = width,
		 	HOIST = FLY / 1.9,
			STRIPE = HOIST / 13,
			RED = "#B22234",
			BLUE = "#3C3B6E",
			WHITE = "#FFFFFF";

		var paper = Raphael(container_id, FLY, HOIST);

		//stripes
		for (var i = 0; i < 13; i += 1) {
			paper.rect(0, STRIPE * i, FLY, STRIPE)
		      .attr("fill", i % 2 == 0 ? RED : WHITE); 
		}

		//canton
		paper.rect(0, 0, FLY * 0.4, STRIPE * 7)
			.attr("fill", BLUE); 

		var stars = paper.set();

		// the current flag is just an abstraction of the N-flag. See https://jsfiddle.net/raphaeljs/66Xyp/
		var rows = 9;
		var count = 6;

	    spacing_y = STRIPE * 7 / (rows * 2 + 2);
	    spacing_x = FLY * 0.4 / (count * 2);

		var drawRow = function(y, count, offset) {  
		    for (var c = 0; c < count; c += 1) {
		        // add the star to the set
		        stars.push(paper.star(
		            spacing_x * (2 * c + 1 + offset),
		            y,
		            FLY * 0.012
		        ));
		    }
		};
	    
	    for (var r = 0; r < rows; r += 1) {
	        var y = spacing_y * (2 * r + 2);
            if (r % 2 == 0) {
                drawRow(y, count, 0);        
            } else {
                drawRow(y, count-1, 1);                                
            }
	    }   

		// method for animating `N` stars at one per `interval` ms, fading in over fade_in ms
		return {
			animate: function(N, interval, fade_in) {
				stars.attr("opacity", 0);
				var animation = Raphael.animation({
					opacity: 1
				}, fade_in);

				stars.items.forEach(function(star, s) {
					if (s < N) {
						setTimeout(function() {
							star.animate(animation);
						}, s * interval);
					}
				});
			}
		}
	}

	// if browserify
	if (typeof module === "object" && module.exports) {
	    module.exports = makeFlag;
	} else window.makeFlag = makeFlag;   
}();