// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery.mask
//= require rails-ujs
//= require turbolinks
//= require_tree .
//= require popper
//= require bootstrap

function ready(event) {
  $('#cep').mask('00000-000');
  $('#postal_code').mask('00000-000');
  $('#freight_price').mask('000.000.000.000.000,00', {reverse: true});
  $('#cubed_weight').mask('000.000.000.000.000,00', {reverse: true});
  $('#wish_price').mask('000.000.000.000.000,00', {reverse: true});
  $('#income').mask('000.000.000.000.000,00', {reverse: true});
  $("#simple_search_field").focus();
  $('input[type=radio][name=searchRadio]').change(function() {
    if (this.value === 'simple') {
      $('#simple_search_field').prop("disabled", false);
      $('.advanced_field').prop("disabled", true);
      $('.simple-form').show();
      $('.advanced-form').hide();
    }
    else if (this.value === 'advanced') {
      $('.advanced_field').prop("disabled", false);
      $('#simple_search_field').prop("disabled", true);
      $('.simple-form').hide();
      $('.advanced-form').show();
    }
  });

  $(".modal_btn").on("click", function(e){
    var pg_id = $(this).parent().find(".pg_id").val();
    $("#pg_id_send").val(pg_id)
  });

  $("#calc_freight_btn").on("click", function(e){
    var cep = $('#cep').val();
    var pg_id =  $("#pg_id_send").val();
    $.ajax({
      method: "GET",
      url: "/power_generators/get_freight",
      data: {postal_code: cep, pg_id: pg_id},
      dataType:"json",
      success: function(data, textStatus, jqXHR){
        $("#street").val(data.address)
        $("#neighborhood").val(data.neighborhood)
        $("#city").val(data.city)
        $("#state").val(data.state)
        $("#freight_price").val(data.freight_cost.toFixed(2)).trigger('input');
        $("#cubed_weight").val(data.cubed_weight.toFixed(2)).trigger('input');
        $("#zipcode_notfound_msg").hide();
      },
      error: function(jqXHR, textStatus, errorThrown){
        $("#street").val("")
        $("#neighborhood").val("")
        $("#city").val("")
        $("#state").val("")
        $("#freight_price").val("0,00")
        $("#cubed_weight").val("0,00")
        $("#zipcode_notfound_msg").show();
      }
    });
  });
  $( '#freightModal' ).on("hidden.bs.modal", function(){
    $("#freight_price").val("0,00")
    $("#cubed_weight").val("0,00")
  });
}

$(document).on('turbolinks:load', ready);
