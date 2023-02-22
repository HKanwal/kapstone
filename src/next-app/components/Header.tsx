import { useRouter } from 'next/router';
import { IconType } from 'react-icons';
import styles from '../styles/components/Header.module.css';
import IconButton from './IconButton';
import { IoMdArrowBack } from 'react-icons/io';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useClickOutside, useDisclosure } from '@mantine/hooks';

type HeaderProps = {
  title?: string;
  rightIcon?: IconType;
  backButtonDisabled?: boolean;
  onRightIconClick?: () => void;
  /**
   * Create burger menu using given items. Overrides rightIcon.
   * Omitting the onClick will visually disable the option.
   */
  burgerMenu?: {
    option: string;
    onClick?: () => void;
  }[];
};

const Header = (props: HeaderProps) => {
  const router = useRouter();
  const [burgerOpened, handlers] = useDisclosure(false);
  const burgerContainerRef = useClickOutside<HTMLDivElement>(() => handlers.close());

  const handleDotsClick = () => {
    handlers.toggle();
  };

  return (
    <div className={styles.header}>
      {!props.backButtonDisabled && (
        <div className={styles['back-btn-container']}>
          <IconButton icon={IoMdArrowBack} onClick={() => router.back()} />
        </div>
      )}
      {!!props.title ? (
        <span className={styles.title}>{props.title}</span>
      ) : (
        <span className={styles.title} style={{ visibility: 'hidden' }}>
          css hack
        </span>
      )}
      {props.burgerMenu ? (
        <div className={styles['right-btn-container']} ref={burgerContainerRef}>
          <IconButton icon={BsThreeDotsVertical} onClick={handleDotsClick} />
          {burgerOpened ? (
            <div className={styles['burger-menu-container-container']}>
              <div className={styles['burger-menu-container']}>
                <div className={styles['burger-menu']}>
                  {props.burgerMenu.map((item) => {
                    return (
                      <button
                        className={styles['burger-item']}
                        onClick={() => {
                          item.onClick?.();
                          handlers.close();
                        }}
                        disabled={!item.onClick}
                        key={item.option}
                      >
                        {item.option}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : !!props.rightIcon ? (
        <div className={styles['right-btn-container']}>
          <IconButton icon={props.rightIcon} onClick={props.onRightIconClick} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Header;
