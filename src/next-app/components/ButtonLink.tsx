import { ButtonHTMLAttributes } from 'react';
import styles from '../styles/components/Button.module.css';
import Link from 'next/link';

type ButtonLinkProps = {
  title: string;
  width?: string | number;
  href: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
};

const ButtonLink = (props: ButtonLinkProps) => {
  return (
    <Link href={props.href}>
      <button
        type={props.type ?? 'button'}
        className={styles.button}
        style={{ width: props.width }}
      >
        {props.title}
      </button>
    </Link>
  );
};

export default ButtonLink;
