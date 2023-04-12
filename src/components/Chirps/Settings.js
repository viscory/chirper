import React, { useEffect, useState } from 'react';
import { onSnapshot, doc, updateDoc, collection, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { BsArrowLeft } from "react-icons/bs"
import { db } from '@/firebase';

const Settings = () => {
  const router = useRouter();
  const profile_tag = window.location.pathname.split('/')[2];
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserId(localStorage.getItem('userId'));
    }
  }, []);

  useEffect(() => {
    if (userId) {
      onSnapshot(
        query(collection(db, 'users'), where('userId', '==', userId)),
        (snapshot) => {
          setUser(snapshot.docs[0].data());
        }
      );
    }
  }, [userId]);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const saveSettings = async () => {
    if (user) {
      await updateDoc(doc(db, 'users', userId), {
        username: user.username,
        userImg: user.userImg,
        tag: user.tag,
        email: user.email,
      });
      router.push(`/profile/${user.tag}`);
    }
  };

  return (
    <div className="settings-container">
      <div className='sticky top-0 bg-black flex items-center gap-4 z-10 font-medium text-[20px] px-4 py-2'>
            <BsArrowLeft className='cursor-pointer' onClick={() => router.push(`/`)} />
            Edit Profile
          </div>
      {user && (
        <>
          <div className="input-container">
            <label htmlFor="username">Username</label>
            <input
              className="input-field"
              type="text"
              name="username"
              value={user.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-container">
            <label htmlFor="userImg">Profile Image URL</label>
            <input
              className="input-field"
              type="text"
              name="userImg"
              value={user.userImg}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-container">
            <label htmlFor="tag">Profile Tag</label>
            <input
              className="input-field"
              type="text"
              name="tag"
              value={user.tag}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-container">
            <label htmlFor="email">Email</label>
            <input
              className="input-field"
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
            />
          </div>
          <button className="save-button" onClick={saveSettings}>
            Save
          </button>
        </>
      )}
    </div>
  );
};

export default Settings;
