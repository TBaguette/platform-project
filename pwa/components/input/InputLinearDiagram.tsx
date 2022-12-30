import { Dispatch, SetStateAction } from "react";

interface Props {
    setType: Dispatch<SetStateAction<string>>;
}

const InputLinearComponent = ({ setType } : Props) => {

    return (
        <form>
            <label>
                Sélectionnez un type de logement :
                <div className="choice">
                    <select
                        id="type"
                        onChange={(e) => { setType(e.target.value) }}
                    >
                        <option value="appartement">Appartement</option>
                        <option value="maison">Maison</option>
                    </select>
                    <span />
                </div>
            </label>
        </form>
    );
}

export default InputLinearComponent;
