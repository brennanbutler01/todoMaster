import { collapisbleHandler, deleteButtonModalHandler } from './utility.js';
import { toLocalStorage } from './utility.js';
import { removeAssociatedTasks } from './project.js';
import { flatten } from 'lodash';

let taskList = [];
export let renderedTaskList = [];
let parentDivArray = [];


export const addTasksHandler = (taskBtn) => {
	let parentId =
		taskBtn.parentElement.parentElement.parentElement.parentElement
			.parentElement;
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
	let parent = parentDivArray[0];
	parentDivArray.splice(0,1);
	let newTask = {
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
	let taskName = taskModal.querySelector('#task_name').value;
	let taskDescription = taskModal.querySelector('#task_description').value;
	let taskDuedate = taskModal.querySelector('#task_duedate').value;
	let taskNotes = taskModal.querySelector('#task_notes').value;
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
	let parentProject = parent;
	parentDivArray.push(parentProject);
};

const renderTask = (array) => {
	if (array.constructor == Object) {
		taskList.push(array);
		renderTask(array);
	}
	else {
		array.forEach((element) => {
			let parent = document.getElementById(`${element.parent.id}`);
			let parentId = parent.id;
			console.log(parentId);
			let a = document.createElement('ul');
			a.classList.add('collapsible');
			a.innerHTML = `
			<li>
			<div class="collapsible-header">${element.name}</div>
			<div class="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
			</li>`;
			parent.append(a);

			
			var elems = document.querySelectorAll('.collapsible');
			var instances = M.Collapsible.init(elems);

			let indexOfTask = array.indexOf(element);
			array.splice(indexOfTask, 1);
			
			
			
			// let parentDiv = element.parent;
			// if (!parentDiv) {
			// 	let index = array.indexOf(element);
			// 	console.log(index);
			// 	array.splice(index, 1);
			// 	let storedTasks = JSON.parse(localStorage.getItem('taskList'));
			// 	storedTasks.splice(index, 1);
			// 	localStorage.setItem('taskList', storedTasks)
			// 	return renderTask(array);

			// }
			// parentDiv.insertAdjacentElement('beforeend', taskItem);
			// let renderedTask = array.splice(0, 1);
			// renderedTaskList.push(renderedTask);
		});
		toLocalStorage('taskList', array);
	}
};


export const createDeleteTaskModal = (parent, uniqueId) => {
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
