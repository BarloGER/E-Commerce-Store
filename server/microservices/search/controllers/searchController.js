import { elasticClient } from "../utils/elasticSetup.js";

export const elasticSearch = async (req, res) => {
  try {
    const query = req.body.query;
    const response = await elasticClient.search({
      index: "products",
      body: {
        query: {
          match: { ItemDescription: query },
        },
      },
    });

    // Überprüfe, ob die Antwort die erwartete Struktur hat
    if (response) {
      // Transformiere die Ergebnisse zu einem einfacheren Format, falls nötig
      const results = response.hits.hits.map((hit) => hit._source);
      res.status(200).json({ results });
    } else {
      // Keine Treffer gefunden oder unerwartete Antwortstruktur
      res.status(200).json({ results: [] });
    }
  } catch (error) {
    console.error("Error during Elasticsearch search:", error);
    // Stelle sicher, dass du einen angemessenen HTTP-Statuscode zurückgibst
    res
      .status(500)
      .json({ message: "Error during search", error: error.toString() });
  }
};
