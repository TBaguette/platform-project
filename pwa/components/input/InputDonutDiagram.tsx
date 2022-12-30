import { Dispatch, SetStateAction } from "react";

interface Props {
    year: number;
    setYear: Dispatch<SetStateAction<number>>;
}

const InputDonutComponent = ({ year, setYear } : Props) => {
    return (
        <form>
            <label>
                Choisissez une année :
                <div className="choice">
                    <input
                        type="number"
                        min="2017"
                        max="2022"
                        value={year}
                        onChange={event => setYear(parseInt(event.target.value))}
                    />
                    <span className="up" onClick={() => { if(year+1 <= 2022) setYear(year+1) }}/>
                    <span className="down" onClick={() => { if(year-1 >= 2017) setYear(year-1) }}/>
                </div>
            </label>
        </form>
    );
}

export default InputDonutComponent;