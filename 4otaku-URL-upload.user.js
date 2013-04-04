// ==UserScript==
// @name           4otaku-URL-upload
// @description    Script which add image URL field to image upload form (http://4otaku.org/art/)
// @author         shtrih (akashtrih@hitagi.ru)
// @include        http://4otaku.org/art/*
// @match          http://4otaku.org/art/*
// @version        1.2
// @history        2013.04.04 1.2  Поддержка работы в Chrome c расширением Tampermonkey v2.12.3124.133, а также работа в Chrome в виде расширения (проверено в Chrome 26).
// @history        2013.04.03 1.1  Увеличена производительность за счет замены обработчиков DOMNodeInserted и DOMNodeRemoved на MutationObserver.
// @history        2013.04.02 1.0  Первая версия работала на Chrome с расширением Blank Canvas Script Handler v0.0.20.
// ==/UserScript==
// http://wiki.4otaku.org/Api:%D0%94%D0%BE%D0%B1%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5:%D0%90%D1%80%D1%82
// http://stackoverflow.com/questions/9515704/building-a-chrome-extension-inject-code-in-a-page-using-a-content-script/9517879#9517879

function scriptBody() {
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
		element = $('#add_form'),
		uploadOverlay = $('<div/>', {
			css: {
				position:'absolute',
				top: '0',
				width: '100%',
				height: '100%',
				background: 'rgba(230, 230, 230, 0.48) url(http://4otaku.org/images/loadingAnimation.gif) no-repeat center center',
				margin: '-11px',
				padding: '11px',
				display: 'none',
				'z-index': '1000'
			}
		}),
		observer = new MutationObserver(function(mutationRecords) {
		mutationRecords.forEach(function(mutation) {
			if (mutation.addedNodes.length) {
				element.find('tr').eq(0).after(
					'<tr><td class="input field_name">Загрузить изображение по URL</td><td class="inputdata"><input style="width:65%;" type="url" name="image" placeholder="http://" /></td></tr>'
				);

				$('.art_body').delegate('#addform', 'submit', function (event) {
					var $this = $(event.target);

					if ($this.find('input[name="image"]').val()) {
						$.ajax({
							url:      'http://4otaku.org/api/create/art',
							type:     'POST',
							data:     $this.serialize() + '&format=json',
							beforeSend: function () {
								$('#addform', element).append(uploadOverlay.fadeIn());
							},
							success:  function (data) {
								if (data.id) 
									document.location.href = 'http://4otaku.org/art/' + Number(data.id);
							},
							error:    function (jqXHR, textStatus, errorThrown) {
								alert("Ошибка " + textStatus + ': ' + errorThrown);
								uploadOverlay.hide();
							},
							dataType: 'json'
						});

						return false;
					}
				});
			}
	 	});  
	});
	if (element.length) {
		observer.observe(element[0], {
			childList: true,  // include information childNode insertion/removals
		});
	};
}

var script = document.createElement('script');
script.textContent = '(' + scriptBody.toString() + ')()';
(document.head||document.documentElement).appendChild(script);
script.parentNode.removeChild(script);