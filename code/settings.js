document.addEventListener('DOMContentLoaded', () => {
  const darkModeCheckbox = document.getElementById('darkMode');
  const notificationsCheckbox = document.getElementById('notifications');

  chrome.storage.sync.get(['darkMode', 'notifications'], (data) => {
    darkModeCheckbox.checked = data.darkMode || false;
    notificationsCheckbox.checked = data.notifications || false;
  });

  darkModeCheckbox.addEventListener('change', () => {
    chrome.storage.sync.set({ darkMode: darkModeCheckbox.checked });
  });

  notificationsCheckbox.addEventListener('change', () => {
    chrome.storage.sync.set({ notifications: notificationsCheckbox.checked });
  });
});