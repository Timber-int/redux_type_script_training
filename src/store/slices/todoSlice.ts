import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ITodo} from "../../models";
import {v4 as uuidv4} from 'uuid';

interface ITodoState {
    todos: ITodo[],
    todoDataToUpdate: null | ITodo,
    key: string,
}

const initialState: ITodoState = {
    todos: JSON.parse(`${localStorage.getItem('todos' )}`) || [],
    todoDataToUpdate: null,
    key: 'todos'
}

export const todoSlice = createSlice({
    name: 'todoSlice',
    initialState,
    reducers: {
        setTodo: (state, action: PayloadAction<{ title: string }>) => {
            state.todos.push({id: uuidv4(), title: action.payload.title, checked: false});
            localStorage.setItem(state.key, JSON.stringify(state.todos));
        },
        updateTodo: (state, action: PayloadAction<{ id: string, todoToUpdate: ITodo }>) => {
            state.todos = state.todos.map(todo => todo.id === action.payload.id ? action.payload.todoToUpdate : todo);
            localStorage.setItem(state.key, JSON.stringify(state.todos));
            state.todoDataToUpdate = null;
        },
        setChecked: (state, action: PayloadAction<{ id: string }>) => {
            state.todos = state.todos.map(todo => todo.id === action.payload.id ? {
                ...todo,
                checked: !todo.checked
            } : todo);
            localStorage.setItem(state.key, JSON.stringify(state.todos));
        },
        deleteTodoById: (state, action: PayloadAction<{ id: string }>) => {
            state.todos = state.todos.filter(todo => todo.id !== action.payload.id);
            localStorage.setItem(state.key, JSON.stringify(state.todos));
        },
        setTodoDataToUpdate: (state, action: PayloadAction<{ todo: ITodo }>) => {
            state.todoDataToUpdate = action.payload.todo;
        }
    }
});

const todoReducer = todoSlice.reducer;
const {setTodo, deleteTodoById, setChecked, setTodoDataToUpdate, updateTodo} = todoSlice.actions;
export const todoActions = {setTodo, deleteTodoById, setChecked, setTodoDataToUpdate, updateTodo};
export default todoReducer;
