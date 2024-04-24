// Footer.js
import React from 'react';
import logo from './assets/logo_nobg.png'; // Importer bildet


const Footer = () => {
  return (
<footer className="footer footer-center  w-full p-4 bg-gray-300 text-gray-800 mt-10 ">
      <div className="text-center">
        <p>
          Made By -
          <a className="font-semibold" href="https://github.com/MariusBBerg"
            > Marius Bakken Berg</a
          >
        </p>
      </div>
    </footer>
  
  );
};

export default Footer;
