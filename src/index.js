import { generateProject, projectsFromLocaleStorage } from './project.js';

const hook = document.getElementById('hook');

(() => {
	if (localStorage.length > 0) {
		projectsFromLocaleStorage();
	}
})();

document.addEventListener('DOMContentLoaded', function () {
  let elems = document.querySelectorAll('.modal');
  let options = {
    generateProject : generateProject(),
  }
  let instances = M.Modal.init(elems, options);
});

