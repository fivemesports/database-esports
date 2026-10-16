import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 0;

export async function GET(req: Request) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ configured: false, rankings: [], message: "Supabase belum dikonfigurasi." });
  }

  const params = new URL(req.url).searchParams;
  const month = params.get("month"); // YYYY-MM-01, optional
  const countryCode = params.get("country_code");
  const query = new URLSearchParams({
    select: "month,country_code,server_id,hostname,avg_players,peak_players,sample_count,rank",
    order: "month.desc,country_code.asc,rank.asc",
    limit: "5000",
  });
  if (month && /^\d{4}-\d{2}-01$/.test(month)) query.set("month", `eq.${month}`);
  if (countryCode && /^[A-Za-z]{2}$/.test(countryCode)) query.set("country_code", `eq.${countryCode.toUpperCase()}`);

  try {
    const response = await fetch(`${url}/rest/v1/monthly_country_top10?${query.toString()}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Supabase returned ${response.status}`);
    return NextResponse.json({ configured: true, rankings: await response.json() });
  } catch {
    return NextResponse.json({ configured: true, rankings: [], message: "Ranking bulanan belum tersedia. Pastikan schema Supabase sudah dijalankan." }, { status: 502 });
  }
}
