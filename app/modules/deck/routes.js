module.exports = (controller) => {
  return [
    {
      method: "get",
      path: "/cards",
      handler: async (req, res) => controller.getAllCards(req, res),
    },
    {
      method: "get",
      path: "/cards/filters",
      handler: async (req, res) => controller.getFilters(req, res),
    },

    {
      method: "get",
      path: "/cards/decks",
      handler: async (req, res) => controller.getAllDecks(req, res),
    },
  ];
};
