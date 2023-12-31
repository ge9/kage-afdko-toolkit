export const svg_headers = {
svgbegin : `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" baseProfile="full" viewBox="0 -120 1000 880" width="1000" height="1000">
`,

svgend : `
</svg>`,
header_out: `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">

<defs>`, 
header : `<font id="Untitled1" horiz-adv-x="1000" >
  <font-face 
    font-family="Untitled1"
    font-weight="400"
    font-stretch="normal"
    units-per-em="1000"
    ascent="880"
    descent="-120"
    bbox="0 0 1000 1000"
    underline-thickness="50"
    underline-position="-100"
  />

`,
    //<missing-glyph />は不要？
end : `</font>`,
end_out : `</defs></svg>`
}
