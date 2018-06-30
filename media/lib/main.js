void function() {
  function each(list, f) {
    for (var i = 0; i < list.length; ++i) {
      f(list[i]);
    }
  }

  function endsWith(a, b) {
    return a.lastIndexOf(b) === a.length - b.length;
  }

  // Handles language tabs
  var tabs = document.querySelectorAll('.tabs a');
  each(tabs, function (item) {
    item.addEventListener('click', function(event) {
      event.preventDefault();

      var language = item.href.replace(/^[^#]*#/, '');
      each(tabs, function(tab) {
        if (endsWith(tab.href, '#' + language)) {
          tab.className = 'active';
        } else {
          tab.className = '';
        }
      });

      each(document.querySelectorAll('div[data-language]'), function(tab) {
        if (tab.getAttribute('data-language') === language) {
          tab.className = 'active';
        } else {
          tab.className = '';
        }
      });

      item.scrollIntoView();
    });
  });

}();
