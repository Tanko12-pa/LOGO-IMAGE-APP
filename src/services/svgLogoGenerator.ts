import { LogoConcept } from '../types';

export interface LogoGenerationOptions {
  brandName: string;
  tagline?: string;
  industry?: string;
  style: string;
  symbolPreference?: string;
  typographyPreference?: string;
  primaryColor?: string;
  accentColor?: string;
  highlightColor?: string;
  backgroundColor?: string;
  conceptCount: 1 | 4 | 8;
}

export function generateSvgLogoConcepts(options: LogoGenerationOptions): LogoConcept[] {
  const {
    brandName,
    tagline = '',
    style,
    primaryColor = '#800020',
    accentColor = '#F27430',
    highlightColor = '#FFE566',
    backgroundColor = 'transparent',
    conceptCount,
  } = options;

  const cleanName = (brandName || 'BRAND').trim();
  const initials = cleanName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join('') || cleanName.slice(0, 2).toUpperCase();

  const concepts: LogoConcept[] = [];

  // Concept 1: Hexagonal Kinetic Monogram
  concepts.push({
    id: `concept-${Date.now()}-1`,
    title: `${cleanName} Hexagonal Prism`,
    style: style || 'Geometric Minimalist',
    symbolType: 'Geometric Monogram',
    palette: [primaryColor, accentColor, highlightColor, '#FFFFFF'],
    checklist: {
      readable: true,
      balanced: true,
      simple: true,
      scalable: true,
      worksOnDark: true,
      worksOnLight: true,
    },
    rating: 98,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primaryColor}"/>
      <stop offset="100%" stop-color="${accentColor}"/>
    </linearGradient>
    <linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accentColor}"/>
      <stop offset="100%" stop-color="${highlightColor}"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="${backgroundColor}" rx="24"/>
  <g transform="translate(250, 200)">
    <!-- Hexagonal outer orbit -->
    <polygon points="0,-120 104,-60 104,60 0,120 -104,60 -104,-60" fill="none" stroke="url(#grad1)" stroke-width="8" stroke-linejoin="round"/>
    <!-- Inner faceted geometry -->
    <polygon points="0,-90 78,-45 78,45 0,90 -78,45 -78,-45" fill="${primaryColor}" opacity="0.15"/>
    <path d="M0,-85 L65,-40 L0,-10 Z" fill="url(#grad2)"/>
    <path d="M0,85 L-65,40 L0,10 Z" fill="${primaryColor}"/>
    <circle cx="0" cy="0" r="28" fill="${highlightColor}"/>
    <!-- Monogram Initial -->
    <text x="0" y="8" font-family="'Syne', sans-serif" font-size="28" font-weight="800" fill="${primaryColor}" text-anchor="middle">${initials}</text>
  </g>
  <!-- Wordmark -->
  <text x="250" y="370" font-family="'Syne', sans-serif" font-size="34" font-weight="800" fill="#FFFFFF" letter-spacing="4" text-anchor="middle">${cleanName.toUpperCase()}</text>
  ${tagline ? `<text x="250" y="405" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" fill="${highlightColor}" letter-spacing="6" text-anchor="middle">${tagline.toUpperCase()}</text>` : ''}
</svg>`,
  });

  // Concept 2: Modern Kinetic Ribbon / Delta Emblem
  concepts.push({
    id: `concept-${Date.now()}-2`,
    title: `${cleanName} Kinetic Delta`,
    style: 'Modern Tech',
    symbolType: 'Dynamic Ribbon',
    palette: [accentColor, primaryColor, highlightColor],
    checklist: {
      readable: true,
      balanced: true,
      simple: true,
      scalable: true,
      worksOnDark: true,
      worksOnLight: true,
    },
    rating: 96,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <linearGradient id="gradDelta" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${highlightColor}"/>
      <stop offset="50%" stop-color="${accentColor}"/>
      <stop offset="100%" stop-color="${primaryColor}"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="${backgroundColor}" rx="24"/>
  <g transform="translate(250, 190)">
    <path d="M-90,60 C-60,-70 60,-70 90,60 C60,40 -60,40 -90,60 Z" fill="url(#gradDelta)"/>
    <path d="M-60,70 L0,-60 L60,70 L30,70 L0,5 L-30,70 Z" fill="${primaryColor}"/>
    <circle cx="0" cy="-65" r="16" fill="${highlightColor}"/>
    <line x1="-120" y1="80" x2="120" y2="80" stroke="${highlightColor}" stroke-width="3" opacity="0.6"/>
  </g>
  <text x="250" y="365" font-family="'Plus Jakarta Sans', sans-serif" font-size="32" font-weight="800" fill="#FFFFFF" letter-spacing="3" text-anchor="middle">${cleanName.toUpperCase()}</text>
  ${tagline ? `<text x="250" y="400" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="500" fill="${accentColor}" letter-spacing="5" text-anchor="middle">// ${tagline.toUpperCase()} //</text>` : ''}
</svg>`,
  });

  // Concept 3: Luxury Crest with Radial Bevels
  concepts.push({
    id: `concept-${Date.now()}-3`,
    title: `${cleanName} Sovereign Shield`,
    style: 'Luxury Corporate',
    symbolType: 'Emblem Crest',
    palette: [primaryColor, highlightColor, '#FFFFFF'],
    checklist: {
      readable: true,
      balanced: true,
      simple: true,
      scalable: true,
      worksOnDark: true,
      worksOnLight: true,
    },
    rating: 97,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <radialGradient id="luxGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${highlightColor}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${primaryColor}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="${backgroundColor}" rx="24"/>
  <circle cx="250" cy="190" r="110" fill="url(#luxGlow)"/>
  <g transform="translate(250, 190)">
    <!-- Crest Shield Outline -->
    <path d="M0,-85 C60,-85 90,-50 90,20 C90,75 40,110 0,130 C-40,110 -90,75 -90,20 C-90,-50 -60,-85 0,-85 Z" fill="${primaryColor}" stroke="${highlightColor}" stroke-width="5" stroke-linejoin="round"/>
    <!-- Inner golden border -->
    <path d="M0,-72 C48,-72 74,-42 74,15 C74,62 34,92 0,110 C-34,92 -74,62 -74,15 C-74,-42 -48,-72 0,-72 Z" fill="none" stroke="${accentColor}" stroke-width="2"/>
    <!-- Luxury Initial Star -->
    <polygon points="0,-40 10,-10 40,-10 15,10 25,40 0,20 -25,40 -15,10 -40,-10 -10,-10" fill="${highlightColor}"/>
    <text x="0" y="70" font-family="'Syne', sans-serif" font-size="42" font-weight="800" fill="#FFFFFF" text-anchor="middle">${initials[0] || 'V'}</text>
  </g>
  <text x="250" y="370" font-family="'Syne', sans-serif" font-size="30" font-weight="700" fill="#FFFFFF" letter-spacing="6" text-anchor="middle">${cleanName.toUpperCase()}</text>
  ${tagline ? `<text x="250" y="405" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="600" fill="${highlightColor}" letter-spacing="4" text-anchor="middle">★ ${tagline.toUpperCase()} ★</text>` : ''}
</svg>`,
  });

  // Concept 4: Minimalist Abstract Lineform & Infinity Knot
  concepts.push({
    id: `concept-${Date.now()}-4`,
    title: `${cleanName} Infinite Continuum`,
    style: 'Minimalist Line-Art',
    symbolType: 'Infinite Loop',
    palette: [accentColor, highlightColor, primaryColor],
    checklist: {
      readable: true,
      balanced: true,
      simple: true,
      scalable: true,
      worksOnDark: true,
      worksOnLight: true,
    },
    rating: 95,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <linearGradient id="loopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primaryColor}"/>
      <stop offset="50%" stop-color="${accentColor}"/>
      <stop offset="100%" stop-color="${highlightColor}"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="${backgroundColor}" rx="24"/>
  <g transform="translate(250, 190)">
    <circle cx="-50" cy="0" r="45" fill="none" stroke="${primaryColor}" stroke-width="12"/>
    <circle cx="50" cy="0" r="45" fill="none" stroke="${accentColor}" stroke-width="12"/>
    <path d="M-50,-45 C0,-45 0,45 50,45" fill="none" stroke="${highlightColor}" stroke-width="12" stroke-linecap="round"/>
    <circle cx="0" cy="0" r="14" fill="#FFFFFF"/>
  </g>
  <text x="250" y="365" font-family="'Plus Jakarta Sans', sans-serif" font-size="34" font-weight="800" fill="#FFFFFF" letter-spacing="2" text-anchor="middle">${cleanName}</text>
  ${tagline ? `<text x="250" y="400" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="500" fill="${highlightColor}" letter-spacing="4" text-anchor="middle">${tagline}</text>` : ''}
</svg>`,
  });

  // Concepts 5-8 (if conceptCount is 8)
  if (conceptCount === 8) {
    // Concept 5: Tech Cyber Circuit Monogram
    concepts.push({
      id: `concept-${Date.now()}-5`,
      title: `${cleanName} Quantum Node`,
      style: 'Cyber Tech',
      symbolType: 'Circuit Mark',
      palette: [primaryColor, accentColor, '#FFFFFF'],
      checklist: { readable: true, balanced: true, simple: true, scalable: true, worksOnDark: true, worksOnLight: true },
      rating: 94,
      svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <rect width="100%" height="100%" fill="${backgroundColor}" rx="24"/>
  <g transform="translate(250, 190)">
    <circle cx="0" cy="0" r="85" fill="none" stroke="${primaryColor}" stroke-width="6" stroke-dasharray="14 10"/>
    <polygon points="0,-60 52,30 -52,30" fill="${accentColor}" opacity="0.8"/>
    <polygon points="0,60 52,-30 -52,-30" fill="${highlightColor}" opacity="0.6"/>
    <circle cx="0" cy="0" r="20" fill="#FFFFFF"/>
  </g>
  <text x="250" y="365" font-family="'JetBrains Mono', monospace" font-size="30" font-weight="700" fill="#FFFFFF" letter-spacing="4" text-anchor="middle">${cleanName.toUpperCase()}</text>
  <text x="250" y="400" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="600" fill="${accentColor}" letter-spacing="5" text-anchor="middle">INTELLIGENCE NETWORK</text>
</svg>`,
    });

    // Concept 6: Bold Retro Vintage Stamp
    concepts.push({
      id: `concept-${Date.now()}-6`,
      title: `${cleanName} Heritage Stamp`,
      style: 'Vintage Retro',
      symbolType: 'Circular Seal',
      palette: [primaryColor, highlightColor, '#FFFFFF'],
      checklist: { readable: true, balanced: true, simple: true, scalable: true, worksOnDark: true, worksOnLight: true },
      rating: 95,
      svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <rect width="100%" height="100%" fill="${backgroundColor}" rx="24"/>
  <g transform="translate(250, 190)">
    <circle cx="0" cy="0" r="95" fill="${primaryColor}" stroke="${highlightColor}" stroke-width="4"/>
    <circle cx="0" cy="0" r="85" fill="none" stroke="${highlightColor}" stroke-width="2" stroke-dasharray="6 6"/>
    <polygon points="0,-45 12,-15 45,-15 18,5 28,38 0,18 -28,38 -18,5 -45,-15 -12,-15" fill="${highlightColor}"/>
    <text x="0" y="55" font-family="'Syne', sans-serif" font-size="28" font-weight="800" fill="#FFFFFF" letter-spacing="2" text-anchor="middle">EST. 2026</text>
  </g>
  <text x="250" y="365" font-family="'Syne', sans-serif" font-size="32" font-weight="800" fill="#FFFFFF" letter-spacing="4" text-anchor="middle">${cleanName.toUpperCase()}</text>
  <text x="250" y="400" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" fill="${highlightColor}" letter-spacing="3" text-anchor="middle">★ CRAFTED FOR PERFECTION ★</text>
</svg>`,
    });

    // Concept 7: Bold Typographic Lettermark
    concepts.push({
      id: `concept-${Date.now()}-7`,
      title: `${cleanName} Typo Architect`,
      style: 'Bold Typographic',
      symbolType: 'Lettermark',
      palette: [accentColor, highlightColor, primaryColor],
      checklist: { readable: true, balanced: true, simple: true, scalable: true, worksOnDark: true, worksOnLight: true },
      rating: 97,
      svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <rect width="100%" height="100%" fill="${backgroundColor}" rx="24"/>
  <g transform="translate(250, 190)">
    <rect x="-80" y="-80" width="160" height="160" rx="36" fill="${primaryColor}" stroke="${accentColor}" stroke-width="6"/>
    <text x="0" y="32" font-family="'Syne', sans-serif" font-size="96" font-weight="900" fill="${highlightColor}" text-anchor="middle">${initials}</text>
  </g>
  <text x="250" y="365" font-family="'Plus Jakarta Sans', sans-serif" font-size="34" font-weight="800" fill="#FFFFFF" letter-spacing="3" text-anchor="middle">${cleanName.toUpperCase()}</text>
  <text x="250" y="400" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="600" fill="${highlightColor}" letter-spacing="6" text-anchor="middle">SIGNATURE IDENTITY</text>
</svg>`,
    });

    // Concept 8: Organic Apex Flame
    concepts.push({
      id: `concept-${Date.now()}-8`,
      title: `${cleanName} Apex Luminary`,
      style: 'Creative Abstract',
      symbolType: 'Apex Flame',
      palette: [primaryColor, accentColor, highlightColor],
      checklist: { readable: true, balanced: true, simple: true, scalable: true, worksOnDark: true, worksOnLight: true },
      rating: 96,
      svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="${primaryColor}"/>
      <stop offset="60%" stop-color="${accentColor}"/>
      <stop offset="100%" stop-color="${highlightColor}"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="${backgroundColor}" rx="24"/>
  <g transform="translate(250, 190)">
    <path d="M0,-90 C40,-50 70,-10 60,40 C50,85 -50,85 -60,40 C-70,-10 -40,-50 0,-90 Z" fill="url(#flameGrad)"/>
    <path d="M0,-50 C20,-20 35,0 30,30 C25,55 -25,55 -30,30 C-35,0 -20,-20 0,-50 Z" fill="#FFFFFF" opacity="0.9"/>
  </g>
  <text x="250" y="365" font-family="'Syne', sans-serif" font-size="32" font-weight="800" fill="#FFFFFF" letter-spacing="4" text-anchor="middle">${cleanName.toUpperCase()}</text>
  <text x="250" y="400" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" fill="${highlightColor}" letter-spacing="4" text-anchor="middle">INNOVATION LAB</text>
</svg>`,
    });
  }

  return concepts.slice(0, conceptCount);
}

// Helper to format clean, production-grade Scalable Vector Graphics (SVG)
export function formatSvgForExport(
  rawSvg: string,
  options?: {
    preset?: 'standard' | 'print-300dpi' | 'web-minified' | 'monochrome' | 'app-icon';
    backgroundColor?: string;
    includeXmlDeclaration?: boolean;
    includeMetadata?: boolean;
    width?: number | string;
    height?: number | string;
  }
): string {
  const {
    preset = 'standard',
    backgroundColor = 'transparent',
    includeXmlDeclaration = true,
    includeMetadata = true,
    width,
    height,
  } = options || {};

  let svg = rawSvg.trim();

  // If monochrome requested, convert fill and stroke colors to pure black or white
  if (preset === 'monochrome') {
    // Strip gradients or map fills
    svg = svg.replace(/fill="url\(#[^)]+\)"/g, 'fill="#000000"');
    svg = svg.replace(/stroke="url\(#[^)]+\)"/g, 'stroke="#000000"');
    svg = svg.replace(/fill="#(?!000000|FFFFFF)[0-9a-fA-F]{3,8}"/gi, 'fill="#000000"');
    svg = svg.replace(/stroke="#(?!000000|FFFFFF)[0-9a-fA-F]{3,8}"/gi, 'stroke="#000000"');
  }

  // Update background rect if present or inject one
  if (backgroundColor && backgroundColor !== 'transparent') {
    if (svg.includes('<rect width="100%" height="100%"')) {
      svg = svg.replace(/<rect width="100%" height="100%" fill="[^"]*"/, `<rect width="100%" height="100%" fill="${backgroundColor}"`);
    } else {
      svg = svg.replace(/(<svg[^>]*>)/i, `$1\n  <rect width="100%" height="100%" fill="${backgroundColor}"/>`);
    }
  } else if (backgroundColor === 'transparent') {
    if (svg.includes('<rect width="100%" height="100%"')) {
      svg = svg.replace(/<rect width="100%" height="100%" fill="[^"]*"/, `<rect width="100%" height="100%" fill="none"`);
    }
  }

  // Scale or adjust dimensions if needed
  if (preset === 'print-300dpi') {
    // High-resolution vector print target (2048x2048 standard container preserving viewBox)
    svg = svg.replace(/<svg\s+([^>]*?)>/i, (match, attrs) => {
      let cleanAttrs = attrs.replace(/\b(width|height)="[^"]*"/g, '').trim();
      return `<svg ${cleanAttrs} width="${width || 2048}" height="${height || 2048}">`;
    });
  } else if (preset === 'app-icon') {
    svg = svg.replace(/<svg\s+([^>]*?)>/i, (match, attrs) => {
      let cleanAttrs = attrs.replace(/\b(width|height)="[^"]*"/g, '').trim();
      return `<svg ${cleanAttrs} width="${width || 512}" height="${height || 512}">`;
    });
  }

  // Ensure xmlns and viewBox are properly present
  if (!svg.includes('xmlns="http://www.w3.org/2000/svg"')) {
    svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!svg.includes('xmlns:xlink="http://www.w3.org/1999/xlink"')) {
    svg = svg.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }

  const metadataComment = includeMetadata
    ? `<!--\n  Scalable Vector Graphic (SVG) - Resolution Independent Vector\n  Format: SVG 1.1 / W3C Standard (Infinite Scalability for Digital & 300+ DPI Print)\n  Preset: ${preset.toUpperCase()} | Generated by LOGO & IMAGE GENERATOR Studio\n-->\n`
    : '';

  const xmlDeclaration = includeXmlDeclaration
    ? `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n`
    : '';

  return `${xmlDeclaration}${metadataComment}${svg}`;
}

export type SvgInspectionMode = 'combined' | 'wireframe' | 'fill' | 'stroke';

export interface SvgInspectionOptions {
  mode: SvgInspectionMode;
  wireframeStrokeColor?: string;
  wireframeStrokeWidth?: number;
  showWireframeNodes?: boolean;
  strokeOnlyColor?: string;
  strokeOnlyWidth?: number;
  backgroundColor?: string;
}

export function transformSvgViewMode(rawSvg: string, options: SvgInspectionOptions): string {
  const {
    mode,
    wireframeStrokeColor = '#38BDF8',
    wireframeStrokeWidth = 1.25,
    showWireframeNodes = true,
    strokeOnlyColor = '#FFFFFF',
    strokeOnlyWidth = 2,
    backgroundColor = 'transparent',
  } = options;

  let svg = rawSvg.trim();

  // If combined (Standard view), return with standard formatting
  if (mode === 'combined') {
    return formatSvgForExport(svg, {
      backgroundColor,
      includeMetadata: false,
      includeXmlDeclaration: false,
    });
  }

  // 1. Wireframe Mode: Outline paths, no fills, cyan/amber vector wireframe, blueprint grid
  if (mode === 'wireframe') {
    // Strip any background rect so blueprint grid shows
    svg = svg.replace(/<rect\s+width="100%"\s+height="100%"[^>]*\/>/gi, '');

    // Replace all fills with 'none'
    svg = svg.replace(/fill="[^"]*"/gi, 'fill="none"');

    // Replace existing stroke color and width with high-contrast wireframe lines
    svg = svg.replace(/stroke="[^"]*"/gi, `stroke="${wireframeStrokeColor}"`);
    svg = svg.replace(/stroke-width="[^"]*"/gi, `stroke-width="${wireframeStrokeWidth}"`);

    // Ensure elements lacking a stroke attribute receive the wireframe stroke
    svg = svg.replace(
      /<(path|polygon|polyline|circle|ellipse|line|rect)(?![^>]*\bstroke=)([^>]*)>/gi,
      `<$1 stroke="${wireframeStrokeColor}" stroke-width="${wireframeStrokeWidth}" vector-effect="non-scaling-stroke" $2>`
    );

    // Inject blueprint grid pattern
    const blueprintGrid = `
    <pattern id="cadWireframeGrid" width="25" height="25" patternUnits="userSpaceOnUse">
      <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(56, 189, 248, 0.15)" stroke-width="0.75"/>
      <circle cx="0" cy="0" r="1.5" fill="rgba(56, 189, 248, 0.35)"/>
    </pattern>
    `;

    if (svg.includes('<defs>')) {
      svg = svg.replace('<defs>', `<defs>${blueprintGrid}`);
    } else {
      svg = svg.replace(/(<svg[^>]*>)/i, `$1\n  <defs>${blueprintGrid}</defs>`);
    }

    svg = svg.replace(
      /(<svg[^>]*>)/i,
      `$1\n  <rect width="100%" height="100%" fill="url(#cadWireframeGrid)" />`
    );

    return svg;
  }

  // 2. Fill Mode: Solid fills only, zero strokes
  if (mode === 'fill') {
    // Strip all stroke styling
    svg = svg.replace(/stroke="[^"]*"/gi, 'stroke="none"');
    svg = svg.replace(/stroke-width="[^"]*"/gi, 'stroke-width="0"');

    // If an element was purely stroke with fill="none", provide a solid fill so shape remains visible
    svg = svg.replace(/fill="none"/gi, 'fill="currentColor"');

    return svg;
  }

  // 3. Stroke Mode: Pure stroked geometry, zero fills
  if (mode === 'stroke') {
    // Strip background rect
    svg = svg.replace(/<rect\s+width="100%"\s+height="100%"[^>]*\/>/gi, '');

    // Convert all fills to none
    svg = svg.replace(/fill="[^"]*"/gi, 'fill="none"');

    // Replace stroke color and width
    svg = svg.replace(/stroke="[^"]*"/gi, `stroke="${strokeOnlyColor}"`);
    svg = svg.replace(/stroke-width="[^"]*"/gi, `stroke-width="${strokeOnlyWidth}"`);

    // Ensure elements lacking a stroke attribute get the stroke
    svg = svg.replace(
      /<(path|polygon|polyline|circle|ellipse|line|rect)(?![^>]*\bstroke=)([^>]*)>/gi,
      `<$1 stroke="${strokeOnlyColor}" stroke-width="${strokeOnlyWidth}" $2>`
    );

    return svg;
  }

  return svg;
}

// Direct Download function for Scalable Vector Graphics (.svg)
export function downloadSvgFile(
  svgString: string,
  filename: string,
  options?: {
    preset?: 'standard' | 'print-300dpi' | 'web-minified' | 'monochrome' | 'app-icon';
    backgroundColor?: string;
  }
): void {
  const formatted = formatSvgForExport(svgString, options);
  const blob = new Blob([formatted], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeFilename = filename.endsWith('.svg') ? filename : `${filename}.svg`;
  link.download = safeFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Convert SVG string to downloadable PNG Data URL
export async function svgToPngDataUrl(svgString: string, width = 1024, height = 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(blobURL);
        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = (e) => {
        URL.revokeObjectURL(blobURL);
        reject(e);
      };

      img.src = blobURL;
    } catch (err) {
      reject(err);
    }
  });
}

// Generate a rich, resolution-independent vector asset SVG based on prompt and style
export function generateVectorAssetFromPrompt(
  prompt: string,
  title: string,
  style: string,
  palette: string[] = ['#800020', '#F27430', '#FFE566', '#FFFFFF']
): string {
  const p1 = palette[0] || '#800020';
  const p2 = palette[1] || '#F27430';
  const p3 = palette[2] || '#FFE566';
  const p4 = palette[3] || '#FFFFFF';

  const cleanPrompt = prompt.toLowerCase();
  const isMinimal = cleanPrompt.includes('minimal') || style.includes('Minimalist');
  const isTech = cleanPrompt.includes('tech') || cleanPrompt.includes('cyber') || cleanPrompt.includes('future');
  const isWatchOrCircle = cleanPrompt.includes('watch') || cleanPrompt.includes('time') || cleanPrompt.includes('circle');

  if (isWatchOrCircle) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="vecGradDial" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#18181B"/>
      <stop offset="70%" stop-color="#09090B"/>
      <stop offset="100%" stop-color="${p1}"/>
    </radialGradient>
    <linearGradient id="vecGradBezel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p3}"/>
      <stop offset="50%" stop-color="${p2}"/>
      <stop offset="100%" stop-color="${p1}"/>
    </linearGradient>
  </defs>
  <circle cx="300" cy="300" r="260" fill="url(#vecGradDial)" stroke="url(#vecGradBezel)" stroke-width="8"/>
  <circle cx="300" cy="300" r="220" fill="none" stroke="${p2}" stroke-width="2" stroke-dasharray="8 6"/>
  <circle cx="300" cy="300" r="170" fill="none" stroke="${p3}" stroke-width="1.5" opacity="0.6"/>
  <!-- Subdials -->
  <circle cx="300" cy="220" r="45" fill="#121214" stroke="${p2}" stroke-width="2"/>
  <circle cx="230" cy="340" r="45" fill="#121214" stroke="${p1}" stroke-width="2"/>
  <circle cx="370" cy="340" r="45" fill="#121214" stroke="${p3}" stroke-width="2"/>
  <!-- Hands -->
  <polygon points="296,300 298,140 302,140 304,300" fill="${p4}"/>
  <polygon points="294,300 297,200 303,200 306,300" fill="${p3}"/>
  <line x1="300" y1="300" x2="390" y2="240" stroke="${p2}" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="300" cy="300" r="10" fill="${p3}" stroke="#09090B" stroke-width="3"/>
</svg>`;
  }

  if (isTech) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <linearGradient id="techGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p2}"/>
      <stop offset="100%" stop-color="${p1}"/>
    </linearGradient>
  </defs>
  <rect x="50" y="50" width="500" height="500" rx="36" fill="#0C0D12" stroke="${p1}" stroke-width="4"/>
  <!-- Circuit Nodes -->
  <path d="M 120 180 L 220 180 L 280 240 L 400 240 L 480 320" fill="none" stroke="${p2}" stroke-width="4" stroke-linecap="round"/>
  <path d="M 120 420 L 220 420 L 280 360 L 400 360 L 480 280" fill="none" stroke="${p3}" stroke-width="4" stroke-linecap="round"/>
  <!-- Central Microchip Matrix -->
  <rect x="220" y="220" width="160" height="160" rx="16" fill="url(#techGrad)" stroke="${p4}" stroke-width="3"/>
  <circle cx="300" cy="300" r="48" fill="#09090B" stroke="${p3}" stroke-width="4"/>
  <polygon points="300,270 326,315 274,315" fill="${p3}"/>
  <!-- Terminal pads -->
  <circle cx="120" cy="180" r="8" fill="${p2}"/>
  <circle cx="480" cy="320" r="8" fill="${p2}"/>
  <circle cx="120" cy="420" r="8" fill="${p3}"/>
  <circle cx="480" cy="280" r="8" fill="${p3}"/>
</svg>`;
  }

  // Geometric Monogram / Universal Luxury Crest
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <linearGradient id="crestGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p1}"/>
      <stop offset="50%" stop-color="${p2}"/>
      <stop offset="100%" stop-color="${p3}"/>
    </linearGradient>
    <linearGradient id="crestGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${p3}"/>
      <stop offset="100%" stop-color="${p1}"/>
    </linearGradient>
  </defs>
  <g transform="translate(300, 300)">
    <!-- Outer Hexagonal Prism Facets -->
    <polygon points="0,-210 182,-105 182,105 0,210 -182,105 -182,-105" fill="none" stroke="url(#crestGrad1)" stroke-width="10" stroke-linejoin="round"/>
    <polygon points="0,-160 138,-80 138,80 0,160 -138,80 -138,-80" fill="none" stroke="${p3}" stroke-width="3" stroke-dasharray="12 8" opacity="0.8"/>
    <!-- Interlocking Diamond Monoliths -->
    <polygon points="0,-150 110,0 0,60 -110,0" fill="url(#crestGrad2)" opacity="0.9" stroke="${p4}" stroke-width="2"/>
    <polygon points="0,150 110,0 0,-60 -110,0" fill="url(#crestGrad1)" opacity="0.85" stroke="${p4}" stroke-width="2"/>
    <!-- Central Jewel -->
    <circle cx="0" cy="0" r="32" fill="#09090B" stroke="${p3}" stroke-width="4"/>
    <polygon points="0,-18 16,10 -16,10" fill="${p3}"/>
    <!-- Radiating Crest Rays -->
    <line x1="0" y1="-210" x2="0" y2="-245" stroke="${p3}" stroke-width="4" stroke-linecap="round"/>
    <line x1="182" y1="-105" x2="212" y2="-122" stroke="${p2}" stroke-width="4" stroke-linecap="round"/>
    <line x1="182" y1="105" x2="212" y2="122" stroke="${p1}" stroke-width="4" stroke-linecap="round"/>
    <line x1="0" y1="210" x2="0" y2="245" stroke="${p3}" stroke-width="4" stroke-linecap="round"/>
    <line x1="-182" y1="105" x2="-212" y2="122" stroke="${p2}" stroke-width="4" stroke-linecap="round"/>
    <line x1="-182" y1="-105" x2="-212" y2="-122" stroke="${p1}" stroke-width="4" stroke-linecap="round"/>
  </g>
</svg>`;
}
