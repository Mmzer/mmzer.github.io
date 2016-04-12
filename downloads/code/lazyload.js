define([], function() {
	lazyLoad = function() {
		var map_element = {};
		var element_obj = [];
		var download_count = 0;
		var last_offset = -1;
		var doc_body;
		var doc_element;
		var lazy_load_tag;

		function initVar(tags) {
			doc_body = document.body;
			doc_element = document.compatMode == &quot;BackCompat&quot; ? doc_body : document.documentElement;
			lazy_load_tag = tags || [&quot;img&quot;, &quot;iframe&quot;]
		}

		function initElementMap() {
			for (var i = 0, len = lazy_load_tag.length; i &lt; len; i++) {
				var el = document.getElementsByTagName(lazy_load_tag[i]);
				for (var j = 0, len2 = el.length; j &lt; len2; j++) {
					if (typeof el[j] == &quot;object&quot; &amp;&amp; el[j].getAttribute(&quot;rel&quot;)) {
						element_obj.push(el[j])
					}
				}
			}
			for (var i = 0, len = element_obj.length; i &lt; len; i++) {
				var o_img = element_obj[i];
				var t_index = getAbsoluteTop(o_img);
				var o = {
					img_i:i,
					img_obj:o_img
				}
			map_element[t_index] = o;
			download_count++;
				/*if (map_element[t_index]) {
					map_element[t_index].push(i)
				} else {
					var t_array = [];
					t_array[0] = i;
					map_element[t_index] = t_array;
					download_count++
				}*/
			}
		}

		function initDownloadListen() {
			if (!download_count) return;
			var offset = window.MessageEvent &amp;&amp; !document.getBoxObjectFor ? doc_body.scrollTop : doc_element.scrollTop;
			var visio_offset = offset + doc_element.clientHeight;
			if (last_offset == visio_offset) {
				setTimeout(initDownloadListen, 200);
				return;
			}
			last_offset = visio_offset;
			var visio_height = doc_element.clientHeight;
			var img_show_height = visio_height + offset;
			for (var key in map_element) {
				if (img_show_height &gt; key) {
					var o = map_element[key],
						index = o.img_i,
						obj = o.img_obj;

					element_obj[index].src = element_obj[index].getAttribute(&quot;rel&quot;);
					delete map_element[key];
					download_count--;
				}
			}
			setTimeout(initDownloadListen, 200)
		}

		function getAbsoluteTop(element) {
			if (arguments.length != 1 || element == null) {
				return null;
			}
			var offsetTop = element.offsetTop;
			while (element = element.offsetParent) {
				offsetTop += element.offsetTop;
			}
			return offsetTop;
		}

		function init(tags) {
			initVar(tags);
			initElementMap();
			initDownloadListen()
		}

		return {
			init: init
		}
	}();

	return lazyLoad;
});