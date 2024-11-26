//------------------------------//
//--- MAIN ---------------------//
//------------------------------//

const main = () => {
  try {

    // Obtain the active spreadsheet and relevant sheets
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Calls update functions according to triggers
    if (ss.getActiveSheet().getName() === "Groceries") return;
    if (ss.getActiveSheet().getName() === "Recipes") updateMenuRecipes();
    updateGroceries();

  } catch (e) {
    console.error(e);
  }
};


//------------------------------//
//--- MENU ---------------------//
//------------------------------//

const updateMenuRecipes = () => {
  const recipes = getRecipes();
  const menuRecipes = getMenuRecipes();
  if (recipes.filter(r => menuRecipes.some(mr => r.title === mr.title && r.img === mr.img && r.calories === mr.calories && r.protein === mr.protein && r.carbs === mr.carbs && r.fat === mr.fat))) {
    writeMenu(recipes);
  }
};



//------------------------------//
//--- GROCERY ------------------//
//------------------------------//

const updateGroceries = () => {
  const groceries = getGroceries();
  writeGroceries(groceries);
};