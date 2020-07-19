import {createDeleteTaskModal} from './task.js'
export const closeModal = (modal) => {
	const span = document.getElementsByClassName('close')[0];
	span.addEventListener('click', () => {
		modal.remove();
	});


	window.onclick = function (event) {
		if (event.target == modal) {
			modal.remove();
		}
	};
};

export const generateModal = (modalId, templateHTML) => {
	const myModal = document.createElement('div');
	myModal.id = modalId;
	myModal.classList.add('modal');
	myModal.innerHTML = templateHTML;

	hook.append(myModal);
	myModal.style.display = 'block';
	return myModal;
};

export const toLocalStorage = (key, renderedObject) => {
	if (key === 'projectList') {
		localStorage.setItem(key, JSON.stringify(renderedObject));
	}
	if (key === 'taskList') {
		localStorage.setItem(key, JSON.stringify(renderedObject));
	}
}


export const collapisbleHandler = () => {
	let collapsible = document.getElementsByClassName('collapsible');
	let collapsibleTaskArray = Array.from(collapsible);

	collapsibleTaskArray.forEach((element) => {
		element.click();
		element.click();
		if (!element.classList.contains('listening')) {
			element.addEventListener('click', function () {
				element.classList.toggle('active');
				element.classList.add('listening');

				let content = element.nextElementSibling;

				if (content.style.display === 'block') {
					content.style.display = 'none';
				} else {
					content.style.display = 'block';
				}
			});
		}
	});
};

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