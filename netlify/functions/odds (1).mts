import type { Config } from "@netlify/functions";

const ODDS_KEY = Netlify.env.get("ODDS_API_KEY") ?? "";

export default async (req: Request) => {
  const url = new URL(req.url);
  const sport = url.searchParams.get("sport") ?? "soccer_epl";

  const oddsUrl =
    `https://api.the-odds-api.com/v4/sports/${sport}/odds/` +
    `?apiKey=${ODDS_KEY}&regions=uk,eu&markets=h2h&oddsFormat=decimal&dateFormat=iso`;

  try {
    const resp = await fetch(oddsUrl);
    const data = await resp.json();
    return new Response(JSON.stringify(data), {
      status: resp.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
};

export const config: Config = {
  path: "/api/odds",
};
