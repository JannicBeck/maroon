---
layout: post
title:  "Welcome to Jekyll!"
date:   2014-04-06 15:40:56
categories: jekyll update
---

You'll find this post in your `_posts` directory - edit this post and re-build (or run with the `-w` switch) to see your changes!
To add new posts, simply add a file in the `_posts` directory that follows the convention: YYYY-MM-DD-name-of-post.ext.

Jekyll also offers powerful support for code snippets:

{% highlight javascript %}
var myCalendar = new Calendar({
			timespan: [2016, 2020],
			nrows: 5,
			startOfWeek: 1, // 1 means start week on monday
		}).launch({
			$template: $template,
			$calendar: $calendar,
			// locale: 'de',
			// title: 'My Awesome Calendar',
			months: ['Januaro', 'Februaro', 'Marto', 'Aprilo',
			            'Majo', 'Junio', 'Julio', 'Aŭgusto',
			            'Septembro', 'Oktobro', 'Novembro', 'Decembro'],
			weekdays: ['Lundo', 'Mardo', 'Merkredo', 'Ĵaŭdo', 'Vendredo', 'Sabato', 'Dimanĉo']
			// weekdays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
		});
{% endhighlight %}

Check out the [Jekyll docs][jekyll] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll's GitHub repo][jekyll-gh].

[jekyll-gh]: https://github.com/mojombo/jekyll
[jekyll]:    http://jekyllrb.com
