'use strict';

function sobeLabel(elem) {
  var labelFor = elem.attr('id'),
    label = $('label[for="' + labelFor + '"]');
  if (elem.val() === '' || elem.val() === '(__) ____-_____') {
    if (label.hasClass('active')) {
      label.removeClass('active');
    } else {
      label.addClass('active');
    }
  }
}

$('input').on('focus blur', function() {

  sobeLabel($(this));

});

function formSubmit(form) {

  $('body')
    .css('overflow', 'hidden');

  $('.modal')
    .show();

  $('.modal-msg')
    .text('Enviando...');

  var params = {

    '_replyto': $('#email').val(),
    '_subject': 'Pedido de orçamento enviado pelo site',
    'Nome': $('#nome').val(),
    'Mensagem': $('#mensagem').val()

  };

  $.post('https://formspree.io/contato@marianarevisora.com.br', params, function(data) {

    $('.modal-msg')
        .text('Mensagem enviada com sucesso :)');

      $(form)
        .find('input')
        .each(function() {

          $(this)
            .val('');

          sobeLabel($(this));

        });

      $(form)
        .find('textarea')
        .val('');

      setTimeout(function() {

        $('.modal')
          .fadeOut();

        $('body')
          .removeAttr('style');

      }, 4000);

  }, 'json');

}

(function formInit() {

  if ( $('form').length > 0 ) {

    $.validator.addMethod('cselected', $.validator.methods.required );

    $.validator.addMethod('cradio', $.validator.methods.required );

    $.validator.addMethod('cchecked', $.validator.methods.required );

    $.validator.addMethod('cemail', function(value, element) {

      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(value);

    });

    $('form')
      .each(function() {

        $(this)
          .validate({
            errorElement: 'div',
            focusInvalid: false,
            errorClass: 'input-error',
            errorPlacement: function(error, element) {
              return true;
            },
            submitHandler: function(form) {

              formSubmit(form);

            }

          });

      });

  }
})();