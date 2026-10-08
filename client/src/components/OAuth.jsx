//import React from 'react'

import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase.js";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        if (!app) {
            console.warn("Google Sign-In is disabled: VITE_FIREBASE_API_KEY is not configured.");
            alert("Google Sign-In is temporarily unavailable. Please sign in with email and password.");
            return;
        }

        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
    
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            const { displayName, email, photoURL } = resultsFromGoogle.user;
    
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: displayName,
                    email,
                    googlePhotoUrl: photoURL,
                }),
            });
    
            const data = await res.json();
            if (res.ok) {
                dispatch(signInSuccess(data));
                navigate('/');
            } else {
                console.error('Failed to authenticate with server:', data);
            }
        } catch (error) {
            console.error('Error during Google sign-in:', error);
        }
    };
    


  return (
    <Button type='button' gradientDuoTone="purpleToPink" outline onClick=
    {handleGoogleClick}>
    <AiFillGoogleCircle className="w-6 h-6 mr-2"/>
    Continue With Google
</Button>
   
  )
}
