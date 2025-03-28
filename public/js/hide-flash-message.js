setTimeout(() => {
  const flashMessage = document.getElementById("flashMessage");
  if (flashMessage) {
    flashMessage.style.transition = "opacity 0.5s ease-out";
    flashMessage.style.opacity = "0";
    setTimeout(() => flashMessage.remove(), 500);
  }
}, 5000); // Hides after 5 seconds
