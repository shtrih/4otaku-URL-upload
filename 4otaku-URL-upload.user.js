// ==UserScript==
// @name           4otaku-URL-upload
// @description    Script which add image URL field to image upload form (http://4otaku.org/art/)
// @author         shtrih (shtrih@hitagi.ru)
// @include        http://4otaku.org/art/*
// @version        1.0
// ==/UserScript==
// http://wiki.4otaku.org/Api:%D0%94%D0%BE%D0%B1%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5:%D0%90%D1%80%D1%82
// http://stackoverflow.com/questions/4979738/fire-jquery-event-on-div-change

var ev_count = 0, // так как вызывается туча одинаковых ивентов, то мы реагируем только на первый
	API_URL = 'http://4otaku.org/api/create/art';

$('#add_form')
	.live('onloadaddform', function (event) {
		$(event.currentTarget).find('tr').eq(0).after(
			'<tr><td class="input field_name">Загрузить изображение по URL</td><td class="inputdata"><input style="width:65%;" type="url" name="image" placeholder="http://" /></td></tr>'
		);
	})
	.live('DOMNodeInserted', onFormInserted)
	;//.bind('DOMNodeRemoved', onFormUnload);

$('.art_body').delegate('#addform', 'submit', function (event) {
	var $this = $(event.target);

	if ($this.find('input[name="image"]').val()) {
		$.ajax({
			url:      API_URL, 
			type:     "POST",
			data:     $this.serialize() + '&format=json',
			success:  function (data) {
				console.log(data);
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

function onFormInserted(event) {
	if (1 < ev_count++)
		;
	if (ev_count === 1) {
		setTimeout(function() {
			$(event.currentTarget)
				.trigger('onloadaddform')
				.unbind('DOMNodeInserted');
		}, 2500);
	}
}

function onFormUnload(event) {
	ev_count = 0;
	$(event.currentTarget)
		.live('DOMNodeInserted', onFormLoad);
}