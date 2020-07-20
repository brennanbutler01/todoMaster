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
	console.log(taskList);
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
			// taskParentProject
	);
};
const submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', taskSubmitHandler);

export const generateTaskParent = (parent) => {
	let parentProject = parent;
	parentDivArray.push(parentProject);
};

// const renderTask = (array) => {
// 	console.log(array);
// 	if (array.constructor == Object) {
// 		renderedTaskList.push(array);
// 		renderTask(array);
// 	} else {
// 		array.forEach((element) => {
// 			let parent = document.getElementById(`${element.parent.id}`);
// 			let dropdownDiv = document.createElement('div');
// 			dropdownDiv.classList.add('right-align');
// 			dropdownDiv.innerHTML = `
// 			<a class='dropdown-trigger btn-large waves-effect waves-light purple lighten-3' href='#' id= 'dropdown${element.id}' data-target='dropdown${element.id}'>See tasks!</a>
// 			`;
// 			console.log(element);
			// parent.firstElementChild.firstElementChild.firstElementChild.firstElementChild.
			// 	lastElementChild.insertAdjacentElement(
			// 	'afterend',
			// 	dropdownDiv
			// );
			// 	let taskItem = document.createElement('ul');
			// 	taskItem.id = `dropdown${element.parent.id}`;
			// 	taskItem.classList.add('dropdown-content');
			// 	taskItem.innerHTML = `
			// 	<li><a href="#!">${element.name}</a></li>
			//   </ul>
			// `;

			// // setTimeout(() => {
			// // 	let elems = document.getElementById(`dropdown${element.id}`);
			// // 	var instances = M.Dropdown.init(elems);
			// }, 300);

			// // let parentDiv = element.parent;
			// if (!parentDiv) {
			// 	let index = array.indexOf(element);
			// 	console.log(indexx);
			// 	array.splice(index, 1);
			// 	let storedTasks = JSON.parse(localStorage.getItem('taskList'));
			// 	storedTasks.splice(index, 1);
			// 	localStorage.setItem('taskList', storedTasks)
			// 	return renderTask(array);

			// }
			// parentDiv.insertAdjacentElement('beforeend', taskItem);
			// let renderedTask = array.splice(0, 1);
			// renderedTaskList.push(renderedTask);
// 		});
// 		// toLocalStorage('taskList', renderedTaskList);
// 	}
// };

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
