//------------------------------//
//--- LIST ---------------------//
//------------------------------//

const getMenuRecipes = () => {
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const menuSheet = ss.getSheetByName("Menu");

  const data = menuSheet.getDataRange().getValues();
  const formulaData = menuSheet.getDataRange().getFormulas();

  const recipes = data.slice(1).map((row, idx) => ({
    isSelected: row[0],
    servings: row[1],
    img: formulaData[idx+1][2],
    title: formulaData[idx+1][3],
    calories: row[4],
    protein: row[5],
    carbs: row[6],
    fat: row[7],
  }));

  return recipes;

};


const getSelectedMenuRecipes = () => {
  const recipes = getMenuRecipes();
  const selectedRecipes = recipes.filter(recipe => recipe.isSelected);
  return selectedRecipes;
};



//------------------------------//
//--- WRITE --------------------//
//------------------------------//

const writeMenu = (recipes) => {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const menuSheet = ss.getSheetByName("Menu");
  
  // Clear any existing content
  menuSheet.clearContents();
  
  // Set up headers for the menu
  const headers = [ "Are we eating it?", "# Servings", "Image", "Title", "Calories (kcal/serving)", "Protein (g/serving)", "Carbs (g/serving)", "Fat (g/serving)" ];
  const headerRange = menuSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  headerRange.setFontWeight("bold");

  // Prepare data
  const data = recipes.map(recipe => [
    false,             // "Are we eating it?" (empty for now)
    0,                 // "# Servings" (empty for now)
    recipe.img,        // "Image" (empty for now)
    recipe.title,      // "Title" (recipe name)
    recipe.calories,   // "Calories (kcal/serving)"
    recipe.protein,    // "Protein (g/serving)"
    recipe.carbs,      // "Carbs (g/serving)"
    recipe.fat,        // "Fat (g/serving)"
  ]);
  
  // Write the values to the sheet
  const dataRange = menuSheet.getRange(2, 1, data.length, headers.length).setValues(data);

  // Optional: Set other properties (such as text alignment)
  dataRange.setHorizontalAlignment("center");
};