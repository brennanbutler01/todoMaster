import {
	addTasksHandler,
	tasksFromLocalStorage,
	renderedTaskList,
} from './task.js';
import { closeModal, generateModal } from './utility.js';
import { myProjectModalHTML } from './innerHtml.js';
import { toLocalStorage } from './utility.js';
import { flatten, indexOf, difference } from 'lodash';
let renderedProjects = [];
let projectList = [];

const createProject = (name, description) => {
	projectList.push({ name, description, id: Math.random().toFixed(3) });
	renderProject(projectList);
};

export const generateProjectModal = () => {
	const projectModal = generateModal('projectModal', myProjectModalHTML);

	const projectModalContent = document.querySelector('.projectModal');
	console.log(projectModalContent);

	projectModalContent.classList.add('projectModal');

	const submitBtn = projectModal.querySelector('#submitBtn');
	submitBtn.addEventListener('click', () => {
		const projectName = projectModal.querySelector('#project-name').value;
		const projectDescription = projectModal.querySelector(
			'#project-description'
		).value;
		createProject(projectName, projectDescription);
	});

	closeModal(projectModal);
};

const deleteProjectHandler = (id) => {
	let parentProject = document.getElementById(id);

	parentProject.remove();

	removeLocalProject(id);
};

const removeLocalProject = (id) => {
	let projectItems = JSON.parse(localStorage.getItem('projectList'));
	let newItems = _.flatten(projectItems);

	newItems.forEach((element) => {
		if (element.id == id) {
			let indexOfProjectToRemove = newItems.indexOf(element);
			newItems.splice(indexOfProjectToRemove, 1);
			renderedProjects.splice(indexOfProjectToRemove, 1);
			toLocalStorage('projectList', newItems);
		}
	});
};

const renderProject = (array) => {
	if (array.constructor === Object) {
		let projectItem = document.createElement('div');
		projectItem.id = array.id;
		projectItem.innerHTML = `
        <h3>
        ${array.name}
        </h3>
        <p>
        ${array.description}
        </p>
        <button class = 'addTasks btn' data-id = ${array.id}>Add Tasks</button>
        <div class="dropdown">
            <button class="btn" style="border-left:1px solid navy">
                <i class="fa fa-caret-down"></i>
             </button>
            <div class="dropdown-content">
                <a>Delete Project</a>
            </div>
        </div>
        <ul> </ul>
       `;
		let deleteProjectButton = projectItem.querySelector('a');
		deleteProjectButton.addEventListener('click', () => {
			deleteProjectHandler(projectItem.id);
		});

		hook.append(projectItem);
		renderedProjects.push(array);

		toLocalStorage('projectList', renderedProjects);
	} else {
		array.forEach((element) => {
			let projectItem = document.createElement('div');
			projectItem.id = element.id;
			projectItem.innerHTML = `
            <h3>
            ${element.name}
            </h3>
            <p>
            ${element.description}
            </p>
            <button class = 'addTasks btn' data-id = ${element.id}>Add Tasks</button>
            <div class="dropdown">
                <button class="btn" style="border-left:1px solid navy">
                    <i class="fa fa-caret-down"></i>
                 </button>
                <div class="dropdown-content">
                    <a>Delete Project</a>
                </div>
            </div>
            <ul> </ul>
           `;
			let deleteProjectButton = projectItem.querySelector('a');
			deleteProjectButton.addEventListener('click', () => {
				deleteProjectHandler(projectItem.id);
			});

			hook.append(projectItem);

			let renderedProject = array.splice(0, 1);
			renderedProjects.push(renderedProject);

			toLocalStorage('projectList', renderedProjects);
		});

	}
	let addTasksBtns = document.querySelectorAll('.addTasks');
	addTasksHandler(addTasksBtns);
};

export const projectsFromLocaleStorage = () => {
	let retrievedItem = localStorage.getItem('projectList');
	let items = JSON.parse(retrievedItem);
	if (!items) {
		return;
	} else {
		for (const item of items) {
			renderProject(item);
		}
		tasksFromLocalStorage();
	}
};
