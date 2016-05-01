/* global ScrollMagic, TweenMax, TimelineMax, Linear */

import Ember from 'ember';

export default Ember.Component.extend({

    didInsertElement: function () {

        if (this.get('type') === 1) {
            //
            this.resizeMenuSvg(null, true);
            //
            this.$(window).on('scroll', { scope: this }, this.resizeMenuSvg);
        }

        if (this.get('type') === 2) {
            var $word = this.$("path#word"),
        	    $dot = this.$("path#dot"),
                controller = new ScrollMagic.Controller(),
                tween,
                scene;

        	// prepare SVG
        	this.pathPrepare($word);
        	this.pathPrepare($dot);

        	// build tween
        	tween = new TimelineMax()
        		.add(TweenMax.to($word, 0.9, {strokeDashoffset: 0, ease:Linear.easeNone})) // draw word for 0.9
        		.add(TweenMax.to($dot, 0.1, {strokeDashoffset: 0, ease:Linear.easeNone}))  // draw dot for 0.1
        		.add(TweenMax.to("path", 1, {stroke: "#33629c", ease:Linear.easeNone}), 0);			// change color during the whole thing

        	// build scene
        	scene = new ScrollMagic.Scene({triggerElement: "#trigger1",triggerHook: 'onEnter', offset: 200, duration: 200, tweenChanges: true})
        			.setTween(tween)
        			//.addIndicators() // add indicators (requires plugin)
        			.addTo(controller);
        }
    },

    resizeMenuSvg: function (event, init) {
        var component = (event) ? event.data.scope : this,
            box = component.$('#topbox'),
            scrollTop = component.$(window).scrollTop(),
            topboxRightY = 250 - scrollTop;

        if (scrollTop >= 0 && scrollTop <= 150) {
            box.attr('points', '0,0,1600,0,1600,' + topboxRightY + ',0,100');
        } else if (init === true) {
            box.attr('points', '0,0,1600,0,1600,250,0,100');
        }
    },

    pathPrepare: function ($el) {
        var lineLength = $el[0].getTotalLength();

        $el.css("stroke-dasharray", lineLength);
        $el.css("stroke-dashoffset", lineLength);

        return $el;
    }

});
