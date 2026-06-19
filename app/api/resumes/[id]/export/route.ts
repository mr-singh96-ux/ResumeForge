import { auth } from '@clerk/nextjs/server';
import { sheetsService } from '@/lib/services/sheets';
import jsPDF from 'jspdf';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const resume = await sheetsService.getResume(params.id);
    if (!resume) {
      return new Response(JSON.stringify({ error: 'Resume not found' }), { status: 404 });
    }

    if (resume.userId !== userId) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    const { format = 'pdf' } = await req.json();

    // Check download limits for free users
    const subscription = await sheetsService.getSubscription(userId);
    if (subscription?.plan === 'free') {
      const downloadCount = await sheetsService.getDownloadCount(userId, 'month');
      if (downloadCount >= 3) {
        return new Response(
          JSON.stringify({
            error: 'Download limit reached. Upgrade to Pro for unlimited downloads.',
          }),
          { status: 403 }
        );
      }
    }

    // Record download
    await sheetsService.recordDownload({
      userId,
      resumeId: params.id,
      format: format as 'pdf' | 'docx',
    });

    if (format === 'pdf') {
      return generatePDF(resume);
    } else if (format === 'docx') {
      return new Response(JSON.stringify({ error: 'DOCX export coming soon' }), { status: 501 });
    }

    return new Response(JSON.stringify({ error: 'Invalid format' }), { status: 400 });
  } catch (error) {
    console.error('[API] Error exporting resume:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

function generatePDF(resume: any) {
  try {
    const doc = new jsPDF();
    const { content } = resume;
    const { personal, professional, experience, education, skills } = content;

    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const maxWidth = pageWidth - 2 * margin;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(personal.fullName || 'Your Name', margin, yPosition);

    yPosition += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(37, 99, 235);
    doc.text(professional.headline || 'Professional Headline', margin, yPosition);

    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    const contactInfo = [
      personal.email,
      personal.phone,
      personal.location,
    ]
      .filter(Boolean)
      .join(' • ');
    doc.text(contactInfo, margin, yPosition);

    yPosition += 10;
    doc.setDrawColor(200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Professional Summary
    if (professional.summary) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('PROFESSIONAL SUMMARY', margin, yPosition);
      yPosition += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const summaryLines = doc.splitTextToSize(professional.summary, maxWidth);
      doc.text(summaryLines, margin, yPosition);
      yPosition += summaryLines.length * 5 + 5;
    }

    // Work Experience
    if (experience.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('WORK EXPERIENCE', margin, yPosition);
      yPosition += 6;

      experience.forEach((exp: any) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(exp.position, margin, yPosition);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(exp.company, margin, yPosition + 5);
        doc.text(
          `${new Date(exp.startDate).getFullYear()} - ${
            exp.isCurrentlyWorking ? 'Present' : new Date(exp.endDate).getFullYear()
          }`,
          pageWidth - margin - 30,
          yPosition
        );

        yPosition += 10;

        if (exp.description) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          const descLines = doc.splitTextToSize(exp.description, maxWidth);
          doc.text(descLines, margin, yPosition);
          yPosition += descLines.length * 4 + 2;
        }

        yPosition += 4;
      });

      yPosition += 2;
    }

    // Education
    if (education.length > 0) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('EDUCATION', margin, yPosition);
      yPosition += 6;

      education.forEach((edu: any) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(`${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`, margin, yPosition);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(edu.school, margin, yPosition + 5);

        yPosition += 10;
      });

      yPosition += 4;
    }

    // Skills
    if (skills.length > 0) {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('SKILLS', margin, yPosition);
      yPosition += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const skillsText = skills.map((s: any) => s.name).join(' • ');
      const skillsLines = doc.splitTextToSize(skillsText, maxWidth);
      doc.text(skillsLines, margin, yPosition);
    }

    // Generate PDF as blob
    const pdfBlob = doc.output('blob');
    const buffer = Buffer.from(await pdfBlob.arrayBuffer());

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${resume.title}.pdf"`,
      },
    });
  } catch (error) {
    console.error('[PDF] Error generating PDF:', error);
    throw error;
  }
}
