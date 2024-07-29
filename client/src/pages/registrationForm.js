import React, { useState, useEffect } from 'react';
import axios from 'axios';
import botImg from '../assets/bot.jpeg';
import { TextField, Button, Container, Grid, Typography, Avatar, Input } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RegistrationForm = () => {
  const users = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    userType: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    picture: '',
  });
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [image, setImage] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState();

  function validateImg(e) {
    const file = e.target.files[0];
    if (file.size >= 2097152) {
      return alert('Max file size is 2mb');
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function uploadImage() {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'jmkohxmf');
    try {
      setUploadingImg(true);
      let res = await fetch('https://api.cloudinary.com/v1_1/aspiree14/image/upload', {
        method: 'post',
        body: data,
      });
      const urlData = await res.json();
      setUploadingImg(false);
      return urlData.url;
    } catch (error) {
      setUploadingImg(false);
      console.log(error);
      throw new Error('Failed to upload image');
    }
  }

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user.userType === 'Admin') {
      setFormData({
        ...formData,
        userType: 'User',
      });
    }
  }, [user.userType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!image) return alert('Please upload your profile picture');

      const imageUrl = await uploadImage();
      formData.picture = imageUrl;

      const response = await axios.post(`${backendUrl}/users/signup`, formData);
      console.log(response.data.message);

      setUploadingImg(true);
      setTimeout(() => {
        setUploadingImg(false);
        navigate('/search');
      }, 2000);
    } catch (error) {
      console.error('Failed to register:', error.response?.data?.error || error.message);
      setError(error.message);
    }
  };

  return (
    <Container>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <form onSubmit={handleSubmit}>
            <Typography variant="h4" align="center" gutterBottom>
              Create an account
            </Typography>
            <div className="signup-profile-pic__container">
              <Avatar src={imagePreview || botImg} alt="" sx={{ width: 100, height: 100 }} />
              <label htmlFor="image-upload" className="image-upload-label">
                <Input type="file" id="image-upload" hidden accept="image/png, image/jpeg" onChange={validateImg} />
              </label>
            </div>
            {error && <Typography color="error">{error}</Typography>}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="User Type"
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  fullWidth
                  required
                  select
                  SelectProps={{ native: true }}
                  disabled
                >
                  <option value="">Select User Type</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Middle Name"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
            <div className="mb-3" style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
              <Button
                variant="contained"
                type="submit"
                style={{ borderRadius: 35, fontWeight: 'bold', backgroundColor: 'green', color: 'white' }}
              >
                {uploadingImg ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RegistrationForm;
