const passwordInput = document.getElementById('password-input');
const resultArea = document.getElementById('resultsArea');

passwordInput.addEventListener('input', () => {
  const password = passwordInput.value;
  fetch('/password', {
    method: 'POST',
    body: JSON.stringify({ password }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if (password !== ''){
      resultArea.textContent = data.score + data.feedback.suggestions;
    }
    else{
      resultArea.innerHTML ='...';
    }
  })
  .catch(error => console.error(error));
});
