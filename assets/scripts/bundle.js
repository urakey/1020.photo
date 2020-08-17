'use strict';

require('./plugins/jquery.smoothScroll');

(function($){

  var Browser = require('./modules/Browser');

  //===========================================================================
  //  関数
  //===========================================================================

  /**
   * 初期読み込み時の実行処理まとめ
   */
  function init()
  {
    $('a[href^="#"]').smoothScroll({
      play: -40,
      duration: 500,
      easing: 'easeOutQuad',
      withHash: false
    });

    $('.Lazy').lazyload({
      effect: 'fadeIn',
      threshold: 200
    });

  }

  //===========================================================================
  //  処理
  //===========================================================================

  /**
   * document 実行処理
   */

  $(document).ready(function(){
    init();
  });

  //===========================================================================
  //  Easing
  //===========================================================================

  /**
   * Easing: easeOutQuad
   */
  $.extend(jQuery.easing,{
    easeOutQuad: function (x, t, b, c, d) {
      return -c *(t/=d)*(t-2) + b;
    }
  });

})(jQuery);

require('./modules/Particles');
