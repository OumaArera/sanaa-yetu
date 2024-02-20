import React from "react";
import { NavLink } from "react-router-dom";


const NavBar = () =>{
    return (
        <div className="navBar">
          
              <NavLink to={"/#"} >Home</NavLink>
            
              <NavLink to={"/about"}>About</NavLink>
    
              <NavLink to={"/signin"}>Signin</NavLink>
    
              <NavLink to={"/signup"}>Signup</NavLink>

              <NavLink to={"/contact"}>Contact</NavLink>
           
        </div>
      );
}

export default NavBar;

