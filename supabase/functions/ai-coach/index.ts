const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { userMessage, userData, chatHistory, threadId } = await req.json();

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    const assistantId = Deno.env.get('OPENAI_ASSISTANT_ID');
    
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY não configurada');
    }
    
    if (!assistantId) {
      throw new Error('OPENAI_ASSISTANT_ID não configurada');
    }

    let currentThreadId = threadId;

    // Step 1: Create a new thread if none exists
    if (!currentThreadId) {
      console.log('Creating new thread...');
      const createThreadResponse = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2',
        },
        body: JSON.stringify({}),
      });

      if (!createThreadResponse.ok) {
        const errorData = await createThreadResponse.json();
        throw new Error(`Erro ao criar thread: ${errorData.error?.message || 'Erro desconhecido'}`);
      }

      const threadData = await createThreadResponse.json();
      currentThreadId = threadData.id;
      console.log('New thread created:', currentThreadId);
    }

    // Step 2: Add chat history to thread (if this is a new thread or we need to sync history)
    if (chatHistory && chatHistory.length > 0) {
      console.log('Adding chat history to thread...');
      
      // Add each message from history to the thread
      for (const historyMessage of chatHistory) {
        if (historyMessage.sender === 'user') {
          await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/messages`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openaiApiKey}`,
              'Content-Type': 'application/json',
              'OpenAI-Beta': 'assistants=v2',
            },
            body: JSON.stringify({
              role: 'user',
              content: historyMessage.content,
            }),
          });
        }
      }
    }

    // Step 3: Add the current user message to the thread
    console.log('Adding current message to thread...');
    const addMessageResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        role: 'user',
        content: `Contexto do usuário:
- Dias limpo: ${userData.days_clean}
- Dinheiro economizado: R$ ${userData.money_saved}
- Tempo livre recuperado: ${userData.time_saved} horas
- Média diária de aposta (antes): R$ ${userData.daily_bet_average}
- Lições completadas: ${userData.completed_lessons || 0}
- Desafios completados: ${userData.completed_challenges || 0}

Mensagem do usuário: ${userMessage}`,
      }),
    });

    if (!addMessageResponse.ok) {
      const errorData = await addMessageResponse.json();
      throw new Error(`Erro ao adicionar mensagem: ${errorData.error?.message || 'Erro desconhecido'}`);
    }

    // Step 4: Create a run to get assistant response
    console.log('Creating run with assistant...');
    const createRunResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        assistant_id: assistantId,
      }),
    });

    if (!createRunResponse.ok) {
      const errorData = await createRunResponse.json();
      throw new Error(`Erro ao criar run: ${errorData.error?.message || 'Erro desconhecido'}`);
    }

    const runData = await createRunResponse.json();
    const runId = runData.id;
    console.log('Run created:', runId);

    // Step 5: Poll for run completion
    let runStatus = 'queued';
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout

    console.log('Polling for run completion...');
    while (runStatus !== 'completed' && runStatus !== 'failed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      attempts++;

      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/runs/${runId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      });

      if (!statusResponse.ok) {
        throw new Error('Erro ao verificar status do run');
      }

      const statusData = await statusResponse.json();
      runStatus = statusData.status;
      console.log('Run status:', runStatus);

      // Handle failed runs
      if (runStatus === 'failed') {
        throw new Error(`Run falhou: ${statusData.last_error?.message || 'Erro desconhecido'}`);
      }

      // Handle runs that require action (function calls, etc.)
      if (runStatus === 'requires_action') {
        console.log('Run requires action, continuing to wait...');
        continue;
      }
    }

    if (runStatus !== 'completed') {
      throw new Error('Timeout: Assistente demorou muito para responder');
    }

    // Step 6: Retrieve the assistant's response
    console.log('Retrieving assistant response...');
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/messages?limit=1&order=desc`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'OpenAI-Beta': 'assistants=v2',
      },
    });

    if (!messagesResponse.ok) {
      throw new Error('Erro ao recuperar mensagens');
    }

    const messagesData = await messagesResponse.json();
    const latestMessage = messagesData.data[0];

    if (!latestMessage || latestMessage.role !== 'assistant') {
      throw new Error('Nenhuma resposta do assistente encontrada');
    }

    // Extract text content from the message
    let assistantResponse = '';
    if (latestMessage.content && latestMessage.content.length > 0) {
      const textContent = latestMessage.content.find((content: any) => content.type === 'text');
      if (textContent) {
        assistantResponse = textContent.text.value;
      }
    }

    if (!assistantResponse) {
      throw new Error('Resposta do assistente está vazia');
    }

    console.log('Assistant response retrieved successfully');

    return new Response(JSON.stringify({ 
      response: assistantResponse,
      threadId: currentThreadId 
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
      status: 200,
    });

  } catch (error) {
    console.error('Erro na Edge Function:', error);
    
    // Return a fallback response instead of just the error
    const fallbackResponse = `Desculpe, estou com dificuldades técnicas no momento. Mas lembre-se: você já economizou R$ ${userData?.money_saved || 0} e está há ${userData?.days_clean || 0} dias limpo. Isso mostra sua força! Que tal tentar uma respiração profunda ou dar uma caminhada?`;
    
    return new Response(JSON.stringify({ 
      response: fallbackResponse,
      error: error.message,
      threadId: null
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
      status: 200, // Return 200 with fallback instead of error status
    });
  }
});