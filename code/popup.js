document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('progressBar');
    const progressContainer = progressBar.parentElement;
    const percentageText = document.querySelector('.percentage');
    const caption = document.getElementById('caption');
    const colorPicker = document.getElementById('colorPicker');
    const labelInput = document.getElementById('labelInput');
    const shapeButtons = document.querySelectorAll('.shape-btn');
    const themeIcons = document.querySelectorAll('.theme-toggle .icon');
    const glassmorphismToggle = document.getElementById('glassmorphism');
    const tabs = document.querySelectorAll('.tab');
  
    let currentTimeframe = 'yearly';
  
    // Load saved settings
    chrome.storage.sync.get(['barColor', 'label', 'shape', 'theme', 'glassmorphism', 'timeframe'], (data) => {
      progressBar.style.background = data.barColor || 'linear-gradient(90deg, #8B5CF6, #3B82F6)';
      colorPicker.value = data.barColor ? data.barColor.split(',')[0].match(/#[\w\d]+/)[0] : '#8B5CF6';
      caption.textContent = data.label || `${data.timeframe || 'Year'} Progress`;
      labelInput.value = data.label || `${data.timeframe || 'Year'} Progress`;
      document.body.className = data.theme || '';
      if (data.glassmorphism) glassmorphismToggle.checked = true;
      if (data.shape === 'circular') toggleShape('circular');
      currentTimeframe = data.timeframe || 'yearly';
      tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.timeframe === currentTimeframe));
      updateProgress();
    });
  
    // Tab switching
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentTimeframe = tab.dataset.timeframe;
        chrome.storage.sync.set({ timeframe: currentTimeframe });
        updateProgress();
        if (!labelInput.value) caption.textContent = `${currentTimeframe.charAt(0).toUpperCase() + currentTimeframe.slice(1)} Progress`;
      });
    });
  
    // Color picker
    colorPicker.addEventListener('input', () => {
      const gradient = `linear-gradient(90deg, ${colorPicker.value}, #3B82F6)`;
      progressBar.style.background = gradient;
      chrome.storage.sync.set({ barColor: gradient });
      updateProgress();
    });
  
    // Custom label
    labelInput.addEventListener('input', () => {
      caption.textContent = labelInput.value || `${currentTimeframe.charAt(0).toUpperCase() + currentTimeframe.slice(1)} Progress`;
      chrome.storage.sync.set({ label: labelInput.value });
    });
  
    // Shape toggle
    shapeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        toggleShape(btn.dataset.shape);
        chrome.storage.sync.set({ shape: btn.dataset.shape });
      });
    });
  
    function toggleShape(shape) {
      shapeButtons.forEach(b => b.classList.remove('active'));
      if (shape === 'circular') {
        progressContainer.classList.add('circular');
        document.querySelector('[data-shape="circular"]').classList.add('active');
      } else {
        progressContainer.classList.remove('circular');
        document.querySelector('[data-shape="rounded"]').classList.add('active');
      }
      updateProgress();
    }
  
    // Theme toggle
    themeIcons.forEach(icon => {
      icon.addEventListener('click', () => {
        document.body.classList.toggle('dark', icon.dataset.theme === 'dark');
        chrome.storage.sync.set({ theme: document.body.classList.contains('dark') ? 'dark' : '' });
      });
    });
  
    // Glassmorphism toggle
    glassmorphismToggle.addEventListener('change', () => {
      document.body.classList.toggle('glassmorphism', glassmorphismToggle.checked);
      chrome.storage.sync.set({ glassmorphism: glassmorphismToggle.checked });
    });
  
    // Progress calculation
    function updateProgress() {
      const now = new Date();
      let percentage, start, end;
  
      switch (currentTimeframe) {
        case 'yearly':
          start = new Date(now.getFullYear(), 0, 1);
          end = new Date(now.getFullYear() + 1, 0, 1);
          percentage = ((now - start) / (end - start)) * 100;
          break;
        case 'monthly':
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          percentage = ((now - start) / (end - start)) * 100;
          break;
        case 'weekly':
          start = new Date(now);
          start.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
          end = new Date(start);
          end.setDate(start.getDate() + 7);
          percentage = ((now - start) / (end - start)) * 100;
          break;
      }
  
      if (progressContainer.classList.contains('circular')) {
        progressContainer.style.background = `conic-gradient(#8B5CF6 0% ${percentage}%, #E5E7EB ${percentage}% 100%)`;
      } else {
        progressBar.style.width = `${percentage}%`;
      }
      percentageText.textContent = `${percentage.toFixed(1)}%`;
    }
  
    updateProgress();
  });