import { flatten } from 'lodash';
import { toLocalStorage } from './utility';

const taskList = [];
export const renderedTaskList = [];
const parentDivArray = [];

export const addTasksHandler = (taskBtn) => {
  const parentId = taskBtn.parentElement.parentElement.parentElement.parentElement.parentElement;
  if (!taskBtn.classList.contains('listening')) {
    taskBtn.addEventListener('click', () => {
      taskBtn.classList.add('listening');
      generateTaskParent(parentId);
    });
  } else {
    generateTaskParent(parentId);
  }
};

const createTaskList = (name, description, duedate, notes) => {
  const parent = parentDivArray[0];
  parentDivArray.splice(0, 1);
  const newTask = {
    name,
    description,
    duedate,
    notes,
    parent,
    uniqueId: Math.random(),
  };
  taskList.push(newTask);
  renderTask(taskList);
};

const taskSubmitHandler = () => {
  const taskModal = document.getElementById('taskModal');
  const taskName = taskModal.querySelector('#task_name').value;
  const taskDescription = taskModal.querySelector('#task_description').value;
  const taskDuedate = taskModal.querySelector('#task_duedate').value;
  const taskNotes = taskModal.querySelector('#task_notes').value;
  createTaskList(
    taskName,
    taskDescription,
    taskDuedate,
    taskNotes,
  );
};
const submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', taskSubmitHandler);

export const generateTaskParent = (parent) => {
  const parentProject = parent;
  const parentProjectId = parentProject.id;
  const parentObject = {
    parentProjectId,
    parentProject,
  };
  parentDivArray.push(parentObject);
};

const renderTask = (array) => {
  if (array.constructor == Object) {
    taskList.push(array);
    renderTask(array);
  } else {
    array.forEach((element) => {
      const id = element.parent.parentProjectId;
      const parent = document.getElementById(`${id}`);
      const taskUl = document.createElement('ul');
      taskUl.id = element.uniqueId;
      taskUl.classList.add('collapsible');
      taskUl.innerHTML = `
			<li>
			<div class="collapsible-header">
				<span class='eleName'>${element.name}</span>
				<span class ='eleDate'>${element.duedate}</span>
			</div>
			<div class="collapsible-body">
			<p>${element.description}</p>
			<p> ${element.notes}
      <span style='display:flex; justify-content:flex-end'>
      <a class="waves-effect waves-light btn-small purple lighten-3" id='editBtn${element.uniqueId}'>
			Edit Task</a>
			<a class="waves-effect waves-red btn-small purple lighten-3" id='deleteBtn${element.uniqueId}'>
			Delete Task</a>
			</span>
			</p>
			</div>
			</li>`;
      if (!parent) {
        return;
      }
      parent.append(taskUl);

      const elems = document.querySelectorAll('.collapsible');
      const instances = M.Collapsible.init(elems);

      const indexOfTask = array.indexOf(element);
      const renderedTask = array.splice(indexOfTask, 1);
      renderedTaskList.push(renderedTask);

      const parentDiv = element.parent;
      if (!parentDiv) {
        const index = array.indexOf(element);
        array.splice(index, 1);
        const storedTasks = JSON.parse(localStorage.getItem('taskList'));
        storedTasks.splice(index, 1);
        localStorage.setItem('taskList', storedTasks);
        return renderTask(array);
      }

      const deleteBtn = document.getElementById(`deleteBtn${element.uniqueId}`);
      deleteBtn.addEventListener('click', () => {
        const id = element.uniqueId;
        const taskUl = deleteBtn.closest('ul');
        let storedTasks = JSON.parse(localStorage.getItem('taskList'));
        storedTasks = _.flatten(storedTasks);

        for (const task of storedTasks) {
          if (task.uniqueId === id) {
            const indexOfTask = storedTasks.indexOf(task);
            renderedTaskList.splice(indexOfTask, 1);
            toLocalStorage('taskList', renderedTaskList);
          }
        }
        taskUl.remove();
      });

      const editBtn = document.getElementById(`editBtn${element.uniqueId}`);
      editBtn.addEventListener('click', () => {
        let storedTasks = JSON.parse(localStorage.getItem('taskList'));
        storedTasks = _.flatten(storedTasks);
        const id = element.uniqueId;


        for (const task of storedTasks) {
          if (task.uniqueId === id) {
            const indexOfTask = storedTasks.indexOf(task);
            let divId = parent.id;
            let taskModalTrigger = document.getElementById(`taskModalTrigger${divId}`);
            let taskModalTitle = document.getElementById('modalTitle');
            let taskModal = document.getElementById('taskModal');

            taskModalTitle.textContent = 'Edit a task';
            submitBtn.textContent = 'Edit task';
            taskModalTrigger.click();

            instances.close();
          }
        }
      })
    });
    toLocalStorage('taskList', renderedTaskList);
  }
};

export const tasksFromLocalStorage = () => {
  const retrievedItem = localStorage.getItem('taskList');
  const items = JSON.parse(retrievedItem);
  if (!items) {
  }
  if (items) {
    for (const item of items) {
      renderTask(item);
    }
  }
};
