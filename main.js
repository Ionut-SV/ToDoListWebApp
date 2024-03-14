document.addEventListener('DOMContentLoaded', () => {
	const form = document.querySelector('#new-task-form');
	const input = document.querySelector('#new-task-input');
	const tasksList = document.querySelector('#tasks');
	const completedAllTasksButton = document.querySelector('#complete-all-tasks');
	const deleteAllTasksButton = document.querySelector('#delete-all-tasks');
	const showAllTasksButton = document.querySelector('#show-all-tasks');
	const showCompletedTasksButton = document.querySelector('#show-completed-tasks');
	const showOngoingTasksButton = document.querySelector('#show-ongoing-tasks');
	const taskCounterEl = document.querySelector('#task-counter');
	deleteAllTasksButton.readOnly = true;
	completedAllTasksButton.readOnly = true;
  
	let tasks = [];
	let completedTasks = [];
  
	form.addEventListener('submit', (e) => {
	  e.preventDefault();
  
	  const taskText = input.value.trim();
	  if (!taskText) {
		alert("Add something!!");
		return;
	  }
  
	  const task = { text: taskText, completed: false };
	  tasks.push(task);
	  renderTasks();
	  input.value = '';
  
	  saveTasksToLocalStorage();
	});
  
	showAllTasksButton.addEventListener('click', () => {
	  renderTasks();
	});
  
	showCompletedTasksButton.addEventListener('click', () => {
	  renderCompletedTasks();
	});
  
	showOngoingTasksButton.addEventListener('click', () => {
	  renderOngoingTasks();
	});
  
	function renderTasks() {
	  clearTasksList();
	  tasks.forEach((task) => {
		const taskEl = createTaskElement(task);
		tasksList.appendChild(taskEl);
	  });
	  updateTaskCounter();
	}
  
	function renderCompletedTasks() {
	  clearTasksList();
	  completedTasks.forEach((task) => {
		const taskEl = createTaskElement(task);
		tasksList.appendChild(taskEl);
	  });
	  updateTaskCounter();
	}
  
	function renderOngoingTasks() {
	  clearTasksList();
	  const ongoingTasks = tasks.filter((task) => !task.completed);
	  ongoingTasks.forEach((task) => {
		const taskEl = createTaskElement(task);
		tasksList.appendChild(taskEl);
	  });
	  updateTaskCounter();
	}
  
	function clearTasksList() {
	  tasksList.innerHTML = '';
	}
  
	function createTaskElement(task) {
	  const taskEl = document.createElement('div');
	  taskEl.classList.add('task');
	  if (task.completed) {
		taskEl.classList.add('completed');
	  }
  
	  const taskContentEl = document.createElement('div');
	  taskContentEl.classList.add('content');
  
	  const taskInputEl = document.createElement('input');
	  taskInputEl.classList.add('text');
	  taskInputEl.type = 'text';
	  taskInputEl.value = task.text;
	  taskInputEl.setAttribute('readonly', 'readonly');
  
	  taskContentEl.appendChild(taskInputEl);
  
	  const taskActionsEl = document.createElement('div');
	  taskActionsEl.classList.add('actions');
  
	  const taskEditEl = document.createElement('button');
	  taskEditEl.classList.add('edit');
	  taskEditEl.innerText = 'Edit';
  
	  const taskDeleteEl = document.createElement('button');
	  taskDeleteEl.classList.add('delete');
	  taskDeleteEl.innerText = 'Delete';
  
	  const taskCompleteEl = document.createElement('button');
	  taskCompleteEl.classList.add('complete');
	  taskCompleteEl.innerText = 'Complete';
  
	  taskActionsEl.appendChild(taskEditEl);
	  taskActionsEl.appendChild(taskDeleteEl);
	  taskActionsEl.appendChild(taskCompleteEl);
  
	  taskEl.appendChild(taskContentEl);
	  taskEl.appendChild(taskActionsEl);
  
	  taskEditEl.addEventListener('click', (e) => {
		if (taskEditEl.innerText.toLowerCase() == "edit") {
		  taskEditEl.innerText = "Save";
		  taskInputEl.removeAttribute("readonly");
		  taskInputEl.focus();
		} else {
		  taskEditEl.innerText = "Edit";
		  taskInputEl.setAttribute("readonly", "readonly");
		}
	  });
	  
	  taskDeleteEl.addEventListener('click', () => {
		deleteTask(task);
	  });
  
	  taskCompleteEl.addEventListener('click', () => {
		markTaskAsCompleted(task);
	  });
	  
	  return taskEl;
	}
  
	function deleteTask(task) {
	  tasks = tasks.filter((t) => t !== task);
	  completedTasks = completedTasks.filter((t) => t !== task);
	  renderTasks();
  
	  saveTasksToLocalStorage();
	}
  
	function markTaskAsCompleted(task) {
	  if (task.completed) return;
  
	  task.completed = true;
	  completedTasks.push(task);
	  renderTasks();
  
	  saveTasksToLocalStorage();
	}
  
	deleteAllTasksButton.addEventListener('click', () => {
	  while (tasksList.firstChild) {
		tasksList.removeChild(tasksList.firstChild);
	  }
	  tasks = [];
	  completedTasks = [];
	  ongoingTasks = [];
	  updateTaskCounter();
  
	  saveTasksToLocalStorage();
	});
	
	completedAllTasksButton.addEventListener('click', () => {
		completeAllTasks();
	});
	
	function completeAllTasks() {
		tasks.forEach((task) => {
		  task.completed = true;
		  completedTasks.push(task);
		});
		
		renderTasks();
		updateTaskCounter();
		saveTasksToLocalStorage();
	  }
	
	function updateTaskCounter() {
		const totalTasks = tasks.length;
		const ongoingTasks = tasks.filter((task) => !task.completed).length;
		const completedTasks = totalTasks - ongoingTasks;
	
		taskCounterEl.textContent = `Total: ${totalTasks}, Ongoing: ${ongoingTasks}, Completed: ${completedTasks}`;
	} 
	
	function loadTasksFromLocalStorage() {
	  const storedTasks = localStorage.getItem('tasks');
	  if (storedTasks) {
		tasks = JSON.parse(storedTasks);
		renderTasks();
	  }
  
	  const storedCompletedTasks = localStorage.getItem('completedTasks');
	  if (storedCompletedTasks) {
		completedTasks = JSON.parse(storedCompletedTasks);
	  }
	}
  
	
	function saveTasksToLocalStorage() {
	  localStorage.setItem('tasks', JSON.stringify(tasks));
	  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
	}
  
	
	loadTasksFromLocalStorage();
  });