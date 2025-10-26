import {
    type ChatMessage,
} from "./chat.ts";

export interface GenerateInspectMessageParams {
    isSendEmail: boolean;
    isColorTerminal: boolean;
}

export const generateInspectSystemMessage = (params: GenerateInspectMessageParams): ChatMessage => {
    let prompt = 'Key Instructions:\n';

    if (params.isSendEmail) {
        prompt += '- Output in plain text format suitable for email. Do NOT use asterisks (*), underscores (_), backticks (`), or any markdown syntax. Use only line breaks, spaces, and basic punctuation for formatting.\n';
    } else {
        prompt += '- CRITICAL: Output must be pure plain text only. NEVER use asterisks (*), underscores (_), backticks (`), hash symbols (#), or any markdown formatting. Use only regular text with basic punctuation.\n';
    }

    if (params.isColorTerminal) {
        prompt += '- Make response in terminal style with colors if possible.\n';
    }

    prompt += `
    - Priority: Your analysis must first highlight any abnormal values in the "RED ALERT" and "YELLOW WARNING" sections.
    - At-a-Glance: The "Overall Health Status" and "AI Brief Analysis" must directly reflect these alerts, allowing the user to see problems at a glance.
    - Fill Data: You must replace all \`[AI_FILL_...]\` placeholders with the actual values or analysis you parse from the raw data.
    - Recommendations: Your "Recommended Actions" must be based on the potential issues you find, providing specific, actionable steps.

    ---
    <Template Start>
    S.M.A.R.T. Health Status Live Report
    1. Drive Basics
        Date Checked: [AI_FILL_DATE]
        Model: [AI_FILL_MODEL]
        Serial: [AI_FILL_SERIAL]
        Firmware: [AI_FILL_FIRMWARE]
        Capacity: [AI_FILL_CAPACITY]
    2. AI Full Analysis & Recommendations
        List of Potential Issues:
        [AI_FILL_ISSUES_LIST]
        Recommended Actions:
        [AI_FILL_RECOMMENDATIONS_LIST]
    3. Summary (At-a-Glance)
        Item: Overall Health Status, Status: [AI_FILL_STATUS: GOOD | WARNING | DANGER]
        Item: AI Brief Analysis, Status: [AI_FILL_SUMMARY_SENTENCE]
        Item: Temperature, Status: [AI_FILL_TEMP] °C (Sensor 1) / [AI_FILL_TEMP_2] (Sensor 2, if present)
    4. RED ALERT - Critical Errors
        Any value > 0 in this section indicates immediate drive failure or data risk.
        ID: 05, Attribute Name: Reallocated Sectors Count, Standard: Should be 0, Raw Value: [AI_FILL_05]
        ID: C5, Attribute Name: Current Pending Sector Count, Standard: Should be 0, Raw Value: [AI_FILL_C5]
        ID: C6, Attribute Name: Uncorrectable Sector Count, Standard: Should be 0, Raw Value: [AI_FILL_C6]
        ID: 01, Attribute Name: Read Error Rate, Standard: Should be 0 (or stable), Raw Value: [AI_FILL_01]
    5. YELLOW WARNING - Potential Issues
        Abnormal values in this section indicate risk or poor usage habits.
        Attribute Name: Unsafe Shutdowns, Status (Raw Value): [AI_FILL_UNSAFE_SHUTDOWNS], Notes: High value may lead to data corruption.
        Attribute Name: Percentage Used (SSD), Status (Raw Value): [AI_FILL_PERCENT_USED] %, Notes: 100% means the official TBW has been reached.
        Attribute Name: Available Spare, Status (Raw Value): [AI_FILL_SPARE] %, Notes: Nearing 0% means the drive is out of spare blocks.
        Attribute Name: Temperature, Status (Raw Value): [AI_FILL_TEMP] °C, Notes: Should remain below 70°C.
    6. INFO - Drive Vitals
        This section tracks drive usage and age.
        Attribute Name: Power-On Hours, Raw Value: [AI_FILL_POWER_ON_HOURS] hours
        Attribute Name: Power Cycle Count, Raw Value: [AI_FILL_POWER_CYCLES]
        Attribute Name: Total Host Writes, Raw Value: [AI_FILL_WRITES]
        Attribute Name: Total Host Reads, Raw Value: [AI_FILL_READS]
    </Template End>\n`

    prompt += `Analyze the following SMART data and provide insights or potential issues.\n`;

    return {
        role: "system",
        content: prompt.trim(),
    };
}

export interface GenerateInspectUserMessageParams {
    chatLanguage: string;
}

export const generateInspectUserMessage = (params: GenerateInspectUserMessageParams): ChatMessage => {
    return {
        role: "user",
        content: `Please analyze the above SMART data and provide insights or potential issues in ${params.chatLanguage}.`,
    };
}

export interface GenerateSummaryMessageParams {
    chatLanguage: string;
}

export const generateSummaryUserMessage = (params: GenerateSummaryMessageParams): ChatMessage => {
    return {
        role: "user",
        content: `Please provide a concise summary of the inspection reports above in ${params.chatLanguage}, highlighting any critical issues or recommendations.`,
    };
}
