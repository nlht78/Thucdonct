import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route để proxy request đến Google Apps Script
 * Giải quyết vấn đề CORS
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('API Route received:', body);
    
    const gasUrl = process.env.NEXT_PUBLIC_GAS_WEB_APP_URL;
    const apiKey = process.env.NEXT_PUBLIC_GAS_API_KEY;
    
    console.log('GAS URL:', gasUrl);
    console.log('API Key exists:', !!apiKey);
    
    if (!gasUrl || !apiKey) {
      console.error('Missing GAS configuration');
      return NextResponse.json(
        { success: false, error: 'Google Apps Script chưa được cấu hình' },
        { status: 500 }
      );
    }
    
    // Gọi Google Apps Script với GET request
    const params = new URLSearchParams({
      action: 'createReport',
      apiKey: apiKey,
      data: JSON.stringify({
        ...body,
        exportPDF: false, // Không tạo PDF
      }),
    });
    
    const fullUrl = `${gasUrl}?${params.toString()}`;
    console.log('Calling GAS URL (truncated):', fullUrl.substring(0, 200) + '...');
    
    const response = await fetch(fullUrl, {
      method: 'GET',
    });
    
    console.log('GAS Response status:', response.status);
    
    // Lấy response text trước để debug
    const responseText = await response.text();
    console.log('GAS Response text (first 500 chars):', responseText.substring(0, 500));
    
    // Thử parse JSON
    let result;
    try {
      result = JSON.parse(responseText);
      console.log('GAS Response data:', result);
    } catch (parseError) {
      console.error('Failed to parse JSON. Response was HTML or invalid JSON');
      return NextResponse.json({
        success: false,
        error: 'Google Apps Script trả về HTML thay vì JSON. Có thể bạn chưa redeploy hoặc cần authorize lại.',
        details: responseText.substring(0, 200)
      }, { status: 500 });
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error in save-report API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
