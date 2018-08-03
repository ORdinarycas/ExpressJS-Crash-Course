$( document ).ready(function() {
  $('.deleteUser').click(deleteUser);
});

function deleteUser() {
  var confirmation = confirm('您確定要刪除此帳號？');
  if (confirmation) {
    $.ajax({
      type:'DELETE',
      url:'/users/delete/'+$(this).data('id')
    }).done(function (response) {
      window.location.replace('/');
    });
    window.location.replace('/');
  } else {
    return false;
  }
}