
const InputBarComponent = () => {

  return (
    <form>
      <label>
        Ventes par :
        <select>
          <option value="jour">Jour</option>
          <option value="semaine">Semaine</option>
          <option value="mois">Mois</option>
          <option value="annee">Année</option>
        </select>
      </label>
      <div>
        <label>
          Entre le :
          <input type="date" id="start" name="trip-start"
                 value="2017-01-01"
                 min="2000-01-01" max="2023-12-31"/>
        </label>
      </div>
      <div>
        <label>
          et le :
          <input type="date" id="end" name="trip-start"
                 value="2018-01-01"
                 min="2000-01-01" max="2023-12-31"/>
        </label>
      </div>
    </form>
  );
}

export default InputBarComponent;
