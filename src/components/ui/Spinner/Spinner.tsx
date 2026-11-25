import styles from './Spinner.module.scss';

type SpinnerProps = {
  /** 보조 기술이 읽을 안내 문구 */
  label: string;
  className?: string;
};

export const Spinner = ({ label, className }: SpinnerProps) => (
  <div role="status" className={className}>
    <div className={styles.spinner} aria-hidden="true" />
    <span className={styles.spinner__label}>{label}</span>
  </div>
);
