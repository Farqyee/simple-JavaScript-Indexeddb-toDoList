import { updateData, addData, changeStatusDB, deleteData } from "./database.js";
import { hideModal, showModal } from "./modal.js";
export function initDOMEvents() {
  let namaUser = document.cookie.split("=")[1];
  let row;

  const form = document.getElementById("task-form");
  const taskTable = document.getElementById("task-list");
  const modal = document.getElementById("editModal");
  const editNameInput = document.getElementById("editName");
  const editUserInput = document.getElementById("editUser");
  const saveBtn = document.getElementById("saveBtn");
  const closeBtn = document.querySelector(".close-btn");

  //EventListener
  window.onload = function () {
    document.getElementById("user").innerHTML = `Halo ${namaUser}! What To Do?`;
  };

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const namaTask = formData.get("namaTask");
    addData(namaTask, namaUser, generateListData);
    form.reset();
  });
  taskTable.addEventListener("click", function (event) {
    if (event.target && event.target.classList.contains("status")) {
      const status = event.target;
      const id = event.target.closest("tr").cells[0].textContent;
      const statusText = status.classList.contains("completed")
        ? "completed"
        : "not-completed";
      changeStatus(status, statusText, id);
    }

    // Event listener for Delete button
    if (event.target && event.target.classList.contains("delete-btn")) {
      row = event.target.closest("tr");
      row.remove();
      const id = row.cells[0].textContent;
      deleteData(id);
    }

    // Event listener for Edit button
    if (event.target && event.target.classList.contains("edit-btn")) {
      row = event.target.closest("tr");
      const nameCell = row.cells[1];
      const userCell = row.cells[2];
      // Set input values
      editNameInput.value = nameCell.textContent;
      editUserInput.value = userCell.textContent;

      // Show the modal
      modal.style.display = "block";
      showModal();
    }
  });
  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      hideModal();
    }
  });
  // Event listener for close button
  closeBtn.addEventListener("click", hideModal);

  // Event listener for save button
  saveBtn.addEventListener("click", function () {
    if (row) {
      const id = row.cells[0].textContent;
      const nameCell = row.cells[1];
      const userCell = row.cells[2];
      // Set input values
      nameCell.textContent = editNameInput.value;
      userCell.textContent = editUserInput.value;
      const data = {
        id: id,
        nama: editNameInput.value,
        user: editUserInput.value,
      };
      updateData(id, data);
      // Hide the modal
      hideModal();
    }
  });
}

// 2. DOM Function
export function generateListData(data) {
  const taskTableElement = document.getElementById("task-list");
  const row = taskTableElement.insertRow();
  row.insertCell(0).innerHTML = data.id;
  row.insertCell(1).innerHTML = data.nama;
  row.insertCell(2).innerHTML = data.user;
  row.insertCell(
    3
  ).innerHTML = `<div class="status ${data.status.toLowerCase()}">
  ${data.status[0].toUpperCase()}${data.status.substring(1)}
  </div>`;
  const cell5 = row.insertCell(4);
  cell5.innerHTML = `<button class='edit-btn'>✎Edit</button>
    <button class='delete-btn'>🗑Delete</button>`;
  cell5.classList.add("action-buttons");
}

export function changeStatus(status, statusText, id) {
  switch (statusText) {
    case "completed":
      status.classList.remove("completed");
      status.classList.add("not-completed");
      status.innerHTML = "Not-Completed";
      changeStatusDB(id, "not-completed");
      break;

    case "not-completed":
      status.classList.remove("not-completed");
      status.classList.add("completed");
      status.innerHTML = "Completed";
      changeStatusDB(id, "completed");
      break;

    default:
      break;
  }
}
