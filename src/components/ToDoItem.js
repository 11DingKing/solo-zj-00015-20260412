import React, {Component} from 'react';
import './ToDoItem.css';

class ToDoItem extends Component {

    render() {
        const { item, completed, color, deleteItem, toggleCompleted, toggleColor } = this.props;
        
        return (
            <div className={`ToDoItem ${completed ? 'completed' : ''}`}>
                <span 
                    className={`ToDoItem-ColorDot ToDoItem-ColorDot-${color}`}
                    onClick={toggleColor}
                />
                <p className="ToDoItem-Text" onClick={toggleCompleted}>{item}</p>
                <button className="ToDoItem-Delete"
                     onClick={deleteItem}>-
                </button>
            </div>
        );
    }
}

export default ToDoItem;
