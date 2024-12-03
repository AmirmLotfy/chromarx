// Theme initialization
function initializeTheme() {
  if (localStorage.theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Execute theme initialization
initializeTheme();