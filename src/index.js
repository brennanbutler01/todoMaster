import { generateProjectModal, projectsFromLocaleStorage } from './project.js';

const hook = document.getElementById('hook');

(() => {
	const addProjectButton = document.createElement('button');
	addProjectButton.id = 'addProjectBtn';
	addProjectButton.textContent = 'Add Project';
	hook.append(addProjectButton);

	if (localStorage.length > 0) {
		projectsFromLocaleStorage();
	}
})();

const addProjectButton = document.getElementById('addProjectBtn');
addProjectButton.addEventListener('click', generateProjectModal);

