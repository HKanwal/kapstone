import React, { useState } from 'react';
import styles from '../styles/components/Navbar.module.css';
import { IoMdMenu, IoMdClose } from 'react-icons/io';
import Link from 'next/link';
import { NavbarData } from './NavbarData';
import { IconContext } from 'react-icons';

function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className={styles.navbar}>
          <Link href="#" className={styles['menu-bars']}>
            <IoMdMenu onClick={showSidebar} />
          </Link>
        </div>
        <nav className={sidebar ? styles['nav-menu active'] : styles['nav-menu']}>
          <ul className={styles['nav-menu-items']} onClick={showSidebar}>
            {NavbarData.map((item, index) => {
              return (
                <li key={index} className={styles[item.cName]}>
                  <Link href={item.path}>
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
