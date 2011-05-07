/*
* jQuery tipIt Plugin v0.1.0
* Copyright 2011, Matthew Mirande
* Dual licensed under the MIT or GPL Version 2 licenses.
* Usage: Provides screen edge-aware tooltips via css class assignment
*/

(function ($) {
  //tracks whether or not we've inserted the tip container
  var hasContainer = false;

  //main plugin logic
  $.fn.tip = function (cfg) {
    //default settings
    //TODO: whatup w/ id & class indicators (e.g. "#" & ".")?
    //should they be added by the script or passed in?
    var settings = {
        id : "tmpl-ToolTip",
        container : "tipContainer",
        content : "tipContent",
        right : "tipR",
        left : "tipL",
        arrowR: "arrowR",
        arrowL: "arrowL",
        delay : 200
      },
      tmpl = "",
      $target = {},
      $win = $(window);

    //update settings w/ any configs set by user
    if (cfg) {
      $.extend(settings, cfg);
    }

    //insert container template if needed
    if (!hasContainer) {
      tmpl = '<div id="' + settings.id + '" ';
      tmpl += 'class="' + settings.container + '">';
      tmpl += '<span class="' + settings.arrowR + '"></span>';
      tmpl += '<span class="' + settings.content + '">I am a tooltip!</span>';
      tmpl += '<span class="' + settings.arrowL + '"></span>';
      tmpl += '</div>';

      $("body").append(tmpl);

      hasContainer = true;
    }

    $target = $("#" + settings.id);

    return this.each(function () {

      var $this = $(this),
          styles = "",
          tipCopy = $this.data("tip"),
          timeoutID = null,
          cssClass = "";

      //setup event listeners
      //if there's tooltip content to display
      if (tipCopy) {
        //TODO: figure out how to use "delegate" instead
        $this.bind("mouseover mouseout", function (e) {
          if (e.type === "mouseover") {
            showTip();
          } else {
            hideTip();
          }
        });
      }

      function showTip() {
        var winWidth = $win.width(),
            elemPos = $this.offset(),
            scrollPos = $win.scrollTop(),
            elemW = $this.outerWidth(),
            elemH = $this.outerHeight(),
            //TODO: what if tip length is less than 100px?
            isOffscreen = winWidth < (elemPos.left + elemW + 100) ? true : false,
            cssTopVal = ((elemPos.top - scrollPos) + ((elemH / 2) - 10)) + "px",
            cssLeftVal = (elemPos.left + elemW + 15) + "px",
            cssRightVal = (winWidth - elemPos.left + 15) + "px",
            cssObj = {};

        if (isOffscreen) {
          cssObj = {
            "top": cssTopVal,
            "right": cssRightVal
          };
          cssClass = settings.left;
        } else {
          cssObj = {
            "top": cssTopVal,
            "left": cssLeftVal
          };
          cssClass = settings.right;
        }

        if (timeoutID) {
          clearTimeout(timeoutID);
        }
        timeoutID = setTimeout(function () {
          $target
            .css(cssObj)
            .addClass(cssClass)
            .find("." + settings.content)
            .text(tipCopy);
        }, settings.delay);
      };

      function hideTip() {
        clearTimeout(timeoutID);
        $target
          .css({"right":"","left":""})
          .removeClass(cssClass);
      };
    });
  };
})(jQuery);
