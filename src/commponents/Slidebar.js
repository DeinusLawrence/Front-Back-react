import React from "react";
import { FaUserAlt } from "react-icons/fa"; // Ejemplo de iconos
import { IoMdPlanet, IoMdPeople } from "react-icons/io";
import { MdLocalMovies } from "react-icons/md";
import { IoCarSport } from "react-icons/io5";
import { GiSpaceship } from "react-icons/gi";
import '../Styles/sliderbar.css';

const Sidebar = ({ onSelectOption }) => {
  const menuItems = [
    { id: 1, icon: <FaUserAlt />, label: "Personajes" },
    { id: 2, icon: <IoMdPlanet />, label: "Planetas" },
    { id: 3, icon: <MdLocalMovies />, label: "Peliculas" },
    { id: 4, icon: <IoCarSport />, label: "Vehiculos" },
    { id: 5, icon: <GiSpaceship />, label: "Naves Espaciales" },
    { id: 6, icon: <IoMdPeople />, label: "Especies" },
  ];

  return (
    <div className="sidebar">
      <ul>
        {menuItems.map((item) => (
          <li 
            key={item.id} 
            className="menu-item" 
            onClick={() => onSelectOption(item.label)} // Llamar a la función pasada por props
          >
            {item.icon}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
