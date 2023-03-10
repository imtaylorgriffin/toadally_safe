const passwordInput = document.getElementById('password-input');
const stats = document.getElementById('stats');
const suggestions = document.getElementById('suggestions');
const warnings = document.getElementById('warnings');
const batchResultsArea = document.getElementById('batchResultsArea');
const batchInput = document.getElementById('file');

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
      stats.innerHTML = `Your Password Score is: ${data.score}`; // + data.feedback.suggestions;
      suggestions.innerHTML = `To be Toadally_Safe, you should: ${data.feedback.suggestions}`; // + data.feedback.suggestions;
      warnings.innerHTML = `Warnings: ${data.feedback.warning}`; //

    }
    else{
      stats.innerHTML ='Stats...';
      suggestions.innerHTML = `Suggestions...`; // + data.feedback.suggestions;
      warnings.innerHTML ='Warnings...';
    }
  })
  .catch(error => console.error(error));
});


batchInput.addEventListener('change', () => {
  const file = batchInput.files[0]; //select file
  const reader = new FileReader();  // file reader
  reader.onload = (event) =>{ // called when   reader.readAsText(file); finishes reading file
    const passwords = event.target.result.split('\n'); //passwords are delimited by enter/new lines
    let output ='';

    passwords.forEach((password)=>{ //for each password
      if(password.trim()!== ''){
        fetch('/password', { 
          method: 'POST',
          body: JSON.stringify({ password }), //pass to our main.js zxcvbn
          headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
          output += 
          `<tr>
            <td>${password}</td>
            <td>${data.score}</td>
            <td>${data.crack_times_display.online_no_throttling_10_per_second}</td>
            <td>${data.crack_times_display.offline_slow_hashing_1e4_per_second}</td>
            <td>${data.crack_times_display.offline_fast_hashing_1e10_per_second}</td>
          </tr>`;
          batchResultsArea.innerHTML = 
          `<table>
            <thead>
              <tr>
                <th>Password</th>
                <th>Score</th>
                <th>Time to crack online (10/s)</th>
                <th>Time to crack offline (10,000/s)</th>
                <th>Time to crack offline (10,000,000,000/s)</th>
              </tr>
            </thead>
            <tbody>${output}</tbody>
          </table>`;
            
        })
        .catch(error => console.error(error));
      }
    });

  };
  reader.readAsText(file);

});