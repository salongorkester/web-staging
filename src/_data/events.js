import Fetch from "@11ty/eleventy-fetch";
import { parse } from "csv-parse/sync";
import { DateTime } from "luxon";
import markdownIt from "markdown-it";

const CSV_URL = process.env.SHEET_CSV_URL
const zone = "Europe/Oslo";
const expectedDateFormats = [
  "yyyy-MM-dd HH:mm",
  "MM/dd/yyyy HH:mm",
  "yyyy-MM-dd",
  "MM/dd/yyyy"
];
const indices = {
  OPEN: 0,
  START: 1,
  END: 2,
  TICKETS: 3,
  PLACE: 4,
  MAP: 5,
  EMBED: 6,
  ACTIVE: 7,
  TITLE: 8,
  BODY: 9
};

function parseDate(s) {
  s = (s || "").trim();
  let d = null, i = 0;
  for (; i < expectedDateFormats.length; i++) {
    d = DateTime.fromFormat(s, expectedDateFormats[i], { zone: zone });
    if (d.isValid) {
      break;
    }
  }
  return d.isValid ? d.setLocale("nb") : null;
}

export default async function() {
  const now = DateTime.now().setZone(zone);
  const csv = await Fetch(`${CSV_URL}&nocache=${now.toMillis()}`, {
    duration: "0s",
    type: "text",
    verbose: true
  });

  const rows = parse(csv, {
    columns: false,
    skip_empty_lines: true,
    bom: true
  });

  const [header, ...dataRows] = rows;

  const md = markdownIt();

  return dataRows.map(r => {
    if (r[indices.ACTIVE] !== "TRUE") {
      return null
    }
    const open = parseDate(r[indices.OPEN]);
    const start = parseDate(r[indices.START]);
    const end = parseDate(r[indices.END]);
    return {
      date: start,
      open: open ? open.toFormat("EEEE dd.MM.yyyy HH:mm") : null,
      start: start ? start.toFormat("EEEE dd.MM.yyyy HH:mm") : null,
      end: end ? end.toFormat("EEEE dd.MM.yyyy HH:mm") : null,
      tickets: r[indices.TICKETS]?.trim(),
      place: r[indices.PLACE].trim(),
      map: r[indices.MAP]?.trim(),
      embed: r[indices.EMBED]?.trim(),
      title: r[indices.TITLE]?.trim(),
      body: md.render(r[indices.BODY]?.trim()),
    }
  }).filter(r => r && r.date > now).toSorted(
    (l, r) => l.date == r.date ? 0 : (l.date > r.date ? 1 : -1)
  );
}
