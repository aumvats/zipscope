import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { generateReportPDF } from '@/lib/pdf/generateReport';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { zip, city, state, data } = body;

    if (!zip || !data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const doc = generateReportPDF({ zip, city, state, data });
    const buffer = await renderToBuffer(doc);
    const uint8 = new Uint8Array(buffer);

    const location = [city, state].filter(Boolean).join(', ');
    const rawName = location || zip;
    const safeName = rawName.replace(/["\r\n\\]/g, '').replace(/[^\x20-\x7E]/g, '');
    const filename = `ZipScope-${safeName}-Report.pdf`;

    return new NextResponse(uint8, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error('PDF generation error:', err);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
