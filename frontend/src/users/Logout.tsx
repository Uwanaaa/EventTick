import axios from "axios";


const Logout = () => {

    const logout = () => {
        axios.get('http://localhost:8000/users/logout/')
        .then(response => {
            console.log(response.data);
        })
    }

    return(
        <>
        <button onClick={logout}>Logout</button>
        </>
    )
}

export default Logout;