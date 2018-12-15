jQuery(function ($) {
  $("#topbar-open").click(function () {
    function getCookie(name) {
      var cookieValue = null;
      if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
          var cookie = jQuery.trim(cookies[i]);
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) == (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }

    var csrftoken = getCookie('csrftoken')
    function csrfSafeMethod(method) {
      // these HTTP methods do not require CSRF protection
      return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    $.ajaxSetup({
      crossDomain: false, // obviates need for sameOrigin test
      beforeSend: function (xhr, settings) {
        if (!csrfSafeMethod(settings.type)) {
          xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
      }
    });


    var $btn = $(this);
    openModal($btn);

    // $.ajax({
    //   type: $btn.attr('method'),
    //   url: $btn.attr('action'),
    //   // data: { 'graph_name': graphName, 'data': myJSON },
    //   // traditional: true,
    //   success: function (ret) {
    //     console.log(ret);
    //     openModal($btn);
    //   },
    //   error: function (xhr, ajaxOptions, thrownError) {
    //     alert(thrownError);
    //   }
    // });
  });
});

// get list of graph names from back end
var graphNameList = ["1", "2", "3"];

function openModal(btn) {
  var modal = document.getElementById('myModal');

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal 
  btn.onclick = function () {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}
