const state = {
  TaskList: [],
};

//Dom Operation
const TaskCardBody = document.querySelector(".Task_card_container");
const TaskModal = document.querySelector(".TaskShowModal");

const HtmlTaskContent = ({ id, title, description, type, url }) => `
             <div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>
                <div class="card shadow-sm Task_Card"> 
                     <div class="Task_Header card-header  d-flex justify-content-end gap-2">
                        <button type="button" class="btn btn-outline-info mr-3" onclick="editTask.apply(this,arguments)" id=${id}>
                            <i class="fa-solid fa-pencil " id=${id}></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger"  onclick="deleteTask.apply(this,arguments)" id=${id}>
                            <i class="fa-solid fa-trash " id=${id}></i>
                        </button>
                    </div>

                    <div class="Task_Image card-body">
                        ${
                          url
                            ? `<img src=${url} alt="Card Image" class='img-fluid place__holder__image mb-3' width="100%" />`
                            : `<img src="https://t3.ftcdn.net/jpg/02/48/42/64/240_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg" alt="Card Image" class='img-fluid place__holder__image mb-3' width="100%" />`
                        }
                    </div>
                    <h2 class="card-title Task_Card_Title ms-2">${title}</h2>
                        <p class="task_desc text-muted ms-2">${description}</p>
                        <div class="tags text-white d-flex flex-wrap ms-2 mb-1">
                            <span class="badge bg-primary m-1">${type}</span>
                        </div>

                    <div class="card-footer">
                        <button type="button" class="btn btn-outline-primary" float-right data-bs-target="#TaskCardModal" data-bs-toggle="modal" onclick="openTask()" id=${id}>Open Pages</button>
                    </div>
                </div>
            </div>
`;

const HtmlModalContent = ({ id, title, description, type, url }) => {
  const date = new Date(parseInt(id));
  return `
    <div>
    ${
      url
        ? `<img src=${url} alt="Card Image" class='img-fluid place__holder__image mb-3' width="100%" />`
        : `<img src="https://t3.ftcdn.net/jpg/02/48/42/64/240_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg" alt="Card Image" class='img-fluid place__holder__image mb-3' width="100%" />`
    }
    <strong class="text-muted text-sm">Created on: ${date.toDateString()}</strong>
    <h2 class="my-3">${title}</h2>
    <p class="text-muted">${description}</p>
    </div>
`;
};

const updateLocalStorage = () => {
  localStorage.setItem(
    "KeyBox",
    JSON.stringify({
      tasks: state.TaskList,
    })
  );
};

const loadinitialData = () => {
  //   console.log(localStorage.KeyBox);
  const localStorageCopy = JSON.parse(localStorage.KeyBox);
  //   console.log(localStorageCopy);
  if (localStorageCopy) state.TaskList = localStorageCopy.tasks;
  state.TaskList.map((carddata) => {
    TaskCardBody.insertAdjacentHTML("beforeend", HtmlTaskContent(carddata));
  });
};

const handleSubmit = () => {
  const id = `${Date.now()}`;
  const input = {
    url: document.getElementById("imageUrl").value,
    title: document.getElementById("TaskTitle").value,
    type: document.getElementById("TaskType").value,
    description: document.getElementById("TaskDesc").value,
  };
  if (input.title === "" || input.type === "" || input.description === "") {
    return alert("Please Fill all the necessary Fields!");
  }
  TaskCardBody.insertAdjacentHTML(
    "beforeend",
    HtmlTaskContent({ ...input, id })
  );
  state.TaskList.push({ ...input, id });
  updateLocalStorage();
};

const openTask = (e) => {
  if (!e) e = window.event;

  const getTask = state.TaskList.find(({ id }) => id === e.target.id);
  TaskModal.innerHTML = HtmlModalContent(getTask);
};

const deleteTask = (e) => {
  if (!e) e = window.event;

  var getTaskType = e.target.tagName;
  var getTaskId = e.target.id;
  if (getTaskType === "BUTTON") {
    e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode
    );
  }
  if (getTaskType === "I") {
    e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode.parentNode
    );
  }

  const getTask = state.TaskList.filter(({ id }) => id !== getTaskId);
  state.TaskList = getTask;
  updateLocalStorage();
};

const editTask = (e) => {
  if (!e) e = window.event;
  const getTaskTag = e.target.tagName;

  let parentNode;
  let TaskTitle;
  let TaskType;
  let TaskDesc;
  let Submitbtn;
  console.log(getTaskTag);
  if (getTaskTag === "BUTTON") {
    parentNode = e.target.parentNode.parentNode;
  } else {
    parentNode = e.target.parentNode.parentNode.parentNode;
  }
  console.log(parentNode.childNodes);
  TaskTitle = parentNode.childNodes[5];
  TaskDesc = parentNode.childNodes[7];
  TaskType = parentNode.childNodes[9].childNodes[1];
  Submitbtn = parentNode.childNodes[11].childNodes[1];
  TaskTitle.setAttribute("contenteditable", "true");
  TaskType.setAttribute("contenteditable", "true");
  TaskDesc.setAttribute("contenteditable", "true");
  Submitbtn.innerHTML = "Save Changes";
  Submitbtn.setAttribute("onclick", "saveEdit.apply(this,arguments)");
  Submitbtn.removeAttribute("data-bs-target");
  Submitbtn.removeAttribute("data-bs-toggle");
};

const saveEdit = (e) => {
  if (!e) e = window.event;
  const targetId = e.target.id;
  const parentNode = e.target.parentNode.parentNode;
  const TaskTitle = parentNode.childNodes[5];
  const TaskDesc = parentNode.childNodes[7];
  const TaskType = parentNode.childNodes[9].childNodes[1];
  const Submitbtn = parentNode.childNodes[11].childNodes[1];
  const TaskData = {
    title: TaskTitle.innerHTML,
    desc: TaskDesc.innerHTML,
    type: TaskType.innerHTML,
  };
  let stateCopy = state.TaskList;

  stateCopy = stateCopy.map((task) =>
    task.id === targetId
      ? {
          id: targetId,
          url: task.url,
          title: TaskData.title,
          description: TaskData.desc,
          type: TaskData.type,
        }
      : task
  );
  console.log(stateCopy);
  state.TaskList = stateCopy;
  updateLocalStorage();

  TaskTitle.setAttribute("contenteditable", "false");
  TaskType.setAttribute("contenteditable", "false");
  TaskDesc.setAttribute("contenteditable", "false");
  Submitbtn.innerHTML = "Open Pages";
  Submitbtn.setAttribute("data-bs-target", "#TaskCardModal");
  Submitbtn.setAttribute("data-bs-toggle", "modal");
  Submitbtn.setAttribute("onclick", "openTask.apply(this,arguments)");
};

const SearchTask = (e) => {
  if (!e) e = window.event;

  while (TaskCardBody.firstChild) {
    TaskCardBody.removeChild(TaskCardBody.firstChild);
  }
  const FilteredData = state.TaskList.filter(({ title }) =>
    title.toLowerCase().includes(e.target.value.toLowerCase())
  );
  console.log(FilteredData);
  FilteredData.map((CardData) => {
    TaskCardBody.insertAdjacentHTML("beforeend",HtmlTaskContent(CardData));
  });
};
