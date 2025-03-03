chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('dailyUpdate', { periodInMinutes: 1440 }); // 24 hours
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dailyUpdate') {
    checkMilestones();
  }
});

function checkMilestones() {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const percentage = ((now - yearStart) / (new Date(now.getFullYear() + 1, 0, 1) - yearStart)) * 100;

  if (percentage >= 50 && percentage < 50.1) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon128.png',
      title: 'Milestone Reached!',
      message: '50% of the year completed!'
    });
  }
}