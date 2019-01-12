const user = JSON.parse(sessionStorage.getItem('user'));
const targetContainer = $('#targetContainer');

$(document).ready(function() {
	if (!user) location.href = '/';
	$('#createTargetCard').on('click', function(event) {
		$('#createTargetModal').modal('show');
	});
	getUserTargetImages();
});

function logout() {
	sessionStorage.clear();
	location.href = '/';
}

function addTargetToContainer(name, img) {
	let target;
	if (name == 'Add Target') {
		target =
			`<div class="target card border-secondary mb-3" id="createTargetCard">
    <div class="card-header">` +
			name +
			`</div>
    <div class="card-body">
      <img class="targetImage" src="` +
			img +
			`">
    </div>
  </div>`;
	} else {
		target =
			`<div class="target card border-secondary mb-3">
    <div class="card-header">` +
			name +
			`</div>
    <div class="card-body">
      <img class="targetImage" src="` +
			img +
			`">
    </div>
  </div>`;
	}
	targetContainer.append(target);
}

function createTarget() {
	if (document.getElementById('createTargetNameInput').value == '') {
		alert('Please choose a name for your target.');
		return;
	}
	if (document.getElementById('createTargetDescriptionInput').value == '') {
		alert('Please write a description for your target.');
		return;
	}
	if (document.getElementById('createTargetLatitudeInput').value == '') {
		alert('Please pick a latitude for your target.');
		return;
	}
	if (document.getElementById('createTargetLongitudeInput').value == '') {
		alert('Please pick a longitude for your target.');
		return;
	}
	if (document.getElementById('createTargetPictureInput').files[0] == undefined) {
		alert('Please choose a target image.');
		return;
	}
	if (document.getElementById('createTargetTextToSpeakInput').value == '') {
		alert('Please write some text to be spoken.');
		return;
	}

	let newTarget;
	let image = document.getElementById('createTargetPictureInput').files[0];
	var reader = new FileReader();

	reader.addEventListener(
		'load',
		function() {
			newTarget = {
				name: document.getElementById('createTargetNameInput').value,
				description: document.getElementById('createTargetDescriptionInput').value,
				latitude: document.getElementById('createTargetLatitudeInput').value,
				longitude: document.getElementById('createTargetLongitudeInput').value,
				imageData: reader.result,
				imageMetaData: 'test meta data',
				textToSpeak: document.getElementById('createTargetTextToSpeakInput').value
			};
			let target =
				`<div class="target card border-secondary mb-3">
    <div class="card-header">` +
				newTarget.name +
				`</div>
    <div class="card-body">
      <img class="targetImage" src=` +
				newTarget.imageData +
				`>
    </div>
  </div>`;
			$('#targetContainer > div:last').before(target);
			fetch('http://localhost:3000/api/targets/add', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					user: user,
					target: newTarget
				})
			});
		},
		false
	);

	if (image) {
		reader.readAsDataURL(image);
	}
	$('#createTargetModal').modal('hide');
}

function getUserTargetImages() {
	fetch('http://localhost:3000/api/users/' + user.username + '/targets', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			for (let i = 0; i < json.length; i++) {
				addTargetToContainer(json[i].name, json[i].imageData);
			}
			addTargetToContainer('Add Target', '/images/plus.png');
		});
}
