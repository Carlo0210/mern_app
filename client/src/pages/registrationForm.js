import React, { useState, useEffect } from 'react';
import axios from 'axios';
import botImg from '../assets/bot.jpeg';
import {
  TextField, Button, Container, Grid, Typography, Avatar, IconButton, CircularProgress,
  InputLabel, MenuItem, FormControl, Select, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

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
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Create an Account
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} container justifyContent="center">
            <Avatar src={imagePreview || botImg} sx={{ width: 100, height: 100 }} />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              type="file"
              onChange={validateImg}
            />
            <label htmlFor="image-upload">
              <IconButton color="primary" aria-label="upload picture" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>User Type</InputLabel>
              <Select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                required
                disabled
              >
                <MenuItem value="">Select User Type</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="User">User</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
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
          <Grid item xs={12} sm={4}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Middle Name"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} container justifyContent="center">
            <Button
              variant="contained"
              type="submit"
              sx={{ borderRadius: 35, fontWeight: 'bold', backgroundColor: 'green', color: 'white', mt: 2 }}
              disabled={uploadingImg}
            >
              {uploadingImg ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default RegistrationForm;
