document.getElementById("task-form").onsubmit = function (event) {
  event.preventDefault();
  getName();
};
/* Uncomment this section and call it from console to delete object Store */
// function deleteObjectStore() {
//   const request = indexedDB.open("ToDoList", 2);
//   request.onupgradeneeded = function (event) {
//     console.log("tes2");
//     db = event.target.result;
//     if (db.objectStoreNames.contains("task")) {
//       db.deleteObjectStore("task");
//       console.log("Object store deleted.");
//     } else {
//       console.log("Object store does not exist.");
//     }
//   };
// }
function getName() {
  var nama = document.getElementById("nama").value;

  if (
    confirm("Selamat datang, " + nama + "! Silahkan isi daftar tugas anda.")
  ) {
    document.cookie = "username=" + nama + "; expires=2025;";

    document.body.classList.add("fade-out");
    setTimeout(function () {
      window.location.href = "home.html";
    }, 2000);
  } else {
    return false;
  }
}
