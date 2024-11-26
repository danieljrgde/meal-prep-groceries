//------------------------------//
//--- LIST ---------------------//
//------------------------------//

const getRecipes = () => {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const recipesSheet = ss.getSheetByName("Recipes");

  let recipes = [];
  const recipeRanges = getRecipesRanges(recipesSheet);

  for (const recipeRange of recipeRanges){

    // Fetch all data and background colors for the current column range
    const data = recipeRange.getValues();
    const formulaData = recipeRange.getFormulas();

    // Extract ingradients
    let ingredients = [];
    for (let i = 10; i < data.length; i++) {
      ingredients.push({
        ingredient: data[i][1],
        qty: data[i][2],
        unit: data[i][4],
      });
    }

    recipes.push({
      title: formulaData[0][0],
      img: formulaData[2][0],
      calories: data[2][2],
      protein: data[3][2],
      carbs: data[4][2],
      fat: data[5][2],
      ingredients: ingredients,
    });
  
  }

  return recipes;

};



//------------------------------//
//--- AUXILIARY ----------------//
//------------------------------//

const getRecipesRanges = (recipesSheet) => {
  
  // Define the column ranges where recipe tables can appear (e.g., B-F, H-L, N-R)
  const colRanges = [
    { colStart: "B", colEnd: "F" },
    { colStart: "H", colEnd: "L" },
    { colStart: "N", colEnd: "R" }
  ];

  // Initialize an empty array to store the identified ranges for recipes
  let ranges = [];


  for (const colRange of colRanges) {

    // Variables to track the start and end rows of a recipe table within the current column range
    let rowStart = null, rowEnd = null;
    const { colStart, colEnd } = colRange;
    
    // Fetch all data and background colors for the current column range.
    const data = recipesSheet.getRange(`${colStart}1:${colEnd}${recipesSheet.getLastRow()}`).getValues();
    const bgColors = recipesSheet.getRange(`${colStart}1:${colEnd}${recipesSheet.getLastRow()}`).getBackgrounds();

    for (let row = 0; row < data.length; row++) {

      // Identify recipe header
      if (bgColors[row][0] === "#356854"){
        rowStart = row+1;
      }

      // Identify end of recipe
      if (rowStart && data[row][4] == "" && row > rowStart+9){
        rowEnd = row;
      }

      // If a range is identified, add it to the list and reset
      if (rowStart && rowEnd){
        const recipeRange = recipesSheet.getRange(`${colStart}${rowStart}:${colEnd}${rowEnd}`);
        ranges.push(recipeRange);
        rowStart = null;
        rowEnd = null;
      }

    }
  }

  return ranges;

};