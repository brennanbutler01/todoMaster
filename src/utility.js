
export const toLocalStorage = (key, renderedObject) => {
	if (key === 'projectList') {
		localStorage.setItem(key, JSON.stringify(renderedObject));
	}
	if (key === 'taskList') {
		localStorage.setItem(key, JSON.stringify(renderedObject));
	}
}
