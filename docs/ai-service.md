# Sapphire AI Service

## Interface

```typescript
interface AIService {
  connected: boolean;
  sendMessage(
    conversationId: string,
    message: string,
    handlers: {
      onThinking?: () => void;
      onChunk?: (chunk: string) => void;
      onComplete?: (fullResponse: string) => void;
      onError?: (error: string) => void;
    },
    signal?: AbortSignal
  ): Promise<void>;
}
```

## Current State

The mock AI service (`mockAIService` in `src/lib/data.ts`) returns a development-state message and simulates streaming so the UI architecture is exercised. No fake AI responses are presented as real.

## Integration Steps

1. Implement the `AIService` interface with a real provider (OpenAI, Anthropic, etc.)
2. Set `connected = true`
3. Replace `aiService` export with the real implementation
4. The UI automatically switches from development state to live responses

## Future Capabilities

- Streaming responses (UI already supports)
- Tool calls
- Structured responses
- Conversation context management
- Error handling and retry
- Cancellation (UI already supports via AbortController)
