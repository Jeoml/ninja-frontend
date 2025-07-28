import { NextRequest } from 'next/server';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    console.log('=== API Route Debug ===');
    console.log('Environment variable:', process.env.BACKEND_API_URL);
    
    const body = await req.json();
    console.log('Raw request body:', body);
    
    const { messages } = body;
    console.log('Extracted messages:', messages);
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error('No messages provided or invalid format');
    }
    
    const lastMessage = messages[messages.length - 1];
    console.log('Last message:', lastMessage);
    
    if (!lastMessage || !lastMessage.content) {
      throw new Error('Last message has no content');
    }
    
    const requestPayload = {
      message: lastMessage.content
    };
    console.log('Sending to backend:', requestPayload);
    
    const backendUrl = process.env.BACKEND_API_URL || 'https://culltique-joel-production.up.railway.app/langgraph/ask';
    console.log('Backend URL:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      throw new Error(`Backend service unavailable: ${response.status}`);
    }

    const data = await response.json();
    console.log('Backend response data:', data);
    
    const assistantMessage = data.response || data.message || data.content || 'Sorry, I could not process your request.';
    console.log('Final message:', assistantMessage);

    return Response.json({
      content: assistantMessage
    });

  } catch (error) {
    console.error('API Route Error:', error);
    
    return Response.json(
      { error: `Service error: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}