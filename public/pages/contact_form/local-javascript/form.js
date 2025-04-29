let cooldown = false;
const serviceID = 'service_aiche';
const templateID = 'template_v8d3ius';

const form = document.getElementById('myForm');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  if (cooldown) return; // if cooldown is true, do nothing

  cooldown = true; // set cooldown to true
  setTimeout(() => {
    cooldown = false; // reset cooldown after 10 seconds
  }, 10000);

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  const templateParams = {
    name: name,
    email: email,
    message: message
  };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address');
    return;
  }

  emailjs.send(serviceID, templateID, templateParams)
    .then((response) => {
      if (response.status === 200) {
        console.log('Email sent!');
        console.log(response.status, response.text);
        alert('Email sent successfully!');
        window.location.href = 'https://example.com'; // redirect to main page (REMEMBER TO CHANGE THIS!)
      } else {
        console.log('Error sending email:', response.status, response.text);
        alert('Error sending email: ' + response.status);
      }
    })
});