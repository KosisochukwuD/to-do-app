const titleinp = document.getElementById('title')
const descriptioninp = document.getElementById('description')
const dateinp = document.getElementById('date')
const form = document.querySelector('form')
const taskList = document.querySelector(".task ul");
const popup = document.getElementById('popup')
const cancel = document.getElementById('cancel')
const deleteBtn = document.getElementById('del')
const overlay = document.getElementById('overlay')
form.addEventListener("submit", (e) =>{
    e.preventDefault();

    let title = titleinp.value;
    let description = descriptioninp.value;
    let date = dateinp.value;

    if (title === '' || description === '' || date === ''){
        alert('please fill the form');
        return;
    }

    const todo = {
      id: Date.now(),
      title,
      description,
      date,
      completed: false   // ✅ track completed state
    }

    addTaskToDOM(todo);
    saveTaskToLocalStorage(todo);

    // clear inputs
    titleinp.value = '';
    descriptioninp.value = '';
    dateinp.value = '';
});

function addTaskToDOM(todo) {
    let li= document.createElement('li');
    li.dataset.id = todo.id;

 // ✅ check if completed already
    li.innerHTML = todo.completed
   ? `<div class='completed'><h1 style='color:black;'>completed</h1></div>
      <div><ion-icon name="close-circle-outline" class='delete'></ion-icon></div>`
   : `<div>
        <h3>${todo.title}</h3>
        <p> ${todo.description}</p> 
        <span class="date">${todo.date}</span> 
      </div>
      <div>
        <button class='complete'>incomplete</button>
        <ion-icon name="close-circle-outline" class='delete'></ion-icon>
      </div>`;

   // complete button (only if not completed yet)
   if (!todo.completed) {
     li.querySelector('.complete').addEventListener('click', ()=>{
        todo.completed = true;  // ✅ update object
        updateTaskInLocalStorage(todo); // ✅ update in storage
        li.innerHTML = `<div class='completed'><h1 style='color:black;'>completed</h1></div>
                        <div><ion-icon name="close-circle-outline" class='delete'></ion-icon></div>`;
        li.querySelector('.delete').addEventListener("click",()=>{
                                 li.remove();
                    removeTaskFromLocalStorage(todo.id);
        });
     });
   }

    li.querySelector('.delete').addEventListener("click",()=>{
              popup.style.display = 'block'
               overlay.style.display = 'flex'
        deleteBtn.addEventListener('click', ()=>{
                    popup.style.display = 'none'
                    li.remove();
                    removeTaskFromLocalStorage(todo.id);
                        overlay.style.display = 'none'
              })
        overlay.addEventListener('click',()=>{
           overlay.style.display='none'
                    popup.style.display = 'none'

        })  
          cancel.addEventListener('click',()=>{
            overlay.style.display='none'
                    popup.style.display = 'none'
          })
        }); 
         
          
     

           taskList.appendChild(li);
}

function saveTaskToLocalStorage(todo) {
  const tasks = getTasksFromLocalStorage();
  tasks.push(todo);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskInLocalStorage(updatedTodo) {
  let tasks = getTasksFromLocalStorage();
  tasks = tasks.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = getTasksFromLocalStorage();
  tasks.forEach((todo) => addTaskToDOM(todo));
}

function getTasksFromLocalStorage() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function removeTaskFromLocalStorage(id) {
  let tasks = getTasksFromLocalStorage();
  tasks = tasks.filter((todo) => todo.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

document.addEventListener("DOMContentLoaded", loadTasks);
