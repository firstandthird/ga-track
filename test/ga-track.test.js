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

  test('debug', function(done) {
    $('#link1')
      .click();

    var data = window._gaq.data;
    assert.equal(data.length, 1);
    window._gaq.clear();
    assert.equal(window._gaq.data.length, 0);
    $.gaTrack.debug = true;

    $('#link1')
      .gaTrack()
      .click();

    data = window._gaq.data;
    assert.equal(data.length, 0);
    $.gaTrack.debug = false;
    done();
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
