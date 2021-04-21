import React from 'react';
import { Link } from 'react-router-dom';

export default function Home({ recipes }) {
  return (
    <div className="row">
      <h1>Recipe collection</h1>
      <section>
        {recipes.map((recipe, i) => (
          <div key={i}>
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
