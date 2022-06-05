export default interface AlertEntity {
  message: string;
  type: string;
}

export type LocationProps = {
  state: {
    alert: AlertEntity;
  };
};
