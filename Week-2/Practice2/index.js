const inputTodo = document.getElementById('todo-input');
const btnTodoSubmit = document.getElementById('todo-submit-btn');
const listTodo = document.getElementById('todo-list');

const getTodoFromLS = () => {
  const data = localStorage.getItem('todo');
  return data ? JSON.parse(data) : [];
};

const saveTodoToLS = (todos) => {
  localStorage.setItem('todo', JSON.stringify(todos));
};

const showTodo = (todos) => {
  listTodo.innerHTML = ''; 
  
  // frag가 좋다고 해서 써봄
  const fragTodos = document.createDocumentFragment();

  todos.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.textContent = item;
    fragTodos.appendChild(listItem);
  });

  listTodo.appendChild(fragTodos);
};

btnTodoSubmit.addEventListener('click', () => {
  const currText = inputTodo.value.trim(); 

  if (currText !== '') {
    const currItems = getTodoFromLS(); 
    currItems.push(currText);          
    
    saveTodoToLS(currItems);
    showTodo(currItems); 
    
    inputTodo.value = '';
    inputTodo.focus(); 
  } else {
    window.alert('텍스트를 입력해 주세요.');
  }
});

// 첫화면 렌더용
showTodo(getTodoFromLS());