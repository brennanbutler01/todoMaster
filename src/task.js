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
	console.log(taskList);
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
	let parentProjectId = parentProject.id;
	let parentObject = {
		parentProjectId,
		parentProject
	}
	parentDivArray.push(parentObject);
};

const renderTask = (array) => {
	if (array.constructor == Object) {
		taskList.push(array);
		renderTask(array);
	}
	else {
		array.forEach((element) => {
			let id = element.parent.parentProjectId;
			let parent = document.getElementById(`${id}`);			
			let taskUl = document.createElement('ul');
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

			
			var elems = document.querySelectorAll('.collapsible');
			var instances = M.Collapsible.init(elems);

			let indexOfTask = array.indexOf(element);
			let renderedTask = array.splice(indexOfTask, 1);
			renderedTaskList.push(renderedTask)
			
			
			let parentDiv = element.parent;
			if (!parentDiv) {
				let index = array.indexOf(element);
				array.splice(index, 1);
				let storedTasks = JSON.parse(localStorage.getItem('taskList'));
				storedTasks.splice(index, 1);
				localStorage.setItem('taskList', storedTasks)
				return renderTask(array);

			}
		
			let deleteBtn = document.getElementById(`deleteBtn${element.uniqueId}`);
			console.log(deleteBtn);
		});
		toLocalStorage('taskList', renderedTaskList);
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
