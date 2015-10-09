$(function () {
  $('.del').click(function (e) {
    var target = $(e.target);
    var id = target.data('id');
    var tr = $('.item-id-' + id);
    var href = window.location.href;
    var listType = href.indexOf('userlist') !== -1 ? 'userlist' : 'list';

    $.ajax({
      type: 'DELETE',
      url : '/admin/' + listType + '?id=' + id
    }).done(function (results) {
      if (results.success === 1) {
        if (tr.length > 0) {
          tr.remove();
        }
      }
    });
  });

  $('#douban').blur(function () {
    var douban = $(this);
    var id = douban.val();

    $.ajax({
      url: 'https://api.douban.com/v2/movie/subject/' + id,
      cache: true,
      type: 'get',
      dataType: 'jsonp',
      crossDomain: true,
      jsonp: 'callback',
      success: function (data) {
       $('#inputTitle').val(data.title);
       $('#inputDoctor').val(data.directors[0].name);
       $('#inputCountry').val(data.countries[0]);
       $('#inputLanguage').val(data.language || '');
       $('#inputPoster').val(data.images.large);
       $('#inputYear').val(data.year);
       $('#inputSummary').val(data.summary);
      }
    });
  });
});