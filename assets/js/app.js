const tasks = [
  {
    id: 1,
    description: "Sacar al perro",
    completed: false,
  },
  {
    id: 2,
    description: "Llegar a top 500 en Overwatch",
    completed: false,
  },
  {
    id: 3,
    description: "Ir al supermercado",
    completed: false,
  },
];

let lastTaskId = 1;

const inputTask = document.querySelector("#input-task");
const inputButton = document.querySelector("#input-button");

const displayTotalTasks = document.querySelector("#display-total-tasks");
const displayCompletedTasks = document.querySelector(
  "#display-completed-tasks"
);

const tableContainer = document.querySelector("#tasks-table-container");

const taskToHtml = ({ id, description, completed }) => {
  const rowHtml = `
      <tr data-id="${id}" class="${completed ? "task-completed" : ""}">
        <td>${id}</td>
        <td>${description}</td>
        <td>
          <div class="flex-container">
            <input class="input-check-completed" type="checkbox" ${
              completed ? "checked" : ""
            }/>
          </div>
        </td>
        <td>
          <button class="btn-delete">Eliminar</button>
        </td>
      </tr>
    `;

  return rowHtml;
};

const updateTableInfo = () => {
  displayTotalTasks.textContent = tasks.length;
  displayCompletedTasks.textContent = tasks.filter((task) => {
    return task.completed;
  }).length;
};

const rebuildTable = () => {
  const tableElements = tasks.reduce((prev, task) => {
    const rowHtml = taskToHtml(task);

    return (prev += rowHtml);
  }, "");

  const finalString = `
    <table class="tasks-table">
      <tr>
        <th>ID</th>
        <th colspan="3">Tarea</th>
      </tr>
      ${tableElements}
    </table>
  `;

  tableContainer.innerHTML = finalString;

  applyHandlers();

  updateTableInfo();
};

const deleteTask = (index) => {
  tasks.splice(index, 1);
};

const changeTaskState = (id, value) => {
  const objInArray = findObjectInTaskArrayById(id);

  if (objInArray) {
    objInArray.completed = value;
  } else {
    alert(`No se pudo encontrar tarea de id: ${id} en el arreglo de tareas`);
  }

  const rowInDOM = findTableRowById(id);

  if (rowInDOM) {
    rowInDOM.classList.toggle("task-completed", value);
  } else {
    alert(`No se pudo encontrar tarea de id: ${id} en la tabla en el DOM`);
  }

  updateTableInfo();
};

const taskDeleteHandler = (ev) => {
  const btn = ev.target;
  const idToRemove = Number(btn.parentElement.parentElement.dataset.id);

  const indexToRemove = tasks.findIndex((task) => {
    return task.id === idToRemove;
  });

  if (indexToRemove === -1) {
    alert(
      "No se pudo encontrar el elemento correspondiente a borrar en el arreglo de tareas"
    );

    return;
  }

  deleteTask(indexToRemove);
  rebuildTable();
};

const inputCompletedHandler = (ev) => {
  const inputCheck = ev.target;
  const idToChange = Number(
    inputCheck.parentElement.parentElement.parentElement.dataset.id
  );

  changeTaskState(idToChange, inputCheck.checked);
};

const applyHandlers = () => {
  const deleteButtons = document.querySelectorAll(".btn-delete");
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", taskDeleteHandler);
  });

  const inputChecks = document.querySelectorAll(".input-check-completed");
  inputChecks.forEach((check) => {
    check.addEventListener("click", inputCompletedHandler);
  });
};

const findObjectInTaskArrayById = (id) => {
  for (let i = 0; i < tasks.length; ++i) {
    const cur = tasks[i];

    if (cur.id === id) {
      return cur;
    }
  }

  return null;
};

const findTableRowById = (id) => {
  const allRows = document.querySelectorAll(".tasks-table tr");

  for (let i = 0; i < allRows.length; ++i) {
    const cur = allRows[i];

    if (Number(cur.dataset.id) === id) {
      return cur;
    }
  }

  return null;
};

const addTaskUser = (desc) => {
  tasks.push({
    id: lastTaskId++,
    description: desc,
    completed: false,
  });

  rebuildTable();
};

const addTasksPreconfigured = () => {
  const length = tasks.length;

  lastTaskId = length + 1;

  rebuildTable();
};

const firstTimeSetup = () => {
  addTasksPreconfigured();

  inputButton.addEventListener("click", (ev) => {
    const desc = inputTask.value.trim();

    if (!desc.length) {
      alert("Descripcion de nueva tarea no puede estar vacia");
      return;
    }

    addTaskUser(desc);
  });
};

firstTimeSetup();
