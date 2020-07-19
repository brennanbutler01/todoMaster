
export const myTaskModalHTML = 
`

    <div class="modal-content">
        <span class="close">&times;</span>
    
        <h1>Add Task</h1>
    
        <form class="form-example">
        <div class="form-example">
        <label for="task-name">Task Name: </label>
        <input type="text" name="task-name" id="task-name" required>
        </div>
        <div class="form-example">
        <label for="task-description">Enter Description: </label>
        <input type="text" name="task-description" id="task-description" required>
        </div>
        <div class="form-example">
        <label for="task-duedate">Due Date: </label>
        <input type="text" name="task-duedate" id="task-duedate" required>
        </div>
        <div class="form-example">
        <label for="task-priority">Priority: </label>
        <input type="text" name="task-priority" id="task-priority" required>
        </div>
        <div class="form-example">
        <label for="task-notes">Enter Notes: </label>
        <input type="text" name="task-notes" id="task-notes" required>
        </div>
        <div class="form-example">
        <input type = 'button' id = 'submitBtn' value = 'Add task'></input>
        </div>
        </form>
    </div>`;

export const myDeleteModalHTML = 
    ` 
    <div class="modal-content">
    <span class="close">&times;</span>

    <h1>Are you sure that you want to delete this?</h1>
    <h3> This action cannot be undone...</h3>

    
    <button id = 'denyDeleteBtn'> Cancel </button>
    <button id = 'deleteConfirmationBtn'> Delete Item</button>
</div>`;
