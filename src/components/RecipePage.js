import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import db from '../firebase/db';

export default function RecipePage() {
  const { id } = useParams();

  const [pageElements, setPageElements] = useState({
    name: '',
    description: '',
    ingredients: [],
    category: '',
  });

  useEffect(() => {
    db.collection('recipes')
      .doc(id)
      .get()
      .then((docRef) => {
        let data = docRef.data();

        setPageElements(data);
      });
  }, [id]);

  return (
    <div>
      <h1>{pageElements.name}</h1>
      <p>{pageElements.description}</p>
      <ul>
        {pageElements?.ingredients.map((ingredient, i) => (
          <li key={ingredient + i}>
            {ingredient.amount + ' ' + ingredient.unit + ' ' + ingredient.name}
          </li>
        ))}
      </ul>
      <p>Category:</p>
      <p>
        <b>{pageElements.category}</b>
      </p>
      <Link to={`/edit-recipe/${id}`} className="link">
        <p>edit this recipe</p>
      </Link>
    </div>
  );
}
