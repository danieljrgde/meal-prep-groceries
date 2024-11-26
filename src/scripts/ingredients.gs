//------------------------------//
//--- LIST ---------------------//
//------------------------------//

const getIngredientsMap = () => {
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ingredientsSheet = ss.getSheetByName("Ingredients");

  const data = ingredientsSheet.getDataRange().getValues();
  console.log(data.length)
  const ingredients = data.slice(1).map(row => ({
    ingredient: row[0],
    preferredUnit: row[1],
    density: row[2],
    gramsPerUnit: row[3],
    convert: (qty, fromUnit) => {

      const toUnit = row[1];
      const density = row[2];
      const gramsPerUnit = row[3];
      
      // Mass to mass conversions
      if (fromUnit in massUnits && toUnit in massUnits){
        return qty * massUnits[fromUnit] / massUnits[toUnit];
      }

      // Volume to volume conversions
      else if (fromUnit in volumeUnits && toUnit in volumeUnits){
        return qty * volumeUnits[fromUnit] / volumeUnits[toUnit];
      }

      // Mass to volume conversions
      else if (fromUnit in massUnits && toUnit in volumeUnits){
        const grams = qty * massUnits[fromUnit];
        const milliliters = grams / density;
        return milliliters / volumeUnits[toUnit];
      }

      // Volume to mass conversions
      else if (fromUnit in volumeUnits && toUnit in massUnits){
        const milliliters = qty * volumeUnits[fromUnit];
        const grams = milliliters * density;
        return grams / massUnits[toUnit];
      }

      // Unit to unit conversions
      else if (fromUnit === "unit" && toUnit === "unit"){
        return qty;
      }

      // Unit to mass conversions
      else if (fromUnit === "unit" && toUnit in massUnits){
        const grams = qty * gramsPerUnit;
        return grams / massUnits[toUnit];
      }

      // Mass to unit conversions
      else if (fromUnit in massUnits && toUnit === "unit"){
        const grams = qty * massUnits[fromUnit];
        return grams / gramsPerUnit;
      }

      // Unit to volume conversions
      else if (fromUnit === "unit" && toUnit in volumeUnits){
        const grams = qty * gramsPerUnit;
        const milliliters = grams / density;
        return milliliters / volumeUnits[toUnit];
      }

      // Volume to unit conversions
      else if (fromUnit in volumeUnits && toUnit === "unit"){
        const milliliters = qty * volumeUnits[fromUnit];
        const grams = milliliters * density;
        return grams / gramsPerUnit;
      }

      else {
        throw new Error(`From ${fromUnit} or to ${toUnit} unit not supported.`)
      }

    }
  }));

  return ingredients.reduce((map, obj) => ({ ...map, [obj.ingredient]: obj }), {});
};