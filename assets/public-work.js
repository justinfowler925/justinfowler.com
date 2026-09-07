(function () {
  var controls = Array.from(document.querySelectorAll('[data-public-work-filter]'));
  var cards = Array.from(document.querySelectorAll('[data-public-work-kind]'));
  if (!controls.length || !cards.length) return;

  controls.forEach(function (control) {
    control.addEventListener('click', function () {
      var filter = control.getAttribute('data-public-work-filter');
      controls.forEach(function (item) {
        item.setAttribute('aria-pressed', String(item === control));
      });
      cards.forEach(function (card) {
        card.hidden = filter !== 'all' && card.getAttribute('data-public-work-kind') !== filter;
      });
      var result = document.querySelector('[data-public-work-result]');
      if (result) {
        var count = cards.filter(function (card) { return !card.hidden; }).length;
        result.textContent = count + (filter === 'all' ? ' published items' : ' published ' + filter + (count === 1 ? '' : 's'));
      }
    });
  });
})();
