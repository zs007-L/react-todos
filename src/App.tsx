import { ChangeEvent, useState } from 'react'
import './App.css'

interface TodosList {
  id: number,
  title: string,
  checked: boolean
}

type State = 'all' | 'active' | 'completed'

function App() {
  const [todosList, setTodosList] = useState<TodosList[]>([])
  const [inputValue, setInputValue] = useState('')
  const [state, setState] = useState<State>('all')

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13 && inputValue) {
      setTodosList([...todosList, { id: todosList.length, title: inputValue, checked: false }])
      setInputValue('')
    }
  }

  const filters = todosList.filter(todos => todos.checked)

  const selectAll = () => {
    setTodosList(todosList.map((item) => {
      if (filters.length === todosList.length) {
        item.checked = false
      } else {
        item.checked = true
      }
      return item
    }))
  }

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    setTodosList(todosList.map((item, i) => {
      if (i === index) {
        item.checked = e.target.checked
      }
      return item
    }))
  }

  const handleDelete = (index: number) => {
    const result = confirm('确定要删除该选项吗？')
    if (result) {
      todosList.splice(index, 1)
      setTodosList([...todosList])
    }
  }

  const toggleState: Record<State, () => TodosList[]> = {
    all: () => {
      return todosList
    },
    active: () => {
      return todosList.filter(item => item.checked)
    },
    completed: () => {
      return todosList.filter(item => !item.checked)
    }
  }

  const listLis = () => {
    const data = toggleState[state]()
    return data.map((item, index) => (
      <div key={index}>
        <li>
          <div className={`${item.checked ? 'delete-line' : ''}`}>
            <input
              className='checkbox'
              type="checkbox"
              checked={item.checked}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleCheckbox(e, index)}
            />
            {item.title}
          </div>
          <span className='delete' onClick={() => handleDelete(index)}>删除</span>
        </li>
      </div>
    ))
  }

  const filterChecked = todosList.filter((item => !item.checked))

  const clearTodos = () => {
    setTodosList([...filterChecked])
  }

  const toggle = (e: Event) => {
    const type = (e.target as HTMLLIElement).dataset.type as State
    setState(type)
  }

  const footerElement = () => {
    return (
      todosList.length ? <ul className='footer-actions'>
        <li>{filterChecked.length}item left</li>
        <div className='footer-center'>
          <li
            className={`${state === 'all' ? 'active' : ''}`}
            data-type='all'
            onClick={(e: any) => toggle(e)}
          >All</li>
          <li
            className={`${state === 'active' ? 'active' : ''}`}
            data-type='active'
            onClick={(e: any) => toggle(e)}
          >Active</li>
          <li
            className={`${state === 'completed' ? 'active' : ''}`}
            data-type='completed'
            onClick={(e: any) => toggle(e)}
          >Completed</li>
        </div>
        {filters.length ? <li className='clear' onClick={clearTodos}>Clear Completed</li> : ''}
      </ul>
      : ""
    )
  }

  return (
    <div className="App">
      <h1 className='todos-title'>Todos</h1>
      <div className='todos-action'>
        <div className="todos-head">
          {todosList.length ? <span onClick={selectAll}>全选</span> : ''}
          <input
            className='todos-input'
            type="text"
            placeholder='请输入待办项'
            value={inputValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
            onKeyDown={(e: any) => handleKeyDown(e)}
          />
        </div>
        <ul className='todos-list'>
          {listLis()}
        </ul>
        {footerElement()}
      </div>
    </div>
  )
}

export default App
