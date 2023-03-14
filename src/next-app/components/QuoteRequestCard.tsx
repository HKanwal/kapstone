import styles from '../styles/components/QuoteRequestCard.module.css';
import { useRouter } from 'next/router';
import React from 'react';

interface QuoteRequestPropsBatchID {
  batch_id: number;
  description: string;
  dateCreated?: string;
  path?: string;
}

interface QuoteRequestPropsID {
  id: number;
  description: string;
  dateCreated?: string;
  path?: string;
}

type QuoteRequestProps = QuoteRequestPropsBatchID | QuoteRequestPropsID;

function isQuoteRequestPropsBatchID(props: QuoteRequestProps): props is QuoteRequestPropsBatchID {
  return (props as QuoteRequestPropsBatchID).batch_id !== undefined;
}

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
      key={isQuoteRequestPropsBatchID(props) ? props.batch_id : props.id}
      className={styles.card}
      onClick={() => {
        const query: any = {};
        if (isQuoteRequestPropsBatchID(props)) {
          query.batch_id = props.batch_id;
        } else {
          query.id = props.id;
        }
        router.push({
          pathname: props.path ? props.path : 'quote-request-details',
          query: query,
        });
      }}
    >
      <div className={styles['description-container']}>{descriptionLabel}</div>
      <div className={styles['date-container']}>{dateLabel}</div>
    </div>
  );
};

export default QuoteRequestCard;
