export default interface AlertEntity {
  message: string;
  type: "info" | "success" | "warning" | "danger";
}

export type LocationProps = {
  state: {
    alert: AlertEntity;
  };
};
