import React, { useEffect, useState } from 'react';
import styles from '../styles/components/Navbar.module.css';
import ProfileModal from './ProfileModal';
import { IoMdMenu, IoMdContact, IoIosCloseCircleOutline, IoIosNotifications } from 'react-icons/io';
import Link from 'next/link';
import {
  CustomerNavbarData,
  EmployeeNavbarData,
  ShopOwnerNavbarData,
} from '../constants/NavbarData';
import { IconContext } from 'react-icons';
import Cookies from 'js-cookie';
import { Jwt } from '../utils/api';
import { useRouter } from 'next/router';
import SmallButton from './SmallButton';
import { useClickOutside, useDisclosure } from '@mantine/hooks';

type NavbarProps = {
  authData: Jwt;
  onLogin: (jwt: Jwt) => void;
  headerName: string;
  modalBody: JSX.Element[];
  profileURL: string;
  showProfileButton: boolean;
  notificationCount: number;
};

const Navbar = (props: NavbarProps) => {
  const router = useRouter();
  const [NavbarData, setNavBarData] = useState(CustomerNavbarData);
  const [buttonText, setButtonText] = useState('Login');
  const [sidebarOpen, sidebarHandlers] = useDisclosure(false);
  const [profileOpen, profileHandlers] = useDisclosure(false);
  const profileRef = useClickOutside<HTMLDivElement>(() => profileHandlers.close());

  useEffect(() => {
    if (props.authData.access !== '') {
      setButtonText('Logout');
    } else if (Cookies.get('access') && Cookies.get('access') !== '') {
      setButtonText('Logout');
    }
    if (props.authData.user_type === 'shop_owner') {
      setNavBarData(ShopOwnerNavbarData);
    } else if (props.authData.user_type === 'employee') {
      // Need to figure out Employee Navbar Data
      setNavBarData(EmployeeNavbarData);
    } else {
      setNavBarData(CustomerNavbarData);
    }
  }, [props.authData]);

  const logout = () => {
    props.onLogin({
      access: '',
      refresh: '',
      user_type: 'customer',
    });
    if (buttonText === 'Login') {
      router.push('/login');
    }

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    Cookies.remove('access');
    Cookies.remove('refresh');
    Cookies.remove('user_type');
    router.push('/');
  };

  return (
    <div>
      <IconContext.Provider value={{ color: '#000' }}>
        <div className={styles.navbar}>
          <div className={sidebarOpen ? styles['menu-bars-active'] : styles['menu-bars']}>
            <span onClick={() => sidebarHandlers.toggle()}>
              {sidebarOpen ? <IoIosCloseCircleOutline /> : <IoMdMenu />}
            </span>
          </div>
          <div className={styles['btn-contianer']}>
            <Link href="/notifications" className="relative">
              <div className="absolute notification-icon-number">
                {props.notificationCount > 99 ? '99+' : props.notificationCount}
              </div>
              <div className="relative">
                <IoIosNotifications />
              </div>
            </Link>
            <div className={styles['profile-btn-container']} ref={profileRef}>
              <IoMdContact
                className={styles['profile-btn']}
                id="profile"
                onClick={() => {
                  profileHandlers.toggle();
                  sidebarHandlers.close();
                }}
              />
              {profileOpen ? (
                <ProfileModal
                  headerName={props.headerName}
                  modalBody={props.modalBody}
                  profileURL={props.profileURL}
                  showProfileButton={props.showProfileButton}
                />
              ) : null}
            </div>
            <SmallButton title={buttonText} onClick={logout} />
          </div>
        </div>

        <nav className={sidebarOpen ? styles['nav-menu-active'] : styles['nav-menu']}>
          <ul className={styles['nav-menu-items']} onClick={() => sidebarHandlers.close()}>
            {NavbarData.map((item, index) => {
              return (
                <Link href={item.path} key={index}>
                  <li className={styles['nav-text']}>
                    <div>
                      {item.icon}
                      <span className={styles['nav-text-item']}>{item.title}</span>
                    </div>
                  </li>
                </Link>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </div>
  );
};

export default Navbar;
