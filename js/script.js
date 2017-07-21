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
    
    //на всякий случай добавляем в обычный селект его название как опцию вместо лейбла
    if (selectName.length){
      $(this).prepend('<option selected disabled>' + selectName + '</option>');
    }
    
    //скрываем исходный селект и формируем кастомный
    $(this).hide();    
    $(this).wrap('<div class="custom-select"></div>');
    var wrapper = $(this).parent();
    wrapper.append('<div class="custom-select__button">' + selectName + '</div>');
    wrapper.append('<div class="custom-select__container"></div');
    
    var container = wrapper.find('.custom-select__container');
    $(this).find('option').each(function(){
      if (!$(this).is(':disabled')){
        container.append('<div class="custom-select__option">' + $(this).text() + '</div>')
      }
    });
    
    var button = wrapper.find('.custom-select__button');
    button.click(function(){
      wrapper.toggleClass('is-active')
    });
    
    //связываем кастомный селект с исходным
    var option = wrapper.find('.custom-select__option');
    option.click(function(){
      that.find('option')
        .eq($(this).index() + 1)
        .prop('selected', true);
      wrapper.removeClass('is-active');
      button.text($(this).text());
    })
  });
  
  //скрываем селект если кликнули за его пределы
  $(document).click(function(e){
    if (!e.target.closest('.custom-select')){
      $('.custom-select').each(function(){
        $(this).removeClass('is-active')
      })
    }
  });
  
  
  
  //frontend часть
  
  
  //событие отправки формы
  var carForm = $('.car-filter form');
  carForm.on('submit', function(e){
    e.preventDefault();    
    
    var formData = $(this).serializeArray();
    
    //создаем такой же объект как в json
    var newCar = {};
    for (var i = 0; i < formData.length; i++){
      var key;
      switch(formData[i].name){
        case 'car-filter-name': 
          key = 'title';
          break;
        case 'car-filter-price': 
          key = 'price';
          break;
        case 'car-filter-year': 
          key = 'year';
          break;
        case 'car-filter-description': 
          key = 'description';
          break;
        case 'car-color': 
          key = 'color';
          break;
        case 'car-filter-status': 
          key = 'status';
      }      
      newCar[key] = formData[i].value;
    };
    
    addCar(newCar);
    
    //очищаем форму
    $(this).trigger('reset');
    $(this).find('.input-item input, .input-item textarea').each(function(){
      $(this).removeClass('is-active');
    });
    $(this).find('.custom-select').each(function(){
      $(this).find('.custom-select__button').text($(this).find('select').data('name'))
    });    
  });
  
  //очищаем таблицу от статики
  var carTable = $('.car-table .table');
  carTable.find('.tr').each(function(){
    if(!$(this).hasClass('thead')){
      $(this).remove();
    }
  });
  
  //формируем объекты из json
  var src = 'https://rawgit.com/Varinetz/e6cbadec972e76a340c41a65fcc2a6b3/raw/90191826a3bac2ff0761040ed1d95c59f14eaf26/frontend_test_table.json';
  
  $.getJSON(src, function(data){
    $.each(data, function(key, car){
      addCar(car);
    });
  });
  
  var carIdArray = [];
  
  //функция для генерации id
  var getRandom = function(array){
    var number;
    do { 
        number = Math.floor(Math.random() * 1000000); 
    } while ($.inArray(number, array) > -1);
    return number;
  };
  
  //функция добавления элемента таблицы
  var addCar = function(car){
    var carId;
    if (car.id){
      carId = car.id;
    } else {
      carId = getRandom(carIdArray);
    };   
    
    carId = 'car-id-' + carId;
    
    carIdArray.push(carId);
    
    var carColor, carColorClass;
    switch(car.color){
      case 'red': 
        carColor = 'Красный';
        carColorClass = 'car-table__color--red';
        break;
      case 'white': 
        carColor = 'Белый';
        carColorClass = 'car-table__color--white';
        break;
      case 'black': 
        carColor = 'Черный';
        carColorClass = 'car-table__color--black';
        break;
      case 'green': 
        carColor = 'Зеленый';
        carColorClass = 'car-table__color--green';
        break;
        case 'grey': 
        carColor = 'Серый';
        carColorClass = 'car-table__color--grey';
        break;        
      default:
        carColor = 'Неизестно';
        carColorClass = 'car-table__color--mystery';
    }
    
    var carStatus;
    switch(car.status){
      case 'pednding': 
        carStatus = 'Ожидается';
        break;
      case 'out_of_stock': 
        carStatus = 'Нет в наличии';
        break;
      case 'in_stock': 
        carStatus = 'В наличии';
        break;
      default:
        carStatus = 'Неизестно';
    }
    
    var carPrice = car.price;
    if (carPrice === ''){
      carPrice = 0;
    };
    //с помощью регулярного выражения делаем формат цены
    carPrice = carPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' руб.';
    
    var carYear = car.year;
    if (carYear === ''){
      carYear = 'Неизвестно';
    };
    
    var carTitle = car.title;
    if (carTitle === ''){
      carTitle = 'Без названия';
    };
    
    //формируем верстку
    var template = 
      '<div id="' + carId + '" class="tr">' +
        '<div class="td">' +
          '<div class="car-table__title">' + carTitle + '</div>';
    
    if (!car.description == ''){
      template += '<div class="car-table__description">' + car.description + '</div>';
    }
    
    template += 
      '</div>' +
      '<div class="td td--year">' + carYear + '</div>' +
      '<div class="td td--color">' +
        '<span class="car-table__color ' + carColorClass + '">' + carColor + '</span>' +
      '</div>' +
      '<div class="td td--status">' + carStatus + '</div>' +
      '<div class="td td--price">' + carPrice + '</div>' +
      '<div class="td td--delete">' +
        '<button>Удалить</button>' +
      '</div>' +
    '</div>';
    
    carTable.append(template);
  };
  
  
  //удаление из таблицы 
  $('body').on('click', '.td--delete button', function(){
    var id = $(this).closest('.tr').prop('id');
    $('#' + id).remove();
    for (var i = 0; i < carIdArray.length; i++){
      if (id === carIdArray[i]){
        carIdArray.splice(i, 1);
      }
    }
  });
});