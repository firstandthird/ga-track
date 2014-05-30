
//ga stub
window._gaq = {
  data: null,
  clear: function() {
    this.data = [];
  },
  push: function(arr) {
    this.data.push(arr);
  }
};

suite('ga-track', function() {

  setup(function() {
    window._gaq.clear();
  });

  test('ga-track plugin exists', function() {
    var el = $('#fixture');
    assert.equal(typeof el.gaTrack, 'function');
  });

  test('returns el', function() {
    var el = $('#link1').gaTrack();
    assert.equal(el.length, 1);
    el.off('click');
  });

  test('call jquery plugin', function() {
    $('#link1')
    //call plugin
      .gaTrack()
    //simulate click
      .click();

    var data = window._gaq.data;
    assert.equal(data.length, 1);
    assert.equal(data[0][0], '_trackEvent');
    assert.equal(data[0][1], 'ga-track');
    assert.equal(data[0][2], 'Click Me');
    assert.equal(data[0][3], '#test');
  });

  test('call jquery plugin with options', function() {
    $('#link1a')
    //call plugin
      .gaTrack({ category: 'category', label: 'label', action: 'action' })
    //simulate click
      .click();

    var data = window._gaq.data;
    assert.equal(data.length, 1);
    assert.equal(data[0][0], '_trackEvent');
    assert.equal(data[0][1], 'category');
    assert.equal(data[0][2], 'action');
    assert.equal(data[0][3], 'label');
  });

  test('data-api with defaults', function(done) {
    $(function() {
      $('#link2').click();
      var data = window._gaq.data;
      assert.equal(data.length, 1);
      assert.equal(data[0][0], '_trackEvent');
      assert.equal(data[0][1], 'ga-track');
      assert.equal(data[0][2], 'Click Me');
      assert.equal(data[0][3], '#test');
      done();
    });

  });

  test('data-api override category', function() {
    $('#link3').click();

    var data = window._gaq.data;
    assert.equal(data.length, 1);
    assert.equal(data[0][0], '_trackEvent');
    assert.equal(data[0][1], 'category');
    assert.equal(data[0][2], 'Click Me');
    assert.equal(data[0][3], '#test');
  });

  test('data-api override label', function() {
    $('#link4').click();

    var data = window._gaq.data;
    assert.equal(data.length, 1);
    assert.equal(data[0][0], '_trackEvent');
    assert.equal(data[0][1], 'ga-track');
    assert.equal(data[0][2], 'Click Me');
    assert.equal(data[0][3], 'label');
  });

  test('data-api override action', function() {
    $('#link5').click();

    var data = window._gaq.data;
    assert.equal(data.length, 1);
    assert.equal(data[0][0], '_trackEvent');
    assert.equal(data[0][1], 'ga-track');
    assert.equal(data[0][2], 'action');
    assert.equal(data[0][3], '#test');
  });
});
