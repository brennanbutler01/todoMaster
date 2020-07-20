import {createDeleteTaskModal} from './task.js'


export const toLocalStorage = (key, renderedObject) => {
	if (key === 'projectList') {
		localStorage.setItem(key, JSON.stringify(renderedObject));
	}
	if (key === 'taskList') {
		localStorage.setItem(key, JSON.stringify(renderedObject));
	}
}

export const deleteButtonModalHandler = (button, parent, uniqueId) => {
	let renderedDeleteButton = button[0];
	renderedDeleteButton.classList.remove('deleteTaskBtn');
	renderedDeleteButton.classList.add(parent);
	renderedDeleteButton.addEventListener('click', () => {
		let taskToDelete = renderedDeleteButton.closest('li');
		taskToDelete.id = uniqueId;
		console.log(taskToDelete);
		createDeleteTaskModal(taskToDelete, uniqueId);
	});
};