import pptxgen from 'pptxgenjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Slide } from '../types/pitch';

export async function exportDeckToPptx(slides: Slide[], pitchTitle: string = 'Startup Pitch Deck'): Promise<void> {
  const pres = new pptxgen();

  // Configure widescreen 16:9 presentation layout (13.333 x 7.5 inches)
  pres.defineLayout({ name: 'WIDESCREEN_16_9', width: 13.333, height: 7.5 });
  pres.layout = 'WIDESCREEN_16_9';
  pres.title = pitchTitle;
  pres.subject = 'Generated with PitchArchitect.AI Multi-Agent System';

  const themeDarkBg = '4D44FF';
  const themeCardBg = '2A15C2';
  const themeCardBorder = '5A4BFF';
  const themeCardHighlightBg = '3823D9';
  const textWhite = 'FFFFFF';
  const textMuted = 'FFCCD5';
  const textDim = 'FFEBF0';
  const accentPrimary = 'FFCCD5';
  const accentSilver = 'FFE5EA';
  const accentEmerald = 'FFCCD5';
  const accentRose = 'FFCCD5';
  const accentAmber = 'FFCCD5';

  slides.forEach((slide) => {
    const s = pres.addSlide();
    s.background = { color: themeDarkBg };

    // Standard Header
    s.addText(slide.navTitle.toUpperCase(), {
      x: 0.8,
      y: 0.4,
      w: 8.0,
      h: 0.35,
      fontSize: 10,
      bold: true,
      color: textDim,
      fontFace: 'Arial',
    });

    // Provenance / Reference Grounding Note at Bottom
    if (slide.groundedArchetypeCitation) {
      s.addText(`GROUNDED BLUEPRINT: ${slide.groundedArchetypeCitation}`, {
        x: 0.8,
        y: 6.9,
        w: 11.7,
        h: 0.3,
        fontSize: 9,
        italic: true,
        color: textDim,
        fontFace: 'Arial',
      });
    }

    const content = slide.content as any;

    // 1. PROBLEM SLIDE
    if (slide.type === 'problem') {
      s.addText(content.title || 'The Critical Breakdown', {
        x: 0.8,
        y: 0.75,
        w: 11.7,
        h: 0.55,
        fontSize: 22,
        bold: true,
        color: textWhite,
        fontFace: 'Arial',
      });
      s.addText(content.subtitle || '', {
        x: 0.8,
        y: 1.3,
        w: 11.7,
        h: 0.35,
        fontSize: 13,
        color: textMuted,
        fontFace: 'Arial',
      });

      const painPoints = content.painPoints || [];
      const cardWidth = 3.7;
      const cardGap = 0.3;

      painPoints.slice(0, 3).forEach((p: any, idx: number) => {
        const xPos = 0.8 + idx * (cardWidth + cardGap);
        s.addShape(pres.ShapeType.roundRect, {
          x: xPos,
          y: 1.8,
          w: cardWidth,
          h: 4.8,
          fill: { color: themeCardBg },
          line: { color: themeCardBorder, width: 1 },
          rectRadius: 0.08,
        });

        s.addText(p.title, {
          x: xPos + 0.25,
          y: 2.0,
          w: cardWidth - 0.5,
          h: 0.6,
          fontSize: 15,
          bold: true,
          color: accentPrimary,
          fontFace: 'Arial',
        });

        s.addText(p.description, {
          x: xPos + 0.25,
          y: 2.7,
          w: cardWidth - 0.5,
          h: 2.2,
          fontSize: 11,
          color: textWhite,
          lineSpacing: 16,
          fontFace: 'Arial',
        });

        // Quantified Loss / Impact Badge Box
        s.addShape(pres.ShapeType.roundRect, {
          x: xPos + 0.2,
          y: 5.1,
          w: cardWidth - 0.4,
          h: 1.2,
          fill: { color: '2A1215' },
          line: { color: accentRose, width: 1 },
          rectRadius: 0.06,
        });

        s.addText(`Impact: ${p.quantifiedLoss}`, {
          x: xPos + 0.3,
          y: 5.2,
          w: cardWidth - 0.6,
          h: 1.0,
          fontSize: 10,
          bold: true,
          color: 'FFA4B4',
          fontFace: 'Arial',
        });
      });
    }

    // 2. SOLUTION SLIDE
    else if (slide.type === 'solution') {
      s.addText(content.title || 'The Autonomous Solution', {
        x: 0.8,
        y: 0.75,
        w: 11.7,
        h: 0.55,
        fontSize: 22,
        bold: true,
        color: textWhite,
        fontFace: 'Arial',
      });
      s.addText(content.tagline || '', {
        x: 0.8,
        y: 1.3,
        w: 11.7,
        h: 0.35,
        fontSize: 13,
        color: textMuted,
        fontFace: 'Arial',
      });

      const pillars = content.corePillars || [];
      const cardWidth = 3.7;
      const cardGap = 0.3;

      pillars.slice(0, 3).forEach((pillar: any, idx: number) => {
        const xPos = 0.8 + idx * (cardWidth + cardGap);
        s.addShape(pres.ShapeType.roundRect, {
          x: xPos,
          y: 1.8,
          w: cardWidth,
          h: 3.7,
          fill: { color: themeCardBg },
          line: { color: themeCardBorder, width: 1 },
          rectRadius: 0.08,
        });

        s.addText(pillar.name, {
          x: xPos + 0.25,
          y: 2.0,
          w: cardWidth - 0.5,
          h: 0.5,
          fontSize: 14,
          bold: true,
          color: accentEmerald,
          fontFace: 'Arial',
        });

        s.addText(pillar.benefit, {
          x: xPos + 0.25,
          y: 2.5,
          w: cardWidth - 0.5,
          h: 0.35,
          fontSize: 12,
          bold: true,
          color: textWhite,
          fontFace: 'Arial',
        });

        s.addText(pillar.howItWorks, {
          x: xPos + 0.25,
          y: 2.9,
          w: cardWidth - 0.5,
          h: 2.4,
          fontSize: 11,
          color: textMuted,
          lineSpacing: 15,
          fontFace: 'Arial',
        });
      });

      // Bottom Moat Highlight Box
      s.addShape(pres.ShapeType.roundRect, {
        x: 0.8,
        y: 5.7,
        w: 11.7,
        h: 0.95,
        fill: { color: themeCardHighlightBg },
        line: { color: themeCardBorder, width: 1 },
        rectRadius: 0.08,
      });

      s.addText(`SECRET SAUCE / MOAT: ${content.secretSauce || 'Proprietary contextual graph with self-correcting verification loops'}`, {
        x: 1.1,
        y: 5.85,
        w: 11.1,
        h: 0.65,
        fontSize: 11,
        bold: true,
        color: textWhite,
        fontFace: 'Arial',
      });
    }

    // 3. MARKET SIZE SLIDE
    else if (slide.type === 'market_size') {
      s.addText(content.title || 'Market Opportunity', {
        x: 0.8,
        y: 0.75,
        w: 11.7,
        h: 0.55,
        fontSize: 22,
        bold: true,
        color: textWhite,
        fontFace: 'Arial',
      });

      const metrics = [
        { label: 'TAM (Total Addressable)', val: content.tam?.value || '$120B', sub: content.tam?.description || 'Total global spending', color: accentSilver },
        { label: 'SAM (Serviceable Market)', val: content.sam?.value || '$22B', sub: content.sam?.description || 'Target addressable segment', color: accentAmber },
        { label: 'SOM (Beachhead Target)', val: content.som?.value || '$3.2B', sub: content.som?.description || '3-Year obtainable market', color: accentEmerald },
      ];

      const cardWidth = 3.7;
      const cardGap = 0.3;

      metrics.forEach((m, idx) => {
        const xPos = 0.8 + idx * (cardWidth + cardGap);
        s.addShape(pres.ShapeType.roundRect, {
          x: xPos,
          y: 1.5,
          w: cardWidth,
          h: 2.4,
          fill: { color: themeCardBg },
          line: { color: m.color, width: 2 },
          rectRadius: 0.08,
        });

        s.addText(m.label, { x: xPos + 0.25, y: 1.7, w: cardWidth - 0.5, h: 0.3, fontSize: 11, bold: true, color: m.color, fontFace: 'Arial' });
        s.addText(m.val, { x: xPos + 0.25, y: 2.0, w: cardWidth - 0.5, h: 0.7, fontSize: 26, bold: true, color: textWhite, fontFace: 'Arial' });
        s.addText(m.sub, { x: xPos + 0.25, y: 2.8, w: cardWidth - 0.5, h: 0.9, fontSize: 10, color: textMuted, fontFace: 'Arial' });
      });

      // Bottom-up Arithmetic Box
      s.addShape(pres.ShapeType.roundRect, {
        x: 0.8,
        y: 4.1,
        w: 11.7,
        h: 2.5,
        fill: { color: '18181B' },
        line: { color: accentEmerald, width: 1 },
        rectRadius: 0.08,
      });

      s.addText('VERIFIED BOTTOM-UP SOM DERIVATION & ARITHMETIC', {
        x: 1.1,
        y: 4.3,
        w: 11.1,
        h: 0.3,
        fontSize: 11,
        bold: true,
        color: accentEmerald,
        fontFace: 'Arial',
      });

      const formula = content.bottomUpFormula || {};
      s.addText(
        `• Target Customer Beachhead: ${formula.targetCustomers || 'Accounts'}\n• Average Annual Contract Value (ACV): ${formula.arpuAnnual || '$18,000/yr'}\n• Compounded Annual Growth Rate (CAGR): ${content.cagr || '21.5%'}\n\nDerivation: ${formula.derivationStep || 'Bottom-up multiplication of target units by annual ACV.'}`,
        {
          x: 1.1,
          y: 4.7,
          w: 11.1,
          h: 1.7,
          fontSize: 11,
          color: textWhite,
          lineSpacing: 18,
          fontFace: 'Arial',
        }
      );
    }

    // 4. BUSINESS MODEL SLIDE
    else if (slide.type === 'business_model') {
      s.addText(content.title || 'Business Model & Unit Economics', {
        x: 0.8,
        y: 0.75,
        w: 11.7,
        h: 0.55,
        fontSize: 22,
        bold: true,
        color: textWhite,
        fontFace: 'Arial',
      });

      const tiers = content.pricingTiers || [];
      const cardWidth = 3.7;
      const cardGap = 0.3;

      tiers.slice(0, 3).forEach((t: any, idx: number) => {
        const xPos = 0.8 + idx * (cardWidth + cardGap);
        s.addShape(pres.ShapeType.roundRect, {
          x: xPos,
          y: 1.5,
          w: cardWidth,
          h: 3.3,
          fill: { color: t.isPrimary ? themeCardHighlightBg : themeCardBg },
          line: { color: t.isPrimary ? accentPrimary : themeCardBorder, width: t.isPrimary ? 2 : 1 },
          rectRadius: 0.08,
        });

        s.addText(t.name, { x: xPos + 0.25, y: 1.7, w: cardWidth - 0.5, h: 0.3, fontSize: 12, bold: true, color: t.isPrimary ? accentPrimary : textWhite, fontFace: 'Arial' });
        s.addText(`${t.price} ${t.period}`, { x: xPos + 0.25, y: 2.0, w: cardWidth - 0.5, h: 0.5, fontSize: 20, bold: true, color: textWhite, fontFace: 'Arial' });

        const featList = (t.features || []).slice(0, 3).map((f: string) => `• ${f}`).join('\n');
        s.addText(featList, { x: xPos + 0.25, y: 2.6, w: cardWidth - 0.5, h: 2.0, fontSize: 10, color: textMuted, lineSpacing: 15, fontFace: 'Arial' });
      });

      // Unit Economics Grid
      const ue = content.unitEconomics || {};
      s.addShape(pres.ShapeType.roundRect, {
        x: 0.8,
        y: 5.0,
        w: 11.7,
        h: 1.7,
        fill: { color: '18181B' },
        line: { color: '27272A', width: 1 },
        rectRadius: 0.08,
      });

      const ueItems = [
        { label: 'CAC', val: ue.cac || '$3,200' },
        { label: 'LTV', val: ue.ltv || '$14,500' },
        { label: 'LTV:CAC', val: ue.ltvCacRatio || '4.5x' },
        { label: 'Payback', val: ue.paybackMonths || '7 months' },
        { label: 'Gross Margin', val: ue.grossMarginPercent || '82%' },
      ];

      ueItems.forEach((item, idx) => {
        const itemX = 1.1 + idx * 2.3;
        s.addText(item.label, { x: itemX, y: 5.2, w: 2.0, h: 0.25, fontSize: 10, bold: true, color: textMuted, fontFace: 'Arial' });
        s.addText(item.val, { x: itemX, y: 5.5, w: 2.0, h: 0.5, fontSize: 16, bold: true, color: accentEmerald, fontFace: 'Arial' });
      });

      s.addText(`Expansion Driver: ${content.expansionRevenueDriver || 'Usage growth + seat expansion with >125% NDR.'}`, {
        x: 1.1,
        y: 6.2,
        w: 11.1,
        h: 0.35,
        fontSize: 10,
        italic: true,
        color: textMuted,
        fontFace: 'Arial',
      });
    }

    // 5. COMPETITIVE EDGE SLIDE
    else if (slide.type === 'competition') {
      s.addText(content.title || 'Competitive Defensibility', {
        x: 0.8,
        y: 0.75,
        w: 11.7,
        h: 0.55,
        fontSize: 22,
        bold: true,
        color: textWhite,
        fontFace: 'Arial',
      });

      // Left Column: Competitor Weaknesses vs Us
      s.addShape(pres.ShapeType.roundRect, {
        x: 0.8,
        y: 1.5,
        w: 5.6,
        h: 5.1,
        fill: { color: themeCardBg },
        line: { color: themeCardBorder, width: 1 },
        rectRadius: 0.08,
      });

      s.addText('INCUMBENTS VS. OUR PLATFORM', { x: 1.1, y: 1.7, w: 5.0, h: 0.3, fontSize: 11, bold: true, color: accentPrimary, fontFace: 'Arial' });

      let compY = 2.1;
      (content.competitors || []).slice(0, 2).forEach((c: any) => {
        s.addText(c.name, { x: 1.1, y: compY, w: 5.0, h: 0.3, fontSize: 13, bold: true, color: textWhite, fontFace: 'Arial' });
        s.addText(`Flaw: ${c.flawOrWeakness}`, { x: 1.1, y: compY + 0.35, w: 5.0, h: 0.8, fontSize: 10, color: accentRose, fontFace: 'Arial' });
        compY += 1.3;
      });

      s.addText(`Our Position: ${content.ourPosition?.name || 'Category Leader'}`, { x: 1.1, y: compY, w: 5.0, h: 0.3, fontSize: 13, bold: true, color: accentEmerald, fontFace: 'Arial' });
      s.addText(content.ourPosition?.tagline || 'Autonomous, verified domain intelligence', { x: 1.1, y: compY + 0.35, w: 5.0, h: 0.6, fontSize: 10, color: textWhite, fontFace: 'Arial' });

      // Right Column: 3 Defensibility Moats
      s.addShape(pres.ShapeType.roundRect, {
        x: 6.7,
        y: 1.5,
        w: 5.8,
        h: 5.1,
        fill: { color: '18181B' },
        line: { color: themeCardBorder, width: 1 },
        rectRadius: 0.08,
      });

      s.addText('CORE DEFENSIBILITY MOATS', { x: 7.0, y: 1.7, w: 5.2, h: 0.3, fontSize: 11, bold: true, color: accentEmerald, fontFace: 'Arial' });

      let moatY = 2.1;
      (content.defensibilityMoats || []).slice(0, 3).forEach((m: string, idx: number) => {
        s.addText(`0${idx + 1}. Defensibility Pillar`, { x: 7.0, y: moatY, w: 5.2, h: 0.25, fontSize: 11, bold: true, color: accentSilver, fontFace: 'Arial' });
        s.addText(m, { x: 7.0, y: moatY + 0.3, w: 5.2, h: 1.0, fontSize: 10, color: textWhite, lineSpacing: 15, fontFace: 'Arial' });
        moatY += 1.35;
      });
    }

    // 6. GO-TO-MARKET SLIDE
    else if (slide.type === 'go_to_market') {
      s.addText(content.title || 'Go-To-Market & Scale', {
        x: 0.8,
        y: 0.75,
        w: 11.7,
        h: 0.55,
        fontSize: 22,
        bold: true,
        color: textWhite,
        fontFace: 'Arial',
      });

      const channels = content.primaryChannels || [];
      const cardWidth = 3.7;
      const cardGap = 0.3;

      channels.slice(0, 3).forEach((ch: any, idx: number) => {
        const xPos = 0.8 + idx * (cardWidth + cardGap);
        s.addShape(pres.ShapeType.roundRect, {
          x: xPos,
          y: 1.5,
          w: cardWidth,
          h: 2.6,
          fill: { color: themeCardBg },
          line: { color: themeCardBorder, width: 1 },
          rectRadius: 0.08,
        });

        s.addText(`${ch.sharePercent}% Share`, { x: xPos + 0.25, y: 1.7, w: cardWidth - 0.5, h: 0.25, fontSize: 10, bold: true, color: accentSilver, fontFace: 'Arial' });
        s.addText(ch.channel, { x: xPos + 0.25, y: 2.0, w: cardWidth - 0.5, h: 0.4, fontSize: 13, bold: true, color: textWhite, fontFace: 'Arial' });
        s.addText(ch.strategy, { x: xPos + 0.25, y: 2.45, w: cardWidth - 0.5, h: 1.5, fontSize: 10, color: textMuted, lineSpacing: 15, fontFace: 'Arial' });
      });

      // Bottom 3-Phase Roadmap
      s.addShape(pres.ShapeType.roundRect, {
        x: 0.8,
        y: 4.3,
        w: 11.7,
        h: 2.3,
        fill: { color: '18181B' },
        line: { color: '27272A', width: 1 },
        rectRadius: 0.08,
      });

      s.addText('3-PHASE EXECUTION ROADMAP', { x: 1.1, y: 4.5, w: 10.0, h: 0.3, fontSize: 11, bold: true, color: accentPrimary, fontFace: 'Arial' });

      (content.phases || []).slice(0, 3).forEach((ph: any, idx: number) => {
        const phX = 1.1 + idx * 3.8;
        s.addText(ph.phase, { x: phX, y: 4.9, w: 3.5, h: 0.3, fontSize: 11, bold: true, color: accentEmerald, fontFace: 'Arial' });
        s.addText(ph.targetMilestone, { x: phX, y: 5.25, w: 3.5, h: 1.1, fontSize: 10, color: textWhite, lineSpacing: 14, fontFace: 'Arial' });
      });
    }

    // 7. TEAM SLIDE
    else if (slide.type === 'team') {
      s.addText(content.title || 'World-Class Team', {
        x: 0.8,
        y: 0.75,
        w: 11.7,
        h: 0.55,
        fontSize: 22,
        bold: true,
        color: textWhite,
        fontFace: 'Arial',
      });

      const members = content.members || [];
      const cardWidth = 3.7;
      const cardGap = 0.3;

      members.slice(0, 3).forEach((m: any, idx: number) => {
        const xPos = 0.8 + idx * (cardWidth + cardGap);
        s.addShape(pres.ShapeType.roundRect, {
          x: xPos,
          y: 1.5,
          w: cardWidth,
          h: 3.5,
          fill: { color: themeCardBg },
          line: { color: themeCardBorder, width: 1 },
          rectRadius: 0.08,
        });

        s.addText(m.name, { x: xPos + 0.25, y: 1.7, w: cardWidth - 0.5, h: 0.35, fontSize: 14, bold: true, color: textWhite, fontFace: 'Arial' });
        s.addText(m.role, { x: xPos + 0.25, y: 2.1, w: cardWidth - 0.5, h: 0.3, fontSize: 10, bold: true, color: accentSilver, fontFace: 'Arial' });
        s.addText(m.pedigree, { x: xPos + 0.25, y: 2.45, w: cardWidth - 0.5, h: 0.7, fontSize: 10, italic: true, color: textMuted, fontFace: 'Arial' });
        s.addText(`Superpower: ${m.domainSuperpower}`, { x: xPos + 0.25, y: 3.2, w: cardWidth - 0.5, h: 1.6, fontSize: 10, color: textWhite, lineSpacing: 14, fontFace: 'Arial' });
      });

      // Advisors Box
      s.addShape(pres.ShapeType.roundRect, {
        x: 0.8,
        y: 5.2,
        w: 11.7,
        h: 1.5,
        fill: { color: '18181B' },
        line: { color: '27272A', width: 1 },
        rectRadius: 0.08,
      });

      s.addText('EXECUTIVE ADVISORY COUNCIL', { x: 1.1, y: 5.4, w: 10.0, h: 0.25, fontSize: 10, bold: true, color: accentAmber, fontFace: 'Arial' });

      (content.advisors || []).slice(0, 2).forEach((adv: any, idx: number) => {
        const advX = 1.1 + idx * 5.6;
        s.addText(`${adv.name} — ${adv.affiliation} (${adv.expertise})`, {
          x: advX,
          y: 5.75,
          w: 5.3,
          h: 0.7,
          fontSize: 10,
          color: textWhite,
          fontFace: 'Arial',
        });
      });
    }

    // 8. FINANCIALS SLIDE
    else if (slide.type === 'financials') {
      s.addText(content.title || '3-Year Financial Forecast', {
        x: 0.8,
        y: 0.75,
        w: 11.7,
        h: 0.55,
        fontSize: 22,
        bold: true,
        color: textWhite,
        fontFace: 'Arial',
      });

      const years = content.forecastYears || [];
      const cardWidth = 3.7;
      const cardGap = 0.3;

      years.slice(0, 3).forEach((y: any, idx: number) => {
        const xPos = 0.8 + idx * (cardWidth + cardGap);
        s.addShape(pres.ShapeType.roundRect, {
          x: xPos,
          y: 1.5,
          w: cardWidth,
          h: 3.3,
          fill: { color: themeCardBg },
          line: { color: themeCardBorder, width: 1 },
          rectRadius: 0.08,
        });

        s.addText(y.year, { x: xPos + 0.25, y: 1.7, w: cardWidth - 0.5, h: 0.3, fontSize: 12, bold: true, color: accentSilver, fontFace: 'Arial' });
        s.addText(y.formattedRevenue || `$${y.revenue}M`, { x: xPos + 0.25, y: 2.05, w: cardWidth - 0.5, h: 0.6, fontSize: 24, bold: true, color: textWhite, fontFace: 'Arial' });
        s.addText(`Expenses: ${y.formattedExpenses || `$${y.expenses}M`}`, { x: xPos + 0.25, y: 2.7, w: cardWidth - 0.5, h: 0.3, fontSize: 11, color: textMuted, fontFace: 'Arial' });
        s.addText(`Customers: ${y.customers}  |  Margin: ${y.grossMarginPercent}`, { x: xPos + 0.25, y: 3.05, w: cardWidth - 0.5, h: 0.3, fontSize: 10, color: textMuted, fontFace: 'Arial' });
        s.addText(`EBITDA: ${y.ebitdaPercent}`, { x: xPos + 0.25, y: 3.4, w: cardWidth - 0.5, h: 0.3, fontSize: 11, bold: true, color: accentEmerald, fontFace: 'Arial' });
      });

      // Breakeven and Assumptions
      s.addShape(pres.ShapeType.roundRect, {
        x: 0.8,
        y: 5.0,
        w: 11.7,
        h: 1.7,
        fill: { color: '18181B' },
        line: { color: '27272A', width: 1 },
        rectRadius: 0.08,
      });

      s.addText('BREAKEVEN HORIZON & KEY ASSUMPTIONS', { x: 1.1, y: 5.2, w: 10.0, h: 0.25, fontSize: 10, bold: true, color: accentEmerald, fontFace: 'Arial' });
      s.addText(content.breakevenTimeline || 'Cash-flow breakeven reached within Month 20 with sustained positive unit economics.', {
        x: 1.1,
        y: 5.5,
        w: 11.1,
        h: 0.35,
        fontSize: 11,
        bold: true,
        color: textWhite,
        fontFace: 'Arial',
      });

      const assumptions = (content.keyAssumptions || []).slice(0, 2).map((a: string) => `• ${a}`).join('\n');
      s.addText(assumptions, { x: 1.1, y: 5.9, w: 11.1, h: 0.7, fontSize: 10, color: textMuted, lineSpacing: 14, fontFace: 'Arial' });
    }

    // 9. TRACTION SLIDE
    else if (slide.type === 'traction') {
      s.addText(content.title || 'Traction & Momentum', {
        x: 0.8,
        y: 0.75,
        w: 11.7,
        h: 0.55,
        fontSize: 22,
        bold: true,
        color: textWhite,
        fontFace: 'Arial',
      });

      const metrics = content.keyMetrics || [];
      const cardWidth = 2.75;
      const cardGap = 0.23;

      metrics.slice(0, 4).forEach((m: any, idx: number) => {
        const xPos = 0.8 + idx * (cardWidth + cardGap);
        s.addShape(pres.ShapeType.roundRect, {
          x: xPos,
          y: 1.5,
          w: cardWidth,
          h: 2.2,
          fill: { color: themeCardBg },
          line: { color: themeCardBorder, width: 1 },
          rectRadius: 0.08,
        });

        s.addText(m.label, { x: xPos + 0.2, y: 1.7, w: cardWidth - 0.4, h: 0.35, fontSize: 10, bold: true, color: textMuted, fontFace: 'Arial' });
        s.addText(m.value, { x: xPos + 0.2, y: 2.1, w: cardWidth - 0.4, h: 0.6, fontSize: 16, bold: true, color: textWhite, fontFace: 'Arial' });
        s.addText(m.growthRate, { x: xPos + 0.2, y: 2.8, w: cardWidth - 0.4, h: 0.3, fontSize: 10, bold: true, color: accentEmerald, fontFace: 'Arial' });
      });

      // Customer quote / proof callout
      s.addShape(pres.ShapeType.roundRect, {
        x: 0.8,
        y: 4.0,
        w: 11.7,
        h: 2.6,
        fill: { color: '18181B' },
        line: { color: themeCardBorder, width: 1 },
        rectRadius: 0.08,
      });

      s.addText('COMMERCIAL VALIDATION & MILESTONES', { x: 1.1, y: 4.2, w: 10.0, h: 0.3, fontSize: 10, bold: true, color: accentPrimary, fontFace: 'Arial' });
      s.addText(content.pilotOrCustomerProof || '"This platform cut our operational cycle times by over 75%."', {
        x: 1.1,
        y: 4.6,
        w: 11.1,
        h: 0.8,
        fontSize: 12,
        italic: true,
        color: textWhite,
        fontFace: 'Arial',
      });

      const milestones = (content.milestonesAchieved || []).slice(0, 3).map((m: any) => `• ${m.dateOrPhase || 'Q'}: ${m.milestone}`).join('\n');
      s.addText(milestones, { x: 1.1, y: 5.5, w: 11.1, h: 0.9, fontSize: 10, color: textMuted, lineSpacing: 14, fontFace: 'Arial' });
    }

    // 10. FUNDING ASK SLIDE
    else if (slide.type === 'funding_ask') {
      s.addText(content.title || 'The Funding Ask', {
        x: 0.8,
        y: 0.75,
        w: 11.7,
        h: 0.55,
        fontSize: 22,
        bold: true,
        color: textWhite,
        fontFace: 'Arial',
      });

      // Top Highlight: Target Amount & Runway
      s.addShape(pres.ShapeType.roundRect, {
        x: 0.8,
        y: 1.5,
        w: 11.7,
        h: 1.4,
        fill: { color: themeCardHighlightBg },
        line: { color: themeCardBorder, width: 2 },
        rectRadius: 0.08,
      });

      s.addText('TARGET CAPITAL INJECTION', { x: 1.1, y: 1.7, w: 5.0, h: 0.25, fontSize: 10, bold: true, color: textDim, fontFace: 'Arial' });
      s.addText(`${content.targetAmount || '$2,500,000'}  (${content.roundType || 'Seed Round'})`, { x: 1.1, y: 1.95, w: 7.0, h: 0.55, fontSize: 22, bold: true, color: textWhite, fontFace: 'Arial' });
      s.addText(`Runway: ${content.runwayMonths || '18 - 24 Months'}`, { x: 8.5, y: 2.05, w: 3.7, h: 0.4, fontSize: 13, bold: true, color: accentEmerald, fontFace: 'Arial' });

      // Use of Funds 3 Cards
      const funds = content.useOfFunds || [];
      const cardWidth = 3.7;
      const cardGap = 0.3;

      funds.slice(0, 3).forEach((f: any, idx: number) => {
        const xPos = 0.8 + idx * (cardWidth + cardGap);
        s.addShape(pres.ShapeType.roundRect, {
          x: xPos,
          y: 3.1,
          w: cardWidth,
          h: 2.3,
          fill: { color: themeCardBg },
          line: { color: themeCardBorder, width: 1 },
          rectRadius: 0.08,
        });

        s.addText(`${f.percentage}% Allocation  (${f.allocationAmount || ''})`, { x: xPos + 0.2, y: 3.3, w: cardWidth - 0.4, h: 0.25, fontSize: 10, bold: true, color: accentAmber, fontFace: 'Arial' });
        s.addText(f.category, { x: xPos + 0.2, y: 3.6, w: cardWidth - 0.4, h: 0.35, fontSize: 12, bold: true, color: textWhite, fontFace: 'Arial' });
        s.addText(f.description, { x: xPos + 0.2, y: 4.0, w: cardWidth - 0.4, h: 1.2, fontSize: 10, color: textMuted, lineSpacing: 14, fontFace: 'Arial' });
      });

      // Capital Milestones Targeted
      s.addShape(pres.ShapeType.roundRect, {
        x: 0.8,
        y: 5.6,
        w: 11.7,
        h: 1.1,
        fill: { color: '18181B' },
        line: { color: '27272A', width: 1 },
        rectRadius: 0.08,
      });

      const milestones = (content.milestonesTargetedWithCapital || []).slice(0, 2).map((m: string) => `• ${m}`).join('   ');
      s.addText(`Target Milestones: ${milestones}`, {
        x: 1.1,
        y: 5.8,
        w: 11.1,
        h: 0.7,
        fontSize: 10,
        color: textWhite,
        fontFace: 'Arial',
      });
    }
  });

  await pres.writeFile({ fileName: `${pitchTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.pptx` });
}

export async function exportSlideElementToPdf(elementId: string, fileName: string = 'Pitch_Deck.pdf'): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#4D44FF',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: [canvas.width, canvas.height],
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save(fileName);
}


