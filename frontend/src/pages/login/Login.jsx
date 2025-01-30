import React, { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import { loginUserApi } from "../../apis/api";
import './Login.css';

const Login = () => {
    //make a usestate for each input
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // make a error state
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const recaptchaRef = useRef(null);

    const validate = () => {
        let isValid = true;
        setEmailError('');
        setPasswordError('');

        if (email.trim() === '' || !email.includes('@')) {
            setEmailError('Email is required');
            toast.error('Email is required');
            isValid = false;
        }

        if (password.trim() === '') {
            setPasswordError('Password is required');
            toast.error('Password is required');
            isValid = false;
        }

        return isValid;
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!validate()) {
            return;
        }

        const captchaToken = recaptchaRef.current.getValue();
        if (!captchaToken) {
            toast.error("Please verify CAPTCHA");
            return;
        }

        // make a json object
        const data = {
            "email": email,
            "password": password,
            "captchaToken": captchaToken
        };

        // make a api request
        loginUserApi(data).then((res) => {
            //recived data: success message
            if (res.data.success === false) {
                toast.error(res.data.message);

                // Handle account lockout case
                if (res.data.message.includes("Too many failed attempts")) {
                    toast.error("Too many failed attempts. Your account is locked for 15 minutes. Try again later.");
                }

                // Reset CAPTCHA on failed login
                recaptchaRef.current.reset();
            } else {
                window.location.href = '/';
                toast.success(res.data.message);
                // success -bool, message-text, token-text, user data
                // setting token and user data in local storage
                localStorage.setItem('token', res.data.token);

                // setting user data
                const convertedData = JSON.stringify(res.data.userData);

                //local storage set
                localStorage.setItem('userData', convertedData);
            }
        }).catch((err) => {
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);

                // Handle account lockout case
                if (err.response.data.message.includes("Too many failed attempts")) {
                    toast.error("Too many failed attempts. Your account is locked for 15 minutes. Try again later.");
                }
            } else {
                toast.error("An error occurred. Please try again.");
            }

            // Reset CAPTCHA on error
            recaptchaRef.current.reset();
        });
    };

    const images = [
        {
            src: 'assets/images/s1.jpg',
            heading: 'Choose Your Favorite Drink',
            text: 'Find your preferred beverage anytime, anywhere with ease '
        },
        {
            src: 'assets/images/s2.jpg',
            heading: 'Grab a Drink to Refresh Yourself',
            text: "Whether it's a long day after work or game night, we’re always here to refresh you"
        },
        {
            src: 'assets/images/s3.jpg',
            heading: 'Fastest Delivery Experience Ever',
            text: 'Because Chilled drinks always taste better'
        }
    ];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <>
            <div className=" mt-2 ">
                <div className="login-container">
                    <div className="login-content">
                        <div className="login-left">
                            <div className="carousel">
                                {images.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`carousel-item ${index === currentImageIndex ? 'active' : ''}`}
                                    >
                                        <img src={image.src} alt={`Slide ${index}`} className="login-image" />
                                        <div className="carousel-caption">
                                            <h3>{image.heading}</h3>
                                            <p>{image.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="login-right">
                            <div className="login-form">
                                <div className="logo">
                                    <img src="assets/icon/ticon.png" alt="logo" />
                                </div>
                                <h2>Welcome Back!</h2>
                                <p>Please enter your details</p>
                                <form>
                                    <label>Email Address</label>
                                    <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email Address" required />
                                    {emailError && <p className="text-danger">{emailError}</p>}

                                    <label>Password</label>
                                    <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required />
                                    {passwordError && <p className="text-danger">{passwordError}</p>}

                                    <ReCAPTCHA sitekey="6Lc3iccqAAAAAKDkISSoAVeTn0xCki4mSSoUhtsf" ref={recaptchaRef} />

                                    <div className="login-options">
                                        <div>
                                            <input type="checkbox" id="remember" />
                                            <span>Remember me</span>
                                        </div>
                                        <a href="/forgot_password">Forgot Password?</a>
                                    </div>
                                    <button onClick={handleSubmit} type="submit" className="login-button">Login</button>
                                </form>
                                <p className="terms">
                                    By creating an account, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
                                </p>
                                <p>
                                    Don't have an account? <a style={{ color: '#D29062' }} href="/register">Sign Up</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
