
0.11.0 / 2016-06-26
==================

  * removed console.log from test
  * added test for autoTracking
  * expose $.gaTrack.autoTracking() to return what is currently being tracked on page
  * create getDataFromElement function so it can be reused

0.10.1 / 2016-01-29
==================

  * moved category prefix to before debug output

0.10.0 / 2016-01-29
==================

  * added $.gaTrack.prefix to prefix all categories

0.9.0 / 2015-09-14
==================

  * if debug, continue and track in ga

0.8.0 / 2015-03-03
==================

  * if target == _blank, don't preventDefault and open window


0.7.0 / 2015-03-03
==================

  * Bit better href overrides
  * Added ability to cancel out link (for social buttons, etc).

0.6.0 / 2015-02-11
==================

  * Added support for targets.

0.5.0 / 2014-12-12 
==================

  * added $.gaTrack.defaults to tweak delay
  * better checking for existing of ga
  * updated example to use universal analytics

0.4.1 / 2014-12-11 
==================

  * check if href

0.4.0 / 2014-12-08 
==================

  * added $.gaTrack.debug that will console log tracking messages

0.3.0 / 2014-12-08 
==================

  * Added scroll tracking.

0.2.0 / 2014-06-04 
==================

	* renamed to ga-track
  * fixed broken tests
  * Merge pull request #6 from firstandthird/feature/updates
  * Added access to $.gaTrack
  * Added universal analytics support.
  * Added check for which mouse click.
  * Renamed and updated tests/examples
  * Updated build scripts.

0.1.1 / 2013-05-02 
==================

  * check if metaKey is pressed and preventDefault if it isn't
  * updated grunt connect hostname to 0.0.0.0
  * removed makefile

0.1.0 / 2013-04-08 
==================

  * complete rewrite
  * built
  * v0.0.1 - initial commit
