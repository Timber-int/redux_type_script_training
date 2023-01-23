import React, {useEffect} from 'react';
import {SubmitHandler, useForm} from "react-hook-form";
import {ITodo} from "./models";
import {useAppDispatch, useAppSelector} from "./hooks";
import {todoActions} from "./store/slices";
import {joiResolver} from "@hookform/resolvers/joi";
import {todoValidator} from "./validator";

const App = () => {

    const {handleSubmit, register, reset, getValues, setValue, formState: {errors},} = useForm<ITodo>({
        resolver: joiResolver(todoValidator),
        mode: 'onTouched',
    });

    const {todos, todoDataToUpdate} = useAppSelector(state => state.todoReducer);

    const dispatch = useAppDispatch();

    const submit: SubmitHandler<ITodo> = (data: ITodo) => {

        if (todoDataToUpdate) {
            dispatch(todoActions.updateTodo({
                id: todoDataToUpdate.id,
                todoToUpdate: {...todoDataToUpdate, title: data.title}
            }));
            reset();
            return;
        }

        dispatch(todoActions.setTodo({title: data.title}));
        reset();
    }

    useEffect(() => {
        if (todoDataToUpdate) {
            setValue('title', todoDataToUpdate.title);
        }
    }, [todoDataToUpdate]);

    return (
        <div className={'container'}>
            <div className={'form_container'}>
                <form onSubmit={handleSubmit(submit)}>
                    <div className={'errors_span'}>{errors.title && <span>{errors.title.message}</span>}</div>
                    <input type="text" {...register('title')} name={'title'} placeholder={'Create todo...'}/>
                    <input type="submit" value={todoDataToUpdate ? 'Update' : 'Create'}/>
                </form>
            </div>
            <div className={'todos_container'}>
                {
                   todos && todos.map((todo: ITodo, index) => (
                        <div className={'todo_box'} key={todo.id}>
                            {index + 1})
                            <input type="checkbox"
                                   checked={todo.checked}
                                   onChange={() => todo.checked}
                                   onClick={() => dispatch(todoActions.setChecked({id: todo.id}))}
                            />
                            <span style={{textDecoration: todo.checked ? 'line-through' : ''}}>{todo.title}</span>
                            <button onClick={() => dispatch(todoActions.deleteTodoById({id: todo.id}))}>Delete</button>
                            <button onClick={() => dispatch(todoActions.setTodoDataToUpdate({todo}))}>Update</button>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export {App};
