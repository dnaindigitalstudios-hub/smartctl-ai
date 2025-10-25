#!/usr/bin/node

import {
    execSync,
} from "node:child_process";

import {
    type ChatMessage,
} from "./src/chat.ts";

import {
    deviceList,
} from "./src/devices.ts";

import {
    generateInspectPrompt,
    inspect,
} from "./src/inspect.ts";

// Load configuration from environment variables or use default values
const chatModel = process.env.CHAT_MODEL || "gemini-2.0-flash";
const chatLanguage = process.env.CHAT_LANGUAGE || "zh-TW";

const isSendEmail = !!process.env.SEND_EMAIL;
const isColorTerminal = !process.env.NO_COLOR && !process.env.SEND_EMAIL;

// Fetch device paths
const devices = await deviceList.find(
    (method) => method.type === "all",
);
const devicePaths = devices ? await devices.fetch() : [];
if (!devicePaths || devicePaths.length === 0) {
    console.error("No storage devices detected.");
    process.exit(1);
}

// Chat history to maintain context
const chatHistory: ChatMessage[] = [];

// Generate inspect prompt
const inspectPrompt = generateInspectPrompt({
    chatLanguage,
    isSendEmail,
    isColorTerminal,
});

// Log detected devices
console.info("Detected devices:", devicePaths);

// Inspect each device
for (const devicePath of devicePaths) {
    console.info(`\n=== Device: ${devicePath} ===\n`);
    try {
        const reply = await inspect({
            devicePath,
            chatHistory,
            chatModel,
            inspectPrompt,
        });
        console.info("SMART Analysis Result:", reply);
    } catch (error: any) {
        console.error(`Error reading SMART data for device ${devicePath}:`, error.message);
    }
}
