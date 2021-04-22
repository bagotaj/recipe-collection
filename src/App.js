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
import RecipePage from './components/RecipePage';
import EditRecipe from './components/EditRecipe';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [units, setUnits] = useState({});

  useEffect(() => {
    const unsubscribe = db.collection('recipes').onSnapshot((snapshot) => {
      const data = [];

      snapshot.docs.forEach((recipe) => {
        const docItem = recipe.data();

        if (recipe.id === 'valid-units') {
          setUnits(docItem);
        } else {
          docItem['docId'] = recipe.id;

          data.push(docItem);
        }
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
            <Route path="/edit-recipe/:id">
              <EditRecipe units={units} />
            </Route>
            <Route path="/recipe-page/:id">
              <RecipePage />
            </Route>
            <Route path="/create-recipe">
              <CreateRecipe units={units} />
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
