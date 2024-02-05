const state = {
  TaskList: [
    {
      id: "2020202020",
      url: "https://wallpapercave.com/wp/wp5493583.jpg",
      title: "Bike",
      description: "This is an Description",
      type: "test badge!",
    },
  ],
};

//Dom Operation
const TaskCardBody = document.querySelector(".Task_card_container");
const TaskModal = document.querySelector(".TaskShowModal");

const HtmlTaskContent = ({ id, title, description, type, url }) => `
             <div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>
                <div class="card shadow-sm Task_Card">
                    <div class="Task_Header card-header  d-flex justify-content-end gap-2">
                        <button type="button" class="btn btn-outline-info mr-3" id=${id}>
                            <i class="fa-solid fa-pencil " name=${id}></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger" data-bs-target="#TaskCardModal" data-bs-toggle="modal" id=${id}>
                            <i class="fa-solid fa-trash " name=${id}></i>
                        </button>
                    </div>

                    <div class="Task_Image card-body">
                        ${
                          url &&
                          `<img src=${url} alt="Card Image" class="card-img-top md-3 rounded-lg" width="100%" />`
                        }
                    </div>
                    <h2 class="card-title Task_Card_Title ms-2">${title}</h2>
                        <p class="task_desc text-muted ms-2">${description}</p>
                        <div class="tags text-white d-flex flex-wrap ms-2 mb-1">
                            <span class="badge bg-primary m-1">${type}</span>
                        </div>

                    <div class="card-footer">
                        <button type="button" class="btn btn-outline-primary float-right data-bs-target="#TaskCardModal" data-bs-toggle="modal">Open Pages</button>
                    </div>
                </div>
            </div>
`;

const HtmlModalContent = ({ id, title, description, type, url }) => {
  const date = new Date(parseInt(id));
  return `
    <div>
    ${
      url &&
      `<img src=${url} alt="Card Image" class='img-fluid place__holder__image mb-3' width="100%" />`
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
  console.log(e.target.id);
  const getTask = state.TaskList.find(({ id }) => id === e.target.id);
  console.log(getTask);
  TaskModal.innerHTML = HtmlModalContent(getTask);
};
