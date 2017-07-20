$(document).ready(function(){
  
  //label for inputs
  $('.input-item input, .input-item textarea').each(function(){
    $(this).focusin(function(){
      $(this).addClass('is-active');
      $(this).addClass('is-focused');
    });
    $(this).focusout(function(){
      $(this).removeClass('is-focused');
      if ($(this).val() === ''){
        $(this).removeClass('is-active');
      }
    })
  });
  
  //custom select
  $('.input-item select').each(function(){
    var that = $(this);
    
    var selectName = $(this).data('name');
    
    //на всякий случай добавляем в обычный селект его название как опцию
    if (selectName.length){
      $(this).prepend('<option selected disabled>' + selectName + '</option>');
    }
    
    $(this).hide();
    
    $(this).wrap('<div class="custom-select"></div>');
    var wrapper = $(this).parent();
    wrapper.append('<div class="custom-select__button">' + selectName + '</div>');
    wrapper.append('<div class="custom-select__container"></div');
    
    var container = wrapper.find('.custom-select__container');
    $(this).find('option').each(function(){
      if (!$(this).is(':disabled')){
        container.append('<div class="custom-select__option">' + $(this).val() + '</div>')
      }
    });
    
    var button = wrapper.find('.custom-select__button');
    button.click(function(){
      wrapper.toggleClass('is-active')
    });
    
    var option = wrapper.find('.custom-select__option');
    option.click(function(){
      that.find('option')
        .eq($(this).index() + 1)
        .prop('selected', true);
      wrapper.removeClass('is-active');
      button.text($(this).text());
    })
  });
  
  $(document).click(function(e){
    if (!e.target.closest('.custom-select')){
      $('.custom-select').each(function(){
        $(this).removeClass('is-active')
      })
    }
  });
});