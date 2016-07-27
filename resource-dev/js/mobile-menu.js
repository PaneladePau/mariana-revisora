'use strict';

function mobileMenu() {

  $('.mobile-menu-icon').toggleClass('open');
  $('.mobile-menu').toggleClass('open');
  $('body').toggleClass('menu-open');

}

$('.mobile-menu-icon')
  .on('click', mobileMenu);

$('.mobile-menu a')
  .on('click', mobileMenu);