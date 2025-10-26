// ironnect/client.js
// SPDX-License-Identifier: MIT
// https://github.com/ai-tech-tw/ironnect

// Load configuration from environment variables or use default values
const aiBaseUrl = process.env.OPENAI_BASE_URL ||
    "https://web-tech.tw/recv/openai/v1";
const aiApiKey = process.env.OPENAI_API_KEY ||
    "gemini zr3Pjc68z4bOtw==";

export interface ChatMessage {
    role: string;
    content: string;
}

export interface ChatCompletionChoice {
    message: ChatMessage;
    finish_reason: string;
    index: number;
}

export interface ChatCompletionResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: ChatCompletionChoice[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

/**
 * Randomly choose an element from an array.
 * @param {Array<object>} choices The array of choices.
 * @return {object} The randomly chosen element.
 */
export function choose<T>(choices: T[]): T {
    const seed = Math.random();
    const index = Math.floor(seed * choices.length);
    return choices[index];
}

export interface ChatCompletionsParams {
    model: string;
    messages: ChatMessage[];
    temperature?: number;
    top_p?: number;
    n?: number;
    stream?: boolean;
    stop?: string | string[];
    max_tokens?: number;
    presence_penalty?: number;
    frequency_penalty?: number;
    logit_bias?: { [key: string]: number };
    user?: string;
}

/**
 * Create chat completions using the AI model.
 * @param {ChatCompletionsParams} params The arguments to create chat completions.
 * @return {Promise<object>} The response from the AI.
 */
export async function createChatCompletions(params: ChatCompletionsParams): Promise<ChatCompletionResponse> {
    const requestUrl = `${aiBaseUrl}/chat/completions`;
    const response = await fetch(requestUrl, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${aiApiKey}`,
        },
        body: JSON.stringify(params),
    });
    return await response.json();
}

/**
 * Chat with the AI.
 * @param {ChatMessage[]} chatHistory The message box to store chat history.
 * @param {string} chatModel The chat model to chat with the AI.
 * @param {string} prompt The prompt to chat with the AI.
 * @return {Promise<string>} The response from the AI.
 */
export async function chatWithAI(chatHistory: ChatMessage[], chatModel: string, prompt: string): Promise<string> {
    const userPromptMessage = {
        role: "user",
        content: prompt,
    };

    const response = await createChatCompletions({
        model: chatModel,
        messages: [
            ...chatHistory,
            userPromptMessage,
        ],
    });

    const choice = choose(response.choices);
    const reply = choice.message.content;
    const assistantReplyMessage = {
        role: "assistant",
        content: reply,
    };

    chatHistory.push(
        userPromptMessage,
        assistantReplyMessage,
    );
    if (chatHistory.length > 30) {
        chatHistory.shift();
        chatHistory.shift();
    }

    return reply;
}

/**
 * Slice the message content into multiple snippets.
 * @param {string} content - The content to slice.
 * @param {number} maxLength - The maximum length of each snippet.
 * @param {string} separator - The separator to split the content.
 * @return {Array<string>} The sliced snippets.
 */
export function sliceContent(content: string, maxLength: number, separator: string = "\n"): string[] {
    const substrings = content.split(separator);
    const snippets = [];

    let lastSnippet = "";
    for (const text of substrings) {
        if (!text) {
            lastSnippet += separator;
            continue;
        }
        if (text.length + lastSnippet.length < maxLength) {
            lastSnippet += text;
            continue;
        }
        snippets.push(lastSnippet.trim());
        lastSnippet = "";
    }
    if (lastSnippet) {
        snippets.push(lastSnippet.trim());
    }

    return snippets;
}
