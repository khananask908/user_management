"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Label, TextInput, Alert } from "flowbite-react";
import { API_URL } from "../constants";

// Reusable error message component
const ErrorMessage = ({ message }) => (
  <div style={{ color: "red" }}>{message}</div>
);

const UserForm = ({ onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({}); // Clear previous validation errors when the user changes the input
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        action: "createUser",
        ...formData,
      });
      onUserAdded(response.data);
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000); // Auto-dismiss success alert after 3 seconds
      onClose(); // Close the modal
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "An unexpected error occurred.";
      setErrors({ general: errorMessage });
    }
  };

  const validateForm = () => {
    const errors = {};
    const { firstName, lastName, username, email, password } = formData;

    // Validation rules
    const validations = [
      {
        field: "firstName",
        message: "First name is required",
        condition: !firstName.trim(),
      },
      {
        field: "lastName",
        message: "Last name is required",
        condition: !lastName.trim(),
      },
      {
        field: "username",
        message: "Username is required",
        condition: !username.trim(),
      },
      {
        field: "email",
        message: "Invalid email address",
        condition: !isValidEmail(email),
      },
      {
        field: "password",
        message: "Password must be at least 8 characters long",
        condition: password.trim().length < 8,
      },
    ];

    validations.forEach(({ field, message, condition }) => {
      if (condition) errors[field] = message;
    });

    return errors;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div>
      {showSuccessAlert && (
        <Alert color="success">User added successfully!</Alert>
      )}
      {errors.general && <ErrorMessage message={errors.general} />}

      <Label htmlFor="firstName" value="First Name" />
      <TextInput
        type="text"
        id="firstName"
        name="firstName"
        value={formData.firstName}
        onChange={handleInputChange}
      />
      {errors.firstName && <ErrorMessage message={errors.firstName} />}

      <Label htmlFor="lastName" value="Last Name" />
      <TextInput
        type="text"
        id="lastName"
        name="lastName"
        value={formData.lastName}
        onChange={handleInputChange}
      />
      {errors.lastName && <ErrorMessage message={errors.lastName} />}

      <Label htmlFor="username" value="Username" />
      <TextInput
        type="text"
        id="username"
        name="username"
        value={formData.username}
        onChange={handleInputChange}
      />
      {errors.username && <ErrorMessage message={errors.username} />}

      <Label htmlFor="email" value="Email" />
      <TextInput
        type="text"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
      />
      {errors.email && <ErrorMessage message={errors.email} />}

      <Label htmlFor="password" value="Password" />
      <TextInput
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
      />
      {errors.password && <ErrorMessage message={errors.password} />}

      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="col-span-full md:col-span-1 flex justify-between">
          <Button type="submit" onClick={handleSubmit}>
            Add User
          </Button>
          <Button type="button" color="gray" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
