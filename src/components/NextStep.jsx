import React, { useState, useEffect } from 'react';
import '../styles/NextStep.css';

const STORAGE_KEYS = {
  TASKS: 'next_step_tasks',
  CURRENT_TASK: 'next_step_current_task',
  RESULT_INPUT: 'next_step_result_input'
};

const NextStep = () => {
  // Initialize state with values from localStorage
  const [inputValue, setInputValue] = useState('');
  const [currentTask, setCurrentTask] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_TASK);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading current task:', error);
      return null;
    }
  });

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  });

  const [systemOrder, setSystemOrder] = useState(() => 
    currentTask ? 'JUST DO' : 'Write Down what you wanna do'
  );
  
  const [showStatusModal, setShowStatusModal] = useState(() => 
    Boolean(currentTask)
  );
  
  const [resultInput, setResultInput] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.RESULT_INPUT) || '';
    } catch (error) {
      console.error('Error loading result input:', error);
      return '';
    }
  });

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }, [tasks]);

  // Save current task whenever it changes
  useEffect(() => {
    try {
      if (currentTask) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_TASK, JSON.stringify(currentTask));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_TASK);
      }
    } catch (error) {
      console.error('Error saving current task:', error);
    }
  }, [currentTask]);

  // Save result input whenever it changes
  useEffect(() => {
    try {
      if (resultInput.trim()) {
        localStorage.setItem(STORAGE_KEYS.RESULT_INPUT, resultInput);
      } else {
        localStorage.removeItem(STORAGE_KEYS.RESULT_INPUT);
      }
    } catch (error) {
      console.error('Error saving result input:', error);
    }
  }, [resultInput]);

  const handleMouseEnter = (e) => {
    if (currentTask) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all tasks and data? This cannot be undone.')) {
      // Clear only our app's data, not all localStorage
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      setTasks([]);
      setCurrentTask(null);
      setResultInput('');
      setShowStatusModal(false);
      setSystemOrder('Write Down what you wanna do');
    }
  };

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
    
    // Clean up result input from storage
    localStorage.removeItem(STORAGE_KEYS.RESULT_INPUT);
  };

  return (
    <div className="retro-layout">
    <div className="retro-container">
      <span className="note">only the  NEXT STEP can be done!</span>
      <h1 className="retro-title">
        <span className="system-order">{systemOrder}</span>
        <br /><br />
        <span className="user-text">
          {currentTask?.text || ''}
        </span>
      </h1>

        <div 
          className="input-wrapper"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <input
            type="text"
            className="retro-input"
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            value={inputValue}
            placeholder="Enter your task..."
            disabled={showStatusModal}
          />
        </div>

        <div 
          className="button-wrapper"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="retro-button"
            onClick={updateTask}
            disabled={showStatusModal}
          >
            Change the purpose
          </button>
        </div>

        {showTooltip && (
          <div 
            className="retro-tooltip"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`
            }}
          >
            Finish the current task first!
          </div>
        )}

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

        <div className="clear-data-wrapper">
          <button
            className="retro-button clear-data"
            onClick={clearAllData}
          >
            Clear All Data
          </button>
        </div>
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