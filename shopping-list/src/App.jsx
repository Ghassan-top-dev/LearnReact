// Step 4. Import React and useState

import React, {useState} from 'react'; 

// Step 5. Import the App.css file

import './App.css';

// Step 6. Create a functional component called App

export default function App(){
    const [tasks, setTasks] = useState([]); 
    const [inputValue, setInputValue] = useState(''); 


    const handleInputChange = (e) => {
        setInputValue(e.target.value); 

    };

    const handleDeleteTask = (index) => {
        const newTaskList = tasks.filter((task, i) => i !== index); 

        setTasks(newTaskList); 

    };

    const handleAddTask = () => {
        if(inputValue.trim()){

            setTasks([...tasks, inputValue]);
            setInputValue('');
        }
    };

    return (
        <div className='list'>
            <h1>Shopping List</h1>           
            <div className="input">
                <input 
                    type= "text" 
                    value = {inputValue}
                    onChange={handleInputChange}
                    placeholder='Enter an item'
                />

                <button onClick={handleAddTask}> Add </button>
            </div>
            <ul>
                {tasks.map((task, index) => (
                    <li key={index} className='task-item'>

                        {task}
                        <div className='tasks-actions'>
                            <button onClick={() => handleDeleteTask(index)}>Purchase</button>

                        </div>
                        

                    </li>
                ))}

            </ul>
        </div>

    );
}
