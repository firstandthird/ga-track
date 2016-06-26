/*global assert,test,suite,setup*/

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

var gaData = [];
window.ga = function() {
  gaData = arguments;
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

  test('api exists', function() {
    assert.equal(typeof $.gaTrack, 'function');
  });

  test('scroll', function(done) {
    var timer = 600;
    $('#fixture').show();
    $(window).unbind('scroll');
    $.gaTrackScroll();

    $('html, body').scrollTop(0).animate({scrollTop: 5000}, timer);


    setTimeout(function() {
      assert.equal(window._gaq.data.length, 5);
      $('#fixture').hide();
      done();
    }, timer);

  });

  test('cancel clicks', function(done) {
    $('#link7').click();

    setTimeout(function() {
      assert.ok(window.location.hash !== '#testclick');
      done();
    }, 600);
  });

  test('$.gaTrack.prefix for categories', function() {
    $.gaTrack.prefix = 'prefix';
    $('#link8').click();

    var data = window._gaq.data;
    assert.equal(data.length, 1);
    assert.equal(data[0][0], '_trackEvent');
    assert.equal(data[0][1], 'prefix-category');
    assert.equal(data[0][2], 'action');
    assert.equal(data[0][3], 'label');
    $.gaTrack.prefix = null;
  });

  test('$.gaTrack.autoTracking() returns list of events being tracked', function() {
    var tracking = $.gaTrack.autoTracking();
    assert.equal(tracking.length, 7);
    assert.equal(tracking[0].action, 'Click Me');
    assert.equal(tracking[0].category, 'ga-track');
    assert.equal(tracking[0].label, '#test');
    assert.equal(typeof tracking[0].el, 'object');
  });

  // These tests need to be last since it removed the window._gaq object
  suite('universal tracking', function() {
    setup(function() {
      delete window._gaq;
    });

    test('should use universal tracking', function() {
      var el = $('#link6').gaTrack();
      $('#link6').click();

      var data = gaData;
      console.log(data);
      assert.equal(data.length, 5);
      assert.equal(data[0], 'send');
      assert.equal(data[1], 'event');
      assert.equal(data[2], 'ga-track');
      assert.equal(data[3], 'action');
      assert.equal(data[4], '#test');
    });
  });
});
