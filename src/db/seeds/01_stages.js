exports.seed = async function (knex) {
  // Delete existing
  await knex("stages").del();

  // Insert stages
  await knex("stages").insert([
    {
      id: 1,
      name: "Tease",
      description: "Clothing-based dares",
      is_final: false,
    },
    {
      id: 2,
      name: "Touch",
      description: "Partner-based play",
      is_final: false,
    },
    {
      id: 3,
      name: "Penetrate",
      description: "Intercourse challenges",
      is_final: false,
    },
    {
      id: 4,
      name: "Leak",
      description: "Bodily fluids + orgasm-focused tasks",
      is_final: false,
    },
    {
      id: 5,
      name: "Reveal",
      description: "Personal fantasy submission, final round",
      is_final: true,
    },
  ]);
};
