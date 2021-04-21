import './App.scss';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from 'react-router-dom';

import { useEffect, useState } from 'react';

import db from './firebase/db';

import Home from './components/Home';
import CreateRecipe from './components/CreateRecipe';

function App() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection('recipes').onSnapshot((snapshot) => {
      const data = [];

      snapshot.docs.forEach((product) => {
        const docItem = product.data();
        docItem['docId'] = product.id;

        data.push(docItem);
      });

      setRecipes(data);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Router>
      <div>
        <header>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <NavLink to="/" className="navbar-brand">
                Recipe Collection
              </NavLink>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <NavLink
                      className="nav-link active"
                      aria-current="page"
                      to="/"
                    >
                      Home
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/create-recipe">
                      Create recipe
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
        <main className="container mt-5">
          <Switch>
            <Route path="/create-recipe">
              <CreateRecipe />
            </Route>
            <Route exact path="/">
              <Home recipes={recipes} />
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
