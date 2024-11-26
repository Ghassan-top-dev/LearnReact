import React, { useState, useEffect } from 'react';
import './App.css';

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

const ShoppingListApp = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [lists, setLists] = useLocalStorage('shopping-lists', []);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [editingList, setEditingList] = useState(null);

  const showNotification = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const LandingPage = () => (
    <div className="landing-page">
      <div className="landing-content">
        <h1>Shoppe 🛒</h1>
        <div className="button-container">
          <button onClick={() => {
            setEditingList(null);
            setCurrentPage('create');
          }} className="primary-button">
            Create New List 🛍️
          </button>
          <button onClick={() => setCurrentPage('view')} className="secondary-button">
            View Lists 👀
          </button>
        </div>
      </div>

      <div class="findme" id="connect">
        <h2>Connect With Me!</h2>
          <a href="https://www.linkedin.com/in/ghassan-murad-agha-579a3730b/" target="_blank" rel="noreferrer">
            <button>LinkedIn</button>
          </a>
        </div>  

      
    </div>
  );

  const CreateList = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');
    const [price, setPrice] = useState('');
    const [listName, setListName] = useState('');
    const [budget, setBudget] = useState('');

    // Initialize form if editing an existing list
    useEffect(() => {
      if (editingList) {
        setListName(editingList.name);
        setBudget(editingList.budget.toString());
        setItems(editingList.items);
      }
    }, [editingList]);

    const addItem = () => {
      if (newItem && price) {
        setItems([...items, { name: newItem, price: parseFloat(price), checked: false }]);
        setNewItem('');
        setPrice('');
      }
    };

    const saveList = () => {
      if (listName && items.length > 0 && budget) {
        const parsedBudget = parseFloat(budget);
        const totalSpent = items.reduce((sum, item) => sum + item.price, 0);
        const remainingBudget = parsedBudget - totalSpent;

        const updatedList = {
          id: editingList ? editingList.id : Date.now(),
          name: listName,
          items,
          budget: parsedBudget,
          totalSpent,
          remainingBudget,
        };

        if (editingList) {
          // Update existing list
          setLists(lists.map(list => 
            list.id === editingList.id ? updatedList : list
          ));
          showNotification('List updated successfully!');
        } else {
          // Create new list
          setLists([...lists, updatedList]);
          showNotification('List saved successfully!');
        }

        setEditingList(null);
        setCurrentPage('view');
      }
    };

    return (
      <div className="create-list">
        <h2>{editingList ? 'Edit List' : 'Create New List'}</h2>
        <div className="form-group">
          <div className="input-group">
            <label>List Name</label>
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="My Shopping List"
            />
          </div>
          <div className="input-group">
            <label>Budget</label>
            <div className="budget-input">
              <span>$</span>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="100.00"
              />
            </div>
          </div>
        </div>

        <div className="add-item-section">
          <div className="add-item-form">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add item"
            />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
            />
            <button onClick={addItem} className="add-button">+</button>
          </div>

          <div className="items-list">
            {items.map((item, index) => (
              <div key={index} className="item-row">
                <span>{item.name}</span>
                <div className="item-actions">
                  <span>${item.price.toFixed(2)}</span>
                  <button
                    onClick={() => setItems(items.filter((_, i) => i !== index))}
                    className="delete-button"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="button-row">
          <button 
            onClick={() => {
              setEditingList(null);
              setCurrentPage('landing');
            }} 
            className="back-button"
          >
            Back
          </button>
          <button onClick={saveList} className="save-button">
            {editingList ? 'Update List' : 'Save List'}
          </button>
        </div>
      </div>
    );
  };

  const ViewLists = () => {
    const deleteList = (id) => {
      setLists(lists.filter(list => list.id !== id));
      showNotification('List deleted successfully!');
    };

    const editList = (list) => {
      setEditingList(list);
      setCurrentPage('create');
    };

    return (
      <div className="view-lists">
        <div className="lists-container">
          {lists.map(list => (
            <div key={list.id} className="list-card">
              <div className="list-header">
                <h3>{list.name}</h3>
                <div className="list-actions">
                  <button 
                    onClick={() => editList(list)} 
                    className="edit-button"
                  >
                    ✎
                  </button>
                  <button 
                    onClick={() => deleteList(list.id)} 
                    className="delete-button"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="budget-info">
                <div className="budget-text">
                  <span>Budget: ${list.budget.toFixed(2)}</span>
                  <span>Spent: ${list.totalSpent.toFixed(2)}</span>
                  <span className="remaining-budget">
                    Remaining: ${list.remainingBudget.toFixed(2)}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress ${list.totalSpent > list.budget ? 'over-budget' : ''}`}
                    style={{
                      width: `${Math.min((list.totalSpent / list.budget) * 100, 100)}%`
                    }}
                  />
                </div>
                <div className="items-section">
                  {list.items.map((item, index) => (
                    <div key={index} className="item-row">
                      <span>{item.name}</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => setCurrentPage('landing')} className="back-button">
          Back to Home
        </button>
      </div>
    );
  };

  const AlertComponent = () => (
    <div className="alert-container">
      {showAlert && (
        <div className="alert">
          {alertMessage}
        </div>
      )}
    </div>
  );

  return (

    <div className="app">
      <AlertComponent />
      {currentPage === 'landing' && <LandingPage />}
      {currentPage === 'create' && <CreateList />}
      {currentPage === 'view' && <ViewLists />}
    </div>
  );
};

export default ShoppingListApp;
