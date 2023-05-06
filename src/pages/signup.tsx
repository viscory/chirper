import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { addDoc, collection } from '@firebase/firestore';

const EmailSignup = () => {
  // Define state variables for input values, error messages, and form validity
  const [hasMounted, setHasMounted] = React.useState(false);
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [tag, setTag] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [valid, setValid] = useState(false);

  // Check if user is already logged in; if yes, redirect to homepage
  useEffect(() => {
    if (window != undefined && localStorage.getItem('userId')) {
      router.push('/');
    }
  }, []);

  // Check if all required fields are filled out and passwords match; update validity flag
  useEffect(() => {
    if (username && tag && email && password && password2 && password == password2) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [username, tag, email, password, password2]);

  // Set mount flag to true after component has mounted
  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  // If component has not yet mounted, return null
  if (!hasMounted) {
    return null;
  }

  // Function to create a new user account and add user data to Firestore
  const loginUser = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        addDoc(collection(db, 'users'), {
          username: username,
          tag: tag,
          email: email,
          uid: user.uid,
        })
          .then(() => {
            localStorage.setItem('userId', user.uid);
            router.push('/');
          })
          .catch((error) => {
            setError(error.message);
          });
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser();
  };

  // Return the registration form
  return (
    <div className="form-container">
      <Head>
        <title>Sign Up</title>
      </Head>
      <form onSubmit={handleSubmit} className="form">
        <h1>Create an account</h1>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="tag">Tag</label>
          <input
            type="text"
            name="tag"
            id="tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password2">Confirm Password</label>
          <input
            type="password"
            name="password2"
            id="password2"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </div>
        <button type="submit" disabled={!valid}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default EmailSignup;
