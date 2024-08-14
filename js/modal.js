const modal = document.getElementById("editModal");

export function showModal() {
  modal.style.display = "block"; // Make sure display is set before animation
  setTimeout(() => {
    modal.classList.remove("hide");
    modal.classList.add("show");
  }, 10); // Slight delay to allow display to apply
}

// Function to hide modal with animation
export function hideModal() {
  modal.classList.remove("show");
  modal.classList.add("hide");
  // Remove display block after transition
  setTimeout(() => {
    modal.style.display = "none";
  }, 800); // Match this duration with CSS transition
}
