import styles from '../styles/components/QuoteRequestCard.module.css';

type QuoteRequestProps = {
  id: number;
  description: string;
  dateCreated: string;
};

const QuoteRequestCard = (props: QuoteRequestProps) => {
  let descriptionLabel = props.description;
  const tempDate = new Date(props.dateCreated);
  const tempDateString = tempDate.toDateString();
  const dateLabel = `Date: ${tempDateString}`
  if (props.description.length > 60) {
    descriptionLabel = `${props.description.slice(0, 60)}...`
  }
  return (
    <div key={props.id} className={styles.card} onClick={() => {
      console.log(props.id); // Call quote request view page and pass id once clicked
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
