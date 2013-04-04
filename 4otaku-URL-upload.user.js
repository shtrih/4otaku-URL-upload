// ==UserScript==
// @name           4otaku-URL-upload
// @description    Script which add image URL field to image upload form (http://4otaku.org/art/)
// @author         shtrih (akashtrih@hitagi.ru)
// @include        http://4otaku.org/art/*
// @version        1.1
// @history        2013.04.03 1.1  Увеличена производительность за счет замены обработчиков DOMNodeInserted и DOMNodeRemoved на MutationObserver.
// @history        2013.04.02 1.0  
// ==/UserScript==
// http://wiki.4otaku.org/Api:%D0%94%D0%BE%D0%B1%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5:%D0%90%D1%80%D1%82

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
    element = $('#add_form'),
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
						type:     "POST",
						data:     $this.serialize() + '&format=json',
						success:  function (data) {
							if (data.id)
								document.location.href = 'http://4otaku.org/art/' + Number(data.id);
						},
						error:    function (jqXHR, textStatus, errorThrown) {
							alert("Ошибка " + textStatus + ': ' + errorThrown);
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
}