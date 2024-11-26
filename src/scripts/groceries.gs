//------------------------------//
//--- LIST ---------------------//
//------------------------------//

const getGroceries = () => {

  let groceries;

   // Get necessary data from external sources
  const recipes = getRecipes();
  const selectedMenuRecipes = getSelectedMenuRecipes();
  const ingredientsMap = getIngredientsMap();

  // Flatten selected recipes into an array of ingredients, with their quantities converted and adjusted for servings
  groceries = selectedMenuRecipes.flatMap(selectedRecipe => {
    const recipe = { ...selectedRecipe, ...recipes.find(r => r.title === selectedRecipe.title) };
    return recipe.ingredients.map(ingredient => ({
      ...ingredient,
      qtyConverted: ingredientsMap[ingredient.ingredient].convert(ingredient.qty, ingredient.unit),
      qtyConvertedServings: recipe.servings * ingredientsMap[ingredient.ingredient].convert(ingredient.qty, ingredient.unit),
      unitConverted: ingredientsMap[ingredient.ingredient].preferredUnit
    }));
  });

  // Ingredients of selected recipes (aggregates duplicates)
  groceries = groceries.reduce((acc, { ingredient, qtyConvertedServings, unitConverted }) => {
    return acc.set(ingredient, {
      ingredient: ingredient,
      qtyConvertedServings: acc.has(ingredient) ? acc.get(ingredient).qtyConvertedServings + qtyConvertedServings : qtyConvertedServings,
      unitConverted: unitConverted,
    });
  }, new Map()).values();
  groceries = Array.from(groceries);

  return groceries;

};


//------------------------------//
//--- WRITE --------------------//
//------------------------------//

const writeGroceries = (groceries) => {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const groceriesSheet = ss.getSheetByName("Groceries");
  
  // Clear any existing content
  groceriesSheet.clearContents();
  
  // Set up headers for the grocery list
  const headers = ["Got it?", "Ingredient", "Quantity", "Unit"];
  const headerRange = groceriesSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  headerRange.setFontWeight("bold");

  // Prepare, sort and write the data for the grocery list
  const data = groceries.sort((a, b) => a.ingredient.localeCompare(b.ingredient)).map(ingredient => [ ingredient["ingredient"], ingredient["qtyConvertedServings"].toFixed(0), ingredient["unitConverted"] ]) || [];
  const dataRange = groceriesSheet.getRange(2, 2, data.length, data[0].length).setValues(data);
  dataRange.setHorizontalAlignment("right");
  
};