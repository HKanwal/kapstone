import styles from '../styles/components/QuoteRequestCard.module.css';
import { useRouter } from 'next/router';
import React from 'react';

type QuoteRequestProps = {
  batch_id: number;
  description: string;
  dateCreated?: string;
  path?: string;
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
    descriptionLabel = `${props.description.slice(0, 45)}...`;
  }
  return (
    <div
      key={props.batch_id}
      className={styles.card}
      onClick={() => {
        router.push({
          pathname: props.path ? props.path : 'quote-request-details',
          query: { batch_id: props.batch_id },
        });
      }}
    >
      <div className={styles['description-container']}>{descriptionLabel}</div>
      <div className={styles['date-container']}>{dateLabel}</div>
    </div>
  );
};

export default QuoteRequestCard;
