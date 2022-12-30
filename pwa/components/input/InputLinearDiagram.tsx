import { Dispatch, SetStateAction } from "react";

interface Props {
  setType: Dispatch<SetStateAction<string>>;
}

const InputLinearComponent = ({ setType } : Props) => {

  return (
    <form>
      <label>
        Sélectionnez un type de logement :
        <select
          onChange={(e) => { setType(e.target.value) }}
          >
          <option value="appartement">Appartement</option>
          <option value="maison">Maison</option>
        </select>
      </label>
    </form>
  );
}

export default InputLinearComponent;
