import {
	generateModal,
	closeModal,
	collapisbleHandler,
	deleteButtonModalHandler,
} from './utility.js';
import { myTaskModalHTML, myDeleteModalHTML } from './innerHtml.js';
import { toLocalStorage } from './utility.js';
import { removeAssociatedTasks } from './project.js'
import { flatten } from 'lodash';

let taskList = [];
export let renderedTaskList = [];

export const addTasksHandler = (taskBtns) => {
	taskBtns.forEach((button) => {
		button.addEventListener('click', generateTaskModal);
	});
};

const createTaskList = (
	name,
	description,
	duedate,
	priority,
	notes,
	parent
) => {
	taskList.push({
		name,
		description,
		duedate,
		priority,
		notes,
		parent,
		uniqueId: Math.random(),
	});
	renderTask(taskList);
};

const generateTaskModal = () => {
	const taskModal = generateModal('taskModal', myTaskModalHTML);

	let taskParentProject = event.target;
	taskParentProject = taskParentProject.dataset.id;

	const submitBtn = taskModal.querySelector('#submitBtn');
	submitBtn.addEventListener('click', () => {
		const taskName = taskModal.querySelector('#task-name').value;
		const taskDescription = taskModal.querySelector('#task-description').value;
		const taskDuedate = taskModal.querySelector('#task-duedate').value;
		const taskPriority = taskModal.querySelector('#task-priority').value;
		const taskNotes = taskModal.querySelector('#task-notes').value;

		createTaskList(
			taskName,
			taskDescription,
			taskDuedate,
			taskPriority,
			taskNotes,
			taskParentProject
		);
	});

	closeModal(taskModal);
};

const renderTask = (array) => {
	if (array.constructor == Array) {
		array.forEach((element) => {
			let taskItem = document.createElement('li');
			taskItem.innerHTML = `
        <button type="button" class="collapsible">${element.name} : ${element.duedate}</button>
        <div class="content">
            <h6>
            ${element.name}
            </h6>
            <p>
            ${element.description}
            </p>
            <p>
            ${element.duedate}
            </p>
            <p>
            ${element.priority}
            </p>
            <p>
            ${element.notes}
            </p>
            <button type='button' class = 'deleteTaskBtn'>Delete Task?</button>
        </div>
       `;

			let parent = element.parent;
			console.log(parent);
			let parentUl = document.getElementById(parent);
			if (!parentUl) {
				let index = array.indexOf(element);
				array.splice(index, 1);
				let storedTasks = JSON.parse(localStorage.getItem('taskList'));
				storedTasks.splice(index, 1);
				localStorage.setItem('taskList', storedTasks)
				return renderTask(array);
			
			}
			parentUl.insertAdjacentElement('beforeend', taskItem);

			let renderedTask = array.splice(0, 1);
			renderedTaskList.push(renderedTask);
			collapisbleHandler();
			let deleteButton = document.getElementsByClassName('deleteTaskBtn');
			deleteButtonModalHandler(deleteButton, parent, element.uniqueId);
		});
		toLocalStorage('taskList', renderedTaskList);
	}
	else if (array.constructor == Object) {
		let taskItem = document.createElement('li');
			taskItem.innerHTML = `
        <button type="button" class="collapsible">${array.name} : ${array.duedate}</button>
        <div class="content">
            <h6>
            ${array.name}
            </h6>
            <p>
            ${array.description}
            </p>
            <p>
            ${array.duedate}
            </p>
            <p>
            ${array.priority}
            </p>
            <p>
            ${array.notes}
            </p>
            <button type='button' class = 'deleteTaskBtn'>Delete Task?</button>
        </div>
       `;

			let parent = array.parent;
			let parentUl = document.getElementById(`${parent}`);
			parentUl.insertAdjacentElement('beforeend', taskItem);

			let renderedTask = array.splice(0, 1);
			renderedTaskList.push(renderedTask);
			collapisbleHandler();
			let deleteButton = document.getElementsByClassName('deleteTaskBtn');
			deleteButtonModalHandler(deleteButton, parent, array.uniqueId);
		};
}


let myModalIsVisible = false;

export const createDeleteTaskModal = (parent, uniqueId) => {
	let myModal = document.createElement('div');

	let anyDeletesOpen = document.getElementById('deleteModal');
	if (anyDeletesOpen) {
		anyDeletesOpen.remove();
	}
	myModal.classList.add('modal');
	myModal.style.display = 'block';
	myModal.id = 'deleteModal';
	myModal.innerHTML = myDeleteModalHTML;
	if (myModalIsVisible === false) {
		parent.insertAdjacentElement('afterbegin', myModal);
	}

	myModalIsVisible = true;

	const deleteModalCancelBtn = document.getElementById('denyDeleteBtn');
	deleteModalCancelBtn.addEventListener('click', () => {
		myModal.remove();
	});

	const deleteModalConfirmationBtn = document.getElementById(
		'deleteConfirmationBtn'
	);

	deleteModalConfirmationBtn.addEventListener('click', () => {
		let items = JSON.parse(localStorage.getItem('taskList'));
		items = _.flatten(items);
		for (const task of items) {
			if (task.uniqueId === uniqueId) {
				let toBeDeletedTask = task;
				let indexOfTask = items.indexOf(toBeDeletedTask);
				items.splice(indexOfTask, 1);
				parent.remove();
				myModal.remove();
				renderedTaskList.splice(indexOfTask, 1);
				toLocalStorage('taskList', renderedTaskList);
				if (renderedTaskList.length === 0) {
					localStorage.removeItem('taskList');
				}
			}
		}
	});
	

	window.onclick = function (event) {
		console.log(event);
	};

	closeModal(myModal);

	myModalIsVisible = false;
};

export const tasksFromLocalStorage = () => {
	let retrievedItem = localStorage.getItem('taskList');
	let items = JSON.parse(retrievedItem);
	if (!items) {
	}
	if (items) {
		for (const item of items) {
			renderTask(item);
		}
	}
};
