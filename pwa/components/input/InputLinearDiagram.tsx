const InputLinearComponent = () => {

  return (
    <form>
      <label>
        Sélectionnez un type de logement :
        <select>
          <option value="appartement">Appartement</option>
          <option value="maison">Maison</option>
        </select>
      </label>
    </form>
  );
}

export default InputLinearComponent;
