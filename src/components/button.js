import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for internal navigation
import './button.css';

function Button({ href, children, className, target = '_self' }) {
  // Determine if href is an internal path or an external URL
  const isInternal = href.startsWith('/');

  return isInternal ? (
    <Link to={href} className={`btn ${className}`}>
      {children}
    </Link>
  ) : (
    <a 
      href={href} 
      className={`btn ${className}`} 
      target={target} 
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

export default Button;
