import React, {Component} from 'react';
import './ToDo.css';
import ToDoItem from './components/ToDoItem';
import Logo from './assets/logo.png';

const COLORS = ['red', 'orange', 'yellow', 'green', 'blue'];

class ToDo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [
                {
                    'todo': 'clean the house',
                    'completed': false,
                    'color': 'blue'
                },
                {
                    'todo': 'buy milk',
                    'completed': false,
                    'color': 'green'
                }
            ],
            todo: '',
            filters: [],
            draggedIndex: null,
            dragOverIndex: null
        };
    };

    createNewToDoItem = () => {
      this.setState(({ list, todo }) => ({
        list: [
            ...list,
          {
            todo,
            completed: false,
            color: COLORS[Math.floor(Math.random() * COLORS.length)]
          }
        ],
        todo: ''
      }));
    };


    handleKeyPress = e => {
        if (e.target.value !== '') {
          if (e.key === 'Enter') {
            this.createNewToDoItem();
          }
        }
    };

    handleInput = e => {
      this.setState({
        todo: e.target.value
      });
    };


    deleteItem = indexToDelete => {
      this.setState(({ list }) => ({
        list: list.filter((toDo, index) => index !== indexToDelete)
      }));
    };

    toggleCompleted = index => {
      this.setState(({ list }) => ({
        list: list.map((item, i) => 
          i === index ? { ...item, completed: !item.completed } : item
        )
      }));
    };

    toggleColor = index => {
      this.setState(({ list }) => {
        const currentColor = list[index].color;
        const currentColorIndex = COLORS.indexOf(currentColor);
        const nextColorIndex = (currentColorIndex + 1) % COLORS.length;
        return {
          list: list.map((item, i) => 
            i === index ? { ...item, color: COLORS[nextColorIndex] } : item
          )
        };
      });
    };

    toggleFilter = color => {
      this.setState(({ filters }) => {
        if (filters.includes(color)) {
          return { filters: filters.filter(f => f !== color) };
        } else {
          return { filters: [...filters, color] };
        }
      });
    };

    handleDragStart = (e, index) => {
      this.setState({ draggedIndex: index });
      e.dataTransfer.effectAllowed = 'move';
    };

    handleDragOver = (e, index) => {
      e.preventDefault();
      this.setState({ dragOverIndex: index });
    };

    handleDragLeave = () => {
      this.setState({ dragOverIndex: null });
    };

    handleDrop = (e, index) => {
      e.preventDefault();
      const { list, draggedIndex } = this.state;
      
      if (draggedIndex === null || draggedIndex === index) {
        this.setState({ draggedIndex: null, dragOverIndex: null });
        return;
      }

      const newList = [...list];
      const [draggedItem] = newList.splice(draggedIndex, 1);
      newList.splice(index, 0, draggedItem);

      this.setState({
        list: newList,
        draggedIndex: null,
        dragOverIndex: null
      });
    };

    handleDragEnd = () => {
      this.setState({ draggedIndex: null, dragOverIndex: null });
    };

    getFilteredList = () => {
      const { list, filters } = this.state;
      if (filters.length === 0) {
        return list;
      }
      return list.filter(item => filters.includes(item.color));
    };

    getSortedList = () => {
      const filteredList = this.getFilteredList();
      const incomplete = filteredList.filter(item => !item.completed);
      const complete = filteredList.filter(item => item.completed);
      return [...incomplete, ...complete];
    };

    render() {
        const sortedList = this.getSortedList();
        const { filters, draggedIndex, dragOverIndex } = this.state;

        return (
            <div className="ToDo">
                <img className="Logo" src={Logo} alt="React logo"/>
                <h1 className="ToDo-Header">React To Do</h1>
                <div className="ToDo-Container">

                    <div className="ToDo-Filters">
                        {COLORS.map(color => (
                            <button
                                key={color}
                                className={`Filter-Button Filter-Button-${color} ${filters.includes(color) ? 'active' : ''}`}
                                onClick={() => this.toggleFilter(color)}
                            >
                                {color}
                            </button>
                        ))}
                        {filters.length > 0 && (
                            <button
                                className="Filter-Button Filter-Button-Clear"
                                onClick={() => this.setState({ filters: [] })}
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    <div className="ToDo-Content">
                        {sortedList.map((item, displayIndex) => {
                            const originalIndex = this.state.list.findIndex(i => i.todo === item.todo && i.color === item.color && i.completed === item.completed);
                            const isDragging = draggedIndex === originalIndex;
                            const isDragOver = dragOverIndex === originalIndex;
                            
                            return (
                                <div
                                    key={originalIndex}
                                    className={`ToDoItem-Wrapper ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
                                    draggable
                                    onDragStart={(e) => this.handleDragStart(e, originalIndex)}
                                    onDragOver={(e) => this.handleDragOver(e, originalIndex)}
                                    onDragLeave={this.handleDragLeave}
                                    onDrop={(e) => this.handleDrop(e, originalIndex)}
                                    onDragEnd={this.handleDragEnd}
                                >
                                    <ToDoItem
                                        item={item.todo}
                                        completed={item.completed}
                                        color={item.color}
                                        deleteItem={this.deleteItem.bind(this, originalIndex)}
                                        toggleCompleted={() => this.toggleCompleted(originalIndex)}
                                        toggleColor={() => this.toggleColor(originalIndex)}
                                    />
                                </div>
                            );
                          }
                        )}
                    </div>

                    <div>
                       <input type="text" value={this.state.todo} onChange={this.handleInput} onKeyPress={this.handleKeyPress}/>
                       <button className="ToDo-Add" onClick={this.createNewToDoItem}>+</button>
                    </div>

                </div>
            </div>
        );
    }
}

export default ToDo;
