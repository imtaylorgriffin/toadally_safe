const passwordInput = document.getElementById('password-input');
const scoreHtml = document.getElementById('passDiv');
const suggestions = document.getElementById('suggestions');
const warnings = document.getElementById('warnings');
const stats = document.getElementById('stats');



const batchResultsArea = document.getElementById('batchResultsArea');
const batchInput = document.getElementById('file');

passwordInput.addEventListener('input', () => {
  const password = passwordInput.value;
  let output ='';
  fetch('/password', {
    method: 'POST',
    body: JSON.stringify({ password }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
  
    if (password !== ''){
      
      const scoreDescriptions = [
        'too guessable',
        'very guessable',
        'somewhat guessable',
        'safely unguessable',
        'very unguessable'
      ];
      const scoreDescription = scoreDescriptions[data.score];
      
      scoreHtml.innerHTML = `<strong>Password Score:</strong> ${data.score} (${scoreDescription})`; // + data.feedback.suggestions;
      suggestions.innerHTML = `<strong>To be Toadally_Safe:</strong> ${data.feedback.suggestions}`; // + data.feedback.suggestions;
      warnings.innerHTML = `<strong>Warning:</strong> ${data.feedback.warning}`; //

    
    
    output += 
          `<tr>
            <td>${data.guesses}</td>
            <td>${data.crack_times_display.offline_fast_hashing_1e10_per_second}</td>
            <td>${data.crack_times_display.offline_slow_hashing_1e4_per_second}</td>
            <td>${data.crack_times_display.online_no_throttling_10_per_second}</td>
            <td>${data.crack_times_display.online_throttling_100_per_hour}</td>
          </tr>`;
          stats.innerHTML = 
          `<table class="stats-table">
            <thead>
              <tr>
                <th>Guesses</th>
                <th>Time to crack offline (10,000,000,000/s)</th>
                <th>Time to crack offline (10,000/s)</th>
                <th>Time to crack online (10/s)</th>
                <th>Time to crack online (100/hr)</th>
                
              </tr>
            </thead>
            <tbody>${output}</tbody>
          </table>`;
      


      

    }
    else{
      scoreHtml.innerHTML ='Score...';
      suggestions.innerHTML = `Suggestions...`; // + data.feedback.suggestions;
      warnings.innerHTML ='Warnings...'; 
      stats.innerHTML ="";     
    }






  })
  .catch(error => console.error(error));
});




batchInput.addEventListener('change', () => {
  batchResultsArea.innerHTML = '';
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
            <td>${data.guesses}</td>
            <td>${data.crack_times_display.online_no_throttling_10_per_second}</td>
            <td>${data.crack_times_display.offline_slow_hashing_1e4_per_second}</td>
            <td>${data.crack_times_display.offline_fast_hashing_1e10_per_second}</td>
          </tr>`;
          batchResultsArea.innerHTML = 
          `<table class="batch-results-table">
            <thead>
              <tr>
                <th>Password</th>
                <th>Score</th>
                <th>Guesses</th>
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

