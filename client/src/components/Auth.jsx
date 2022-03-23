import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import signinImage from '../assets/hero.jpg';

// import { initialState } from 'stream-chat-react/dist/components/Channel/channelState';

const cookies = new Cookies();

const initialState = {
    fullName:'',
    username:'',
    password:'',
    confirmPassword:'',
    phoneNumber:'',
    avatarURL:''
}

const Auth = () => {

    const[form,setForm] = useState(initialState);

    const [isSignup, setIsSignup] = useState(false);

    const handleChange = (e) => { 
        // form is not a single text field, its an object, ...form is use to spread all the other input fields because we still want to keep them while we focus on one.
        setForm({...form,[e.target.name]:e.target.value});

        // console.log(form);

    }

    const handleSubmit = async (e)=>{
        e.preventDefault();

        // console.log(form);

        // destructuring the data from form
        const { username,password,phoneNumber, avatarURL } = form;

        // const URL = 'https://chat-room-yk.herokuapp.com/auth';
        const URL = 'http://localhost:5000/auth';

        // data is coming from the url/{''} , which is either signup or login
        // we also destructure the data coming from the post request
        const { data: { token, userId, hashedPassword, fullName } } = await axios.post(`${URL}/${isSignup ? 'signup':'login'}`,{username,password,fullName: form.fullName,phoneNumber,avatarURL});

        cookies.set('token',token);
        cookies.set('username',username);
        cookies.set('fullName',fullName);
        cookies.set('userId',userId);

        if(isSignup){
            cookies.set('phoneNumber',phoneNumber);
            cookies.set('avatarURL',avatarURL);
            cookies.set('hashedPassword',hashedPassword);
            
        }
        // we reload the page becuase we get the auth token from our server, go to app.jsx, here we check for the auth token, if it is there we go to our chats module
        window.location.reload();
    }

    // to switch mode between signin and signup
    const switchMode = () => {
        setIsSignup((prevIsSignup)=> !prevIsSignup);
    }
    return (

        <div className='auth__form-container'>
            <div className='auth__form-container_fields'>
                <div className='auth__form-container_fields-content'>
                    <p>{isSignup ? 'Sign Up' : 'Sign In'}</p>
                    <form onSubmit={handleSubmit}>
                        {/* shorthand for ternary operator with only one output to show */}
                        {isSignup && (
                            <div className='auth__form-container_fields-content_input'>
                                <label htmlFor='fullName'>Full Name</label>
                                <input
                                    name="fullName" type="text"
                                    placeholder='Full Name'
                                    onChange={handleChange}
                                    pattern="/^[A-Za-z]+$/"
                                    required
                                />
                            </div>
                        )}

                        <div className='auth__form-container_fields-content_input'>
                            <label htmlFor='username'>User Name</label>
                            <input
                                name="username"
                                placeholder="User Name"
                                type="text" onChange={handleChange} required
                            />
                        </div>

                        {isSignup && (
                            <div className='auth__form-container_fields-content_input'>
                                <label htmlFor='phoneNumber'>Phone Number</label>
                                <input
                                    name="phoneNumber" type="text"
                                    placeholder='Phone Number'
                                    onChange={handleChange} required
                                />
                            </div>
                        )}

                        {isSignup && (
                            <div className='auth__form-container_fields-content_input'>
                                <label htmlFor='avatarURL'>Avatar URL</label>
                                <input
                                    name="avatarURL" type="text"
                                    placeholder='Avatar URL'
                                    onChange={handleChange} required
                                />
                            </div>
                        )}

                        <div className='auth__form-container_fields-content_input'>
                            <label htmlFor='password'>Password</label>
                            <input
                                name="password"
                                placeholder="Password"
                                type="password" onChange={handleChange} required
                            />
                        </div>

                        {isSignup && (
                        <div className='auth__form-container_fields-content_input'>
                            <label htmlFor='confirmPassword'>Confirm Password</label>
                            <input
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                type="password" onChange={handleChange} required
                            />
                        </div>
                        )}

                        <div className='auth__form-container_fields-content_button'>
                            <button>
                                {isSignup?"Sign Up" : "Sign In"}
                            </button>
                        </div>
                    </form>
                            <div className='auth__form-container_fields-account'>
                                <p>
                                    {isSignup ? "Already have an account ? " : "Dont have an account ? "}
                                    <span onClick={switchMode}>
                                      {isSignup ? " Sign In":" Sign Up"}  
                                    </span>

                                </p>
                            </div>
                </div>
                
            </div>
            <div className='auth__form-container_image'>
                <img src={signinImage} alt='sign in' />
            </div>
        </div>
    );
}

export default Auth;
