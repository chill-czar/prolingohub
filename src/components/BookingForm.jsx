"use client";

import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import { isValidPhoneNumber } from "libphonenumber-js";
import "react-phone-input-2/lib/style.css";

import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormTextarea from "./FormTextarea";
import PrimaryButton from "./PrimaryButton";

export default function BookingForm({ onSubmit, isLoading = false }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    englishLevel: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const englishLevels = [
    { value: "beginner", label: "BEGINNER" },
    { value: "elementary", label: "ELEMENTARY" },
    { value: "intermediate", label: "INTERMEDIATE" },
    { value: "upper-intermediate", label: "UPPER-INTERMEDIATE" },
    { value: "advanced", label: "ADVANCED" },
  ];

  // ---------- VALIDATION (NEAT & READABLE) ----------
  const validate = () => {
    const e = {};

    if (!formData.name.trim()) {
      e.name = "Please enter your full name";
    }

    if (!formData.email.trim()) {
      e.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      e.email = "Invalid email address";
    }

    if (!formData.phone) {
      e.phone = "Phone number is required";
    } else if (!isValidPhoneNumber(`+${formData.phone}`)) {
      e.phone = "Invalid phone number";
    }

    if (!formData.englishLevel) {
      e.englishLevel = "Please select a level";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <form className="space-y-5" noValidate>
      {/* NAME */}
      <FormInput
        label="YOUR NAME"
        required
        value={formData.name}
        onChange={(v) => setFormData({ ...formData, name: v })}
        error={errors.name}
        placeholder="FULL NAME"
      />

      {/* EMAIL */}
      <FormInput
        label="EMAIL ADDRESS"
        type="email"
        required
        value={formData.email}
        onChange={(v) => setFormData({ ...formData, email: v })}
        error={errors.email}
        placeholder="YOUR WORKSHOP LINK WILL BE SENT HERE"
      />

      {/* PHONE */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wide text-blacky">
          Phone Number
          {errors.phone && (
            <span className="ml-1 text-redy">({errors.phone})</span>
          )}
        </label>

        <PhoneInput
          country="in"
          value={formData.phone}
          onChange={(phone) => setFormData({ ...formData, phone })}
          inputStyle={{
            width: "100%",
            height: "42px",
            borderRadius: "6px",
            borderColor: errors.phone ? "#ef4444" : "#e5e7eb",
            fontFamily: "DM Mono, monospace",
            fontSize: "13px",
          }}
          buttonStyle={{
            borderColor: errors.phone ? "#ef4444" : "#e5e7eb",
          }}
        />
      </div>

      {/* ENGLISH LEVEL */}
      <FormSelect
        label="SELECT YOUR ENGLISH LEVEL"
        options={englishLevels}
        value={formData.englishLevel}
        onChange={(v) => setFormData({ ...formData, englishLevel: v })}
        error={errors.englishLevel}
        placeholder="BEGINNER"
      />

      {/* DESCRIPTION */}
      <FormTextarea
        label="DESCRIPTION"
        placeholder="WRITE ANYTHING"
        rows={4}
        value={formData.description}
        onChange={(v) => setFormData({ ...formData, description: v })}
      />

      <div className="pt-4">
        <PrimaryButton onClick={handleSubmit} fullWidth disabled={isLoading}>
          {isLoading ? "Processing..." : "Proceed To Payment"}
        </PrimaryButton>
      </div>
    </form>
  );
}
