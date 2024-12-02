import React from "react";
import { FaHome, FaUserAlt, FaCog } from "react-icons/fa"; // Ejemplo de iconos
import '../Styles/sliderbar.css';

const Sidebar = () => {
  const menuItems = [
    { id: 1, icon: <FaHome />, label: "Inicio" },
    { id: 2, icon: <FaUserAlt />, label: "Perfil" },
    { id: 3, icon: <FaCog />, label: "Configuración" },
  ];

  return (
    <div className="sidebar">
      <ul>
        {menuItems.map((item) => (
          <li key={item.id} className="menu-item">
            {item.icon}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
