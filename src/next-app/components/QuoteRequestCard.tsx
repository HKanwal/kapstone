import styles from '../styles/components/QuoteRequestCard.module.css';
import { useRouter } from 'next/router';
import React from 'react';

type QuoteRequestProps = {
  id: number;
  description: string;
  dateCreated?: string;
};

const QuoteRequestCard = (props: QuoteRequestProps) => {
  let descriptionLabel = props.description;
  let dateLabel = '';
  if (props.dateCreated) {
    const tempDate = new Date(props.dateCreated);
    const tempDateString = tempDate.toDateString();
    dateLabel = `Date: ${tempDateString}`;
  }
  const router = useRouter();
  const url = '/quote-request-details';

  if (props.description.length > 45) {
    descriptionLabel = `${props.description.slice(0, 45)}...`
  }
  return (
    <div key={props.id} className={styles.card} onClick={() => {
      router.push(
        {
          pathname: 'quote-request-details',
          query: { id: props.id },
        })
    }}>
      <div className={styles["description-container"]}>
        {descriptionLabel}
      </div>
      <div className={styles["date-container"]}>
        {dateLabel}
      </div>
    </div >
  );
};

export default QuoteRequestCard;
