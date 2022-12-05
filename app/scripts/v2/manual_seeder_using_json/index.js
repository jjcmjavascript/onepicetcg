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
  pivot_cards_effects,
  pivot_cards_packs,
  pivot_cards_types,
} = require("../../../services/database");

(async () => {
  // sequelize elements
  const dbCards = await cards.findAll();
  const dbCardsByName = dbCards.reduce((oldCard, nextCard) => {
    return (oldCard[nextCard.code] = nextCard);
  }, {});

  const dbCategories = await categories.findAll();
  const dbCategoriesByName = dbCategories.reduce(
    (oldCategory, nextCategory) => {
      let value = nextCategory.dataValues;
      oldCategory[value.name] = value;

      return oldCategory;
    },
    {}
  );

  const dbColors = await colors.findAll();
  const dbColorsByName = dbColors.reduce((oldColor, nextColor) => {
    let value = nextEffect.nextColor;
    oldColor[value.name] = value;

    return oldColor;
  }, {});

  const dbEffects = await effects.findAll();
  const dbEffectsByName = dbEffects.reduce((oldEffect, nextEffect) => {
    let value = nextEffect.dataValues;
  }, {});

  const dbFiles = await files.findAll();
  const dbFilesByName = dbFiles.reduce((oldFile, nextFile) => {
    return (oldFile[nextFile.route] = nextFile);
  }, {});

  const dbPacks = await packs.findAll();
  const dbPacksByName = dbPacks.reduce((oldPack, nextPack) => {
    return (oldPack[nextPack.name] = nextPack);
  }, {});

  const dbTypes = await types.findAll();
  const dbTypesByName = dbTypes.reduce((oldType, nextType) => {
    return (oldType[nextType.name] = nextType);
  }, {});

  const dbPivotCardsCategories = await pivot_cards_categories.findAll();
  const dbPivotCardsColors = await pivot_cards_colors.findAll();
  const dbPivotCardsEffects = await pivot_cards_effects.findAll();
  const dbPivotCardsPacks = await pivot_cards_packs.findAll();
  const dbPivotCardsTypes = await pivot_cards_types.findAll();

  const client = async (imgName, size = "little") => {
    return axios.get(`https://nakamadecks.com/imgs/cards/${size}/${imgName}`);
  };

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

          existingValues[formateCategory] = value.dataValues;
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

          existingValues[formateColor] = value.dataValues;
        }

        result.push(value);
      }
    }

    return result;
  };

  const reduceBasicDataForModels = async () => {
    let errorCounter = 0;
    let current = 0;
    const total = jsonParse.length;

    try {
      while (current < total) {
        const { category, color, effect, file, pack, type } =
          jsonParse[current];

        const categoriesResult = await prepareAndInsertCategory(
          dbCategoriesByName,
          category
        );

        const colorResult = await prepareAndInsertColor(dbColorsByName, color);

        // await prepareEffectDataAndInsert(effect);

        // await prepareFileDataAndInsert(file);

        // await preparePackDataAndInsert(pack);

        // await prepareTypeDataAndInsert(type);

        current++;
      }
    } catch (e) {
      console.error(e);
      errorCounter++;
      errorCounter < 5 && reduceBasicDataForModels();
    }
  };

  reduceBasicDataForModels();
})();
