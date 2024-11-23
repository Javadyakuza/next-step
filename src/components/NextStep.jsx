import React, { useState } from 'react';
import '../styles/NextStep.css';

const NextStep = () => {
  const [inputValue, setInputValue] = useState('');
  const [currentTask, setCurrentTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [systemOrder, setSystemOrder] = useState('Write Down what you wanna do');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [resultInput, setResultInput] = useState('');

  const updateTask = () => {
    if (inputValue.trim()) {
      if (currentTask) {
        alert("Please complete the current task's status first!");
        return;
      }
      
      const newTask = {
        id: Date.now(),
        text: inputValue,
        status: null,
        result: '',
        timestamp: new Date().toLocaleString()
      };
      
      setCurrentTask(newTask);
      setSystemOrder('JUST DO');
      setInputValue('');
      setShowStatusModal(true);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      updateTask();
    }
  };

  const handleTaskCompletion = (status) => {
    if (!resultInput.trim() && status === 'done') {
      alert("Please enter the results before marking as done!");
      return;
    }

    const updatedTask = {
      ...currentTask,
      status: status,
      result: resultInput
    };

    setTasks(prevTasks => [...prevTasks, updatedTask]);
    setCurrentTask(null);
    setResultInput('');
    setShowStatusModal(false);
    setSystemOrder('Write Down what you wanna do');
  };

  return (
    <div className="retro-layout">
      <div className="retro-container">
        <h1 className="retro-title">
          <span className="system-order">{systemOrder}</span>
          <br /><br />
          <span className="user-text">
            {currentTask?.text || ''}
          </span>
        </h1>

        <input
          type="text"
          className="retro-input"
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          value={inputValue}
          placeholder="Enter your task..."
          disabled={showStatusModal}
        />

        <button
          className="retro-button"
          onClick={updateTask}
          disabled={showStatusModal}
        >
          Change the purpose
        </button>

        {showStatusModal && (
          <div className="status-modal">
            <textarea
              className="retro-textarea"
              value={resultInput}
              onChange={(e) => setResultInput(e.target.value)}
              placeholder="Enter task results..."
            />
            <div className="status-buttons">
              <button
                className="retro-button status-button done"
                onClick={() => handleTaskCompletion('done')}
              >
                DONE
              </button>
              <button
                className="retro-button status-button undone"
                onClick={() => handleTaskCompletion('undone')}
              >
                UNDONE
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="task-sidebar">
        <div className="task-list done-tasks">
          <h2>COMPLETED TASKS</h2>
          {tasks
            .filter(task => task.status === 'done')
            .map(task => (
              <div key={task.id} className="task-item done">
                <div className="task-text">{task.text}</div>
                <div className="task-result">{task.result}</div>
                <div className="task-timestamp">{task.timestamp}</div>
              </div>
            ))}
        </div>
        
        <div className="task-list undone-tasks">
          <h2>UNDONE TASKS</h2>
          {tasks
            .filter(task => task.status === 'undone')
            .map(task => (
              <div key={task.id} className="task-item undone">
                <div className="task-text">{task.text}</div>
                <div className="task-timestamp">{task.timestamp}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default NextStep;