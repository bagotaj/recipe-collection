import React, { useState, useRef } from 'react';

import InputField from './InputField';
import TextareaField from './TextareaField';

import db from '../firebase/db';

export default function CreateRecipe() {
  const [fieldValues, setFieldValues] = useState({
    name: '',
    description: '',
  });

  const [formWasValidated, setFormWasValidated] = useState(false);

  const [formAlertText, setFormAlertText] = useState('');
  const [formAlertType, setFormAlertType] = useState('');

  const references = {
    name: useRef(),
    description: useRef(),
  };

  const [errors, setErrors] = useState({
    name: '',
    description: '',
  });

  const validators = {
    name: {
      required: isNotEmpty,
    },
    description: {
      required: isNotEmpty,
    },
  };

  function isNotEmpty(value) {
    return value !== '';
  }

  const errorTypes = {
    required: 'Hiányzó érték.',
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
        .add({
          name: fieldValues.name,
          description: fieldValues.description,
        })
        .then((docRef) => {
          setFieldValues({
            name: '',
            description: '',
          });
          setFormAlertText('Sikeres mentés.');
          setFormAlertType('success');
        });
    } else {
      setFormAlertText('Sikertelen mentés.');
      setFormAlertType('danger');
    }
  }

  return (
    <div className="row">
      <h1>Create a new Recipe</h1>
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
          reference={references.name}
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
      </form>
    </div>
  );
}
