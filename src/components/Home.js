import React from 'react';

export default function Home({ recipes }) {
  return (
    <div className="row">
      <h1>Recipe collection</h1>
      <section>
        {recipes.map((recipe) => (
          <div>
            <h3 className="mt-3">{recipe.name}</h3>
            <p>{recipe.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
