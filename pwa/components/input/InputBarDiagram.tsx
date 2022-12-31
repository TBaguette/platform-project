import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
    type: string;
    setType: Dispatch<SetStateAction<string>>;
    dateStart: string;
    setDateStart: Dispatch<SetStateAction<string>>;
    dateEnd: string;
    setDateEnd: Dispatch<SetStateAction<string>>;
}

const InputBarComponent = ({ type, setType, dateStart, setDateStart, dateEnd, setDateEnd } : Props) => {
    const [dateStartLocal, setDateStartLocal] = useState(dateStart);
    const [dateEndLocal, setDateEndLocal] = useState(dateEnd);

    useEffect(() => {
        if(
            !isNaN(Date.parse(dateStartLocal)) &&
            !isNaN(Date.parse(dateEndLocal)) &&
            Date.parse(dateStartLocal) <= Date.parse(dateEndLocal) &&
            Date.parse(dateStartLocal) >= Date.parse("2017-01-01") &&
            Date.parse(dateEndLocal) <= Date.parse("2022-12-31")
        ) {
            setDateStart(dateStartLocal);
            setDateEnd(dateEndLocal);
        }
    }, [dateStartLocal, dateEndLocal]);

    return (
        <form>
            <label>
                Ventes par :
                <div className="choice">
                    <select
                        defaultValue={type}
                        onChange={(e) => { setType(e.target.value) }}
                    >
                        <option value="day">Jour</option>
                        <option value="week">Semaine</option>
                        <option value="month">Mois</option>
                        <option value="year">Année</option>
                    </select>
                    <span />
                </div>
            </label>
            <div>
                <label>
                    Entre le :
                    <div className="choice">
                        <input type="date" id="start" name="trip-start"
                            value={dateStartLocal}
                            onChange={(e) => { setDateStartLocal(e.target.value) }}
                            min="2017-01-01" max="2022-12-31"/>
                    </div>
                </label>
                <label>
                    et le :
                    <div className="choice">
                        <input type="date" id="end" name="trip-start"
                            value={dateEndLocal}
                            onChange={(e) => { setDateEndLocal(e.target.value) }}
                            min="2017-01-01" max="2022-12-31"/>
                    </div>
                </label>
            </div>
        </form>
    );
}

export default InputBarComponent;
