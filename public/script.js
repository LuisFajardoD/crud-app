
document.addEventListener("DOMContentLoaded", () => {
  const addRecordButton = document.getElementById("addRecord");
  const formContainer = document.getElementById("formContainer");
  const recordForm = document.getElementById("recordForm");
  const recordsContainer = document.getElementById("recordsContainer");
  let editMode = false; // Nueva variable para controlar el modo edición
  let editRecordId = null;

  // Mostrar el formulario al hacer clic en "Agregar Registro"
  addRecordButton.addEventListener("click", () => {
    formContainer.style.display = "block";
    addRecordButton.style.display = "none";
    recordForm.reset();
    editMode = false; // Salir del modo edición
  });

  // Manejar el envío del formulario
  recordForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    if (editMode) {
      // Actualizar registro
      try {
        const response = await fetch(`/api/records/${editRecordId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email }),
        });

        if (response.ok) {
          showAlert("Registro actualizado exitosamente", "success");
          formContainer.style.display = "none";
          addRecordButton.style.display = "block";
          fetchRecords();
        } else {
          showAlert("Error al actualizar el registro", "error");
        }
      } catch (error) {
        console.error("Error:", error);
        showAlert("Error al actualizar el registro", "error");
      }
    } else {
      // Agregar nuevo registro
      try {
        const response = await fetch("/api/records", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email }),
        });

        if (response.ok) {
          showAlert("Registro agregado exitosamente", "success");
          formContainer.style.display = "none";
          addRecordButton.style.display = "block";
          fetchRecords();
        } else {
          showAlert("Error al agregar el registro", "error");
        }
      } catch (error) {
        console.error("Error:", error);
        showAlert("Error al agregar el registro", "error");
      }
    }

    recordForm.reset();
  });

  // Obtener y mostrar los registros
  async function fetchRecords() {
    try {
      const response = await fetch("/api/records");
      const records = await response.json();

      recordsContainer.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${records
              .map(
                (record) => `
              <tr>
                <td>${record.id}</td>
                <td>${record.name}</td>
                <td>${record.email}</td>
                <td>
                  <button class="btn btn-edit" onclick="editRecord(${record.id}, '${record.name}', '${record.email}')">Editar</button>
                  <button class="btn btn-delete" onclick="confirmDelete(${record.id})">Eliminar</button>
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `;
    } catch (error) {
      console.error("Error:", error);
      recordsContainer.innerHTML = "<p>Error al cargar los registros</p>";
    }
  }

  // Mostrar una alerta personalizada
  function showAlert(message, type) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    document.body.appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, 3000);
  }

  // Editar un registro
  window.editRecord = (id, name, email) => {
    document.getElementById("name").value = name;
    document.getElementById("email").value = email;

    formContainer.style.display = "block";
    addRecordButton.style.display = "none";

    editMode = true;
    editRecordId = id;
  };

  // Confirmar eliminación con modal
  window.confirmDelete = (id) => {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content">
        <p>¿Estás seguro de eliminar este registro?</p>
        <button class="btn btn-confirm" onclick="deleteRecord(${id})">Confirmar</button>
        <button class="btn btn-cancel" onclick="closeModal()">Cancelar</button>
      </div>
    `;
    document.body.appendChild(modal);
  };

  // Cerrar el modal
  window.closeModal = () => {
    const modal = document.querySelector(".modal");
    if (modal) {
      modal.remove();
    }
  };

  // Eliminar un registro
  window.deleteRecord = async (id) => {
    try {
      const response = await fetch(`/api/records/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showAlert("Registro eliminado exitosamente", "success");
        closeModal();
        fetchRecords();
      } else {
        showAlert("Error al eliminar el registro", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showAlert("Error al eliminar el registro", "error");
    }
  };

  // Cargar registros al iniciar
  fetchRecords();
});
