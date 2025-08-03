// components/auth/SignupForm.tsx
'use client';

import { useState } from "react";
import SkillLevelSelect from "./SkillLevelSelect";
import AvatarUpload from "./AvatarUpload";

const SignupForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    bio: '',
    interests: '',
    avatar: null,
    skillLevel: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (file) => {
    setFormData(prev => ({ ...prev, avatar: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input name="fullName" placeholder="Full Name" onChange={handleChange} required />
      <input name="username" placeholder="Username" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <textarea name="bio" placeholder="Tell us about yourself..." onChange={handleChange} />
      <input name="interests" placeholder="Interests (comma-separated)" onChange={handleChange} />
      <SkillLevelSelect value={formData.skillLevel} onChange={val => setFormData(prev => ({ ...prev, skillLevel: val }))} />
      <AvatarUpload onUpload={handleAvatarUpload} />
      <button type="submit" className="btn">Sign Up</button>
    </form>
  );
};

export default SignupForm;
