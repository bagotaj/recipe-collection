import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import InputField from './InputField';
import TextareaField from './TextareaField';

import db from '../firebase/db';

export default function EditRecipe({ units, categories }) {
  const { id } = useParams();

  const [fieldValues, setFieldValues] = useState({
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
        let ingredient = '';

        data.ingredients.forEach(
          (element) =>
            (ingredient +=
              element.amount + ' ' + element.unit + ' ' + element.name + '\n')
        );

        data.ingredients = ingredient;

        setFieldValues(data);
      });
  }, [id]);

  const [fieldValuesToDatabase, setFieldValuesToDatabase] = useState({
    name: '',
    description: '',
    ingredients: [],
    category: '',
  });

  const [formWasValidated, setFormWasValidated] = useState(false);

  const [formAlertText, setFormAlertText] = useState('');
  const [formAlertType, setFormAlertType] = useState('');

  const references = {
    name: useRef(),
    description: useRef(),
    ingredients: useRef(),
    category: useRef(),
  };

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    ingredients: '',
    category: '',
  });

  const validators = {
    name: {
      required: isNotEmpty,
    },
    description: {
      required: isNotEmpty,
    },
    ingredients: {
      required: isNotEmpty,
      unitChecker: isUnitExistAndSetIngredients,
    },
    category: {
      required: isNotEmpty,
    },
  };

  function isNotEmpty(value) {
    return value !== '';
  }

  function isUnitExistAndSetIngredients(value) {
    let lines = value.split(/\n/);
    let partsOfValue = lines.map((line) => line.split(' '));
    let unitsExist;
    let ingredients = [];

    for (let i = 0; i < partsOfValue.length; i++) {
      let number = partsOfValue[i][0];
      let result = 0;

      if (number.includes('/')) {
        let split = number.split('/');
        result = parseInt(split[0], 10) / parseInt(split[1], 10);
      } else {
        result = parseInt(number);
      }

      if (Number(result)) {
        if (units.units.includes(partsOfValue[i][1])) {
          let name = partsOfValue[i].slice(2);

          if (name.length > 1) {
            name = name.join(' ').replace(/,/g, ' ');
          }

          ingredients.push({
            amount: partsOfValue[i][0],
            unit: partsOfValue[i][1],
            name: name.toString(),
          });

          unitsExist = true;
        } else {
          unitsExist = false;
          return;
        }
      } else {
        if (units.units.includes(partsOfValue[i][0])) {
          unitsExist = false;
          return;
        } else {
          let name = partsOfValue[i].join(' ').replace(/,/g, ' ');

          ingredients.push({
            amount: partsOfValue[i][0],
            unit: partsOfValue[i][1],
            name: name.toString(),
          });

          unitsExist = true;
        }
      }
    }

    setFieldValuesToDatabase({
      name: fieldValues.name,
      description: fieldValues.description,
      ingredients: ingredients,
      category: fieldValues.category,
    });

    return unitsExist;
  }

  const errorTypes = {
    required: 'Missing value',
    unitChecker: 'Bad unit added',
  };

  function isFormValid() {
    let isFormValid = true;
    for (const fieldName of Object.keys(fieldValues)) {
      const isFieldValid = validateField(fieldName);
      if (!isFieldValid) {
        isFormValid = false;
      }
    }
    return isFormValid;
  }

  function validateField(fieldName) {
    const value = fieldValues[fieldName];
    let isValid = true;
    setErrors((previousErrors) => ({
      ...previousErrors,
      [fieldName]: '',
    }));

    if (validators[fieldName] !== undefined) {
      for (const [validationType, validatorFn] of Object.entries(
        validators[fieldName]
      )) {
        if (isValid) {
          isValid = validatorFn(value);
          if (!isValid) {
            const errorText = errorTypes[validationType];
            setErrors((previousErrors) => {
              return {
                ...previousErrors,
                [fieldName]: errorText,
              };
            });
            references[fieldName].current.setCustomValidity(errorText);
          }
        }
      }
    }
    return isValid;
  }

  function handleInputChange(e) {
    const fieldName = e.target.name;
    const value = e.target.value;

    setFieldValues({
      ...fieldValues,
      [fieldName]: value,
    });
    setErrors((previousErrors) => ({
      ...previousErrors,
      [fieldName]: '',
    }));
  }

  function handleInputBlur(e) {
    const name = e.target.name;
    validateField(name);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const isValid = isFormValid();

    if (isValid) {
      db.collection('recipes')
        .doc(id)
        .update(fieldValuesToDatabase)
        .then((docRef) => {
          setFieldValuesToDatabase({
            name: '',
            description: '',
            ingredients: [],
            category: '',
          });
          setFieldValues({
            name: '',
            description: '',
            ingredients: [],
            category: '',
          });
          setFormAlertText('Successful saving');
          setFormAlertType('success');
        });
    } else {
      setFormAlertText('Unsuccessful saving');
      setFormAlertType('danger');
    }
  }

  return (
    <div className="row">
      <h1>Edit {fieldValues.name}</h1>
      <form
        onSubmit={handleSubmit}
        noValidate={true}
        className={`needs-validation ${
          formWasValidated ? 'was-validated' : ''
        }`}
      >
        <InputField
          reference={references.name}
          name="name"
          labelText="Name"
          type="text"
          errors={errors}
          fieldValues={fieldValues}
          handleInputBlur={handleInputBlur}
          handleInputChange={handleInputChange}
          required={true}
        />
        <TextareaField
          reference={references.description}
          name="description"
          labelText="Description"
          rows="3"
          cols="30"
          errors={errors}
          fieldValues={fieldValues}
          handleInputBlur={handleInputBlur}
          handleInputChange={handleInputChange}
          required={true}
        />
        <TextareaField
          reference={references.ingredients}
          name="ingredients"
          labelText="Ingredients"
          rows="6"
          cols="30"
          errors={errors}
          fieldValues={fieldValues}
          handleInputBlur={handleInputBlur}
          handleInputChange={handleInputChange}
          required={true}
        />
        <div
          className={`mb-3 ${errors.category !== '' ? 'was-validated' : ''}`}
        >
          <label htmlFor="category" className="form-label m-2">
            Category
          </label>
          <select
            name="category"
            id="category"
            className="form-select m-2"
            value={fieldValues.category}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            ref={references.category}
            required={true}
          >
            <option value={''}>Choose!</option>
            {categories.map((category) => (
              <option value={category}>{category}</option>
            ))}
          </select>
          <div className="invalid-feedback">{errors.category}</div>
        </div>
        {formAlertText && (
          <div className={`alert mt-3 alert-${formAlertType}`} role="alert">
            {formAlertText}
          </div>
        )}
        <button className="btn btn-primary">Create</button>
      </form>
    </div>
  );
}
