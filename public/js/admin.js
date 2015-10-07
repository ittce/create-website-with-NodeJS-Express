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
});