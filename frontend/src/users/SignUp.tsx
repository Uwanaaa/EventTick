import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoMdArrowRoundBack } from "react-icons/io";
import { toast } from 'react-toastify';
import axios from 'axios'
import './SignUp.css'

const SignUp = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [gender, setGender] = useState('other')
  const [password, setPassword] = useState('')
  const [date_of_birth, setDateOfBirth] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('user')
  const [country, setCountry] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
    .then((response) => {
      let countries:any = [];
      response.data.forEach((data: {name: { official: string}} )=> {
        const officialName = data.name.official;
        // console.log(`Country: ${officialName}`);
        if (!countries.includes(officialName)) {
          // console.log(`Country: ${officialName}`);
          
          countries.push(officialName);
        }
      });
      // console.log(countries);

      const countrySelect = document.getElementById('countrySelect')
      countries.forEach((country:string) => {
        const optionElement = document.createElement('option')
        optionElement.value = country
        optionElement.text = country

        countrySelect?.append(optionElement)
      })

    })
    .catch((error) => {
      console.error("Error fetching countries:", error);
      toast.error("Error loading countries. Please try again.");
    });
  },[])
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // if ("geolocation" in navigator) {
    //   navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       const { latitude, longitude } = position.coords
    //       console.log("Latitude:", latitude)
    //       console.log("Longitude:", longitude)

    //       setLongitude(position.coords.longitude)
    //       setLatitude(position.coords.latitude)
    //       setNextFlow(true)
         
    //     },
    //     (error) => {
    //       switch (error.code) {
    //         case error.PERMISSION_DENIED:
    //           console.warn("User denied the request for Geolocation.")
    //           alert("Location access is required for better app functionality. Please enable it in your browser settings.")
    //           break
    //         case error.POSITION_UNAVAILABLE:
    //           console.warn("Location information is unavailable.")
    //           break
    //         case error.TIMEOUT:
    //           console.warn("The request to get user location timed out.")
    //           break
    //         default:
    //           console.warn("An unknown error occurred.")
    //           break
    //       }
    //     }      
    //   )
    // } else {
    //   alert("Geolocation is not supported by your browser")
    // }

   


   
   
      if (!name || !email || !password || !gender || !date_of_birth || !phone || !country ) {
        setMessage('Please fill in all fields.')
        toast.error('Please fill in all fields.');
        return
      }
      axios.post('http://localhost:5000/auth/register',{
          name,
          email,
          gender,
          date_of_birth,
          role,
          phone,
          country,
          password
      }).then(response => {
          console.log(`response: ${response.data.message}`)
          setMessage(response.data.message)
          toast.success('Account created successfully! Redirecting to login...', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            onClose: () => navigate('/login')
          });
      }).catch((error) => {
        console.log(`error: ${error}`)
        toast.error(error.response?.data?.message || 'Error creating account. Please try again.');
      })  
    }
  
  return (
    <div className="page-layout">
      <nav className="nav-bar">
        <div className="nav-left">
          <button className="icon-button" onClick={() => navigate('/')} title="Back to Home">
            <IoMdArrowRoundBack />
          </button>
          <h1 className="nav-title">Sign Up</h1>
        </div>
      </nav>

      <div className="page-container">
        <div className="signup-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor='genders'>Gender:</label>
              <select name="genders" id="genders" value={gender} onChange={(e) => {setGender(e.target.value)}}>
                <option value="other">Other</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor='roles'>Role:</label>
              <select name="roles" id="roles" value={role} onChange={(e) => {setRole(e.target.value)}}>
                <option value="user">User</option>
                <option value="host">Host</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date Of Birth:</label>
              <input
                type="date"
                value={date_of_birth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Country:</label>
              <select name="country" id="countrySelect" value={country} onChange={(e) => setCountry(e.target.value)}></select>
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="button button-primary">Sign Up</button>
          </form>
          <p className="auth-link"><a href="/login">Already have an account? Login here</a></p>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  )
}

export default SignUp
