import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const EXCEL_FILE_PATH = join(process.cwd(), 'peptiveverificationcode.xlsx');

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { status: 'invalid', message: 'Code is required' },
        { status: 400 }
      );
    }

    const normalizedCode = code.trim().toUpperCase();

    // Check if the Excel file exists
    if (!existsSync(EXCEL_FILE_PATH)) {
      console.error('Excel file not found at:', EXCEL_FILE_PATH);
      return NextResponse.json(
        { status: 'error', message: 'Verification file not found' },
        { status: 500 }
      );
    }

    // Read the Excel file as a buffer
    const fileBuffer = readFileSync(EXCEL_FILE_PATH);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Find the code in the spreadsheet
    // Assuming format: Column A = Code, Column B = Status (used/not-used)
    let codeFound = false;
    let codeRow = -1;
    let isUsed = false;

    for (let i = 1; i < data.length; i++) { // Start from 1 to skip header
      const row = data[i];
      if (row[0] && String(row[0]).trim().toUpperCase() === normalizedCode) {
        codeFound = true;
        codeRow = i;
        const status = row[1] ? String(row[1]).trim().toLowerCase() : 'not-used';
        isUsed = status === 'used';
        break;
      }
    }

    if (!codeFound) {
      return NextResponse.json({ status: 'invalid' });
    }

    if (isUsed) {
      return NextResponse.json({ status: 'already-used' });
    }

    // Mark the code as used
    data[codeRow][1] = 'used';

    // Convert back to worksheet
    const newWorksheet = XLSX.utils.aoa_to_sheet(data);
    workbook.Sheets[sheetName] = newWorksheet;

    // Write back to file as buffer
    const newBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    writeFileSync(EXCEL_FILE_PATH, newBuffer);

    return NextResponse.json({ status: 'valid' });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { status: 'error', message: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}
