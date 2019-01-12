function login() {
  let username = document.getElementById('loginUsername').value;
  let password = document.getElementById('loginPassword').value;

  fetch('http://localhost:3000/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      if (json.Text == undefined) {
        sessionStorage.setItem('user', JSON.stringify(json));
        location.href = '/dashboard';
      } else document.getElementById('invalidPrompt').style.display = 'block';
    });
}

function register() {
  let username = document.getElementById('registerUsername').value;
  let email = document.getElementById('registerEmail').value;
  let password = document.getElementById('registerPassword').value;
  let confirmPassword = document.getElementById('registerConfirmPassword').value;

  if (password != confirmPassword) {
    alert('Password and Confirm Password fields are not the same.');
    return;
  }

  fetch('http://localhost:3000/api/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      email: email,
      password: password
    })
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      if (json.Text == 'Username Taken') document.getElementById('usernameTakenPrompt').style.display = 'block';
      if (json.Text == 'User Registered') location.reload();
    });
}

$('#registerUsername').on('change paste keyup', function() {
  document.getElementById('usernameTakenPrompt').style.display = 'none';
});

$('#loginUsername').on('change paste keyup', function() {
  document.getElementById('invalidPrompt').style.display = 'none';
});

$('#loginPassword').on('change paste keyup', function() {
  document.getElementById('invalidPrompt').style.display = 'none';
});
