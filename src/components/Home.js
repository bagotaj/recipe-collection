import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import db from '../firebase/db';

export default function Home({ recipes, setRecipes }) {
  useEffect(() => {
    db.collection('recipes').onSnapshot((snapshot) => {
      const data = [];

      snapshot.docs.forEach((recipe) => {
        const docItem = recipe.data();

        if (recipe.id === 'valid-units') {
          return;
        } else {
          docItem['docId'] = recipe.id;

          data.push(docItem);
        }
      });

      setRecipes(data);
    });
  }, []);

  const [fieldValues, setFieldValues] = useState({
    name: '',
    ingredient: '',
  });

  function handleInputChange(e) {
    const fieldName = e.target.name;
    const value = e.target.value;

    setFieldValues({
      ...fieldValues,
      [fieldName]: value,
    });
  }

  function handleOnSubmitFiltering(e) {
    e.preventDefault();

    db.collection('recipes').onSnapshot((snapshot) => {
      const data = [];

      snapshot.docs.forEach((recipe) => {
        const docItem = recipe.data();

        if (recipe.id === 'valid-units') {
          return;
        } else {
          docItem['docId'] = recipe.id;

          data.push(docItem);
        }
      });

      setFilters(data);
    });
  }

  function setFilters(recipes) {
    let filtered = [];

    recipes.forEach((recipe) => {
      let isItInName = false;
      let isItInIngredient = [];

      if (fieldValues.name !== '' && fieldValues.ingredient !== '') {
        isItInName = searchInName(recipe);
        isItInIngredient = searchInIngredients(recipe);

        if (isItInName && isItInIngredient.length > 0) {
          filtered.push(recipe);
        }
      } else {
        if (fieldValues.ingredient === '') {
          isItInIngredient = [];
        } else {
          isItInIngredient = searchInIngredients(recipe);

          if (isItInIngredient.length > 0) {
            filtered.push(recipe);
          }
        }

        if (fieldValues.name === '') {
          isItInName = false;
        } else {
          isItInName = searchInName(recipe);

          if (isItInName) {
            filtered.push(recipe);
          }
        }
      }
    });

    setRecipes(filtered);
  }

  function searchInName(recipe) {
    let isItInName = recipe.name
      .toLowerCase()
      .includes(fieldValues.name.toLowerCase());

    return isItInName;
  }

  function searchInIngredients(recipe) {
    let isItInIngredient = recipe.ingredients.filter((ingredient) =>
      ingredient.name
        .toLowerCase()
        .includes(fieldValues.ingredient.toLowerCase())
    );

    return isItInIngredient;
  }

  return (
    <div className="row">
      <h1>Recipe collection</h1>
      <form className="d-flex" onSubmit={handleOnSubmitFiltering}>
        <div className="my-3 me-3">
          <input
            type="text"
            className="form-control"
            name="name"
            placeholder="name"
            value={fieldValues.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="my-3 me-3">
          <input
            type="text"
            className="form-control"
            name="ingredient"
            placeholder="ingredient"
            value={fieldValues.ingredient}
            onChange={handleInputChange}
          />
        </div>
        <button className="btn btn-primary my-3">Filter</button>
      </form>
      <section>
        {recipes.map((recipe, i) => (
          <div key={recipe.docId}>
            <Link to={`/recipe-page/${recipe.docId}`} className="link">
              <h3 className="mt-3">{recipe.name}</h3>
            </Link>
            <p>{recipe.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
