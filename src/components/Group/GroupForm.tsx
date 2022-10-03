import { useInput } from "../../hook/useInput";
import css from "./GroupForm.module.scss";

const GroupForm = () => {
  const { value: name, bind: bindName, reset: resetName } = useInput("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(name);
    reset();
  };

  const reset = () => {
    resetName();
  };

  return (
    <div className={`${css["form__container"]} my-2`}>
      <header>
        <h1 className={`${css.heading} my-2`}>header</h1>
      </header>
      <form
        className="p2"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <span className="form-label">Name</span>
        <div className="form-group">
          <input className={css.field} {...bindName} required />
        </div>
      </form>
    </div>
  );
};

export default GroupForm;
