export function simplePdf(lines: string[]) {
  const body = ["BT", "/F1 12 Tf", "50 770 Td", ...lines.flatMap((l, i) => (i ? ["0 -18 Td", `(${l.replace(/[()\\]/g, "")}) Tj`] : [`(${l.replace(/[()\\]/g, "")}) Tj`])), "ET"].join("\n");
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    `5 0 obj\n<< /Length ${Buffer.byteLength(body)} >>\nstream\n${body}\nendstream\nendobj\n`
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const obj of objects) { offsets.push(Buffer.byteLength(pdf)); pdf += obj; }
  const x = Buffer.byteLength(pdf);
  pdf += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map((o)=>`${o.toString().padStart(10,"0")} 00000 n \n`).join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${x}\n%%EOF`;
  return Buffer.from(pdf);
}
