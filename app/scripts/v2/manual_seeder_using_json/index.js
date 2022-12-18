const fs = require("fs");
const jsonFile = fs.readFileSync(
  "app/scripts/v2/data_scrapper/data.json",
  "utf8"
);
const jsonParse = JSON.parse(jsonFile);
const {
  cards,
  categories,
  colors,
  effects,
  files,
  packs,
  types,
  pivot_cards_categories,
  pivot_cards_colors,
} = require("../../../services/database");

(async () => {
  const dbReduceHandler = (oldValue, nextValue) => {
    const value = nextValue.dataValues;
    oldValue[value.name] = value;

    return oldValue;
  };

  // sequelize elements
  const dbCards = await cards.findAll();
  const dbCardsByCode = dbCards.reduce((oldValue, nextValue) => {
    const value = nextValue.dataValues;
    oldValue[value.code] = value;

    return oldValue;
  }, {});

  const dbCategories = await categories.findAll();
  const dbCategoriesByName = dbCategories.reduce(dbReduceHandler, {});

  const dbColors = await colors.findAll();
  const dbColorsByName = dbColors.reduce(dbReduceHandler, {});

  const dbFiles = await files.findAll();

  const dbPacks = await packs.findAll();
  const dbPacksByName = dbPacks.reduce(dbReduceHandler, {});

  const dbTypes = await types.findAll();
  const dbTypesByName = dbTypes.reduce(dbReduceHandler, {});

  const prepareAndInsertCategory = async (existingValues, categoryString) => {
    let result = [];

    if (categoryString) {
      const categoriesArray = categoryString.split("/");

      while (categoriesArray.length > 0) {
        const formateCategory = categoriesArray
          .splice(0, 1)[0]
          .trim()
          .toUpperCase();

        let value = existingValues[formateCategory];

        if (!value) {
          value = await categories.create({
            name: formateCategory,
          });

          existingValues[formateCategory] = value;
        }

        result.push(value);
      }
    }

    return result;
  };

  const prepareAndInsertColor = async (existingValues, colorString) => {
    let result = [];

    if (colorString) {
      const colorArray = colorString.split("/");

      while (colorArray.length > 0) {
        const formateColor = colorArray.splice(0, 1)[0].trim().toUpperCase();

        let value = existingValues[formateColor];

        if (!value) {
          value = await colors.create({
            name: formateColor,
          });

          existingValues[formateColor] = value;
        }

        result.push(value);
      }
    }

    return result;
  };

  const prepareAndInsertPack = async (existingValues, packString) => {
    let result = existingValues[packString];

    if (!result) {
      result = await packs.create({
        name: packString,
      });

      result = result.dataValues;

      existingValues[packString] = result;
    }

    return result;
  };

  const prepareAndInsertType = async (existingValues, typeString) => {
    let result = existingValues[typeString];

    if (!result) {
      result = await packs.create({
        name: typeString,
        code: typeString,
      });

      result = result.dataValues;

      existingValues[typeString] = result;
    }

    return result;
  };

  const prepareAndInsertFile = async (dbFiles, cardUrlName) => {
    let result = dbFiles
      .filter((item) => item.name === cardUrlName)
      .map((item) => item.dataValues);

    if (result.length === 0) {
      const result_1 = await files.create({
        name: cardUrlName,
        route: `https://nakamadecks.com/imgs/cards/little/${cardUrlName}.png`,
      });

      const result_2 = await files.create({
        name: cardUrlName,
        route: `https://nakamadecks.com/imgs/cards/full/${cardUrlName}.png`,
      });

      dbFiles = [...dbFiles, result_1, result_2];

      result = [result_1.dataValues, result_2.dataValues];
    }

    result = result.sort((a, b) => a.id > b.id);

    return result;
  };

  const reduceBasicDataForModels = async () => {
    let errorCounter = 0;
    let current = 0;
    const total = jsonParse.length;

    try {
      while (current < total) {
        const currentJson = jsonParse[current];

   
        if (dbCardsByCode[currentJson.code]) {
          current++;
          continue
        };

        const categoriesResult = await prepareAndInsertCategory(
          dbCategoriesByName,
          currentJson.category
        );

        const colorsResult = await prepareAndInsertColor(
          dbColorsByName,
          currentJson.color
        );

        const filesResult = await prepareAndInsertFile(
          dbFiles,
          currentJson.url
        );

        const packResult = await prepareAndInsertPack(
          dbPacksByName,
          currentJson.expansion
        );

        const typeResult = await prepareAndInsertType(
          dbTypesByName,
          currentJson.type
        );

        const card = await cards.create({
          ...currentJson,
          card_text: currentJson.hability,
          pack_id: packResult.id,
          type_id: typeResult.id,
          image_id: filesResult[0].id,
          full_image_id: filesResult[1].id,
          cost: currentJson.cost ? currentJson.cost : 0,
          power: currentJson.power ? currentJson.power : 0,
          counter: currentJson.counter ? currentJson.counter : 0,
        });

        while (categoriesResult && categoriesResult.length > 0) {
          let categorie = categoriesResult.pop();

          pivot_cards_categories.create({
            card_id: card.id,
            category_id: categorie.id,
          });
        }

        while (colorsResult && colorsResult.length > 0) {
          let color = colorsResult.pop();

          pivot_cards_colors.create({
            card_id: card.id,
            color_id: color.id,
          });

          if (colorsResult.length <= 0) break;
        }

        current++;

        console.log(`Card ${current} of ${total} inserted`);
      }
    } 
    catch (e) {
      console.error(e)
      errorCounter++;
      errorCounter < 5;
    }
  };

  reduceBasicDataForModels();
})();
