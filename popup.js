function getTimeDetails(duration) {
  const timeUnits = [
    { unit: 'Year', seconds: 31536000 },
    { unit: 'Month', seconds: 2678400 },
    { unit: 'Day', seconds: 86400 },
    { unit: 'Hour', seconds: 3600 },
    { unit: 'Minute', seconds: 60 },
    { unit: 'Second', seconds: 1 }
  ];

  let timeDetails = '';

  for (const unitInfo of timeUnits) {
    const count = Math.floor(duration / unitInfo.seconds);
    duration -= count * unitInfo.seconds;
    if (count > 0) {
      timeDetails += `${count} ${unitInfo.unit}${count === 1 ? ' ' : 's '}`;
    }
  }

  return timeDetails;
}

window.onload = function() {
  fetchBanInfo();

  // Refresh the page every second
  setInterval(fetchBanInfo, 1000);
}

function fetchBanInfo() {
  fetch('https://voice.roblox.com/v1/settings')
  .then(res => res.json())
  .then(data => {
    if (data.isBanned) {
      document.body.classList.add('banned');
      const currentTime = Math.floor(Date.now() / 1000);
      const banUntil = data.bannedUntil.Seconds;
      const duration = banUntil - currentTime;
      const timeDetails = getTimeDetails(duration);
      
      const banDate = new Date(banUntil * 1000);
      const formattedDate = banDate.toLocaleDateString('en-US');
      const formattedTime = banDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      document.getElementById('ban-info').innerHTML = "You're VC access is suspended until";
      document.getElementById('ban-date').innerHTML = formattedDate;
      document.getElementById('ban-time').innerHTML = formattedTime;
      
      const countdownMessage = `${timeDetails}`;
      document.getElementById('ban-duration').innerHTML = countdownMessage;
    } 
    else {
      document.body.classList.add('not-banned');
      document.getElementById('ban-info').innerHTML = 'You are not currently suspended from Roblox\'s voice chat.';
    }
  })
  .catch(err => {
    document.getElementById('ban-info').innerHTML = 'Error fetching data.';
  });
}
