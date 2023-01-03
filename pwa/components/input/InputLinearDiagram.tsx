import { Dispatch, SetStateAction } from "react";

interface Props {
    type: string;
    setType: Dispatch<SetStateAction<string>>;
}

const InputLinearComponent = ({ type, setType }: Props) => {
    return (
        <form data-testid="input">
            <label>
                Sélectionnez un type de logement :
                <div className="choice">
                    <select
                        id="type"
                        data-testid="type-habitation"
                        onChange={(e) => {
                            setType(e.target.value);
                        }}
                        value={type}
                    >
                        <option value="appartement">Appartement</option>
                        <option value="maison">Maison</option>
                    </select>
                    <span />
                </div>
            </label>
        </form>
    );
};

export default InputLinearComponent;
