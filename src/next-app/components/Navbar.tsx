import React, { useState } from 'react';
import styles from '../styles/components/Navbar.module.css';
import Button from './Button';
import ProfileModal from './ProfileModal';
import { IoMdMenu, IoMdContact } from 'react-icons/io';
import Link from 'next/link';
import { NavbarData } from './NavbarData';
import { IconContext } from 'react-icons';

function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const [profile, setProfile] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  const showProfile = () => setProfile(!profile);

  const logout = () => {
    window.location.href = '/';
  };

  return (
    <div>
      <IconContext.Provider value={{ color: '#000' }}>
        <div className={styles.navbar}>
          <div className={sidebar ? styles['menu-bars-active'] : styles['menu-bars']}>
            <IoMdMenu onClick={showSidebar} />
          </div>
          <div className={styles['btn-contianer']}>
            <IoMdContact className={styles['profile-btn']} onClick={showProfile} />
            {profile ? <ProfileModal /> : null}
            <div className={styles['logout-btn']}>
              <Button title={'Logout'} width={'120%'} onClick={logout} />
            </div>
          </div>
        </div>

        <nav className={sidebar ? styles['nav-menu-active'] : styles['nav-menu']}>
          <ul className={styles['nav-menu-items']} onClick={showSidebar}>
            {NavbarData.map((item, index) => {
              return (
                <li key={index} className={styles['nav-text']}>
                  <Link href={item.path}>
                    <div>
                      {item.icon}
                      <span className={styles['nav-text-item']}>{item.title}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </div>
  );
}

export default Navbar;
