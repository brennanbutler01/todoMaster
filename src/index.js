import { generateProject, projectsFromLocaleStorage } from './project.js';
import { generateTask } from './task.js';

const hook = document.getElementById('hook');

(() => {
	if (localStorage.length > 0) {
		projectsFromLocaleStorage();
  }
  document.addEventListener('DOMContentLoaded', function () {
    let elems = document.querySelector('#projectModal');
    let options = {
      generateProject: generateProject(),
    }
    let instances = M.Modal.init(elems, options);
  });
  
  document.addEventListener('DOMContentLoaded', function () {
    let elems = document.querySelector('#taskModal'); 
    let instances = M.Modal.init(elems);
    
  })
  document.addEventListener('DOMContentLoaded', function() {
    let elems = document.querySelectorAll('.datepicker');
    let instance = M.Datepicker.init(elems);
  });
})();
