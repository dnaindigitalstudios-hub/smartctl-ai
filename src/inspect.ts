import { exec } from "node:child_process";
import { promisify } from "node:util";

import {
    chatWithAI,
    sliceContent,
    type ChatMessage,
} from "./chat.ts";

const execAsync = promisify(exec);

// Define the inspect method
export interface InspectParams {
    devicePath: string;
    chatHistory: ChatMessage[];
    chatModel: string;
    inspectPrompt: string;
}

export const inspect = async (params: InspectParams): Promise<string> => {
    let smartctlResult;
    try {
        const process = await execAsync(`smartctl -a "${params.devicePath}"`);
        smartctlResult = process.stdout;
    } catch (e: any) {
        smartctlResult = e.stdout;
    }

    const smartctlOutput = smartctlResult.toString();
    const snippets = sliceContent(smartctlOutput, 2000, "\n");
    for (const snippet of snippets) {
        params.chatHistory.push({
            role: "user",
            content: snippet,
        });
    }

    params.chatHistory.push({
        role: "system",
        content: params.inspectPrompt,
    });

    const prompt = "Please analyze the above SMART data.";
    const reply = await chatWithAI(params.chatHistory, params.chatModel, prompt);
    return reply.trim();
}
