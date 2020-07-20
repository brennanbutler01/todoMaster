import {
	addTasksHandler,
	tasksFromLocalStorage,
} from './task.js';
import { toLocalStorage } from './utility.js';
import { flatten, indexOf } from 'lodash';

let renderedProjects = [];
let projectList = [];

const createProject = (name, description) => {
	projectList.push({ name, description, id: Math.random().toFixed(3) });
	renderProject(projectList);
};

export const generateProject = () => {
	const projectModal = document.getElementById('projectModal');
	const submitProjectBtn = document.getElementById('submitProjectBtn');
	submitProjectBtn.addEventListener('click', () => {
		const projectName = projectModal.querySelector('#project_name').value;
		const projectDescription = projectModal.querySelector(
			'#project_description'
		).value;
		createProject(projectName, projectDescription);
	});
};

const deleteRenderedProject = (id) => {
	let parentProject = document.getElementById(id);
	parentProject.remove();
	removeLocalProject(id);
};

const removeLocalProject = (id) => {
	let projectItems = JSON.parse(localStorage.getItem('projectList'));
	let newItems;
	if (projectItems.length > 1) {
		newItems = _.flatten(projectItems);
		newItems.forEach((element) => {
			if (element.id == id) {
				let indexOfProjectToRemove = newItems.indexOf(element);
				newItems.splice(indexOfProjectToRemove, 1);
				renderedProjects.splice(indexOfProjectToRemove, 1);
				toLocalStorage('projectList', newItems);
			}
		});
	} else {
		renderedProjects.splice(0, 1);
		toLocalStorage('projectList', renderedProjects);
	}
};

const renderProject = (array) => {
	if (array.constructor === Object) {
		renderedProjects.push(array);
		renderProject(renderedProjects);
	} else {
		array.forEach((element) => {
			let projectItem = document.createElement('div');
			projectItem.id = element.id;
			projectItem.innerHTML = `
			<div class="row">
			<div class="col s8 offset-s2">
			  <div class="card pink lighten-5">
				<div class="card-content purple-text text-lighten-3">
				  <span class="card-title" id='card-title'>${element.name}</span>
				  <p>${element.description}</p>
				</div>
				<div class="card-action">
				  <a class='white-text btn-small purple lighten-3' href="#"><i class="material-icons left">delete_forever</i>Delete project</a>
				  <a class='white-text waves-effect waves-light btn-small purple lighten-3 modal-trigger' id = 'taskModalTrigger${element.id}' href="#taskModal">Add a task</a>
				</div>
			  </div>
			</div>
		  </div>	
           `;
			let deleteProjectButton = projectItem.querySelector('a');
			deleteProjectButton.addEventListener('click', (e) => {
				deleteRenderedProject(projectItem.id);
			});

			hook.append(projectItem);

			let renderedProject = array.splice(0, 1);
			renderedProjects.push(renderedProject);

			toLocalStorage('projectList', renderedProjects);
			let addTasksBtns = document.getElementById(`taskModalTrigger${element.id}`);
			addTasksHandler(addTasksBtns);
		});
	}

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
