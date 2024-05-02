import React, {useState} from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import signinImage from '../assets/signup.webp'
import userImg from '../assets/user.jpg';
import './auth.css'


const cookies = new Cookies();

const initialState ={
    name: '',
    email: '',
    address: '',
    picture: null,
    phone: '',
    domaine: '',
    password: '',

    
}

const Auth = () => {
     const [form, setForm] = useState(initialState)
    const [isSignup, setIsSignup] = useState(true);
    const [image, setImage] = useState(null);
    const [uploadingImg, setUploadingImg] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
  
    const  handleChange = (e) =>{
       setForm({ ...form, [e.target.name]: e.target.value})
    console.log(form);
    
    }



    function validateImg(e) {
      const file = e.target.files[0];
      if (file.size >= 1048576) {
        return alert("Max file size is 1mb")
      } else {
        setImage(file);
        setImagePreview(URL.createObjectURL(file))
      }
    }
  
    async function uploadImage() {
      const data = new FormData();
      data.append('file', image);
      data.append('upload_preset', 'ilaj8umd');
      try {
        setUploadingImg(true);
        let res = await fetch('https://api.cloudinary.com/v1_1/duynzjvcb/image/upload', {
          method: 'post',
          body: data
        })
        const urlData = await res.json();
        setUploadingImg(false);
        return urlData.url
      } catch (error) {
        setUploadingImg(false);
        console.log(error);
      }
    }

    
    const handleSubmit = async (e) => {
      e.preventDefault();
         
      try {
        
        const {  email, phone, picture, address, domaine, password } = form;
        const URL = 'http://localhost:5000/users';
        const url = await uploadImage(image);
        const response = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, {
          name: form.name,
          email,
          phone,
          picture: url,
          address,
          domaine,
          password,
        });
   
        const { token, userId, hashedPassword, name } = response.data;
    
        cookies.set('token', token);
        cookies.set('name', name);
        cookies.set('email', email);
        cookies.set('userId', userId);
      
    
        if (isSignup) {
          if (!image) return alert("Please upload your profile picture");
          const url = await uploadImage(image);
          console.log(url);
          cookies.set('name', name);

          cookies.set('address', address);
          cookies.set('phone', phone);
          cookies.set('domaine', domaine);
          cookies.set('picture',  picture);
          cookies.set('hashedPassword', hashedPassword);
        }
        
        window.location.reload();
      } catch (error) {
        console.error("Erreur Axios:", error);
      }
    };
    



    const  switchMode = () =>{
        setIsSignup((prevIsSignup) => !prevIsSignup)
         
    }
  return (
    <div className='auth__form-container'>
        <div className='auth__form-container_fields'>
         <div className='auth__form-container_fields-content'>
          <p>{isSignup ? 'Sign Up' : 'Sign In' }</p>

           <form onSubmit={handleSubmit}>
           {isSignup && (
              <div className='signup-profile-pic__container'>
              <img src={imagePreview || userImg} className='signup-profile-pic' alt='' />
              <label htmlFor='image-upload' className='image-upload-label'>
                <i className='fas fa-plus-circle add-picture-icon'></i>
              </label>
              <input  name='picture' type='file' id='image-upload' hidden accept='image/png, image/jpeg' onChange={validateImg} />
            </div>
             )}
             {isSignup && (
                <div className='auth__form-container_fields-content_input'>
                    <label htmlFor='name'>Nom</label>
                    <input
                    name='name'
                    type='text'
                    placeholder='Nom'
                    onChange={handleChange}
                    required
                    />
                </div>
             )}
               <div className='auth__form-container_fields-content_input'>
                    <label htmlFor='email'>Email</label>
                    <input
                    name='email'
                    type='email'
                    placeholder='exemple@exemple.com'
                    onChange={handleChange}
                    required
                    />
                </div>
                {isSignup && (
                <div className='auth__form-container_fields-content_input'>
                    <label htmlFor='phone'>Telephone</label>
                    <input
                    name='phone'
                    type='number'
                   
                    placeholder='Telephone'
                    onChange={handleChange}
                    required
                    />
                </div>
             )}
                {isSignup && (
                <div className='auth__form-container_fields-content_input'>
                    <label htmlFor='address'>Adresse</label>
                    <input
                    name='address'
                    type='text'
                    placeholder='Adresse'
                    onChange={handleChange}
                    required
                    />
                </div>
             )}
             {isSignup && (
                <div className='auth__form-container_fields-content_input'>
                    <label htmlFor='domaine'>Domaine De Travail</label>
                    <input
                    name='domaine'
                    type='text'
                    placeholder='Responsable equipe, Developpeur, Ressource Humaine'
                    onChange={handleChange}
                    required
                    />
                </div>
             )}
             
                
                <div className='auth__form-container_fields-content_input'>
                    <label htmlFor='password'>Mot de passe</label>
                    <input
                    name='password'
                    type='password'
                    placeholder='Mot de passe'
                    onChange={handleChange}
                    required
                    />
                </div>
             
            
                {isSignup && (
                <div className='auth__form-container_fields-content_input'>
                    <label htmlFor='confirmPassword'>Confirmation du Mot de passe</label>
                    <input
                    name='confirmPassword'
                    type='password'
                    placeholder='Confirmer votre mot de passe '
                    onChange={handleChange}
                    required
                    />
                </div>
             )}
             <div className='auth__form-container_fields-content_button'>
                <button >{isSignup ? "Sign Up" : "Sign In"}</button>
             </div>
           </form>
           <div className='auth__form-container_fields-account'>
            <p>
                {isSignup
                ? "Vous avez déjà un compte ?"
                : "Vous n'avez pas de compte ?"
                }
                <span onClick={switchMode}>
                {isSignup ? 'Sign In' : 'Sign Up'}
                </span>
            </p>
           </div>
         </div>
        </div>
        <div className='auth__form-container_image'>
        <img src={signinImage} alt="sign in" />
        </div>
    </div>
  )
}

export default Auth