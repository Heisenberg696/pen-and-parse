/**
 * This is a React component for a navbar that displays a logo and the current active tab.
 * @returns The Navbar component is returning a JSX element.
 */
import React, { useEffect, useState } from 'react'
import "./navbar.scss"
import logoImage from '../../img/Logo.png';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('')
  useEffect(() => {
    setActiveTab(location.pathname.split('/'))  
  }, [activeTab])
  
  console.log(location)
  
  console.log(location)
  return (
    <div className='navbar'>
      <div className="left">
        <Link to ="/" style={{textDecoration:"none"}}>
          <span>
            <img src={logoImage} alt="Logo" className="logo" />
          </span>
        </Link>
      </div>
      <div className="right">
      <h2>{activeTab}</h2>
      </div>
    
    </div>
  )
}

export default Navbar;